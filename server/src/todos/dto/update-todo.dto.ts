import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({
    description: 'Updated title of the TODO item',
    example: 'Updated project documentation',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the TODO item',
    example: 'Updated comprehensive documentation for the API',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated done status of the TODO item',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
