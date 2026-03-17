package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	goruntime "runtime"

	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type githubReleaseAsset struct {
	Name               string `json:"name"`
	BrowserDownloadURL string `json:"browser_download_url"`
}

type githubRelease struct {
	TagName    string               `json:"tag_name"`
	Name       string               `json:"name"`
	Body       string               `json:"body"`
	HTMLURL    string               `json:"html_url"`
	Prerelease bool                 `json:"prerelease"`
	Draft      bool                 `json:"draft"`
	Assets     []githubReleaseAsset `json:"assets"`
}

type updatePayload struct {
	CurrentVersion string `json:"currentVersion"`
	LatestVersion  string `json:"latestVersion"`
	Title          string `json:"title"`
	Notes          string `json:"notes"`
	URL            string `json:"url"`
}

func (a *App) checkForUpdates() {
	if a.ctx == nil {
		return
	}

	release, err := fetchLatestRelease(a.ctx)
	if err != nil || release == nil {
		return
	}

	latestVersion := normalizeVersion(release.TagName)
	if latestVersion == "" || !isVersionNewer(latestVersion, AppVersion) {
		return
	}

	payload := updatePayload{
		CurrentVersion: AppVersion,
		LatestVersion:  latestVersion,
		Title:          firstNonEmpty(release.Name, release.TagName, "New release"),
		Notes:          strings.TrimSpace(release.Body),
		URL:            pickReleaseURL(release),
	}

	wruntime.EventsEmit(a.ctx, UpdateEventName, payload)
}

func (a *App) CheckForUpdates() {
	go a.checkForUpdates()
}

func fetchLatestRelease(parent context.Context) (*githubRelease, error) {
	ctx, cancel := context.WithTimeout(parent, 5*time.Second)
	defer cancel()

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", GitHubOwner, GitHubRepo)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", fmt.Sprintf("%s/%s", GitHubRepo, AppVersion))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("github returned status %d", resp.StatusCode)
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

func pickReleaseURL(release *githubRelease) string {
	if release == nil {
		return ""
	}

	targets := releaseAssetTargets()
	for _, target := range targets {
		for _, asset := range release.Assets {
			name := strings.ToLower(asset.Name)
			if strings.Contains(name, target) && asset.BrowserDownloadURL != "" {
				return asset.BrowserDownloadURL
			}
		}
	}

	if release.HTMLURL != "" {
		return release.HTMLURL
	}

	for _, asset := range release.Assets {
		if asset.BrowserDownloadURL != "" {
			return asset.BrowserDownloadURL
		}
	}

	return ""
}

func releaseAssetTargets() []string {
	switch goruntime.GOOS {
	case "windows":
		return []string{"windows-amd64", "windows_x64", "win64", "x64", ".exe", ".msi", ".zip"}
	case "darwin":
		return []string{"darwin-arm64", "darwin-amd64", "macos", ".dmg", ".pkg", ".zip"}
	default:
		return []string{"linux-amd64", "linux-arm64", ".appimage", ".deb", ".rpm", ".tar.gz", ".zip"}
	}
}

func normalizeVersion(version string) string {
	return strings.TrimPrefix(strings.TrimSpace(version), "v")
}

func isVersionNewer(candidate string, current string) bool {
	candidateParts := parseVersionParts(candidate)
	currentParts := parseVersionParts(current)
	maxLen := len(candidateParts)
	if len(currentParts) > maxLen {
		maxLen = len(currentParts)
	}

	for i := 0; i < maxLen; i++ {
		var candidatePart int
		var currentPart int

		if i < len(candidateParts) {
			candidatePart = candidateParts[i]
		}
		if i < len(currentParts) {
			currentPart = currentParts[i]
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

func parseVersionParts(version string) []int {
	normalized := normalizeVersion(version)
	if normalized == "" {
		return nil
	}

	rawParts := strings.Split(normalized, ".")
	parts := make([]int, 0, len(rawParts))
	for _, rawPart := range rawParts {
		value := 0
		for _, char := range rawPart {
			if char < '0' || char > '9' {
				break
			}
			value = value*10 + int(char-'0')
		}
		parts = append(parts, value)
	}

	return parts
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}
