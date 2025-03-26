import { Rating } from '../rating.enum';

export type ExtendedLikesEntityView = {
    likesCount: number;
    dislikesCount: number;
    myStatus: Rating;
    newestLikes: Array<LikeDetailsView>;
};

export type LikeDetailsView = {
    addedAt: string;
    userId: string;
    login: string;
}