import { Sparkles } from "lucide-react";
import Link from "next/link";
import { getBotUrl } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BG Remove</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Профессиональное удаление фона с фотографий через Telegram бот.
              Быстро, качественно, доступно.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Цены
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  Вопросы
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Документы</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link href="/offer" className="hover:text-primary transition-colors">
                  Публичная оферта
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} BG Remove Bot. Все права защищены.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={getBotUrl("footer")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Telegram"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.98 1.26-5.59 3.7-.53.37-.97.55-1.32.54-.43-.01-1.27-.24-1.89-.44-.76-.24-1.37-.37-1.32-.78.03-.21.37-.43.98-.65 3.84-1.67 6.41-2.77 7.7-3.29 3.67-1.52 4.43-1.78 4.93-1.79.11 0 .35.03.51.17.13.12.17.27.19.38-.01.06-.01.24-.03.38z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors"
              aria-label="VK"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.65 14.19h-1.55c-.45 0-.58-.36-1.38-1.16-.7-.69-1-.78-1.18-.78-.24 0-.31.07-.31.41v1.06c0 .29-.09.46-1.03.46-1.31 0-2.75-.79-3.77-2.27-1.52-2.1-1.94-3.68-1.94-4-.0-.24.07-.47.41-.47h1.55c.31 0 .42.14.54.47.61 1.72 1.63 3.23 2.05 3.23.16 0 .23-.07.23-.47v-1.83c-.05-.98-.57-1.06-.57-1.41 0-.19.16-.38.42-.38h2.44c.26 0 .35.14.35.44v2.47c0 .26.12.35.19.35.16 0 .29-.09.58-.38 1.09-1.22 1.87-3.1 1.87-3.1.1-.21.24-.41.61-.41h1.55c.37 0 .45.19.37.44-.14.62-1.76 3.16-1.76 3.16-.13.21-.18.3 0 .54.13.18.56.55.85.88.53.6.94 1.1 1.05 1.45.11.36-.08.54-.44.54z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
