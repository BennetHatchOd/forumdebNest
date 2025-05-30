import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {

    constructor(@InjectModel(User.name) private UserModel: UserModelType) {
    }

    async findById(id: string): Promise<UserDocument | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const searchItem: UserDocument | null
            = await this.UserModel.findOne({
                                            _id: new Types.ObjectId(id),
                                            deleteAt: null
                                        });
        return searchItem
    }

    async checkUniq(loginCheck: string, emailCheck: string):Promise<string[]|null>  {
        // checks the uniqueness of the entered login and email, in case of duplication,
        // returns an array indicating the duplicated field

        const existEmail = await this.UserModel.countDocuments({ email: emailCheck })
        const existLogin = await this.UserModel.countDocuments({ login: loginCheck })

        if(existEmail > 0 || existLogin > 0) {
            const arrayErrors: Array<string> = []
            if(existEmail > 0)
                arrayErrors.push('email')
            if(existLogin > 0)
                arrayErrors.push('login')
            return arrayErrors;
        }
        return null;
    }

    async findByConfirmCode(code: string): Promise<UserDocument|null> {
        // search user with not verifed email

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({
            'confirmEmail.code': code,
            isConfirmEmail: false,
            deletedAt: null})
        return searchItem;
    }

    async getPartUserByLoginEmail(loginOrEmail: string): Promise<{id:string, passHash:string}|null> {

        const checkedUser: UserDocument|null = await this.UserModel.findOne(
            // returns information about the user who has
            // a login or email that matches the passed value

            {$and:[
                    {isConfirmEmail: true},
                    {$or: [
                            {login: loginOrEmail},
                            {email: loginOrEmail}]
                    }]
            })

        return checkedUser === null
            ? null
            : {id: checkedUser._id.toString(), passHash: checkedUser.passwordHash};
    }

    async foundUserWithOutEmail(email: string):Promise <UserDocument|null>{
        // search user with not verifed email

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({
            email: email,
            isConfirmEmail: false,
            deletedAt: null})

        return searchItem;
    }

    async foundUserIdByEmail(mail: string):Promise <string|null>{
        // search user with verifed email

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({email: mail,
            isConfirmEmail: true})
        return searchItem ? searchItem._id.toString() : null;
    }

    async save(changedItem: UserDocument): Promise<void> {
        await changedItem.save();
    }
}
