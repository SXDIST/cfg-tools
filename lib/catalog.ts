export type ParamType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'array_of_strings' | 'array_of_numbers' | 'armor_modifier' | 'anim_event';

export interface AnimEventOption {
    label: string;
    soundSet: string;
    id: number;
}

export interface ParamDef {
    key: string;
    label: string;
    description: string;
    example?: string;
    type: ParamType;
    defaultValue?: any;
    placement?: string; // e.g. 'root', 'DamageSystem', 'ClothingTypes'
    options?: AnimEventOption[]; // specifically for anim_event
}

export interface CategoryDef {
    id: string;
    title: string;
    description?: string;
    params: ParamDef[];
}

export const CATALOG: CategoryDef[] = [
    {
        id: 'base',
        title: 'Базовые параметры',
        description: 'Параметры корневого класса',
        params: [
            { key: 'scope', label: 'Scope', description: 'Отвечает за доступность класса в игре. Определяет, может ли предмет спавниться и использоваться игроками.', example: '0 - базовый класс (ненаследуемый), 1 - скрытый, 2 - публичный (спавнится в мире).', type: 'number', defaultValue: 2, placement: 'root' },
            { key: 'displayName', label: 'Display Name', description: 'Название предмета, которое отображается в инвентаре или при наведении на него в игре.', example: 'Можно указать текст напрямую или переменную: $STR_Item_Name_MyItem', type: 'string', defaultValue: 'Мой предмет', placement: 'root' },
            { key: 'descriptionShort', label: 'Description', description: 'Краткое описание предмета. Отображается в инвентаре при наведении на предмет.', example: 'Обычный текст или переменная локализации: $STR_Item_Desc_MyItem', type: 'string', defaultValue: 'Описание моего предмета', placement: 'root' },
            { key: 'model', label: 'Model Path', description: 'Определяет путь к 3D модели (.p3d) предмета, которая отображается в мире игры (на земле).', example: '\\dz\\characters\\headgear\\helmet.p3d', type: 'string', defaultValue: '\\dz\\characters\\headgear\\helmet.p3d', placement: 'root' },
            { key: 'weight', label: 'Weight (g)', description: 'Вес предмета в граммах. Влияет на общую переносимую массу персонажа и затраты выносливости.', example: '1000 — вес равен 1 кг. 2500 — вес равен 2.5 кг.', type: 'number', defaultValue: 1000, placement: 'root' },
            { key: 'itemSize', label: 'Item Size', description: 'Занимаемое место предмета в инвентаре (ширина и высота в клетках).', example: '[2, 2] — предмет займет 2 клетки в ширину и 2 в высоту (всего 4).', type: 'array_of_numbers', defaultValue: [2, 2], placement: 'root' },
            { key: 'itemsCargoSize', label: 'Cargo Size', description: 'Размер внутреннего инвентаря самого предмета в клетках (ширина и высота).', example: '[5, 4] — внутри предмета сетка 5x4 (всего 20). [0, 0] — нет инвентаря.', type: 'array_of_numbers', defaultValue: [0, 0], placement: 'root' },
            { key: 'inventorySlot', label: 'Inventory Slots', description: 'Слоты экипировки персонажа, в которые можно надеть или поместить данный предмет.', example: '["Body"] для курток, ["Head"] для шлемов, ["Back"] для рюкзаков.', type: 'array_of_strings', defaultValue: ['Headgear'], placement: 'root' },
            { key: 'attachments', label: 'Attachments', description: 'Доступные слоты на самом предмете, куда можно прикрепить другие предметы.', example: '["Chemlight", "WalkieTalkie"] — позволит прикрепить химсвет и рацию.', type: 'array_of_strings', defaultValue: [], placement: 'root' },
            { key: 'itemInfo', label: 'Item Info Categories', description: 'Системные категории предмета, используемые игрой для логики сортировки или фильтрации.', example: '["Clothing", "Body"] для одежды, надеваемой на торс.', type: 'array_of_strings', defaultValue: ['Clothing'], placement: 'root' },
            { key: 'hiddenSelections', label: 'Hidden Selections', description: 'Имена секций (областей) в 3D модели, на которые можно применять измененные текстуры и материалы.', example: '["camoGround", "zbytek"] — имена должны совпадать с заготовками в модели.', type: 'array_of_strings', defaultValue: ['camoGround'], placement: 'root' },
            { key: 'hiddenSelectionsTextures', label: 'Textures', description: 'Пути к файлам текстур (.paa), которые будут применены поверх секций из hiddenSelections.', example: '["\\my_mod\\data\\co.paa"] — индексы текстур должны совпадать с hiddenSelections.', type: 'array_of_strings', defaultValue: [], placement: 'root' },
            { key: 'hiddenSelectionsMaterials', label: 'Materials', description: 'Пути к файлам материалов (.rvmat), которые будут применены поверх секций из hiddenSelections.', example: '["\\my_mod\\data\\mat.rvmat"] — настраивает качество поверхности и блики.', type: 'array_of_strings', defaultValue: [], placement: 'root' },
            { key: 'repairableWithKits', label: 'Repair Kits', description: 'ID ремонтных наборов, с помощью которых можно починить данный предмет.', example: '5 - швейный набор, 2 - набор для кожи, 3 - набор электрика.', type: 'array_of_numbers', defaultValue: [5, 2], placement: 'root' },
            { key: 'repairCosts', label: 'Repair Costs', description: 'Количество используемых ресурсов (в процентах) из ремонтного набора при починке этого предмета.', example: '[25, 30] — 1-й набор потратит 25% ресурса, 2-й набор — 30%.', type: 'array_of_numbers', defaultValue: [25, 25], placement: 'root' },
            { key: 'varWetMax', label: 'Max Wetness', description: 'Максимальный уровень намокания предмета. Влияет на итоговый вес и теплоизоляцию под дождем.', example: '1.0 — предмет полностью промокает (100%). 0.0 — водонепроницаемый (0%).', type: 'number', defaultValue: 1.0, placement: 'root' },
            { key: 'heatIsolation', label: 'Heat Isolation', description: 'Показатель теплоизоляции предмета. Влияет на то, насколько эффективно одежда согревает персонажа.', example: '0.1 — плохая изоляция (футболка), 0.9 — отличная изоляция (зимняя куртка).', type: 'number', defaultValue: 0.5, placement: 'root' },
            { key: 'quickBarBonus', label: 'Quickbar Bonus Slots', description: 'Количество дополнительных слотов быстрого доступа, которые добавляет предмет при надевании.', example: '1, 2, 3 или 4. Например, разгрузочный жилет может добавлять 4 слота.', type: 'number', defaultValue: 0, placement: 'root' },
            { key: 'visibilityModifier', label: 'Visibility Modifier', description: 'Модификатор заметности для ИИ (зомби и животных). Снижение значения усиливает камуфляж.', example: '1.0 — стандартная видимость, 0.8 — улучшенный камуфляж (-20% заметности).', type: 'number', defaultValue: 1.0, placement: 'root' },
        ]
    },
    {
        id: 'clothingTypes',
        title: 'Типы одежды (ClothingTypes)',
        description: 'Пути к моделям мужских и женских персонажей.',
        params: [
            { key: 'male', label: 'Male Model', description: 'Путь к 3D модели одежды (.p3d), которая используется, когда предмет надет на мужского персонажа.', example: '\\dz\\characters\\tops\\jacket_m.p3d', type: 'string', defaultValue: '', placement: 'ClothingTypes' },
            { key: 'female', label: 'Female Model', description: 'Путь к 3D модели одежды (.p3d), которая используется, когда предмет надет на женского персонажа.', example: '\\dz\\characters\\tops\\jacket_f.p3d', type: 'string', defaultValue: '', placement: 'ClothingTypes' },
        ]
    },
    {
        id: 'damageSystem',
        title: 'Система урона (DamageSystem)',
        description: 'Здоровье, броня и модификаторы.',
        params: [
            { key: 'hitpoints', label: 'Global Health', description: 'Базовое количество очков прочности (Health) самого предмета.', example: '100 — штатное здоровье, 1000 — высокая прочность. При достижении 0 предмет разрушается.', type: 'number', defaultValue: 100, placement: 'DamageSystem.GlobalHealth.Health' },
            { key: 'healthLevels', label: 'Health Levels (.rvmat пути)', description: 'Пути к материалам (.rvmat) для визуального отображения повреждений предмета. Автогенерация скриптом для всех зон.', example: 'Впишите путь к чистому .rvmat, например: \\dz\\data\\my_material.rvmat', type: 'array_of_strings', defaultValue: [], placement: 'DamageSystem.GlobalHealth.Health' },
            { key: 'armorProjectile', label: 'Armor (Projectile)', description: 'Множитель проходящего урона по персонажу от огнестрельного оружия при попадании в зону этого предмета.', example: 'Health: 0.5 — пропускает 50% урона в тело (дает 50% защиты).', type: 'armor_modifier', defaultValue: { Health: 1.0, Blood: 1.0, Shock: 1.0 }, placement: 'DamageSystem.GlobalArmor.Projectile' },
            { key: 'armorMelee', label: 'Armor (Melee)', description: 'Множитель проходящего урона по персонажу от атак ближнего боя или холодного оружия (ножи, топоры, кулаки).', example: 'Health: 0.8 — значение снижает получаемый ХП урон на 20%.', type: 'armor_modifier', defaultValue: { Health: 1.0, Blood: 1.0, Shock: 1.0 }, placement: 'DamageSystem.GlobalArmor.Melee' },
            { key: 'armorFrag', label: 'Armor (Frag Grenade)', description: 'Множитель проходящего урона по персонажу от взрывных осколков (гранаты, мины).', example: 'Health: 0.5 — защищает от 50% урона гранаты.', type: 'armor_modifier', defaultValue: { Health: 1.0, Blood: 1.0, Shock: 1.0 }, placement: 'DamageSystem.GlobalArmor.FragGrenade' },
            { key: 'armorInfected', label: 'Armor (Infected)', description: 'Множитель проходящего урона по персонажу от ударов зараженных (зомби).', example: 'Blood: 0.1 — шанс кровотечения от атак зомби почти равен нулю.', type: 'armor_modifier', defaultValue: { Health: 1.0, Blood: 1.0, Shock: 1.0 }, placement: 'DamageSystem.GlobalArmor.Infected' },
        ]
    },
    {
        id: 'animEvents',
        title: 'Звуковые события (AnimEvents)',
        description: 'Звуки взаимодействия с предметом (SoundWeapon).',
        params: [
            {
                key: 'dropSoundSet',
                label: 'Drop Soundset',
                description: 'Звуковой пресет (SoundSet), который воспроизводится, когда игрок выбрасывает этот предмет из инвентаря на землю.',
                example: 'Shirt_drop_SoundSet — стандартный звук падающей одежды.',
                type: 'anim_event',
                defaultValue: { soundSet: 'Shirt_drop_SoundSet', id: 898 },
                placement: 'AnimEvents.SoundWeapon.drop',
                options: [
                    { label: "Athletic Shoes", soundSet: "AthleticShoes_drop_SoundSet", id: 898 },
                    { label: "Ballistic Helmet", soundSet: "BallisticHelmet_drop_SoundSet", id: 898 },
                    { label: "Dark Moto Helmet", soundSet: "DarkMotoHelmet_drop_SoundSet", id: 898 },
                    { label: "Great Helm", soundSet: "GreatHelm_drop_SoundSet", id: 898 },
                    { label: "Shirt (Default)", soundSet: "Shirt_drop_SoundSet", id: 898 },
                    { label: "Smersh Vest", soundSet: "SmershVest_drop_SoundSet", id: 898 },
                    { label: "Sport Glasses", soundSet: "SportGlasses_drop_SoundSet", id: 898 },
                    { label: "Taloon Bag", soundSet: "taloonbag_drop_SoundSet", id: 898 },
                    { label: "Working Gloves", soundSet: "WorkingGloves_drop_SoundSet", id: 898 },
                ]
            },
            {
                key: 'pickUpSoundSet',
                label: 'Pickup Soundset',
                description: 'Звуковой пресет (SoundSet), который воспроизводится, когда игрок забирает этот предмет с земли в инвентарь или в руки.',
                example: 'Shirt_pickup_SoundSet — звук подбираемой одежды.',
                type: 'anim_event',
                defaultValue: { soundSet: 'Shirt_pickup_SoundSet', id: 797 },
                placement: 'AnimEvents.SoundWeapon.pickUpItem',
                options: [
                    { label: "Athletic Shoes", soundSet: "AthleticShoes_pickup_SoundSet", id: 797 },
                    { label: "Dark Moto Helmet", soundSet: "DarkMotoHelmet_pickup_SoundSet", id: 797 },
                    { label: "Leather Backpack", soundSet: "pickUpBackPack_Leather_SoundSet", id: 797 },
                    { label: "Metal Backpack", soundSet: "pickUpBackPack_Metal_SoundSet", id: 797 },
                    { label: "Plastic Backpack", soundSet: "pickUpBackPack_Plastic_SoundSet", id: 797 },
                    { label: "Courier Bag", soundSet: "pickUpCourierBag_SoundSet", id: 797 },
                    { label: "Generic Item", soundSet: "pickUpItem_SoundSet", id: 797 },
                    { label: "Cooking Pot", soundSet: "pickUpPot_SoundSet", id: 797 },
                    { label: "Tent", soundSet: "pickUpTent_SoundSet", id: 797 },
                    { label: "Shirt (Default)", soundSet: "Shirt_pickup_SoundSet", id: 797 },
                    { label: "Smersh Vest", soundSet: "SmershVest_pickup_SoundSet", id: 797 },
                    { label: "Sport Glasses", soundSet: "SportGlasses_pickup_SoundSet", id: 797 },
                    { label: "Working Gloves", soundSet: "WorkingGloves_pickup_SoundSet", id: 797 },
                ]
            },
        ]
    },
];
