import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | BG Remove",
  description: "Политика конфиденциальности сервиса BG Remove - удаление фона с фотографий через Telegram бот",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <Link href="/" className="text-primary hover:underline mb-6 inline-block">
            ← Вернуться на главную
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Политика конфиденциальности
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты
                персональных данных пользователей сервиса BG Remove (далее — «Сервис»).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Используя Сервис, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Собираемые данные</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                При использовании Сервиса мы можем собирать следующую информацию:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Telegram ID пользователя</li>
                <li>Имя пользователя в Telegram (если установлено)</li>
                <li>Загруженные изображения (обрабатываются и немедленно удаляются)</li>
                <li>Данные о платежах (обрабатываются через ЮKassa)</li>
                <li>Техническая информация о взаимодействии с ботом</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Использование данных</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Собранные данные используются исключительно для:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Предоставления услуг по обработке изображений</li>
                <li>Обработки платежей</li>
                <li>Улучшения качества сервиса</li>
                <li>Технической поддержки пользователей</li>
                <li>Выполнения реферальной программы</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Защита данных</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Мы принимаем все необходимые меры для защиты ваших данных:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Загруженные изображения не сохраняются на наших серверах</li>
                <li>Все изображения удаляются сразу после обработки</li>
                <li>Используется шифрование данных при передаче</li>
                <li>Доступ к данным имеет только авторизованный персонал</li>
                <li>Сервис соответствует требованиям GDPR</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Платежная информация</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Обработка платежей осуществляется через платежную систему ЮKassa.
                Мы не храним данные банковских карт. Вся платежная информация обрабатывается
                в соответствии с международными стандартами безопасности PCI DSS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Реферальная программа</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                При участии в реферальной программе мы сохраняем информацию о рефералах
                для начисления бонусов. За приглашение нового пользователя начисляется {" "}
                {process.env.REFERRAL_REWARD_START || 5} бесплатных обработок.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Права пользователей</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Вы имеете право:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Запросить информацию о хранящихся данных</li>
                <li>Запросить удаление своих данных</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Получить копию своих данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies и аналитика</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Мы используем Яндекс.Метрику для анализа использования сайта.
                Эти данные являются анонимными и используются только для улучшения сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Изменения политики</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности.
                Актуальная версия всегда доступна на этой странице.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Контакты</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                По всем вопросам, связанным с обработкой персональных данных,
                вы можете обратиться к нам через Telegram бот.
              </p>
            </section>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
