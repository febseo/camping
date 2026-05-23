import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Event } from './types'

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원'
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy년 MM월 dd일 (EEE)', { locale: ko })
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MM/dd (EEE)', { locale: ko })
}

export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function calculateDiscount(price: number, event: Event | null): number {
  if (!event) return 0
  if (event.discount_type === 'percent') {
    return Math.floor(price * (event.discount_value / 100))
  }
  return Math.min(event.discount_value, price)
}

export function getActiveEvent(events: Event[], date: string, siteType: 'single' | 'family'): Event | null {
  return events.find(e => {
    if (!e.is_active) return false
    if (date < e.start_date || date > e.end_date) return false
    if (e.applies_to !== 'all' && e.applies_to !== siteType) return false
    return true
  }) ?? null
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
