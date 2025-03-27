import { POST_COLLECTION_NAME } from 'src/core/setting';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostInputDto } from '../dto/input/post.input.dto';
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
           blogName: string,) {
        this.title = change.title;
        this.shortDescription = change.shortDescription;
        this.content = change.content;
        this.blogId = change.blogId;
        this.blogName = blogName;
    }

    static async createInstance(createDto: PostInputDto,
                                blogName: string,): Promise<PostDocument> {

        const post = new this();
        post.title = createDto.title;
        post.shortDescription = createDto.shortDescription;
        post.content = createDto.content;
        post.blogId = createDto.blogId;
        post.blogName = blogName;
        post.extendedLikesInfo = ExtendedLikesInfo.createInstance()

        return post as PostDocument;
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;

