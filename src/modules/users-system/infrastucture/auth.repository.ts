import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { NewPassword, NewPasswordDocument, NewPasswordModelType } from '../domain/new.password';

@Injectable()
export class AuthRepository {

    constructor(//@InjectModel(User.name) private UserModel: UserModelType,
                @InjectModel(NewPassword.name) private NewPasswordModel: NewPasswordModelType,
                ){}


    async save(changedItem: NewPasswordDocument): Promise<void> {
        await changedItem.save();
    }

    async findPasswordRecovery(recoveryCode: string): Promise<NewPasswordDocument|null> {
        return  await this.NewPasswordModel.findOne({code: recoveryCode})
    }

    async deleteUsedPasswordRecovery(userId: string) {
        // delete all recovery codes for the user if the password has already been recovered
        return  await this.NewPasswordModel.deleteMany({userId: userId})
    }
}
