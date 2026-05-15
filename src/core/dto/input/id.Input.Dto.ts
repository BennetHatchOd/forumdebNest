import { IsNumberString } from 'class-validator';

export class IdInputDto {
    @IsNumberString()
    id: string;
}