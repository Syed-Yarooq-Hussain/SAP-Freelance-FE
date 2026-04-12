'use client'
import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import { CalendarHeader } from './CalendarHeader'
import CalendarEvents from './CalendarEvents'
import { UpcomingEvents } from './UpcomingEvents'
import EventsCalendar from './EventsCalendar'
import { CalendarProvider } from './CalendarContext'
import AvailabilityCalendar from './AvailabilityCalendar'

const Index = () => {
  const [addAvailability, setAddAvailability] = useState(false)

  return (
    <Sidebar>
      {addAvailability ? (
        <AvailabilityCalendar
          onSave={(payload) => {
            console.log(payload);
          }}
        />
      ) : (
        <CalendarProvider>
        <div className=' bg-white'>
            <CalendarHeader  onAddAvailability={() => setAddAvailability(true)}/>
            <div className='grid grid-cols-1 md:grid-cols-7 gap-4'>
              <div className='col-span-1 md:col-span-2 pt-2 pl-2'>
                <CalendarEvents />
                <div className='mt-2'>
                  <UpcomingEvents />
                </div>
              </div>
              <div className='col-span-1 md:col-span-5'>
                <EventsCalendar />
              </div>
            </div>
        </div>
      </CalendarProvider>
    )}
    </Sidebar>
  )
}

export default Index