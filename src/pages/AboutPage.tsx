import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button, ParallaxImage } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import transferFactorImage from "@/assets/images/backgrounds/editorial-transfer-factor-lab.png";
import React from "react";

const timeline = [
  { year: "1949", title: "Работы Шервуда Лоуренса", copy: "Иммунолог Шервуд Лоуренс описал явление переноса клеточно-опосредованной иммунной реактивности. Это историческое наблюдение стало частью научного контекста для термина Transfer Factor; оно само по себе не доказывает эффективность конкретной добавки." },
  { year: "1998", title: "Основание 4Life Research", copy: "Компания была основана в штате Юта, США. По материалам производителя, ранняя продуктовая линейка включала формулу Transfer Factor на основе молозива." },
  { year: "2003–04", title: "Исследования и публикации", copy: "В партнёрских материалах цитируются клинические наблюдения и документы в России. Без первичных публикаций, протоколов и оценки качества данных мы не трактуем эти цифры как доказательство клинической пользы или лечения." },
  { year: "2007 →", title: "Развитие формул", copy: "Производитель описывает формулы, сочетающие ингредиенты из разных источников, включая молозиво и яичный желток. Состав, разрешённые заявления и маркировка зависят от продукта и рынка." },
];

const AboutPage: React.FC = () => (
  <main className="bg-[#03050a] text-white">
    <SEO
      title="О компании 4Life Research | Александр Тощев"
      description="Краткая история 4Life Research и объяснение, чем являются продукты Transfer Factor. Информация не заменяет медицинскую консультацию."
      path="/about"
      type="website"
    />

    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_12%,rgba(6,182,212,0.11),transparent_44%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <PageEntrance className="flex flex-col items-start">
            <span data-entrance="badge" className="typography-label mb-6 text-cyan-300">Сэнди, штат Юта · Основана в 1998 году</span>
            <div data-entrance="title">
              <h1 className="typography-display max-w-4xl text-white">4Life Research — <span className="mx-1.5 inline-flex h-10 w-20 items-center justify-center overflow-hidden rounded-full border border-white/15 align-middle shadow-[0_0_30px_rgba(6,182,212,0.15)] md:h-14 md:w-32"><img src={transferFactorImage} alt="" className="h-full w-full scale-110 object-cover" loading="lazy" decoding="async" /></span> история формул</h1>
            </div>
            <p data-entrance="lead" className="typography-lead mt-7 max-w-2xl text-slate-300">Что означает термин Transfer Factor, как компания описывает свои продукты и где заканчиваются маркетинговые заявления.</p>
            <div data-entrance="buttons" className="mt-8">
              <Button to="/products" variant="primary" size="lg" icon={<Icons.ArrowRight className="h-4 w-4" />}>
                Перейти к каталогу
              </Button>
            </div>
          </PageEntrance>
        </div>
        <div className="lg:col-span-5">
          <ParallaxImage src={transferFactorImage} alt="Абстрактное молекулярное изображение на тёмном фоне" caption="Научный контекст · не медицинское обещание" ratio="portrait" priority />
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/[0.08] px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-cyan-400">01 — Термины без упрощений</span>
        <h2 className="typography-h2 text-white">Не витамин и не лекарство</h2>
        <p className="typography-body text-slate-400">«Transfer Factor» — термин, который компания использует для описания компонентов своих формул. Это не название самостоятельной лечебной технологии.</p>
        <ParallaxImage src={transferFactorImage} alt="Абстрактная структура молекул" caption="Иллюстрация, не лабораторная микрофотография" ratio="landscape" />
      </div>
      <div className="space-y-8 lg:col-span-7">
        <p className="typography-lead text-slate-300">Удобная метафора не равна установленному механизму действия.</p>
        <div className="space-y-5 text-base leading-relaxed text-slate-400">
          <p>Витамины и минералы участвуют в обменных процессах. «Иммунная память» — более сложная биология, связанная с клетками и конкретными антигенами. Сравнение формулы с «инструкцией» или «памятью» может помочь объяснить маркетинговый термин, но не должно восприниматься буквально.</p>
          <p>Состав Transfer Factor продуктов, предполагаемые свойства и разрешённые формулировки следует читать по этикетке конкретного продукта. Данные о лабораторном или механистическом эффекте не доказывают, что добавка предотвращает заболевание, усиливает иммунитет у каждого человека или заменяет лечение.</p>
          <p>Добавки не диагностируют, не лечат и не предотвращают заболевания. При хроническом состоянии, беременности, приёме лекарств или сомнениях обсудите состав и возможные взаимодействия с врачом.</p>
        </div>
        <div className="border-l-2 border-cyan-400/40 pl-4 text-sm leading-relaxed text-slate-500">В частности, мы не используем рекламные проценты изменения активности NK-клеток как доказательство эффективности продукта без доступной первичной публикации и независимой оценки.</div>
      </div>
    </section>

    <section className="border-y border-white/[0.08] bg-[#050811] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:sticky lg:top-32 lg:col-span-5">
          <span className="typography-label text-cyan-400">02 — Хронология · 1949–2026</span>
          <h2 className="typography-h2 mt-4 text-white">История идеи и компании</h2>
          <p className="typography-body mt-5 text-slate-400">Таймлайн разделяет научный термин, историю производителя и маркетинговые заявления — это разные типы информации.</p>
        </div>
        <div className="divide-y divide-white/[0.08] lg:col-span-7">
          {timeline.map((item, index) => (
            <article key={item.year} className={`grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10 ${index % 2 === 1 ? "md:pl-8" : ""}`}>
              <span className="typography-label tabular-nums text-cyan-400 md:col-span-2">{item.year}</span>
              <div className="md:col-span-10">
                <h3 className="typography-h3 text-white">{item.title}</h3>
                <p className="typography-body mt-3 text-slate-400">{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:items-end lg:gap-16">
      <div className="lg:col-span-7">
        <span className="typography-label text-cyan-400">03 — Прозрачный выбор</span>
        <h2 className="typography-h2 mt-4 max-w-3xl text-white">Читайте состав. Сверяйте источник. Решайте сами.</h2>
      </div>
      <div className="lg:col-span-5 lg:justify-self-end">
        <Button to="/products" variant="secondary" size="lg" icon={<Icons.ArrowRight className="h-4 w-4" />}>
          Посмотреть продукты
        </Button>
      </div>
    </section>

    <section className="border-t border-white/[0.08] px-4 py-10 md:px-8">
      <p className="mx-auto max-w-7xl text-sm leading-relaxed text-slate-500">Страница независимого дистрибьютора, не официальный сайт производителя. Сведения о компании и составе продуктов требуют сверки с актуальной маркировкой и официальными материалами 4Life.</p>
    </section>
  </main>
);

export default React.memo(AboutPage);
