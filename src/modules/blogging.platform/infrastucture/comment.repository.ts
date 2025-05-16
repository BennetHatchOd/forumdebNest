import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../domain/comment.entity';
import { Types } from 'mongoose';

@Injectable()
export class CommentRepository {

    constructor(@InjectModel(Comment.name) private CommentModel: CommentModelType) {}
    

    async getCommentById(commentId: string): Promise<CommentDocument | null> {
        if (!Types.ObjectId.isValid(commentId)) return null;
        const searchItem: CommentDocument | null = await this.CommentModel.findOne({
                                                                            _id: new Types.ObjectId(commentId),
                                                                            deleteAt: null
                                                                        });
        return searchItem
    }

    async save(changedItem: CommentDocument): Promise<void> {
        await changedItem.save();
    }
}
