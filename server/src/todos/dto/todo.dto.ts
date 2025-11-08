import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty({
    description: 'Unique identifier of the TODO item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the TODO item',
    example: 'Complete project documentation',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the TODO item',
    example: 'Write comprehensive documentation for the API',
  })
  description?: string;

  @ApiProperty({
    description: 'Completion status of the TODO item',
    example: false,
    default: false,
  })
  done: boolean;

  @ApiProperty({
    description: 'Date and time when the TODO item was created',
    example: '2025-11-08T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the TODO item was last updated',
    example: '2025-11-08T10:00:00.000Z',
  })
  updatedAt: Date;
}
