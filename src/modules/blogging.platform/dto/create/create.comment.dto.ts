import { CommentInputDto } from '../input/comment.input.dto';
import { CommentatorInfoViewDto } from '../../../users-system/dto/view/commentator.info.view.dto';

export class CreateCommentDto{
    constructor(
        public postId: number,
        public content: string,
        public userId: number,
    ){}

    static createInstance(postId: number,
                          createDto: CommentInputDto,
                          userId: number
    ){

        const newComment = new this(postId, createDto.content, userId);
        return newComment;
    }
}