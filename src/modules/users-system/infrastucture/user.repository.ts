import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '@core/constans/data.source';
import { User } from '@modules/users-system/domain/user.entity';
import { UserEntityAssociated } from '@modules/users-system/dto/user.entity.associated';
import { CreateCodeDto } from '@modules/users-system/dto/create/create.code.dto';
import { FilterQuery } from '@core/infrastucture/filter.query';
import { BaseRepository } from '@core/repository/base.repository';

@Injectable()
export class UserRepository extends BaseRepository{
    constructor(@Inject(DATA_SOURCE) protected dataSource: DataSource) {
        super(dataSource);
    }

    async findById(id: string|number): Promise<User | null> {

        return this.findEntityById<User>(id, 'Users', User);
    }

    async checkUniq(loginCheck: string, emailCheck: string):Promise<string[]|null>  {
        // checks the uniqueness of the entered login and email, in case of duplication,
        // returns an array indicating the duplicated field

        const existLoginEmail = await this.dataSource.query(`
        SELECT
            MAX(CASE WHEN login = $1 THEN 'login' END) AS login_conflict,
            MAX(CASE WHEN email = $2 THEN 'email' END) AS email_conflict
        FROM public."Users"
        WHERE login = $1 OR email = $2`,
        [loginCheck, emailCheck]);

        if(!existLoginEmail[0].login_conflict && !existLoginEmail[0].email_conflict )
            return null;

        const arrayErrors: string[] = [];

        if(existLoginEmail[0].login_conflict)
            arrayErrors.push('login')
        if(existLoginEmail[0].email_conflict)
            arrayErrors.push('email')

        return arrayErrors;

    }

    async getIdAndPasswordByLoginEmail(loginOrEmail: string): Promise<{id:string, passHash:string}|null> {

        const checkedUser: User[] = await this.dataSource.query(`
            SELECT * 
                FROM public."Users"
                WHERE (login = $1 OR email = $2) AND "isConfirmEmail" AND "deletedAt" IS NULL
                LIMIT 1;`,
            [loginOrEmail, loginOrEmail]
        );
        // returns information about the user who has
        // a login or email that matches the passed value

        return checkedUser.length == 0
            ? null
            : {id: checkedUser[0].id.toString(),
               passHash: checkedUser[0].passwordHash};
    }

    async findUserIdByUnconfirmedEmail(email: string):Promise <number|null>{
        // search user with unconfirmed email

        return this.findUserIdByEmail(email, false)
    }
    async findUserIdByConfirmEmail(email: string):Promise <number|null>{
        // search user with confirmed email

        return this.findUserIdByEmail(email, true)
    }

    async save(savedItem: User): Promise<void> {

            const result = await this.dataSource.query(`
                INSERT INTO public."Users"(
                    login, email, "passwordHash", "isConfirmEmail", "deletedAt")
                VALUES($1, $2, $3, $4, $5)
                ON CONFLICT (login)
                    DO UPDATE SET
                    email= EXCLUDED.email,
                    "passwordHash" = EXCLUDED."passwordHash",
                    "isConfirmEmail" = EXCLUDED."isConfirmEmail",
                    "deletedAt"= EXCLUDED."deletedAt"
                RETURNING id;`,
                [   savedItem.login,
                    savedItem.email,
                    savedItem.passwordHash,
                    savedItem.isConfirmEmail,
                    savedItem.deletedAt,
                ])
            savedItem.id ??= result[0].id;
            return ;
        }

    async saveConfirmEmailCode(createDto: CreateCodeDto): Promise<void>   {

        await this.dataSource.query(`
            INSERT INTO public."ConfirmationEmail" 
                ("userId", code, "expirationTime")
            VALUES ($1, $2, $3)
                ON CONFLICT ("userId")
                DO UPDATE SET
                code = EXCLUDED.code,
                "expirationTime" = EXCLUDED."expirationTime";`,
            [createDto.userId, createDto.code, createDto.expirationTime]);
        return;
    }
    async saveResetPasswordCode(createDto: CreateCodeDto): Promise<void>   {

        await this.dataSource.query(`
            INSERT INTO public."ResetPassword" 
                ("userId", code, "expirationTime")
            VALUES ($1, $2, $3)
                ON CONFLICT ("userId")
                DO UPDATE SET
                code = EXCLUDED.code,
                "expirationTime" = EXCLUDED."expirationTime";`,
            [createDto.userId, createDto.code, createDto.expirationTime]);
        return;
    }

    async findAndDeleteResetPasswordCode(code: string): Promise<UserEntityAssociated|null> {

        return await this.findAndDeleteCode(code, 'ResetPassword');
    }
    async findAndDeleteConfirmCode(code: string): Promise<UserEntityAssociated|null> {
        // search for an unconfirmed email and the user associated with it by code,
        // delete the record about the code

        return await this.findAndDeleteCode(code, 'ConfirmationEmail');
    }
}
