import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
    @IsString()
    code: string;

    @IsNumber()
    discountAmount: number;

    @IsDateString()
    expiryDate: Date;

    @IsNumber()
    maxUsageAmount: number;
}
