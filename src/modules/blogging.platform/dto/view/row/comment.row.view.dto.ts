import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';

export class CommentRowViewDto {
        public id: number;
        public content: string;
        public createdAt: Date;
        userId: number;
        userLogin: string;
        likesCount: number;
        dislikesCount: number;
        myStatus: Rating
}

