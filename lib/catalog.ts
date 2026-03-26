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

const COMMON_ITEM_INFO_OPTIONS: SelectOption[] = [
    { value: 'Clothing', label: 'Clothing', description: 'Одежда и носимые предметы.' },
    { value: 'Headgear', label: 'Headgear', description: 'Головной убор.' },
    { value: 'Mask', label: 'Mask', description: 'Маска или защита лица.' },
    { value: 'Eyewear', label: 'Eyewear', description: 'Очки и оптика на лицо.' },
    { value: 'Gloves', label: 'Gloves', description: 'Перчатки.' },
    { value: 'Footwear', label: 'Footwear', description: 'Обувь.' },
    { value: 'Vest', label: 'Vest', description: 'Жилет или разгрузка.' },
    { value: 'Body', label: 'Body', description: 'Одежда на торс.' },
    { value: 'Legs', label: 'Legs', description: 'Штаны и одежда на ноги.' },
    { value: 'Back', label: 'Back', description: 'Рюкзак или предмет на спину.' },
    { value: 'Container', label: 'Container', description: 'Контейнер или ёмкость.' },
    { value: 'Food', label: 'Food', description: 'Еда.' },
    { value: 'Drink', label: 'Drink', description: 'Напитки и жидкости.' },
    { value: 'Medical', label: 'Medical', description: 'Медицинские предметы.' },
    { value: 'Weapon', label: 'Weapon', description: 'Оружие.' },
    { value: 'Magazine', label: 'Magazine', description: 'Магазины и боеприпасы.' },
    { value: 'Tool', label: 'Tool', description: 'Инструменты.' },
    { value: 'Electronics', label: 'Electronics', description: 'Электронные устройства.' },
    { value: 'Ammo', label: 'Ammo', description: 'Боеприпасы россыпью.' },
    { value: 'Explosive', label: 'Explosive', description: 'Взрывчатка и гранаты.' },
    { value: 'Optics', label: 'Optics', description: 'Оптика и прицелы.' },
    { value: 'Material', label: 'Material', description: 'Строительный или крафтовый материал.' },
];

const COMMON_ATTACHMENT_OPTIONS: SelectOption[] = [
    { value: 'Chemlight', label: 'Chemlight', description: 'Слот для химсвета.' },
    { value: 'WalkieTalkie', label: 'WalkieTalkie', description: 'Слот для рации.' },
    { value: 'weaponOptics', label: 'weaponOptics', description: 'Универсальный слот оптики оружия.' },
    { value: 'weaponOpticsAK', label: 'weaponOpticsAK', description: 'Слот оптики платформы AK.' },
    { value: 'weaponOpticsMosin', label: 'weaponOpticsMosin', description: 'Слот оптики Mosin.' },
    { value: 'weaponOpticsLRS', label: 'weaponOpticsLRS', description: 'Слот Long Range Scope.' },
    { value: 'weaponOpticsHunting', label: 'weaponOpticsHunting', description: 'Слот охотничьей оптики.' },
    { value: 'weaponOpticsCrossbow', label: 'weaponOpticsCrossbow', description: 'Слот оптики арбалета/Longhorn.' },
    { value: 'weaponMuzzle', label: 'weaponMuzzle', description: 'Универсальный слот muzzle-насадок.' },
    { value: 'weaponMuzzleAK', label: 'weaponMuzzleAK', description: 'Слот muzzle-насадок платформы AK.' },
    { value: 'weaponMuzzleM4', label: 'weaponMuzzleM4', description: 'Слот muzzle-насадок платформы M4.' },
    { value: 'weaponMuzzleMosin', label: 'weaponMuzzleMosin', description: 'Слот muzzle-насадок Mosin.' },
    { value: 'weaponMuzzleMP5', label: 'weaponMuzzleMP5', description: 'Слот muzzle-насадок MP5.' },
    { value: 'weaponFlashlight', label: 'weaponFlashlight', description: 'Слот фонаря/лазера на оружии.' },
    { value: 'weaponWrap', label: 'weaponWrap', description: 'Слот ghillie wrap и обмоток оружия.' },
    { value: 'weaponBayonet', label: 'weaponBayonet', description: 'Универсальный слот штыка.' },
    { value: 'weaponBayonetAK', label: 'weaponBayonetAK', description: 'Слот штыка платформы AK.' },
    { value: 'weaponBayonetMosin', label: 'weaponBayonetMosin', description: 'Слот штыка Mosin.' },
    { value: 'weaponBayonetSKS', label: 'weaponBayonetSKS', description: 'Слот штыка SKS.' },
    { value: 'Shoulder', label: 'Shoulder', description: 'Слот длинного оружия на плечо.' },
    { value: 'Melee', label: 'Melee', description: 'Слот для мили-оружия.' },
    { value: 'Headgear', label: 'Headgear', description: 'Слот для головного убора.' },
    { value: 'Mask', label: 'Mask', description: 'Слот для маски.' },
    { value: 'Eyewear', label: 'Eyewear', description: 'Слот для очков.' },
    { value: 'Vest', label: 'Vest', description: 'Слот для жилета.' },
    { value: 'Body', label: 'Body', description: 'Слот для одежды на торс.' },
    { value: 'Hips', label: 'Hips', description: 'Слот на пояс.' },
    { value: 'Back', label: 'Back', description: 'Слот на спину.' },
    { value: 'Armband', label: 'Armband', description: 'Слот нарукавной повязки.' },
    { value: 'Gloves', label: 'Gloves', description: 'Слот перчаток.' },
    { value: 'Feet', label: 'Feet', description: 'Слот обуви.' },
    { value: 'BatteryD', label: 'BatteryD', description: 'Слот под D-батарейку.' },
    { value: 'Battery9V', label: 'Battery9V', description: 'Слот под 9V батарейку.' },
    { value: 'CarBattery', label: 'CarBattery', description: 'Слот автомобильного аккумулятора.' },
    { value: 'TruckBattery', label: 'TruckBattery', description: 'Слот грузового аккумулятора.' },
    { value: 'SparkPlug', label: 'SparkPlug', description: 'Слот свечи зажигания.' },
    { value: 'GlowPlug', label: 'GlowPlug', description: 'Слот калильной свечи.' },
    { value: 'CanisterGas', label: 'CanisterGas', description: 'Слот для газового баллона.' },
    { value: 'GasCanister', label: 'GasCanister', description: 'Слот под малый/средний/большой газовый баллон.' },
    { value: 'MetalWire', label: 'MetalWire', description: 'Слот металлической проволоки.' },
    { value: 'Material_MetalWire', label: 'Material_MetalWire', description: 'Строительный слот проволоки.' },
    { value: 'Material_FPole_MetalWire', label: 'Material_FPole_MetalWire', description: 'Слот проволоки у флагштока.' },
    { value: 'Att_CombinationLock', label: 'Att_CombinationLock', description: 'Слот кодового замка.' },
];

const DAYZ_INVENTORY_SLOT_OPTIONS: SelectOption[] = [
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
    { value: 'Handyman', label: 'Handyman', description: 'Слот для инструментов.' },
    { value: 'material_l1', label: 'material_l1', description: 'Строительный слот материалов первого уровня.' },
    { value: 'magazine', label: 'magazine', description: 'Основной слот магазина.' },
    { value: 'magazine2', label: 'magazine2', description: 'Дополнительный магазинный слот.' },
    { value: 'magazine3', label: 'magazine3', description: 'Третий магазинный слот.' },
    { value: 'TriggerAlarmClock', label: 'TriggerAlarmClock', description: 'Слот триггера будильника.' },
    { value: 'TriggerKitchenTimer', label: 'TriggerKitchenTimer', description: 'Слот триггера кухонного таймера.' },
    { value: 'TriggerRemoteDetonator_Receiver', label: 'TriggerRemoteDetonator_Receiver', description: 'Слот приёмника удалённого детонатора.' },
    { value: 'Backpack_1', label: 'Backpack_1', description: 'Дополнительный backpack slot, встречается в ванильных proxy/utility кейсах.' },
    { value: 'weaponOptics', label: 'weaponOptics', description: 'Инвентарный слот оптики.' },
    { value: 'weaponOpticsAK', label: 'weaponOpticsAK', description: 'Инвентарный слот оптики AK.' },
    { value: 'weaponOpticsMosin', label: 'weaponOpticsMosin', description: 'Инвентарный слот оптики Mosin.' },
    { value: 'weaponOpticsLRS', label: 'weaponOpticsLRS', description: 'Инвентарный слот LRS.' },
    { value: 'weaponOpticsHunting', label: 'weaponOpticsHunting', description: 'Инвентарный слот охотничьей оптики.' },
    { value: 'weaponOpticsCrossbow', label: 'weaponOpticsCrossbow', description: 'Инвентарный слот оптики арбалета.' },
    { value: 'weaponMuzzle', label: 'weaponMuzzle', description: 'Инвентарный слот muzzle-насадок.' },
    { value: 'weaponMuzzleAK', label: 'weaponMuzzleAK', description: 'Инвентарный слот muzzle AK.' },
    { value: 'weaponMuzzleM4', label: 'weaponMuzzleM4', description: 'Инвентарный слот muzzle M4.' },
    { value: 'weaponMuzzleMosin', label: 'weaponMuzzleMosin', description: 'Инвентарный слот muzzle Mosin.' },
    { value: 'weaponMuzzleMP5', label: 'weaponMuzzleMP5', description: 'Инвентарный слот muzzle MP5.' },
    { value: 'weaponBayonet', label: 'weaponBayonet', description: 'Инвентарный слот универсального штыка.' },
    { value: 'weaponBayonetAK', label: 'weaponBayonetAK', description: 'Инвентарный слот штыка AK.' },
    { value: 'weaponBayonetMosin', label: 'weaponBayonetMosin', description: 'Инвентарный слот штыка Mosin.' },
    { value: 'weaponBayonetSKS', label: 'weaponBayonetSKS', description: 'Инвентарный слот штыка SKS.' },
    { value: 'weaponWrap', label: 'weaponWrap', description: 'Инвентарный слот ghillie wrap.' },
    { value: 'weaponFlashlight', label: 'weaponFlashlight', description: 'Инвентарный слот оружейного фонаря/лазера.' },
];

