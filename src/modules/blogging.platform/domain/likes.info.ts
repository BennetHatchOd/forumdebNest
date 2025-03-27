import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class LikesInfo {
    @Prop({ default: 0,
        min: 0,
        isInteger: true })
    likesCount: number;

    @Prop({ default: 0,
        min: 0,
        isInteger: true })
    dislikesCount: number;

    static createInstance(): LikesInfo {
        const like = new LikesInfo();
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
export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

LikesInfoSchema.loadClass(LikesInfo);