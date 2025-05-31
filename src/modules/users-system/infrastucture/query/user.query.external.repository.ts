import { Inject, Injectable } from '@nestjs/common';
import { CommentatorInfoViewDto } from '../../dto/view/commentator.info.view.dto';
import { UsersLoginsDto } from '@modules/users-system/dto/user.logins.dto';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { UserTuple } from '@modules/users-system/domain/user.tuple';

@Injectable()
export class UserQueryExternalRepository {

    constructor(
        @Inject(DATA_SOURCE)private readonly dataSource: DataSource,
    ){}

    async  getLoginByUserId(id: string): Promise<CommentatorInfoViewDto|null> {

        const numericId = Number(id);
        if( !Number.isInteger(numericId) || numericId < 1)
            return null;

        const user: UserTuple[] = await this.dataSource.query(`
            SELECT * 
                FROM public."Users" 
                WHERE 
                      id = $1 
                  AND "deletedAt" IS NULL 
                LIMIT 1;`,
            [numericId]);

        if(user.length == 0)
            return null;

        return CommentatorInfoViewDto.mapToView(user[0]);
    }

    async getManyLoginsByUserIds(usersId: string[]):Promise<UsersLoginsDto[]>{

        if( usersId.length == 0 )
            return [];
        const arrayIds = usersId.map((_, index) => `$${index + 1}`);
        const whereReq = arrayIds.join(', ');
        const users: UserTuple[] = await this.dataSource.query(`
                    SELECT id, login
                    FROM public."Users"
                    WHERE
                        id IN (${whereReq}) 
                      AND "deletedAt" IS NULL;`,
                usersId);

        const usersLogins = users.map((user: UserTuple) => ({
            userId: user.id.toString(),
            login: user.login}));
        return usersLogins
    }

}