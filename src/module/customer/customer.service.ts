import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserAddresses(userId: string) {
    return this.prismaService.address.findMany({ where: { userId } });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    return this.prismaService.address.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        address2: dto.address2,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        pincode: dto.pincode,
        isDefault: dto.isDefault,
        user: { connect: { id: userId } },
      },
    });
  }

  async updateAddress(id: string, dto: UpdateAddressDto) {
    return this.prismaService.address.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        address2: dto.address2,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        pincode: dto.pincode,
        isDefault: dto.isDefault,
      },
    });
  }
}
