import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NEWPASSWORD_COLLECTION_NAME, TIME_LIFE_PASSWORD_CODE } from '../../../core/setting';
import { HydratedDocument, Model } from 'mongoose';
import {v4 as uuidv4} from 'uuid'
import { add } from 'date-fns';
import { UserFieldRestrict } from '../field.restrictions';

@Schema({ collection: NEWPASSWORD_COLLECTION_NAME })
export class NewPassword {
    @Prop({
        required: true,
    })
    userId: string;

    @Prop({
        required: true,
        length: UserFieldRestrict.codeLength,
    })
    code: string;

    @Prop({
        required: true,
    })
    expirationTime: Date;

    static createInstance(userId: string): NewPasswordDocument {
        const newPassword = new this();
        newPassword.userId = userId;
        newPassword.code = uuidv4();
        newPassword.expirationTime = add(new Date(), { hours: TIME_LIFE_PASSWORD_CODE});

        return newPassword as NewPasswordDocument;
    }
}

export const NewPasswordSchema = SchemaFactory.createForClass(NewPassword);

//регистрирует методы сущности в схеме
NewPasswordSchema.loadClass(NewPassword);

//Типизация документа
export type NewPasswordDocument = HydratedDocument<NewPassword>;

//Типизация модели + статические методы
export type NewPasswordModelType = Model<NewPasswordDocument> & typeof NewPassword;