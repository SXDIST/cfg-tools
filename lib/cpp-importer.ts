import { CATALOG, type ParamDef } from './catalog';
import type { CustomParamData, CustomParamType } from './store';

export interface ImportedChildClass {
    name: string;
    scope: number;
    hiddenSelectionsTextures: string[];
    hiddenSelectionsMaterials: string[];
    visibilityModifier?: number;
}

export interface ImportedMainClass {
    className: string;
    baseClass: string;
    enabledParams: Record<string, boolean>;
    values: Record<string, unknown>;
    children: ImportedChildClass[];
    customParams: Omit<CustomParamData, 'id'>[];
}

export interface ImportedSlot {
    slotName: string;
    displayName: string;
    ghostIconSet: string;
    ghostIconImage: string;
}

export interface ImportedProxy {
    proxyName: string;
    inventorySlots: string[];
}

export interface ImportedConfig {
    name: string;
    requiredAddons: string[];
    classes: ImportedMainClass[];
    slots: ImportedSlot[];
    proxies: ImportedProxy[];
}

interface ParsedClass {
    name: string;
    baseClass?: string;
    declarationOnly: boolean;
    node?: ParsedNode;
}

interface ParsedNode {
    props: string[];
    classes: ParsedClass[];
}

const PARAMS = CATALOG.flatMap((category) => category.params);
const KNOWN_PARAM_KEYS = new Set(PARAMS.map((param) => param.key));
const NORMALIZED_PARAM_KEYS = new Map(
    PARAMS.map((param) => [normalizeKey(param.key), param.key]),
);
const PARAM_ALIASES = new Map<string, string>([
    ['displayname', 'displayName'],
    ['descriptionshort', 'descriptionShort'],
    ['iteminfos', 'itemInfo'],
    ['iteminfocategories', 'itemInfo'],
    ['hiddenselection', 'hiddenSelections'],
    ['hiddenselections', 'hiddenSelections'],
    ['hiddenselectiontexture', 'hiddenSelectionsTextures'],
    ['hiddenselectiontextures', 'hiddenSelectionsTextures'],
    ['hiddenselectionmaterial', 'hiddenSelectionsMaterials'],
    ['hiddenselectionmaterials', 'hiddenSelectionsMaterials'],
    ['inventoryslots', 'inventorySlot'],
    ['quickbarbonus', 'quickBarBonus'],
    ['repairablewithkit', 'repairableWithKits'],
    ['repairablewithkits', 'repairableWithKits'],
    ['repaircost', 'repairCosts'],
    ['repaircosts', 'repairCosts'],
    ['varwetmax', 'varWetMax'],
    ['heatisolation', 'heatIsolation'],
    ['visibilitymodifier', 'visibilityModifier'],
    ['soundimpacttype', 'soundImpactType'],
    ['soundvoicetype', 'soundVoiceType'],
    ['soundvoicepriority', 'soundVoicePriority'],
    ['pickupsoundset', 'pickUpSoundSet'],
    ['dropsoundset', 'dropSoundSet'],
    ['healthlevel', 'healthLevels'],
    ['healthlevels', 'healthLevels'],
]);

function createDefaultValues(): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};
    PARAMS.forEach((param) => {
        defaults[param.key] = param.defaultValue;
    });
    return defaults;
}

function stripComments(input: string): string {
    return input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
}

function normalizeKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function resolveParamKey(key: string): string {
    const trimmed = key.trim();
    if (KNOWN_PARAM_KEYS.has(trimmed)) return trimmed;

    const normalized = normalizeKey(trimmed);
    const aliasMatch = PARAM_ALIASES.get(normalized);
    if (aliasMatch) return aliasMatch;

    return NORMALIZED_PARAM_KEYS.get(normalized) || trimmed;
}

