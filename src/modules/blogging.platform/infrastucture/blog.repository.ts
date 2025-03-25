import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class BlogRepository {

    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}
    
    // async isExist(id: string): Promise<boolean> {
    //     if (!Types.ObjectId.isValid(id)) return false;
    //     const isExist: number = await this.BlogModel.countDocuments({
    //                                                         _id: new Types.ObjectId(id),
    //                                                         deletedAt: null,
    //                                                     });
    //     return isExist != 0 ? true : false;
    // }

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

    async clear(): Promise<void> {
        await this.BlogModel.deleteMany();

        if ((await this.BlogModel.countDocuments({})) != 0)
            throw new Error("the server can\'t clear blogCollection");
        return;
    }

    // mapDbToWork(item: BlogDocument): BlogType {
    //     return {
    //         id:             item._id.toString(),
    //         name:           item.name,
    //         description:    item.description,
    //         createdAt:      item.createdAt,
    //         isMembership:   item.isMembership,
    //         websiteUrl:     item.websiteUrl,
    //         deletedAt:      item.deletedAt
    //     };
    // }
}
