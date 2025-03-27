import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';

@Injectable()
export class PostRepository {

    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}
    
    async findById(id: string): Promise<PostDocument | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const searchItem: PostDocument | null = await this.PostModel.findOne({
                                                                            _id: new Types.ObjectId(id),
                                                                            deleteAt: null
                                                                        });
        return searchItem
    }

    async save(changedItem: PostDocument): Promise<void> {
        await changedItem.save();
    }

}
