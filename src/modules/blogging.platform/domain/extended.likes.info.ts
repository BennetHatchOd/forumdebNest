import { NewestLikesArray, NewestLikesSchema } from './newest.likes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesInfo } from './likes.info';

@Schema({ _id: false })
export class ExtendedLikesInfo extends LikesInfo{

    @Prop({ type: NewestLikesSchema,
        required: true })
    newestLikes: NewestLikesArray;

    static createInstance(): ExtendedLikesInfo {
        const like = new this();
        like.newestLikes = new NewestLikesArray()

        return like;
    }
    //
    // deleteLike(userId: string) {
    //  this.likesCount--
    //  удаляем лайк из newest
    // }
    //
    //
    // newLike(user: LikeDetailsDto) {}
    //     this.likesCount++
    //     добавляем лайк в newest
    // }
    // проверяем время лайка, если он новее последнего, то вставляем его
    // последний удаляем
}
export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);

ExtendedLikesInfoSchema.loadClass(ExtendedLikesInfo);