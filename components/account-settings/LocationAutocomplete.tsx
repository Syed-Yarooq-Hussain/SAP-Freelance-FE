'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
}

// Extend Window type for Google Maps
declare global {
  interface Window {
    google: any
    initGoogleMapsAutocomplete?: () => void
  }
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'e.g., Berlin',
  className = '',
  error,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any | null>(null)
  const [inputValue, setInputValue] = useState(value || '')
  const [isLoaded, setIsLoaded] = useState(false)

  // Sync external value changes (e.g. from form reset/load)
  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  // Load the Google Maps script once
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.')
      return
    }

    // Already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      return
    }

    // Already injected but not yet ready
    if (document.getElementById('google-maps-script')) {
      window.initGoogleMapsAutocomplete = () => setIsLoaded(true)
      return
    }

    // Inject script
    window.initGoogleMapsAutocomplete = () => setIsLoaded(true)

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAutocomplete`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Cleanup callback only; leave script tag to avoid re-loading
      delete window.initGoogleMapsAutocomplete
    }
  }, [])

  // Initialise Autocomplete once the API is ready and input is mounted
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['(cities)'], // restrict to cities; remove/change as needed
        fields: ['formatted_address', 'name', 'address_components'],
      }
    )

    const listener = autocompleteRef.current.addListener(
      'place_changed',
      () => {
        const place = autocompleteRef.current?.getPlace()
        if (!place) return

        // Build a clean location string: "City, Country"
        const city = place.address_components?.find((c:any) =>
          c.types.includes('locality')
        )?.long_name

        const country = place.address_components?.find((c:any) =>
          c.types.includes('country')
        )?.long_name

        const formatted =
          city && country
            ? `${city}, ${country}`
            : place.formatted_address || place.name || ''

        setInputValue(formatted)
        onChange(formatted)
      }
    )

    return () => {
      window.google.maps.event.removeListener(listener)
    }
  }, [isLoaded, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    // Allow manual typing; the form value stays in sync via place_changed
    // If user clears the field, propagate the empty value
    if (e.target.value === '') onChange('')
  }

  const baseInputClass =
    'w-full pl-4 pr-4 py-2 border rounded-input focus:outline-none transition-colors'
  const borderClass = error
    ? 'border-red-400 focus:border-red-500'
    : 'border-slate-300 focus:border-brand-blue'

  return (
    <div className="relative">

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`${baseInputClass} ${borderClass} ${className}`}
      />

      {/* Subtle "powered by Google" badge required by Google's ToS */}
      {isLoaded && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none select-none">
          powered by Google
        </span>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}