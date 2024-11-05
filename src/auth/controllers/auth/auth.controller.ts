import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserSignupDto } from 'src/auth/dto/UserSignup.dto';
import { UserLoginDto } from 'src/auth/dto/UserLogin.dto';
import { OtpVerificationDto } from 'src/auth/dto/OtpVerification.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/RequestResetPassword.dto';
import { ResetPasswordDto } from 'src/auth/dto/ResetPassword.dto';
import { RegenerateOtpDto } from 'src/auth/dto/RegenerateOtp.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  signup(@Body() userData: UserSignupDto) {
    return this.authService.signup(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  login(@Body() userData: UserLoginDto) {
    return this.authService.login(userData);
  }

  @Post('otp-verification')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  otpVerification(@Body() userData: OtpVerificationDto) {
    return this.authService.otpVerification(userData);
  }

  @Post('request-reset-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  requestPasswordReset(@Body() userData: RequestResetPasswordDto) {
    return this.authService.requestPasswordReset(userData);
  }
  
  @Post('reset-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  resetPassword(@Body() userData: ResetPasswordDto) {
    return this.authService.resetPassword(userData);
  }

  @Post('regenerate-otp')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  regenerateOtp(@Body() userData: RegenerateOtpDto) {
    return this.authService.regenerateOtp(userData);
  }
}
