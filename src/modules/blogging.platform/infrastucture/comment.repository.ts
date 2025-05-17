import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../domain/comment.entity';
import { Types } from 'mongoose';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { PostDocument } from '@modules/blogging.platform/domain/post.entity';

@Injectable()
export class CommentRepository {

    constructor(@InjectModel(Comment.name) private CommentModel: CommentModelType) {}
    

    async getCommentById(commentId: string): Promise<CommentDocument> {
        if (!Types.ObjectId.isValid(commentId))
            throw new DomainException({
                message: "Comment not found",
                code: DomainExceptionCode.NotFound,
            });

        const searchItem: CommentDocument | null = await this.CommentModel.findOne({
                                                                            _id: new Types.ObjectId(commentId),
                                                                            deleteAt: null
                                                                        });
        if(!searchItem)
            throw new DomainException({
                message: "Comment not found",
                code: DomainExceptionCode.NotFound,
            });

        return searchItem
    }

    async isExist(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id))
            return false;

        const searchItem: PostDocument | null = await this.CommentModel.findOne({
                _id: new Types.ObjectId(id),
                deleteAt: null},
            {
                projection:{ _id: 1}
            });
        if (!searchItem)
            return false;

        return true;
    }

    async save(changedItem: CommentDocument): Promise<void> {
        await changedItem.save();
    }
}
