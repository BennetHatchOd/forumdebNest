// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
// import { UserInputDto } from '../dto/input/user.input.dto';
// import { UserFieldRestrict } from '../field.restrictions';
// import { add, isBefore } from 'date-fns';
// import { v4 as uuidv4 } from 'uuid';
//
// @Schema({ timestamps: true })
// export class User {
//     @Prop({
//         unique: true,
//         required: true,
//         minlength: UserFieldRestrict.loginMin,
//         maxlength: UserFieldRestrict.loginMax,
//     })
//     login: string;
//
//     @Prop({
//         unique: true,
//         required: true,
//     })
//     email: string;
//
//     @Prop({
//         required: true,
//     })
//     passwordHash: string;
//
//     @Prop({
//         default: true,
//     })
//     isConfirmEmail: boolean;
//
//     @Prop({
//         type: ConfirmEmailSchema,
//         default: {},
//     })
//     confirmEmail: ConfirmEmail;
//
//     createdAt: Date;
//
//     @Prop({ type: Date, default: null })
//     deletedAt: Date | null;
//
//     delete() {
//         if (this.deletedAt !== null) {
//             throw new Error('User already deleted');
//         }
//         this.deletedAt = new Date();
//     }
//
//     confirmationEmail(code: string):boolean {
//         if (this.confirmEmail.code === code
//             && isBefore(new Date(), this.confirmEmail.expirationTime)
//             && !this.isConfirmEmail && !this.deletedAt) {
//                 this.isConfirmEmail = true;
//                 this.confirmEmail.code = '';
//                 return true;
//         }
//         return false;
//     }
//
//     createConfirmCode(timeLifeEmailCode: number): string | null  {
//         if (!this.isConfirmEmail && this.deletedAt === null) {
//             this.confirmEmail.code = uuidv4();
//             this.confirmEmail.expirationTime = add(new Date(), { hours: timeLifeEmailCode });
//             return this.confirmEmail.code;
//         }
//         return null;
//
//     }
//
//     // edit(editData: UserInputDto) {
//     //     // при обновлении емаил, требуется его подтвердить
//     //     if(this.email != editData.email)
//     //         this.isConfirmEmail = false;
//     //     this.login = editData.login;
//     //     this.email = editData.email;
//     //     this.passwordHash = editData.password;
//     // }
//
//     static createInstance(dto: UserInputDto): UserDocument {
//         const user = new this();
//         user.login = dto.login;
//         user.email = dto.email;
//         user.passwordHash = dto.password;
//
//         return user as UserDocument;
//     }
// }
//
// export const UserSchema = SchemaFactory.createForClass(User);
//
// //регистрирует методы сущности в схеме
// UserSchema.loadClass(User);
//
// //Типизация документа
// export type UserDocument = HydratedDocument<User>;
//
// //Типизация модели + статические методы
// export type UserModelType = Model<UserDocument> & typeof User;