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