const COMMON_HIDDEN_SELECTION_OPTIONS: SelectOption[] = [
    { value: 'camoGround', label: 'camoGround', description: 'Часто используется для основной секции предмета.' },
    { value: 'camo', label: 'camo', description: 'Базовая камуфляжная секция модели.' },
    { value: 'zbytek', label: 'zbytek', description: 'Дополнительная секция модели.' },
    { value: 'personality', label: 'personality', description: 'Секция лица/персонажа в некоторых моделях.' },
    { value: 'hide', label: 'hide', description: 'Скрываемая секция.' },
];

const QUICKBAR_BONUS_OPTIONS: SelectOption[] = [
    { value: '0', label: '0', description: 'Без дополнительных слотов.' },
    { value: '1', label: '1', description: 'Один дополнительный слот.' },
    { value: '2', label: '2', description: 'Два дополнительных слота.' },
    { value: '3', label: '3', description: 'Три дополнительных слота.' },
    { value: '4', label: '4', description: 'Четыре дополнительных слота.' },
];

const DAYZ_REPAIR_KIT_OPTIONS: SelectOption[] = [
    { value: '0', label: '0 - Нет ремонта / disabled', description: 'Используется в части ванильных классов как отсутствие нормального ремонта.' },
    { value: '1', label: '1 - WeaponCleaningKit', description: 'Оружие, магазины, часть muzzle/weapon attachments.' },
    { value: '2', label: '2 - SewingKit', description: 'Ткань, одежда и часть мягких контейнеров.' },
    { value: '3', label: '3 - LeatherSewingKit', description: 'Кожа, обувь, жилеты и часть жёстких предметов экипировки.' },
    { value: '4', label: '4 - Whetstone', description: 'Ножи, лезвия, часть melee и режущих насадок.' },
    { value: '5', label: '5 - DuctTape', description: 'Универсальный расходник для ткани, кемпинга и части утилитарных предметов.' },
    { value: '6', label: '6 - TireRepairKit', description: 'Шины и часть автомобильных предметов.' },
    { value: '7', label: '7 - ElectronicRepairKit', description: 'Электроника, рации, оптика, батарейные устройства.' },
    { value: '8', label: '8 - EpoxyPutty', description: 'Пластик, композит, некоторые шлемы, маски и контейнеры.' },
    { value: '10', label: '10 - Blowtorch', description: 'Металлические контейнеры, cooking gear и часть тяжёлых предметов.' },
];

const DAYZ_LIQUID_TYPE_OPTIONS: SelectOption[] = [
    { value: '1', label: 'LIQUID_BLOOD_0_P', description: 'Кровь O+.' },
    { value: '2', label: 'LIQUID_BLOOD_0_N', description: 'Кровь O-.' },
    { value: '4', label: 'LIQUID_BLOOD_A_P', description: 'Кровь A+.' },
    { value: '8', label: 'LIQUID_BLOOD_A_N', description: 'Кровь A-.' },
    { value: '16', label: 'LIQUID_BLOOD_B_P', description: 'Кровь B+.' },
    { value: '32', label: 'LIQUID_BLOOD_B_N', description: 'Кровь B-.' },
    { value: '64', label: 'LIQUID_BLOOD_AB_P', description: 'Кровь AB+.' },
    { value: '128', label: 'LIQUID_BLOOD_AB_N', description: 'Кровь AB-.' },
    { value: '256', label: 'LIQUID_SALINE', description: 'Физраствор.' },
    { value: '512', label: 'LIQUID_WATER', description: 'Обычная вода.' },
    { value: '1024', label: 'LIQUID_RIVERWATER', description: 'Речная вода.' },
    { value: '2048', label: 'LIQUID_VODKA', description: 'Водка.' },
    { value: '4096', label: 'LIQUID_BEER', description: 'Пиво.' },
    { value: '8192', label: 'LIQUID_GASOLINE', description: 'Бензин.' },
    { value: '16384', label: 'LIQUID_DIESEL', description: 'Дизель.' },
    { value: '32768', label: 'LIQUID_DISINFECTANT', description: 'Дезинфектант.' },
    { value: '65536', label: 'LIQUID_SOLUTION', description: 'Раствор (например sodium bicarbonate).' },
    { value: '131072', label: 'LIQUID_SNOW', description: 'Снег.' },
    { value: '262144', label: 'LIQUID_SALTWATER', description: 'Солёная вода.' },
    { value: '524288', label: 'LIQUID_FRESHWATER', description: 'Пресная вода.' },
    { value: '1048576', label: 'LIQUID_STILLWATER', description: 'Стоячая вода.' },
    { value: '2097152', label: 'LIQUID_HOTWATER', description: 'Горячая вода.' },
    { value: '4194304', label: 'LIQUID_CLEANWATER', description: 'Чистая вода.' },
];

const DAYZ_LIQUID_CONTAINER_OPTIONS: SelectOption[] = [
    { value: '0', label: '0 - Пустой / не задан', description: 'Контейнер без заданной маски жидкостей.' },
    { value: '1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256', label: 'Blood + Saline', description: 'Все группы крови и физраствор.' },
    { value: '1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 + 512 + 1024 + 2048 + 4096 + 8192 + 16384 + 32768 + 65536  + 131072 + 262144 + 524288 + 2097152 + 4194304', label: 'CONTAINER_ALL', description: 'Полная ванильная маска всех поддерживаемых жидкостей.' },
    { value: '1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 + 512 + 1024 + 2048 + 4096 + 8192 + 16384 + 32768 + 65536  + 131072 + 262144 + 524288 + 2097152 + 4194304 - (1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256) - 32768', label: 'CONTAINER_ALL_BLOODLESS', description: 'Все жидкости, кроме крови и дезинфектанта. Частый пресет для бутылок и фляг.' },
    { value: '1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 + 512 + 1024 + 2048 + 4096 + 8192 + 16384 + 32768 + 65536  + 131072 + 262144 + 524288 + 2097152 + 4194304 - (1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256) - 32768 - 8192 - 16384', label: 'CONTAINER_ALL_GASOLINELESS', description: 'Все жидкости, кроме крови, дезинфектанта, бензина и дизеля.' },
];

const DAYZ_PLUG_TYPE_OPTIONS: SelectOption[] = [
    { value: '0', label: '0 - Без plug type', description: 'Предмет не объявляет тип разъёма.' },
    { value: '1', label: '1 - Handheld battery-powered', description: 'Часто встречается у фонарей, ПНВ, оптики, раций и прочей портативной электроники.' },
    { value: '2', label: '2 - Cable / powered network', description: 'Часто встречается у лагерных электроприборов и кабельных цепочек.' },
    { value: '4', label: '4 - Vehicle battery side', description: 'Используется у автомобильных/грузовых аккумуляторов как источник питания.' },
    { value: '5', label: '5 - Car battery consumer', description: 'Встречается у крупной рации и похожих устройств, которые запитываются от автомобильного источника.' },
    { value: '6', label: '6 - Generator network', description: 'Встречается у источников/сетевых устройств генераторной цепочки.' },
    { value: '7', label: '7 - Gas appliance ignition', description: 'Часто используется у газовой плиты, blowtorch и похожих cooking/utility устройств.' },
    { value: '8', label: '8 - Vehicle battery consumer side', description: 'Встречается у кабелей/переходников для подключения к аккумуляторам.' },
];

const DAYZ_ATTACHMENT_ACTION_OPTIONS: SelectOption[] = [
    { value: '0', label: '0 - Нет спецдействия', description: 'Простое подключение без особой логики активации.' },
    { value: '1', label: '1 - Авто-активация/использование питания', description: 'Частый вариант для handheld и большинства стандартных энергопотребителей.' },
    { value: '2', label: '2 - Кабель/сетевое подключение', description: 'Встречается у аккумуляторов, ламп и сетевых устройств лагерной электрики.' },
];

