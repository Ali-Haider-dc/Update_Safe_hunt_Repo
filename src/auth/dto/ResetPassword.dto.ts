import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    // @IsNotEmpty()
    // @IsString()
    // token: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password is too short. It must be at least 8 characters long.' })
    @MaxLength(32, { message: 'Password is too long. It must be less than 32 characters long.' })
    newPassword: string;
  }
  