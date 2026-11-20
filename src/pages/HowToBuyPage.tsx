import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button, ParallaxImage } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import logisticsImage from "@/assets/images/backgrounds/editorial-logistics.png";
import React from "react";
import { Link } from "react-router-dom";

const steps = [
  { number: "01", title: "Выберите продукты", copy: "Соберите список в каталоге. В карточках указаны состав, формат выпуска и баллы LP из текущих материалов сайта.", href: "/products" },
  { number: "02", title: "Передайте партнёрский ID", copy: `ID ${siteConfig.distributor.fourLifeId} уже будет указан в сообщении заказа. Он помогает центру найти данные партнёра; скидку и итоговую цену подтвердите до оплаты.`, href: "/contact" },
  { number: "03", title: "Уточните оформление", copy: "Отправьте список в РЦ 67 и согласуйте наличие, способ оплаты, самовывоз или доставку до того, как оплачивать заказ.", href: "/contact" },
];

const HowToBuyPage: React.FC = () => (
  <main className="bg-[#03050a] text-white">
    <SEO
      title="Как заказать 4Life в России | РЦ 67"
      description="Порядок формирования списка продуктов 4Life и связи с РЦ 67. Актуальные цену, наличие и условия скидки подтвердите перед оплатой."
      path="/how-to-buy"
      type="website"
    />

    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_10%,rgba(6,182,212,0.12),transparent_44%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <PageEntrance className="flex flex-col items-start">
            <span data-entrance="badge" className="typography-label mb-6 text-cyan-300">Порядок заказа в России · РЦ 67</span>
            <div data-entrance="title">
              <h1 className="typography-display max-w-4xl text-white">
                Как заказать <span className="mx-1.5 inline-flex h-10 w-20 items-center justify-center overflow-hidden rounded-full border border-white/15 align-middle shadow-[0_0_30px_rgba(6,182,212,0.15)] md:h-14 md:w-32"><img src={logisticsImage} alt="" className="h-full w-full scale-110 object-cover" loading="lazy" decoding="async" /></span> оригинальные продукты 4Life
              </h1>
            </div>
            <p data-entrance="lead" className="typography-lead mt-7 max-w-2xl text-slate-300">
              Партнёрский ID {siteConfig.distributor.fourLifeId} можно приложить к заказу. Актуальные скидку, наличие и цену подтвердите в РЦ 67 до оплаты.
            </p>
            <div data-entrance="buttons" className="mt-8 flex flex-wrap gap-3">
              <Button to="/products" variant="primary" size="lg" icon={<Icons.ArrowRight className="h-4 w-4" />}>
                Открыть каталог
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Контакты центра
              </Button>
            </div>
          </PageEntrance>
        </div>
        <div className="lg:col-span-5">
          <ParallaxImage src={logisticsImage} alt="Нейтральное пространство для сортировки заказов" caption="Перед оплатой подтвердите наличие и условия" ratio="portrait" priority />
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/[0.08] px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-cyan-400">01 — Порядок оформления</span>
        <h2 className="typography-h2 text-white">Чёткий список. Проверенные условия.</h2>
        <p className="typography-body text-slate-400">
          РЦ 67 — контактная точка для оформления и получения заказа по данным сайта. Этот сайт не проверяет остатки, не принимает оплату и не может гарантировать происхождение товара или скидку. Уточните детали у продавца.
        </p>
        <div className="border-l-2 border-cyan-400/40 pl-4 text-sm leading-relaxed text-slate-400">
          Партнёрский ID: <span className="font-mono tabular-nums text-white">{siteConfig.distributor.fourLifeId}</span> · {siteConfig.distributor.name}
        </div>
      </div>
      <div className="divide-y divide-white/[0.08] lg:col-span-7">
        {steps.map((step) => (
          <Link key={step.number} to={step.href} className="group flex flex-col gap-4 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:flex-row md:items-baseline md:gap-8 md:py-10">
            <span className="w-16 shrink-0 font-heading text-2xl font-light tabular-nums text-cyan-400/70 md:text-3xl">{step.number}</span>
            <div className="flex-1">
              <h3 className="typography-h3 text-white">{step.title}</h3>
              <p className="typography-body mt-3 text-slate-400">{step.copy}</p>
            </div>
            <Icons.ArrowRight className="h-5 w-5 shrink-0 text-cyan-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>

    <section className="border-y border-white/[0.08] bg-[#050811] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <span className="typography-label text-cyan-400">02 — Два способа</span>
          <h2 className="typography-h2 mt-4 text-white">Выберите удобный формат</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
          <article className="border border-white/[0.08] bg-[#080d18] p-7 md:p-10 lg:col-span-7">
            <span className="typography-label text-cyan-400">Разовый заказ</span>
            <h3 className="typography-h3 mt-4 text-white">Без регистрации на этом сайте</h3>
            <p className="typography-body mt-4 max-w-2xl text-slate-400">Добавьте продукты в список заказа и отправьте его в РЦ 67. ID {siteConfig.distributor.fourLifeId} будет указан в тексте автоматически; продавец подтвердит итоговую цену и доступность.</p>
            <Button to="/products" variant="secondary" size="md" className="mt-7" icon={<Icons.ArrowRight className="h-4 w-4" />}>
              Собрать список
            </Button>
          </article>
          <article className="border border-white/[0.08] bg-[#080d18] p-7 md:p-10 lg:col-span-5 lg:mt-12">
            <span className="typography-label text-slate-500">Для самостоятельного заказа</span>
            <h3 className="typography-h3 mt-4 text-white">Личный кабинет 4Life</h3>
            <p className="typography-body mt-4 text-slate-400">Официальная регистрация открывает личный кабинет. Баллы лояльности и возможный возврат зависят от правил программы, рынка и квалифицируемых покупок; это не гарантированная экономия.</p>
            <Button href={siteConfig.distributor.signupUrl} isExternal variant="secondary" size="md" className="mt-7" icon={<Icons.ExternalLink className="h-4 w-4" />}>
              Перейти к регистрации
            </Button>
          </article>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <span className="typography-label text-cyan-400">03 — Получение заказа</span>
        <h2 className="typography-h2 mt-4 text-white">РЦ 67 · Москва</h2>
        <address className="typography-body mt-6 not-italic text-slate-300">{siteConfig.office.address}</address>
        <p className="mt-4 text-sm text-slate-400">Телефон: <a className="text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" href={`tel:${siteConfig.office.phoneRaw}`}>{siteConfig.office.phone}</a></p>
      </div>
      <div className="lg:col-span-7">
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          <details className="group py-6">
            <summary className="typography-h3 flex cursor-pointer list-none items-center justify-between gap-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Как узнать итоговую цену?<Icons.Plus className="h-4 w-4 shrink-0 text-cyan-400" /></summary>
            <p className="typography-body mt-4 max-w-2xl text-slate-400">Назовите ID {siteConfig.distributor.fourLifeId} при обращении в центр и запросите актуальную цену до оплаты. Условия сайта не заменяют подтверждение продавца.</p>
          </details>
          <details className="group py-6">
            <summary className="typography-h3 flex cursor-pointer list-none items-center justify-between gap-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Можно ли получить заказ доставкой?<Icons.Plus className="h-4 w-4 shrink-0 text-cyan-400" /></summary>
            <p className="typography-body mt-4 max-w-2xl text-slate-400">Возможность доставки и её стоимость зависят от заказа и текущих условий продавца. Уточните доступные способы у РЦ 67.</p>
          </details>
          <details className="group py-6">
            <summary className="typography-h3 flex cursor-pointer list-none items-center justify-between gap-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Есть ли медицинская консультация?<Icons.Plus className="h-4 w-4 shrink-0 text-cyan-400" /></summary>
            <p className="typography-body mt-4 max-w-2xl text-slate-400">Нет. Информация на сайте не является медицинским советом. Вопросы о приёме добавок, противопоказаниях и взаимодействиях обсудите с врачом и сверяйте с этикеткой продукта.</p>
          </details>
        </div>
      </div>
    </section>

    <section className="border-t border-white/[0.08] px-4 py-12 md:px-8">
      <p className="mx-auto max-w-7xl text-sm leading-relaxed text-slate-500">Упоминание скидки, баллов или доставки не означает, что соответствующее условие доступно каждому заказу. Их подтверждает продавец по актуальным правилам.</p>
    </section>
  </main>
);

export default React.memo(HowToBuyPage);
