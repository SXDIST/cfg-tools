package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:out
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:                  "cfg-tools",
		Width:                  1280,
		Height:                 720,
		MinWidth:               1100,
		MinHeight:              680,
		DisableResize:          false,
		Frameless:              false,
		AssetServer:            &assetserver.Options{Assets: assets},
		BackgroundColour:       &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		EnableDefaultContextMenu: true,
		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop:     true,
			DisableWebViewDrop: true,
		},
		OnStartup:              app.startup,
		OnDomReady:             app.domReady,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			DisableWindowIcon:    false,
		},
		Linux: &linux.Options{
			ProgramName: "cfg-tools",
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
