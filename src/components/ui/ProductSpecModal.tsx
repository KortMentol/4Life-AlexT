import { DetailedProduct } from "@/data/productsData";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import SciFiCloseButton from "./SciFiCloseButton";

interface ProductSpecModalProps {
  product: DetailedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSpecModal: React.FC<ProductSpecModalProps> = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static as={motion.div} open={isOpen} className="relative z-[100]" onClose={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80"
          />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 p-8 text-left align-middle shadow-2xl shadow-cyan-500/10 text-white">
                  <div className="absolute top-4 right-4">
                    <SciFiCloseButton onClick={onClose} />
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-2"
                  >
                    {product.name}
                  </Dialog.Title>
                  <p className="text-gray-400 mb-6">{product.shortDescription}</p>

                  <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar space-y-6">
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2">Основная поддержка:</h4>
                      <p className="text-gray-300">{product.mainSupport.join(", ")}</p>
                    </div>
                    {product.secondarySupport && product.secondarySupport.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-cyan-400 mb-2">Дополнительная поддержка:</h4>
                        <p className="text-gray-300">{product.secondarySupport.join(", ")}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2">Описание:</h4>
                      <p className="text-gray-300 whitespace-pre-line">{product.longDescription}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2">Ключевые преимущества:</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {product.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2">Состав:</h4>
                      <p className="text-gray-300 text-sm">{product.composition}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2">Способ применения:</h4>
                      <p className="text-gray-300">{product.howToUse}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2">Научное обоснование:</h4>
                      <p className="text-gray-400 text-sm italic">{product.scientificNotes}</p>
                    </div>
                  </div>
                </Dialog.Panel>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ProductSpecModal;
