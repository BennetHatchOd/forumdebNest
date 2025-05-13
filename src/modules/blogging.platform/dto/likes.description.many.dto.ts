import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';

export class LikesDescriptionManyDto {
    targetIds: string[];
    ownerId: string|null;
    targetType: LikeTarget;
}