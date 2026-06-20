'use client'

import { useState } from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'

interface UpcomingEvent {
  id: string
  date: Date
  title: string
  time: string
  endTime: string
  type: 'client' | 'deadline' | 'meeting' | 'other'
  tag?: string
  borderColor: string
}

interface UpcomingEventsProps {
  events?: UpcomingEvent[]
  maxItems?: number
}

const defaultEvents: UpcomingEvent[] = [
  {
    id: '1',
    date: new Date(2026, 0, 28),
    title: 'Cert Prep',
    time: '08:00',
    endTime: '09:00',
    type: 'meeting',
    tag: 'CLIENT',
    borderColor: 'bg-[#3088B7]',
  },
  {
    id: '2',
    date: new Date(2026, 2, 30),
    title: 'Q2 Planning Session',
    time: '10:00',
    endTime: '12:00',
    type: 'meeting',
    tag: 'CLIENT',
    borderColor: 'bg-[#3088B7]',
  },
  {
    id: '3',
    date: new Date(2026, 2, 30),
    title: 'NDA Signature Deadline',
    time: '17:00',
    endTime: '17:15',
    type: 'deadline',
    tag: 'DEADLINE',
    borderColor: 'bg-yellow-500',
  },
  {
    id: '4',
    date: new Date(2026, 6, 31),
    title: 'Q2 Kickoff',
    time: '03:00',
    endTime: '10:30',
    type: 'meeting',
    tag: 'CLIENT',
    borderColor: 'bg-[#3088B7]',
  },
]

const getTagStyles = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'bg-orange-100 text-orange-700'
    case 'client':
      return 'bg-blue-100 text-blue-700'
    case 'meeting':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getTagColor = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'bg-orange-500'
    case 'client':
    case 'meeting':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function UpcomingEvents({ events = [], maxItems = 4 }: UpcomingEventsProps) {
  const displayedEvents = events.slice(0, maxItems)

  const formatDate = (date: Date) => {
    return date.getDate()
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  }

  return (
    <div className="bg-white rounded-xl md:p-0 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Upcoming
        </h3>
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-semibold bg-[#E8643A]`}>
          {events.length}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2">
        {displayedEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Your upcoming events will appear here</p>
          </div>
        ) : (
          displayedEvents.map((event) => (
            <div key={event.id} className="flex font-manrope gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
              {/* Date */}
              <div className="flex flex-col items-center min-w-max">
                <div className="text-md font-bold text-slate-800">
                  {formatDate(event.date)}
                </div>
                <div className="text-[9px] font-medium text-slate-500 uppercase">
                  {formatMonth(event.date)}
                </div>
              </div>

              {/* Border Indicator */}
              <div className={`w-1 rounded-full border ${event.borderColor}`} />

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-xs mb-1 truncate">
                  {event.title}
                </h4>
                
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <p className="text-[10px] text-slate-600">
                    {event.time}-{event.endTime}
                  </p>
                </div>

                {event.tag && (
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${getTagStyles(event.type)}`}>
                    {event.tag}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Link */}
      {events.length > maxItems && (
        <button className="w-full mt-4 pt-4 border-t border-slate-100 text-center text-sm font-medium text-[#3088B7] hover:text-[#0891B2] transition-colors">
          View all {events.length} events
        </button>
      )}
    </div>
  )
}
