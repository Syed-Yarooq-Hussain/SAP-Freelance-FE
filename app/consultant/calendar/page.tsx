'use client'
import React from 'react'
import Calendar from '../../../components/calendar'
import { CalendarProvider } from '@/components/calendar/CalendarContext'

const page = () => {
  return (
    <CalendarProvider>
      <Calendar />
    </CalendarProvider>
  )
}

export default page