import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button, ParallaxImage } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import workspaceImage from "@/assets/images/backgrounds/editorial-personal-workspace.png";
import React from "react";

const workingPrinciples = [
  { number: "01", title: "Разобраться в запросе", copy: "Сначала обсуждаем цель, ограничения и то, что уже известно о продукте. Я не ставлю диагнозы, не назначаю лечение и не подменяю консультацию врача." },
  { number: "02", title: "Показать источники и условия", copy: "Сверяем состав и маркировку, объясняем порядок заказа и отдельно отмечаем, что является заявлением производителя, а что — подтверждённым условием покупки." },
  { number: "03", title: "Оставить решение за человеком", copy: "Никаких обещаний результата или дохода. Если продукт или партнёрство не подходит — это нормальный ответ." },
];

const AboutMePage: React.FC = () => (
  <main className="bg-[#03050a] text-white">
    <SEO
      title="Александр Тощев — независимый партнёр 4Life"
      description="О подходе Александра Тощева к разговору о продуктах 4Life, оформлении заказов и партнёрстве."
      path="/about-me"
      type="website"
    />

    <section className="relative overflow-hidden bg-[#F0EDE8] px-4 pb-20 pt-32 text-[#151821] md:px-8 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_10%,rgba(6,182,212,0.11),transparent_44%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <PageEntrance className="flex flex-col items-start lg:col-span-7">
        <span data-entrance="badge" className="typography-label mb-6 text-cyan-800">{siteConfig.distributor.name} · {siteConfig.distributor.rank} 4Life</span>
        <div data-entrance="title">
          <h1 className="typography-display max-w-5xl text-[#151821]">Здоровье — тема для внимательного разговора.</h1>
        </div>
        <p data-entrance="lead" className="typography-lead mt-7 max-w-3xl text-[#53565e]">
          Я помогаю разобраться в информации о продуктах 4Life, источниках и оформлении заказа — спокойно, понятно и без спешки.
        </p>
        <div data-entrance="buttons" className="mt-8 flex flex-wrap gap-3">
          <Button href={siteConfig.contact.whatsapp} isExternal variant="primary" size="lg" icon={<Icons.WhatsApp className="h-4 w-4" />}>
            Написать Александру
          </Button>
          <Button to="/products" variant="secondary" size="lg">Посмотреть каталог</Button>
        </div>
      </PageEntrance>
      <figure className="lg:col-span-5">
        <ParallaxImage
          src={workspaceImage}
          alt="Иллюстрация рабочего стола с открытым блокнотом и книгами"
          caption="Визуальная иллюстрация рабочего процесса"
          ratio="portrait"
          priority
        />
      </figure>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/[0.08] px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <aside className="self-start border border-white/[0.08] bg-[#080d18] p-7 md:p-9 lg:col-span-5" aria-label="Профиль Александра Тощева">
        <p className="typography-label text-cyan-400">Коротко обо мне</p>
        <p className="mt-5 font-heading text-3xl text-white">{siteConfig.distributor.name}</p>
        <dl className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          <div className="flex items-center justify-between gap-4 py-4 text-sm">
            <dt className="text-slate-500">Роль</dt>
            <dd className="text-right text-slate-200">Независимый партнёр 4Life</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4 text-sm">
            <dt className="text-slate-500">Город</dt>
            <dd className="text-right text-slate-200">Москва</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4 text-sm">
            <dt className="text-slate-500">ID 4Life</dt>
            <dd className="font-mono tabular-nums text-slate-200">{siteConfig.distributor.fourLifeId}</dd>
          </div>
        </dl>
      </aside>
      <div className="space-y-7 lg:col-span-7">
        <span className="typography-label text-cyan-400">Личный подход</span>
        <h2 className="typography-h2 text-white">Сначала ясность, потом выбор</h2>
        <div className="space-y-5 text-base leading-relaxed text-slate-300">
          <p>Я предприниматель и партнёр 4Life. Мой интерес к теме здоровья вырос из личного поиска и желания лучше понимать, как устроены продукты, которые люди выбирают для себя.</p>
          <p>Личный опыт остаётся личным: он не доказывает эффективность формулы и не гарантирует такой же результат другому человеку. Поэтому я предпочитаю говорить о составе, официальной маркировке, ограничениях и доступных источниках, а не обещать изменения самочувствия.</p>
          <p>Моя задача — объяснять сложную информацию понятным языком и помогать с заказом. Медицинские вопросы, включая схемы приёма, противопоказания и взаимодействия, должны решаться с врачом.</p>
        </div>
        <div className="border-l-2 border-cyan-400/40 pl-4 text-sm leading-relaxed text-slate-400">Я — независимый дистрибьютор 4Life; медицинские рекомендации остаются в компетенции профильного специалиста.</div>
      </div>
    </section>

    <section className="border-y border-black/[0.08] bg-[#F0EDE8] px-4 py-20 text-[#151821] md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <span className="typography-label text-cyan-800">Привычка, а не обещание</span>
          <h2 className="typography-h2 mt-4 text-[#151821]">Устойчивость строится на повседневных решениях</h2>
        </div>
        <div className="space-y-5 lg:col-span-7">
          <p className="typography-body text-[#30343b]">Забота о себе складывается из сна, питания, движения, медицинской помощи и множества других факторов. Ни одна формула не описывает весь этот опыт.</p>
          <p className="typography-body text-[#53565e]">Состав и маркировка помогают оценить продукт, а вопросы о здоровье и индивидуальных ограничениях лучше обсуждать со специалистом.</p>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-cyan-400">Как мы работаем</span>
        <h2 className="typography-h2 text-white">Три простых принципа</h2>
      </div>
      <div className="divide-y divide-white/[0.08] lg:col-span-7">
        {workingPrinciples.map((item) => (
          <article key={item.number} className="flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-8 md:py-10">
            <span className="w-16 shrink-0 font-heading text-2xl font-light tabular-nums text-cyan-400/70 md:text-3xl">{item.number}</span>
            <div className="flex-1">
              <h3 className="typography-h3 text-white">{item.title}</h3>
              <p className="typography-body mt-3 text-slate-400">{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="border-t border-white/[0.08] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="typography-label text-cyan-400">Прямой диалог</span>
          <h2 className="typography-h3 mt-3 text-white">Вопросы о заказе или партнёрстве?</h2>
        </div>
        <Button to="/contact" variant="secondary" size="lg" icon={<Icons.ArrowRight className="h-4 w-4" />}>
          Все способы связи
        </Button>
      </div>
    </section>
  </main>
);

export default React.memo(AboutMePage);
