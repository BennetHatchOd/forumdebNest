import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Injectable()
export class PostRepository {

    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}
    
    async findById(id: string): Promise<PostDocument> {
        if (!Types.ObjectId.isValid(id))
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound});

        const searchItem: PostDocument | null = await this.PostModel.findOne({
                                                                            _id: new Types.ObjectId(id),
                                                                            deleteAt: null
                                                                        });
        if (!searchItem)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound});

        return searchItem
    }

    async isExist(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id))
            return false;

        const searchItem: PostDocument | null = await this.PostModel.findOne({
            _id: new Types.ObjectId(id),
            deleteAt: null},
            {
                projection:{ _id: 1}
            });
        if (!searchItem)
            return false;

        return true;
    }

    async save(changedItem: PostDocument): Promise<void> {
        await changedItem.save();
    }

}
