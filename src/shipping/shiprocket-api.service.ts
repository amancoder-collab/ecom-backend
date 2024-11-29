import { Injectable } from "@nestjs/common";
import { AxiosService } from "./axios/axios.service";
import { ICourierServiceabilityRequest } from "./axios/types/courier-serviceability";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CreateShipRocketOrderDto } from "./dto/create-order.dto";
import {
  GenerateAWBDto,
  GenerateAWBForReturnDto,
} from "./dto/generate-awb.dto";
import { SchedulePickupDto } from "./dto/schedule-pickup.dto";
import { ICreateReturnOrder } from "./interface/create-return-order.interface";
import {
  ICourierServiceabilityResponse,
  ICreateReturnOrderResponse,
  ICreateShipRocketOrderResponse,
  IPickupLocationsResponse,
  IPincodeValidationResponse,
  ISchedulePickupResponse,
  IShipRocketGenerateAWBResponse,
  IShipRocketOrdersResponse,
} from "./interface/shiprocket-responses";

@Injectable()
export class ShipRocketApiService {
  constructor(private readonly axiosService: AxiosService) {}

  async getCourierServiceability(data: ICourierServiceabilityRequest) {
    return await this.axiosService.get<ICourierServiceabilityResponse>(
      "/courier/serviceability/",
      {
        params: {
          pickup_postcode: data.pickup_postcode,
          weight: data.weight,
          delivery_postcode: data.delivery_postcode,
          cod: data.cod,
        },
      },
    );
  }

  async getAllPickupLocations(): Promise<IPickupLocationsResponse["data"]> {
    const responseData = await this.axiosService.get<IPickupLocationsResponse>(
      "/settings/company/pickup",
    );

    return responseData.data;
  }

  async createOrder(data: CreateShipRocketOrderDto) {
    return await this.axiosService.post<ICreateShipRocketOrderResponse>(
      "/orders/create/adhoc",
      data,
    );
  }

  async getOrders() {
    return await this.axiosService.get<IShipRocketOrdersResponse>("/orders");
  }

  async generateAWBNumber(
    data: GenerateAWBDto,
  ): Promise<IShipRocketGenerateAWBResponse["response"]["data"]> {
    const responseData = {
      awb_assign_status: 1,
      response: {
        data: {
          courier_company_id: 142,
          awb_code: "321055706540",
          cod: 0,
          order_id: 281248157,
          shipment_id: 280640636,
          awb_code_status: 1,
          assigned_date_time: {
            date: "2022-11-25 11:17:52.878599",
            timezone_type: 3,
            timezone: "Asia/Kolkata",
          },
          applied_weight: 0.5,
          company_id: 25149,
          courier_name: "Amazon Surface",
          child_courier_name: null,
          pickup_scheduled_date: "2022-11-25 14:00:00",
          routing_code: "",
          rto_routing_code: "",
          invoice_no: "retail5769122647118",
          transporter_id: "",
          transporter_name: "",
          shipped_by: {
            shipper_company_name: "manoj",
            shipper_address_1: "Aligarh",
            shipper_address_2: "noida",
            shipper_city: "Jammu",
            shipper_state: "Jammu & Kashmir",
            shipper_country: "India",
            shipper_postcode: "110030",
            shipper_first_mile_activated: 0,
            shipper_phone: "8976967989",
            lat: "32.731899",
            long: "74.860376",
            shipper_email: "hdhd@gshd.com",
            rto_company_name: "test",
            rto_address_1: "Unnamed Road, Bengaluru, Karnataka 560060, India",
            rto_address_2: "Katrabrahmpur",
            rto_city: "Bangalore",
            rto_state: "Karnataka",
            rto_country: "India",
            rto_postcode: "560060",
            rto_phone: "9999999999",
            rto_email: "test@test.com",
          },
        },
      },
    };

    return responseData.response.data;
    // const responseData =
    //   await this.axiosService.post<IShipRocketGenerateAWBResponse>(
    //     "courier/assign/awb",
    //     {
    //       shipment_id: data.shipmentId,
    //       courier_id: data.courierId,
    //     },
    //   );

    // return responseData.response.data;
  }

