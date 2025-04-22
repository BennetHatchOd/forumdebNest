import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastucture/comment.repository';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentInputDto } from '../dto/input/comment.input.dto';
import { Comment, CommentDocument } from '../domain/comment.entity';
import { UserQueryExternalRepository } from '../../users-system/infrastucture/query/user.query.external.repository';
import { CreateCommentDto } from '../dto/create.comment.dto';

@Injectable()
export class CommentService {
    constructor(
        private commentRepository: CommentRepository,
        private userQueryExternalRepository: UserQueryExternalRepository,
    ) {}

    async create(postId: string, comment: CommentInputDto, userId: string): Promise<string> {

        const commentatorInfo = await this.userQueryExternalRepository.findNameById(userId)
        const createCommentDto: CreateCommentDto = CreateCommentDto.createInstance(postId, comment, commentatorInfo!);
        const newComment: CommentDocument = Comment.createInstance(createCommentDto);
        await this.commentRepository.save(newComment);
        return newComment._id.toString();
    }
}