const DAYZ_SOUND_IMPACT_OPTIONS: SelectOption[] = [
    { value: 'default', label: 'Default', description: 'Стандартный универсальный звук.' },
    { value: 'metal', label: 'Metal', description: 'Металл.' },
    { value: 'plastic', label: 'Plastic', description: 'Пластик.' },
    { value: 'organic', label: 'Organic', description: 'Органика, еда, мягкие материалы.' },
    { value: 'glass', label: 'Glass', description: 'Стекло.' },
    { value: 'wood', label: 'Wood', description: 'Дерево.' },
    { value: 'textile', label: 'Textile', description: 'Ткань, мягкие текстильные предметы.' },
    { value: 'gun', label: 'Gun', description: 'Огнестрельное оружие и близкие по семейству предметы.' },
    { value: 'grenade', label: 'Grenade', description: 'Гранаты и взрывчатые предметы.' },
];

const DAYZ_EXTRA_ATTACHMENT_OPTIONS: SelectOption[] = [
    { value: 'magazine', label: 'magazine', description: 'Primary magazine slot.' },
    { value: 'pistol', label: 'pistol', description: 'Pistol or short firearm slot.' },
    { value: 'pistolFlashlight', label: 'pistolFlashlight', description: 'Pistol flashlight or laser slot.' },
    { value: 'pistolMuzzle', label: 'pistolMuzzle', description: 'Pistol suppressor or muzzle slot.' },
    { value: 'pistolOptics', label: 'pistolOptics', description: 'Pistol optics slot.' },
    { value: 'weaponOpticsAug', label: 'weaponOpticsAug', description: 'AUG optics or carry-handle module slot.' },
    { value: 'suppressorImpro', label: 'suppressorImpro', description: 'Improvised suppressor slot.' },
    { value: 'weaponButtstockAK', label: 'weaponButtstockAK', description: 'AK buttstock slot.' },
    { value: 'weaponButtstockM4', label: 'weaponButtstockM4', description: 'M4 buttstock slot.' },
    { value: 'weaponButtstockMP5', label: 'weaponButtstockMP5', description: 'MP5 buttstock slot.' },
    { value: 'weaponButtstockFal', label: 'weaponButtstockFal', description: 'FAL buttstock slot.' },
    { value: 'weaponButtstockRed9', label: 'weaponButtstockRed9', description: 'Red9 buttstock slot.' },
    { value: 'weaponButtstockSaiga', label: 'weaponButtstockSaiga', description: 'Saiga buttstock slot.' },
    { value: 'weaponButtstockPP19', label: 'weaponButtstockPP19', description: 'PP-19 buttstock slot.' },
    { value: 'weaponHandguardAK', label: 'weaponHandguardAK', description: 'AK handguard slot.' },
    { value: 'weaponHandguardM4', label: 'weaponHandguardM4', description: 'M4 handguard slot.' },
    { value: 'weaponHandguardMP5', label: 'weaponHandguardMP5', description: 'MP5 handguard slot.' },
    { value: 'weaponHandguardM249', label: 'weaponHandguardM249', description: 'M249 handguard slot.' },
    { value: 'weaponBipod', label: 'weaponBipod', description: 'Universal bipod slot.' },
    { value: 'weaponBipodM249', label: 'weaponBipodM249', description: 'M249 bipod slot.' },
    { value: 'RevolverCylinder', label: 'RevolverCylinder', description: 'Revolver cylinder slot.' },
    { value: 'RevolverEjector', label: 'RevolverEjector', description: 'Revolver ejector slot.' },
    { value: 'tripWireAttachment', label: 'tripWireAttachment', description: 'Tripwire explosive attachment slot.' },
    { value: 'arrows', label: 'arrows', description: 'Crossbow arrow or bolt slot.' },
    { value: 'Knife', label: 'Knife', description: 'Knife slot in combined items.' },
];

const EXTENDED_ATTACHMENT_OPTIONS: SelectOption[] = [
    ...COMMON_ATTACHMENT_OPTIONS,
    ...DAYZ_EXTRA_ATTACHMENT_OPTIONS,
];

const EXTENDED_INVENTORY_SLOT_OPTIONS: SelectOption[] = [
    ...DAYZ_INVENTORY_SLOT_OPTIONS,
    ...DAYZ_EXTRA_ATTACHMENT_OPTIONS,
];


