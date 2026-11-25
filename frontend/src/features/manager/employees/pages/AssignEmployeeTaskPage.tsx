import { useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, CalendarDays, ClipboardList } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { employeeDirectoryPresentationData } from '../fixtures/employeeDirectoryPresentationData'
import { useTaskAssignments } from '../../../tasks/hooks/useTaskAssignments'
import { localDateToday } from '../../../tasks/utils/taskDates'

type TaskFields = { title: string; description: string; instructions: string; referenceUrl: string; startDate: string; deadline: string }
type TaskField = keyof TaskFields
const requiredFields: TaskField[] = ['title', 'description', 'instructions', 'startDate', 'deadline']

export function AssignEmployeeTaskPage() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const { assignTask } = useTaskAssignments()
  const employee = employeeDirectoryPresentationData.find((item) => item.id === employeeId && item.accountStatus === 'APPROVED')
  const [fields, setFields] = useState<TaskFields>({ title: '', description: '', instructions: '', referenceUrl: '', startDate: localDateToday(), deadline: '' })
  const [errors, setErrors] = useState<Partial<Record<TaskField, string>>>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  if (!employee) return <div className="mx-auto max-w-4xl space-y-5"><Link to="/manager/employees" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark-blue hover:underline"><ArrowLeft aria-hidden="true" size={16} /> Back to All Employees</Link><section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center"><h1 className="text-xl font-semibold text-slate-900">Employee unavailable</h1><p className="mt-2 text-sm text-slate-600">Tasks can only be assigned to a valid approved employee preview.</p></section></div>
  const selectedEmployee = employee

  function changeField(field: TaskField, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current || isSubmitting) return
    const nextErrors: Partial<Record<TaskField, string>> = {}
    for (const field of requiredFields) if (!fields[field].trim()) nextErrors[field] = 'This field is required.'
    if (fields.startDate && fields.deadline && fields.deadline < fields.startDate) nextErrors.deadline = 'Deadline cannot be earlier than the start date.'
    if (fields.referenceUrl.trim()) {
      try {
        const parsed = new URL(fields.referenceUrl)
        if (!['http:', 'https:'].includes(parsed.protocol)) nextErrors.referenceUrl = 'Enter a valid http or https URL.'
      } catch { nextErrors.referenceUrl = 'Enter a valid URL, including https://.' }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    submittingRef.current = true
    setIsSubmitting(true)
    try {
      const task = assignTask(selectedEmployee.id, { ...fields, referenceUrl: fields.referenceUrl || undefined })
      if (!task) { setSubmitError('The assignment could not be added. Confirm the employee and required task details, then try again.'); return }
      navigate(`/manager/employees/${selectedEmployee.id}`, { state: { taskAssigned: true } })
    } catch {
      setSubmitError('The local assignment could not be added. Please try again.')
    } finally { submittingRef.current = false; setIsSubmitting(false) }
  }

  const fieldClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 aria-[invalid=true]:border-rose-500'
  return <div className="mx-auto max-w-4xl space-y-6">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500"><Link to="/manager/employees" className="hover:text-brand-dark-blue hover:underline">All Employees</Link><span aria-hidden="true">/</span><Link to={`/manager/employees/${employee.id}`} className="hover:text-brand-dark-blue hover:underline">{employee.fullName}</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800" aria-current="page">Assign task</span></nav>
    <header><p className="text-sm font-semibold text-brand-primary">Manager workspace · Local task preview</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Assign a task</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Create an assignment for this employee in the current in-memory application session.</p></header>
    <section className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-secondary/40 bg-brand-soft p-4" aria-label="Selected employee"><span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-primary"><ClipboardList aria-hidden="true" size={20} /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-brand-dark-blue">Assigned employee</p><p className="font-semibold text-slate-900">{employee.fullName}</p></div><dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600"><div><dt className="sr-only">Employee ID</dt><dd>{employee.employeeCode || 'ID not provided'}</dd></div><div><dt className="sr-only">Designation</dt><dd>{employee.designation || 'Designation not provided'}</dd></div></dl></section>
    <form noValidate onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <section className="space-y-4" aria-labelledby="task-info-heading"><div><h2 id="task-info-heading" className="text-lg font-semibold text-slate-900">Task Information</h2><p className="mt-1 text-sm text-slate-500">Fields marked required must be completed.</p></div>
        <Field label="Task title" name="title" value={fields.title} onChange={changeField} error={errors.title} required className={fieldClass} />
        <Field label="Task description" name="description" value={fields.description} onChange={changeField} error={errors.description} required className={fieldClass} multiline />
        <Field label="Task pointers / instructions" name="instructions" value={fields.instructions} onChange={changeField} error={errors.instructions} required className={fieldClass} multiline hint="Add the steps, expected outcome, or completion guidance." />
        <Field label="Reference URL (optional)" name="referenceUrl" value={fields.referenceUrl} onChange={changeField} error={errors.referenceUrl} className={fieldClass} placeholder="https://" />
      </section>
      <section className="space-y-4 border-t border-slate-100 pt-5" aria-labelledby="task-schedule-heading"><div><h2 id="task-schedule-heading" className="text-lg font-semibold text-slate-900">Schedule</h2><p className="mt-1 text-sm text-slate-500">Start date defaults to today. Deadline is required and must be on or after the start date.</p></div><div className="grid gap-4 sm:grid-cols-2">
        <DateField label="Start date" name="startDate" value={fields.startDate} onChange={changeField} error={errors.startDate} className={fieldClass} />
        <DateField label="Deadline" name="deadline" value={fields.deadline} min={fields.startDate || localDateToday()} onChange={changeField} error={errors.deadline} className={fieldClass} />
      </div></section>
      <p role="note" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">This assignment is held in shared in-memory frontend state for this tab session. Refreshing the browser may clear it; no backend assignment is created.</p>
      {submitError && <p role="alert" className="text-sm font-medium text-rose-700">{submitError}</p>}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row"><Link to={`/manager/employees/${employee.id}`} className="inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</Link><button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-wait disabled:opacity-60"><CalendarDays aria-hidden="true" size={16} className="mr-2 inline" />{isSubmitting ? 'Assigning…' : 'Assign task'}</button></div>
    </form>
  </div>
}

