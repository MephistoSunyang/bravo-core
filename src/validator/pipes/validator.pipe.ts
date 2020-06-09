import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Logger } from '../../logger';

@Injectable()
export class ValidatorPipe implements PipeTransform {
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const json = plainToClass(metatype, value, {
      strategy: 'excludeAll',
      enableCircularCheck: true,
      enableImplicitConversion: true,
    });
    const errors = await validate(json);
    if (errors.length > 0) {
      Logger.error(errors.toString(), 'ValidatorModule ValidatorPipe Error');
      throw new BadRequestException('validation failed!');
    }
    return value;
  }
}
