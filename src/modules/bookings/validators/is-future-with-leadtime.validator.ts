import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureWithLeadTime(minutes: number, options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureWithLeadTime',
      target: object.constructor,
      propertyName,
      constraints: [minutes],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date) || isNaN(value.getTime())) return false;
          const [min] = args.constraints;
          const cutoff = new Date(Date.now() + min * 60 * 1000);
          return value.getTime() >= cutoff.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          const [min] = args.constraints;
          return `${args.property} must be at least ${min} minutes in the future`;
        },
      },
    });
  };
}
