import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { employeeDirectoryPresentationData } from '../fixtures/employeeDirectoryPresentationData'
import type { EmployeeDirectoryRecord, EmployeeDirectorySortKey } from '../types/employeeDirectory.types'
import { useManagerAccount } from '../../account/useManagerAccount'

type SortDirection = 'asc' | 'desc'

export function EmployeeDirectoryPage() {
  const { preferences } = useManagerAccount()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [designation, setDesignation] = useState('ALL')
  const [sortKey, setSortKey] = useState<EmployeeDirectorySortKey>('fullName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const designationOptions = useMemo(() => [...new Set(employeeDirectoryPresentationData.map((employee) => employee.designation).filter((value): value is string => Boolean(value)))].sort(), [])

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return employeeDirectoryPresentationData
      .filter((employee) => employee.accountStatus === 'APPROVED')
      .filter((employee) => designation === 'ALL' || employee.designation === designation)
      .filter((employee) => !query || employee.fullName.toLocaleLowerCase().includes(query) || (employee.employeeCode ?? '').toLocaleLowerCase().includes(query))
      .sort((left, right) => {
        const leftValue = sortValue(left, sortKey)
        const rightValue = sortValue(right, sortKey)
        return leftValue.localeCompare(rightValue, undefined, { numeric: true, sensitivity: 'base' }) * (sortDirection === 'asc' ? 1 : -1)
      })
  }, [designation, search, sortDirection, sortKey])

  function sortBy(key: EmployeeDirectorySortKey) {
    if (key === sortKey) setSortDirection((current) => current === 'asc' ? 'desc' : 'asc')
    else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-primary">Manager workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">All Employees</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Browse approved employee profiles and the information currently available for each account.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Users aria-hidden="true" size={19} className="text-brand-primary" /><span className="text-sm font-semibold text-slate-900">{filteredEmployees.length}</span><span className="text-sm text-slate-500">shown</span></div>
      </header>

      <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm leading-6 text-slate-700">Preview directory: entries are fictional examples derived from the existing approval presentation fixture. Only approved entries appear here; pending registrations remain under Approval.</p>

      <section aria-label="Employee directory filters" className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_250px]">
        <label className="relative block">
          <span className="sr-only">Search by employee name or employee ID</span>
          <Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or employee ID" className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
        </label>
        <label className="block">
          <span className="sr-only">Filter by designation</span>
          <select value={designation} onChange={(event) => setDesignation(event.target.value)} disabled={designationOptions.length === 0} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" aria-describedby="designation-filter-note">
            <option value="ALL">All designations</option>
            {designationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <span id="designation-filter-note" className="mt-1 block text-[11px] text-slate-500">{designationOptions.length ? 'Filter by available designation' : 'Designation is not present in the available records'}</span>
        </label>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500" aria-live="polite">
        <p>Showing {filteredEmployees.length} of {employeeDirectoryPresentationData.length} approved preview employees</p>
        <p>Sorted by {sortLabel(sortKey)} ({sortDirection === 'asc' ? 'ascending' : 'descending'})</p>
      </div>

      <EmployeeDirectoryTable employees={filteredEmployees} loading={false} sortKey={sortKey} sortDirection={sortDirection} compact={preferences.tableDensity === 'compact'} onSort={sortBy} onViewProfile={(id) => navigate(`/manager/employees/${id}`)} />
    </div>
  )
}

function EmployeeDirectoryTable({ employees, loading, sortKey, sortDirection, compact, onSort, onViewProfile }: { employees: EmployeeDirectoryRecord[]; loading: boolean; sortKey: EmployeeDirectorySortKey; sortDirection: SortDirection; compact: boolean; onSort: (key: EmployeeDirectorySortKey) => void; onViewProfile: (id: string) => void }) {
  if (loading) {
    return <div role="status" aria-live="polite" className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"><span className="text-sm font-medium text-slate-600">Loading employee directory…</span>{[1, 2, 3].map((item) => <div key={item} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>
  }

  if (employees.length === 0) {
    return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Users aria-hidden="true" size={26} className="mx-auto text-slate-400" /><h2 className="mt-3 font-semibold text-slate-900">No employees match these filters</h2><p className="mt-1 text-sm text-slate-500">Try another name or employee ID.</p></div>
  }

  return (
    <section aria-label="Approved employee records" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>
            <SortableHeading label="Employee Name" sortKey="fullName" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeading label="Designation" sortKey="designation" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeading label="Employee ID" sortKey="employeeCode" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeading label="Joining Date" sortKey="joiningDate" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
            <th scope="col" className="px-5 py-3.5 text-right">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => <tr key={employee.id} onClick={(event) => { if (!(event.target instanceof HTMLElement) || !event.target.closest('a')) onViewProfile(employee.id) }} className="cursor-pointer transition-colors hover:bg-slate-50/80">
              <td className={`${compact ? 'px-4 py-2.5' : 'px-5 py-4'}`}><Link to={`/manager/employees/${employee.id}`} className="font-semibold text-slate-900 hover:text-brand-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-brand-primary">{employee.fullName}</Link><p className="mt-1 text-xs text-slate-500">{employee.email}</p></td>
              <td className={`${compact ? 'px-4 py-2.5' : 'px-5 py-4'} text-sm text-slate-600`}>{employee.designation ?? <MissingValue />}</td>
              <td className={`${compact ? 'px-4 py-2.5' : 'px-5 py-4'} text-sm text-slate-600`}>{employee.employeeCode || <MissingValue />}</td>
              <td className={`${compact ? 'px-4 py-2.5' : 'px-5 py-4'} text-sm text-slate-600`}>{employee.joiningDate ? formatDate(employee.joiningDate) : <MissingValue />}</td>
              <td className={`${compact ? 'px-4 py-2.5' : 'px-5 py-4'} text-right`}><Link to={`/manager/employees/${employee.id}`} className="inline-flex rounded-lg border border-brand-primary px-3 py-2 text-xs font-semibold text-brand-dark-blue hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">View profile</Link></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SortableHeading({ label, sortKey, activeKey, direction, onSort }: { label: string; sortKey: EmployeeDirectorySortKey; activeKey: EmployeeDirectorySortKey; direction: SortDirection; onSort: (key: EmployeeDirectorySortKey) => void }) {
  const active = sortKey === activeKey
  return <th scope="col" aria-sort={active ? direction === 'asc' ? 'ascending' : 'descending' : 'none'} className="px-5 py-3.5"><button type="button" onClick={() => onSort(sortKey)} className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-slate-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-brand-primary">{label}{active ? direction === 'asc' ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" /> : <ArrowUpDown size={13} aria-hidden="true" className="text-slate-400" />}</button></th>
}

function sortValue(employee: EmployeeDirectoryRecord, key: EmployeeDirectorySortKey) {
  if (key === 'fullName') return employee.fullName
  if (key === 'employeeCode') return employee.employeeCode ?? ''
  if (key === 'designation') return employee.designation ?? ''
  return employee.joiningDate ?? ''
}

function sortLabel(key: EmployeeDirectorySortKey) {
  return ({ fullName: 'employee name', employeeCode: 'employee ID', designation: 'designation', joiningDate: 'joining date' })[key]
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function MissingValue() {
  return <span className="italic text-slate-400">Not provided</span>
}
