import { CATALOG, type CategoryDef, type ParamDef, type SelectOption } from "@/lib/catalog";

export type Locale = "ru" | "en";

export const LOCALE_STORAGE_KEY = "cfg-tools.locale";

type MessageParams = Record<
  string,
  string | number | boolean | undefined
>;

type MessageValue = string | ((params: MessageParams) => string);

export const messages: Record<Locale, Record<string, MessageValue>> = {
  ru: {
    language: "Язык",
    russian: "Русский",
    english: "English",
    import_completed: "Импорт завершён",
    import_completed_desc: "config.cpp успешно добавлен в список проектов.",
    import_failed: "Не удалось импортировать config.cpp",
    import_failed_desc: "Во время импорта произошла неизвестная ошибка.",
    read_file_failed: "Не удалось прочитать файл",
    read_file_failed_desc:
      "Проверьте, что выбран корректный .cpp файл и попробуйте ещё раз.",
    open_project_manager: "Открыть менеджер проектов",
    projects: "Проекты",
    export: "Экспорт",
    export_current: "Текущий конфиг (.cpp)",
    export_all: "Все конфиги (.zip)",
    update_available: "Доступно обновление",
    update_available_desc:
      "Вышла новая версия cfg-tools. Хотите перейти к обновлению?",
    current_version: ({ value }) => `Текущая версия: ${value}`,
    latest_version: ({ value }) => `Доступная версия: ${value}`,
    later: "Позже",
    update: "Обновить",
    understood: "Понятно",
    new_project: "Новый проект",
    no_projects: "Нет проектов",
    export_all_zip: "Экспорт всех ZIP",
    no_config_selected: "Конфигурация не выбрана",
    copied: "Скопировано!",
    copy: "Копировать",
    download: "Скачать",
    monaco_readonly: "Конфиг генерируется автоматически.",
    project_manager: "Управление проектами",
    project_manager_desc:
      "Быстро переключайтесь между проектами, переименовывайте их и удаляйте без похода по маленьким меню.",
    project_search_placeholder:
      "Поиск по названию проекта, классу или addon...",
    import: "Импорт",
    total_projects: ({ count }) => `Проектов: ${count}`,
    found_projects: ({ count }) => `Найдено: ${count}`,
    no_projects_found: "По этому запросу проекты не найдены.",
    active_project: "Активный",
    classes_count: ({ count }) => `Классов: ${count}`,
    slots_count: ({ count }) => `Слотов: ${count}`,
    proxies_count: ({ count }) => `Прокси: ${count}`,
    addons_count: ({ count }) => `Addons: ${count}`,
    open: "Открыть",
    rename_project: "Переименовать проект",
    duplicate_project: "Дублировать проект",
    delete_project: "Удалить проект",
    project_actions: "Что можно делать",
    project_actions_1: "Переключаться между проектами из одного списка.",
    project_actions_2: "Переименовывать проект прямо на месте.",
    project_actions_3: "Дублировать и удалять без вложенных меню.",
    project_actions_4: "Быстро найти проект по имени, классу или addon.",
    project_actions_5:
      "Создать новый проект или импортировать `config.cpp` сверху.",
    delete_project_title: "Удалить проект?",
    delete_project_desc: ({ name }) =>
      `Проект "${name}" будет удалён без возможности восстановления через корзину.`,
    confirm_project_delete: "Подтвердите удаление проекта.",
    action_irreversible: "Это действие нельзя отменить.",
    cancel: "Отмена",
    delete_project_confirm: "Удалить проект",
    add_parameter: "Добавить параметр",
    add_parameter_title: "Добавление параметра",
    add_parameter_desc:
      "Выберите параметр для добавления в класс. Можно фильтровать по категориям или использовать поиск.",
    categories: "Категории",
    all_parameters: "Все параметры",
    parameter_search_placeholder: "Поиск параметра по имени или описанию...",
    parameter_count: ({ count }) => `Параметров: ${count}`,
    male_and_female_models: "Male & Female Models",
    add_male_female_models: "Добавить мужскую и женскую модели",
    proxy_model_and_slots: "Proxy Model & Slots",
    proxy_model_and_slots_desc: "Название прокси и слоты инвентаря",
    no_query_results: "По вашему запросу ничего не найдено.",
    enabled_params_empty:
      "Нет добавленных параметров. Нажмите «Добавить параметр», чтобы начать.",
    quick_search_title: "Быстрый поиск по добавленным параметрам",
    quick_search_desc:
      "Фильтр ищет по названию, ключу и описанию параметра.",
    shown_count: ({ count }) => `Показано: ${count}`,
    shown_count_filtered: ({ shown, total }) =>
      `Показано: ${shown} из ${total}`,
    enabled_search_placeholder:
      "Найти среди уже добавленных параметров...",
    enabled_filter_empty:
      "По текущему фильтру ничего не найдено. Попробуйте изменить запрос или очистить поиск.",
    group_param_single: "1 параметр в этой группе",
    group_param_many: ({ count }) => `${count} параметров в этой группе`,
    select_or_enter_value: "Выберите или введите значение...",
    find_param: ({ label }) => `Найдите ${label}...`,
    use_custom_value: ({ value }) => `Использовать своё значение: ${value}`,
    choose_scope: "Выберите scope...",
    choose_value: "Выберите значение...",
    choose_values: "Выберите значения...",
    choose_sound: "Выберите звук...",
    choose_or_enter_custom: "Выберите или введите своё значение...",
    list_empty: "Список пуст",
    add_item: "Добавить элемент",
    value_placeholder: "Значение...",
    custom_params: "Пользовательские параметры",
    custom_params_desc:
      "Любые свои поля, которых нет в стандартном каталоге.",
    add_param: "Добавить параметр",
    param_name: "Имя параметра",
    type: "Тип",
    value: "Значение",
    slots_title: "Слоты (CfgSlots)",
    slots_desc: "Определение слотов для прикрепления предметов.",
    add: "Добавить",
    no_slots: "Нет слотов. Нажмите «Добавить».",
    slot_name: "Имя слота",
    proxies_title: "Прокси объекты (CfgNonAIVehicles)",
    proxies_desc:
      "Объявление прикрепляемых частей (ProxyAttachment).",
    no_proxies: "Нет прокси. Нажмите «Добавить».",
    proxy_name: "Имя прокси",
    no_proxy_slots: "Нет слотов",
    retextures_title: "Варианты / Ретекстуры",
    retextures_desc:
      "Дочерние классы, наследующие параметры этого класса.",
    no_retextures: "Нет ретекстур. Нажмите «Добавить».",
    class_name: "Имя класса",
    textures: "Текстуры",
    materials: "Материалы",
    empty: "Пусто",
    no_open_projects: "Нет открытых проектов",
    create_project: "Создать проект",
    no_classes_in_project: "Нет классов в проекте",
    add_class: "Добавить класс",
    project_settings: "Настройки проекта",
    project_settings_desc:
      "Имя файла конфигурации и зависимости аддонов.",
    project_name: "Название проекта",
    no_addons: "Нет аддонов",
    classes: "Классы",
    classes_desc: "Каждая вкладка — отдельный класс конфигурации.",
    add_new_class: "Добавить новый класс",
    base_class: "Базовый класс",
    fill: "Заполнить:",
    duplicate_tab: "Дублировать вкладку",
    class_parameters: "Параметры класса",
    class_parameters_desc:
      "Добавьте нужные параметры для генерации конфига.",
    search: "Поиск...",
  },
  en: {
    language: "Language",
    russian: "Russian",
    english: "English",
    import_completed: "Import complete",
    import_completed_desc: "The config.cpp file was added to your projects.",
    import_failed: "Could not import config.cpp",
    import_failed_desc: "An unknown error occurred during import.",
    read_file_failed: "Could not read the file",
    read_file_failed_desc:
      "Make sure you selected a valid .cpp file and try again.",
    open_project_manager: "Open project manager",
    projects: "Projects",
    export: "Export",
    export_current: "Current config (.cpp)",
    export_all: "All configs (.zip)",
    update_available: "Update available",
    update_available_desc:
      "A new cfg-tools version is available. Do you want to open the update page?",
    current_version: ({ value }) => `Current version: ${value}`,
    latest_version: ({ value }) => `Available version: ${value}`,
    later: "Later",
    update: "Update",
    understood: "OK",
    new_project: "New project",
    no_projects: "No projects",
    export_all_zip: "Export all ZIPs",
    no_config_selected: "No configuration selected",
    copied: "Copied!",
    copy: "Copy",
    download: "Download",
    monaco_readonly: "The config is generated automatically.",
    project_manager: "Project manager",
    project_manager_desc:
      "Quickly switch between projects, rename them, and remove them without digging through nested menus.",
    project_search_placeholder:
      "Search by project name, class, or addon...",
    import: "Import",
    total_projects: ({ count }) => `Projects: ${count}`,
    found_projects: ({ count }) => `Found: ${count}`,
    no_projects_found: "No projects match this query.",
    active_project: "Active",
    classes_count: ({ count }) => `Classes: ${count}`,
    slots_count: ({ count }) => `Slots: ${count}`,
    proxies_count: ({ count }) => `Proxies: ${count}`,
    addons_count: ({ count }) => `Addons: ${count}`,
    open: "Open",
    rename_project: "Rename project",
    duplicate_project: "Duplicate project",
    delete_project: "Delete project",
    project_actions: "What you can do",
    project_actions_1: "Switch between projects from one place.",
    project_actions_2: "Rename a project inline.",
    project_actions_3: "Duplicate and remove projects without nested menus.",
    project_actions_4: "Quickly find a project by name, class, or addon.",
    project_actions_5:
      "Create a new project or import a `config.cpp` from the toolbar.",
    delete_project_title: "Delete project?",
    delete_project_desc: ({ name }) =>
      `The project "${name}" will be permanently removed.`,
    confirm_project_delete: "Confirm project deletion.",
    action_irreversible: "This action cannot be undone.",
    cancel: "Cancel",
    delete_project_confirm: "Delete project",
    add_parameter: "Add parameter",
    add_parameter_title: "Add parameter",
    add_parameter_desc:
      "Choose a parameter to add to the class. You can filter by category or use search.",
    categories: "Categories",
    all_parameters: "All parameters",
    parameter_search_placeholder:
      "Search by parameter name or description...",
    parameter_count: ({ count }) => `Parameters: ${count}`,
    male_and_female_models: "Male & Female Models",
    add_male_female_models: "Add male and female models",
    proxy_model_and_slots: "Proxy Model & Slots",
    proxy_model_and_slots_desc: "Proxy model name and inventory slots",
    no_query_results: "Nothing matched your search.",
    enabled_params_empty:
      "No parameters have been added yet. Use “Add parameter” to get started.",
    quick_search_title: "Quick search for enabled parameters",
    quick_search_desc:
      "This filter searches by parameter name, key, and description.",
    shown_count: ({ count }) => `Shown: ${count}`,
    shown_count_filtered: ({ shown, total }) => `Shown: ${shown} of ${total}`,
    enabled_search_placeholder:
      "Find among the parameters you already added...",
    enabled_filter_empty:
      "Nothing matches the current filter. Try a different query or clear the search.",
    group_param_single: "1 parameter in this group",
    group_param_many: ({ count }) => `${count} parameters in this group`,
    select_or_enter_value: "Select or enter a value...",
    find_param: ({ label }) => `Find ${label}...`,
    use_custom_value: ({ value }) => `Use custom value: ${value}`,
    choose_scope: "Choose scope...",
    choose_value: "Choose a value...",
    choose_values: "Choose values...",
    choose_sound: "Choose a sound...",
    choose_or_enter_custom: "Choose or enter your own value...",
    list_empty: "The list is empty",
    add_item: "Add item",
    value_placeholder: "Value...",
    custom_params: "Custom parameters",
    custom_params_desc:
      "Any custom fields that are not present in the standard catalog.",
    add_param: "Add parameter",
    param_name: "Parameter name",
    type: "Type",
    value: "Value",
    slots_title: "Slots (CfgSlots)",
    slots_desc: "Define attachment slots for items.",
    add: "Add",
    no_slots: "No slots yet. Click “Add”.",
    slot_name: "Slot name",
    proxies_title: "Proxy objects (CfgNonAIVehicles)",
    proxies_desc: "Define attachable proxy parts (ProxyAttachment).",
    no_proxies: "No proxies yet. Click “Add”.",
    proxy_name: "Proxy name",
    no_proxy_slots: "No slots",
    retextures_title: "Variants / Retextures",
    retextures_desc:
      "Child classes that inherit parameters from this class.",
    no_retextures: "No retextures yet. Click “Add”.",
    class_name: "Class name",
    textures: "Textures",
    materials: "Materials",
    empty: "Empty",
    no_open_projects: "No open projects",
    create_project: "Create project",
    no_classes_in_project: "This project has no classes",
    add_class: "Add class",
    project_settings: "Project settings",
    project_settings_desc:
      "Configuration file name and required addon dependencies.",
    project_name: "Project name",
    no_addons: "No addons",
    classes: "Classes",
    classes_desc: "Each tab is a separate config class.",
    add_new_class: "Add new class",
    base_class: "Base class",
    fill: "Fill:",
    duplicate_tab: "Duplicate tab",
    class_parameters: "Class parameters",
    class_parameters_desc: "Add the parameters you need for config generation.",
    search: "Search...",
  },
};

