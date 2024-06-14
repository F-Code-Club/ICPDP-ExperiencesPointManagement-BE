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
        const constraints = error.constraints;
        const constraintsArray = Object.keys(constraints).map(key => ({ [key]: constraints[key] }));
        return { [error.property]: constraintsArray };
      });
      const message = containsUsernameOrPasswordError 
        ? 'Username or password is incorrect'
        : 'Information is incorrect';
      throw new BadRequestException({ data: null, message: message }); // response the error of the request
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
