import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class SessionInputDto {
    @IsNumber()
    @Min(1)
    userId: number;

    @IsString()
    deviceName:  string;

    @IsString()
    ip: string;
}