const categoryTitleEn: Record<string, string> = {
  base: "Core item settings",
  visuals: "Model and appearance",
  inventory: "Inventory slots",
  repair: "Condition and repair",
  quantity: "Stacks, quantity, and units",
  weapons: "Weapons and combat",
  damageSystem: "Damage system",
  animEvents: "Sound events",
  containers: "Containers and cargo",
  energy: "Energy and electronics",
  liquids: "Liquids and containers",
  clothing: "Clothing and restrictions",
  clothingTypes: "Male and female models",
  protection: "Environmental protection",
};

const categoryDescriptionEn: Record<string, string> = {
  base: "Main identifiers, model path, physics, and core item settings.",
  visuals: "Visual setup, selections, textures, and materials.",
  inventory: "Where the item can be equipped and what attachments it accepts.",
  repair: "Whether the item can be repaired, with what kits, and how durable it is.",
  quantity: "Initial amount, stack behavior, units, and quantity weight.",
  weapons: "Magazine support, chamber setup, recoil, and combat modifiers.",
  damageSystem: "Health, armor, and incoming damage modifiers.",
  animEvents: "Pickup and drop sound events for the item.",
  containers: "Cargo size, openable behavior, and container-specific rules.",
  energy: "EnergyManager properties for powered and electronic items.",
  liquids: "Liquid presets, masks, and default liquid content.",
  clothing: "Wetness, insulation, visibility, and equipment compatibility.",
  clothingTypes: "Paths to the wearable male and female character models.",
  protection: "Biological and chemical protection values.",
};

