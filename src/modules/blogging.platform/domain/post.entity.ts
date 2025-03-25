import { POST_COLLECTION_NAME } from 'src/core/setting';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostInputDto } from '../dto/input/post.input.dto';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { BlogViewDto } from '../dto/view/blog.view.dto';
import { ExtendedLikesInfo, ExtendedLikesInfoSchema } from './extended.likes.info';

@Schema({timestamps: true,
    collection: POST_COLLECTION_NAME })
export class Post {
    @Prop({
        required: true,
        maxlength: 30,
    })
    title: string;

    @Prop({
        required: true,
        maxlength: 100,
    })
    shortDescription: string;

    @Prop({
        required: true,
        maxlength: 1000,
    })
    content: string;

    createdAt: Date;

    @Prop({ required: true,})
    blogId: string;

    @Prop({ required: true,})
    blogName: string;

    @Prop({ type: Date, default: null, })
    deletedAt:  Date | null;

    @Prop({ type: ExtendedLikesInfoSchema, required: true,})
    extendedLikesInfo:  ExtendedLikesInfo;


    delete() {
        if (this.deletedAt !== null) {
            throw new Error('Post already deleted');
        }
        this.deletedAt = new Date();
    }

    async update(change: PostInputDto,
           blogQueryRepository: BlogQueryRepository,) {
        this.title = change.title;
        this.shortDescription = change.shortDescription;
        this.content = change.content;
        // проверяем ид на существование и находим имя
        this.blogId = change.blogId;
        const blogParent: BlogViewDto|null
            = await blogQueryRepository.findByIdWitoutCheck(change.blogId);
        if(!blogParent)
            throw new Error('No blog found with this id');
        this.blogName = blogParent.name;
    }

    static async createInstance(createDto: PostInputDto,
          blogQueryRepository: BlogQueryRepository,): Promise<PostDocument> {

        const post = new this();
        post.title = createDto.title;
        post.shortDescription = createDto.shortDescription;
        post.content = createDto.content;
        post.blogId = createDto.blogId;
        const blogParent: BlogViewDto|null
            = await blogQueryRepository.findByIdWitoutCheck(createDto.blogId);
        if(!blogParent)
            throw new Error('No blog found with this id');
        post.blogName = blogParent.name;
        post.extendedLikesInfo = ExtendedLikesInfo.createInstance()

        return post as PostDocument;
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;

