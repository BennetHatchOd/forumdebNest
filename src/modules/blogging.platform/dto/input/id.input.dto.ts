import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceIdInputDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}