import { Rating } from '../rating.enum';

export type LikesInfoViewDto = {
    likesCount: number;
    dislikesCount: number;
    myStatus: Rating;
};