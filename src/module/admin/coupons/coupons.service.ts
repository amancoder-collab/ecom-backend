import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { ApplyCouponDto } from './dto/coupons.apply.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCoupons(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
    }

    return this.prisma.coupon.findMany({
      where: { isActive: true },
    });
  }

  async createCoupon(dto: CreateCouponDto, sellerId: string) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const seller = await prisma.user.findFirst({
        where: {
          id: sellerId,
          role: 'SELLER',
        },
        select: { id: true },
      });
      if (!seller) {
        throw new NotFoundException(ClientLogError.ONLY_SELLER);
      }

      const validFrom = new Date(dto.validFrom);
      const validTo = new Date(dto.validTo);

      if (isNaN(validTo.getTime()) || isNaN(validFrom.getTime())) {
        throw new NotFoundException(ClientLogError.INVALID_DATE);
      }
      const existingCoupon = await prisma.coupon.findFirst({
        where: {
          code: dto.couponCode.toUpperCase(),
        },
      });

      if (existingCoupon) {
        throw new ConflictException(ClientLogError.COUPON_CODE_EXISTS);
      }
      return await prisma.coupon.create({
        data: {
          title: dto.couponTitle,
          code: dto.couponCode.toUpperCase(),
          minPurchaseAmount: dto.minPurchaseAmount,
          discountPercentage: dto.discountPercentage,
          termsAndConditions: dto.couponTnc,
          validFrom: validFrom,
          validTo: validTo,
          maxUsageAmount: dto.maxDiscountAmount,
        },
        select: { id: true, code: true },
      });
    });

    return result;
  }

  //TODO: need to check performance and need to make this api fast
  async applyCoupon(userId: string, dto: ApplyCouponDto) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: dto.couponCode,
        isActive: true,
      },
    });

    if (!coupon) {
      throw new NotFoundException(ClientLogError.COUPON_INVALID);
    }
    if (!coupon.isActive) {
      throw new NotFoundException(ClientLogError.COUPON_NOT_ACTIVE);
    }

    const findCouponUsage = await this.prisma.couponUsage.findFirst({
      where: {
        couponId: coupon.id,
        userId: userId,
      },
    });
    if (findCouponUsage) {
      throw new NotFoundException(ClientLogError.COUPON_ALREADY_USED);
    }

    const currentDate = new Date();
    if (currentDate < coupon.validFrom || currentDate > coupon.validTo) {
      throw new NotFoundException(
        ClientLogError.COUPON_NOT_VALID_FOR_THIS_TIME,
      );
    }

    if (dto.orderAmount < coupon.minPurchaseAmount) {
      throw new NotFoundException(
        `${ClientLogError.REQ_MIN_PURCHASE}` + `${coupon.minPurchaseAmount}`,
      );
    }

    const discountAmount = (dto.orderAmount * coupon.discountPercentage) / 100;

    const totalDiscountAmount = Math.min(discountAmount, coupon.maxUsageAmount);
    const finalPrice = dto.orderAmount - totalDiscountAmount;

    await this.prisma.couponUsage.create({
      data: { userId: userId, couponId: coupon.id },
    });

    return {
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        title: coupon.title,
        maxUsageAmount: coupon.maxUsageAmount,
        minPurchaseAmount: coupon.minPurchaseAmount,
        totalDiscountAmount: -totalDiscountAmount,
        finalPrice: finalPrice,
      },
    };
  }

  async deleteCoupon(sellerId: string, couponId: string) {
    const seller = await this.prisma.user.findFirst({
      where: {
        id: sellerId,
        role: 'SELLER',
      },
      select: { id: true },
    });
    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }

    return await this.prisma.coupon.delete({
      where: {
        id: couponId,
      },
      select: { id: true, code: true },
    });
  }
}
