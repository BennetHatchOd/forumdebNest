import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { TrimLength } from '@core/decorators/trim.string.length';
import { CommentFieldRestrict } from '@modules/blogging.platform/dto/field.restrictions';

export class EditCommentDto {
    @IsNotEmpty()
    @IsMongoId()
    targetId: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;

    @TrimLength(CommentFieldRestrict.contentMin, CommentFieldRestrict.contentMax)
    content: string;
}