function repairClassDeclarations(input: string): string {
    return input.replace(
        /(class\s+[A-Za-z0-9_]+\s*(?::\s*[A-Za-z0-9_]+)?)(\s*\n)(\s*)(?![;{])/g,
        (_match, declaration: string, lineBreak: string, indentation: string) => `${declaration}${lineBreak}${indentation}{${lineBreak}${indentation}`,
    );
}

function balanceBraces(input: string): string {
    let result = '';
    let depth = 0;
    let inString = false;

    for (let cursor = 0; cursor < input.length; cursor += 1) {
        const char = input[cursor];
        const prevChar = cursor > 0 ? input[cursor - 1] : '';

        if (char === '"' && prevChar !== '\\') {
            inString = !inString;
            result += char;
            continue;
        }

        if (!inString) {
            if (char === '{') {
                depth += 1;
                result += char;
                continue;
            }

            if (char === '}') {
                if (depth === 0) {
                    continue;
                }
                depth -= 1;
                result += char;
                continue;
            }
        }

        result += char;
    }

    if (depth > 0) {
        result += `\n${'}'.repeat(depth)}`;
    }

    return result;
}

function repairCommonConfigIssues(input: string): string {
    const normalized = input
        .replace(/\r\n?/g, '\n')
        .replace(/[“”„‟]/g, '"')
        .replace(/[‘’‚‛]/g, "'")
        .replace(/\t/g, '    ');

    return balanceBraces(repairClassDeclarations(normalized));
}

function isIdentifierChar(char: string): boolean {
    return /[A-Za-z0-9_]/.test(char);
}

function skipWhitespace(text: string, from: number): number {
    let cursor = from;
    while (cursor < text.length && /\s/.test(text[cursor])) {
        cursor += 1;
    }
    return cursor;
}

function readIdentifier(text: string, from: number): { value: string; next: number } {
    let cursor = skipWhitespace(text, from);
    const start = cursor;
    while (cursor < text.length && isIdentifierChar(text[cursor])) {
        cursor += 1;
    }
    return {
        value: text.slice(start, cursor),
        next: cursor,
    };
}

function readStatement(text: string, from: number): { statement: string; next: number } {
    let cursor = from;
    let braceDepth = 0;
    let inString = false;

    while (cursor < text.length) {
        const char = text[cursor];
        const prevChar = cursor > 0 ? text[cursor - 1] : '';

        if (char === '"' && prevChar !== '\\') {
            inString = !inString;
            cursor += 1;
            continue;
        }

        if (!inString) {
            if (char === '{') braceDepth += 1;
            if (char === '}') braceDepth = Math.max(0, braceDepth - 1);
            if (char === ';' && braceDepth === 0) {
                const statement = text.slice(from, cursor + 1).trim();
                return { statement, next: cursor + 1 };
            }

            if (char === '\n' && braceDepth === 0) {
                const statement = text.slice(from, cursor).trim();
                if (statement) {
                    const next = skipWhitespace(text, cursor + 1);
                    const nextSlice = text.slice(next, next + 5);
                    const nextChar = text[next];
                    const endsLikeValue = /["'\]\}0-9A-Za-z_]$/.test(statement);
                    const nextStartsBoundary =
                        next >= text.length ||
                        nextChar === '}' ||
                        nextSlice === 'class' ||
                        /[A-Za-z_]/.test(nextChar || '');

                    if (endsLikeValue && nextStartsBoundary) {
                        return { statement: `${statement};`, next: cursor + 1 };
                    }
                }
            }
        }

        cursor += 1;
    }

    const statement = text.slice(from).trim();
    if (statement) {
        return { statement: statement.endsWith(';') ? statement : `${statement};`, next: text.length };
    }

    throw new Error('Незавершенное выражение в config.cpp');
}

function readBalancedBlock(text: string, fromOpenBrace: number): { body: string; next: number } {
    if (text[fromOpenBrace] !== '{') {
        throw new Error('Ожидалась открывающая фигурная скобка');
    }

    let cursor = fromOpenBrace + 1;
    let depth = 1;
    let inString = false;

    while (cursor < text.length) {
        const char = text[cursor];
        const prevChar = cursor > 0 ? text[cursor - 1] : '';

        if (char === '"' && prevChar !== '\\') {
            inString = !inString;
            cursor += 1;
            continue;
        }

        if (!inString) {
            if (char === '{') depth += 1;
            if (char === '}') {
                depth -= 1;
                if (depth === 0) {
                    return {
                        body: text.slice(fromOpenBrace + 1, cursor),
                        next: cursor + 1,
                    };
                }
            }
        }

        cursor += 1;
    }

    throw new Error('Незавершенный блок class {...}');
}

function parseNode(text: string): ParsedNode {
    const props: string[] = [];
    const classes: ParsedClass[] = [];

    let cursor = 0;
    while (cursor < text.length) {
        cursor = skipWhitespace(text, cursor);
        if (cursor >= text.length) break;

        if (text.slice(cursor, cursor + 5) === 'class' && /\s/.test(text[cursor + 5] || '')) {
            cursor += 5;
            const nameRead = readIdentifier(text, cursor);
            const className = nameRead.value;
            if (!className) {
                throw new Error('Не удалось прочитать имя класса');
            }

            cursor = skipWhitespace(text, nameRead.next);
            let baseClass: string | undefined;
            if (text[cursor] === ':') {
                const baseRead = readIdentifier(text, cursor + 1);
                baseClass = baseRead.value;
                cursor = skipWhitespace(text, baseRead.next);
            }

            if (text[cursor] === ';') {
                classes.push({
                    name: className,
                    baseClass,
                    declarationOnly: true,
                });
                cursor += 1;
                continue;
            }

            if (text[cursor] !== '{') {
                throw new Error(`Некорректный синтаксис class ${className}`);
            }

            const block = readBalancedBlock(text, cursor);
            cursor = skipWhitespace(text, block.next);
            if (text[cursor] === ';') {
                cursor += 1;
            }

            classes.push({
                name: className,
                baseClass,
                declarationOnly: false,
                node: parseNode(block.body),
            });
            continue;
        }

        const statement = readStatement(text, cursor);
        if (statement.statement) {
            props.push(statement.statement);
        }
        cursor = statement.next;
    }

    return { props, classes };
}

function findClass(node: ParsedNode, className: string): ParsedClass | undefined {
    return node.classes.find((item) => item.name === className && !item.declarationOnly);
}

function findChildNode(node: ParsedNode, name: string): ParsedNode | undefined {
    const child = node.classes.find((item) => item.name === name && !item.declarationOnly);
    return child?.node;
}

function findNodeByPlacement(root: ParsedNode, placement?: string): ParsedNode | undefined {
    if (!placement || placement === 'root') return root;

    const parts = placement.split('.');
    let current: ParsedNode | undefined = root;

    for (const part of parts) {
        if (!current) return undefined;
        current = findChildNode(current, part);
    }

    return current;
}

function parseQuotedStrings(input: string): string[] {
    const values: string[] = [];
    const regex = /"((?:\\.|[^"\\])*)"/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(input)) !== null) {
        values.push(match[1].replace(/\\"/g, '"'));
    }
    return values;
}

