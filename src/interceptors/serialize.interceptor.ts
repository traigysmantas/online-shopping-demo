import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serialize<T extends ClassConstructor<unknown>>(dto: T) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T extends ClassConstructor<unknown>>
  implements NestInterceptor
{
  constructor(private dto: T) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: T) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
