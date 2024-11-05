import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/typeorm/entities/UserEntity';
import { TransactionsService } from 'src/transactions/services/transactions.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;    

    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private transactionsService: TransactionsService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        });
    }

  async processPayment(name: string, email: string, cardSource: string, productId: string) {
    try {        
        const productPrices = {
            [process.env.STRIPE_PRODUCT_500_ID]: parseInt(process.env.STRIPE_PRODUCT_500_PRICE, 10),
            [process.env.STRIPE_PRODUCT_100_ID]: parseInt(process.env.STRIPE_PRODUCT_100_PRICE, 10),
        };

        // Check if the productId is valid
        const amount = productPrices[productId];
        if (!amount) {
            throw new HttpException('Invalid product ID', HttpStatus.UNAUTHORIZED);
        }
    
        // Step 1: Create Customer
        const customer = await this.stripe.customers.create({
            name,
            email,
        });
    
        // Step 2: Attach Card Source to Customer
        const customerSource = await this.stripe.customers.createSource(customer.id, {
            source: cardSource,
        });
    
        // Step 3: Create Payment Intent
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: 'usd', // Adjust currency as needed
            customer: customer.id,
            payment_method: customerSource.id,
            off_session: true,
            confirm: true,
        });
        
        // Step 1: Find the user by email or some identifier
        const user = await this.userRepo.findOne({ where: { email } });

        if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
    
        user.stripe_customer_id = customer.id,
        user.stripe_card_id = customerSource.id,
        user.status = 'SUBSCRIPTION_VERIFIED';
        await this.userRepo.save(user);

        await this.transactionsService.createTransaction(
            user,
            paymentIntent.id,
            paymentIntent.amount / 100,
            'payment',
            paymentIntent.status,
            paymentIntent.currency
          );

        // Return relevant information
        return {
            customerId: customer.id,
            cardId: customerSource.id,
            paymentIntentId: paymentIntent.id,
            paymentstatus: paymentIntent.status,
            status: 'SUBSCRIPTION_VERIFIED',
        };
    } catch (error) {
      console.error('Stripe API error:', error);
      throw new Error('Payment processing failed');
    }
  }
  


//   async processPayment(name: string, email: string, cardToken: string, amount: number) {
//     // Step 1: Create Customer
//     const customer = await this.stripe.customers.create({
//       name,
//       email,
//     });

//     // const token = await this.stripe.tokens.create({
//     //     card: {
//     //       number: '4242424242424242',
//     //       exp_month: '5',
//     //       exp_year: '2026',
//     //       cvc: '314',
//     //     },
//     //   });

//     // console.log(token)

//     const customerSource = await this.stripe.customers.createSource(
//         customer.id,
//         {
//           source: 'tok_visa',
//         }
//       );
//     //   return customerSource;

//     // Step 2: Attach Card to Customer
//     const paymentMethod = await this.stripe.paymentMethods.attach(cardToken, {
//       customer: customer.id,
//     });

//     // // Set the payment method as the default for the customer
//     await this.stripe.customers.update(customer.id, {
//       invoice_settings: { default_payment_method: paymentMethod.id },
//     });

//     // // Step 3: Create Payment Intent
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount,
//       currency: 'usd', // Adjust currency as needed
//       customer: customer.id,
//       payment_method: paymentMethod.id,
//       off_session: true,
//       confirm: true,
//     });

//     // // Return relevant information
//     return {
//       customerId: customer.id,
//       cardId: paymentMethod.id,
//       paymentIntentId: paymentIntent.id,
//       status: paymentIntent.status,
//     };
//   }
  
}
