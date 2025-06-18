import { useProductList } from "@/context/ProductListContext";
import "./ProductListIcon.css";
import { Dialog, Transition } from "@headlessui/react";
import {
  MinusIcon,
  PaperAirplaneIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ClipboardDocumentListIcon as ClipboardListIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

interface ProductListIconProps {
  className?: string;
}

const messengerButtonVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 10, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
};

const ProductListIcon: React.FC<ProductListIconProps> = ({ className }) => {
  const { items, removeFromList, updateItemQuantity, getTotalItems, clearList } = useProductList();

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Следим за состоянием модального окна для корректного обновления цвета иконки
  useEffect(() => {
    // Этот эффект запускается при изменении isOpen
    // и гарантирует, что состояние иконки всегда соответствует состоянию модального окна
    
    // Добавляем обработчик события Escape для закрытия модального окна
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    
    // Добавляем обработчик клика вне модального окна
    const handleClickOutside = (event: Event) => {
      // Если модальное окно открыто и клик был не по кнопке
      if (isOpen && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Проверяем, был ли клик по диалогу (не закрываем в этом случае)
        const dialogElement = document.querySelector('[role="dialog"]');
        if (dialogElement && !dialogElement.contains(event.target as Node)) {
          // Клик был вне диалога и вне кнопки - закрываем
          closeModal();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);
  const [showMessengerOptions, setShowMessengerOptions] = useState(false);
  const [clientId, setClientId] = useState<string>(
    () => (typeof window !== "undefined" && localStorage.getItem("clientId4life")) || ""
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("clientId4life", clientId);
    }
  }, [clientId]);

  const telegramUsername = "diementol";
  const whatsappNumber = "79659781912";
  const fatherName = "Александр";

  const openModal = () => setIsOpen(true);
  
  // Обработчик для клика по оверлею (вне модального окна)
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Проверяем, что клик был именно по оверлею, а не по содержимому модального окна
    if (e.target === e.currentTarget) {
      // Принудительно устанавливаем isOpen в false при клике по оверлею
      setIsOpen(false);
      setShowMessengerOptions(false);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    setShowMessengerOptions(false);
  };

  const generateMessage = () => {
    let message = `Здравствуйте, ${fatherName}! Хочу приобрести у вас:\n\n`;
    items.forEach((item: typeof items[number]) => {
      message += `- ${item.name} (${item.quantity} шт.)\n`;
    });
    if (clientId) {
      message += `\nID клиента: ${clientId}`;
    }
    message += `\nПожалуйста, свяжитесь со мной для оформления заказа.`;
    return encodeURIComponent(message);
  };

  const handleSendMessage = (messenger: "telegram" | "whatsapp") => {
    if (items.length === 0) return;
    const encodedMessage = generateMessage();
    const link =
      messenger === "telegram"
        ? `https://t.me/${telegramUsername}?text=${encodedMessage}`
        : `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(link, "_blank", "noopener noreferrer");
    clearList();
    closeModal();
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        className={`product-list-icon relative p-2 rounded-full ${isOpen ? 'text-blue-600 dark:text-blue-400 open' : 'text-gray-700 dark:text-gray-300 closed'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus-visible:ring-0 [-webkit-tap-highlight-color:transparent] ${className}`}
        onClick={openModal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Мой Список"
      >
        <ClipboardListIcon className="h-7 w-7" />
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.span
              key="list-count"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-current"
            >
              {getTotalItems()}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {
          // Принудительно устанавливаем isOpen в false при любом закрытии диалога
          setIsOpen(false);
          setShowMessengerOptions(false);
        }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto" onClick={handleBackdropClick}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-left shadow-xl transition-all dark:from-gray-900 dark:to-black relative text-white">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    onClick={closeModal}
                    aria-label="Закрыть"
                  >
                    <XMarkIcon className="h-7 w-7" />
                  </button>
                  <Dialog.Title className="text-2xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-3">
                    Ваш Список
                  </Dialog.Title>

                  {items.length === 0 ? (
                    <p className="text-gray-400 text-center py-10">Ваш список пуст. Добавьте продукты!</p>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-700 max-h-96 overflow-y-auto pr-2">
                        {items.map((item: typeof items[number]) => (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="py-4 flex items-center space-x-4"
                          >
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-md" />
                            <div className="flex-grow">
                              <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                              <p className="text-gray-400 text-sm line-clamp-2">{item.shortDescription}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="text-white text-md font-semibold min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromList(item.id)}
                              className="p-1 rounded-full text-red-400 hover:text-red-600 transition-colors duration-200"
                              aria-label="Удалить из списка"
                            >
                              <TrashIcon className="h-6 w-6" />
                            </button>
                          </motion.li>
                        ))}
                      </ul>

                      <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6">
                        <button
                          onClick={clearList}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 text-sm flex items-center mb-4 md:mb-0"
                        >
                          <TrashIcon className="h-5 w-5 mr-1" /> Очистить список
                        </button>
                        <div className="relative">
                          {!showMessengerOptions ? (
                            <motion.button
                              onClick={() => setShowMessengerOptions(true)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 w-full justify-center"
                              layoutId="send-order-button"
                            >
                              <PaperAirplaneIcon className="h-6 w-6" />
                              <span>Отправить Заказ</span>
                            </motion.button>
                          ) : clientId.trim() === "" ? (
                            <div className="flex flex-col space-y-4 w-full">
                              <label className="text-sm text-gray-300 flex flex-col items-start w-full">
                                <span className="mb-1">Введите ваш ID клиента 4Life (если есть):</span>
                                <input
                                  type="text"
                                  value={clientId}
                                  onChange={(e) => setClientId(e.target.value)}
                                  placeholder="Напр., 12345678"
                                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                />
                              </label>
                              <motion.button
                                onClick={() => clientId.trim() && setShowMessengerOptions(true)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all duration-300 w-full"
                              >
                                Продолжить
                              </motion.button>
                            </div>
                          ) : (
                            <AnimatePresence>
                              <motion.div
                                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.button
                                  variants={messengerButtonVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  onClick={() => handleSendMessage("telegram")}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-sky-700 transition-all duration-300 flex items-center space-x-2 justify-center"
                                >
                                  <FaTelegram className="h-6 w-6" />
                                  <span>В Telegram</span>
                                </motion.button>
                                <motion.button
                                  variants={messengerButtonVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  onClick={() => handleSendMessage("whatsapp")}
                                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 justify-center"
                                >
                                  <FaWhatsapp className="h-6 w-6" />
                                  <span>В WhatsApp</span>
                                </motion.button>
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProductListIcon;
