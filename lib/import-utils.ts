type ImportFromCpp = (cppText: string, fallbackName?: string) => { success: boolean; error?: string };

export function getFallbackProjectName(fileName: string): string {
    const nameWithoutExtension = fileName.replace(/\.cpp$/i, '');
    const normalized = nameWithoutExtension
        .replace(/_config$/i, '')
        .replace(/[^a-zA-Z0-9_\- ]/g, ' ')
        .trim();

    return normalized || 'Imported Project';
}

export function importFromCppText(importFn: ImportFromCpp, cppText: string, sourceName: string) {
    const fallbackName = getFallbackProjectName(sourceName);
    return importFn(cppText, fallbackName);
}