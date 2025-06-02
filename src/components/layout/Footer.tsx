import { siteConfig } from '../../config/site';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-gray-800 text-gray-300 py-10 md:py-16">
      <div className="container mx-auto px-4 py-10 mt-12 border-t border-gray-700" role="region" aria-label="Подвал сайта">
        <div className="text-center text-sm text-gray-400">
          <p>Продукция 4Life не является лекарственным средством. Перед применением рекомендуется проконсультироваться со специалистом. Результаты индивидуальны и могут отличаться.</p>
          <p className="mt-2"> {currentYear} {siteConfig.distributor.name}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
