import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class IdInputDto {
    @Type(() => Number) // 👈 важно!
    @IsNumber()
    @Min(1)
    id: number;
}