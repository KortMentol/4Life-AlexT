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

    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_10%,rgba(6,182,212,0.11),transparent_44%)]" aria-hidden="true" />
      <PageEntrance className="relative mx-auto flex max-w-7xl flex-col items-start">
        <span data-entrance="badge" className="typography-label mb-6 text-cyan-300">{siteConfig.distributor.name} · {siteConfig.distributor.rank} 4Life</span>
        <div data-entrance="title">
          <h1 className="typography-display max-w-5xl text-white">Здоровье — тема для <span className="mx-1.5 inline-flex h-10 w-20 items-center justify-center overflow-hidden rounded-full border border-white/15 align-middle shadow-[0_0_30px_rgba(6,182,212,0.15)] md:h-14 md:w-32"><img src={workspaceImage} alt="" className="h-full w-full scale-110 object-cover" loading="lazy" decoding="async" /></span> внимательного разговора</h1>
        </div>
        <p data-entrance="lead" className="typography-lead mt-7 max-w-3xl text-slate-300">
          Я помогаю разобраться в информации о продуктах 4Life и в порядке оформления заказа. Без медицинских назначений, обещаний результата и давления.
        </p>
        <div data-entrance="buttons" className="mt-8 flex flex-wrap gap-3">
          <Button href={siteConfig.contact.whatsapp} isExternal variant="primary" size="lg" icon={<Icons.WhatsApp className="h-4 w-4" />}>
            Написать Александру
          </Button>
          <Button to="/products" variant="secondary" size="lg">Посмотреть каталог</Button>
        </div>
      </PageEntrance>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/[0.08] px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <ParallaxImage src={workspaceImage} alt="Рабочий стол с заметками и книгой, без портретного изображения" caption={`${siteConfig.distributor.name} · Москва · ID ${siteConfig.distributor.fourLifeId}`} ratio="portrait" priority />
      </div>
      <div className="space-y-7 lg:col-span-7">
        <span className="typography-label text-cyan-400">Личный подход</span>
        <h2 className="typography-h2 text-white">Сначала ясность, потом выбор</h2>
        <div className="space-y-5 text-base leading-relaxed text-slate-300">
          <p>Я предприниматель и партнёр 4Life. Мой интерес к теме здоровья вырос из личного поиска и желания лучше понимать, как устроены продукты, которые люди выбирают для себя.</p>
          <p>Личный опыт остаётся личным: он не доказывает эффективность формулы и не гарантирует такой же результат другому человеку. Поэтому я предпочитаю говорить о составе, официальной маркировке, ограничениях и доступных источниках, а не обещать изменения самочувствия.</p>
          <p>Моя задача — объяснять сложную информацию понятным языком и помогать с заказом. Медицинские вопросы, включая схемы приёма, противопоказания и взаимодействия, должны решаться с врачом.</p>
        </div>
        <div className="border-l-2 border-cyan-400/40 pl-4 text-sm leading-relaxed text-slate-400">Я независимый дистрибьютор, не врач и не представитель производителя.</div>
      </div>
    </section>

    <section className="border-y border-white/[0.08] bg-[#050811] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <span className="typography-label text-cyan-400">Привычка, а не обещание</span>
          <h2 className="typography-h2 mt-4 text-white">Устойчивость строится на повседневных решениях</h2>
        </div>
        <div className="space-y-5 lg:col-span-7">
          <p className="typography-body text-slate-300">Забота о себе — это не один продукт и не «очищение» организма по рекламному обещанию. На самочувствие влияют сон, питание, движение, медицинская помощь и множество других факторов.</p>
          <p className="typography-body text-slate-400">Добавки не заменяют сбалансированный рацион, лечение или рекомендации специалиста. При выборе важно учитывать этикетку, возможные противопоказания и собственную ситуацию.</p>
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
