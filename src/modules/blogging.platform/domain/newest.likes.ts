import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({_id: false,
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