const categoryGroupEn: Record<string, string> = {
  core: "Core item",
  storage: "Inventory and storage",
  apparel: "Clothing and protection",
  combat: "Combat and sound",
  systems: "Systems and utilities",
};

const cppImportErrorMap: Record<string, string> = {
  "Файл пустой": "The file is empty.",
  "В config.cpp не найден `CfgVehicles`, поэтому импорт невозможен":
    "CfgVehicles was not found in config.cpp, so import cannot continue.",
  "В CfgVehicles не найдено импортируемых классов":
    "No importable classes were found inside CfgVehicles.",
  "Не удалось импортировать config.cpp":
    "Could not import config.cpp.",
};

const uiTextMapEn: Record<string, string> = {
  "Настройки проекта": "Project settings",
  "Имя файла конфигурации и зависимости аддонов.": "Configuration file name and required addon dependencies.",
  "Название проекта": "Project name",
  "Нет аддонов": "No addons",
  "Классы": "Classes",
  "Каждая вкладка — отдельный класс конфигурации.": "Each tab is a separate config class.",
  "Имя класса": "Class name",
  "Базовый класс": "Base class",
  "Заполнить:": "Fill:",
  "Параметры класса": "Class parameters",
  "Добавьте нужные параметры для генерации конфига.": "Add the parameters you need for config generation.",
  "Добавить параметр": "Add parameter",
  "Добавление параметра": "Add parameter",
  "Выберите параметр для добавления в класс. Можно фильтровать по категориям или использовать поиск.": "Choose a parameter to add to the class. You can filter by category or use search.",
  "Категории": "Categories",
  "Все параметры": "All parameters",
  "Поиск параметра по имени или описанию...": "Search by parameter name or description...",
  "По вашему запросу ничего не найдено.": "Nothing matched your search.",
  "Нет добавленных параметров. Нажмите «Добавить параметр», чтобы начать.": "No parameters have been added yet. Use “Add parameter” to get started.",
  "Быстрый поиск по добавленным параметрам": "Quick search for enabled parameters",
  "Фильтр ищет по названию, ключу и описанию параметра.": "This filter searches by parameter name, key, and description.",
  "Найти среди уже добавленных параметров...": "Find among the parameters you already added...",
  "По текущему фильтру ничего не найдено. Попробуйте изменить запрос или очистить поиск.": "Nothing matches the current filter. Try a different query or clear the search.",
  "Выберите значение...": "Choose a value...",
  "Выберите значения...": "Choose values...",
  "Выберите звук...": "Choose a sound...",
  "Выберите или введите значение...": "Select or enter a value...",
  "Выберите или введите своё значение...": "Choose or enter your own value...",
  "Список пуст": "The list is empty",
  "Добавить элемент": "Add item",
  "Значение...": "Value...",
  "Создать проект": "Create project",
  "Добавить класс": "Add class",
  "Нет открытых проектов": "No open projects",
  "Нет классов в проекте": "This project has no classes",
  "Дублировать вкладку": "Duplicate tab",
  "Пользовательские параметры": "Custom parameters",
  "Любые свои поля, которых нет в стандартном каталоге.": "Any custom fields that are not present in the standard catalog.",
  "Имя параметра": "Parameter name",
  "Тип": "Type",
  "Значение": "Value",
  "Слоты (CfgSlots)": "Slots (CfgSlots)",
  "Определение слотов для прикрепления предметов.": "Define attachment slots for items.",
  "Нет слотов. Нажмите «Добавить».": "No slots yet. Click “Add”.",
  "Имя слота": "Slot name",
  "Прокси объекты (CfgNonAIVehicles)": "Proxy objects (CfgNonAIVehicles)",
  "Объявление прикрепляемых частей (ProxyAttachment).": "Define attachable proxy parts (ProxyAttachment).",
  "Нет прокси. Нажмите «Добавить».": "No proxies yet. Click “Add”.",
  "Имя прокси": "Proxy name",
  "Варианты / Ретекстуры": "Variants / Retextures",
  "Дочерние классы, наследующие параметры этого класса.": "Child classes that inherit parameters from this class.",
  "Нет ретекстур. Нажмите «Добавить».": "No retextures yet. Click “Add”.",
  "Текстуры": "Textures",
  "Материалы": "Materials",
  "Пусто": "Empty",
  "Нет слотов": "No slots",
  "Выберите scope...": "Choose scope...",
  "Новый проект": "New project",
  "Основа предмета": "Core item",
  "Инвентарь и содержимое": "Inventory and storage",
  "Одежда и защита": "Clothing and protection",
  "Бой и звук": "Combat and sound",
  "Питание и спецсистемы": "Systems and utilities",
  "Выберите значение": "Choose a value",
  "Выберите значения": "Choose values",
};

