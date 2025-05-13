import { Rating } from '../enum/rating.enum';

export type LikesInfoViewDto = {
    likesCount: number;
    dislikesCount: number;
    myStatus: Rating;
};