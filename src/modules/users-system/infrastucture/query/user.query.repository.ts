import { User, UserDocument, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { UserViewDto } from '../../dto/view/user.view.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetUserQueryParams } from '../../dto/input/get.user.query.params.input.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { EmptyPaginator } from '@core/dto/empty.paginator';


@Injectable()
export class UserQueryRepository {

    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
    ){}

    async  findById(id: string): Promise<UserViewDto> {
        // если пост не найден, выкидываем ошибку 404 в репозитории

        if (!Types.ObjectId.isValid(id))
            throw new DomainException({
                message: 'user not found',
                code: DomainExceptionCode.NotFound,
            });

        const userView: UserViewDto|null = await this.findByIdWitoutCheck(id);
        if(!userView){
            throw new DomainException({
                message: 'user not found',
                code: DomainExceptionCode.NotFound});
        }
        return userView;
    }

    async findByIdWitoutCheck(id: string): Promise<UserViewDto|null> {
        if (!Types.ObjectId.isValid(id))
            return null;

        const searchItem: UserDocument | null
            = await this.UserModel.findOne({
                                        _id: new Types.ObjectId(id),
                                        deletedAt: null
                                    });
        if(!searchItem)
            return null;

        return UserViewDto.mapToView(searchItem);
    }

    async find(queryReq: GetUserQueryParams): Promise<PaginatedViewDto<UserViewDto>> {


        const queryFilter: FilterQuery<User> = { deletedAt: null };

        if (queryReq.searchLoginTerm){
            queryFilter.$or = queryFilter.$or || [];
            queryFilter.$or.push({login: {$regex: queryReq.searchLoginTerm, $options: 'i' }});
        }

        if (queryReq.searchEmailTerm){
            queryFilter.$or = queryFilter.$or || [];
            queryFilter.$or.push({email: {$regex: queryReq.searchEmailTerm, $options: 'i' }});
        }

        const totalCount: number = await this.UserModel.countDocuments(queryFilter);

        if(totalCount === 0)
            return new EmptyPaginator<UserViewDto>();

        const users: Array<UserDocument> = await this.UserModel.find(queryFilter)
            .limit(queryReq.pageSize)
            .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
            .sort({ [queryReq.sortBy]: queryReq.sortDirection });

        const items = users.map(UserViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount
        })

    }
}