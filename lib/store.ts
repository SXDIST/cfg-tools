import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CATALOG } from './catalog';
import { parseConfigCpp } from './cpp-importer';

export interface ChildClassData {
    id: string;
    name: string;
    scope: number;
    hiddenSelectionsTextures: string[];
    hiddenSelectionsMaterials: string[];
    visibilityModifier?: number;
}

export interface SlotData {
    id: string;
    slotName: string;
    displayName: string;
    ghostIconSet: string;
    ghostIconImage: string;
}

export interface ProxyData {
    id: string;
    proxyName: string;
    inventorySlots: string[];
}

export interface MainClassData {
    id: string;
    className: string;
    baseClass: string;
    enabledParams: Record<string, boolean>;
    values: Record<string, any>;
    children: ChildClassData[];
}

export interface ConfigData {
    id: string;
    name: string;
    requiredAddons: string[];
    classes: MainClassData[];
    activeTabId: string | null;
    slots: SlotData[];
    proxies: ProxyData[];
}

export interface AppState {
    configs: ConfigData[];
    activeConfigId: string | null;
    addConfig: (name?: string) => void;
    importConfigFromCpp: (cppText: string, fallbackName?: string) => { success: boolean; error?: string };
    duplicateConfig: (id: string) => void;
    renameConfig: (id: string, newName: string) => void;
    deleteConfig: (id: string) => void;
    setActiveConfig: (id: string) => void;
    updateRequiredAddons: (configId: string, addons: string[]) => void;

    // Tab actions
    addTab: (configId: string, className?: string) => void;
    renameTab: (configId: string, tabId: string, newName: string) => void;
    deleteTab: (configId: string, tabId: string) => void;
    setActiveTab: (configId: string, tabId: string) => void;
    duplicateTab: (configId: string, tabId: string) => void;

    // Active tab data actions
    updateActiveTab: (updates: Partial<MainClassData>) => void;
    setBaseClass: (configId: string, tabId: string, baseClass: string) => void;
    applyPreset: (preset: 'clothing') => void;

    // Child class actions
    addChildClass: (configId: string, tabId: string, name: string) => void;
    updateChildClass: (configId: string, tabId: string, childId: string, updates: Partial<ChildClassData>) => void;
    deleteChildClass: (configId: string, tabId: string, childId: string) => void;

    // Slot actions
    addSlot: (configId: string) => void;
    updateSlot: (configId: string, slotId: string, updates: Partial<SlotData>) => void;
    deleteSlot: (configId: string, slotId: string) => void;

    // Proxy actions
    addProxy: (configId: string) => void;
    updateProxy: (configId: string, proxyId: string, updates: Partial<ProxyData>) => void;
    deleteProxy: (configId: string, proxyId: string) => void;
}

const getDefaultValues = () => {
    const values: Record<string, any> = {};
    CATALOG.forEach((cat) => {
        cat.params.forEach((param) => {
            values[param.key] = param.defaultValue;
        });
    });
    return values;
};

export type PresetName = 'clothing';

