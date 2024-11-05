import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { IsEmailOrPhone } from '../../validators/IsEmailOrPhone';
import { Match } from '../../validators/Match';
// import { IsUnique } from '../../validators/IsUnique';
// import { UserEntity } from '../../typeentities/UserEntity';



export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(4)
  displayname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(4)
  username: string;

  // @IsOptional()
  // @IsEmail()
  // @MaxLength(255)
  // @MinLength(8)
  // email: string;

  // @IsOptional()
  // @IsString()
  // @MaxLength(20)
  // @MinLength(10)
  // phonenumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @Match('password', { message: 'Confirm password must match password' })
  confirmPassword: string;

  @IsEmailOrPhone({ message: 'Either email or phone number must be provided' })
  emailOrPhone: string;
}