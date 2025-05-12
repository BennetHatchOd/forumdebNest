import { Rating } from '../rating.enum';
import { LikeDetailsView } from './newest.likes.dto';

export type ExtendedLikesEntityView = {
    likesCount: number;
    dislikesCount: number;
    myStatus: Rating;
    newestLikes: Array<LikeDetailsView>;
};

