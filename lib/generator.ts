import { ConfigData, CustomParamData } from './store';
import { CATALOG, CFG_MODS_CATALOG } from './catalog';

const INDENT = "\t";

type RenderTreeNode = {
    _props: string[];
    [key: string]: string[] | RenderTreeNode;
};

function indent(level: number): string {
    return INDENT.repeat(level);
}

function toBooleanNumber(val: any): number {
    if (val === true || val === 1 || val === '1') return 1;
    return 0;
}

function formatValue(val: any, type: string): string {
    if (type === 'string') return `"${val}"`;
    if (type === 'combobox') return `"${val ?? ''}"`;
    if (type === 'multi-select') {
        if (!Array.isArray(val)) return '{}'; 
        return `{${val.map((v: string) => `"${v}"`).join(', ')}}`;
    }
    if (type === 'select') {
        return typeof val === 'number' ? `${val}` : `"${val}"`;
    }
    if (type === 'number') return `${val}`;
    if (type === 'boolean') return `${toBooleanNumber(val)}`;
    if (type === 'array_of_strings') {
        if (!Array.isArray(val)) return val ? `{"${val}"}` : '{}';
        return `{${val.map(v => `"${v}"`).join(', ')}}`;
    }
    if (type === 'array_of_numbers') {
        if (!Array.isArray(val)) return '{0}';
        return `{${val.join(', ')}}`;
    }
    return typeof val === 'string' ? `"${val}"` : `${val}`;
}

const CFG_MODS_PROPERTY_NAMES: Record<string, string> = {
    imageSetsFiles: 'files',
    gameScriptModuleValue: 'value',
    gameScriptModuleFiles: 'files',
    worldScriptModuleValue: 'value',
    worldScriptModuleFiles: 'files',
    missionScriptModuleValue: 'value',
    missionScriptModuleFiles: 'files',
};

const CFG_MODS_PATH_KEYS = new Set([
    'picture',
    'inputs',
    'imageSetsFiles',
    'gameScriptModuleFiles',
    'worldScriptModuleFiles',
    'missionScriptModuleFiles',
]);

function normalizeCfgModsValue(key: string, value: unknown) {
    if (!CFG_MODS_PATH_KEYS.has(key)) return value;
    if (Array.isArray(value)) {
        return value.map((item) => typeof item === 'string' ? item.replace(/\\/g, '/') : item);
    }
    return typeof value === 'string' ? value.replace(/\\/g, '/') : value;
}

function pushProperty(tree: RenderTreeNode, placement: string | undefined, property: string) {
    if (!placement || placement === 'root') {
        tree._props.push(property);
        return;
    }

    const parts = placement.split('.').filter(Boolean);
    let currentLevel: RenderTreeNode = tree;
    parts.forEach((part) => {
        if (!currentLevel[part] || Array.isArray(currentLevel[part])) {
            currentLevel[part] = { _props: [] };
        }
        currentLevel = currentLevel[part] as RenderTreeNode;
    });
    currentLevel._props.push(property);
}

function formatCustomParam(param: CustomParamData): string | null {
    const key = param.key.trim();
    if (!key) return null;

    const isArrayProp = param.type === 'array_of_strings' || param.type === 'array_of_numbers';
    const formattedValue = formatValue(param.value, param.type);
    return `${key}${isArrayProp ? '[]' : ''} = ${formattedValue};`;
}

// Render tree recursively
function renderTree(node: RenderTreeNode, indentLevel: number): string {
    let res = '';
    const currentIndent = indent(indentLevel);

    // First print properties
    if (node._props && node._props.length > 0) {
        node._props.forEach((prop: string) => {
            res += `${currentIndent}${prop}\n`;
        });
    }

    // Then print nested classes
    Object.keys(node).forEach(key => {
        if (key !== '_props') {
            const childNode = node[key];
            if (Array.isArray(childNode)) return;
            const childKeys = Object.keys(childNode).filter(k => k !== '_props');

            // If the class has exactly 1 property and no nested classes, print it inline
            if (childKeys.length === 0 && childNode._props && childNode._props.length === 1) {
                res += `${currentIndent}class ${key} { ${childNode._props[0]} };\n`;
            } else {
                res += `${currentIndent}class ${key}\n${currentIndent}{\n`;
                res += renderTree(childNode, indentLevel + 1);
                res += `${currentIndent}};\n`;
            }
        }
    });

    return res;
}