function parseNumericList(input: string): number[] {
    const trimmed = input.trim();
    const body = trimmed.startsWith('{') && trimmed.endsWith('}')
        ? trimmed.slice(1, -1)
        : trimmed;
    return body
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((item) => !Number.isNaN(item));
}

function parsePrimitiveValue(rawValue: string, param: ParamDef): unknown {
    const value = rawValue.trim();

    if (param.type === 'string' || param.type === 'combobox') {
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1).replace(/\\"/g, '"');
        }
        return value;
    }

    if (param.type === 'multi-select') {
        if (value.startsWith('{') && value.endsWith('}')) {
            return parseQuotedStrings(value);
        }
        if (value.startsWith('"') && value.endsWith('"')) {
            return [value.slice(1, -1)];
        }
        return value ? [value] : [];
    }

    if (param.type === 'number') {
        const numeric = Number(value);
        return Number.isNaN(numeric) ? param.defaultValue : numeric;
    }

    if (param.type === 'boolean') {
        return value === '1' || value.toLowerCase() === 'true';
    }

    if (param.type === 'select') {
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }
        const maybeNumber = Number(value);
        return Number.isNaN(maybeNumber) ? value : maybeNumber;
    }

    if (param.type === 'array_of_strings') {
        if (value.startsWith('{') && value.endsWith('}')) {
            return parseQuotedStrings(value);
        }
        if (value.startsWith('"') && value.endsWith('"')) {
            return [value.slice(1, -1)];
        }
        return [];
    }

    if (param.type === 'array_of_numbers') {
        if (value.startsWith('{') && value.endsWith('}')) {
            return parseNumericList(value);
        }
        const numeric = Number(value);
        return Number.isNaN(numeric) ? [] : [numeric];
    }

    return param.defaultValue;
}

