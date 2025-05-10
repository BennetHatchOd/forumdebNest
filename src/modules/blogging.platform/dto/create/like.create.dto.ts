import { Rating } from '@core/Rating.enum';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { LikeTarget } from '@modules/blogging.platform/dto/like.target.enum';

export class LikeCreateDto {
    @IsNotEmpty()
    @IsMongoId()
    targetId: string;

    @IsNotEmpty()
    @IsMongoId()
    ownerId: string;

    @IsNotEmpty()
    @IsEnum(Rating)
    rating: Rating;

    @IsNotEmpty()
    @IsEnum(LikeTarget)
    targetType: LikeTarget;
}