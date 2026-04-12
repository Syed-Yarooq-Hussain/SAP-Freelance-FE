// context/CalendarContext.tsx
import { createContext, useContext, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

interface CalendarContextType {
  calendarRef: React.RefObject<FullCalendar>
  activeView: CalendarView
  setActiveView: (view: CalendarView) => void
  currentTitle: string
  setCurrentTitle: (title: string) => void
  goToday: () => void
  goPrev: () => void
  goNext: () => void
  changeView: (view: CalendarView) => void
}

const CalendarContext = createContext<CalendarContextType | null>(null)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const calendarRef = useRef<FullCalendar>({} as FullCalendar)
  const [currentTitle, setCurrentTitle] = useState('')
  const [activeView, setActiveView] = useState<CalendarView>('dayGridMonth')

  const goToday   = () => calendarRef.current?.getApi().today()
  const goPrev    = () => calendarRef.current?.getApi().prev()
  const goNext    = () => calendarRef.current?.getApi().next()
  const changeView = (view: CalendarView) => {
    calendarRef.current?.getApi().changeView(view)
    setActiveView(view)
  }

  return (
    <CalendarContext.Provider value={{
        calendarRef, activeView, setActiveView,
        currentTitle, setCurrentTitle,
        goToday, goPrev, goNext, changeView
    }}>
      {children}
    </CalendarContext.Provider>
  )
}

export const useCalendar = () => {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendar must be used inside CalendarProvider')
  return ctx
}