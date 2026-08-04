'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getCitiesByCountry, getCountries } from '@/services/locations'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
  type?: 'country' | 'city' | 'input'
  selectedCountry?: string
}

const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Netherlands',
  'France',
  'Spain',
  'Ireland',
  'Australia',
  'India',
  'Pakistan',
  'UAE',
  'Saudi Arabia',
  'Singapore',
]

const countryCityMap: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Leeds'],
  Germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'],
  France: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux'],
  Spain: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga'],
  Ireland: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  India: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad'],
  Pakistan: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar'],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Medina'],
  Singapore: ['Singapore'],
}

const fallbackCityOptions = [
  'Berlin',
  'Munich',
  'Hamburg',
  'Frankfurt',
  'London',
  'Manchester',
  'Birmingham',
  'Dubai',
  'Abu Dhabi',
  'New York',
  'Los Angeles',
  'Toronto',
  'Vancouver',
  'Sydney',
  'Melbourne',
  'Singapore',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Delhi',
  'Mumbai',
  'Amsterdam',
  'Rotterdam',
  'Paris',
  'Barcelona',
]

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  error,
  type = 'input',
  selectedCountry,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '')
  const [countryOptionsState, setCountryOptionsState] = useState<string[]>(countryOptions)
  const [cityOptionsState, setCityOptionsState] = useState<string[]>(fallbackCityOptions)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    const loadCountries = async () => {
      if (type !== 'country') return

      try {
        setIsLoading(true)
        const countries = await getCountries()
        if (countries?.length) {
          const names = countries.map((country) => country.name).filter(Boolean)
          setCountryOptionsState(names)
        }
      } catch (error) {
        console.error('Failed to load countries', error)
      } finally {
        setIsLoading(false)
      }
    }

    void loadCountries()
  }, [type])

  useEffect(() => {
    const loadCities = async () => {
      if (type !== 'city') return
      const normalizedCountry = selectedCountry?.trim()
      if (!normalizedCountry) {
        setCityOptionsState(fallbackCityOptions)
        return
      }

      try {
        setIsLoading(true)
        const cities = await getCitiesByCountry(normalizedCountry)
        if (cities?.length) {
          const names = cities.map((city) => city.name).filter(Boolean)
          setCityOptionsState(names)
          return
        }
      } catch (error) {
        console.error('Failed to load cities', error)
      } finally {
        setIsLoading(false)
      }

      const mappedFallback = countryCityMap[normalizedCountry] || fallbackCityOptions
      setCityOptionsState(mappedFallback)
    }

    void loadCities()
  }, [selectedCountry, type])

  const baseInputClass =
    'w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none transition-colors bg-white'
  const borderClass = error
    ? 'border-red-400 focus:border-red-500'
    : 'border-slate-300 focus:border-brand-blue'

  const options = useMemo(() => {
    if (type === 'country') {
      return countryOptionsState
    }

    if (type === 'city') {
      return cityOptionsState
    }

    return []
  }, [cityOptionsState, countryOptionsState, type])

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    if (!query) return options
    return options.filter((option) => option.toLowerCase().includes(query))
  }, [inputValue, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: string) => {
    setInputValue(option)
    onChange(option)
    setIsOpen(false)
  }

  if (type === 'country' || type === 'city') {
    return (
      <div className="relative" ref={containerRef}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const nextValue = e.target.value
            setInputValue(nextValue)
            onChange(nextValue)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`${baseInputClass} ${borderClass} ${className}`}
        />

        {isLoading && type === 'city' && (
          <p className="mt-1 text-[11px] text-slate-500">Loading cities…</p>
        )}

        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {filteredOptions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="flex w-full items-center px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const nextValue = e.target.value
          setInputValue(nextValue)
          onChange(nextValue)
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={`${baseInputClass} ${borderClass} ${className}`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}