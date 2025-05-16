import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';

export class DeleteEntityDto {
    @IsNotEmpty()
    @IsMongoId()
    targetId: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}