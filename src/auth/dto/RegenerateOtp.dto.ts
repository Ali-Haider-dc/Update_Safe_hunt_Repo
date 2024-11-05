import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class RegenerateOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  }
  