const FAMILY_MAGAZINE_OPTIONS: SelectOption[] = [
    { value: 'Mag_FNX45_15Rnd', label: '[Pistol .45] Mag_FNX45_15Rnd', description: 'FNX45 pistol magazine.' },
    { value: 'Mag_1911_7Rnd', label: '[Pistol .45] Mag_1911_7Rnd', description: '1911 pistol magazine.' },
    { value: 'Mag_Deagle_9rnd', label: '[Pistol .357] Mag_Deagle_9rnd', description: 'Deagle pistol magazine.' },
    { value: 'Mag_357Speedloader_6Rnd', label: '[Revolver .357] Mag_357Speedloader_6Rnd', description: 'Speedloader for .357 revolvers.' },
    { value: 'Mag_CZ75_15Rnd', label: '[Pistol 9x19] Mag_CZ75_15Rnd', description: 'CZ75 pistol magazine.' },
    { value: 'Mag_Glock_15Rnd', label: '[Pistol 9x19] Mag_Glock_15Rnd', description: 'Glock pistol magazine.' },
    { value: 'Mag_P1_8Rnd', label: '[Pistol 9x19] Mag_P1_8Rnd', description: 'P1 pistol magazine.' },
    { value: 'Mag_IJ70_8Rnd', label: '[Pistol .380] Mag_IJ70_8Rnd', description: 'IJ70 pistol magazine.' },
    { value: 'Mag_MakarovPB_8Rnd', label: '[Pistol .380] Mag_MakarovPB_8Rnd', description: 'PB pistol magazine.' },
    { value: 'Mag_Dartgun_CO2', label: '[Special] Mag_Dartgun_CO2', description: 'CO2 canister for dart gun.' },
    { value: 'Mag_MP5_15Rnd', label: '[SMG 9x19] Mag_MP5_15Rnd', description: 'MP5 15-round magazine.' },
    { value: 'Mag_MP5_30Rnd', label: '[SMG 9x19] Mag_MP5_30Rnd', description: 'MP5 30-round magazine.' },
    { value: 'Mag_PM73_15Rnd', label: '[SMG 9x19] Mag_PM73_15Rnd', description: 'PM73 15-round magazine.' },
    { value: 'Mag_PM73_25Rnd', label: '[SMG 9x19] Mag_PM73_25Rnd', description: 'PM73 25-round magazine.' },
    { value: 'Mag_CZ61_20Rnd', label: '[SMG .380] Mag_CZ61_20Rnd', description: 'CZ61 20-round magazine.' },
    { value: 'Mag_UMP_25Rnd', label: '[SMG .45] Mag_UMP_25Rnd', description: 'UMP 25-round magazine.' },
    { value: 'Mag_PP19_64Rnd', label: '[SMG 9x19] Mag_PP19_64Rnd', description: 'PP-19 64-round magazine.' },
    { value: 'Mag_STANAG_30Rnd', label: '[AR 5.56] Mag_STANAG_30Rnd', description: 'STANAG 30-round magazine.' },
    { value: 'Mag_STANAGCoupled_30Rnd', label: '[AR 5.56] Mag_STANAGCoupled_30Rnd', description: 'Coupled STANAG magazine.' },
    { value: 'Mag_STANAG_60Rnd', label: '[AR 5.56] Mag_STANAG_60Rnd', description: 'STANAG 60-round magazine.' },
    { value: 'Mag_CMAG_10Rnd', label: '[AR 5.56] Mag_CMAG_10Rnd', description: 'CMAG 10-round magazine.' },
    { value: 'Mag_CMAG_20Rnd', label: '[AR 5.56] Mag_CMAG_20Rnd', description: 'CMAG 20-round magazine.' },
    { value: 'Mag_CMAG_30Rnd', label: '[AR 5.56] Mag_CMAG_30Rnd', description: 'CMAG 30-round magazine.' },
    { value: 'Mag_CMAG_40Rnd', label: '[AR 5.56] Mag_CMAG_40Rnd', description: 'CMAG 40-round magazine.' },
    { value: 'Mag_AK101_30Rnd', label: '[AR 5.56] Mag_AK101_30Rnd', description: 'AK101 30-round magazine.' },
    { value: 'Mag_Aug_30Rnd', label: '[AR 5.56] Mag_Aug_30Rnd', description: 'AUG 30-round magazine.' },
    { value: 'Mag_FAMAS_25Rnd', label: '[AR 5.56] Mag_FAMAS_25Rnd', description: 'FAMAS 25-round magazine.' },
    { value: 'Mag_AK74_30Rnd', label: '[AR 5.45] Mag_AK74_30Rnd', description: 'AK74 30-round magazine.' },
    { value: 'Mag_AK74_45Rnd', label: '[AR 5.45] Mag_AK74_45Rnd', description: 'AK74 45-round magazine.' },
    { value: 'Mag_AKM_30Rnd', label: '[AR 7.62x39] Mag_AKM_30Rnd', description: 'AKM 30-round magazine.' },
    { value: 'Mag_AKM_Drum75Rnd', label: '[AR 7.62x39] Mag_AKM_Drum75Rnd', description: 'AKM 75-round drum.' },
    { value: 'Mag_AKM_Palm30Rnd', label: '[AR 7.62x39] Mag_AKM_Palm30Rnd', description: 'AKM Palm 30-round magazine.' },
    { value: 'Mag_Groza_20Rnd', label: '[AR 9x39] Mag_Groza_20Rnd', description: 'Groza 20-round magazine.' },
    { value: 'Mag_VSS_10Rnd', label: '[AR 9x39] Mag_VSS_10Rnd', description: 'VSS 10-round magazine.' },
    { value: 'Mag_VAL_20Rnd', label: '[AR 9x39] Mag_VAL_20Rnd', description: 'VAL 20-round magazine.' },
    { value: 'Mag_Vikhr_30Rnd', label: '[AR 9x39] Mag_Vikhr_30Rnd', description: 'Vikhr 30-round magazine.' },
    { value: 'Mag_FAL_20Rnd', label: '[Battle Rifle .308] Mag_FAL_20Rnd', description: 'FAL 20-round magazine.' },
    { value: 'Mag_M14_10Rnd', label: '[Battle Rifle .308] Mag_M14_10Rnd', description: 'M14 10-round magazine.' },
    { value: 'Mag_M14_20Rnd', label: '[Battle Rifle .308] Mag_M14_20Rnd', description: 'M14 20-round magazine.' },
    { value: 'Mag_SVD_10Rnd', label: '[DMR 7.62x54] Mag_SVD_10Rnd', description: 'SVD 10-round magazine.' },
    { value: 'Mag_SV98_10Rnd', label: '[DMR 7.62x54] Mag_SV98_10Rnd', description: 'SV98 10-round magazine.' },
    { value: 'Mag_Scout_5Rnd', label: '[Rifle .308] Mag_Scout_5Rnd', description: 'Scout 5-round magazine.' },
    { value: 'Mag_CZ550_4rnd', label: '[Rifle .308] Mag_CZ550_4rnd', description: 'CZ550 4-round magazine.' },
    { value: 'Mag_CZ550_10rnd', label: '[Rifle .308] Mag_CZ550_10rnd', description: 'CZ550 10-round magazine.' },
    { value: 'Mag_CZ527_5rnd', label: '[Rifle 7.62x39] Mag_CZ527_5rnd', description: 'CZ527 5-round magazine.' },
    { value: 'Mag_SSG82_5rnd', label: '[Rifle 5.45] Mag_SSG82_5rnd', description: 'SSG82 5-round magazine.' },
    { value: 'Mag_CLIP762x54_5Rnd', label: '[Clip 7.62x54] Mag_CLIP762x54_5Rnd', description: 'Stripper clip for Mosin-style rifles.' },
    { value: 'Mag_CLIP762x39_10Rnd', label: '[Clip 7.62x39] Mag_CLIP762x39_10Rnd', description: 'Stripper clip for SKS.' },
    { value: 'Mag_CLIP9x19_10Rnd', label: '[Clip 9x19] Mag_CLIP9x19_10Rnd', description: 'Clip for Sporter/CZ-based systems.' },
    { value: 'Mag_762x54Snaploader_2Rnd', label: '[Double Rifle 7.62x54] Mag_762x54Snaploader_2Rnd', description: '2-round snaploader.' },
    { value: 'Mag_308WinSnaploader_2Rnd', label: '[Double Rifle .308] Mag_308WinSnaploader_2Rnd', description: '2-round snaploader.' },
    { value: 'Mag_12gaSnaploader_2Rnd', label: '[Shotgun 12ga] Mag_12gaSnaploader_2Rnd', description: '2-shell snaploader.' },
    { value: 'Mag_Saiga_5Rnd', label: '[Shotgun 12ga] Mag_Saiga_5Rnd', description: 'Saiga 5-round magazine.' },
    { value: 'Mag_Saiga_8Rnd', label: '[Shotgun 12ga] Mag_Saiga_8Rnd', description: 'Saiga 8-round magazine.' },
    { value: 'Mag_Saiga_Drum20Rnd', label: '[Shotgun 12ga] Mag_Saiga_Drum20Rnd', description: 'Saiga drum magazine.' },
    { value: 'Mag_M249_Box200Rnd', label: '[LMG 5.56] Mag_M249_Box200Rnd', description: 'M249 belt box.' },
    { value: 'Mag_MKII_10Rnd', label: '[Rimfire .22] Mag_MKII_10Rnd', description: 'MKII pistol magazine.' },
    { value: 'Mag_Ruger1022_10Rnd', label: '[Rimfire .22] Mag_Ruger1022_10Rnd', description: 'Ruger 10-round magazine.' },
    { value: 'Mag_Ruger1022_15Rnd', label: '[Rimfire .22] Mag_Ruger1022_15Rnd', description: 'Ruger 15-round magazine.' },
    { value: 'Mag_Ruger1022_30Rnd', label: '[Rimfire .22] Mag_Ruger1022_30Rnd', description: 'Ruger 30-round magazine.' },
    { value: 'Mag_Arrows_Quiver', label: '[Archery] Mag_Arrows_Quiver', description: 'Quiver for arrows.' },
    { value: 'Mag_Bolts_Quiver', label: '[Archery] Mag_Bolts_Quiver', description: 'Quiver for bolts.' },
    { value: 'Mag_ShockCartridge', label: '[Special] Mag_ShockCartridge', description: 'Shock cartridge magazine.' },
];

const FAMILY_AMMO_OPTIONS: SelectOption[] = [
    { value: 'Ammo_45ACP', label: '[Pistol .45] Ammo_45ACP', description: '.45 ACP loose rounds.' },
    { value: 'Ammo_9x19', label: '[Pistol 9x19] Ammo_9x19', description: '9x19 loose rounds.' },
    { value: 'Ammo_380', label: '[Pistol .380] Ammo_380', description: '.380 ACP loose rounds.' },
    { value: 'Ammo_357', label: '[Revolver .357] Ammo_357', description: '.357 rounds.' },
    { value: 'Ammo_556x45', label: '[AR 5.56] Ammo_556x45', description: '5.56x45 rounds.' },
    { value: 'Ammo_556x45Tracer', label: '[AR 5.56] Ammo_556x45Tracer', description: '5.56x45 tracer rounds.' },
    { value: 'Ammo_545x39', label: '[AR 5.45] Ammo_545x39', description: '5.45x39 rounds.' },
    { value: 'Ammo_545x39Tracer', label: '[AR 5.45] Ammo_545x39Tracer', description: '5.45x39 tracer rounds.' },
    { value: 'Ammo_762x39', label: '[AR 7.62x39] Ammo_762x39', description: '7.62x39 rounds.' },
    { value: 'Ammo_762x39Tracer', label: '[AR 7.62x39] Ammo_762x39Tracer', description: '7.62x39 tracer rounds.' },
    { value: 'Ammo_9x39', label: '[AR 9x39] Ammo_9x39', description: '9x39 rounds.' },
    { value: 'Ammo_9x39AP', label: '[AR 9x39] Ammo_9x39AP', description: '9x39 armor-piercing rounds.' },
    { value: 'Ammo_308Win', label: '[Rifle .308] Ammo_308Win', description: '.308 Winchester rounds.' },
    { value: 'Ammo_308WinTracer', label: '[Rifle .308] Ammo_308WinTracer', description: '.308 tracer rounds.' },
    { value: 'Ammo_762x54', label: '[Rifle 7.62x54] Ammo_762x54', description: '7.62x54 rounds.' },
    { value: 'Ammo_762x54Tracer', label: '[Rifle 7.62x54] Ammo_762x54Tracer', description: '7.62x54 tracer rounds.' },
    { value: 'Ammo_22', label: '[Rimfire .22] Ammo_22', description: '.22 rounds.' },
    { value: 'Ammo_12gaPellets', label: '[Shotgun 12ga] Ammo_12gaPellets', description: '12ga pellets.' },
    { value: 'Ammo_12gaSlug', label: '[Shotgun 12ga] Ammo_12gaSlug', description: '12ga slug.' },
    { value: 'Ammo_12gaRubberSlug', label: '[Shotgun 12ga] Ammo_12gaRubberSlug', description: '12ga rubber slug.' },
    { value: 'Ammo_12gaBeanbag', label: '[Shotgun 12ga] Ammo_12gaBeanbag', description: '12ga beanbag round.' },
    { value: 'Ammo_HuntingBolt', label: '[Archery] Ammo_HuntingBolt', description: 'Hunting bolt.' },
    { value: 'Ammo_ImprovisedBolt_1', label: '[Archery] Ammo_ImprovisedBolt_1', description: 'Improvised bolt type 1.' },
    { value: 'Ammo_ImprovisedBolt_2', label: '[Archery] Ammo_ImprovisedBolt_2', description: 'Improvised bolt type 2.' },
    { value: 'Ammo_CupidsBolt', label: '[Archery] Ammo_CupidsBolt', description: 'Cupid bolt.' },
    { value: 'Ammo_Flare', label: '[Signal] Ammo_Flare', description: 'Flare round.' },
    { value: 'Ammo_FlareRed', label: '[Signal] Ammo_FlareRed', description: 'Red flare round.' },
    { value: 'Ammo_FlareGreen', label: '[Signal] Ammo_FlareGreen', description: 'Green flare round.' },
    { value: 'Ammo_FlareBlue', label: '[Signal] Ammo_FlareBlue', description: 'Blue flare round.' },
    { value: 'Ammo_GrenadeM4', label: '[40mm] Ammo_GrenadeM4', description: '40mm grenade round.' },
    { value: 'Ammo_40mm_Explosive', label: '[40mm] Ammo_40mm_Explosive', description: '40mm explosive grenade.' },
    { value: 'Ammo_40mm_ChemGas', label: '[40mm] Ammo_40mm_ChemGas', description: '40mm chemical gas round.' },
    { value: 'Ammo_40mm_Smoke_Red', label: '[40mm Smoke] Ammo_40mm_Smoke_Red', description: '40mm red smoke round.' },
    { value: 'Ammo_40mm_Smoke_Green', label: '[40mm Smoke] Ammo_40mm_Smoke_Green', description: '40mm green smoke round.' },
    { value: 'Ammo_40mm_Smoke_White', label: '[40mm Smoke] Ammo_40mm_Smoke_White', description: '40mm white smoke round.' },
    { value: 'Ammo_40mm_Smoke_Black', label: '[40mm Smoke] Ammo_40mm_Smoke_Black', description: '40mm black smoke round.' },
    { value: 'Ammo_RPG7_HE', label: '[Rocket] Ammo_RPG7_HE', description: 'RPG-7 HE rocket.' },
    { value: 'Ammo_RPG7_AP', label: '[Rocket] Ammo_RPG7_AP', description: 'RPG-7 AP rocket.' },
    { value: 'Ammo_LAW_HE', label: '[Rocket] Ammo_LAW_HE', description: 'LAW HE rocket.' },
];

