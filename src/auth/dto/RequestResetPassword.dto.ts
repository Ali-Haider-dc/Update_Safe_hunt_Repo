import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class RequestResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
  }
  