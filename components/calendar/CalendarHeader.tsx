'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react'
import { useCalendar } from './CalendarContext'

type ViewMode = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
type FilterType = 'all' | 'Meetings'

interface CalendarHeaderProps {
  onFilterChange?: (filter: FilterType) => void
  onNewMeeting?: () => void
  onAddAvailability?: () => void
  onAddCustomAvailability?: () => void
}

const views: { label: string; value: ViewMode }[] = [
  { label: 'Day',   value: 'timeGridDay' },
  { label: 'Week',  value: 'timeGridWeek' },
  { label: 'Month', value: 'dayGridMonth' },
]

export function CalendarHeader({
  onFilterChange,
  onNewMeeting,
  onAddAvailability,
  onAddCustomAvailability,
}: CalendarHeaderProps) {
  // ✅ Everything comes from context — no duplicate useState for view
  const { activeView, currentTitle, goToday, goPrev, goNext, changeView } = useCalendar()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    onFilterChange?.(filter)
  }

  const viewSegment = (fullWidth?: boolean) => (
    <div className={`inline-flex gap-2 items-center rounded-lg bg-white p-0.5 ${fullWidth ? 'w-full' : ''}`}>
      {views.map((v) => (
        <button
          key={v.value}
          type="button"
          onClick={() => changeView(v.value)}   // ✅ calls context directly
          className={`${fullWidth ? 'flex-1' : ''} rounded-lg text-xs md:border md:border-slate-200  px-3 md:px-4 py-1.5 font-medium font-manrope transition-colors ${
            activeView === v.value
              ? 'bg-brand-blue text-white '
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="font-manrope">
      <div className="mx-auto">
        <div className='p-3'>

          {/* ── Desktop ── */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">
            {/* Left: nav + title from FullCalendar */}
            <div className="flex items-center gap-3 min-w-0 justify-self-start">
              <div className="flex items-center gap-0.5 rounded-lg p-1">
                <button
                  type="button"
                  onClick={goPrev}              // ✅ context
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-yellow border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goToday}             // ✅ context
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 rounded-md bg-brand-yellow border border-slate-200 transition hover:bg-slate-50 whitespace-nowrap"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={goNext}              // ✅ context
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-yellow border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {/* ✅ title comes from FullCalendar itself via context — always in sync */}
              <span className="text-base font-semibold text-slate-900 truncate">
                {currentTitle}
              </span>
            </div>

            {/* Center: view switcher */}
            <div className="justify-self-center">{viewSegment()}</div>

            {/* Right: actions */}
            <div className="md:flex hidden items-center justify-end gap-2 flex-wrap justify-self-end">
              {/* <button
                type="button"
                onClick={onNewMeeting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-50 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>New Meeting</span>
              </button> */}
              <button
                type="button"
                onClick={onAddAvailability}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-medium text-white transition hover:bg-[#2678a5] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add Weekly Availability</span>
              </button>
              <button
                type="button"
                onClick={onAddCustomAvailability}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-blue bg-white px-3 py-2 text-xs font-medium text-brand-blue transition hover:bg-sky-50 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add Flexible Availbility</span>
              </button>
            </div>
          </div>

          {/* ── Tablet ── */}
          <div className="hidden md:flex lg:hidden flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-1 border border-slate-200/80">
                  <button type="button" onClick={goPrev} className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Previous">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={goToday} className="px-3 py-1.5 text-xs font-medium text-slate-800 rounded-md bg-white border border-slate-200 transition hover:bg-slate-50">
                    Today
                  </button>
                  <button type="button" onClick={goNext} className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Next">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-base font-semibold text-slate-900">{currentTitle}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* <button type="button" onClick={onNewMeeting} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-50">
                  <Plus className="w-4 h-4" /> New Meeting
                </button> */}
                <button type="button" onClick={onAddAvailability} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-medium text-white transition hover:bg-[#2678a5]">
                  <Plus className="w-4 h-4" /> Add Weekly Availability
                </button>
                <button type="button" onClick={onAddCustomAvailability} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-blue bg-white px-3 py-2 text-xs font-medium text-brand-blue transition hover:bg-sky-50">
                  <Plus className="w-4 h-4" /> Add Custom Availability
                </button>
              </div>
            </div>
            <div className="flex justify-center">{viewSegment()}</div>
          </div>

          {/* ── Mobile ── */}
          <div className="flex md:hidden flex-col gap-1 md:gap-3">
            <div className="flex items-center md:flex-col flex-row-reverse justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-0.5 rounded-lg bg-transparent md:bg-slate-100 p-1 border border-slate-200/80 min-w-0">
                  <button type="button" onClick={goPrev} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-600" aria-label="Previous">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={goToday} className="flex-1 px-2 py-1.5 text-xs font-medium text-slate-800 rounded-md bg-white border border-slate-200">
                    Today
                  </button>
                  <button type="button" onClick={goNext} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-600" aria-label="Next">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-900 truncate">{currentTitle}</span>
            </div>
            {viewSegment(true)}
            <div className="md:flex hidden flex-col gap-2">
              {/* <button type="button" onClick={onNewMeeting} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-900 bg-white py-2 text-xs font-medium text-slate-900">
                <Plus className="w-4 h-4" /> New Meeting
              </button> */}
              <button type="button" onClick={onAddAvailability} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-blue py-2 text-xs font-medium text-white">
                <Plus className="w-4 h-4" /> Add Weekly Availability
              </button>
              <button type="button" onClick={onAddCustomAvailability} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-blue bg-white py-2 text-xs font-medium text-brand-blue">
                <Plus className="w-4 h-4" /> Add Custom Availability
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap md:py-4 py-0 items-center border-y border-slate-100">
          <div className='px-2 flex gap-2'>
            {(['all', 'Meetings'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-brand-blue text-white'
                    : 'md:bg-brand-yellow bg-white text-slate-700 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {filter === 'all' && (
                  <Filter className={`h-3.5 w-3.5 shrink-0 ${activeFilter === 'all' ? 'text-white' : 'text-brand-blue'}`} aria-hidden />
                )}
                {/* {filter === 'client' && (
                  <span className={`h-2 w-2 shrink-0 rounded-full ${activeFilter === 'client' ? 'bg-white' : 'bg-brand-blue'}`} aria-hidden />
                )} */}
                {filter === 'Meetings' && (
                  <span className={`h-2 w-2 shrink-0 rounded-full ${activeFilter === 'Meetings' ? 'bg-white' : 'bg-orange-500'}`} aria-hidden />
                )}
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}