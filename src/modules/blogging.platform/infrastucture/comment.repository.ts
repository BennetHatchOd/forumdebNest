import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';

@Injectable()
export class CommentRepository {

    constructor(@InjectModel(Comment.name) private CommentModel: CommentModelType) {}
    
    //
    // async findById(id: string): Promise<CommentDocument | null> {
    //     if (!Types.ObjectId.isValid(id)) return null;
    //     const searchItem: CommentDocument | null = await this.CommentModel.findOne({
    //                                                                         _id: new Types.ObjectId(id),
    //                                                                         deleteAt: null
    //                                                                     });
    //     return searchItem
    // }
    //
    // async save(changedItem: CommentDocument): Promise<void> {
    //     await changedItem.save();
    // }

    async clear(): Promise<void> {
        await this.CommentModel.deleteMany();

        if ((await this.CommentModel.countDocuments({})) != 0)
            throw new Error("the server can\'t clear blogCollection");
        return;
    }

}