function Field({ label, name, value, onChange, error, required = false, className, multiline = false, hint, placeholder }: { label: string; name: TaskField; value: string; onChange: (name: TaskField, value: string) => void; error?: string; required?: boolean; className: string; multiline?: boolean; hint?: string; placeholder?: string }) {
  const id = `task-${name}`
  const helpId = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}{required && <span aria-hidden="true" className="ml-1 text-rose-600">*</span>}{multiline ? <textarea id={id} name={name} value={value} required={required} aria-invalid={Boolean(error)} aria-describedby={helpId} onChange={(event) => onChange(name, event.target.value)} rows={name === 'instructions' ? 5 : 3} className={className} /> : <input id={id} name={name} type={name === 'referenceUrl' ? 'url' : 'text'} value={value} required={required} aria-invalid={Boolean(error)} aria-describedby={helpId} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} className={className} />}{error ? <span id={`${id}-error`} className="mt-1 block text-xs font-medium text-rose-700">{error}</span> : hint ? <span id={`${id}-hint`} className="mt-1 block text-xs text-slate-500">{hint}</span> : null}</label>
}

function DateField({ label, name, value, min, onChange, error, className }: { label: string; name: 'startDate' | 'deadline'; value: string; min?: string; onChange: (name: TaskField, value: string) => void; error?: string; className: string }) {
  const id = `task-${name}`
  return <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}<span aria-hidden="true" className="ml-1 text-rose-600">*</span><input id={id} type="date" value={value} min={min} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(name, event.target.value)} className={className} />{error && <span id={`${id}-error`} className="mt-1 block text-xs font-medium text-rose-700">{error}</span>}</label>
}