const originalCatalogSnapshot = JSON.parse(JSON.stringify(CATALOG)) as CategoryDef[];

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "ru";

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "en" ? "en" : "ru";
}

export function formatMessage(
  locale: Locale,
  key: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  const entry = messages[locale][key];
  if (!entry) return key;
  return typeof entry === "function" ? entry(params ?? {}) : entry;
}

function containsCyrillic(value?: string) {
  return Boolean(value && /[А-Яа-яЁё]/.test(value));
}

export function localizeCategoryGroupLabel(locale: Locale, groupId: string) {
  return locale === "en" ? categoryGroupEn[groupId] || groupId : null;
}

export function localizeCategoryMeta(locale: Locale, category: CategoryDef) {
  if (locale === "ru") return category;

  const fallbackTitle = categoryTitleEn[category.id] || category.title;
  const fallbackDescription = containsCyrillic(category.description)
    ? categoryDescriptionEn[category.id] || "Parameters in this section."
    : category.description;

  return {
    ...category,
    title: fallbackTitle,
    description: fallbackDescription,
  };
}

function localizeOptionDescription(locale: Locale, option: SelectOption) {
  if (locale === "ru") return option.description;
  if (!containsCyrillic(option.description)) return option.description;
  return "";
}

export function localizeParamMeta(locale: Locale, param: ParamDef): ParamDef {
  if (locale === "ru") return param;

  const localizedLabel = containsCyrillic(param.label)
    ? param.key
    : param.label;
  const localizedDescription = containsCyrillic(param.description)
    ? `Controls "${localizedLabel}" for the current class.`
    : param.description;

  return {
    ...param,
    label: localizedLabel,
    description: localizedDescription,
    example:
      param.example && !containsCyrillic(param.example) ? param.example : "",
    selectOptions: param.selectOptions?.map((option) => ({
      ...option,
      description: localizeOptionDescription(locale, option),
    })),
  };
}

