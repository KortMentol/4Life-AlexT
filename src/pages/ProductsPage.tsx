import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { cardVariants, containerVariants, itemVariants } from "../animations/variants";
import CallToAction from "../components/ui/CallToAction";
import ProductCard from "../components/ui/ProductCard";
import SectionHeading from "../components/ui/SectionHeading";
import { Icons } from "../utils/icons";

const productsData = [
  {
    image:
      "https://images.pexels.com/photos/7473850/pexels-photo-7473850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Transfer Factor Tri-Factor Formula",
    description: "Основа линейки 4Life, для всесторонней поддержки иммунной системы.",
    link: "https://russia.4life.com/products/4life-transfer-factor-tri-factor-formula", // Оригинальная ссылка на продукт
  },
  {
    image:
      "https://images.pexels.com/photos/7473851/pexels-photo-7473851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Transfer Factor Plus Tri-Factor Formula",
    description: "Мощная комбинация для максимальной поддержки иммунитета.",
    link: "https://russia.4life.com/products/4life-transfer-factor-plus-tri-factor-formula", // Оригинальная ссылка на продукт
  },
  {
    image:
      "https://images.pexels.com/photos/7473852/pexels-photo-7473852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Renuvo",
    description: "Адаптогенная формула для молодости, восстановления и жизненной энергии.",
    link: "https://russia.4life.com/products/4life-renuvo", // Оригинальная ссылка на продукт
  },
  {
    image:
      "https://images.pexels.com/photos/7473853/pexels-photo-7473853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Collagen",
    description: "Поддерживает здоровье кожи, волос, ногтей и суставов.",
    link: "https://russia.4life.com/products/4life-collagen", // Оригинальная ссылка на продукт
  },
  {
    image:
      "https://images.pexels.com/photos/7473850/pexels-photo-7473850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Pro-TF",
    description: "Высококачественный протеин для поддержания мышечной массы и здорового веса.",
    link: "https://russia.4life.com/products/4life-pro-tf", // Оригинальная ссылка на продукт
  },
  {
    image:
      "https://images.pexels.com/photos/7473851/pexels-photo-7473851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "RiteStart",
    description: "Комплексный мультивитаминный и минеральный комплекс для ежедневного здоровья.",
    link: "/purchase",
  },
  {
    image:
      "https://images.pexels.com/photos/7473852/pexels-photo-7473852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "BCV",
    description: "Целевая поддержка для здоровья сердца и всей сердечно-сосудистой системы.",
    link: "/purchase",
  },
  {
    image: "https://i.ibb.co/GtnqX9h/riovida.jpg",
    title: "RioVida",
    description: "Сокосодержащий напиток с Трансфер Факторами и антиоксидантами.",
    link: "/purchase",
  },
];

const ProductsPage: React.FC = () => {
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
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-green-100/70 to-teal-200/70 dark:from-gray-800/70 dark:to-gray-900/70 text-center overflow-hidden">
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

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-white/70 dark:bg-gray-800/70 relative overflow-hidden">
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
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Icons.Scale className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Управление Весом и Форма</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Решения для здорового контроля веса и поддержания оптимальной физической формы.
                </p>
              </motion.div>
              {/* Категория 4 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                variants={cardVariants}
                transition={{ delay: 0.8 }}
              >
                <Icons.Sparkles className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Красота и Уход</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Продукты для сияющей кожи, волос и ногтей, разработанные с учетом внутренней красоты.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 md:py-24 bg-gray-50/70 dark:bg-gray-800/70 relative overflow-hidden">
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
              {productsData.map((product, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative z-10 h-full"
                >
                  <ProductCard
                    image={product.image}
                    title={product.title}
                    description={product.description}
                    link={product.link}
                    delay={0.1 * index} // Динамическая задержка
                  />
                </motion.div>
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
    </>
  );
};

export default ProductsPage;
