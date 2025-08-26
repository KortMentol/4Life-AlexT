// src/components/ui/ProductDetailView.tsx

import { productsData } from "@/data/productsData";
import { useProductList } from "@/hooks/useProductList";
import { preloadImage } from "@/utils/imageUtils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icons } from "@/utils/icons";
import Button from "./Button";
import ProductSpecModal from "./ProductSpecModal";
import SciFiCloseButton from "./SciFiCloseButton";

// [OPTIMIZATION] Варианты для плавного, последовательного появления контента ПОСЛЕ основной анимации.
const contentContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      // Задержка, чтобы дождаться завершения layout-анимации
      delayChildren: 0.4,
      staggerChildren: 0.08, // Элементы появляются один за другим
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const ProductDetailView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToList } = useProductList();
  const productId = searchParams.get("product");
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  const { activeProduct, activeIndex } = useMemo(() => {
    if (!productId) return { activeProduct: null, activeIndex: -1 };
    const product = productsData.find((p) => p.id === productId) || null;
    const index = product ? productsData.indexOf(product) : -1;
    return { activeProduct: product, activeIndex: index };
  }, [productId]);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (activeIndex !== -1 && productsData.length > 0) {
      const prevIndex = (activeIndex - 1 + productsData.length) % productsData.length;
      const nextIndex = (activeIndex + 1) % productsData.length;
      const prevProduct = productsData[prevIndex];
      const nextProduct = productsData[nextIndex];
      if (prevProduct) preloadImage(prevProduct.image);
      if (nextProduct) preloadImage(nextProduct.image);
    }
  }, [activeIndex]);

  const handleSlideChange = (swiper: any) => {
    const newProduct = productsData[swiper.realIndex];
    if (newProduct) {
      setSearchParams({ product: newProduct.id }, { replace: true });
    }
  };

  const handleClose = () => setSearchParams({}, { replace: true });
  const handleAddToCart = () => {
    if (activeProduct) {
      addToList(activeProduct, quantity);
      handleClose();
    }
  };

  useEffect(() => setQuantity(1), [productId]);

  return (
    <>
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="absolute top-5 right-5 z-[52]">
              <SciFiCloseButton onClick={handleClose} />
            </div>

            <Swiper
              modules={[Navigation, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              onSlideChange={handleSlideChange}
              initialSlide={activeIndex}
              navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
              className="w-full h-full product-detail-swiper"
              key={activeIndex}
            >
              {productsData.map((product) => (
                <SwiperSlide key={product.id} className="relative">
                  {/* [REFACTOR] Этот div теперь ЕДИНСТВЕННЫЙ элемент с layoutId. Он становится фоном. */}
                  <motion.div
                    key={product.id + "-bg"}
                    className="absolute inset-0 w-full h-full"
                    layoutId={`product-card-${product.id}`}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60" />
                  </motion.div>

                  <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-end text-white">
                    {/* [OPTIMIZATION] Контейнер для анимированного появления контента. */}
                    <motion.div
                      variants={contentContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full max-w-md space-y-6"
                    >
                      {/* [REFACTOR] layoutId убран. Теперь используется itemVariants. */}
                      <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent drop-shadow-lg"
                      >
                        {product.name}
                      </motion.h1>

                      <motion.p variants={itemVariants} className="text-lg text-gray-300 line-clamp-3">
                        {product.longDescription}
                      </motion.p>

                      <motion.button
                        variants={itemVariants}
                        onClick={() => setIsSpecModalOpen(true)}
                        className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors group"
                      >
                        <Icons.Info className="w-5 h-5" />
                        <span className="border-b border-dashed border-cyan-400/50 group-hover:border-cyan-400">
                          Показать полную спецификацию
                        </span>
                      </motion.button>

                      <motion.div variants={itemVariants} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 p-2 rounded-full bg-black/20 border border-white/10">
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          >
                            <Icons.Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xl font-bold w-10 text-center">{quantity}</span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          >
                            <Icons.Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <Button
                          onClick={handleAddToCart}
                          variant="primary"
                          size="lg"
                          icon={<Icons.ShoppingCart className="w-5 h-5" />}
                        >
                          В Список
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductSpecModal product={activeProduct} isOpen={isSpecModalOpen} onClose={() => setIsSpecModalOpen(false)} />
    </>
  );
};

export default ProductDetailView;