export function translateImportErrorMessage(locale: Locale, message?: string) {
  if (!message || locale === "ru") return message || "";
  return cppImportErrorMap[message] || message;
}

export function applyCatalogLocale(locale: Locale) {
  originalCatalogSnapshot.forEach((originalCategory, categoryIndex) => {
    const currentCategory = CATALOG[categoryIndex];
    const localizedCategory = localizeCategoryMeta(locale, originalCategory);

    currentCategory.title = localizedCategory.title;
    currentCategory.description = localizedCategory.description;

    originalCategory.params.forEach((originalParam, paramIndex) => {
      const currentParam = currentCategory.params[paramIndex];
      const localizedParam = localizeParamMeta(locale, originalParam);

      currentParam.label = localizedParam.label;
      currentParam.description = localizedParam.description;
      currentParam.example = localizedParam.example;

      if (currentParam.selectOptions && localizedParam.selectOptions) {
        localizedParam.selectOptions.forEach((localizedOption, optionIndex) => {
          currentParam.selectOptions![optionIndex].label = localizedOption.label;
          currentParam.selectOptions![optionIndex].description =
            localizedOption.description;
        });
      }
    });
  });
}

export function translateUiText(locale: Locale, text: string) {
  if (locale === "ru") return text;
  if (uiTextMapEn[text]) return uiTextMapEn[text];

  const replacements: Array<[RegExp, string | ((...args: string[]) => string)]> = [
    [/^Показано: (\d+) из (\d+)$/, (_full, shown, total) => `Shown: ${shown} of ${total}`],
    [/^Показано: (\d+)$/, (_full, count) => `Shown: ${count}`],
    [/^Параметров: (\d+)$/, (_full, count) => `Parameters: ${count}`],
    [/^(\d+) параметров в этой группе$/, (_full, count) => `${count} parameters in this group`],
    [/^1 параметр в этой группе$/, "1 parameter in this group"],
    [/^Найдите (.+)\.\.\.$/, (_full, label) => `Find ${label}...`],
    [/^Использовать своё значение: (.+)$/, (_full, value) => `Use custom value: ${value}`],
  ];

  for (const [pattern, replacement] of replacements) {
    const match = text.match(pattern);
    if (!match) continue;
    return typeof replacement === "string"
      ? replacement
      : replacement(...match);
  }

  return text;
}