function parsePropertyLine(prop: string): { key: string; isArray: boolean; value: string } | null {
    const trimmed = prop.trim().replace(/;$/, '');
    const match = /^([A-Za-z0-9_]+)(\[\])?\s*=\s*([\s\S]+)$/.exec(trimmed);
    if (!match) return null;

    return {
        key: resolveParamKey(match[1]),
        isArray: Boolean(match[2]),
        value: match[3].trim(),
    };
}

function inferCustomParamType(value: string, isArray: boolean): CustomParamType {
    if (isArray) {
        const items = value.trim().replace(/^\{|\}$/g, '').split(',').map((item) => item.trim()).filter(Boolean);
        const isNumericArray = items.length > 0 && items.every((item) => /^-?\d+(?:\.\d+)?$/.test(item));
        return isNumericArray ? 'array_of_numbers' : 'array_of_strings';
    }

    if (/^(?:0|1|true|false)$/i.test(value)) {
        return 'boolean';
    }

    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
        return 'number';
    }

    return 'string';
}

function parseCustomParamValue(value: string, type: CustomParamType): unknown {
    const tempParam = {
        key: '__custom__',
        label: '__custom__',
        description: '',
        type,
        defaultValue:
            type === 'boolean' ? false :
            type === 'number' ? 0 :
            type === 'array_of_strings' || type === 'array_of_numbers' ? [] :
            '',
    } satisfies ParamDef;

    return parsePrimitiveValue(value, tempParam);
}

function collectCustomParams(node: ParsedNode, placement = 'root'): Omit<CustomParamData, 'id'>[] {
    const customParams: Omit<CustomParamData, 'id'>[] = [];

    node.props.forEach((prop) => {
        const parsed = parsePropertyLine(prop);
        if (!parsed) return;
        if (KNOWN_PARAM_KEYS.has(parsed.key)) return;
        if (parsed.key === 'soundSet' || parsed.key === 'id' || parsed.key === 'damage') return;
        if (parsed.key === 'healthLevels') return;

        const type = inferCustomParamType(parsed.value, parsed.isArray);
        customParams.push({
            key: parsed.key,
            type,
            placement,
            value: parseCustomParamValue(parsed.value, type),
        });
    });

    node.classes
        .filter((child) => !child.declarationOnly && child.node)
        .forEach((child) => {
            const nextPlacement = placement === 'root' ? child.name : `${placement}.${child.name}`;
            customParams.push(...collectCustomParams(child.node!, nextPlacement));
        });

    return customParams;
}

function getPropertyValue(node: ParsedNode, key: string): { isArray: boolean; value: string } | null {
    for (const prop of node.props) {
        const parsed = parsePropertyLine(prop);
        if (!parsed) continue;
        if (parsed.key === key) {
            return { isArray: parsed.isArray, value: parsed.value };
        }
    }

    return null;
}

function parseArmorModifier(root: ParsedNode, placement?: string): { Health: number; Blood: number; Shock: number } | null {
    const baseNode = findNodeByPlacement(root, placement);
    if (!baseNode) return null;

    const readDamage = (name: string) => {
        const node = findChildNode(baseNode, name);
        if (!node) return 1;
        const line = node.props.find((prop) => prop.trim().startsWith('damage'));
        if (!line) return 1;
        const value = Number(line.split('=')[1]?.replace(';', '').trim());
        return Number.isNaN(value) ? 1 : value;
    };

    return {
        Health: readDamage('Health'),
        Blood: readDamage('Blood'),
        Shock: readDamage('Shock'),
    };
}

function parseAnimEvent(root: ParsedNode, placement?: string): { soundSet: string; id: number } | null {
    const node = findNodeByPlacement(root, placement);
    if (!node) return null;

    const soundSetProp = getPropertyValue(node, 'soundSet');
    const idProp = getPropertyValue(node, 'id');
    if (!soundSetProp || !idProp) return null;

    const soundSet = soundSetProp.value.replace(/^"|"$/g, '');
    const id = Number(idProp.value);
    if (!soundSet || Number.isNaN(id)) return null;

    return { soundSet, id };
}

