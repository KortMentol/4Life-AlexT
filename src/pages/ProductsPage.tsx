import { productsData } from "@/data/productsData";
import { Product } from "@/types/Product";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { cardVariants, containerVariants, itemVariants } from "../animations/variants";
import CallToAction from "../components/ui/CallToAction";
import CategoryFilter from "../components/ui/CategoryFilter";
import ProductCard from "../components/ui/ProductCard";
import ProductDetailModal from "../components/ui/ProductDetailModal";
import SectionHeading from "../components/ui/SectionHeading";
import { Icons } from "../utils/icons";

const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = Array.from(new Set(productsData.flatMap((p) => p.categories ?? []))).sort();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearSelection = () => setSelectedCategories([]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);
  const filteredProducts =
    selectedCategories.length === 0
      ? productsData
      : productsData.filter((p) => (p.categories ?? []).some((cat) => selectedCategories.includes(cat)));

  return (
    <>
      <Helmet>
        <title>Продукты 4Life - Укрепление иммунитета и здоровье с Александром Тощевым</title>
        <meta
          name="description"
          content="Инновационные продукты 4Life с Трансфер Факторами для укрепления иммунитета и улучшения здоровья. Официальный представитель Александр Тощев."
        />
        <meta property="og:title" content="Продукты 4Life - Укрепление иммунитета и здоровье с Александром Тощевым" />
        <meta
          property="og:description"
          content="Инновационные продукты 4Life с Трансфер Факторами для укрепления иммунитета и улучшения здоровья. Официальный представитель Александр Тощев."
        />
        <meta property="og:image" content="/images/og-products.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/products" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Продукты 4Life - Укрепление иммунитета и здоровье с Александром Тощевым" />
        <meta
          name="twitter:description"
          content="Инновационные продукты 4Life с Трансфер Факторами для укрепления иммунитета и улучшения здоровья. Официальный представитель Александр Тощев."
        />
        <meta name="twitter:image" content="/images/og-products.jpg" />
      </Helmet>
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-green-100/0 to-teal-200/0 dark:from-gray-800/0 dark:to-gray-900/0 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-black/20 z-0"></div>
          <div
            className="absolute inset-0 z-0 opacity-30"
            style={{
              backgroundImage: "url(https://i.ibb.co/Yc53L8w/hero-pattern.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "contain",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px" }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-lg"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                Наш Полный Каталог Продукции 4Life
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                Откройте для себя инновационные продукты для поддержки иммунитета и общего благополучия.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Technology & Science Section */}
        <section className="py-16 md:py-24 bg-white/0 dark:bg-gray-800/0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent dark:from-black/10 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <SectionHeading
                title="Наши Уникальные Технологии и Научное Превосходство"
                subtitle="Наука лежит в основе каждой формулы 4Life"
                centered
              />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px 0px" }}
            >
              {/* Transfer Factors */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
              >
                <Icons.ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Трансфер&nbsp;Факторы</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Уникальные молекулы иммунной памяти, обучающие и балансирующие защитные клетки организма.
                </p>
              </motion.div>
              {/* Patents & Research */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.2 }}
              >
                <Icons.FlaskConical className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Патенты и Исследования</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Продукция защищена патентами и подтверждена клиническими исследованиями.
                </p>
                <a
                  href="https://russia.4life.com/12299550/page/47/studies-and-publications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:underline"
                >
                  Подробнее
                  <Icons.ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
              {/* Advisory Board */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.4 }}
              >
                <Icons.Users className="h-12 w-12 text-violet-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Экспертный Совет</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Формулы разрабатываются при участии ведущих учёных и врачей со всего мира.
                </p>
              </motion.div>
              {/* Quality Control */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.6 }}
              >
                <Icons.CheckCircle className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Строгий Контроль Качества</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Многоступенчатая проверка — от сырья до готового продукта, гарантирует чистоту и эффективность.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-white/0 dark:bg-gray-800/0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent dark:from-black/10 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <SectionHeading
                title="Категории продуктов"
                subtitle="Выберите категорию, которая вас интересует"
                centered
              />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px 0px" }}
            >
              {/* Категория 1 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
              >
                <Icons.Shield className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Иммунитет и Общее Здоровье</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Базовая поддержка иммунной системы и жизненной энергии.
                </p>
              </motion.div>
              {/* Категория 2 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.2 }}
              >
                <Icons.HeartPulse className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Целевая Поддержка</h3>
                <p className="text-gray-600 dark:text-gray-400">Решения для сердца, печени, мозга и других систем.</p>
              </motion.div>
              {/* Категория 3 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.4 }}
              >
                <Icons.Scale className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Управление Весом</h3>
                <p className="text-gray-600 dark:text-gray-400">Продукты для контроля массы тела и метаболизма.</p>
              </motion.div>
              {/* Категория 4 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.6 }}
              >
                <Icons.Sparkles className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Красота и Уход</h3>
                <p className="text-gray-600 dark:text-gray-400">Коллаген и другие решения для кожи, волос и ногтей.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategories}
          toggleCategory={toggleCategory}
          clearSelection={clearSelection}
        />

        {/* Products Section */}
        <section className="py-16 md:py-24 bg-gray-50/0 dark:bg-gray-800/0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent dark:from-black/10 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <SectionHeading
                title="Продукция 4Life"
                subtitle="Выберите продукты 4Life для своего здоровья и благополучия."
              />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px 0px" }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative z-10 h-full"
                >
                  <ProductCard product={product} delay={0.1 * index} onQuickView={handleQuickView} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 md:py-24 bg-white/0 dark:bg-gray-800/0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent dark:from-black/10 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <SectionHeading
                title="Почему миллионы выбирают 4Life?"
                subtitle="Три ключевые причины доверять нашему бренду"
                centered
              />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px 0px" }}
            >
              {/* Innovation & Science */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
              >
                <Icons.Lightbulb className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Инновации и Наука</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Постоянные исследования и запатентованные технологии для максимальной эффективности.
                </p>
              </motion.div>
              {/* Quality & Safety */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.2 }}
              >
                <Icons.CheckCircle className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Качество и Безопасность</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Многоступенчатый контроль качества и сырьё премиум-класса.
                </p>
              </motion.div>
              {/* Global Community */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.4 }}
              >
                <Icons.Globe className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Глобальное Сообщество</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Миллионы довольных клиентов и дистрибьюторов в 70+ странах мира.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Финальный CTA */}
        <CallToAction
          title="Есть вопросы о продуктах 4Life?"
          description="Свяжитесь со мной, и я помогу вам выбрать идеальные решения для ваших нужд."
          primaryButtonText="Получить консультацию"
          primaryButtonLink="/contact"
          secondaryButtonText="Узнать о партнерстве"
          secondaryButtonLink="/partnership"
        />
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} isOpen={!!selectedProduct} onClose={closeModal} />
      )}
    </>
  );
};

export default ProductsPage;