const FAMILY_DROP_SOUNDSET_OPTIONS: AnimEventOption[] = [
    { label: '[Clothing] Athletic Shoes', soundSet: 'AthleticShoes_drop_SoundSet', id: 898 },
    { label: '[Clothing] Ballistic Helmet', soundSet: 'BallisticHelmet_drop_SoundSet', id: 898 },
    { label: '[Clothing] Dark Moto Helmet', soundSet: 'DarkMotoHelmet_drop_SoundSet', id: 898 },
    { label: '[Clothing] Great Helm', soundSet: 'GreatHelm_drop_SoundSet', id: 898 },
    { label: '[Clothing] Shirt', soundSet: 'Shirt_drop_SoundSet', id: 898 },
    { label: '[Clothing] Smersh Vest', soundSet: 'SmershVest_drop_SoundSet', id: 898 },
    { label: '[Clothing] Sport Glasses', soundSet: 'SportGlasses_drop_SoundSet', id: 898 },
    { label: '[Clothing] Working Gloves', soundSet: 'WorkingGloves_drop_SoundSet', id: 898 },
    { label: '[Backpack] Taloon Bag', soundSet: 'taloonbag_drop_SoundSet', id: 898 },
    { label: '[Weapon] Pistol', soundSet: 'pistol_drop_SoundSet', id: 898 },
    { label: '[Weapon] Rifle', soundSet: 'rifle_drop_SoundSet', id: 898 },
    { label: '[Weapon] Combat Knife', soundSet: 'combatknife_drop_SoundSet', id: 898 },
    { label: '[Tool] Hacksaw', soundSet: 'hacksaw_drop_SoundSet', id: 898 },
    { label: '[Tool] Wood Axe', soundSet: 'woodaxe_drop_SoundSet', id: 898 },
    { label: '[Container] Ammo Box', soundSet: 'ammobox_drop_SoundSet', id: 898 },
    { label: '[Container] Barrel', soundSet: 'barrel_drop_SoundSet', id: 898 },
    { label: '[Container] Sea Chest', soundSet: 'seachest_drop_SoundSet', id: 898 },
    { label: '[Container] Small Protector Case', soundSet: 'smallprotectorcase_drop_SoundSet', id: 898 },
    { label: '[Consumable] Baked Beans Can', soundSet: 'BakedBeansCan_drop_SoundSet', id: 898 },
    { label: '[Consumable] Blood Bag', soundSet: 'bloodbag_drop_SoundSet', id: 898 },
    { label: '[Consumable] Purification Tablets', soundSet: 'purificationtablets_drop_SoundSet', id: 898 },
    { label: '[Consumable] Soda Can', soundSet: 'SodaCan_drop_SoundSet', id: 898 },
    { label: '[Utility] Barbed Wire', soundSet: 'barbedwire_drop_SoundSet', id: 898 },
    { label: '[Utility] Battery Charger', soundSet: 'batterycharger_drop_SoundSet', id: 898 },
    { label: '[Utility] Cable Reel', soundSet: 'cablereel_drop_SoundSet', id: 898 },
    { label: '[Utility] Cooking Pot', soundSet: 'pot_drop_SoundSet', id: 898 },
    { label: '[Utility] Cooking Stand', soundSet: 'cookingStand_drop_SoundSet', id: 898 },
    { label: '[Utility] Fireplace', soundSet: 'fireplace_drop_SoundSet', id: 898 },
    { label: '[Utility] Power Generator', soundSet: 'powergenerator_drop_SoundSet', id: 898 },
    { label: '[Utility] Spotlight', soundSet: 'spotlight_drop_SoundSet', id: 898 },
    { label: '[Vehicle Part] Car Battery', soundSet: 'carbattery_drop_SoundSet', id: 898 },
    { label: '[Vehicle Part] Car Radiator', soundSet: 'carradiator_drop_SoundSet', id: 898 },
    { label: '[Vehicle Part] Engine Oil', soundSet: 'engineoil_drop_SoundSet', id: 898 },
    { label: '[Fuel] Gasoline Canister', soundSet: 'GasolineCanister_drop_SoundSet', id: 898 },
    { label: '[Camp] Tent (Medium)', soundSet: 'mediumtent_drop_SoundSet', id: 898 },
    { label: '[Material] Wooden Log', soundSet: 'woodenlog_drop_SoundSet', id: 898 },
    { label: '[Optic] PSO-1 Optic', soundSet: 'PSO11Optic_drop_SoundSet', id: 898 },
    { label: '[Crafting] Sewing Kit', soundSet: 'sewingkit_drop_SoundSet', id: 898 },
];

const FAMILY_PICKUP_SOUNDSET_OPTIONS: AnimEventOption[] = [
    { label: '[Food] Apple', soundSet: 'Apple_pickup_SoundSet', id: 797 },
    { label: '[Food] Baked Beans Can', soundSet: 'BakedBeansCan_pickup_SoundSet', id: 797 },
    { label: '[Food] Box Cereal Crunchin', soundSet: 'BoxCerealCrunchin_pickup_SoundSet', id: 797 },
    { label: '[Food] Zucchini', soundSet: 'Zucchini_pickup_SoundSet', id: 797 },
    { label: '[Clothing] Athletic Shoes', soundSet: 'AthleticShoes_pickup_SoundSet', id: 797 },
    { label: '[Clothing] Dark Moto Helmet', soundSet: 'DarkMotoHelmet_pickup_SoundSet', id: 797 },
    { label: '[Clothing] Shirt', soundSet: 'Shirt_pickup_SoundSet', id: 797 },
    { label: '[Clothing] Smersh Vest', soundSet: 'SmershVest_pickup_SoundSet', id: 797 },
    { label: '[Clothing] Sport Glasses', soundSet: 'SportGlasses_pickup_SoundSet', id: 797 },
    { label: '[Clothing] Working Gloves', soundSet: 'WorkingGloves_pickup_SoundSet', id: 797 },
    { label: '[Backpack] Leather Backpack', soundSet: 'pickUpBackPack_Leather_SoundSet', id: 797 },
    { label: '[Backpack] Metal Backpack', soundSet: 'pickUpBackPack_Metal_SoundSet', id: 797 },
    { label: '[Backpack] Plastic Backpack', soundSet: 'pickUpBackPack_Plastic_SoundSet', id: 797 },
    { label: '[Bag] Courier Bag', soundSet: 'pickUpCourierBag_SoundSet', id: 797 },
    { label: '[Utility] Generic Item', soundSet: 'pickUpItem_SoundSet', id: 797 },
    { label: '[Utility] Cooking Pot', soundSet: 'pickUpPot_SoundSet', id: 797 },
    { label: '[Utility] Tent', soundSet: 'pickUpTent_SoundSet', id: 797 },
    { label: '[Tool] Hatchet', soundSet: 'hatchet_pickup_SoundSet', id: 797 },
    { label: '[Vehicle Part] Engine Oil', soundSet: 'engineoil_pickup_SoundSet', id: 797 },
    { label: '[Medical] Purification Tablets', soundSet: 'purificationtablets_pickup_SoundSet', id: 797 },
    { label: '[Crafting] Sewing Kit', soundSet: 'SewingKit_pickup_SoundSet', id: 797 },
    { label: '[Container] Small Protector Case', soundSet: 'SmallProtectorCase_pickup_SoundSet', id: 797 },
    { label: '[Drink] Soda Can', soundSet: 'SodaCan_pickup_SoundSet', id: 797 },
    { label: '[Drink] Water Bottle', soundSet: 'WaterBottle_pickup_SoundSet', id: 797 },
    { label: '[Material] Wooden Log', soundSet: 'woodenlog_pickup_SoundSet', id: 797 },
    { label: '[Optic] PSO-1 Optic', soundSet: 'PSO11Optic_pickup_SoundSet', id: 797 },
];

