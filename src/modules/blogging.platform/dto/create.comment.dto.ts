import { CommentInputDto } from './input/comment.input.dto';
import { CommentatorInfoViewDto } from '../../users-system/dto/view/commentator.info.view.dto';

export class CreateCommentDto{
    constructor(
        public postId: string,
        public content: string,
        public userId: string,
        public login: string
    ){}

    static createInstance(id: string,
                          createDto: CommentInputDto,
                          commentatorInfo: CommentatorInfoViewDto){
        const newComment = new this(id, createDto.content, commentatorInfo.userId, commentatorInfo.login);
        return newComment;
    }
}