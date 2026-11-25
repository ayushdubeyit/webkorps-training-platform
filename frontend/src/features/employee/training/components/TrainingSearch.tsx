import { Search } from 'lucide-react'

interface TrainingSearchProps {
  value: string
  onChange: (value: string) => void
}

export function TrainingSearch({ value, onChange }: TrainingSearchProps) {
  return (
    <label className="relative block w-full max-w-lg">
      <span className="sr-only">Search training modules</span>
      <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search technology modules"
        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
      />
    </label>
  )
}