const PRESET_PARAMS: Record<PresetName, string[]> = {
    clothing: [
        'scope', 'displayName', 'descriptionShort', 'model', 'weight', 'itemSize', 'itemsCargoSize',
        'inventorySlot', 'attachments', 'itemInfo', 'hiddenSelections',
        'repairableWithKits', 'repairCosts', 'varWetMax', 'heatIsolation', 'quickBarBonus',
        'durability',
        'male', 'female',
        'biological', 'chemical',
        'hitpoints', 'healthLevels', 'armorProjectile', 'armorMelee', 'armorFrag', 'armorInfected',
        'dropSoundSet', 'pickUpSoundSet'
    ]
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            configs: [],
            activeConfigId: null,

            addConfig: (name = 'New Project') => {
                const initialTabId = uuidv4();
                const newConfig: ConfigData = {
                    id: uuidv4(),
                    name,
                    requiredAddons: ['DZ_Data', 'DZ_Characters'],
                    activeTabId: initialTabId,
                    slots: [],
                    proxies: [],
                    classes: [
                        {
                            id: initialTabId,
                            className: 'NewClass',
                            baseClass: 'Default_Base',
                            enabledParams: {
                                'scope': true,
                                'displayName': true,
                                'descriptionShort': true,
                                'model': true,
                            },
                            values: getDefaultValues(),
                            children: [],
                        }
                    ]
                };

                set((state) => ({
                    configs: [...state.configs, newConfig],
                    activeConfigId: newConfig.id,
                }));
            },

            importConfigFromCpp: (cppText, fallbackName = 'Imported Project') => {
                try {
                    const imported = parseConfigCpp(cppText, fallbackName);

                    const firstTabId = uuidv4();
                    const newConfig: ConfigData = {
                        id: uuidv4(),
                        name: imported.name || fallbackName,
                        requiredAddons: imported.requiredAddons,
                        activeTabId: firstTabId,
                        slots: imported.slots.map(slot => ({
                            id: uuidv4(),
                            slotName: slot.slotName,
                            displayName: slot.displayName,
                            ghostIconSet: slot.ghostIconSet,
                            ghostIconImage: slot.ghostIconImage,
                        })),
                        proxies: imported.proxies.map(proxy => ({
                            id: uuidv4(),
                            proxyName: proxy.proxyName,
                            inventorySlots: proxy.inventorySlots,
                        })),
                        classes: imported.classes.map((cls, index) => ({
                            id: index === 0 ? firstTabId : uuidv4(),
                            className: cls.className,
                            baseClass: cls.baseClass,
                            enabledParams: cls.enabledParams,
                            values: cls.values,
                            children: cls.children.map((child) => ({
                                id: uuidv4(),
                                name: child.name,
                                scope: child.scope,
                                hiddenSelectionsTextures: child.hiddenSelectionsTextures,
                                hiddenSelectionsMaterials: child.hiddenSelectionsMaterials,
                                visibilityModifier: child.visibilityModifier,
                            })),
                        })),
                    };

                    set((state) => ({
                        configs: [...state.configs, newConfig],
                        activeConfigId: newConfig.id,
                    }));

                    return { success: true };
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Не удалось импортировать config.cpp';
                    return { success: false, error: message };
                }
            },

            duplicateConfig: (id) => {
                const state = get();
                const configToCopy = state.configs.find((c) => c.id === id);
                if (configToCopy) {
                    const newConfig: ConfigData = {
                        ...configToCopy,
                        id: uuidv4(),
                        name: `${configToCopy.name} (Copy)`,
                        slots: (configToCopy.slots || []).map(s => ({ ...s, id: uuidv4() })),
                        proxies: (configToCopy.proxies || []).map(p => ({ ...p, id: uuidv4() })),
                        classes: configToCopy.classes.map(cls => ({
                            ...cls,
                            id: uuidv4(),
                            children: cls.children.map(child => ({ ...child, id: uuidv4() }))
                        }))
                    };
                    set((state) => ({
                        configs: [...state.configs, newConfig],
                        activeConfigId: newConfig.id,
                    }));
                }
            },

            renameConfig: (id, newName) => {
                set((state) => ({
                    configs: state.configs.map((c) => (c.id === id ? { ...c, name: newName } : c)),
                }));
            },

            deleteConfig: (id) => {
                set((state) => {
                    const newConfigs = state.configs.filter((c) => c.id !== id);
                    const newActiveId = state.activeConfigId === id
                        ? (newConfigs.length > 0 ? newConfigs[0].id : null)
                        : state.activeConfigId;

                    return {
                        configs: newConfigs,
                        activeConfigId: newActiveId,
                    };
                });
            },

            setActiveConfig: (id) => {
                set({ activeConfigId: id });
            },

            updateRequiredAddons: (configId, addons) => {
                set((state) => ({
                    configs: state.configs.map(c =>
                        c.id === configId ? { ...c, requiredAddons: addons } : c
                    ),
                }));
            },

            // --- TAB ACTIONS ---
            addTab: (configId, className = 'NewClass') => {
                const newTabId = uuidv4();
                const newClassData: MainClassData = {
                    id: newTabId,
                    className,
                    baseClass: 'Default_Base',
                    enabledParams: {
                        'scope': true,
                        'displayName': true,
                        'descriptionShort': true,
                        'model': true,
                    },
                    values: getDefaultValues(),
                    children: [],
                };

                set((state) => ({
                    configs: state.configs.map((c) =>
                        c.id === configId
                            ? { ...c, classes: [...c.classes, newClassData], activeTabId: newTabId }
                            : c
                    ),
                }));
            },

            renameTab: (configId, tabId, newName) => {
                set((state) => ({
                    configs: state.configs.map((c) =>
                        c.id === configId
                            ? { ...c, classes: c.classes.map(cls => cls.id === tabId ? { ...cls, className: newName } : cls) }
                            : c
                    ),
                }));
            },

            deleteTab: (configId, tabId) => {
                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === configId) {
                            const newClasses = c.classes.filter(cls => cls.id !== tabId);
                            const newActiveTabId = c.activeTabId === tabId
                                ? (newClasses.length > 0 ? newClasses[0].id : null)
                                : c.activeTabId;
                            return { ...c, classes: newClasses, activeTabId: newActiveTabId };
                        }
                        return c;
                    }),
                }));
            },

            setActiveTab: (configId, tabId) => {
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, activeTabId: tabId } : c),
                }));
            },

            duplicateTab: (configId, tabId) => {
                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === configId) {
                            const tabToCopy = c.classes.find(cls => cls.id === tabId);
                            if (tabToCopy) {
                                const newTabId = uuidv4();
                                const newTab: MainClassData = {
                                    ...tabToCopy,
                                    id: newTabId,
                                    className: `${tabToCopy.className}_Copy`,
                                    children: tabToCopy.children.map(child => ({ ...child, id: uuidv4() }))
                                };
                                return { ...c, classes: [...c.classes, newTab], activeTabId: newTabId };
                            }
                        }
                        return c;
                    }),
                }));
            },

            // --- ACTIVE TAB DATA ACTIONS ---

            updateActiveTab: (updates) => {
                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === state.activeConfigId && c.activeTabId) {
                            return {
                                ...c,
                                classes: c.classes.map(cls => cls.id === c.activeTabId ? { ...cls, ...updates } : cls)
                            };
                        }
                        return c;
                    }),
                }));
            },

            setBaseClass: (configId, tabId, baseClass) => {
                set((state) => ({
                    configs: state.configs.map((c) =>
                        c.id === configId
                            ? { ...c, classes: c.classes.map(cls => cls.id === tabId ? { ...cls, baseClass } : cls) }
                            : c
                    ),
                }));
            },

            applyPreset: (preset) => {
                const state = get();
                const activeConfig = state.configs.find(c => c.id === state.activeConfigId);
                if (!activeConfig || !activeConfig.activeTabId) return;

                const paramsToEnable = PRESET_PARAMS[preset] || [];
                const newEnabledParams: Record<string, boolean> = {};
                paramsToEnable.forEach(p => newEnabledParams[p] = true);

                let defaultBaseClass = 'Default_Base';
                let presetValues: Record<string, any> = {};
                let presetSlots: SlotData[] = [];
                let presetProxies: ProxyData[] = [];
                let presetChildren: ChildClassData[] = [];

                if (preset === 'clothing') {
                    defaultBaseClass = 'Clothing';
                    presetValues = {
                        scope: 0,
                        displayName: "$STR_SDT_Top_PSZ9D",
                        descriptionShort: "$STR_SDT_Top_PSZ9D_Desc",
                        model: "\\Sadist\\Suits\\PS9D\\PSZ9D_Ground.p3d",
                        weight: 4000,
                        itemSize: [3, 2],
                        itemsCargoSize: [10, 5],
                        inventorySlot: "Body",
                        attachments: ["PSZ9D_Pouch"],
                        itemInfo: ["Clothing", "Body"],
                        hiddenSelections: ["camo"],
                        repairableWithKits: [5, 2],
                        repairCosts: [30, 25],
                        varWetMax: 0.249,
                        heatIsolation: 0.9,
                        quickBarBonus: 2,
                        male: "\\Sadist\\Suits\\PS9D\\PSZ9D_Male.p3d",
                        female: "\\Sadist\\Suits\\PS9D\\PSZ9D_Female.p3d",
                        hitpoints: 1000,
                        healthLevels: [
                            "\\Sadist\\Suits\\PSZ9D\\Data\\Top_PSZ9D.rvmat",
                            "\\Sadist\\Suits\\PSZ9D\\Data\\Top_PSZ9D_Details.rvmat"
                        ],
                        armorProjectile: { Health: 0.25, Blood: 0.25, Shock: 0.25 },
                        armorMelee: { Health: 0.25, Blood: 0.25, Shock: 0.25 },
                        armorFrag: { Health: 0.25, Blood: 0.25, Shock: 0.25 },
                        armorInfected: { Health: 0.25, Blood: 0.25, Shock: 0.25 },
                        dropSoundSet: { soundSet: "Shirt_drop_SoundSet", id: 898 },
                        pickUpSoundSet: { soundSet: "Shirt_pickup_SoundSet", id: 797 }
                    };
                    presetSlots = [
                        { id: uuidv4(), slotName: "PSZ9D_Pouch", displayName: "#STR_CfgVestPouch0", ghostIconSet: "dayz_inventory", ghostIconImage: "vestpouches" }
                    ];
                    presetProxies = [
                        { id: uuidv4(), proxyName: "PSZ9D_Pouch", inventorySlots: ["SDT_PSZ9D_Pouch"] }
                    ];
                    presetChildren = [
                        {
                            id: uuidv4(),
                            name: "SDT_Top_PSZ9D_Duty",
                            scope: 2,
                            visibilityModifier: 0.85,
                            hiddenSelectionsTextures: ["\\Sadist\\Suits\\PSZ9D\\Data\\Top_PSZ9D_Details_Duty_co.paa"],
                            hiddenSelectionsMaterials: []
                        }
                    ];
                }

                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === state.activeConfigId && c.activeTabId) {
                            return {
                                ...c,
                                slots: presetSlots,
                                proxies: presetProxies,
                                classes: c.classes.map(cls => cls.id === c.activeTabId ? {
                                    ...cls,
                                    baseClass: defaultBaseClass,
                                    enabledParams: newEnabledParams,
                                    values: { ...cls.values, ...presetValues },
                                    children: presetChildren
                                } : cls)
                            };
                        }
                        return c;
                    }),
                }));
            },

            // --- CHILD CLASS ACTIONS ---

            addChildClass: (configId, tabId, name) => {
                const newChild: ChildClassData = {
                    id: uuidv4(),
                    name,
                    scope: 2,
                    hiddenSelectionsTextures: [],
                    hiddenSelectionsMaterials: [],
                };
                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === configId) {
                            return {
                                ...c,
                                classes: c.classes.map(cls => cls.id === tabId ? { ...cls, children: [...cls.children, newChild] } : cls)
                            };
                        }
                        return c;
                    })
                }));
            },

            updateChildClass: (configId, tabId, childId, updates) => {
                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === configId) {
                            return {
                                ...c,
                                classes: c.classes.map(cls => {
                                    if (cls.id === tabId) {
                                        return {
                                            ...cls,
                                            children: cls.children.map(child => child.id === childId ? { ...child, ...updates } : child)
                                        };
                                    }
                                    return cls;
                                })
                            };
                        }
                        return c;
                    })
                }));
            },

            deleteChildClass: (configId, tabId, childId) => {
                set((state) => ({
                    configs: state.configs.map((c) => {
                        if (c.id === configId) {
                            return {
                                ...c,
                                classes: c.classes.map(cls => {
                                    if (cls.id === tabId) {
                                        return {
                                            ...cls,
                                            children: cls.children.filter(child => child.id !== childId)
                                        };
                                    }
                                    return cls;
                                })
                            };
                        }
                        return c;
                    })
                }));
            },

            // --- SLOT ACTIONS ---

            addSlot: (configId) => {
                const newSlot: SlotData = {
                    id: uuidv4(),
                    slotName: 'newSlot',
                    displayName: '',
                    ghostIconSet: 'dayz_inventory',
                    ghostIconImage: '',
                };
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, slots: [...(c.slots || []), newSlot] } : c)
                }));
            },

            updateSlot: (configId, slotId, updates) => {
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, slots: (c.slots || []).map(s => s.id === slotId ? { ...s, ...updates } : s) } : c)
                }));
            },

            deleteSlot: (configId, slotId) => {
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, slots: (c.slots || []).filter(s => s.id !== slotId) } : c)
                }));
            },

            // --- PROXY ACTIONS ---

            addProxy: (configId) => {
                const newProxy: ProxyData = {
                    id: uuidv4(),
                    proxyName: 'new_proxy',
                    inventorySlots: [],
                };
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, proxies: [...(c.proxies || []), newProxy] } : c)
                }));
            },

            updateProxy: (configId, proxyId, updates) => {
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, proxies: (c.proxies || []).map(p => p.id === proxyId ? { ...p, ...updates } : p) } : c)
                }));
            },

            deleteProxy: (configId, proxyId) => {
                set((state) => ({
                    configs: state.configs.map((c) => c.id === configId ? { ...c, proxies: (c.proxies || []).filter(p => p.id !== proxyId) } : c)
                }));
            },
        }),
        {
            name: 'cfg-tools-storage',
            storage: {
                getItem: (name: string) => {
                    const str = localStorage.getItem(name);
                    return str ? JSON.parse(str) : null;
                },
                setItem: (() => {
                    let timeout: ReturnType<typeof setTimeout> | null = null;
                    return (name: string, value: unknown) => {
                        if (timeout) clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            localStorage.setItem(name, JSON.stringify(value));
                        }, 500);
                    };
                })(),
                removeItem: (name: string) => localStorage.removeItem(name),
            },
            version: 2,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    if (persistedState && persistedState.configs) {
                        persistedState.configs = persistedState.configs.map((c: any) => {
                            if (!c.classes) {
                                return {
                                    ...c,
                                    activeTabId: c.id + '_tab',
                                    classes: [{
                                        id: c.id + '_tab',
                                        className: c.name.replace(/[^a-zA-Z0-9_]/g, '') || 'ExampleClass',
                                        baseClass: c.baseClass || '',
                                        enabledParams: c.enabledParams || {},
                                        values: c.values || {},
                                        children: c.children || []
                                    }]
                                };
                            }
                            return c;
                        });
                    }
                }
                if (version <= 1) {
                    if (persistedState?.configs) {
                        persistedState.configs = persistedState.configs.map((c: any) => ({
                            ...c,
                            slots: c.slots ?? (c.classes || []).flatMap((cls: any) => cls.slots || []),
                            proxies: c.proxies ?? (c.classes || []).flatMap((cls: any) => cls.proxies || []),
                            classes: (c.classes || []).map(({ slots: _s, proxies: _p, ...rest }: any) => rest),
                        }));
                    }
                }
                return persistedState;
            }
        }
    )
);
