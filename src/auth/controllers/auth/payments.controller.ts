import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
// import { StripeService } from 'src/auth/controllers/auth/payments.controller'; old method
import { ProcessPaymentDto } from 'src/auth/dto/process-payment.dto';
import { StripeService } from 'src/auth/services/auth/stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('process-payment')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    const result = await this.stripeService.processPayment(
      processPaymentDto.name,
      processPaymentDto.email,
      processPaymentDto.cardSource,
      processPaymentDto.productId,
    );
    return result;
  }
}
export { StripeService };

