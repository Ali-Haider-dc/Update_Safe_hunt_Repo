import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  import { getRepository } from 'typeorm';
  
  export function IsUnique(entity: Function, property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isUnique',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          async validate(value: any, args: ValidationArguments) {
            if (!value) return true;
            const repository = getRepository(entity);
            const condition = {};
            condition[property] = value;
            const record = await repository.findOne(condition);
            return !record;
          },
          defaultMessage(args: ValidationArguments) {
            return `${propertyName} already exists`;
          },
        },
      });
    };
  }