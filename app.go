package main

import (
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"

	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	githubOwner        = "SXDIST"
	githubRepo         = "cfg-tools"
	updateEventName    = "app:update-available"
	preferencesFile    = "preferences.json"
	defaultLocale      = "en"
	appName            = "cfg-tools"
)

//go:embed package.json
var packageJSON []byte

type App struct {
	ctx        context.Context
	appVersion string
}

type preferences struct {
	Locale string `json:"locale"`
}

type githubAsset struct {
	Name               string `json:"name"`
	BrowserDownloadURL string `json:"browser_download_url"`
}

type githubRelease struct {
	TagName    string        `json:"tag_name"`
	Name       string        `json:"name"`
	Body       string        `json:"body"`
	HTMLURL    string        `json:"html_url"`
	Draft      bool          `json:"draft"`
	Prerelease bool          `json:"prerelease"`
	Assets     []githubAsset `json:"assets"`
}

type updateInfo struct {
	CurrentVersion string `json:"currentVersion"`
	LatestVersion  string `json:"latestVersion"`
	Title          string `json:"title"`
	Notes          string `json:"notes"`
	URL            string `json:"url"`
	InstallerURL   string `json:"installerUrl,omitempty"`
}

func NewApp() *App {
	return &App{
		appVersion: readPackageVersion(),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ReadTextFile(filePath string) (string, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	return string(content), nil
}

func (a *App) CheckForUpdates() error {
	release, err := fetchLatestRelease(a.appVersion)
	if err != nil || release == nil {
		return nil
	}

	latestVersion := normalizeVersion(release.TagName)
	if latestVersion == "" || !isVersionNewer(latestVersion, a.appVersion) {
		return nil
	}

	payload := updateInfo{
		CurrentVersion: a.appVersion,
		LatestVersion:  latestVersion,
		Title:          firstNonEmpty(release.Name, release.TagName, "New release"),
		Notes:          strings.TrimSpace(release.Body),
		URL:            pickReleaseURL(release),
		InstallerURL:   pickWindowsInstallerURL(release),
	}

	if a.ctx != nil {
		wruntime.EventsEmit(a.ctx, updateEventName, payload)
	}

	return nil
}

func (a *App) GetStoredLocale() string {
	return readStoredLocale()
}

func (a *App) SetStoredLocale(locale string) (string, error) {
	nextLocale := sanitizeLocale(locale)
	if err := writeStoredLocale(nextLocale); err != nil {
		return "", err
	}

	return nextLocale, nil
}

func (a *App) OpenExternal(rawURL string) error {
	trimmed := strings.TrimSpace(rawURL)
	if trimmed == "" || a.ctx == nil {
		return nil
	}

	wruntime.BrowserOpenURL(a.ctx, trimmed)
	return nil
}

func (a *App) InstallOrOpenUpdate(info updateInfo) error {
	releaseURL := strings.TrimSpace(info.URL)
	installerURL := strings.TrimSpace(info.InstallerURL)
	latestVersion := normalizeVersion(info.LatestVersion)

	if runtime.GOOS != "windows" || installerURL == "" {
		return a.OpenExternal(releaseURL)
	}

	targetPath, err := downloadInstaller(installerURL, latestVersion, a.appVersion)
	if err != nil {
		return a.OpenExternal(releaseURL)
	}

	cmd := exec.Command(targetPath)
	if err := cmd.Start(); err != nil {
		return a.OpenExternal(releaseURL)
	}

	if a.ctx != nil {
		wruntime.Quit(a.ctx)
	}

	return nil
}

func readPackageVersion() string {
	var pkg struct {
		Version string `json:"version"`
	}

	if err := json.Unmarshal(packageJSON, &pkg); err != nil {
		return "0.0.0"
	}

	version := normalizeVersion(pkg.Version)
	if version == "" {
		return "0.0.0"
	}

	return version
}

func preferencesPath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(configDir, appName, preferencesFile), nil
}

func readPreferences() preferences {
	path, err := preferencesPath()
	if err != nil {
		return preferences{}
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		return preferences{}
	}

	var parsed preferences
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return preferences{}
	}

	return parsed
}

func readStoredLocale() string {
	return sanitizeLocale(readPreferences().Locale)
}

func writeStoredLocale(locale string) error {
	path, err := preferencesPath()
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}

	content, err := json.MarshalIndent(preferences{Locale: sanitizeLocale(locale)}, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, content, 0o644)
}

