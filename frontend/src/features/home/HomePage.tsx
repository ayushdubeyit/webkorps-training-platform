import type { ReactNode } from 'react'
import { ArrowRight, BookOpenCheck, UsersRound } from 'lucide-react'

export function HomePage() {
  return (
    <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
      <section>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Learning starts here
        </p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Build skills. Grow together.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
          A shared space for Webkorps teams to learn, practice, and make progress.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-medium text-white">
          Your learning platform is ready <ArrowRight aria-hidden="true" size={17} />
        </div>
      </section>
      <section aria-label="Platform foundation" className="grid gap-4">
        <FoundationCard
          icon={<BookOpenCheck aria-hidden="true" size={20} />}
          title="Training library"
          description="A place for learning resources and development paths."
        />
        <FoundationCard
          icon={<UsersRound aria-hidden="true" size={20} />}
          title="Team learning"
          description="A foundation for shared learning across the organization."
        />
      </section>
    </div>
  )
}

function FoundationCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="mb-5 flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
        {icon}
      </span>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  )
}
