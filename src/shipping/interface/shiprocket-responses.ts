export interface ICreateShipRocketOrderResponse {
  order_id: string;
  channel_order_id: string;
  shipment_id: string;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code: string;
  courier_company_id: string;
  courier_name: string;
  new_channel: boolean;
  packaging_box_error: string;
}

export interface IShipRocketGenerateAWBResponse {
  status_code?: number;
  message?: string;
  awb_assign_status: number;
  response: {
    data: {
      courier_company_id: number;
      awb_code: string;
      cod: number;
      order_id: number;
      shipment_id: number;
      awb_code_status: number;
      assigned_date_time: {
        date: string;
        timezone_type: number;
        timezone: string;
      };
      applied_weight: number;
      company_id: number;
      courier_name: string;
      child_courier_name: string | null;
      pickup_scheduled_date: string;
      routing_code: string;
      rto_routing_code: string;
      invoice_no: string;
      transporter_id: string;
      transporter_name: string;
      shipped_by: {
        shipper_company_name: string;
        shipper_address_1: string;
        shipper_address_2: string;
        shipper_city: string;
        shipper_state: string;
        shipper_country: string;
        shipper_postcode: string;
        shipper_first_mile_activated: number;
        shipper_phone: string;
        lat: string;
        long: string;
        shipper_email: string;
        rto_company_name: string;
        rto_address_1: string;
        rto_address_2: string;
        rto_city: string;
        rto_state: string;
        rto_country: string;
        rto_postcode: string;
        rto_phone: string;
        rto_email: string;
      };
    };
  };
}

export interface ISchedulePickupResponse {
  pickup_status: number;
  response: {
    pickup_scheduled_date: string;
    pickup_token_number: string;
    status: number;
    others: string;
    pickup_generated_date: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    data: string;
  };
}

export interface ICourierCompany {
  air_max_weight: string;
  assured_amount: number;
  base_courier_id: null | number;
  base_weight: string;
  blocked: number;
  call_before_delivery: string;
  charge_weight: number;
  city: string;
  cod: number;
  cod_charges: number;
  cod_multiplier: number;
  cost: string;
  courier_company_id: number;
  courier_name: string;
  courier_type: string;
  coverage_charges: number;
  cutoff_time: string;
  delivery_boy_contact: string;
  delivery_performance: number;
  description: string;
  edd: string;
  entry_tax: number;
  estimated_delivery_days: string;
  etd: string;
  etd_hours: number;
  freight_charge: number;
  id: number;
  is_custom_rate: number;
  is_hyperlocal: boolean;
  is_international: number;
  is_rto_address_available: boolean;
  is_surface: boolean;
  local_region: number;
  metro: number;
  min_weight: number;
  mode: number;
  new_edd: number;
  odablock: boolean;
  other_charges: number;
  others: string;
  pickup_availability: string;
  pickup_performance: number;
  pickup_priority: string;
  pickup_supress_hours: number;
  pod_available: string;
  postcode: string;
  qc_courier: number;
  rank: string;
  rate: number;
  rating: number;
  realtime_tracking: string;
  region: number;
  rto_charges: number;
  rto_performance: number;
  seconds_left_for_pickup: number;
  secure_shipment_disabled: boolean;
  ship_type: number;
  state: string;
  suppress_date: string;
  suppress_text: string;
  suppression_dates: null | any;
  surface_max_weight: string;
  tracking_performance: number;
  volumetric_max_weight: null | number;
  weight_cases: number;
  zone: string;
}

export interface ICourierServiceabilityResponse {
  company_auto_shipment_insurance_setting: boolean;
  covid_zones: {
    delivery_zone: null;
    pickup_zone: null;
  };
  currency: string;
  data: {
    available_courier_companies: ICourierCompany[];
    blocked_courier_companies: {
      block_reason: string;
      courier_company_id: number;
      courier_name: string;
      postcode: string;
    }[];
    child_courier_id: null;
    is_recommendation_enabled: number;
    recommendation_advance_rule: number;
    recommended_by: {
      id: number;
      title: string;
    };
    recommended_courier_company_id: number;
    shiprocket_recommended_courier_id: number;
  };
  dg_courier: number;
  eligible_for_insurance: boolean;
  insurace_opted_at_order_creation: boolean;
  is_allow_templatized_pricing: boolean;
  is_latlong: number;
  is_old_zone_opted: boolean;
  is_zone_from_mongo: boolean;
  label_generate_type: number;
  on_new_zone: number;
  seller_address: any[];
  status: number;
  user_insurance_manadatory: boolean;
}

export interface IPincodeValidationResponse {
  success: boolean;
  postcode_details: {
    postcode: string;
    city: string;
    locality: string[];
    state: string;
    state_code: string;
    longitude: string;
    latitude: string;
  };
}

export interface IPickupLocationsResponse {
  data: {
    shipping_address: IPickupLocation[];
    allow_more: string;
    is_blackbox_seller: boolean;
    company_name: string;
    recent_addresses: any[];
  };
}

export interface IPickupLocation {
  id: number;
  pickup_location: string;
  address_type: null | string;
  address: string;
  address_2: string;
  updated_address: boolean;
  old_address: string;
  old_address2: string;
  tag: string;
  tag_value: string;
  instruction: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  email: string;
  is_first_mile_pickup: number;
  phone: string;
  name: string;
  company_id: number;
  gstin: null | string;
  vendor_name: null | string;
  status: number;
  phone_verified: number;
  lat: string;
  long: string;
  open_time: null | string;
  close_time: null | string;
  warehouse_code: null | string;
  alternate_phone: string;
  rto_address_id: number;
  lat_long_status: number;
  new: number;
  associated_rto_address: null | any;
  is_primary_location: number;
}

export interface IShipRocketOrdersResponse {
  data: IOrder[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: Record<string, unknown>;
    };
  };
}

interface IOrder {
  id: number;
  channel_id: number;
  channel_name: string;
  base_channel_code: string;
  channel_order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_location: string;
  payment_status: string;
  total: string;
  tax: string;
  sla: string;
  shipping_method: string;
  expedited: number;
  status: string;
  status_code: number;
  payment_method: string;
  is_international: number;
  purpose_of_shipment: number;
  channel_created_at: string;
  created_at: string;
  products: IOrderProduct[];
  shipments: IOrderShipment[];
  activities: string[];
  allow_return: number;
  is_incomplete: number;
  errors: any[];
  show_escalation_btn: number;
  escalation_status: string;
  escalation_history: any[];
}

interface IOrderProduct {
  id: number;
  channel_order_product_id: string;
  name: string;
  channel_sku: string;
  quantity: number;
  product_id: number;
  available: number;
  status: string;
  hsn: string;
}

interface IOrderShipment {
  id: number;
  isd_code: string;
  courier: string;
  weight: number;
  dimensions: string;
  pickup_scheduled_date: string | null;
  pickup_token_number: string | null;
  awb: string;
  return_awb: string;
  volumetric_weight: number;
  pod: string | null;
  etd: string;
  rto_delivered_date: string;
  delivered_date: string | null;
  etd_escalation_btn: boolean;
}

export interface ICreateReturnOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  company_name: string;
}
