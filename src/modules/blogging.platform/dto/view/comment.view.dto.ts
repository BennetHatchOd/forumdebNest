import { CommentDocument } from '../../domain/comment.entity';

export class CommentViewDto {
    constructor(
        public id: string,
        public content: string,
        public commentatorInfo: CommentatorInfoType,
        public createdAt: string,
        //public likesInfo: LikesEntityViewType,
    ) {}

    static mapToView(item: CommentDocument): CommentViewDto {
        return {
            id: item._id.toString(),
            content: item.content,
            commentatorInfo: {
                userId: item.commentatorInfo.userId,
                userLogin: item.commentatorInfo.userLogin,
            },
            createdAt: item.createdAt.toString(),
        }
    }
}

export class CommentatorInfoType {
    constructor(
        public userId: string,
        public userLogin: string,
    ) {}
}
