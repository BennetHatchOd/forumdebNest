import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '@core/constans/data.source';
import { User } from '@modules/users-system/domain/user.entity';
import { UserTuple } from '@modules/users-system/domain/user.tuple';
import { UserEntityAssociated } from '@modules/users-system/dto/user.entity.associated';
import { CreateCodeDto } from '@modules/users-system/dto/create/create.code.dto';

@Injectable()
export class UserRepository {
    constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {}

    //+
    async findById(id: string): Promise<User | null> {

        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId < 1) return null;

        const searchItem: UserTuple[] = await this.dataSource.query(`
            SELECT * 
            FROM public."Users"
            WHERE id = $1 AND "deletedAt" IS NULL
            LIMIT 1`,
            [numericId]
        );
        if (searchItem.length == 0)
            return null;

        return this.mapTupleToUser(searchItem[0]);
    }

    //+
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

    //+
    async findAndDeleteConfirmCode(code: string): Promise<UserEntityAssociated|null> {
        // search for an unconfirmed email and the user associated with it by code,
        // delete the record about the code

        const searchItem  = await this.dataSource.query(`
            SELECT 
                "Users".id AS "userId",  
                "Users".email,  
                "Users"."passwordHash",  
                "Users"."isConfirmEmail",  
                "Users"."deletedAt",  
                "ConfirmationEmail".id AS "confirmId", 
                "ConfirmationEmail".expiredTime
            FROM public."Users"
            JOIN public."ConfirmationEmail"
                ON "Users".id = "ConfirmationEmail".userId
            WHERE "ConfirmationEmail".code = $1 
            LIMIT 1;`,
            [code]
        );

        if (searchItem.length == 0)
            return null;

        await this.dataSource.query(`
            DELETE FROM public."ConfirmationEmail"
            WHERE id = $1;`,
            [searchItem[0].confirmId]
        );
        const result = new UserEntityAssociated(
            searchItem[0].id,
            searchItem[0].email,
            searchItem[0].passwordHash,
            searchItem[0].isConfirmEmail,
            searchItem[0].deletedAt,
            searchItem[0].expiredTime);
        return result;
    }

    async getPartUserByLoginEmail(loginOrEmail: string): Promise<{id:string, passHash:string}|null> {

        const checkedUser: UserTuple[] = await this.dataSource.query(`
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
    //+
    async findUserIdByUnconfirmedEmail(email: string):Promise <number|null>{
        // search user with unconfirmed email

        const searchItem: number[] = await this.dataSource.query(`
            SELECT id 
                FROM public."Users"
                WHERE email = $1 AND "isConfirmEmail" = false AND "deletedAt" IS NULL
                LIMIT 1;`,
            [email]
        );

        return searchItem.length == 0
            ? null
            : searchItem[0];
    }

    //+
    async findUserIdByEmail(email: string):Promise <number|null>{
        // search user with confirmed email

        const searchItem: UserTuple[] = await this.dataSource.query(`
            SELECT id 
                FROM public."Users"
                WHERE email = $1 AND "isConfirmEmail" AND "deletedAt" IS NULL
                LIMIT 1;`,
            [email]
        );

        return searchItem.length == 0
            ? null
            : searchItem[0].id;
    }

    //+
    async saveUser(savedItem: User): Promise<void> {

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
            savedItem.id = result[0].id;
            return ;
        }

    //+
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
                ON CONFLICT (userId)
                DO UPDATE SET
                code = EXCLUDED.code,
                "expirationTime" = EXCLUDED."expirationTime";`,
            [createDto.userId, createDto.code, createDto.expirationTime]);
        return;
    }

    async findResetPasswordCode(resetCode: string): Promise<UserEntityAssociated|null> {
        const searchItem  = await this.dataSource.query(`
            SELECT
                "Users".id AS "userId",
                "Users".email,
                "Users"."passwordHash",
                "Users"."isConfirmEmail",
                "Users"."deletedAt",
                "ResetPassword".id AS "passwordId",
                "ResetPassword".expiredTime
            FROM public."Users"
                     JOIN public."ResetPassword"
                          ON "Users".id = "ResetPassword".userId
            WHERE "ResetPassword".code = $1
                LIMIT 1;`,
            [resetCode]
        );

        if (searchItem.length == 0)
            return null;

        await this.dataSource.query(`
            DELETE FROM public."ResetPassword"
            WHERE id = $1;`,
            [searchItem[0].passwordId]
        );
        const result = new UserEntityAssociated(
            searchItem[0].id,
            searchItem[0].email,
            searchItem[0].passwordHash,
            searchItem[0].isConfirmEmail,
            searchItem[0].deletedAt,
            searchItem[0].expiredTime);
        return result;
    }

    mapTupleToUser(tuple: UserTuple): User{
        const user = new User();
        user.id = tuple.id;
        user.login = tuple.login;
        user.email = tuple.email;
        user.passwordHash = tuple.passwordHash;
        user.isConfirmEmail = tuple.isConfirmEmail;
        user.createdAt = tuple.createdAt;
        user.deletedAt = tuple.deletedAt;

        return user;
    }
}
