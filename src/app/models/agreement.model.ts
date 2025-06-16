export interface LocationFormData {
  practice_name: string;
  location_name: string;
  practiceAdressLine_1: string;
  practiceAdressLine_2?: string;
  practice_city: string;
  practice_state: string;
  practice_postal_zip_code: string;
  practice_country: string;
  practice_timezone: string;
  practice_office_phone: string;
  practice_email: string;
  practice_website_url?: string;
  practice_management_software: string;
  practice_poc: string;
  practice_poc_email: string;
  practice_poc_work_number: string;
  practice_poc_cell_number: string;
}

export interface ShippingAddressData {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface HardwareItem {
  count: number;
  price: number;
}

export interface PriceAddonDetails {
  phone_show?: string;
  phone_orginal_price?: string;
  phone_discnt_price?: string;
  analytics_show?: string;
  analytics_orginal_price?: string;
  analytics_discnt_price?: string;
  verification_show?: string;
  verification_orginal_price?: string;
  verification_discnt_price?: string;
  allow_adit_core_only?: number;
}

export interface IconState {
  phoneActive: boolean;
  analyticActive: boolean;
  verificationActive: boolean;
  phoneSelectionActive: boolean;
  purchasePhone: boolean;
}

export interface SubscriptionPlan {
  annually: number;
  monthly: number;
}