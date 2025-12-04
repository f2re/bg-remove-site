import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Публичная оферта | BG Remove",
  description: "Публичная оферта сервиса BG Remove - удаление фона с фотографий через Telegram бот",
};

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <Link href="/" className="text-primary hover:underline mb-6 inline-block">
            ← Вернуться на главную
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Публичная оферта
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                1.1. Настоящий документ является публичной офертой (далее — «Оферта») и
                содержит все существенные условия оказания услуг по удалению фона с изображений
                через Telegram бот BG Remove (далее — «Сервис»).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                1.2. В соответствии со статьей 437 Гражданского кодекса Российской Федерации
                данный документ является публичной офертой, и в случае принятия изложенных
                ниже условий физическое или юридическое лицо, производящее акцепт этой Оферты,
                осуществляет оплату услуг в соответствии с условиями настоящей Оферты.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                1.3. Акцептом настоящей Оферты считается факт оплаты услуг Пользователем.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Термины и определения</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Исполнитель</strong> — владелец и оператор Сервиса BG Remove</li>
                <li><strong>Заказчик (Пользователь)</strong> — физическое или юридическое лицо, использующее Сервис</li>
                <li><strong>Услуга</strong> — автоматическая обработка изображений с целью удаления фона</li>
                <li><strong>Обработка</strong> — одна операция по удалению фона с изображения</li>
                <li><strong>Пакет</strong> — набор обработок, доступный для приобретения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Предмет оферты</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                3.1. Исполнитель обязуется оказать Заказчику услуги по автоматической обработке
                изображений, а Заказчик обязуется оплатить эти услуги в соответствии с
                условиями настоящей Оферты.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                3.2. Услуги оказываются через Telegram бот с использованием технологий
                искусственного интеллекта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Стоимость услуг</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                4.1. Стоимость услуг определяется в соответствии с действующими на момент
                оплаты тарифами:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Бесплатно:</strong> 3 обработки для новых пользователей</li>
                <li><strong>Пакет «Пробный»:</strong> 5 обработок — 99 рублей</li>
                <li><strong>Пакет «Стартовый»:</strong> 15 обработок — 199 рублей</li>
                <li><strong>Пакет «Профи»:</strong> 50 обработок — 699 рублей</li>
                <li><strong>Пакет «Бизнес»:</strong> 150 обработок — 1499 рублей</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                4.2. Все цены указаны в российских рублях и включают НДС (если применимо).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                4.3. Исполнитель имеет право изменять стоимость услуг, при этом стоимость
                уже оплаченных услуг изменению не подлежит.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Порядок оплаты</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                5.1. Оплата услуг производится через платежную систему ЮKassa.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                5.2. Оплата производится в российских рублях.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                5.3. Услуги считаются оказанными с момента предоставления Заказчику
                обработанного изображения.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                5.4. Исполнитель не несет ответственности за задержки, связанные с работой
                платежных систем.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Права и обязанности сторон</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>6.1. Исполнитель обязуется:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Обеспечить доступность Сервиса</li>
                <li>Обрабатывать изображения в течение 5-10 секунд</li>
                <li>Обеспечить конфиденциальность данных</li>
                <li>Немедленно удалять обработанные изображения с серверов</li>
                <li>Предоставлять техническую поддержку</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>6.2. Заказчик обязуется:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Соблюдать условия настоящей Оферты</li>
                <li>Загружать только легальный контент</li>
                <li>Не использовать Сервис в противоправных целях</li>
                <li>Своевременно оплачивать услуги</li>
                <li>Не злоупотреблять реферальной программой</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Реферальная программа</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                7.1. Заказчик может приглашать новых пользователей по реферальной ссылке.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                7.2. За каждого нового пользователя, зарегистрировавшегося по реферальной
                ссылке, Заказчик получает 5 бесплатных обработок.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                7.3. Бонусы начисляются автоматически и могут быть использованы для
                обработки изображений.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                7.4. При обнаружении накрутки рефералов Исполнитель имеет право аннулировать
                бонусы и заблокировать аккаунт Заказчика.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Возврат средств</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                8.1. Возврат средств возможен в течение 7 дней с момента оплаты при
                наличии технических проблем, препятствующих использованию Сервиса.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                8.2. Возврат не производится, если Заказчик уже использовал часть
                приобретенных обработок.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                8.3. Для получения возврата необходимо обратиться в службу поддержки
                через Telegram бот.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                8.4. Возврат средств осуществляется тем же способом, которым была
                произведена оплата, в течение 10 рабочих дней.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Ответственность сторон</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                9.1. Исполнитель не несет ответственности за качество обработки,
                не соответствующее ожиданиям Заказчика, если обработка была выполнена технически корректно.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                9.2. Исполнитель не несет ответственности за содержание загружаемых
                Заказчиком изображений.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                9.3. Исполнитель не несет ответственности за временную недоступность
                Сервиса по причинам технического обслуживания.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                9.4. Заказчик несет полную ответственность за легальность загружаемого контента.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Конфиденциальность</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                10.1. Обработка персональных данных осуществляется в соответствии с
                Политикой конфиденциальности.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                10.2. Загруженные изображения не сохраняются на серверах Исполнителя и
                удаляются сразу после обработки.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Срок действия оферты</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                11.1. Настоящая Оферта вступает в силу с момента публикации и действует
                до момента её отзыва Исполнителем.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                11.2. Исполнитель имеет право внести изменения в условия Оферты.
                Изменения вступают в силу с момента их публикации.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Разрешение споров</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                12.1. Все споры решаются путем переговоров.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                12.2. В случае невозможности урегулирования споров путем переговоров,
                они подлежат разрешению в судебном порядке в соответствии с
                законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Прочие условия</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                13.1. Настоящая Оферта регулируется и толкуется в соответствии с
                законодательством Российской Федерации.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                13.2. Признание судом какого-либо положения Оферты недействительным не
                влечет за собой недействительность остальных положений.
              </p>
            </section>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Дата публикации: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
