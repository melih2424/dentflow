export type UserRole = 'super_admin' | 'clinic_owner' | 'secretary' | 'doctor'
export type SubscriptionPlan = 'basic' | 'pro' | 'premium'
export type PatientStatus =
  | 'new_lead'
  | 'price_given'
  | 'appointment_pending'
  | 'appointment_booked'
  | 'treatment_started'
  | 'review_done'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type LeadSource = 'instagram' | 'facebook' | 'google_ads' | 'organic' | 'whatsapp' | 'referral'
export type AutomationTrigger =
  | 'after_appointment'
  | 'no_show'
  | 'appointment_reminder'
  | 'new_lead'
  | 'review_request'

export interface Clinic {
  id: string
  name: string
  logo?: string
  city: string
  phone: string
  whatsapp_number: string
  subscription_plan: SubscriptionPlan
  google_review_link?: string
  ai_prompt?: string
  created_at: string
}

export interface User {
  id: string
  clinic_id: string
  role: UserRole
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface Patient {
  id: string
  clinic_id: string
  full_name: string
  phone: string
  source: LeadSource
  status: PatientStatus
  interested_service?: string
  notes?: string
  utm_source?: string
  utm_campaign?: string
  created_at: string
  last_contact?: string
}

export interface Conversation {
  id: string
  patient_id: string
  role: 'user' | 'assistant'
  message: string
  created_at: string
}

export interface Appointment {
  id: string
  clinic_id: string
  patient_id: string
  doctor_id?: string
  appointment_date: string
  duration_minutes: number
  status: AppointmentStatus
  notes?: string
  service_type?: string
  created_at: string
  patient?: Patient
  doctor?: User
}

export interface Review {
  id: string
  clinic_id: string
  patient_id: string
  rating: number
  comment?: string
  source: 'whatsapp' | 'google' | 'manual'
  google_submitted: boolean
  created_at: string
  patient?: Patient
}

export interface Automation {
  id: string
  clinic_id: string
  name: string
  trigger_type: AutomationTrigger
  delay_hours: number
  message_template: string
  is_active: boolean
  created_at: string
}

export interface DashboardStats {
  daily_leads: number
  daily_leads_change: number
  total_appointments: number
  appointments_change: number
  whatsapp_messages: number
  messages_change: number
  review_count: number
  reviews_change: number
  conversion_rate: number
  conversion_change: number
}

export interface LeadChartData {
  date: string
  leads: number
  appointments: number
  conversions: number
}