function parseHealthLevels(root: ParsedNode, placement?: string): string[] | null {
    const node = findNodeByPlacement(root, placement);
    if (!node) return null;

    const healthLevelsProp = node.props.find((prop) => prop.trim().startsWith('healthLevels[]'));
    if (!healthLevelsProp) return null;

    const pristineLine = /\{\s*1(?:\.0+)?\s*,\s*\{([\s\S]*?)\}\s*\}/m.exec(healthLevelsProp);
    if (!pristineLine) return null;

    return parseQuotedStrings(`{${pristineLine[1]}}`);
}

function parseRequiredAddons(cfgPatchesNode: ParsedNode): string[] {
    const patchClass = cfgPatchesNode.classes.find((item) => !item.declarationOnly && item.node);
    if (!patchClass?.node) return ['DZ_Data', 'DZ_Characters'];

    const requiredAddonsProp = getPropertyValue(patchClass.node, 'requiredAddons');
    if (!requiredAddonsProp) return ['DZ_Data', 'DZ_Characters'];
    return parseQuotedStrings(requiredAddonsProp.value);
}

function parseMainClass(classDecl: ParsedClass): ImportedMainClass {
    if (!classDecl.node) {
        throw new Error(`Пустой класс ${classDecl.name}`);
    }

    const enabledParams: Record<string, boolean> = {};
    const values = createDefaultValues();

    for (const param of PARAMS) {
        if (param.type === 'armor_modifier') {
            const parsed = parseArmorModifier(classDecl.node, param.placement);
            if (parsed) {
                enabledParams[param.key] = true;
                values[param.key] = parsed;
            }
            continue;
        }

        if (param.type === 'anim_event') {
            const parsed = parseAnimEvent(classDecl.node, param.placement);
            if (parsed) {
                enabledParams[param.key] = true;
                values[param.key] = parsed;
            }
            continue;
        }

        if (param.key === 'healthLevels') {
            const parsed = parseHealthLevels(classDecl.node, param.placement);
            if (parsed && parsed.length > 0) {
                enabledParams[param.key] = true;
                values[param.key] = parsed;
            }
            continue;
        }

        const targetNode = findNodeByPlacement(classDecl.node, param.placement);
        if (!targetNode) continue;

        const prop = getPropertyValue(targetNode, param.key);
        if (!prop) continue;

        enabledParams[param.key] = true;
        values[param.key] = parsePrimitiveValue(prop.value, param);
    }

    return {
        className: classDecl.name,
        baseClass: classDecl.baseClass || 'Default_Base',
        enabledParams,
        values,
        children: [],
        customParams: collectCustomParams(classDecl.node),
    };
}

function parseChildClass(classDecl: ParsedClass): ImportedChildClass {
    if (!classDecl.node) {
        throw new Error(`Пустой дочерний класс ${classDecl.name}`);
    }

    const scopeProp = getPropertyValue(classDecl.node, 'scope');
    const visibilityProp = getPropertyValue(classDecl.node, 'visibilityModifier');
    const texturesProp = getPropertyValue(classDecl.node, 'hiddenSelectionsTextures');
    const materialsProp = getPropertyValue(classDecl.node, 'hiddenSelectionsMaterials');

    const scope = scopeProp ? Number(scopeProp.value) : 2;
    const visibilityModifier = visibilityProp ? Number(visibilityProp.value) : undefined;

    return {
        name: classDecl.name,
        scope: Number.isNaN(scope) ? 2 : scope,
        visibilityModifier: visibilityModifier !== undefined && !Number.isNaN(visibilityModifier)
            ? visibilityModifier
            : undefined,
        hiddenSelectionsTextures: texturesProp ? parseQuotedStrings(texturesProp.value) : [],
        hiddenSelectionsMaterials: materialsProp ? parseQuotedStrings(materialsProp.value) : [],
    };
}

