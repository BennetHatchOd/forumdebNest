import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CommentatorInfo, CommentatorInfoSchema } from './commentator.info';
import { LikesInfo, LikesInfoSchema } from './likes.info';
import { CommentFieldRestrict } from '../field.restrictions';
import { CommentInputDto } from '../dto/input/comment.input.dto';
import { CommentatorInfoViewDto } from '../../users-system/dto/view/commentator.info.view.dto';
import { CreateCommentDto } from '../dto/create.comment.dto';



@Schema({timestamps: true })
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

    delete() {
        if (this.deletedAt !== null) {
            throw new Error('Comment already deleted');
        }
        this.deletedAt = new Date();
    }
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
    static createInstance(createDto: CreateCommentDto): CommentDocument {

        const comment = new this();
        comment.content = createDto.content;
        comment.parentPostId = createDto.postId;
        comment.likesInfo = LikesInfo.createInstance()
        comment.commentatorInfo.userId = createDto.userId;
        comment.commentatorInfo.userLogin = createDto.login;

        return comment as CommentDocument;
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;

