"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Camera, FileText, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { USE_CASES } from "@/lib/constants";

const iconMap = {
  ShoppingBag,
  Camera,
  FileText,
  Instagram,
};

export default function UseCases() {
  return (
    <section id="use-cases" className="py-20 bg-gray-50 dark:bg-gray-900">
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
            👥 Для кого подходит наш сервис?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Профессиональные решения для бизнеса и личных нужд
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {USE_CASES.map((useCase, index) => {
            const Icon = iconMap[useCase.icon as keyof typeof iconMap];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2">
                          {useCase.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
