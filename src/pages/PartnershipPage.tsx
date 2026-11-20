import PartnershipSection from "@/components/sections/PartnershipSection";
import { Button, ParallaxImage } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import workspaceImage from "@/assets/images/backgrounds/editorial-personal-workspace.png";
import React from "react";

const planItems = [
  { number: "01", title: "Объём для активности", detail: "В предоставленных материалах указан ориентир 100 LP за месяц. Требования и порядок расчёта нужно сверять с актуальным планом 4Life для региона." },
  { number: "02", title: "Бонус быстрого старта", detail: "В описании плана фигурирует ставка до 25% с квалифицируемых первых заказов новых клиентов или партнёров. Это ставка плана, а не гарантированный доход." },
  { number: "03", title: "Личный объём", detail: "Материалы также описывают вознаграждение до 20% на часть квалифицируемого личного объёма. Применимость зависит от условий и статуса участника." },
  { number: "04", title: "Объём команды", detail: "В материалах указаны уровни 2%, 12% и 5% для разных поколений. Выплаты зависят от объёма, квалификации, правил рынка и фактических заказов; результат не гарантирован." },
];

const startSteps = [
  { title: "Разобраться в модели", copy: "Получить действующий маркетинг-план и прочитать правила вознаграждений целиком." },
  { title: "Оценить личный бюджет", copy: "Не покупать продукты и не оформлять подписки ради обещания будущего дохода." },
  { title: "Решить без спешки", copy: "Если формат подходит, пройти регистрацию на сайте производителя с ID спонсора {id}." },
];

const PartnershipPage: React.FC = () => (
  <main className="bg-[#03050a] text-[#F0EDE8]">
    <SEO
      title="Партнёрство 4Life: план и условия | Александр Тощев"
      description="Структура партнёрской программы 4Life без обещаний заработка: типы вознаграждений, условия и вопросы для проверки до регистрации."
      path="/partnership"
      type="website"
    />
    <PartnershipSection />

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/[0.08] px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-[#B9974A]">01 — Модель вознаграждений</span>
        <h1 className="typography-h2 text-[#F0EDE8]">LP, условия и расчёт без обещаний</h1>
        <p className="typography-body text-slate-400">
          Ниже — типы начислений, перечисленные в предоставленных материалах партнёрской программы. Это не прогноз и не гарантия выплат. До регистрации запросите действующий план, правила квалификации и таблицу доходов для своей страны.
        </p>
        <ParallaxImage src={workspaceImage} alt="Рабочий стол с заметками о планировании" caption="Иллюстрация рабочего процесса" ratio="landscape" />
      </div>
      <div className="divide-y divide-white/[0.08] lg:col-span-7">
        {planItems.map((item) => (
          <article key={item.number} className="group relative flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-8 md:py-10">
            <span className="w-16 shrink-0 font-heading text-2xl font-light tabular-nums text-[#B9974A]/75 md:text-3xl">{item.number}</span>
            <div className="flex-1">
              <h2 className="typography-h3 text-[#F0EDE8]">{item.title}</h2>
              <p className="typography-body mt-3 text-slate-400">{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="border-y border-white/[0.08] bg-[#050811] px-4 py-20 md:px-8 md:py-28">
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
              <h3 className="typography-h3 text-[#F0EDE8]">Без обязательства закупать товар на склад</h3>
              <p className="typography-body mt-3 text-slate-400">Не вкладывайте средства в запасы ради статуса. Узнайте, какие расходы и требования действуют именно в вашем регионе.</p>
            </article>
            <article className="py-6">
              <h3 className="typography-h3 text-[#F0EDE8]">Нет фиксированного дохода</h3>
              <p className="typography-body mt-3 text-slate-400">Вознаграждение зависит от личных действий, повторных покупок клиентов, командного объёма и квалификации. Проценты из плана не равны сумме на счёте.</p>
            </article>
            <article className="py-6">
              <h3 className="typography-h3 text-[#F0EDE8]">Проверяйте документы</h3>
              <p className="typography-body mt-3 text-slate-400">Читайте договор, действующий план компенсаций, правила возврата и раскрытие типичных доходов до регистрации.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <span className="typography-label block text-[#B9974A]">03 — Старт в команде</span>
        <h2 className="typography-h2 text-[#F0EDE8]">Три шага, прежде чем решить</h2>
        <p className="typography-body text-slate-400">Регистрация открывает договорные отношения с компанией. Сначала ознакомьтесь с условиями, затем решайте, подходит ли вам этот формат.</p>
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

export default React.memo(PartnershipPage);
