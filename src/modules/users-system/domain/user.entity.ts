import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { USER_COLLECTION_NAME } from 'src/core/setting';
import { ConfirmEmail, ConfirmEmailSchema } from './confirm.email.entity';
import { UserInputDto } from '../dto/input/user.input.dto';

@Schema({ timestamps: true, collection: USER_COLLECTION_NAME })
export class User {
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 10,
    })
    login: string;

    @Prop({
        required: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    passwordHash: string;

    @Prop({
        default: false,
    })
    isConfirmEmail: boolean;

    @Prop({
        type: ConfirmEmailSchema,
        default: {},
    })
    confirmEmail: ConfirmEmail;

    createdAt: Date;

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;

    delete() {
        if (this.deletedAt !== null) {
            throw new Error('User already deleted');
        }
        this.deletedAt = new Date();
    }

    // edit(editData: UserInputDto) {
    //     // при обновлении емаил, требуется его подтвердить
    //     if(this.email != editData.email)
    //         this.isConfirmEmail = false;
    //     this.login = editData.login;
    //     this.email = editData.email;
    //     this.passwordHash = editData.password;
    // }

    static createInstance(dto: UserInputDto): UserDocument {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.passwordHash = dto.password;

        return user as UserDocument;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;