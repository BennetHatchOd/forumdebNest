import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';

export class LikeCreateDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    targetId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    ownerId: number;

    @IsNotEmpty()
    @IsEnum(Rating)
    rating: Rating;

    @IsNotEmpty()
    @IsEnum(LikeTarget)
    targetType: LikeTarget;
}