export type ParamDefaultValue =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | { soundSet: string; id: number }
    | Record<string, string | number | boolean>;

export interface ParamDef {
    key: string;
    label: string;
    description: string;
    example?: string;
    type: ParamType;
    defaultValue?: ParamDefaultValue;
    placement?: string; // e.g. 'root', 'DamageSystem', 'ClothingTypes'
    options?: AnimEventOption[]; // specifically for anim_event
    selectOptions?: SelectOption[]; // for select/combobox and suggested values for strings/arrays
    allowCustom?: boolean;
}

export type CategoryGroup =
    | 'core'
    | 'storage'
    | 'apparel'
    | 'combat'
    | 'systems';

export interface CategoryDef {
    id: string;
    group: CategoryGroup;
    order: number;
    title: string;
    description?: string;
    searchTerms?: string[];
    params: ParamDef[];
}

export const CATALOG: CategoryDef[] = [
    {
        id: 'base',
        group: 'core',
        order: 10,
        title: 'Основа предмета',
        description: 'Главные параметры класса: имя, описание, модель, размер и базовая доступность.',
        searchTerms: ['основа', 'база', 'корень', 'main', 'basic', 'root', 'class'],
        params: [
            { key: 'scope', label: 'Scope', description: 'Отвечает за доступность класса в игре. Определяет, может ли предмет спавниться и использоваться игроками.', example: '0 - базовый класс (ненаследуемый), 1 - скрытый, 2 - публичный (спавнится в мире).', type: 'number', defaultValue: 2, placement: 'root' },
            { key: 'displayName', label: 'Display Name', description: 'Название предмета, которое отображается в инвентаре или при наведении на него в игре.', example: 'Можно указать текст напрямую или переменную: $STR_Item_Name_MyItem', type: 'string', defaultValue: 'Мой предмет', placement: 'root' },
            { key: 'descriptionShort', label: 'Description', description: 'Краткое описание предмета. Отображается в инвентаре при наведении на предмет.', example: 'Обычный текст или переменная локализации: $STR_Item_Desc_MyItem', type: 'string', defaultValue: 'Описание моего предмета', placement: 'root' },
            { key: 'model', label: 'Model Path', description: 'Определяет путь к 3D модели (.p3d) предмета, которая отображается в мире игры (на земле).', example: '\\dz\\characters\\headgear\\helmet.p3d', type: 'string', defaultValue: '\\dz\\characters\\headgear\\helmet.p3d', placement: 'root' },
            { key: 'weight', label: 'Weight (g)', description: 'Вес предмета в граммах. Влияет на общую переносимую массу персонажа и затраты выносливости.', example: '1000 — вес равен 1 кг. 2500 — вес равен 2.5 кг.', type: 'number', defaultValue: 1000, placement: 'root' },
            { key: 'itemSize', label: 'Item Size', description: 'Занимаемое место предмета в инвентаре (ширина и высота в клетках).', example: '[2, 2] — предмет займет 2 клетки в ширину и 2 в высоту (всего 4).', type: 'array_of_numbers', defaultValue: [2, 2], placement: 'root' },
            { key: 'itemsCargoSize', label: 'Cargo Size', description: 'Размер внутреннего инвентаря самого предмета в клетках (ширина и высота).', example: '[5, 4] — внутри предмета сетка 5x4 (всего 20). [0, 0] — нет инвентаря.', type: 'array_of_numbers', defaultValue: [0, 0], placement: 'root' },
        ]
    },
    {
        id: 'visual',
        group: 'core',
        order: 20,
        title: 'Модель и материалы',
        description: 'Секции модели, текстуры, материалы и визуальная настройка предмета.',
        searchTerms: ['модель', 'текстуры', 'материалы', 'hidden selections', 'visual', 'appearance'],
        params: [
            { key: 'itemInfo', label: 'Item Info Categories', description: 'Системные категории предмета, используемые игрой для логики сортировки или фильтрации.', example: '["Clothing", "Body"] для одежды, надеваемой на торс.', type: 'array_of_strings', defaultValue: ['Clothing'], placement: 'root', selectOptions: COMMON_ITEM_INFO_OPTIONS, allowCustom: true },
            { key: 'hiddenSelections', label: 'Hidden Selections', description: 'Имена секций (областей) в 3D модели, на которые можно применять измененные текстуры и материалы.', example: '["camoGround", "zbytek"] — имена должны совпадать с заготовками в модели.', type: 'array_of_strings', defaultValue: ['camoGround'], placement: 'root', selectOptions: COMMON_HIDDEN_SELECTION_OPTIONS, allowCustom: true },
            { key: 'hiddenSelectionsTextures', label: 'Textures', description: 'Пути к файлам текстур (.paa), которые будут применены поверх секций из hiddenSelections.', example: '["\\my_mod\\data\\co.paa"] — индексы текстур должны совпадать с hiddenSelections.', type: 'array_of_strings', defaultValue: [], placement: 'root' },
            { key: 'hiddenSelectionsMaterials', label: 'Materials', description: 'Пути к файлам материалов (.rvmat), которые будут применены поверх секций из hiddenSelections.', example: '["\\my_mod\\data\\mat.rvmat"] — настраивает качество поверхности и блики.', type: 'array_of_strings', defaultValue: [], placement: 'root' },
        ]
    },
    {
        id: 'inventory',
        group: 'storage',
        order: 30,
        title: 'Слоты экипировки',
        description: 'Куда предмет надевается, какие attachments принимает и что даёт игроку.',
        searchTerms: ['слоты', 'экипировка', 'inventory', 'slot', 'attachment', 'attachments'],
        params: [
            {
                key: 'inventorySlot',
                label: 'Inventory Slot',
                description: 'Слот экипировки персонажа, в который можно надеть данный предмет. Можно указать несколько слотов.',
                type: 'multi-select',
                defaultValue: ['Headgear'],
                placement: 'root',
                selectOptions: EXTENDED_INVENTORY_SLOT_OPTIONS,
                allowCustom: true,
            },
            { key: 'attachments', label: 'Attachments', description: 'Доступные слоты на самом предмете, куда можно прикрепить другие предметы.', example: '["Chemlight", "WalkieTalkie"] — позволит прикрепить химсвет и рацию.', type: 'array_of_strings', defaultValue: [], placement: 'root', selectOptions: EXTENDED_ATTACHMENT_OPTIONS, allowCustom: true },
            { key: 'quickBarBonus', label: 'Quickbar Bonus Slots', description: 'Количество дополнительных слотов быстрого доступа, которые добавляет предмет при надевании.', example: '1, 2, 3 или 4. Например, разгрузочный жилет может добавлять 4 слота.', type: 'number', defaultValue: 0, placement: 'root', selectOptions: QUICKBAR_BONUS_OPTIONS },
        ]
    },
    {
        id: 'repair',
        group: 'core',
        order: 25,
        title: 'Состояние и ремонт',
        description: 'Можно ли чинить предмет, какими наборами и как быстро он изнашивается.',
        searchTerms: ['ремонт', 'починка', 'прочность', 'durability', 'repair'],
        params: [
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
            { key: 'repairableWithKits', label: 'Repair Kits', description: 'ID ремонтных наборов, с помощью которых можно починить данный предмет.', example: '5 - швейный набор, 2 - набор для кожи, 3 - набор электрика.', type: 'array_of_numbers', defaultValue: [5, 2], placement: 'root', selectOptions: DAYZ_REPAIR_KIT_OPTIONS, allowCustom: true },
            { key: 'repairCosts', label: 'Repair Costs', description: 'Количество используемых ресурсов (в процентах) из ремонтного набора при починке этого предмета.', example: '[25, 30] — 1-й набор потратит 25% ресурса, 2-й набор — 30%.', type: 'array_of_numbers', defaultValue: [25, 25], placement: 'root' },
            { key: 'durability', label: 'Durability Modifier', description: 'Множитель долговечности предмета. Влияет на то, как быстро предмет теряет прочность при использовании.', example: '1.0 — стандарт. 5.0 — предмет в 5 раз долговечнее.', type: 'number', defaultValue: 1.0, placement: 'root' },
        ]
    },
    {
        id: 'quantity',
        group: 'storage',
        order: 40,
        title: 'Стак, количество и единицы',
        description: 'Начальное и максимальное количество, деление стака, единицы измерения и вес за единицу.',
        searchTerms: ['стак', 'количество', 'quantity', 'stack', 'stackable', 'units'],
        params: [
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
                allowCustom: true,
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
            { key: 'varQuantityDestroyOnMin', label: 'Destroy On Empty', description: 'Удалять предмет, когда его количество достигает минимального значения. Полезно для расходников, батареек, патронов и одноразовых предметов.', example: '1 — предмет удаляется при 0. 0 — пустой предмет остаётся как оболочка/контейнер.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'canBeSplit', label: 'Can Be Split', description: 'Разрешает разделять стак на несколько меньших частей прямо в инвентаре.', example: '1 — игрок сможет отделить часть стака. 0 — предмет остаётся только цельным стеком.', type: 'boolean', defaultValue: true, placement: 'root' },
            { key: 'weightPerQuantityUnit', label: 'Weight Per Unit', description: 'Сколько граммов добавляет каждая единица количества внутри стака. Важно для патронов, жидкостей, таблеток и прочих расходников.', example: '4 — каждый патрон или единица ресурса будет добавлять 4 грамма веса.', type: 'number', defaultValue: 0, placement: 'root' },
        ]
    },
    {
        id: 'weapons',
        group: 'combat',
        order: 90,
        title: 'Оружие и боевые свойства',
        description: 'Патронник, магазины, отдача, sway и поведение предмета как оружия.',
        searchTerms: ['оружие', 'weapon', 'gun', 'melee', 'magazine', 'ammo', 'патроны', 'магазины'],
        params: [
            { key: 'isMeleeWeapon', label: 'Is Melee Weapon', description: 'Позволяет использовать предмет как оружие ближнего боя.', example: '1 — предмет считается melee-оружием. 0 — обычный предмет без ударного поведения.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'chamberSize', label: 'Chamber Size', description: 'Количество патронов, которые можно держать непосредственно в патроннике оружия.', example: '1 — классический одиночный патронник. 2 и более — многозарядные схемы.', type: 'number', defaultValue: 0, placement: 'root' },
            { key: 'chamberableFrom', label: 'Chamberable From', description: 'Какие классы магазинов или патронов могут заряжать это оружие напрямую в патронник.', example: '["Ammo_545x39", "Mag_AK74_30Rnd"]', type: 'array_of_strings', defaultValue: [], placement: 'root', selectOptions: [...FAMILY_AMMO_OPTIONS, ...FAMILY_MAGAZINE_OPTIONS], allowCustom: true },
            { key: 'magazines', label: 'Compatible Magazines', description: 'Список совместимых магазинов для оружия или устройства, работающего с магазинами.', example: '["Mag_AK74_30Rnd", "Mag_AK74_45Rnd"]', type: 'array_of_strings', defaultValue: [], placement: 'root', selectOptions: FAMILY_MAGAZINE_OPTIONS, allowCustom: true },
            { key: 'reloadTime', label: 'Reload Time', description: 'Базовое время перезарядки или цикла выстрела.', example: '0.12 — быстрый цикл. 1.0 — медленный.', type: 'number', defaultValue: 0, placement: 'root' },
            { key: 'recoilModifier', label: 'Recoil Modifier', description: 'Массив модификаторов отдачи.', example: '[1.0, 1.0, 1.0]', type: 'array_of_numbers', defaultValue: [1, 1, 1], placement: 'root' },
            { key: 'swayModifier', label: 'Sway Modifier', description: 'Массив модификаторов раскачки оружия при прицеливании.', example: '[1.0, 1.0, 1.0]', type: 'array_of_numbers', defaultValue: [1, 1, 1], placement: 'root' },
            { key: 'dexterityModifier', label: 'Dexterity Modifier', description: 'Модификатор манёвренности предмета в руках.', example: '0.8 — быстрее и легче. 1.2 — тяжелее и неповоротливее.', type: 'number', defaultValue: 1.0, placement: 'root' },
            { key: 'ironSightDistance', label: 'Iron Sight Distance', description: 'Дистанция пристрелки для открытых прицельных приспособлений.', example: '100 — стандартная пристрелка на 100 метров.', type: 'number', defaultValue: 100, placement: 'root' },
        ]
    },
    {
        id: 'containers',
        group: 'storage',
        order: 35,
        title: 'Контейнеры и внутренний инвентарь',
        description: 'Контейнеры, сумки, ящики, тайники и поведение внутреннего cargo.',
        searchTerms: ['контейнер', 'cargo', 'инвентарь', 'ящик', 'сундук', 'сумка', 'bag', 'container'],
        params: [
            { key: 'openable', label: 'Openable', description: 'Определяет, требуется ли контейнер открывать перед доступом к содержимому.', example: '1 — контейнер открывается/закрывается как отдельное действие. 0 — доступ сразу.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'rotationFlags', label: 'Rotation Flags', description: 'Разрешённые варианты поворота предмета в инвентаре.', example: '17 — типичный набор разрешённых поворотов. 0 — без поворота.', type: 'number', defaultValue: 17, placement: 'root' },
            { key: 'fragility', label: 'Fragility', description: 'Насколько легко предмет получает урон от падений и физических воздействий.', example: '0.5 — предмет сравнительно прочный. 1.0 — стандартная хрупкость.', type: 'number', defaultValue: 1.0, placement: 'root' },
            { key: 'canBeDigged', label: 'Can Be Buried', description: 'Позволяет закапывать предмет как тайник.', example: '1 — предмет можно закапывать. 0 — нельзя.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'itemsCargoCanBeDestroyed', label: 'Cargo Can Be Destroyed', description: 'Определяет, могут ли предметы внутри контейнера уничтожаться при разрушении владельца.', example: '1 — содержимое может погибнуть вместе с контейнером. 0 — обычно сохраняется.', type: 'boolean', defaultValue: false, placement: 'root' },
            { key: 'allowOwnedCargoManipulation', label: 'Allow Owned Cargo Manipulation', description: 'Разрешает взаимодействие с содержимым контейнера, пока он находится во владении персонажа или другого объекта.', example: '1 — игрок может управлять содержимым. 0 — содержимое ограничено.', type: 'boolean', defaultValue: true, placement: 'root' },
            { key: 'cargoCheckSize', label: 'Cargo Check Size', description: 'Размер проверки содержимого или грузового отсека.', example: '[10, 20]', type: 'array_of_numbers', defaultValue: [0, 0], placement: 'root' },
            { key: 'cargoDamageCoefficient', label: 'Cargo Damage Coefficient', description: 'Коэффициент передачи урона содержимому контейнера.', example: '0.0 — содержимое не получает урон. 1.0 — получает полный урон.', type: 'number', defaultValue: 0.0, placement: 'root' },
        ]
    },
    {
        id: 'energy',
        group: 'systems',
        order: 110,
        title: 'Питание и электроника',
        description: 'EnergyManager, расход энергии, батарейки, разъёмы и поведение устройств.',
        searchTerms: ['энергия', 'батарейка', 'электроника', 'energy', 'battery', 'power', 'plug'],
        params: [
            { key: 'hasIcon', label: 'Energy Icon', description: 'Показывать иконку состояния питания в UI предмета.', example: '1 — иконка батареи отображается. 0 — скрыта.', type: 'boolean', defaultValue: true, placement: 'EnergyManager' },
            { key: 'autoSwitchOff', label: 'Auto Switch Off', description: 'Автоматически выключать устройство при исчерпании энергии.', example: '1 — устройство само отключится. 0 — поведение контролируется отдельно.', type: 'boolean', defaultValue: true, placement: 'EnergyManager' },
            { key: 'energyUsagePerSecond', label: 'Energy Usage / Sec', description: 'Сколько энергии устройство тратит в секунду во включённом состоянии.', example: '0.1 — низкое потребление. 1.5 — прожорливое устройство.', type: 'number', defaultValue: 0.0, placement: 'EnergyManager' },
            { key: 'energyStorageMax', label: 'Max Energy Storage', description: 'Максимальный внутренний запас энергии у предмета.', example: '100 — устройство может хранить 100 единиц энергии.', type: 'number', defaultValue: 0, placement: 'EnergyManager' },
            { key: 'wetnessExposure', label: 'Wetness Exposure', description: 'Насколько устройство уязвимо к влаге с точки зрения энергосистемы.', example: '0.0 — влагозащита. 1.0 — стандартное поведение.', type: 'number', defaultValue: 0.0, placement: 'EnergyManager' },
            { key: 'plugType', label: 'Plug Type', description: 'Числовой тип разъёма или источника питания, с которым работает устройство.', example: '1 — handheld/battery, 2 — cable network, 4/8 — vehicle battery side, 7 — gas appliance.', type: 'number', defaultValue: 0, placement: 'EnergyManager', selectOptions: DAYZ_PLUG_TYPE_OPTIONS, allowCustom: true },
            { key: 'compatiblePlugTypes', label: 'Compatible Plug Types', description: 'Список совместимых типов разъёмов или источников питания.', example: '[1, 2]', type: 'array_of_numbers', defaultValue: [], placement: 'EnergyManager', selectOptions: DAYZ_PLUG_TYPE_OPTIONS, allowCustom: true },
            { key: 'attachmentAction', label: 'Attachment Action', description: 'Определяет, как устройство реагирует на подключение или установку энерго-attachment.', example: '0 — без спецдействия. 1 — стандартная активация. 2 — сетевое/кабельное подключение.', type: 'number', defaultValue: 0, placement: 'EnergyManager', selectOptions: DAYZ_ATTACHMENT_ACTION_OPTIONS, allowCustom: true },
            { key: 'updateInterval', label: 'Update Interval', description: 'Интервал обновления энергосистемы устройства.', example: '5 — обновление каждые 5 секунд.', type: 'number', defaultValue: 0, placement: 'EnergyManager' },
        ]
    },
    {
        id: 'liquids',
        group: 'storage',
        order: 50,
        title: 'Жидкости и ёмкости',
        description: 'Тип жидкости, жидкостные контейнеры и стартовое содержимое.',
        searchTerms: ['жидкость', 'вода', 'канистра', 'бутылка', 'liquid', 'fluid', 'canteen', 'bottle'],
        params: [
            { key: 'liquidContainerType', label: 'Liquid Container Type', description: 'Маска или пресет поддерживаемых жидкостей для контейнера. В DayZ часто задаётся выражением битовой маски.', example: 'CONTAINER_ALL_BLOODLESS или своя маска вроде "1 + 2 + 4 + ...".', type: 'combobox', defaultValue: '0', placement: 'root', selectOptions: DAYZ_LIQUID_CONTAINER_OPTIONS, allowCustom: true },
            { key: 'varLiquidTypeInit', label: 'Initial Liquid Type', description: 'Какой тип жидкости находится внутри предмета при спавне.', example: '512 — вода, 8192 — бензин, 32768 — дезинфектант.', type: 'number', defaultValue: 0, placement: 'root', selectOptions: DAYZ_LIQUID_TYPE_OPTIONS, allowCustom: true },
        ]
    },
    {
        id: 'clothing',
        group: 'apparel',
        order: 60,
        title: 'Одежда и ограничения',
        description: 'Намокание, тепло, заметность и совместимость с другой экипировкой.',
        searchTerms: ['одежда', 'clothing', 'wearable', 'helmet', 'mask', 'тепло', 'wetness'],
        params: [
            { key: 'varWetMax', label: 'Max Wetness', description: 'Максимальный уровень намокания предмета. Влияет на итоговый вес и теплоизоляцию под дождем.', example: '1.0 — предмет полностью промокает (100%). 0.0 — водонепроницаемый (0%).', type: 'number', defaultValue: 1.0, placement: 'root' },
            { key: 'heatIsolation', label: 'Heat Isolation', description: 'Показатель теплоизоляции предмета. Влияет на то, насколько эффективно одежда согревает персонажа.', example: '0.1 — плохая изоляция (футболка), 0.9 — отличная изоляция (зимняя куртка).', type: 'number', defaultValue: 0.5, placement: 'root' },
            { key: 'visibilityModifier', label: 'Visibility Modifier', description: 'Модификатор заметности для ИИ (зомби и животных). Снижение значения усиливает камуфляж.', example: '1.0 — стандартная видимость, 0.8 — улучшенный камуфляж (-20% заметности).', type: 'number', defaultValue: 1.0, placement: 'root' },
            { key: 'absorbency', label: 'Absorbency', description: 'Коэффициент впитывания влаги. Определяет, как быстро предмет тяжелеет и становится мокрым.', example: '0.0 — не впитывает, 0.5 — среднее впитывание.', type: 'number', defaultValue: 0.0, placement: 'root' },
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
                allowCustom: true,
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
        group: 'apparel',
        order: 70,
        title: 'Мужская и женская модели',
        description: 'Пути к male/female моделям предмета при ношении на персонаже.',
        searchTerms: ['male', 'female', 'мужская', 'женская', 'clothingtypes', 'модели одежды'],
        params: [
            { key: 'male', label: 'Male Model', description: 'Путь к 3D модели одежды (.p3d), которая используется, когда предмет надет на мужского персонажа.', example: '\\dz\\characters\\tops\\jacket_m.p3d', type: 'string', defaultValue: '', placement: 'ClothingTypes' },
            { key: 'female', label: 'Female Model', description: 'Путь к 3D модели одежды (.p3d), которая используется, когда предмет надет на женского персонажа.', example: '\\dz\\characters\\tops\\jacket_f.p3d', type: 'string', defaultValue: '', placement: 'ClothingTypes' },
        ]
    },
    {
        id: 'protection',
        group: 'apparel',
        order: 80,
        title: 'Защита от среды',
        description: 'Биологическая и химическая защита предмета.',
        searchTerms: ['защита', 'protection', 'bio', 'chemical', 'hazmat', 'NBC'],
        params: [
            { key: 'biological', label: 'Biological Protection', description: 'Коэффициент защиты от биологических угроз.', example: '1.0 — полная защита. 0.75 — частичная защита.', type: 'number', defaultValue: 1.0, placement: 'Protection' },
            { key: 'chemical', label: 'Chemical Protection', description: 'Коэффициент защиты от химических угроз.', example: '1.0 — полная защита. 0.0 — защиты нет.', type: 'number', defaultValue: 1.0, placement: 'Protection' },
        ]
    },
    {
        id: 'damageSystem',
        group: 'apparel',
        order: 85,
        title: 'Прочность и броня',
        description: 'DamageSystem, очки прочности, healthLevels и защита от разных источников урона.',
        searchTerms: ['броня', 'урон', 'damage', 'armor', 'health', 'hitpoints', 'rvmat'],
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
        id: 'sound',
        group: 'combat',
        order: 100,
        title: 'Звуковое поведение',
        description: 'Тип звука удара, приглушение голоса и общие аудио-параметры предмета.',
        searchTerms: ['звук', 'аудио', 'sound', 'voice', 'impact', 'muffle'],
        params: [
            {
                key: 'soundImpactType',
                label: 'Impact Sound Type',
                description: 'Тип звука при ударе предмета о поверхность (падение, бросок).',
                type: 'select',
                defaultValue: 'default',
                placement: 'root',
                allowCustom: true,
                selectOptions: DAYZ_SOUND_IMPACT_OPTIONS
            },
            {
                key: 'soundVoiceType',
                label: 'Voice Muffle Type',
                description: 'Определяет эффект глушения голоса персонажа, когда на нем надет этот предмет.',
                type: 'select',
                defaultValue: 'none',
                placement: 'root',
                allowCustom: true,
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
                allowCustom: true,
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
        group: 'combat',
        order: 105,
        title: 'Звуки действий с предметом',
        description: 'AnimEvents.SoundWeapon: звуки поднятия, броска и других действий.',
        searchTerms: ['animevents', 'soundweapon', 'pickup', 'drop', 'звук поднятия', 'звук броска'],
        params: [
            {
                key: 'dropSoundSet',
                label: 'Drop Soundset',
                description: 'Звуковой пресет (SoundSet), который воспроизводится, когда игрок выбрасывает этот предмет из инвентаря на землю.',
                example: 'Shirt_drop_SoundSet — стандартный звук падающей одежды.',
                type: 'anim_event',
                defaultValue: { soundSet: 'Shirt_drop_SoundSet', id: 898 },
                placement: 'AnimEvents.SoundWeapon.drop',
                options: FAMILY_DROP_SOUNDSET_OPTIONS
            },
            {
                key: 'pickUpSoundSet',
                label: 'Pickup Soundset',
                description: 'Звуковой пресет (SoundSet), который воспроизводится, когда игрок забирает этот предмет с земли в инвентарь или в руки.',
                example: 'Shirt_pickup_SoundSet — звук подбираемой одежды.',
                type: 'anim_event',
                defaultValue: { soundSet: 'Shirt_pickup_SoundSet', id: 797 },
                placement: 'AnimEvents.SoundWeapon.pickUpItem',
                options: FAMILY_PICKUP_SOUNDSET_OPTIONS
            },
        ]
    },
];
