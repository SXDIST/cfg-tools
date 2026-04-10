//go:build windows

package main

import (
	"syscall"
	"unsafe"
)

const windowsAppUserModelID = "SXDIST.cfg-tools"

var (
	shell32                                 = syscall.NewLazyDLL("shell32.dll")
	setCurrentProcessExplicitAppUserModelID = shell32.NewProc("SetCurrentProcessExplicitAppUserModelID")
)

func configureAppIdentity() {
	appID, err := syscall.UTF16PtrFromString(windowsAppUserModelID)
	if err != nil {
		return
	}

	_, _, _ = setCurrentProcessExplicitAppUserModelID.Call(
		uintptr(unsafe.Pointer(appID)),
	)
}
