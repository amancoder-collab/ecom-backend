import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CouponsModule } from './coupons/coupons.module';
import { ProductModule } from './product/product.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    CouponsModule,
    ProductModule,
    ProductAttributeModule,
  ],
})
export class AdminModule {}
