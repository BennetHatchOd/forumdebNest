import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { NewPassword, NewPasswordDocument, NewPasswordModelType } from '../domain/new.password';

@Injectable()
export class AuthRepository {

    constructor(@InjectModel(User.name) private UserModel: UserModelType,
                @InjectModel(NewPassword.name) private NewPasswordModel: NewPasswordModelType,
                ){}

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

    async checkUniq(loginCheck: string, emailCheck: string):Promise<string[]|null>  {
        // checks the uniqueness of the entered login and email, in case of duplication,
        // returns an array indicating the duplicated field

        const existEmail = await this.UserModel.countDocuments({ email: emailCheck })
        const existLogin = await this.UserModel.countDocuments({ login: loginCheck })

        if(existEmail > 0 || existLogin > 0) {
            const arrayErrors: Array<string> = []
            if(existEmail > 0)
                arrayErrors.push('mail')
            if(existLogin > 0)
                arrayErrors.push('login')
            return arrayErrors;
        }
        return null;
    }

    async save(changedItem: UserDocument|NewPasswordDocument): Promise<void> {
        await changedItem.save();
    }

    async findByConfirmCode(code: string): Promise<UserDocument|null> {
        // search user with not verifed email

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({
                                        'confirmEmail.code': code,
                                        isConfirmEmail: false})
        return searchItem;
    }

    async foundUserWithOutEmail(email: string):Promise <UserDocument|null>{
        // search user with not verifed email

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({email: email,
                                            isConfirmEmail: false})

        return searchItem;
    }

    async foundUserIdByEmail(mail: string):Promise <string|null>{
        // search user with verifed email

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({email: mail,
                                            isConfirmEmail: true})
        return searchItem ? searchItem._id.toString() : null;
    }

    async findPasswordRecovery(recoveryCode: string): Promise<NewPasswordDocument|null> {
        return  await this.NewPasswordModel.findOne({code: recoveryCode})
    }

    async deletePasswordRecovery(userId: string) {
        // delete all recovery codes for the user if the password has already been recovered
        return  await this.NewPasswordModel.deleteMany({userId: userId})
    }
}
