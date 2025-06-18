import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteEntityDto {
    @IsNotEmpty()
    @IsMongoId()
    targetId: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}