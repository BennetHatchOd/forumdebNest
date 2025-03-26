import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {

    constructor(@InjectModel(User.name) private userModel: UserModelType) {
    }

    // async isExist(id: string): Promise<boolean> {
    //     if (!Types.ObjectId.isValid(id)) return false;
    //     const isExist: number = await this.BlogModel.countDocuments({
    //                                                         _id: new Types.ObjectId(id),
    //                                                         deletedAt: null,
    //                                                     });
    //     return isExist != 0 ? true : false;
    // }

    async findById(id: string): Promise<UserDocument | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const searchItem: UserDocument | null
            = await this.userModel.findOne({
                                            _id: new Types.ObjectId(id),
                                            deleteAt: null
                                        });
        return searchItem
    }

    async save(changedItem: UserDocument): Promise<void> {
        await changedItem.save();
    }

    async clear(): Promise<void> {
        await this.userModel.deleteMany();

        if ((await this.userModel.countDocuments({})) != 0)
            throw new Error("the server can\'t clear blogCollection");
        return;
    }
}
