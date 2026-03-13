export type ParamType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'array_of_strings' | 'array_of_numbers' | 'armor_modifier' | 'anim_event' | 'select' | 'multi-select' | 'combobox';

export interface AnimEventOption {
    label: string;
    soundSet: string;
    id: number;
}

export interface SelectOption {
    value: string;
    label: string;
    description: string;
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
    selectOptions?: SelectOption[]; // for select type
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
            { 
                key: 'inventorySlot', 
                label: 'Inventory Slot', 
                description: 'Слот экипировки персонажа, в который можно надеть данный предмет.', 
                type: 'combobox', 
                defaultValue: 'Headgear', 
                placement: 'root',
                selectOptions: [
                    { value: 'Shoulder', label: 'Shoulder', description: 'Слот для основного оружия.' },
                    { value: 'Melee', label: 'Melee', description: 'Слот для холодного оружия.' },
                    { value: 'Vest', label: 'Vest', description: 'Слот для жилета.' },
                    { value: 'Body', label: 'Body', description: 'Слот для одежды на торс.' },
                    { value: 'Hips', label: 'Hips', description: 'Слот на поясе.' },
                    { value: 'Legs', label: 'Legs', description: 'Слот для штанов.' },
                    { value: 'Back', label: 'Back', description: 'Слот для рюкзака.' },
                    { value: 'Headgear', label: 'Headgear', description: 'Слот для головного убора.' },
                    { value: 'Mask', label: 'Mask', description: 'Слот для маски.' },
                    { value: 'Eyewear', label: 'Eyewear', description: 'Слот для очков.' },
                    { value: 'Gloves', label: 'Gloves', description: 'Слот для перчаток.' },
                    { value: 'Feet', label: 'Feet', description: 'Слот для обуви.' },
                    { value: 'Armband', label: 'Armband', description: 'Слот для нарукавной повязки.' },
                    { value: 'Handyman', label: 'Handyman', description: 'Слот для инструментов.' }
                ]
            },
            {
                key: 'repairable',
                label: 'Repairable',
                description: 'Определяет, можно ли чинить предмет.',
                type: 'select',
                defaultValue: 1,
                placement: 'root',
                selectOptions: [
                    { value: '1', label: 'Да', description: 'Предмет можно чинить.' },
                    { value: '0', label: 'Нет', description: 'Предмет нельзя чинить.' }
                ]
            },
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
            { key: 'varQuantityInit', label: 'Initial Quantity', description: 'Начальное количество ресурса/предметов в стеке при появлении предмета.', example: '250 — в предмете будет 250 единиц (например, патронов или прочности ткани).', type: 'number', defaultValue: 250, placement: 'root' },
            { key: 'varQuantityMin', label: 'Min Quantity', description: 'Минимально возможное количество ресурса в предмете.', example: '0 — стандарт для большинства предметов.', type: 'number', defaultValue: 0, placement: 'root' },
            { key: 'varQuantityMax', label: 'Max Quantity', description: 'Максимально возможное количество ресурса в предмете (полный стек).', example: '250 — максимальный объем.', type: 'number', defaultValue: 250, placement: 'root' },
            {
                key: 'stackedUnit',
                label: 'Stacked Unit',
                description: 'Тип единицы измерения, которая отображается рядом с количеством предмета в инвентаре.',
                type: 'select',
                defaultValue: 'w',
                placement: 'root',
                selectOptions: [
                    { value: 'ml', label: 'ml', description: 'Миллилитры. Обычно используется для жидкостей (вода, бензин, кровь).' },
                    { value: 'pills', label: 'pills', description: 'Таблетки. Используется для медикаментов в упаковках.' },
                    { value: 'g', label: 'g', description: 'Граммы. Используется для еды или сыпучих материалов.' },
                    { value: 'percentage', label: 'percentage', description: 'Проценты (%). Используется для батареек и ресурсов.' },
                    { value: 'w', label: 'w', description: 'Целые единицы (Whole). Стандартное отображение для большинства предметов.' },
                    { value: 'NA', label: 'NA', description: 'Не применимо (Not Applicable).' }
                ]
            },
            { key: 'quantityBar', label: 'Show Quantity Bar', description: 'Отображать полоску количества предмета (прочность/объем) в инвентаре.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'absorbency', label: 'Absorbency', description: 'Коэффициент впитывания влаги. Определяет, как быстро предмет тяжелеет и становится мокрым.', example: '0.0 — не впитывает, 0.5 — среднее впитывание.', type: 'number', defaultValue: 0.0, placement: 'root' },
        ]
    },
    {
        id: 'clothing',
        title: 'Одежда и маскировка',
        description: 'Параметры скрытия частей тела и взаимодействия с другими элементами одежды.',
        params: [
            { key: 'noHelmet', label: 'No Helmet', description: 'Запретить надевание шлема вместе с этим предметом.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'noMask', label: 'No Mask', description: 'Запретить надевание маски вместе с этим предметом.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'noEyewear', label: 'No Eyewear', description: 'Запретить надевание очков вместе с этим предметом.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'noNVStrap', label: 'No NVG Strap', description: 'Скрывать ремешок ПНВ при надевании этого предмета.', type: 'boolean', defaultValue: false, placement: 'root' },
            {
                key: 'headSelectionsToHide',
                label: 'Hide Head Selections',
                description: 'Часть головы, которая будет скрыта при надевании предмета (для предотвращения "клиппинга").',
                type: 'combobox',
                defaultValue: '',
                placement: 'root',
                selectOptions: [
                    { value: 'Clipping_AirborneMask', label: 'Airborne Mask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Balaclava', label: 'Balaclava', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Balaclava_3holes', label: 'Balaclava 3holes', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_BandanaFace', label: 'Bandana Face', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_BandanaHead', label: 'Bandana Head', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_baseballcap', label: 'Baseballcap', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_BeanieHat', label: 'Beanie Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_BoonieHat', label: 'Boonie Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_BurlapSack', label: 'Burlap Sack', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_ConstructionHelmet', label: 'Construction Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_CowboyHat', label: 'Cowboy Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_FireHelmet', label: 'Fire Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_FlatCap', label: 'Flat Cap', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Gasmask', label: 'Gasmask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_GhillieHood', label: 'Ghillie Hood', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_GP5GasMask', label: 'GP5 Gas Mask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_grathelm', label: 'Grathelm', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Hat_leather', label: 'Hat Leather', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_headCover_improvised', label: 'Head Cover Improvised', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_HeadTorch', label: 'Head Torch', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_HelmetMich', label: 'Helmet Mich', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_HeloHelmet', label: 'Helo Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Hockey_hekmet', label: 'Hockey Hekmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Hockey_helmet', label: 'Hockey Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Maska', label: 'Maska', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_MedicalScrubs_Hat', label: 'Medical Scrubs Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Mich2001', label: 'Mich 2001', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_MilitaryBeret', label: 'Military Beret', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_MilitaryBeret_xx', label: 'Military Beret Xx', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_MotoHelmet', label: 'Moto Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_mouth_rags', label: 'Mouth Rags', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_MxHelmet', label: 'Mx Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_NBC_Hood', label: 'NBC Hood', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_NioshFaceMask', label: 'Niosh Face Mask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_NVGHeadstrap', label: 'NVG Headstrap', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_OfficerHat', label: 'Officer Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_pilotka', label: 'Pilotka', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Policecap', label: 'Policecap', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_prison_cap', label: 'Prison Cap', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_ProtecSkateHelmet2', label: 'Protec Skate Helmet2', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_PumpkinHelmet', label: 'Pumpkin Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_RadarCap', label: 'Radar Cap', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_SantasBeard', label: 'Santas Beard', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_SantasHat', label: 'Santas Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Ssh68Helmet', label: 'Ssh68 Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Surgical_mask', label: 'Surgical Mask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_TankerHelmet', label: 'Tanker Helmet', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_ushanka', label: 'Ushanka', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_VintageHockeyMask', label: 'Vintage Hockey Mask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_Welding_Mask', label: 'Welding Mask', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_WitchHat', label: 'Witch Hat', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_WitchHood', label: 'Witch Hood', description: 'Значение из DZ/characters.' },
                    { value: 'Clipping_ZmijovkaCap', label: 'Zmijovka Cap', description: 'Значение из DZ/characters.' }
                ]
            }
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
            { key: 'durability', label: 'Durability Modifier', description: 'Множитель долговечности предмета. Влияет на то, как быстро предмет теряет прочность при использовании.', example: '1.0 — стандарт. 5.0 — предмет в 5 раз долговечнее.', type: 'number', defaultValue: 1.0, placement: 'DamageSystem.GlobalHealth' },
        ]
    },
    {
        id: 'sound',
        title: 'Звуковые параметры',
        description: 'Параметры взаимодействия предмета со звуковым движком игры.',
        params: [
            {
                key: 'soundImpactType',
                label: 'Impact Sound Type',
                description: 'Тип звука при ударе предмета о поверхность (падение, бросок).',
                type: 'select',
                defaultValue: 'default',
                placement: 'root',
                selectOptions: [
                    { value: 'default', label: 'Default', description: 'Стандартный звук.' },
                    { value: 'metal', label: 'Metal', description: 'Звук удара металла.' },
                    { value: 'plastic', label: 'Plastic', description: 'Звук удара пластика.' },
                    { value: 'organic', label: 'Organic', description: 'Звук удара мягкого/органического материала.' },
                    { value: 'glass', label: 'Glass', description: 'Звук удара стекла.' }
                ]
            },
            {
                key: 'soundVoiceType',
                label: 'Voice Muffle Type',
                description: 'Определяет эффект глушения голоса персонажа, когда на нем надет этот предмет.',
                type: 'select',
                defaultValue: 'none',
                placement: 'root',
                selectOptions: [
                    { value: 'none', label: 'None', description: 'Без эффекта глушения.' },
                    { value: 'gasmask', label: 'Gasmask', description: 'Эффект противогаза (затрудненное дыхание, глухой звук).' },
                    { value: 'gag', label: 'Gag', description: 'Эффект кляпа (неразборчивая речь).' },
                    { value: 'motohelmet', label: 'Moto Helmet', description: 'Эффект мотоциклетного шлема.' },
                    { value: 'metalhelmet', label: 'Metal Helmet', description: 'Эффект стального шлема.' }
                ]
            },
            {
                key: 'soundVoicePriority',
                label: 'Voice Muffle Priority',
                description: 'Приоритет эффекта глушения. Если надето несколько предметов с эффектом, выберется тот, у кого приоритет выше.',
                type: 'select',
                defaultValue: 5,
                placement: 'root',
                selectOptions: [
                    { value: '5', label: 'Low (5)', description: 'Низкий приоритет.' },
                    { value: '10', label: 'Medium (10)', description: 'Средний приоритет.' },
                    { value: '15', label: 'High (15)', description: 'Высокий приоритет (гарантированное перекрытие).' }
                ]
            },
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
