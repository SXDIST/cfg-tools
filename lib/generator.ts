import { ConfigData } from './store';
import { CATALOG } from './catalog';

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
        if (!Array.isArray(val)) return '{" "}';
        return `{${val.map(v => `"${v}"`).join(', ')}}`;
    }
    if (type === 'array_of_numbers') {
        if (!Array.isArray(val)) return '{0}';
        return `{${val.join(', ')}}`;
    }
    return typeof val === 'string' ? `"${val}"` : `${val}`;
}

// Render tree recursively
function renderTree(node: any, indentLevel: number): string {
    let res = '';
    const indent = '  '.repeat(indentLevel);

    // First print properties
    if (node._props && node._props.length > 0) {
        node._props.forEach((prop: string) => {
            res += `${indent}${prop}\n`;
        });
    }

    // Then print nested classes
    Object.keys(node).forEach(key => {
        if (key !== '_props') {
            const childNode = node[key];
            const childKeys = Object.keys(childNode).filter(k => k !== '_props');

            // If the class has exactly 1 property and no nested classes, print it inline
            if (childKeys.length === 0 && childNode._props && childNode._props.length === 1) {
                res += `${indent}class ${key} { ${childNode._props[0]} };\n`;
            } else {
                res += `${indent}class ${key}\n${indent}{\n`;
                res += renderTree(childNode, indentLevel + 1);
                res += `${indent}};\n`;
            }
        }
    });

    return res;
}

export function generateCpp(config: ConfigData): string {
    const projectName = config.name.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleProject';

    const addons = (config.requiredAddons || ['DZ_Data', 'DZ_Characters']).map(a => `"${a}"`).join(',');
    let out = `class CfgPatches\n{\n  class ${projectName}\n  {\n    requiredAddons[] = {${addons}};\n  };\n};\n\n`;

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
        out += `  class ${bc};\n`;
    });

    // 2. Generate each main class
    config.classes.forEach((cls) => {
        const className = cls.className.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleClass';
        const baseClass = cls.baseClass ? cls.baseClass.replace(/[^a-zA-Z0-9_]/g, '') : 'Default_Base';

        const tree: any = { _props: [] };

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
                    let isArrayProp = param.type.startsWith('array') || param.type === 'multi-select';
                    let formattedValue = formatValue(val, param.type);

                    const formatted = `${param.key}${isArrayProp ? '[]' : ''} = ${formattedValue};`;

                    if (param.type === 'armor_modifier') {
                        const parts = (param.placement || '').split('.');
                        let currentLevel = tree;
                        parts.forEach(part => {
                            if (!currentLevel[part]) {
                                currentLevel[part] = { _props: [] };
                            }
                            currentLevel = currentLevel[part];
                        });

                        ['Health', 'Blood', 'Shock'].forEach(subClass => {
                            if (!currentLevel[subClass]) {
                                currentLevel[subClass] = { _props: [] };
                            }
                            const dmg = val && val[subClass] !== undefined ? val[subClass] : 1.0;
                            currentLevel[subClass]._props.push(`damage = ${dmg};`);
                        });
                    } else if (param.key === 'healthLevels') {
                        if (val && Array.isArray(val) && val.length > 0) {
                            const i1 = '  '.repeat(5);
                            const i2 = '  '.repeat(6);

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
                            let currentLevel = tree;
                            parts.forEach(part => {
                                if (!currentLevel[part]) {
                                    currentLevel[part] = { _props: [] };
                                }
                                currentLevel = currentLevel[part];
                            });
                            currentLevel._props.push(block);
                        }
                    } else if (param.type === 'anim_event') {
                        if (val && val.soundSet) {
                            const parts = (param.placement || '').split('.');
                            let currentLevel = tree;
                            parts.forEach(part => {
                                if (!currentLevel[part]) {
                                    currentLevel[part] = { _props: [] };
                                }
                                currentLevel = currentLevel[part];
                            });
                            currentLevel._props.push(`soundSet = "${val.soundSet}";`);
                            currentLevel._props.push(`id = ${val.id};`);
                        }
                    } else if (param.placement === 'root') {
                        tree._props.push(formatted);
                    } else if (param.placement && param.placement !== 'root') {
                        const parts = param.placement.split('.');
                        let currentLevel = tree;
                        parts.forEach(part => {
                            if (!currentLevel[part]) {
                                currentLevel[part] = { _props: [] };
                            }
                            currentLevel = currentLevel[part];
                        });
                        currentLevel._props.push(formatted);
                    }
                }
            });
        });

        out += `\n  class ${className}: ${baseClass}\n  {\n`;
        out += renderTree(tree, 2);
        out += `  };\n`;

        // Handle Children (Retextures) for this class
        if (cls.children && cls.children.length > 0) {
            cls.children.forEach(child => {
                const childClassName = child.name.replace(/[^a-zA-Z0-9_]/g, '') || `${className}_Child`;
                out += `\n  class ${childClassName}: ${className}\n  {\n`;
                out += `    scope = ${child.scope};\n`;

                if (child.visibilityModifier !== undefined && child.visibilityModifier !== 1.0) {
                    out += `    visibilityModifier = ${child.visibilityModifier};\n`;
                }

                if (child.hiddenSelectionsTextures && child.hiddenSelectionsTextures.length > 0) {
                    out += `    hiddenSelectionsTextures[] = {${child.hiddenSelectionsTextures.map(t => `"${t}"`).join(', ')}};\n`;
                }
                if (child.hiddenSelectionsMaterials && child.hiddenSelectionsMaterials.length > 0) {
                    out += `    hiddenSelectionsMaterials[] = {${child.hiddenSelectionsMaterials.map(m => `"${m}"`).join(', ')}};\n`;
                }
                out += `  };\n`;
            });
        }
    });

    out += `};\n`;

    // 3. Handle CfgNonAIVehicles across all classes
    const allProxies = config.proxies || [];

    if (allProxies.length > 0) {
        out += `\nclass CfgNonAIVehicles\n{\n`;
        out += `  class ProxyAttachment;\n`;

        allProxies.forEach(proxy => {
            const safeName = proxy.proxyName.replace(/[^a-zA-Z0-9_]/g, '') || 'new_proxy';
            out += `  class Proxy${safeName}: ProxyAttachment\n  {\n`;
            if (proxy.inventorySlots.length === 1) {
                out += `    inventorySlot = "${proxy.inventorySlots[0]}";\n`;
            } else if (proxy.inventorySlots.length > 1) {
                out += `    inventorySlot[] = {${proxy.inventorySlots.map(s => `"${s}"`).join(', ')}};\n`;
            }
            out += `  };\n`;
        });

        out += `};\n`;
    }

    // 4. Handle CfgSlots across all classes
    const allSlots = config.slots || [];

    if (allSlots.length > 0) {
        out += `\nclass CfgSlots\n{\n`;
        allSlots.forEach(slot => {
            const safeSlotName = slot.slotName.replace(/[^a-zA-Z0-9_]/g, '') || 'newSlot';
            out += `  class Slot_${safeSlotName}\n  {\n`;
            out += `    name = "${safeSlotName}";\n`;
            if (slot.displayName) {
                out += `    displayName = "${slot.displayName}";\n`;
            }
            out += `    ghostIcon = "set:${slot.ghostIconSet} image:${slot.ghostIconImage}";\n`;
            out += `  };\n`;
        });
        out += `};\n`;
    }

    return out;
}
