import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted');
    }
    
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const containsUsernameOrPasswordError = errors.some(error =>
        ['username', 'password'].includes(error.property)
      );
      const formattedErrors = errors.map(error => {
        if (error.constraints) {
          const constraintsArray = Object.keys(error.constraints).map(key => error.constraints[key]);
          return { [error.property]: constraintsArray };
        } else {
          return { [error.property]: ['Validation error'] };
        }
      });
      const message = containsUsernameOrPasswordError 
        ? 'Username or password is incorrect'
        : formattedErrors.map(error => {
          const firstKey = Object.keys(error)[0];
          const constraintsArray = error[firstKey];
          if (Array.isArray(constraintsArray) && constraintsArray.length > 0) {
            return constraintsArray[0];
          }
          return 'Validation error';
        }).join(', ');
        
      throw new BadRequestException({ data: null, message: message }); // response the error of the request
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