  async createReturnOrder(data: ICreateReturnOrder) {
    return await this.axiosService.post<ICreateReturnOrderResponse>(
      "/orders/create/return",
      data,
    );
  }

  async generateAWBNumberForReturn(data: GenerateAWBForReturnDto) {
    return {
      awb_code: `AWB${Math.floor(Math.random() * 1000000)}`,
      courier_company_id: 1,
      courier_name: "Dummy Express",
      shipment_id: data.shipmentId,
    };
    // return await this.axiosService.post<IShipRocketGenerateAWBResponse>(
    //   "courier/assign/awb/return",
    //   {
    //     shipment_id: data.shipmentId,
    //     courier_id: data.courierId,
    //     is_return: data.isReturn,
    //   },
    // );
  }

  async schedulePickup(
    data: SchedulePickupDto,
  ): Promise<ISchedulePickupResponse> {
    return {
      pickup_status: 1,
      response: {
        pickup_scheduled_date: "2021-12-10 12:39:54",
        pickup_token_number: "Reference No: 194_BIGFOOT 1966840_11122021",
        status: 3,
        others:
          '{"tier_id":5,"etd_zone":"z_e","etd_hours":"{\\"assign_to_pick\\":6.9000000000000004,\\"pick_to_ship\\":22.600000000000001,\\"ship_to_deliver\\":151.40000000000001,\\"etd_zone\\":\\"z_e\\",\\"pick_to_ship_table\\":\\"dev_etd_pickup_to_ship\\",\\"ship_to_deliver_table\\":\\"dev_etd_ship_to_deliver\\"}","actual_etd":"2021-12-18 00:36:03","routing_code":"S2\\/S-69\\/1B\\/016","addition_in_etd":["deduction_of_6_and_half_hours"],"shipment_metadata":{"type":"ship","device":"WebKit","platform":"desktop","client_ip":"94.237.77.195","created_at":"2021-12-10 12:36:03","request_type":"web"},"templatized_pricing":0,"selected_courier_type":"Best in price","recommended_courier_data":{"etd":"Dec 19, 2021","price":153,"rating":3.6,"courier_id":54},"recommendation_advance_rule":null,"dynamic_weight":"1.00"}',
        pickup_generated_date: {
          date: "2021-12-10 12:39:54.034695",
          timezone_type: 3,
          timezone: "Asia/Kolkata",
        },
        data: "Pickup is confirmed by Xpressbees 1kg For AWB :- 143254213727423",
      },
    };
    // return await this.axiosService.post<ISchedulePickupResponse>(
    //   "courier/generate/pickup",
    //   {
    //     shipment_id: data.shipmentId,
    //     pickup_date: data.pickup_date,
    //     status: data.status,
    //   },
    // );
  }

  async cancelOrder(data: CancelOrderDto) {
    return {
      status: "Success",
      message: "Order cancelled successfully",
    };
    // return await this.axiosService.post("/orders/cancel", {
    //   ids: data.ids,
    // });
  }

  async getPostCodeDetails(postcode: string) {
    return {
      success: true,
      postcode_details: {
        postcode: "110077",
        city: "South West Delhi",
        locality: [
          "Bagdola",
          "Barthal",
          "Palam Extn (Harijan Basti)",
          "Dhulsiras",
          "Raj Nagar - II",
        ],
        state: "Delhi",
        state_code: "DL",
        longitude: "77.399",
        latitude: "28.2636",
      },
    };
    // return await this.axiosService.get<IPincodeValidationResponse>(
    //   "/open/postcode/details",
    //   {
    //     params: {
    //       postcode: postcode,
    //     },
    //   },
    // );
  }
}
