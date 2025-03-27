import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class BlogRepository {

    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}
    
    async findById(id: string): Promise<BlogDocument | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const searchItem: BlogDocument | null = await this.BlogModel.findOne({
                                                                            _id: new Types.ObjectId(id),
                                                                            deleteAt: null
                                                                        });
        return searchItem
    }

    async save(changedItem: BlogDocument): Promise<void> {
        await changedItem.save();
    }

}
