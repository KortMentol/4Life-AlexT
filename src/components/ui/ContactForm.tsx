import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
}

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // In a real scenario, this would send the form data to a server
    setTimeout(() => {
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 500);
  };

  return (
    <motion.div 
      className="card p-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold mb-6">Отправьте мне сообщение</h3>
      
      {isSubmitted ? (
        <motion.div 
          className="flex flex-col items-center justify-center text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h4 className="text-xl font-medium mb-2">Сообщение отправлено!</h4>
          <p className="text-gray-600">Спасибо за обращение. Я свяжусь с Вами в ближайшее время.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Ваше имя *</label>
            <input
              type="text"
              id="name"
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: 'Пожалуйста, укажите Ваше имя' })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Ваш Email *</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { 
                required: 'Пожалуйста, укажите Ваш Email', 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Неверный формат Email'
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Ваш телефон</label>
            <input
              type="tel"
              id="phone"
              className="form-input"
              {...register('phone')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">Тема сообщения *</label>
            <select
              id="subject"
              className={`form-input ${errors.subject ? 'border-red-500' : ''}`}
              {...register('subject', { required: 'Пожалуйста, выберите тему' })}
            >
              <option value="">Выберите тему...</option>
              <option value="products">Вопрос по продукции</option>
              <option value="order">Консультация по заказу</option>
              <option value="partnership">Интересует партнерство</option>
              <option value="other">Другое</option>
            </select>
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Текст Вашего сообщения *</label>
            <textarea
              id="message"
              rows={5}
              className={`form-input ${errors.message ? 'border-red-500' : ''}`}
              {...register('message', { required: 'Пожалуйста, введите Ваше сообщение' })}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent"
                className="mt-1 mr-2"
                {...register('consent', { required: 'Необходимо Ваше согласие' })}
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                Я даю согласие на обработку моих персональных данных *
              </label>
            </div>
            {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full flex items-center justify-center">
            <Send className="h-4 w-4 mr-2" />
            Отправить сообщение
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ContactForm;