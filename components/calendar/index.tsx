'use client'

import React, { useMemo, useState } from 'react'
import Sidebar from '../Sidebar'
import { CalendarHeader } from './CalendarHeader'
import CalendarEvents from './CalendarEvents'
import { UpcomingEvents } from './UpcomingEvents'
import EventsCalendar from './EventsCalendar'
import { CalendarProvider } from './CalendarContext'
import AvailabilityCalendar from './AvailabilityCalendar'
import { useConsultantMe } from '@/actions/consultants/useConsultantProfile'
import { useSaveConsultantSchedule } from '@/actions/consultants/useSaveConsultantSchedule'
import { DAY_MAP, WEEKLY_ROWS_INIT } from '@/constants/calendar'
import { useToast } from '@/providers/ToastProvider'

type WeeklySlot = { start: string; end: string }
type WeeklySchedule = { day: string; slot?: WeeklySlot[]; active: boolean }
type WeeklyRow = {
  dow: number
  label: string
  enabled: boolean
  startTime: string
  endTime: string
}

const WEEK_DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const

const Index = () => {
  const {toast} = useToast()
  const [showCustomAvailability, setShowCustomAvailability] = useState(false)
  const [availOpen, setAvailOpen] = useState(false)
  const [weeklyRows, setWeeklyRows] = useState<WeeklyRow[]>(WEEKLY_ROWS_INIT)

  const { data: meData } = useConsultantMe()
  const { mutateAsync: saveSchedule, isPending } = useSaveConsultantSchedule()
  const weeklyFromMe: WeeklySchedule[] =
    (meData?.data?.working_schedule?.weekly as WeeklySchedule[]) ?? []

  const weeklyByDay = useMemo(() => {
    const map = new Map<string, WeeklySchedule>()
    weeklyFromMe.forEach((entry) => {
      if (entry?.day) map.set(entry.day.toLowerCase(), entry)
    })
    return map
  }, [weeklyFromMe])

  const mapWeeklyFromMe = (meWeekly: WeeklySchedule[]): WeeklyRow[] => {
    const byDow = new Map<number, WeeklyRow>()
    meWeekly.forEach((d) => {
      const row: WeeklyRow = {
        dow: DAY_MAP.indexOf(d.day),
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
    setWeeklyRows((rows) => {
      const copy = rows.slice()
      copy[idx] = { ...copy[idx], ...patch }
      return copy
    })
  }

  const weeklyValid = useMemo(
    () =>
      weeklyRows.some(
        (r) => r.enabled && r.startTime.trim() && r.endTime.trim() && r.startTime < r.endTime,
      ),
    [weeklyRows],
  )

  const openWeeklyModal = () => {
    if (weeklyFromMe.length > 0) {
      setWeeklyRows(mapWeeklyFromMe(weeklyFromMe))
    } else {
      setWeeklyRows((WEEKLY_ROWS_INIT as WeeklyRow[]).map((r) => ({ ...r })))
    }
    setAvailOpen(true)
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
      toast("Custom availability saved successfully", 'success')
      setShowCustomAvailability(false)
    } catch (error) {
      console.error('Failed to update weekly availability', error)
      toast("Failed to update custom availability", 'error')
    }
  }

  const dailyHasInvalidRange = weeklyRows.some(
    (r) => r.enabled && r.startTime && r.endTime && r.startTime >= r.endTime,
  )

  return (
    <Sidebar>
      {showCustomAvailability ? (
        <div className="bg-white -mt-4">
          <div className="p-3 border-b border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => setShowCustomAvailability(false)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
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
        <CalendarProvider>
          <div className="bg-white relative -mt-4 pb-8">
            <CalendarHeader
              onAddAvailability={openWeeklyModal}
              onAddCustomAvailability={() => setShowCustomAvailability(true)}
            />
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="col-span-1 md:col-span-2 pt-2 pl-2">
                <CalendarEvents />
                <div className="mt-2">
                  <UpcomingEvents />
                </div>
              </div>
              <div className="col-span-1 md:col-span-5 min-h-[50vh]">
                <EventsCalendar />
              </div>
            </div>

            {availOpen ? (
              <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Set Weekly Availability
                    </h3>
                    <button
                      type="button"
                      onClick={() => setAvailOpen(false)}
                      className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
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
                      onClick={() => setAvailOpen(false)}
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
        </CalendarProvider>
      )}
    </Sidebar>
  )
}

export default Index