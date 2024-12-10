import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class Pageable {
  @IsOptional()
  @Transform((field) => Number(field.value))
  @IsNumber()
  @Min(0, { message: 'Value must not be negative' })
  limit: number = 20;

  @IsOptional()
  @Transform((field) => Number(field.value))
  @IsNumber()
  @Min(0, { message: 'Value must not be negative' })
  page: number = 1;
}
