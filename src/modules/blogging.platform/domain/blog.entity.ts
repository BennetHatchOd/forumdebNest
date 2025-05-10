import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogInputDto } from '../dto/input/blog.input.dto';
import { BlogFieldRestrict } from '../dto/field.restrictions';

@Schema({ timestamps: true,
})
export class Blog {
    @Prop({
        required: true,
        minlength: BlogFieldRestrict.nameMin,
        maxlength: BlogFieldRestrict.nameMax,
    })
    name: string;

    @Prop({
        required: true,
        maxlength: BlogFieldRestrict.descriptionMax,
        minlength: BlogFieldRestrict.descriptionMin,
    })
    description: string;

    createdAt: Date;

    @Prop({
        default: false,
    })
    isMembership: boolean;

    @Prop({
        required: true,
        maxlength: BlogFieldRestrict.websiteUrlMax,
        minlength: BlogFieldRestrict.websiteUrlMin,
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