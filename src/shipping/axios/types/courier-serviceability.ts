export interface ICourierServiceabilityRequest {
  pickup_postcode: number;
  weight: number;
  delivery_postcode: number;
  cod: 0 | 1;
}
