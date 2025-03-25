import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.entity';
import { PostInputDto } from '../dto/input/post.input.dto';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';

@Schema({id: false,
})
export class LikeDetails {
    @Prop({ required: true, })
    addedAt: string;

    @Prop({ required: true, })
    userId: string;

    @Prop({ required: true, })
    login: string;
}

const LikeDetailsSchema = SchemaFactory.createForClass(LikeDetails);

@Schema({id: false,
     })
export class NewestLikesArray {
    @Prop({ type: [LikeDetailsSchema], default: [], })
    newestLikes: LikeDetails[];

    //
    // deleteLike(userId: string) {}
    // если лайк в массиве, делаем запрос к базе на 3 последние лайка
    //
    // newLike(user: LikeDetailsDto) {}
    // проверяем время лайка, если он новее последнего, то вставляем его
    // последний удаляем
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikesArray);

