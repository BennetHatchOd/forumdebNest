import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { HydratedDocument, Model } from 'mongoose';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';



@Schema({ timestamps: true })
export class Like {
    // какого типа сущность, которой поставлена оценка
    @Prop({
        required: true,
        enum: LikeTarget,
        type: String
    })
    targetType: LikeTarget;

    // id сущность, которой поставлена оценка
    @Prop({
        required: true,
    })
    targetId: string;

    createdAt: Date;

    // кто поставил оценку
    @Prop({
        required: true,
    })
    ownerId: string;

    @Prop({
        required: true,
        type: String,
        enum: Rating,
    })
    rating: Rating;

    static createInstance(dto: LikeCreateDto): LikeDocument {
        const like = new this();
        like.targetId = dto.targetId;
        like.ownerId = dto.ownerId;
        like.rating = dto.rating;
        like.targetType = dto.targetType

        return like as LikeDocument;
    }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

//регистрирует методы сущности в схеме
LikeSchema.loadClass(Like);

//Типизация документа
export type LikeDocument = HydratedDocument<Like>;

//Типизация модели + статические методы
export type LikeModelType = Model<LikeDocument> & typeof Like;