import { User, UserDocument, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CommentatorInfoViewDto } from '../../dto/view/commentator.info.view.dto';
import { UsersLoginsDto } from '@modules/users-system/dto/user.logins.dto';

@Injectable()
export class UserQueryExternalRepository {

    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
    ){}

    async  findNameById(id: string): Promise<CommentatorInfoViewDto|null> {
        if (!Types.ObjectId.isValid(id))
            return null;

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({
                                        _id: new Types.ObjectId(id),
                                        deletedAt: null
                                    });
        if(!searchItem)
            return null;

        return CommentatorInfoViewDto.mapToView(searchItem);
    }

    async getUsersLogins(usersString: string[]):Promise<UsersLoginsDto[]>{
        const usersId = usersString.map(user => new Types.ObjectId(user))
        const users: UserDocument[] = await this.UserModel.find({
            deletedAt: null,
            _id: { $in: usersId },
        })
        const usersLogins = users.map((user: UserDocument) => ({
            userId: user._id.toString(),
            login: user.login}));
        return usersLogins
    }

}