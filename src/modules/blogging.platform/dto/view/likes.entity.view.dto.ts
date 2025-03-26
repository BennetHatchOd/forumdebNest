import { Rating } from '../rating.enum';

export type LikesEntityViewDto = {
    likesCount: number;
    dislikesCount: number;
    myStatus: Rating;
};