import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/typeorm/entities/UserEntity';
import { UserSignupParams } from 'src/utils/types';
import { UserLoginParams } from 'src/utils/types';
import { EmailService } from 'src/email/email.service';
import { OtpVerificationDto } from 'src/auth/dto/OtpVerification.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/RequestResetPassword.dto';
import { ResetPasswordDto } from 'src/auth/dto/ResetPassword.dto';
import { RegenerateOtpDto } from 'src/auth/dto/RegenerateOtp.dto';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  async findByDisplayName(displayname: string) {
    return this.userRepo.findOneBy({ displayname });
  }

  async findByPhoneNumber(phonenumber: string) {
    return this.userRepo.findOneBy({ phonenumber });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async signup(userData: UserSignupParams) {
    if (userData.email) {
      const emailExist = await this.findByEmail(userData.email);
      if (emailExist) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    if (userData.username) {
      const usernameExist = await this.findByUsername(userData.username);
      if (usernameExist) {
        throw new HttpException(
          'User with this username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    if (userData.displayname) {
      const displaynameExist = await this.findByDisplayName(userData.displayname);
      if (displaynameExist) {
        throw new HttpException(
          'User with this display name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    if (userData.phonenumber) {
      const phoneExist = await this.findByPhoneNumber(userData.phonenumber);
      if (phoneExist) {
        throw new HttpException(
          'User with this phone number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    // Hash the password
    userData.password = await this.hashPassword(userData.password);
  
    // Generate the OTP and set status to PENDING_VERIFICATION
    const otp = this.generateAuthCode();
    const otpExpiry = addMinutes(new Date(), 5); // Set OTP expiry to 5 minutes from now

    const newUser = this.userRepo.create({
      ...userData,
      status: 'PENDING_VERIFICATION',
      otp: otp,
      otpexpiry: otpExpiry, // Add the OTP expiry date
    });
  
    // Save the user
    await this.userRepo.save(newUser);
  
    // Send the authentication code via email
    await this.emailService.sendMail(
      userData.email,
      'Your Authentication Code',
      `Your authentication code is: ${otp}`
    );
  
    // Generate token
    const token = this.generateToken(newUser);
  
    const response = {
      displayname: newUser.displayname,
      username: newUser.username,
      email: newUser.email,
      phonenumber: newUser.phonenumber,
      id: newUser.id,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      status: newUser.status,
      otp: newUser.otp,
      otpexpiry: newUser.otpexpiry, // Include otpexpiry in the response
      token: token,
    };
  
    return response;
  }
  

  private generateToken(user: UserEntity): string {
    const payload = { sub: user.id, email: user.email };
    const secret = process.env.JWT_SECRET || 'default_secret'; // use 'default_secret' as fallback
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  private generateAuthCode(length: number = 6): string {
    const numbers = '0123456789';
    let authCode = '';
    for (let i = 0; i < length; i++) {
      authCode += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return authCode;
  }

  async login(userData: UserLoginParams) {
    
    const user = await this.userRepo.findOneBy({ username: userData.username });
    
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    console.log(user.status)
    if(user.status != 'subscribed'){
      throw new HttpException('Your account is not verified', HttpStatus.UNAUTHORIZED);
    }

    const token = this.generateToken(user);

    const response = {
        id: user.id,
        displayname: user.displayname,
        username: user.username,
        email: user.email,
        phonenumber: user.phonenumber,
        status: user.status,
        otp: user.otp,
        token: token
    };
  
    return response;
  }

  async otpVerification(userData: OtpVerificationDto) {
    const { otp, email } = userData;

    // Step 1: Find the user by email or some identifier
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.status == 'OTP_VERIFIED') {
      throw new HttpException('You are already verified', HttpStatus.UNAUTHORIZED);
    }

    // Step 2: Verify the OTP
    if (user.otp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }

    // Step 3: Optionally check if the OTP is expired
    // Example: OTP should be verified within 5 minutes
    const otpExpiryTime = new Date(user.otpexpiry);
    const currentTime = new Date();

    if (currentTime > otpExpiryTime) {
      
      throw new HttpException('OTP expired', HttpStatus.UNAUTHORIZED);
    }

    // Step 4: Mark the OTP as verified or update the user’s status
    user.status = 'OTP_VERIFIED';
    await this.userRepo.save(user);

    return {
      message: 'OTP verification successful',
      email: email,
      status:'OTP_VERIFIED',
    };
  }

  async requestPasswordReset(userData: RequestResetPasswordDto) {
    const { email } = userData;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }


    const otp = this.generateAuthCode();
    // const otpExpiry = addMinutes(new Date(), 5);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

    // Send the authentication code via email
    await this.emailService.sendMail(
      email,
      'Password Reset Request',
      `Your authentication code is: ${otp}`
    );

    user.otpexpiry = expires;
    user.otp = otp;
    user.status = 'PENDING_VERIFICATION';
    await this.userRepo.save(user);

    return {
      message: 'OTP is sent to your email successfully.',
      status:'PENDING_VERIFICATION',
    };

    // const resetToken = randomBytes(32).toString('hex');
    // const expires = new Date();
    // expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

    // user.resetToken = resetToken;
    // user.resetTokenExpires = expires;
    // await this.userRepo.save(user);

    // const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    // await this.emailService.sendMail(
    //   email,
    //   'Password Reset Request',
    //   `Please use the following link to reset your password: ${resetUrl}`
    // );

    // return { message: 'Password reset link has been sent to your email.' };
    
  }

  async resetPassword(userData: ResetPasswordDto) {
    const { email, newPassword } = userData;

    const user = await this.userRepo.findOne({ where: { email } });

    // if (!user || user.resetTokenExpires < new Date()) {
    //   throw new HttpException('Invalid or expired reset token', HttpStatus.UNAUTHORIZED);
    // }

    user.password = await bcrypt.hash(newPassword, 10);
    // user.resetToken = null;
    // user.resetTokenExpires = null;
    await this.userRepo.save(user);

    return { message: 'Password has been reset successfully.' };
  }

  async regenerateOtp(userData:RegenerateOtpDto){
    const { email } = userData;

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }    
    
    if (user.status == 'OTP_VERIFIED') {
      throw new HttpException('You are already verified', HttpStatus.UNAUTHORIZED);
    }

    const otp = this.generateAuthCode();
    const otpExpiry = addMinutes(new Date(), 5);

    // Send the authentication code via email
    await this.emailService.sendMail(
      userData.email,
      'Your Authentication Code',
      `Your authentication code is: ${otp}`
    );

    user.otpexpiry = otpExpiry;
    user.otp = otp;
    user.status = 'PENDING_VERIFICATION';
    await this.userRepo.save(user);

    return {
      message: 'OTP is sent to your email successfully.',
    };
  }
  
}
