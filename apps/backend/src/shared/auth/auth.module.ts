import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'local-dev-secret'
    })
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard]
})
export class AppAuthModule {}
