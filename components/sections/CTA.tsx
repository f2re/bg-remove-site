"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getBotUrl, BOT_USERNAME } from "@/lib/constants";
import { Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-cta opacity-95" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            🚀 Попробуйте прямо сейчас бесплатно!
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl mb-4 text-white/90"
          >
            Первые 3 фото совершенно бесплатно
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg mb-10 text-white/80"
          >
            Никаких регистраций. Просто откройте бот и начните!
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mb-8"
          >
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-50 text-lg px-12 py-6 shadow-2xl animate-pulse-slow"
              onClick={() => window.open(getBotUrl("cta", "cta"), "_blank")}
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.98 1.26-5.59 3.7-.53.37-.97.55-1.32.54-.43-.01-1.27-.24-1.89-.44-.76-.24-1.37-.37-1.32-.78.03-.21.37-.43.98-.65 3.84-1.67 6.41-2.77 7.7-3.29 3.67-1.52 4.43-1.78 4.93-1.79.11 0 .35.03.51.17.13.12.17.27.19.38-.01.06-.01.24-.03.38z" />
              </svg>
              Открыть Telegram бот
            </Button>
          </motion.div>

          {/* Bot Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white/70"
          >
            <p className="text-sm mb-2">или перейдите по ссылке:</p>
            <a
              href={getBotUrl("cta_link")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-mono hover:text-white transition-colors underline"
            >
              t.me/{BOT_USERNAME}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
