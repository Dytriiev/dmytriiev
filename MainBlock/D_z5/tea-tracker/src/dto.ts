import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Length, Max, Min } from 'class-validator';
import * as z from 'zod';
import { Tea } from './entities';

export const BrewDTOSchema = z.object({
  name: z
    .string()
    .min(2, 'Назва  повинна містити щонайменше 3 символи')
    .max(10, 'Назва  не повинна перевищувати 40 символів'),
  origin: z.string().min(2, 'min 2').max(10, 'max 10'),

  rating: z
    .number()
    .min(1, 'Мінімальна оцінка - 1')
    .max(10, 'Максимальна оцінка - 10')
    .optional(),

  brewTemp: z.number().min(60, 'min 60').max(100, 'maxTemp 100').optional(),

  notes: z
    .string()
    .max(200, 'Нотатки не повинні перевищувати 200 символів')
    .optional(),
});
export type BrewDTO = z.infer<typeof BrewDTOSchema>;

export const UpdateDTOSchema = BrewDTOSchema.partial();
export type UpdateDTO = z.infer<typeof UpdateDTOSchema>;

export class TeaDto implements BrewDTO {
  @ApiProperty({
    example: 'name',
  })
  @Length(2, 10)
  name: string;

  @ApiProperty({
    example: 'Origin',
  })
  origin: string;

  @ApiPropertyOptional({
    example: '5',
  })
  @IsOptional()
  @IsInt({ message: 'Рейтинг має бути цілим числом' })
  @Min(1, { message: 'Рейтинг мае бути не меньше 1' })
  @Max(10, { message: 'Рейтинг має бути не більше 10' })
  rating?: number;

  @ApiPropertyOptional({
    example: '90',
  })
  @IsOptional()
  @IsInt({ message: 'Температура має бути цілим числом' })
  @Min(60, { message: 'Температура мае бути не меньше 60' })
  @Max(100, { message: 'Температура має бути не більше 100' })
  brewTemp?: number;

  @ApiPropertyOptional({
    example: 'Very good',
  })
  @IsOptional()
  notes?: string;
}

export class GetTeaDto extends Tea {
  @ApiProperty({
    example: 'trbdju',
    description: 'Уникальный идентификатор чая',
  })
  declare id: string;

  @ApiProperty({
    example: 'Эрл Грей',
    description: 'Название чая',
  })
  declare name: string;

  @ApiPropertyOptional({
    example: 4.5,
    description: 'Рейтинг чая (от 1 до 5)',
    minimum: 1,
    maximum: 5,
    nullable: true,
  })
  declare rating?: number;

  @ApiProperty({
    example: 'Китай',
    description: 'Страна происхождения чая',
  })
  declare origin: string;

  @ApiPropertyOptional({
    example: 85,
    description: 'Рекомендуемая температура заваривания (°C)',
    minimum: 60,
    maximum: 100,
    nullable: true,
  })
  declare brewTemp?: number;

  @ApiPropertyOptional({
    example: 'Лучший чай для утра',
    description: 'Дополнительные заметки о чае',
    maxLength: 200,
    nullable: true,
  })
  declare notes?: string;
}

export class PaginateQuery {
  @ApiPropertyOptional()
  minRating?: string;

  @ApiPropertyOptional()
  page?: string;

  @ApiPropertyOptional()
  limit?: string;
}

export class PaginatedResponse {
  @ApiProperty()
  data?: GetTeaDto[];
  @ApiProperty()
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
