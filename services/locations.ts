import { API_ROUTES } from '@/utils/api_routes'
import { request } from '@/utils/request'
import { getCachedSession } from './sessionCache'

export interface LocationCountry {
  id?: number | string
  name: string
  code?: string
  slug?: string
}

export interface LocationCity {
  id?: number | string
  name: string
  country?: string
  country_code?: string
}

export async function getCountries(): Promise<LocationCountry[]> {
  const session = await getCachedSession()
  const token = session?.accessToken

  const response = await request<void, { data?: LocationCountry[] } | LocationCountry[]>(
    {
      url: API_ROUTES.GET_COUNTRIES,
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  )

  const payload = Array.isArray(response.data)
    ? response.data
    : (response.data as { data?: LocationCountry[] } | undefined)?.data || []

  return payload as LocationCountry[]
}

export async function getCitiesByCountry(country: string): Promise<LocationCity[]> {
  const session = await getCachedSession()
  const token = session?.accessToken
  const safeCountry = encodeURIComponent(country.trim())

  const response = await request<void, { data?: LocationCity[] } | LocationCity[]>(
    {
      url: API_ROUTES.GET_CITIES_BY_COUNTRY(safeCountry),
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  )

  const payload = Array.isArray(response.data)
    ? response.data
    : (response.data as { data?: LocationCity[] } | undefined)?.data || []

  return payload as LocationCity[]
}
