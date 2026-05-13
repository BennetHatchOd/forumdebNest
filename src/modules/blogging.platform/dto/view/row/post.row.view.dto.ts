import { Rating } from '../../enum/rating.enum';

export class PostRowDto {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    createdAt: Date;
    deletedAt: Date;
    blogId: number;
    blogName: string;
    likesCount: number
    dislikesCount: number;
    myStatus: Rating;
    newestLikes: {
        addedAt: string,
        userId: string,
        login: string}[];
}
