import { LikeTarget } from '@modules/blogging.platform/dto/like.target.enum';

export class LikesInfoDto {
    targetId: string;
    ownerId: string|null;
    targetType: LikeTarget;
}