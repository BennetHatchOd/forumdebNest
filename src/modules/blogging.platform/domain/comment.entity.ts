import { COMMENT_COLLECTION_NAME } from 'src/core/setting';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CommentatorInfo, CommentatorInfoSchema } from './commentator.info';
import { LikesInfo, LikesInfoSchema } from './likes.info';
import { CommentFieldRestrict } from '../field.restrictions';



@Schema({timestamps: true,
    collection: COMMENT_COLLECTION_NAME })
export class Comment {
    @Prop({
        required: true,
        maxlength: CommentFieldRestrict.contentMax,
        minlength: CommentFieldRestrict.contentMin,
    })
    content: string;

    @Prop({
        required: true,
    })
    parentPostId: string;

    createdAt: Date;

    @Prop({
        type: LikesInfoSchema,
        required: true,})
    likesInfo: LikesInfo;

    @Prop({
        type: CommentatorInfoSchema,
        required: true,
    })
    commentatorInfo: CommentatorInfo;

     @Prop({
         type: Date,
         default: null,
     })
    deletedAt:  Date | null;

    // delete() {
    //     if (this.deletedAt !== null) {
    //         throw new Error('Comment already deleted');
    //     }
    //     this.deletedAt = new Date();
    // }
    //
    // async update(change: PostInputDto,
    //              blogQueryRepository: BlogQueryRepository,) {
    //     this.title = change.title;
    //     this.shortDescription = change.shortDescription;
    //     this.content = change.content;
    //     // проверяем ид на существование и находим имя
    //     this.blogId = change.blogId;
    //     const blogParent: BlogViewDto|null
    //         = await blogQueryRepository.findByIdWitoutCheck(change.blogId);
    //     if(!blogParent)
    //         throw new Error('No blog found with this id');
    //     this.blogName = blogParent.name;
    // }
    //
    // static async createInstance(createDto: PostInputDto,
    //                             blogQueryRepository: BlogQueryRepository,): Promise<PostDocument> {
    //
    //     const post = new this();
    //     post.title = createDto.title;
    //     post.shortDescription = createDto.shortDescription;
    //     post.content = createDto.content;
    //     post.blogId = createDto.blogId;
    //     const blogParent: BlogViewDto|null
    //         = await blogQueryRepository.findByIdWitoutCheck(createDto.blogId);
    //     if(!blogParent)
    //         throw new Error('No blog found with this id');
    //     post.blogName = blogParent.name;
    //
    //     return post as PostDocument;
    // }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;