func sanitizeLocale(locale string) string {
	if locale == "ru" {
		return "ru"
	}

	return defaultLocale
}

func fetchLatestRelease(appVersion string) (*githubRelease, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", githubOwner, githubRepo),
		nil,
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", fmt.Sprintf("%s/%s", githubRepo, appVersion))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("GitHub returned status %d", resp.StatusCode)
	}

	var release githubRelease
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return nil, err
	}

	if release.Draft || release.Prerelease {
		return nil, nil
	}

	return &release, nil
}

func normalizeVersion(version string) string {
	return strings.TrimPrefix(strings.TrimSpace(strings.TrimPrefix(version, "v")), "V")
}

func parseVersionParts(version string) []int {
	normalized := normalizeVersion(version)
	if normalized == "" {
		return nil
	}

	parts := strings.Split(normalized, ".")
	result := make([]int, 0, len(parts))
	for _, part := range parts {
		numeric := strings.Builder{}
		for _, char := range part {
			if char < '0' || char > '9' {
				break
			}
			numeric.WriteRune(char)
		}

		value, err := strconv.Atoi(firstNonEmpty(numeric.String(), "0"))
		if err != nil {
			value = 0
		}

		result = append(result, value)
	}

	return result
}

func isVersionNewer(candidate string, current string) bool {
	candidateParts := parseVersionParts(candidate)
	currentParts := parseVersionParts(current)
	maxLength := len(candidateParts)
	if len(currentParts) > maxLength {
		maxLength = len(currentParts)
	}

	for index := 0; index < maxLength; index++ {
		candidatePart := 0
		if index < len(candidateParts) {
			candidatePart = candidateParts[index]
		}

		currentPart := 0
		if index < len(currentParts) {
			currentPart = currentParts[index]
		}

		if candidatePart > currentPart {
			return true
		}
		if candidatePart < currentPart {
			return false
		}
	}

	return false
}

func pickReleaseURL(release *githubRelease) string {
	if release == nil {
		return ""
	}

	for _, target := range releaseAssetTargets() {
		for _, asset := range release.Assets {
			assetName := strings.ToLower(asset.Name)
			if strings.Contains(assetName, target) && asset.BrowserDownloadURL != "" {
				return asset.BrowserDownloadURL
			}
		}
	}

	if strings.TrimSpace(release.HTMLURL) != "" {
		return release.HTMLURL
	}

	for _, asset := range release.Assets {
		if asset.BrowserDownloadURL != "" {
			return asset.BrowserDownloadURL
		}
	}

	return ""
}

func pickWindowsInstallerURL(release *githubRelease) string {
	if release == nil {
		return ""
	}

	for _, asset := range release.Assets {
		assetName := strings.ToLower(asset.Name)
		if asset.BrowserDownloadURL == "" {
			continue
		}

		if strings.HasSuffix(assetName, ".exe") && (strings.Contains(assetName, "setup") || strings.Contains(assetName, "nsis")) {
			return asset.BrowserDownloadURL
		}
	}

	return ""
}

func releaseAssetTargets() []string {
	switch runtime.GOOS {
	case "windows":
		return []string{"windows-amd64", "windows_x64", "win64", ".exe", ".msi", ".zip"}
	case "darwin":
		return []string{"darwin-arm64", "darwin-amd64", "macos", ".dmg", ".pkg", ".zip"}
	default:
		return []string{"linux-amd64", "linux-arm64", ".appimage", ".deb", ".rpm", ".tar.gz", ".zip"}
	}
}

func downloadInstaller(installerURL string, latestVersion string, appVersion string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, installerURL, nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("Accept", "application/octet-stream,application/vnd.github+json")
	req.Header.Set("User-Agent", fmt.Sprintf("%s/%s", githubRepo, appVersion))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("download failed with status %d", resp.StatusCode)
	}

	parsedURL, err := url.Parse(installerURL)
	if err != nil {
		return "", err
	}

	fileName := filepath.Base(parsedURL.Path)
	if fileName == "." || fileName == "/" || fileName == "" {
		fileName = "cfg-tools-setup.exe"
		if latestVersion != "" {
			fileName = fmt.Sprintf("cfg-tools-setup-%s.exe", latestVersion)
		}
	}

	targetPath := filepath.Join(os.TempDir(), fileName)
	output, err := os.Create(targetPath)
	if err != nil {
		return "", err
	}
	defer output.Close()

	if _, err := output.ReadFrom(resp.Body); err != nil {
		return "", err
	}

	return targetPath, nil
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}

	return ""
}
