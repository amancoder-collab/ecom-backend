import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientLogError } from 'src/common/helper/error_description';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddAddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update.address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async addAddress(dto: AddAddressDto, UserId: string) {
    let user = await this.prismaService.user.findFirst({
      where: {
        id: UserId,
      },
    });
    if (!user) {
      throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
    }
    const result = this.prismaService.$transaction(async (prisma) => {
      const address = await prisma.address.create({
        data: {
          name: dto.name,
          houseNumber: dto.houseNumber,
          street: dto.street,
          city: dto.city,
          state: dto.gstNumber,
          country: dto.country,
          pincode: dto.pincode,
          landmark: dto.landMark,
          phoneNumber: dto.phoneNumber,
          companyName: dto.companyName,
          gstNumber: dto.gstNumber,
          userId: UserId,
        },
      });

      return address;
    });

    return result;
  }

  async updateAddress(
    dto: UpdateAddressDto,
    UserId: string,
    addressId: string,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: { id: UserId },
    });

    if (!user) {
      throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
    }

    const addressUpdates: UpdateAddressInput = Object.keys(dto).reduce(
      (acc, key) => {
        if (dto[key] !== undefined) {
          acc[key] = dto[key];
        }
        return acc;
      },
      {} as UpdateAddressInput,
    );

    const updatedAddress = await this.prismaService.address.update({
      where: { id: addressId },
      data: addressUpdates,
    });

    return updatedAddress;
  }

  async getAddress() {
    const result = await this.prismaService.address.findMany();
    return result;
  }

  async deleteAddress(AddressId: string, UserId: string) {
    let user = await this.prismaService.user.findFirst({
      where: {
        id: UserId,
      },
    });
    if (!user) {
      throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
    }
    return await this.prismaService.address.delete({
      where: {
        id: AddressId,
      },
    });
  }
}
