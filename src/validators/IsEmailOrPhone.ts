import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsEmailOrPhone(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isEmailOrPhone',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const { email, phonenumber } = args.object as any;
            return (email && email.length > 0) || (phonenumber && phonenumber.length > 0);
          },
          defaultMessage(args: ValidationArguments) {
            return 'Either email or phone number must be provided';
          },
        },
      });
    };
  }