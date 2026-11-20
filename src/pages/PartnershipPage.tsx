import PartnershipSection from "@/components/sections/PartnershipSection";
import { Button, ParallaxImage } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import workspaceImage from "@/assets/images/backgrounds/editorial-personal-workspace.png";
import { lenis } from "@/lib/lenis";
import React, { useEffect, useState } from "react";

const PARTNERSHIP_NAV = [
  { id: "partner-entry", label: "Введение" },
  { id: "partner-foundation", label: "Основа" },
  { id: "partner-model", label: "Модель" },
  { id: "partner-economics", label: "Расчёты" },
  { id: "partner-invitation", label: "Старт" },
  { id: "partner-plan", label: "Вознаграждения" },
  { id: "partner-operations", label: "Условия" },
  { id: "partner-start", label: "Перед решением" },
] as const;

const planItems = [
  { number: "01", title: "Объём для активности", detail: "В предоставленных материалах указан ориентир 100 LP за месяц. Требования и порядок расчёта нужно сверять с актуальным планом 4Life для региона." },
  { number: "02", title: "Бонус быстрого старта", detail: "В описании плана фигурирует ставка до 25% с квалифицируемых первых заказов новых клиентов или партнёров. Это ставка плана, а не гарантированный доход." },
  { number: "03", title: "Личный объём", detail: "Материалы также описывают вознаграждение до 20% на часть квалифицируемого личного объёма. Применимость зависит от условий и статуса участника." },
  { number: "04", title: "Объём команды", detail: "В материалах указаны уровни 2%, 12% и 5% для разных поколений. Выплаты зависят от объёма, квалификации, правил рынка и фактических заказов; результат не гарантирован." },
];

const startSteps = [
  { title: "Действующий план", copy: "Маркетинг-план и правила вознаграждений описывают условия участия для конкретного региона." },
  { title: "Личные расходы", copy: "Покупки, подписки и другие расходы зависят от выбранного формата участия и региональных правил." },
  { title: "Регистрация", copy: "Участие оформляется на сайте производителя с указанием ID спонсора {id}." },
];

const PartnershipPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("partner-entry");

  useEffect(() => {
    const sections = PARTNERSHIP_NAV.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section instanceof HTMLElement,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
        if (visible && visible.target instanceof HTMLElement) setActiveSection(visible.target.id);
      },
      { rootMargin: "-24% 0px -66% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSectionNavigation = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: -96, duration: 0.85 });
    } else {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }

    window.history.replaceState(null, "", `#${id}`);
  };

  return (
  <main className="bg-[#03050a] text-[#F0EDE8]">
    <SEO
      title="Партнёрство 4Life: план и условия | Александр Тощев"
      description="Структура партнёрской программы 4Life без обещаний заработка: типы вознаграждений, условия и вопросы для проверки до регистрации."
      path="/partnership"
      type="website"
    />
    <div className="sticky top-[76px] z-40 border-y border-white/[0.08] bg-[#03050a]">
      <nav aria-label="Навигация по всей странице партнёрства" className="mx-auto max-w-[1440px] overflow-x-auto px-4 md:px-8 scrollbar-hide">
        <ul className="flex min-w-max items-center gap-6 py-4 md:gap-8">
          {PARTNERSHIP_NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleSectionNavigation(event, item.id)}
                aria-current={activeSection === item.id ? "location" : undefined}
                className={`typography-label whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9974A] ${activeSection === item.id ? "text-[#B9974A]" : "text-[#F0EDE8]/55 hover:text-[#F0EDE8]"}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    <PartnershipSection showNavigation={false} />

    <section id="partner-plan" className="scroll-mt-28 mx-auto grid max-w-7xl grid-cols-1 gap-12 bg-[#F0EDE8] px-4 py-20 text-[#151821] md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-[#8b713d]">01 — Модель вознаграждений</span>
        <h2 className="typography-h2 text-[#151821]">LP, условия и расчёт без обещаний</h2>
        <p className="typography-body text-[#53565e]">
          Ниже — типы начислений, перечисленные в предоставленных материалах партнёрской программы. Это не прогноз и не гарантия выплат; условия и квалификация зависят от действующего плана и региона.
        </p>
          <ParallaxImage src={workspaceImage} alt="Иллюстрация рабочего стола с заметками о планировании" caption="Иллюстрация · не официальный документ 4Life" ratio="landscape" />
      </div>
      <div className="divide-y divide-black/[0.12] border-y border-black/[0.12] lg:col-span-7">
        {planItems.map((item) => (
          <article key={item.number} className="group relative flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-8 md:py-10">
            <span className="w-16 shrink-0 font-heading text-2xl font-light tabular-nums text-[#8b713d] md:text-3xl">{item.number}</span>
            <div className="flex-1">
              <h2 className="typography-h3 text-[#151821]">{item.title}</h2>
              <p className="typography-body mt-3 text-[#53565e]">{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section id="partner-operations" className="scroll-mt-28 border-y border-white/[0.08] bg-[#050811] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <span className="typography-label text-[#B9974A]">02 — Операционная модель</span>
          <h2 className="typography-h2 mt-4 text-[#F0EDE8]">Информационный мост, не склад</h2>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <p className="typography-body text-slate-300">
            Роль партнёра — рассказать о доступном ассортименте, направить к официальной информации и помочь пройти заказ. Производитель и выбранный продавцом канал определяют оплату, наличие и доставку. Условия нужно проверить до оплаты; доход не возникает без реальных заказов и соблюдения правил программы.
          </p>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            <article className="py-6">
              <h3 className="typography-h3 text-[#F0EDE8]">Запасы и расходы</h3>
              <p className="typography-body mt-3 text-slate-400">Предварительные закупки, дополнительные расходы и требования зависят от правил региона и действующего плана.</p>
            </article>
            <article className="py-6">
              <h3 className="typography-h3 text-[#F0EDE8]">Нет фиксированного дохода</h3>
              <p className="typography-body mt-3 text-slate-400">Вознаграждение зависит от личных действий, повторных покупок клиентов, командного объёма и квалификации. Проценты из плана не равны сумме на счёте.</p>
            </article>
            <article className="py-6">
              <h3 className="typography-h3 text-[#F0EDE8]">Документы программы</h3>
              <p className="typography-body mt-3 text-slate-400">Договор, действующий план компенсаций, правила возврата и раскрытие типичных доходов описывают условия участия до регистрации.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="partner-start" className="scroll-mt-28 mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-[#B9974A]">03 — Старт в команде</span>
        <h2 className="typography-h2 text-[#F0EDE8]">Что формирует условия участия</h2>
        <p className="typography-body text-slate-400">Формат зависит от маркетинг-плана, правил региона и личного участия. Потенциальное вознаграждение не является фиксированным доходом.</p>
        <Button href={siteConfig.distributor.signupUrl} isExternal variant="secondary" size="lg" icon={<Icons.ExternalLink className="h-4 w-4" />}>
          Открыть страницу 4Life
        </Button>
      </div>
      <div className="divide-y divide-white/[0.08] lg:col-span-7">
        {startSteps.map((step, index) => (
          <article key={step.title} className="flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-8 md:py-10">
            <span className="w-16 shrink-0 font-heading text-2xl font-light tabular-nums text-[#B9974A]/75 md:text-3xl">{String(index + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <h3 className="typography-h3 text-[#F0EDE8]">{step.title}</h3>
              <p className="typography-body mt-3 text-slate-400">{step.copy.replace("{id}", siteConfig.distributor.fourLifeId)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="border-t border-white/[0.08] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-500">Информация о процентах и квалификации приведена по материалам, переданным партнёром, и не является независимой проверкой актуального плана 4Life. Не принимайте финансовые решения на основе потенциальных или гарантированных обещаний дохода.</p>
        <Button to="/contact" variant="secondary" size="md" icon={<Icons.ArrowRight className="h-4 w-4" />}>
          Обсудить условия
        </Button>
      </div>
    </section>
  </main>
  );
};

export default React.memo(PartnershipPage);