function renderCfgMods(config: ConfigData): string {
    const cfgMods = config.cfgMods;
    if (!cfgMods?.enabled) return '';

    const params = CFG_MODS_CATALOG.flatMap((category) => category.params);
    const classNameRaw = cfgMods.values.modClassName ?? 'MyMod';
    const className = String(classNameRaw).replace(/[^a-zA-Z0-9_]/g, '') || 'MyMod';
    const tree: RenderTreeNode = { _props: [] };

    params.forEach((param) => {
        if (param.key === 'modClassName') return;
        if (!cfgMods.enabledParams[param.key]) return;

        let val = cfgMods.values[param.key];
        if (val === undefined || val === null) {
            val = param.defaultValue;
        }

        val = normalizeCfgModsValue(param.key, val);
        const propertyName = CFG_MODS_PROPERTY_NAMES[param.key] || param.key;
        const isArrayProp = param.type.startsWith('array') || param.type === 'multi-select';
        const formattedValue = formatValue(val, param.type);
        const formatted = `${propertyName}${isArrayProp ? '[]' : ''} = ${formattedValue};`;

        if (param.placement === 'root') {
            tree._props.push(formatted);
        } else if (param.placement) {
            pushProperty(tree, param.placement, formatted);
        }
    });

    const rendered = renderTree(tree, 2);
    return `class CfgMods\n{\n${indent(1)}class ${className}\n${indent(1)}{\n${rendered}${indent(1)}};\n};\n\n`;
}

