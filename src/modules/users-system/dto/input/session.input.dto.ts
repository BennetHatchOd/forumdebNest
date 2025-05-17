import { IsMongoId, IsString } from 'class-validator';

export class SessionInputDto {
    @IsMongoId()
    userId: string;

    @IsString()
    deviceName:  string;

    @IsString()
    ip: string;
}
