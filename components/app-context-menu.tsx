"use client"

import * as React from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Copy, Scissors, ClipboardPaste, RefreshCw, Trash2 } from "lucide-react"

export function AppContextMenu({ children }: { children: React.ReactNode }) {
    const handleCopy = () => {
        document.execCommand('copy')
    }

    const handleCut = () => {
        document.execCommand('cut')
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            document.execCommand('insertText', false, text)
        } catch (err) {
            console.error('Failed to read clipboard contents', err)
        }
    }

    const handleReload = () => {
        window.location.reload()
    }

    const handleDelete = () => {
        document.execCommand('delete')
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger className="flex h-full w-full">
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 w-4 h-4 text-zinc-500" />
                    Copy
                    <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCut}>
                    <Scissors className="mr-2 w-4 h-4 text-zinc-500" />
                    Cut
                    <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onClick={handlePaste}>
                    <ClipboardPaste className="mr-2 w-4 h-4 text-zinc-500" />
                    Paste
                    <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem onClick={handleReload}>
                    <RefreshCw className="mr-2 w-4 h-4 text-zinc-500" />
                    Reload
                    <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuItem
                    onClick={handleDelete}
                    className="text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                >
                    <Trash2 className="mr-2 w-4 h-4 text-red-500" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
