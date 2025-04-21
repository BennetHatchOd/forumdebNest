import { User, UserDocument, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { UserViewDto } from '../../dto/view/user.view.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { GetUserQueryParams } from '../../dto/input/get.user.query.params.input.dto';
import { CommentatorInfoViewDto } from '../../dto/view/commentator.info.view.dto';

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
}