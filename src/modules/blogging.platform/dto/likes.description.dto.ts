import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';

export class LikesDescriptionDto {
    targetId: string;
    ownerId: string|null;
    targetType: LikeTarget;
}