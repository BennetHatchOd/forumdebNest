import { Rating } from '../../../../core/Rating.enum';

export type LikesEntityViewDto = {
    likesCount: number;
    dislikesCount: number;
    myStatus: Rating;
};