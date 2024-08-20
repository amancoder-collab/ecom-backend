import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateCouponDto } from './dto/coupons.dto';

@Injectable()
export class CouponsService {
    constructor(private readonly prisma: PrismaService) {}

    // Fetch all coupons in 'My Coupons' section
    async getAllCoupons(userId: string) {
        return this.prisma.coupons.findMany({
            where: {
                is_active: true,
            },
        });
    }

    // Add a new coupon (Admin/Seller)
    async createCoupon(data: CreateCouponDto, userId: string) {
        // return this.prisma.coupons.create({
        //     data: {
        //         ...data,
        //     },
        // });
    }

    // Apply coupon logic (Check amount and usage)
    async applyCoupon(code: string, userId: string, orderAmount: number) {
        // const coupon = await this.prisma.coupons.findUnique({
        //     where: { coupon_code: code },
        // });
        // if (!coupon || !coupon.is_active || coupon.use_by) {
        //     throw new Error('Coupon is invalid or already used');
        // }
        // if (coupon.use_by) {
        //     throw new Error('Coupon is already used');
        // }
        // if (orderAmount > coupon.max_usage_amount) {
        //     throw new Error('Order amount exceeds the coupon limit');
        // }
        // // Mark coupon as used
        // await this.prisma.coupons.update({
        //     where: { coupon_code: code },
        //     data: { use_by: userId, is_active: false },
        // });
        // return true; // Coupon applied successfully
    }
}
