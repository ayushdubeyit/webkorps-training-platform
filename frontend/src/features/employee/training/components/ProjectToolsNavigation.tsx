import { useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TrainingSubcategory, TrainingTool } from '../types/training.types'

export function ProjectToolsNavigation({ subcategories, tools }: { subcategories: TrainingSubcategory[]; tools: TrainingTool[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-7">
      <Link to="/employee/training" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={16} /> All training domains</Link>
      <header><p className="text-sm font-semibold text-brand-primary">Employee workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Project Tools</h1><p className="mt-2 text-sm text-slate-600">Expand a subcategory to browse its tools and learning resources.</p></header>
      <div role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">Project Tools preview. Resource records are presentation data; uploaded files are local to this browser session.</div>
      {subcategories.length ? (
        <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {subcategories.map((subcategory) => (
            <section key={subcategory.id} className="px-4 sm:px-5">
              {(() => {
                const isExpanded = expandedId === subcategory.id
                const panelId = `project-tools-panel-${subcategory.id}`
                return <>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setExpandedId(isExpanded ? null : subcategory.id)}
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-950 group-hover:text-brand-primary">{subcategory.name}</span>
                      <span className="mt-1 block text-sm text-slate-600">{subcategory.description}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
                      {tools.filter((tool) => tool.subcategoryId === subcategory.id).length} tools
                      <ArrowDown aria-hidden="true" size={18} className={`text-brand-primary transition-transform duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-label={`${subcategory.name} tools`}
                    aria-hidden={!isExpanded}
                    inert={!isExpanded}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid gap-3 border-t border-slate-100 py-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tools.filter((tool) => tool.subcategoryId === subcategory.id).map((tool) => (
                          <Link key={tool.id} to={`/employee/training/project-tools/${subcategory.id}/${tool.id}`} className="group flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-brand-secondary hover:bg-brand-soft/40 focus-visible:outline-2 focus-visible:outline-brand-primary">
                            <Wrench aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-brand-primary" />
                            <span className="min-w-0">
                              <span className="block font-medium text-slate-900 group-hover:text-brand-primary">{tool.name}</span>
                              <span className="mt-1 block text-sm leading-5 text-slate-600">{tool.description}</span>
                              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-primary">Open tool <ArrowRight aria-hidden="true" size={13} /></span>
                            </span>
                          </Link>
                        ))}
                        {!tools.some((tool) => tool.subcategoryId === subcategory.id) && <p className="text-sm text-slate-500">No tools are available in this subcategory yet.</p>}
                      </div>
                    </div>
                  </div>
                </>
              })()}
            </section>
          ))}
        </div>
      ) : <EmptyFolder message="No Project Tools subcategories are available yet." />}
    </div>
  )
}

function EmptyFolder({ message }: { message: string }) {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">{message}</p>
}
