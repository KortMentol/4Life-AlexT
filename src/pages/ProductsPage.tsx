import { motion } from "framer-motion";
import CallToAction from "../components/ui/CallToAction";
import ProductCard from "../components/ui/ProductCard";
import SectionHeading from "../components/ui/SectionHeading";
import { Icons } from "../utils/icons";
import { fadeIn, fadeInFromBottom } from "../lib/animations";

const productsData = [
  {
    image: "https://i.ibb.co/QcY68f1/transfer-factor.jpg",
    title: "Transfer Factor Tri-Factor Formula",
    description: "Основа линейки 4Life, для всесторонней поддержки иммунной системы.",
    link: "/products/transfer-factor",
  },
  {
    image: "https://i.ibb.co/y4L2W5N/transfer-factor-plus.jpg",
    title: "Transfer Factor Plus Tri-Factor Formula",
    description: "Мощная комбинация для максимальной поддержки иммунитета.",
    link: "/products/transfer-factor-plus",
  },
  {
    image: "https://i.ibb.co/hM9D89g/renuvo.jpg",
    title: "Renuvo",
    description: "Адаптогенная формула для молодости, восстановления и жизненной энергии.",
    link: "/products/renuvo",
  },
  {
    image: "https://i.ibb.co/yQjJ64F/collagen.jpg",
    title: "Collagen",
    description: "Поддерживает здоровье кожи, волос, ногтей и суставов.",
    link: "/products/collagen",
  },
  {
    image: "https://i.ibb.co/k2D8qBq/pro-tf.jpg",
    title: "Pro-TF",
    description: "Высококачественный протеин для поддержания мышечной массы и здорового веса.",
    link: "/products/pro-tf",
  },
  {
    image: "https://i.ibb.co/P44n0m7/ritestart.jpg",
    title: "RiteStart",
    description: "Комплексный мультивитаминный и минеральный комплекс для ежедневного здоровья.",
    link: "/products/ritestart",
  },
  {
    image: "https://i.ibb.co/1K743Lp/bcv.jpg",
    title: "BCV",
    description: "Целевая поддержка для здоровья сердца и всей сердечно-сосудистой системы.",
    link: "/products/bcv",
  },
  {
    image: "https://i.ibb.co/GtnqX9h/riovida.jpg",
    title: "RioVida",
    description: "Сокосодержащий напиток с Трансфер Факторами и антиоксидантами.",
    link: "/products/riovida",
  },
];

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section для Products Page */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-teal-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'url(https://i.ibb.co/Yc53L8w/hero-pattern.png)', backgroundRepeat: 'repeat', backgroundSize: 'contain' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-lg"
            variants={fadeInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
          >
            Наш Полный Каталог Продукции 4Life
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            variants={fadeInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Откройте для себя инновационные продукты для поддержки иммунитета и общего благополучия.
          </motion.p>
        </div>
      </section>

      {/* Секция: Популярные Категории */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading
            title="Изучите наши популярные категории"
            subtitle="Найдите идеальный продукт для своих нужд."
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Категория 1 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={fadeInFromBottom}
              transition={{ delay: 0.2 }}
            >
              <Icons.ShieldCheck className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Поддержка Иммунитета</h3>
              <p className="text-gray-600 dark:text-gray-400">Основные продукты с Трансфер Факторами для укрепления защитных сил организма.</p>
            </motion.div>
            {/* Категория 2 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={fadeInFromBottom}
              transition={{ delay: 0.4 }}
            >
              <Icons.HeartPulse className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Общее Благополучие</h3>
              <p className="text-gray-600 dark:text-gray-400">Продукты для поддержания жизненной энергии, детоксикации и антиоксидантной защиты.</p>
            </motion.div>
            {/* Категория 3 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={fadeInFromBottom}
              transition={{ delay: 0.6 }}
            >
              <Icons.Scale className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Управление Весом и Форма</h3>
              <p className="text-gray-600 dark:text-gray-400">Решения для здорового контроля веса и поддержания оптимальной физической формы.</p>
            </motion.div>
            {/* Категория 4 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={fadeInFromBottom}
              transition={{ delay: 0.8 }}
            >
              <Icons.Sparkles className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Красота и Уход</h3>
              <p className="text-gray-600 dark:text-gray-400">Продукты для сияющей кожи, волос и ногтей, разработанные с учетом внутренней красоты.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Секция: Все Продукты (Каталог) */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Все наши продукты"
            subtitle="Выберите продукты 4Life для своего здоровья и благополучия."
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {productsData.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                title={product.title}
                description={product.description}
                link={product.link}
                delay={0.1 * index} // Динамическая задержка
              />
            ))}
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
  );
};

export default ProductsPage;
