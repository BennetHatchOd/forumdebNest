import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostInputDto } from '../dto/input/post.input.dto';
import { PostFieldRestrict } from '../dto/field.restrictions';

@Schema({timestamps: true})
export class Post {
    @Prop({
        required: true,
        maxlength: PostFieldRestrict.titleMax,
        minlength: PostFieldRestrict.titleMin,
    })
    title: string;

    @Prop({
        required: true,
        maxlength: PostFieldRestrict.shortDescriptionMax,
    })
    shortDescription: string;

    @Prop({
        required: true,
        maxlength: PostFieldRestrict.contentMax,
    })
    content: string;

    createdAt: Date;

    @Prop({ required: true,})
    blogId: string;

    @Prop({ required: true,})
    blogName: string;

    @Prop({
        type: Date,
        default: null,
    })
    deletedAt:  Date | null;

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

    static createInstance(createDto: PostInputDto,
                                blogName: string,): PostDocument {

        const post = new this();
        post.title = createDto.title;
        post.shortDescription = createDto.shortDescription;
        post.content = createDto.content;
        post.blogId = createDto.blogId;
        post.blogName = blogName;

        return post as PostDocument;
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;

