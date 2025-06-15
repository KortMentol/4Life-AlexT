import { useProductList } from "@/context/ProductListContext";
import { Product } from "@/types/Product";
import { Dialog, Transition } from "@headlessui/react";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Fragment, useState } from "react";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const { addToList } = useProductList();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleAdd = () => {
    addToList(product, quantity);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {product.name}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Image & Info */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:flex-shrink-0 md:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                      {product.longDescription}
                    </p>

                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Преимущества:</h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                      {product.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Ключевые ингредиенты:</h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                      {product.keyIngredients.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>

                    {/* Quantity selector */}
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={decrement}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <button
                        onClick={increment}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Добавить в Список
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDetailModal;
