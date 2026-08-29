'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../Sidebar'
import { CalendarHeader } from './CalendarHeader'
import CalendarEvents from './CalendarEvents'
import { UpcomingEvents } from './UpcomingEvents'
import EventsCalendar from './EventsCalendar'
import AvailabilityCalendar from './AvailabilityCalendar'
import { useConsultantMe } from '@/actions/consultants/useConsultantProfile'
import { useSaveConsultantSchedule } from '@/actions/consultants/useSaveConsultantSchedule'
import { PageOnboardingTour } from '@/components/onboarding/PageOnboardingTour'
import { calendarTourSteps } from '@/components/onboarding/tour-steps'
import { useOnboarding } from '@/providers/OnboardingProvider'
import { DAY_MAP, WEEKLY_ROWS_INIT } from '@/constants/calendar'
import { useToast } from '@/providers/ToastProvider'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type WeeklySlot = { start: string; end: string }
type WeeklySchedule = { day: string; slot?: WeeklySlot[]; active: boolean }
type WeeklyRow = {
  dow: number
  label: string
  enabled: boolean
  startTime: string
  endTime: string
}

type CalendarFilter = 'all' | 'Meetings'

const WEEK_DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const Index = () => {
  const router = useRouter()
  const {toast} = useToast();
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all')
  const [showCustomAvailability, setShowCustomAvailability] = useState(false)
  const [availOpen, setAvailOpen] = useState(false)
  const [weeklyRows, setWeeklyRows] = useState<WeeklyRow[]>(WEEKLY_ROWS_INIT)
  const [applyToAllChecked, setApplyToAllChecked] = useState(false)
  const weeklyAvailabilityStartDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return formatDisplayDate(date)
  }, [])

  const { data: meData, isLoading: isMeLoading } = useConsultantMe()
  const { currentStep, status, fetchError } = useOnboarding()
  const [targetsReady, setTargetsReady] = useState(false)
  const { mutateAsync: saveSchedule, isPending } = useSaveConsultantSchedule()
  const weeklyFromMe: WeeklySchedule[] =
    (meData?.data?.working_schedule?.weekly as WeeklySchedule[]) ?? []

  const mapWeeklyFromMe = (meWeekly: WeeklySchedule[]): WeeklyRow[] => {
    const byDow = new Map<number, WeeklyRow>()
    meWeekly.forEach((d) => {
      const dow = DAY_MAP.findIndex(
        (day) => day.toLowerCase() === String(d.day || '').toLowerCase(),
      )
      const row: WeeklyRow = {
        dow,
        label: (d.day || '').slice(0, 3).toUpperCase(),
        enabled: Boolean(d.active),
        startTime: d.slot?.[0]?.start ?? '',
        endTime: d.slot?.[0]?.end ?? '',
      }
      if (row.dow >= 0) byDow.set(row.dow, row)
    })

    return (WEEKLY_ROWS_INIT as WeeklyRow[]).map((fallback) => {
      const hit = byDow.get(fallback.dow)
      if (!hit) return { ...fallback }
      return {
        ...fallback,
        enabled: hit.enabled,
        startTime: hit.startTime,
        endTime: hit.endTime,
      }
    })
  }

  const updateWeeklyRow = (idx: number, patch: Partial<WeeklyRow>) => {
    setApplyToAllChecked(false)
    setWeeklyRows((rows) => {
      const copy = rows.slice()
      copy[idx] = { ...copy[idx], ...patch }
      return copy
    })
  }

  const sourceTimeRow = useMemo(
    () =>
      weeklyRows.find(
        (r) => r.enabled && r.startTime.trim() && r.endTime.trim() && r.startTime < r.endTime,
      ),
    [weeklyRows],
  )

  const canApplyToAll = Boolean(sourceTimeRow)

  const getSavedWeeklyRows = () => {
    if (weeklyFromMe.length > 0) {
      return mapWeeklyFromMe(weeklyFromMe)
    }

    return (WEEKLY_ROWS_INIT as WeeklyRow[]).map((r) => ({ ...r }))
  }

  const handleApplyToAll = (checked: boolean) => {
    setApplyToAllChecked(checked)
    if (!checked || !sourceTimeRow) return

    setWeeklyRows((rows) =>
      rows.map((row) =>
        row.enabled
          ? {
              ...row,
              startTime: sourceTimeRow.startTime,
              endTime: sourceTimeRow.endTime,
            }
          : row,
      ),
    )
  }

  const weeklyValid = useMemo(
    () =>
      weeklyRows.some(
        (r) => r.enabled && r.startTime.trim() && r.endTime.trim() && r.startTime < r.endTime,
      ),
    [weeklyRows],
  )

  const openWeeklyModal = () => {
    setWeeklyRows(getSavedWeeklyRows())
    setApplyToAllChecked(false)
    setAvailOpen(true)
  }

  const closeWeeklyModal = () => {
    setWeeklyRows(getSavedWeeklyRows())
    setApplyToAllChecked(false)
    setAvailOpen(false)
  }

  const handleAvailSubmit = async () => {
    if (!weeklyValid) return

    const payloadWeekly = weeklyRows.map((row) => ({
      day: DAY_MAP[row.dow],
      active: row.enabled,
      slot: row.enabled ? [{ start: row.startTime, end: row.endTime }] : [],
    }))

    try {
      await saveSchedule({
        weekly: payloadWeekly,
      })
      toast("Weekly availability saved successfully", 'success')
      setAvailOpen(false)
    } catch (error) {
      console.error('Failed to update weekly availability', error)
      toast("Failed to update weekly availability", 'error')
    }
  }

  const handleSaveCustomAvailability = async (payload: any) => {

    const payloadCustom = {
      custom: payload
    }

    try {
      await saveSchedule(payloadCustom)
      toast("Flexible availability saved successfully", 'success')
      setShowCustomAvailability(false)
    } catch (error) {
      console.error('Failed to update weekly availability', error)
      toast("Failed to update flexible availability", 'error')
    }
  }

  const dailyHasInvalidRange = weeklyRows.some(
    (r) => r.enabled && r.startTime && r.endTime && r.startTime >= r.endTime,
  )

  const shouldRunTour = useMemo(() => {
    if (fetchError || status === 'completed') return false
    return currentStep === 'calendar'
  }, [currentStep, fetchError, status])

  useEffect(() => {
    if (!shouldRunTour || showCustomAvailability) {
      setTargetsReady(false)
      return
    }

    if (isMeLoading || !meData) {
      setTargetsReady(false)
      return
    }

    setTargetsReady(true)
  }, [shouldRunTour, isMeLoading, meData, showCustomAvailability])

  return (
    <Sidebar>
      {showCustomAvailability ? (
        <div className="bg-white -mt-4">
          <div className="p-3 border-b border-slate-200 flex justify-start">
            <button
              type="button"
              onClick={() => setShowCustomAvailability(false)}
              className="rounded-lg border flex items-center gap-2 border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back To Calendar
            </button>
          </div>
          <AvailabilityCalendar
            onSave={(payload) => {
              handleSaveCustomAvailability(payload)
            }}
          />
        </div>
      ) : (
        <>
          <div className="bg-brand-yellow md:bg-white relative -mt-4 pb-8">
            <div className="md:hidden flex items-center justify-between gap-2 px-3 py-3 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <h1 className="text-sm font-medium text-slate-900">My Calendar</h1>
              </div>
              <div className=" flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomAvailability(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-1 py-1 text-xxs font-semibold text-slate-900"
                >
                  + Flexible Availability
                </button>
                <button
                  type="button"
                  onClick={openWeeklyModal}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-blue px-1 py-1 text-xxs font-semibold text-white"
                >
                  + Weekly Availability
                </button>
              </div>
            </div>
            <div>
              <div data-tour="calendar-availability">
                <CalendarHeader
                  onFilterChange={setActiveFilter}
                  onAddAvailability={openWeeklyModal}
                  onAddCustomAvailability={() => setShowCustomAvailability(true)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:px-2 pt-2 px-3">
              <div
                className="col-span-1 md:block hidden md:col-span-2 pt-2 pl-0 md:pl-2"
                data-tour="calendar-events"
              >
                <CalendarEvents filter={activeFilter} />
                <div className="mt-2">
                  <UpcomingEvents />
                </div>
              </div>
              <div
                className="col-span-1 md:col-span-5 md:mt-0 mt-4 min-h-[50vh]"
                data-tour="calendar-events-mobile"
              >
                <EventsCalendar filter={activeFilter} />
              </div>
            </div>

            {availOpen ? (
              <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Set Weekly Availability
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Updates will apply for the next 3 months, starting from {weeklyAvailabilityStartDate}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeWeeklyModal}
                      className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs leading-5 text-slate-700">
                      Your marked weekly availability will reset and update your calendar slots for the next 3 months from tomorrow onward.
                    </div>

                    <label className="flex items-center gap-2 px-1">
                      <input
                        type="checkbox"
                        checked={applyToAllChecked}
                        disabled={!canApplyToAll}
                        onChange={(e) => handleApplyToAll(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span
                        className={`text-xs font-medium ${canApplyToAll ? 'text-slate-700' : 'text-slate-400'}`}
                      >
                        Apply to all checked days
                      </span>
                    </label>

                    <div className="grid grid-cols-[1fr_1.3fr_1.3fr] gap-3 px-1">
                      <p className="text-sm font-semibold text-slate-800">Days</p>
                      <p className="text-sm font-semibold text-slate-800">Start time</p>
                      <p className="text-sm font-semibold text-slate-800">End time</p>
                    </div>

                    <div className="space-y-2">
                      {weeklyRows.map((row, idx) => (
                        <div
                          key={`${row.label}-${row.dow}`}
                          className="grid grid-cols-[1fr_1.3fr_1.3fr] gap-3 items-center"
                        >
                          <label className="flex items-center gap-2 pl-1">
                            <input
                              type="checkbox"
                              checked={row.enabled}
                              onChange={(e) =>
                                updateWeeklyRow(idx, { enabled: e.target.checked })
                              }
                              className="h-4 w-4 rounded border-slate-300 accent-brand-blue"
                            />
                            <span className="text-base font-semibold text-slate-900">
                              {row.label}
                            </span>
                          </label>

                          <input
                            type="time"
                            step={60}
                            value={row.startTime}
                            disabled={!row.enabled}
                            onChange={(e) =>
                              updateWeeklyRow(idx, { startTime: e.target.value })
                            }
                            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          />
                          <input
                            type="time"
                            step={60}
                            value={row.endTime}
                            disabled={!row.enabled}
                            onChange={(e) =>
                              updateWeeklyRow(idx, { endTime: e.target.value })
                            }
                            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>
                      ))}
                    </div>
                    {dailyHasInvalidRange ? (
                      <p className="text-xs text-red-500">
                        End time must be greater than start time for enabled days.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={closeWeeklyModal}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAvailSubmit}
                      disabled={!weeklyValid || dailyHasInvalidRange || isPending}
                      className="rounded-lg bg-brand-blue px-4 py-2 text-xs font-medium text-white hover:bg-[#2678a5] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isPending ? 'Saving...' : 'Save Weekly Availability'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
      {!fetchError && (
        <PageOnboardingTour
          pageStep="calendar"
          steps={calendarTourSteps}
          run={shouldRunTour && targetsReady}
        />
      )}
    </Sidebar>
  )
}

export default Index
