import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export interface GetRequestReturn<T> {
  count: number;
  data: T;
}

export class PaginatePropsType extends PaginatePropsMixin(class {} as any) {}

export function PaginatePropsMixin<
  T extends { new (...args: any[]): Record<string, unknown> },
>(extend: T) {
  class _PaginatePropsType extends extend {
    [x: string]: any;

    @ApiPropertyOptional({
      type: Number,
      example: 1,
      description: 'The page number, Required if all is false',
    })
    @ValidateIf((o: PaginatePropsType) => Boolean(!o.all))
    @Transform(({ value }: { value: unknown }) => {
      if (value === undefined || value === null) return undefined;
      const num = Number(value);
      return isNaN(num) ? value : num;
    })
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({
      type: Number,
      example: 25,
      description: 'The page size, Required if all is false',
    })
    @ValidateIf((o: PaginatePropsType) => Boolean(!o.all))
    @Transform(({ value }: { value: unknown }) => {
      if (value === undefined || value === null) return undefined;
      const num = Number(value);
      return isNaN(num) ? value : num;
    })
    @IsNumber()
    pageSize?: number;

    @ApiPropertyOptional({
      type: Boolean,
      example: false,
      default: false,
      description: 'Whether to return all results',
    })
    @IsOptional()
    @Transform(({ value }: { value: unknown }) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
      }
      return Boolean(value);
    })
    @IsBoolean()
    all?: boolean = false;
  }
  return _PaginatePropsType;
}
