import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateCouponDto } from './dto/coupons.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { ApplyCouponDto } from './dto/coupons.apply.dto';

@Injectable()
export class CouponsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllCoupons(userId: string) {
        let user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
        }

        return this.prisma.coupons.findMany({
            where: {
                is_active: true,
            },
        });
    }

    async createCoupon(dto: CreateCouponDto, adminId: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            let seller = await prisma.user.findFirst({
                where: {
                    id: adminId,
                },
                select: { id: true },
            });
            if (!seller) {
                throw new NotFoundException(ClientLogError.ONLY_SELLER);
            }

            const ValidFFrom = new Date(dto.ValidFrom);
            const ValidTTo = new Date(dto.ValidTo);

            if (isNaN(ValidTTo.getTime()) && isNaN(ValidFFrom.getTime())) {
                throw new NotFoundException(ClientLogError.INVALID_DATE);
            }
            const existingCoupon = await prisma.coupons.findFirst({
                where: {
                    coupon_code: dto.couponCode.toUpperCase(),
                },
            });

            if (existingCoupon) {
                throw new ConflictException(ClientLogError.COUPON_CODE_EXISTS);
            }
            return await prisma.coupons.create({
                data: {
                    coupon_title: dto.couponTitle,
                    coupon_code: dto.couponCode.toUpperCase(),
                    min_purchase_amount: dto.MinPurchaseAmount,
                    discount_percentage: dto.discountPercentage,
                    coupon_tnc: dto.couponTnc,
                    valid_from: ValidFFrom,
                    valid_to: ValidTTo,
                    max_usage_amount: dto.MaxDiscountAmount,
                },
                select: { id: true, coupon_code: true },
            });
        });

        return result;
    }

    //TODO: need to check performance and need to make this api fast
    async applyCoupon(userId: string, dto: ApplyCouponDto) {
        const coupon = await this.prisma.coupons.findFirst({
            where: {
                coupon_code: dto.couponCode,
                is_active: true,
            },
        });

        if (!coupon) {
            throw new NotFoundException(ClientLogError.COUPON_INVALID);
        }
        if (!coupon.is_active) {
            throw new NotFoundException(ClientLogError.COUPON_NOT_ACTIVE);
        }

        const findCouponUsBy = await this.prisma.couponsUsBy.findFirst({
            where: {
                coupons_id: coupon.id,
                user_id: userId,
            },
        });
        if (findCouponUsBy) {
            throw new NotFoundException(ClientLogError.COUPON_ALREADY_USED);
        }

        const currentDate = new Date();
        if (currentDate < coupon.valid_from || currentDate > coupon.valid_to) {
            throw new NotFoundException(
                ClientLogError.COUPON_NOT_VALID_FOR_THIS_TIME,
            );
        }

        if (dto.orderAmount < coupon.min_purchase_amount) {
            throw new NotFoundException(
                `${ClientLogError.REQ_MIN_PURCHASE}` +
                    `${coupon.min_purchase_amount}`,
            );
        }

        const discountAmount =
            (dto.orderAmount * coupon.discount_percentage) / 100;

        const totalDiscountAmount = Math.min(
            discountAmount,
            coupon.max_usage_amount,
        );
        const finalPrice = dto.orderAmount - totalDiscountAmount;

        await this.prisma.couponsUsBy.create({
            data: { user_id: userId, coupons_id: coupon.id },
        });

        // this coupon id not saving in db

        return {
            message: 'Coupon applied successfully',
            coupon: {
                code: coupon.coupon_code,
                title: coupon.coupon_title,
                maxUsageAmount: coupon.max_usage_amount,
                minPurchaseAmount: coupon.min_purchase_amount,
                totalDiscountAmount: -totalDiscountAmount,
                finalPrice: finalPrice,
            },
        };
    }

    async deleteCoupon(adminId: string, couponId: string) {
        let seller = await this.prisma.user.findFirst({
            where: {
                id: adminId,
            },
            select: { id: true },
        });
        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }

        return await this.prisma.coupons.delete({
            where: {
                id: couponId,
            },
            select: { id: true, coupon_code: true },
        });
    }
}
