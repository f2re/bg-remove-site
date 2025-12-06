export const BOT_USERNAME = "BackgroundRemoving_bot";
export const BOT_URL = `https://t.me/${BOT_USERNAME}`;

/**
 * Generates bot URL with UTM parameters for Yandex Metrika analytics
 * @param source - Traffic source (e.g., "hero", "cta", "pricing", "footer")
 * @param startParam - Optional Telegram start parameter
 * @returns Full bot URL with UTM parameters
 */
export function getBotUrl(source: string, startParam?: string): string {
  const utmParams = new URLSearchParams({
    utm_source: "website",
    utm_medium: "button",
    utm_campaign: "bg_remove",
    utm_content: source,
  });

  // Add Telegram start parameter if provided
  let url = BOT_URL;
  if (startParam) {
    url += `?start=${startParam}`;
    return `${url}&${utmParams.toString()}`;
  }

  return `${url}?${utmParams.toString()}`;
}

// Free images for new users
export const FREE_IMAGES_COUNT = 3;

// Referral program configuration
export const REFERRAL_REWARD_START = 5;
export const REFERRAL_REWARD_PURCHASE_PERCENT = 10;

// Metrika goals
export const METRIKA_GOAL_START = "start_bot";
export const METRIKA_GOAL_FIRST_IMAGE = "first_image";
export const METRIKA_GOAL_PURCHASE = "purchase";

export const PRICING_PACKAGES = [
  {
    id: 1,
    name: "Пробный",
    price: 99,
    photos: 5,
    pricePerPhoto: "~20₽/шт",
    isPopular: false,
    features: ["5 фотографий", "Прозрачный или белый фон", "Быстрая обработка"],
  },
  {
    id: 2,
    name: "Стартовый",
    price: 199,
    photos: 15,
    pricePerPhoto: "~13₽/шт",
    isPopular: false,
    features: ["15 фотографий", "Пакетная обработка", "Два типа фона"],
  },
  {
    id: 3,
    name: "Профи",
    price: 699,
    photos: 50,
    pricePerPhoto: "~14₽/шт",
    isPopular: true,
    features: ["50 фотографий", "Максимальная выгода", "Приоритетная поддержка"],
  },
  {
    id: 4,
    name: "Бизнес",
    price: 1499,
    photos: 150,
    pricePerPhoto: "~10₽/шт",
    isPopular: false,
    features: ["150 фотографий", "Для активных селлеров", "VIP поддержка"],
  },
];

export const FEATURES = [
  {
    icon: "Target",
    title: "Два типа фона",
    description: "Прозрачный PNG или белый фон. Для документов, маркетплейсов и соцсетей.",
  },
  {
    icon: "Sparkles",
    title: "Две нейросети",
    description: "Bria RMBG 2.0 и Gemini 2.5 Flash. Лучшее качество обработки.",
  },
  {
    icon: "Zap",
    title: "Молниеносная скорость",
    description: "Обработка за 5-10 секунд. Пакетная загрузка до 10 фото одновременно.",
  },
  {
    icon: "Wallet",
    title: "Доступные цены",
    description: "От 10₽ за фото. 3 фото бесплатно для новых пользователей. Без подписок и автосписаний.",
  },
  {
    icon: "Smartphone",
    title: "Удобство Telegram",
    description: "Работает на любом устройстве. Без установки приложений.",
  },
  {
    icon: "Shield",
    title: "Безопасность",
    description: "Фото не сохраняются. Оплата через ЮKassa.",
  },
];

export const USE_CASES = [
  {
    icon: "ShoppingBag",
    title: "Продавцы на маркетплейсах",
    description: "Ozon, Wildberries, Яндекс.Маркет требуют фото на белом фоне. Делаем автоматически за секунды.",
  },
  {
    icon: "Camera",
    title: "Фотографы и дизайнеры",
    description: "Быстрая обработка продуктовых фото, портретов, создание коллажей. Без Photoshop.",
  },
  {
    icon: "FileText",
    title: "Документы и резюме",
    description: "Фото на документы, паспорт, визу. Прозрачный или белый фон по стандартам.",
  },
  {
    icon: "Instagram",
    title: "SMM и контент-мейкеры",
    description: "Обработка фото для Instagram, VK, Telegram. Стикеры, посты, истории.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Нажмите кнопку",
    description: "Откроется Telegram бот",
  },
  {
    step: 2,
    title: "Отправьте фото (документом или альбомом)",
    description: "Вы получите прозрачный или белый фон",
  },
  {
    step: 3,
    title: "Получите результат",
    description: "Готово за 5-10 секунд!",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Как начать пользоваться ботом?",
    answer: "Нажмите кнопку \"Открыть Telegram бот\" на этой странице. Бот автоматически запустится, и вы сможете сразу отправить первое фото для обработки. Первые 3 фото совершенно бесплатно!",
  },
  {
    question: "Какие форматы изображений поддерживаются?",
    answer: "Поддерживаются все популярные форматы: JPEG, PNG, WebP. Максимальный размер файла: 20 МБ. Рекомендуем использовать изображения высокого качества для лучшего результата.",
  },
  {
    question: "Сколько стоит обработка одного фото?",
    answer: "Первые 3 фото абсолютно бесплатно для новых пользователей. Далее стоимость начинается от 10₽ за фото в зависимости от выбранного пакета. Чем больше пакет, тем выгоднее цена за одно фото.",
  },
  {
    question: "Можно ли обработать несколько фото сразу?",
    answer: "Да! Отправьте альбом из нескольких фотографий (до 10 штук), и бот обработает их все одновременно. Это экономит ваше время и очень удобно для массовой обработки.",
  },
  {
    question: "Вы сохраняете мои фотографии?",
    answer: "Нет, мы не храним ваши изображения. Фото обрабатываются в реальном времени и сразу удаляются с серверов после отправки вам результата. Ваша конфиденциальность для нас приоритет.",
  },
  {
    question: "Какие способы оплаты доступны?",
    answer: "Оплата производится через ЮKassa — самый надежный платежный сервис в России. Принимаем все банковские карты: Visa, MasterCard, МИР, а также СБП и электронные кошельки.",
  },
  {
    question: "Есть ли возврат средств?",
    answer: "Да, мы делаем возврат в течение 7 дней, если возникли технические проблемы с обработкой. Просто напишите нашей поддержке в боте, и мы решим вопрос.",
  },
  {
    question: "В чем разница между прозрачным и белым фоном?",
    answer: "Прозрачный фон (PNG) — идеален для дизайна, коллажей и наложения на другие изображения. Белый фон — требуется для маркетплейсов (Ozon, Wildberries), документов и официальных фото.",
  },
];
