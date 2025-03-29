import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {

    constructor(@InjectModel(User.name) private userModel: UserModelType) {
    }

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
}
