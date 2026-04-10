"use client"

import * as React from "react"
import { ClipboardPaste, Copy, RefreshCw, Scissors, Trash2 } from "lucide-react"

type EditableElement = HTMLInputElement | HTMLTextAreaElement

type SavedSelection =
    | {
        type: "editable"
        element: EditableElement
        start: number
        end: number
        direction: "forward" | "backward" | "none"
    }
    | {
        type: "document"
        activeElement: HTMLElement | null
        ranges: Range[]
    }

type MenuPosition = {
    x: number
    y: number
}

const MENU_WIDTH = 208
const MENU_HEIGHT = 198
const MENU_OFFSET = 8

type ContextMenuChild = React.ReactElement<React.HTMLAttributes<HTMLElement>>

export function AppContextMenu({ children }: { children: ContextMenuChild }) {
    const [position, setPosition] = React.useState<MenuPosition | null>(null)
    const savedSelectionRef = React.useRef<SavedSelection | null>(null)

    const saveSelection = React.useCallback((target?: EventTarget | null) => {
        const editableTarget = getEditableElement(target)
        const activeEditable = getEditableElement(document.activeElement)
        const editable = editableTarget ?? activeEditable

        if (
            editable &&
            typeof editable.selectionStart === "number" &&
            typeof editable.selectionEnd === "number"
        ) {
            savedSelectionRef.current = {
                type: "editable",
                element: editable,
                start: editable.selectionStart,
                end: editable.selectionEnd,
                direction: editable.selectionDirection ?? "none",
            }
            return
        }

        const selection = window.getSelection()

        if (!selection || selection.rangeCount === 0) {
            savedSelectionRef.current = null
            return
        }

        savedSelectionRef.current = {
            type: "document",
            activeElement: document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null,
            ranges: Array.from({ length: selection.rangeCount }, (_, index) =>
                selection.getRangeAt(index).cloneRange(),
            ),
        }
    }, [])

    const restoreSelection = React.useCallback(() => {
        const savedSelection = savedSelectionRef.current

        if (!savedSelection) {
            return
        }

        if (savedSelection.type === "editable") {
            if (!savedSelection.element.isConnected) {
                return
            }

            savedSelection.element.focus({ preventScroll: true })
            savedSelection.element.setSelectionRange(
                savedSelection.start,
                savedSelection.end,
                savedSelection.direction,
            )
            return
        }

        const selection = window.getSelection()

        if (!selection) {
            return
        }

        savedSelection.activeElement?.focus({ preventScroll: true })
        selection.removeAllRanges()

        for (const range of savedSelection.ranges) {
            selection.addRange(range)
        }
    }, [])

    const closeMenu = React.useCallback(() => {
        setPosition(null)
        restoreSelection()
    }, [restoreSelection])

    React.useEffect(() => {
        if (!position) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMenu()
            }
        }

        const handleWindowChange = () => closeMenu()

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("resize", handleWindowChange)
        window.addEventListener("scroll", handleWindowChange, true)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("resize", handleWindowChange)
            window.removeEventListener("scroll", handleWindowChange, true)
        }
    }, [closeMenu, position])

    const runWithRestoredSelection = React.useCallback((callback: () => void) => {
        restoreSelection()
        callback()
        setPosition(null)
    }, [restoreSelection])

    const handleCopy = () => {
        runWithRestoredSelection(() => document.execCommand("copy"))
    }

    const handleCut = () => {
        runWithRestoredSelection(() => document.execCommand("cut"))
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            runWithRestoredSelection(() =>
                document.execCommand("insertText", false, text),
            )
        } catch (err) {
            console.error("Failed to read clipboard contents", err)
        }
    }

    const handleReload = () => {
        window.location.reload()
    }

    const handleDelete = () => {
        runWithRestoredSelection(() => document.execCommand("delete"))
    }

    const child = React.cloneElement(children, {
        onPointerDownCapture: (event: React.PointerEvent<HTMLElement>) => {
            if (event.button !== 2) {
                return
            }

            saveSelection(event.target)
            event.preventDefault()
        },
        onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault()
            saveSelection(event.target)
            setPosition(getMenuPosition(event.clientX, event.clientY))
            window.requestAnimationFrame(restoreSelection)
        },
    })

    return (
        <>
            {child}
            {position && (
                <>
                    <button
                        aria-label="Close context menu"
                        className="fixed inset-0 z-40 cursor-default bg-transparent"
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault()
                            closeMenu()
                        }}
                    />
                    <div
                        className="fixed z-50 w-52 origin-top-left animate-in rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-md fade-in-0 zoom-in-95"
                        style={{
                            left: position.x,
                            top: position.y,
                        }}
                        onContextMenu={(event) => event.preventDefault()}
                        onMouseDown={(event) => event.preventDefault()}
                        onPointerDown={(event) => event.preventDefault()}
                    >
                        <ContextMenuButton
                            icon={<Copy className="h-4 w-4 text-zinc-400" />}
                            label="Copy"
                            shortcut="Ctrl+C"
                            onClick={handleCopy}
                        />
                        <ContextMenuButton
                            icon={<Scissors className="h-4 w-4 text-zinc-400" />}
                            label="Cut"
                            shortcut="Ctrl+X"
                            onClick={handleCut}
                        />
                        <ContextMenuButton
                            icon={<ClipboardPaste className="h-4 w-4 text-zinc-400" />}
                            label="Paste"
                            shortcut="Ctrl+V"
                            onClick={handlePaste}
                        />

                        <div className="-mx-1 my-1 h-px bg-border" />

                        <ContextMenuButton
                            icon={<RefreshCw className="h-4 w-4 text-zinc-400" />}
                            label="Reload"
                            shortcut="Ctrl+R"
                            onClick={handleReload}
                        />
                        <ContextMenuButton
                            destructive
                            icon={<Trash2 className="h-4 w-4 text-red-400" />}
                            label="Delete"
                            onClick={handleDelete}
                        />
                    </div>
                </>
            )}
        </>
    )
}

function ContextMenuButton({
    destructive = false,
    icon,
    label,
    onClick,
    shortcut,
}: {
    destructive?: boolean
    icon: React.ReactNode
    label: string
    onClick: () => void
    shortcut?: string
}) {
    return (
        <button
            className={
                destructive
                    ? "flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-red-500 outline-hidden transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                    : "flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground"
            }
            onClick={onClick}
            type="button"
        >
            {icon}
            <span>{label}</span>
            {shortcut && (
                <span className="ml-auto text-xs tracking-widest text-zinc-500">
                    {shortcut}
                </span>
            )}
        </button>
    )
}

function getMenuPosition(clientX: number, clientY: number) {
    return {
        x: Math.min(clientX, window.innerWidth - MENU_WIDTH - MENU_OFFSET),
        y: Math.min(clientY, window.innerHeight - MENU_HEIGHT - MENU_OFFSET),
    }
}

function getEditableElement(target?: EventTarget | null): EditableElement | null {
    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
    ) {
        return target
    }

    if (target instanceof HTMLElement) {
        const editable = target.closest("input, textarea")

        if (
            editable instanceof HTMLInputElement ||
            editable instanceof HTMLTextAreaElement
        ) {
            return editable
        }
    }

    return null
}