function parseSlots(cfgSlotsNode?: ParsedNode): ImportedSlot[] {
    if (!cfgSlotsNode) return [];

    return cfgSlotsNode.classes
        .filter((entry) => !entry.declarationOnly && entry.node)
        .map((entry) => {
            const slotNameProp = getPropertyValue(entry.node!, 'name');
            const displayNameProp = getPropertyValue(entry.node!, 'displayName');
            const ghostIconProp = getPropertyValue(entry.node!, 'ghostIcon');

            const slotName = slotNameProp
                ? slotNameProp.value.replace(/^"|"$/g, '')
                : entry.name.replace(/^Slot_/, '');

            const ghostIconRaw = ghostIconProp?.value.replace(/^"|"$/g, '') ?? '';
            const ghostIconSet = /set:([^\s]+)/.exec(ghostIconRaw)?.[1] ?? 'dayz_inventory';
            const ghostIconImage = /image:([^\s]+)/.exec(ghostIconRaw)?.[1] ?? '';

            return {
                slotName,
                displayName: displayNameProp ? displayNameProp.value.replace(/^"|"$/g, '') : '',
                ghostIconSet,
                ghostIconImage,
            };
        });
}

function parseProxies(cfgNonAIVehiclesNode?: ParsedNode): ImportedProxy[] {
    if (!cfgNonAIVehiclesNode) return [];

    return cfgNonAIVehiclesNode.classes
        .filter((entry) => !entry.declarationOnly && entry.node && entry.name !== 'ProxyAttachment')
        .map((entry) => {
            const inventorySlotProp = getPropertyValue(entry.node!, 'inventorySlot');
            if (!inventorySlotProp) {
                return {
                    proxyName: entry.name.replace(/^Proxy/, ''),
                    inventorySlots: [],
                };
            }

            const inventorySlots = inventorySlotProp.isArray
                ? parseQuotedStrings(inventorySlotProp.value)
                : [inventorySlotProp.value.replace(/^"|"$/g, '')];

            return {
                proxyName: entry.name.replace(/^Proxy/, ''),
                inventorySlots: inventorySlots.filter(Boolean),
            };
        });
}

export function parseConfigCpp(source: string, fallbackName = 'Imported Project'): ImportedConfig {
    const cleanSource = repairCommonConfigIssues(stripComments(source)).trim();
    if (!cleanSource) {
        throw new Error('Файл пустой');
    }

    const root = parseNode(cleanSource);
    const cfgPatches = findClass(root, 'CfgPatches')?.node;
    const cfgVehicles = findClass(root, 'CfgVehicles')?.node;

    if (!cfgVehicles) {
        throw new Error('В config.cpp не найден `CfgVehicles`, поэтому импорт невозможен');
    }

    const patchClass = cfgPatches?.classes.find((entry) => !entry.declarationOnly);
    const projectName = patchClass?.name || fallbackName;
    const requiredAddons = cfgPatches ? parseRequiredAddons(cfgPatches) : ['DZ_Data', 'DZ_Characters'];

    const classes: ImportedMainClass[] = [];
    const mainByName = new Map<string, ImportedMainClass>();

    for (const classDecl of cfgVehicles.classes) {
        if (classDecl.declarationOnly || !classDecl.node) {
            continue;
        }

        const hasRetextureProps =
            getPropertyValue(classDecl.node, 'hiddenSelectionsTextures') ||
            getPropertyValue(classDecl.node, 'hiddenSelectionsMaterials') ||
            getPropertyValue(classDecl.node, 'visibilityModifier');

        const hasOwnIdentity =
            getPropertyValue(classDecl.node, 'displayName') ||
            getPropertyValue(classDecl.node, 'model');

        if (classDecl.baseClass && mainByName.has(classDecl.baseClass) && hasRetextureProps && !hasOwnIdentity) {
            const parent = mainByName.get(classDecl.baseClass)!;
            parent.children.push(parseChildClass(classDecl));
            continue;
        }

        const mainClass = parseMainClass(classDecl);
        classes.push(mainClass);
        mainByName.set(mainClass.className, mainClass);
    }

    if (classes.length === 0) {
        throw new Error('В CfgVehicles не найдено импортируемых классов');
    }

    const cfgSlots = findClass(root, 'CfgSlots')?.node;
    const cfgNonAIVehicles = findClass(root, 'CfgNonAIVehicles')?.node;

    return {
        name: projectName,
        requiredAddons: requiredAddons.length > 0 ? requiredAddons : ['DZ_Data', 'DZ_Characters'],
        classes,
        slots: parseSlots(cfgSlots),
        proxies: parseProxies(cfgNonAIVehicles),
    };
}
