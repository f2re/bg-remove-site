"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            ❓ Частые вопросы
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ответы на самые популярные вопросы пользователей
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 py-5 flex items-center justify-between text-left bg-white transition-colors"
                >
                  <span className="font-semibold text-lg pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0",
                      openIndex === index ? "rotate-180" : ""
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 py-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
