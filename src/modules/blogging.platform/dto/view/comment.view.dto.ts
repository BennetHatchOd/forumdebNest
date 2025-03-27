import { CommentDocument } from '../../domain/comment.entity';
import { Rating } from '../../../../core/Rating.enum';

export class CommentViewDto {
        public id: string;
        public content: string;
        public createdAt: string;
        public commentatorInfo: {
            userId: string,
            userLogin: string,
        }
        public likesInfo:  {
            likesCount: number,
            dislikesCount: number,
            myStatus: Rating,
        };

    constructor(item: CommentDocument, likeStatus: Rating) {
        this.id = item._id.toString();
        this.content = item.content;
        this.createdAt = item.createdAt.toString();
        this.commentatorInfo = {
            userId: item.commentatorInfo.userId,
            userLogin: item.commentatorInfo.userLogin,
        };
        this.likesInfo =  {
            likesCount: item.likesInfo.likesCount,
                dislikesCount: item.likesInfo.dislikesCount,
                myStatus: likeStatus,
        }
    }

    static mapToView(item: CommentDocument, likeStatus: Rating): CommentViewDto {
        return new CommentViewDto(item, likeStatus)
    }
}

