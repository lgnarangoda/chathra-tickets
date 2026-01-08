import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthGuard } from './supabase.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService, SupabaseService, SupabaseAuthGuard],
  controllers: [AuthController],
  exports: [SupabaseAuthGuard, SupabaseService],
})
export class AuthModule {}
