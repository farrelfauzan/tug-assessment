import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './features/auth/auth.module';
import { OrdersModule } from './features/orders/orders.module';
import { ReviewsModule } from './features/reviews/reviews.module';
import { WellnessPackagesModule } from './features/wellness-packages/wellness-packages.module';
import { AppAuthModule } from './shared/auth/auth.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AppAuthModule,
    AuthModule,
    WellnessPackagesModule,
    OrdersModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
