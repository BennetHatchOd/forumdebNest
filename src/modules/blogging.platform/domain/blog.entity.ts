import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BLOG_COLLECTION_NAME } from 'src/core/setting';
import { BlogInputDto } from '../dto/input/blog.input.dto';

@Schema({ timestamps: true,
    collection: BLOG_COLLECTION_NAME })
export class Blog {
    @Prop({
        required: true,
        minlength: 1,
        maxlength: 10,
    })
    name: string;

    @Prop({
        required: true,
        maxlength: 500,
    })
    description: string;

    createdAt: Date;

    @Prop({ required: true,})
    isMembership: boolean;

    @Prop({
        required: true,
        maxlength: 100,
    })
    websiteUrl: string;

    @Prop({ type: Date, default: null, })
    deletedAt:  Date | null;

    delete() {
        if (this.deletedAt !== null) {
            throw new Error('Blog already deleted');
        }
        this.deletedAt = new Date();
    }

    update(change: BlogInputDto) {
        this.name = change.name;
        this.description = change.description;
        this.websiteUrl = change.websiteUrl;
    }

    static createInstance(dto: BlogInputDto): BlogDocument {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;

        return blog as BlogDocument;
      }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);

//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;

//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;