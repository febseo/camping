export type SiteType = 'single' | 'family'

export interface CampingSite {
  id: number
  name: string
  type: SiteType
  location: string
  size: string
  features: string[]
  capacity: number
  price: number
  images: string[]
  description: string
}

export interface Reservation {
  id: string
  site_id: number
  original_site_id?: number
  check_in_date: string
  customer_name: string
  customer_phone: string
  car_number: string
  status: 'confirmed' | 'cancelled' | 'changed'
  total_price: number
  discount_amount: number
  event_id?: string
  created_at: string
  notes?: string
}

export interface Event {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  applies_to: SiteType | 'all'
  is_active: boolean
  created_at: string
}

export interface ReservationWithSite extends Reservation {
  site?: CampingSite
}
