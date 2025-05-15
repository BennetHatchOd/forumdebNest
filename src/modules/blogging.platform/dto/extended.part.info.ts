import { LikeDocument } from '@modules/blogging.platform/domain/like.entity';

export class ExtendedPartInfo{
    targetId: string;
    newestLikes:{
        addedAt: string,
        userId: string,
        login: string}[]
}