export function generateCpp(config: ConfigData): string {
    const projectName = config.name.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleProject';

    const addons = (config.requiredAddons || ['DZ_Data', 'DZ_Characters']).map(a => `"${a}"`).join(',');
    let out = `class CfgPatches\n{\n${indent(1)}class ${projectName}\n${indent(1)}{\n${indent(2)}requiredAddons[] = {${addons}};\n${indent(1)}};\n};\n\n`;
    out += renderCfgMods(config);

    const localClassNames = new Set<string>(
        config.classes.map((cls) => cls.className.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleClass')
    );

    // 1. Collect all unique external base classes
    const baseClasses = new Set<string>();
    config.classes.forEach(cls => {
        if (cls.baseClass) {
            const sanitizedBaseClass = cls.baseClass.replace(/[^a-zA-Z0-9_]/g, '');
            if (sanitizedBaseClass && !localClassNames.has(sanitizedBaseClass)) {
                baseClasses.add(sanitizedBaseClass);
            }
        }
    });

    out += `class CfgVehicles\n{\n`;

    // Declare base classes at the top of CfgVehicles
    baseClasses.forEach(bc => {
        out += `${indent(1)}class ${bc};\n`;
    });

    // 2. Generate each main class
    config.classes.forEach((cls) => {
        const className = cls.className.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleClass';
        const baseClass = cls.baseClass ? cls.baseClass.replace(/[^a-zA-Z0-9_]/g, '') : 'Default_Base';

        const tree: RenderTreeNode = { _props: [] };

        CATALOG.forEach(category => {
            category.params.forEach(param => {
                // If parameter is enabled in state
                if (cls.enabledParams[param.key]) {
                    let val = cls.values[param.key];
                    if (val === undefined || val === null) {
                        val = param.defaultValue;
                    }
                    if (param.type === 'combobox' && Array.isArray(val)) {
                        val = val[0] ?? '';
                    }
                    const isArrayProp = param.type.startsWith('array') || param.type === 'multi-select';
                    const formattedValue = formatValue(val, param.type);

                    const formatted = `${param.key}${isArrayProp ? '[]' : ''} = ${formattedValue};`;

                    if (param.type === 'armor_modifier') {
                        const parts = (param.placement || '').split('.');
                        let currentLevel: RenderTreeNode = tree;
                        parts.forEach(part => {
                            if (!currentLevel[part] || Array.isArray(currentLevel[part])) {
                                currentLevel[part] = { _props: [] };
                            }
                            currentLevel = currentLevel[part] as RenderTreeNode;
                        });

                        ['Health', 'Blood', 'Shock'].forEach(subClass => {
                            if (!currentLevel[subClass] || Array.isArray(currentLevel[subClass])) {
                                currentLevel[subClass] = { _props: [] };
                            }
                            const dmg = val && val[subClass] !== undefined ? val[subClass] : 1.0;
                            (currentLevel[subClass] as RenderTreeNode)._props.push(`damage = ${dmg};`);
                        });
                    } else if (param.key === 'healthLevels') {
                        if (val && Array.isArray(val) && val.length > 0) {
                            const i1 = indent(5);
                            const i2 = indent(6);

                            let block = `healthLevels[] = \n${i1}{\n`;

                            const pristineMats = val.map((v: string) => `"${v}"`).join(', ');
                            const wornMats = val.map((v: string) => `"${v}"`).join(', ');
                            const damageMats = val.map((v: string) => `"${v.replace(/\.rvmat$/i, '')}_Damage.rvmat"`).join(', ');
                            const destructMats = val.map((v: string) => `"${v.replace(/\.rvmat$/i, '')}_Destruct.rvmat"`).join(', ');

                            block += `${i2}{1.0,{${pristineMats}}},\n`;
                            block += `${i2}{0.7,{${wornMats}}},\n`;
                            block += `${i2}{0.5,{${damageMats}}},\n`;
                            block += `${i2}{0.3,{${damageMats}}},\n`;
                            block += `${i2}{0.0,{${destructMats}}}\n`;
                            block += `${i1}};`;

                            const parts = (param.placement || '').split('.');
                            let currentLevel: RenderTreeNode = tree;
                            parts.forEach(part => {
                                if (!currentLevel[part] || Array.isArray(currentLevel[part])) {
                                    currentLevel[part] = { _props: [] };
                                }
                                currentLevel = currentLevel[part] as RenderTreeNode;
                            });
                            currentLevel._props.push(block);
                        }
                    } else if (param.type === 'anim_event') {
                        if (val && val.soundSet) {
                            const parts = (param.placement || '').split('.');
                            let currentLevel: RenderTreeNode = tree;
                            parts.forEach(part => {
                                if (!currentLevel[part] || Array.isArray(currentLevel[part])) {
                                    currentLevel[part] = { _props: [] };
                                }
                                currentLevel = currentLevel[part] as RenderTreeNode;
                            });
                            currentLevel._props.push(`soundSet = "${val.soundSet}";`);
                            currentLevel._props.push(`id = ${val.id};`);
                        }
                    } else if (param.placement === 'root') {
                        tree._props.push(formatted);
                    } else if (param.placement && param.placement !== 'root') {
                        pushProperty(tree, param.placement, formatted);
                    }
                }
            });
        });

        (cls.customParams || []).forEach((param) => {
            const formatted = formatCustomParam(param);
            if (!formatted) return;
            pushProperty(tree, param.placement, formatted);
        });

        out += `\n${indent(1)}class ${className}: ${baseClass}\n${indent(1)}{\n`;
        out += renderTree(tree, 2);
        out += `${indent(1)}};\n`;

        // Handle Children (Retextures) for this class
        if (cls.children && cls.children.length > 0) {
            cls.children.forEach(child => {
                const childClassName = child.name.replace(/[^a-zA-Z0-9_]/g, '') || `${className}_Child`;
                out += `\n${indent(1)}class ${childClassName}: ${className}\n${indent(1)}{\n`;
                out += `${indent(2)}scope = ${child.scope};\n`;

                if (child.visibilityModifier !== undefined && child.visibilityModifier !== 1.0) {
                    out += `${indent(2)}visibilityModifier = ${child.visibilityModifier};\n`;
                }

                if (child.hiddenSelectionsTextures && child.hiddenSelectionsTextures.length > 0) {
                    out += `${indent(2)}hiddenSelectionsTextures[] = {${child.hiddenSelectionsTextures.map(t => `"${t}"`).join(', ')}};\n`;
                }
                if (child.hiddenSelectionsMaterials && child.hiddenSelectionsMaterials.length > 0) {
                    out += `${indent(2)}hiddenSelectionsMaterials[] = {${child.hiddenSelectionsMaterials.map(m => `"${m}"`).join(', ')}};\n`;
                }
                out += `${indent(1)}};\n`;
            });
        }
    });

    out += `};\n`;

    // 3. Handle CfgNonAIVehicles across all classes
    const allProxies = config.proxies || [];

    if (allProxies.length > 0) {
        out += `\nclass CfgNonAIVehicles\n{\n`;
        out += `${indent(1)}class ProxyAttachment;\n`;

        allProxies.forEach(proxy => {
            const safeName = proxy.proxyName.replace(/[^a-zA-Z0-9_]/g, '') || 'new_proxy';
            out += `${indent(1)}class Proxy${safeName}: ProxyAttachment\n${indent(1)}{\n`;
            if (proxy.inventorySlots.length === 1) {
                out += `${indent(2)}inventorySlot = "${proxy.inventorySlots[0]}";\n`;
            } else if (proxy.inventorySlots.length > 1) {
                out += `${indent(2)}inventorySlot[] = {${proxy.inventorySlots.map(s => `"${s}"`).join(', ')}};\n`;
            }
            out += `${indent(1)}};\n`;
        });

        out += `};\n`;
    }

    // 4. Handle CfgSlots across all classes
    const allSlots = config.slots || [];

    if (allSlots.length > 0) {
        out += `\nclass CfgSlots\n{\n`;
        allSlots.forEach(slot => {
            const safeSlotName = slot.slotName.replace(/[^a-zA-Z0-9_]/g, '') || 'newSlot';
            out += `${indent(1)}class Slot_${safeSlotName}\n${indent(1)}{\n`;
            out += `${indent(2)}name = "${safeSlotName}";\n`;
            if (slot.displayName) {
                out += `${indent(2)}displayName = "${slot.displayName}";\n`;
            }
            out += `${indent(2)}ghostIcon = "set:${slot.ghostIconSet} image:${slot.ghostIconImage}";\n`;
            out += `${indent(1)}};\n`;
        });
        out += `};\n`;
    }

    return out;
}

/**
 * Build a map of class ID → 1-based line number for the main class declaration
 * inside the generated C++ output. Handles non-unique class names correctly
 * because it walks config.classes in generation order and marks each matched
 * line as consumed.
 */
export function buildClassLineMap(
    code: string,
    config: ConfigData,
): Record<string, number> {
    const lines = code.split('\n');
    const map: Record<string, number> = {};
    const usedLines = new Set<number>();

    for (const cls of config.classes) {
        const className =
            cls.className.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleClass';
        const baseClass = cls.baseClass
            ? cls.baseClass.replace(/[^a-zA-Z0-9_]/g, '')
            : 'Default_Base';

        const needle = `${indent(1)}class ${className}: ${baseClass}`;

        for (let i = 0; i < lines.length; i++) {
            if (!usedLines.has(i) && lines[i] === needle) {
                map[cls.id] = i + 1;
                usedLines.add(i);
                break;
            }
        }
    }

    return map;
}
