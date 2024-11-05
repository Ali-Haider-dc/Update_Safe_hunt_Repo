import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProcessPaymentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  cardSource: string; // The token generated from Stripe's frontend SDK

  @IsNotEmpty()
  @IsString()
  productId: string; // Amount in the smallest currency unit, e.g., cents for USD
}
