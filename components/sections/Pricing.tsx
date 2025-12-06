"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { PRICING_PACKAGES, getBotUrl } from "@/lib/constants";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-950">
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
            💳 Прозрачные цены
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Выберите подходящий пакет. Без подписок и скрытых платежей
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PRICING_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              {/* Popular Badge */}
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4" />
                    Популярный
                  </div>
                </div>
              )}

              <Card
                className={`h-full ${
                  pkg.isPopular
                    ? "border-2 border-primary shadow-2xl scale-105"
                    : ""
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      {pkg.price === 0 ? "Бесплатно" : `${pkg.price}₽`}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {pkg.photos} {pkg.photos === 1 ? "фото" : "фото"}
                    </div>
                    {pkg.price > 0 && (
                      <div className="text-sm text-gray-500">
                        {pkg.pricePerPhoto}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    variant={pkg.isPopular ? "default" : "outline"}
                    onClick={() =>
                      window.open(getBotUrl(`pricing_${pkg.name}`, `pricing_${pkg.id}`), "_blank")
                    }
                  >
                    Выбрать пакет
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12 text-gray-600 dark:text-gray-400"
        >
          <p className="text-lg">
            Оплата через ЮKassa • Без подписок • Без автосписаний
          </p>
        </motion.div>
      </div>
    </section>
  );
}
