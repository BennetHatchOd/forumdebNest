import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastucture/comment.repository';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentInputDto } from '../dto/input/comment.input.dto';
import { Comment, CommentDocument, CommentModelType } from '../domain/comment.entity';
import { UserQueryExternalRepository } from '../../users-system/infrastucture/query/user.query.external.repository';
import { CreateCommentDto } from '../dto/create/create.comment.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: CommentModelType,
        private commentRepository: CommentRepository,
        private userQueryExternalRepository: UserQueryExternalRepository,
    ) {}

    async create(postId: string, comment: CommentInputDto, userId: string): Promise<string> {

        const commentatorInfo = await this.userQueryExternalRepository.getLoginByUserId(userId)
        const createCommentDto: CreateCommentDto = CreateCommentDto.createInstance(postId, comment, commentatorInfo!);
        const newComment: CommentDocument = this.commentModel.createInstance(createCommentDto);
        await this.commentRepository.save(newComment);
        return newComment._id.toString();
    }
}
