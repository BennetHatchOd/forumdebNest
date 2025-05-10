import { Rating } from '@core/Rating.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class LikeInputDto {
    @IsNotEmpty()
    @IsEnum(Rating,{
        message: "LikeStatus must be {Like, Dislike, None}",
    })
    rating: Rating;
}