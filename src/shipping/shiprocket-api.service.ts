import { Injectable } from '@nestjs/common';
import { AxiosService } from './axios/axios.service';
import { ICourierServiceabilityRequest } from './axios/types/courier-serviceability';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateShipRocketOrderDto } from './dto/create-order.dto';
import {
  GenerateAWBDto,
  GenerateAWBForReturnDto,
} from './dto/generate-awb.dto';
import { SchedulePickupDto } from './dto/schedule-pickup.dto';
import { ICreateReturnOrder } from './interface/create-return-order.interface';
import {
  ICourierServiceabilityResponse,
  ICreateReturnOrderResponse,
  ICreateShipRocketOrderResponse,
  IPickupLocationsResponse,
  IPincodeValidationResponse,
  ISchedulePickupResponse,
  IShipRocketGenerateAWBResponse,
  IShipRocketOrdersResponse,
} from './interface/shiprocket-responses';

@Injectable()
export class ShipRocketApiService {
  constructor(private readonly axiosService: AxiosService) {}

  async getCourierServiceability(data: ICourierServiceabilityRequest) {
    return await this.axiosService.get<ICourierServiceabilityResponse>(
      '/courier/serviceability/',
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

  async getAllPickupLocations(): Promise<IPickupLocationsResponse['data']> {
    const responseData = await this.axiosService.get<IPickupLocationsResponse>(
      '/settings/company/pickup',
    );

    return responseData.data;
  }

  async createOrder(data: CreateShipRocketOrderDto) {
    return await this.axiosService.post<ICreateShipRocketOrderResponse>(
      '/orders/create/adhoc',
      data,
    );
  }

  async getOrders() {
    return await this.axiosService.get<IShipRocketOrdersResponse>('/orders');
  }

  async generateAWBNumber(data: GenerateAWBDto) {
    const responseData =
      await this.axiosService.post<IShipRocketGenerateAWBResponse>(
        'courier/assign/awb',
        {
          shipment_id: data.shipmentId,
          courier_id: data.courierId,
        },
      );

    return responseData.response.data;
  }

  async createReturnOrder(data: ICreateReturnOrder) {
    return await this.axiosService.post<ICreateReturnOrderResponse>(
      '/orders/create/return',
      data,
    );
  }

  async generateAWBNumberForReturn(data: GenerateAWBForReturnDto) {
    return await this.axiosService.post<IShipRocketGenerateAWBResponse>(
      'courier/assign/awb/return',
      {
        shipment_id: data.shipmentId,
        courier_id: data.courierId,
        is_return: data.isReturn,
      },
    );
  }

  async schedulePickup(data: SchedulePickupDto) {
    return await this.axiosService.post<ISchedulePickupResponse>(
      'courier/generate/pickup',
      {
        shipment_id: data.shipmentId,
        pickup_date: data.pickup_date,
        status: data.status,
      },
    );
  }

  async cancelOrder(data: CancelOrderDto) {
    return await this.axiosService.post('/orders/cancel', {
      ids: data.ids,
    });
  }

  async getPostCodeDetails(postcode: string) {
    return await this.axiosService.get<IPincodeValidationResponse>(
      '/open/postcode/details',
      {
        params: {
          postcode: postcode,
        },
      },
    );
  }
}
