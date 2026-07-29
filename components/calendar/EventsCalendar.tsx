// 'use client'

// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import { useConsultantCalendar } from '@/actions/consultants/useConsultantCalendar'
// import { useMemo, useState } from 'react'
// import { useCalendar } from './CalendarContext'

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Slot {
//   start_time: string
//   end_time: string
// }

// interface CalendarEvent {
//   id: number
//   title: string
//   type: string
//   start_time: string
//   end_time: string
//   all_day: boolean
//   status: string
// }

// interface Day {
//   date: string
//   availability: {
//     available: boolean
//     slots: Slot[]
//   }
//   events: CalendarEvent[]
// }

// // ─── Transform ───────────────────────────────────────────────────────────────

// function transformApiData(days: Day[]) {
//   const fcEvents: object[] = []

//   days?.forEach((day) => {
//     // 1. Availability → background highlight
//     if (day.availability.available && day.availability.slots.length > 0) {
//       day.availability.slots.forEach((slot) => {
//         fcEvents.push({
//           start:      `${day.date}T${slot.start_time}:00`,
//           end:        `${day.date}T${slot.end_time}:00`,
//           display:    'background',
//           color:      '#22c55e',
//           classNames: ['availability-slot'],
//         })
//       })
//     }

//     // 2. Events → clickable blocks
//     day.events.forEach((event) => {
//       fcEvents.push({
//         id:              String(event.id),
//         title:           event.title,
//         start:           event.all_day ? day.date : `${day.date}T${event.start_time}:00`,
//         eÍnd:             event.all_day ? day.date : `${day.date}T${event.end_time}:00`,
//         allDay:          event.all_day,
//         backgroundColor: event.type === 'INTERVIEW' ? '#6366f1' : '#3b82f6',
//         borderColor:     event.type === 'INTERVIEW' ? '#4f46e5' : '#2563eb',
//         extendedProps: {
//           type:   event.type,
//           status: event.status,
//         },
//       })
//     })
//   })

//   return fcEvents
// }

// // ─── Component ───────────────────────────────────────────────────────────────

// export default function EventsCalendar() {
//   const { calendarRef, setActiveView, setCurrentTitle } = useCalendar()

//   // Track current month/year to re-fetch when user navigates
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
//   const [currentYear,  setCurrentYear]  = useState(new Date().getFullYear())

//   const { data, isLoading } = useConsultantCalendar(currentMonth, currentYear)

//   const events = useMemo(
//     () => transformApiData(data?.days as any ?? []),
//     [data]
//   )
//   console.log(events,'--->')

//   return (
//     <div className="relative">
//       {/* Loading overlay — doesn't unmount the calendar so the ref stays alive */}
//       {isLoading && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-lg">
//           <span className="text-sm text-slate-500">Loading…</span>
//         </div>
//       )}

//       <FullCalendar
//         ref={calendarRef}                 // ✅ context ref — header buttons work
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={false}             // ✅ CalendarHeader replaces this
//         events={events}
//         height="auto"

//         // ✅ Sync title + active view back to context on every navigation
//         datesSet={(arg) => {
//           setActiveView(arg.view.type as any)
//           setCurrentTitle(arg.view.title)

//           // Re-fetch when the user navigates to a different month
//           const start = arg.view.currentStart
//           setCurrentMonth(start.getMonth() + 1)
//           setCurrentYear(start.getFullYear())
//         }}

//         // Custom event pill
//         eventContent={(arg) => {
//           const type = arg.event.extendedProps.type
//           console.log(arg.event.extendedProps, {type},'--->')
//           return (
//             <div style={{ padding: '2px 6px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
//               <span
//                 style={{
//                   background:   type === 'INTERVIEW' ? '#4f46e5' : '#2563eb',
//                   color:        '#fff',
//                   borderRadius: 4,
//                   padding:      '1px 5px',
//                   fontSize:     10,
//                   whiteSpace:   'nowrap',
//                 }}
//               >
//                 {type}
//               </span>
//               <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                 {arg.event.title}
//               </span>
//             </div>
//           )
//         }}

//         eventClick={(info) => {
//           console.log('Clicked:', info.event.id, info.event.extendedProps)
//           // open your modal here
//         }}
//       />
//     </div>
//   )
// }
'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useConsultantCalendar } from '@/actions/consultants/useConsultantCalendar'
import { useMemo, useState } from 'react'
import { useCalendar } from './CalendarContext'

type CalendarFilter = 'all' | 'Meetings'

interface Slot { start_time: string; end_time: string }
interface CalendarEvent {
  id: number; title: string; type: string
  start_time: string; end_time: string; all_day: boolean; status: string
}
interface Day {
  date: string
  availability: { available: boolean; slots: Slot[] }
  events: CalendarEvent[]
}

function transformApiData(days: Day[], filter: CalendarFilter) {
  const fcEvents: object[] = []

  days?.forEach((day) => {

    // 1. Available slot → shows as "09:00 Available" green text event in month view
    //    AND green background band in week/day view
    if (filter === 'all' && day.availability.available && day.availability.slots.length > 0) {
      day.availability.slots.forEach((slot, idx) => {

        // Background band for week/day view
        fcEvents.push({
          start:      `${day.date}T${slot.start_time}:00`,
          end:        `${day.date}T${slot.end_time}:00`,
          display:    'background',
          color:      '#BBF7D0',
          classNames: ['fc-avail-bg'],
        })

        // "09:00 Available" label pill for month view
        fcEvents.push({
          start:      `${day.date}T${slot.start_time}:00`,
          end:        `${day.date}T${slot.end_time}:00`,
          display:    'auto',
          title:      'Available',
          classNames: ['fc-avail-label'],
          extendedProps: {
            isAvailability: true,
            slotStart: slot.start_time,
            slotEnd: slot.end_time,
            date: day.date,
            showTopBar: idx === 0,
          },
        })
      })
    }

    // 2. Events
    day.events.forEach((event) => {
      if (filter === 'Meetings' && event.type !== 'INTERVIEW') return

      const isInterview = event.type === 'INTERVIEW'
      fcEvents.push({
        id:    String(event.id),
        title: event.title,
        start: event.all_day ? day.date : `${day.date}T${event.start_time}:00`,
        end:   event.all_day ? day.date : `${day.date}T${event.end_time}:00`,
        allDay: event.all_day,
        classNames: [isInterview ? 'fc-interview-event' : 'fc-client-event'],
        extendedProps: {
          type:      event.type,
          status:    event.status,
          startTime: event.start_time,
          date: day.date,
          isAvailability: false,
        },
      })
    })
  })

  return fcEvents
}

export default function EventsCalendar({ filter }: { filter: CalendarFilter }) {
  const { calendarRef, setActiveView, setCurrentTitle } = useCalendar()

  const goToDayView = (date: Date, scrollTime?: string) => {
    const api = calendarRef.current?.getApi()
    if (!api) return
    api.changeView('timeGridDay', date)
    setActiveView('timeGridDay')
    if (scrollTime) {
      // Wait for day view render before scrolling to the target slot.
      setTimeout(() => {
        api.scrollToTime(scrollTime)
      }, 0)
    }
  }
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear,  setCurrentYear]  = useState(new Date().getFullYear())
  const { data, isLoading } = useConsultantCalendar(currentMonth- 1, currentYear)
  const events = useMemo(
    () => transformApiData(data?.days as any ?? [], filter),
    [data, filter],
  )
  const hasInterviewEvents = useMemo(
    () =>
      Boolean(
        (data?.days as Day[] | undefined)?.some((day) =>
          day.events?.some((event) => event.type === 'INTERVIEW'),
        ),
      ),
    [data],
  )

  const formatCompactAvailabilityTime = (value?: string) => {
    if (!value) return ''
    if (!value.endsWith(':00')) return value
    const [hour] = value.split(':')
    return String(Number(hour))
  }

  return (
    <div className="relative fc-shell md:h-[80vh] h-auto pr-0 md:pr-0">
      <style>{`

        /* ─── Reset / base ─────────────────────────────────── */
        .fc-shell .fc {
          border-radius: 12px !important;
          overflow: hidden !important;
        }
        .fc-shell .fc-scrollgrid {
          border: 1px solid rgba(241, 245, 249, 0.9) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          background: #fff !important;
        }
        .fc-shell td, .fc-shell th        { border-color: #e2e8f0 !important; }
        .fc-shell .fc-scrollgrid-section > td { border: none !important; }

        /* ─── Column headers (SUN MON …) ───────────────────── */
        .fc-shell .fc-col-header-cell-cushion {
          font-size: 11px !important;
          font-weight: 600 !important;
          color: #000 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
          padding: 10px 0 8px !important;
          text-decoration: none !important;
        }

        .fc-daygrid-day-frame{
            position: relative !important;
            background: #fbfaf8 !important;
        }

        /* ─── Day number ────────────────────────────────────── */
        .fc-shell .fc-daygrid-day-number {
          font-size: 13px !important;
          color: #475569 !important;
          padding: 6px 8px !important;
          text-decoration: none !important;
        }
        .fc-shell .fc-day-today .fc-daygrid-day-number {
          background: #2d8fc0 !important;
          color: #fff !important;
          border-radius: 50% !important;
          width: 26px !important;
          height: 26px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 4px !important;
          padding: 0 !important;
        }
        .fc-shell .fc-day-today { background: transparent !important; }

        /* ─── Week/day time labels ──────────────────────────── */
        .fc-shell .fc-timegrid-slot-label-cushion {
          font-size: 11px !important;
          color: #94a3b8 !important;
        }

        /* ─── Week/day header (Mon 23 etc.) ─────────────────── */
        .fc-shell .fc-timegrid-axis { border: none !important; }
        .fc-shell .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
        //   background: #2d8fc0 !important;
        //   color: #fff !important;
        //   border-radius: 50% !important;
        //   width: 28px !important;
        //   height: 55px !important;
        //   display: flex !important;
        //   align-items: center !important;
        //   justify-content: center !important;
        //   margin: 0 auto !important;
        //   padding: 0 !important;
        }
        tbody { background-color: #F0EDE8 !important; }

        @media (max-width: 767px) {
          .fc-shell tbody,
          .fc-shell .fc-daygrid-body,
          .fc-shell .fc-daygrid-day,
          .fc-shell .fc-daygrid-day-frame,
          .fc-shell .fc-daygrid-day-bg,
          .fc-shell .fc-daygrid-day-top {
            background-color: #fff !important;
          }
        }

        /* ─── "more" link ───────────────────────────────────── */
        .fc-shell .fc-daygrid-more-link {
          font-size: 11px !important;
          color: #2d8fc0 !important;
          font-weight: 600 !important;
          margin-left: 4px !important;
        }

        /* ─── All event base reset ──────────────────────────── */
        .fc-shell .fc-event {
          border: none !important;
          box-shadow: none !important;
          cursor: pointer !important;
        }
        .fc-shell .fc-event:focus { outline: none !important; }
        .fc-shell .fc-event-main  { padding: 0 !important; }

        /* ─── Available label pill (month view) ─────────────── */
        .fc-shell .fc-avail-label {
          background: transparent !important;
          padding: 0 !important;
          margin-bottom: 1px !important;
        }
        .fc-shell .fc-avail-label .fc-event-main { padding: 0 !important; }

        /* ─── Client event (blue) ───────────────────────────── */
        .fc-shell .fc-client-event {
          background-color: #eff6ff !important;
          border-left: 3px solid #3b82f6 !important;
          border-radius: 4px !important;
          margin-bottom: 2px !important;
        }
        .fc-shell .fc-timegrid-event.fc-client-event {
          background-color: #dbeafe !important;
          border-left: 3px solid #3b82f6 !important;
          border-radius: 6px !important;
        }

        /* ─── Interview event (red/orange) ──────────────────── */
        .fc-shell .fc-interview-event {
          background-color: #fff7ed !important;
          border-radius: 4px !important;
          margin-bottom: 2px !important;
        }
        .fc-shell .fc-timegrid-event.fc-interview-event {
          border-left: 3px solid #f97316 !important;
          background-color: #ffedd5 !important;
          border-radius: 6px !important;
        }

        /* ─── Green background band (week/day) ──────────────── */
        .fc-shell .fc-avail-bg {
          background-color: #BBF7D0 !important;
          opacity: 0.6 !important;
        }

        /* ─── Timegrid slot height ───────────────────────────── */
        .fc-shell .fc-timegrid-slot { height: 40px !important; }
      `}</style>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
            Loading…
          </div>
        </div>
      )}

      {filter === 'Meetings' && !isLoading && !hasInterviewEvents ? (
        <div className="mb-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-center text-sm font-medium text-slate-500">
          No Meetings scheduled for this month.
        </div>
      ) : null}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        events={events}
        height="auto"
        dayMaxEvents={3}

        // ─── "+X more" → go to that day view ──────────────────
        moreLinkClick={(arg) => {
          calendarRef.current?.getApi().changeView('timeGridDay', arg.date)
          return 'stop'
        }}

        // ─── Event content ─────────────────────────────────────
        eventContent={(arg) => {
          const { isAvailability, slotStart, slotEnd, type, startTime, showTopBar } = arg.event.extendedProps
          const viewType = arg.view.type
          const isMonth  = viewType === 'dayGridMonth'
          const isTimeGrid = viewType === 'timeGridWeek' || viewType === 'timeGridDay'

          // ── Available label in month view ──────────────────
          if (isAvailability) {
            if (!isMonth) return <></> // hide in week/day (bg band handles it)
            return (
              <div style={{
                display:    'flex',
                alignItems: 'center',
                gap:        4,
                backgroundColor: '#bbf7d0',
                borderRadius: '4px',
                padding:    '1px 6px',
                fontSize:   11,
                minWidth:   0,
                width:      '100%',
                overflow:   'hidden',
              }}>
                {showTopBar ? (
                  <div className='w-full absolute top-[-180%] left-0 h-[2px] rounded-xl bg-green-700'/>
                ) : null}
                <span
                  className="min-w-0 truncate font-medium text-green-700"
                  style={{ fontSize: 11 }}
                >
                  {formatCompactAvailabilityTime(slotStart)} - {formatCompactAvailabilityTime(slotEnd)}
                  <span className="hidden sm:inline"> available</span>
                  <span className="inline sm:hidden"> Avl</span>
                </span>
              </div>
            )
          }

          const isInterview  = type === 'INTERVIEW'
          const accentColor  = isInterview ? '#E8643A' : '#3b82f6'
          const textColor    = isInterview ? '#E8643A' : '#1e40af'

          // ── Month view pill ────────────────────────────────
          if (isMonth) {
            return (
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 4, padding: '1px 6px', overflow: 'hidden',
              }}>
                <div style={{backgroundColor: accentColor}} className={`w-full z-10 rounded-xl absolute top-[-240%] left-0 h-[2px]`}/>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: accentColor, flexShrink: 0,
                }}>
                  {startTime}
                </span>
                <span style={{
                  fontSize: 11, color: textColor, fontWeight: 500,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {arg.event.title}
                </span>
              </div>
            )
          }

          // ── Week / Day view block ──────────────────────────
          if (isTimeGrid) {
            return (
              <div style={{
                padding: '6px 8px', height: '100%',
                display: 'flex', flexDirection: 'column', gap: 2,
              }}>
                {/* <div className={`w-full z-20 absolute top-[-180%] left-0 h-[2px] bg-[${accentColor}]`}/> */}
                {/* Time range */}
                <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>
                  {arg.event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {arg.event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {/* Title */}
                <span style={{ fontSize: 9, fontWeight: 600, color: textColor, lineHeight: 1.3 }}>
                  {arg.event.title}
                </span>
                {/* Type badge */}
                {/* <span style={{
                  display: 'inline-flex', alignSelf: 'flex-start',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: labelBg, color: '#fff',
                  borderRadius: 3, padding: '1px 5px',
                }}>
                  {labelText}
                </span> */}
              </div>
            )
          }

          return null
        }}

        eventClick={(info) => {
          const date = info.event.extendedProps.date
          if (!date) return

          const timeFromProps =
            info.event.extendedProps.startTime || info.event.extendedProps.slotStart
          const timeFromDate =
            info.event.start != null
              ? `${String(info.event.start.getHours()).padStart(2, '0')}:${String(info.event.start.getMinutes()).padStart(2, '0')}:00`
              : undefined

          goToDayView(new Date(date), timeFromProps || timeFromDate)
          // open your modal here
        }}

        datesSet={(arg) => {
          setActiveView(arg.view.type as any)
          setCurrentTitle(arg.view.title)
          const start = arg.view.currentStart
          setCurrentMonth(start.getMonth() + 1)
          setCurrentYear(start.getFullYear())
        }}
      />
    </div>
  )
}
