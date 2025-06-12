import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { FilterQuery } from '@core/infrastucture/filter.query';
import { UserEntityAssociated } from '@modules/users-system/dto/user.entity.associated';
import { CreateCodeDto } from '@modules/users-system/dto/create/create.code.dto';
import { Inject } from '@nestjs/common';
import { DATA_SOURCE } from '@core/constans/data.source';


export class BaseRepository {
    constructor(@Inject(DATA_SOURCE) protected dataSource: DataSource) {}

    async findEntityById<T>(
        id: string|number,
        tableName: string,
        entityClass: new () => T
    ): Promise<T | null> {
        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId < 1)
            return null;

        const { clause, values } = new FilterQuery({
            id: numericId,
            deletedAt: null
        }).buildWhereClause();

        const result = await this.dataSource.query(
            `SELECT * FROM public."${tableName}" ${clause} LIMIT 1`,
            values
        );

        if (result.length === 0)
            return null;

        return plainToInstance(entityClass, result[0]);
    }

    async findAndDeleteCode(
        code: string,
        tableName: string,
    ): Promise<UserEntityAssociated|null> {

        const searchItem  = await this.dataSource.query(`
            SELECT
                "Users".id AS user_id,
                "Users".email,
                "Users".login,
                "Users"."passwordHash",
                "Users"."isConfirmEmail",
                "Users"."deletedAt",
                "${tableName}".id AS entity_id,
                "${tableName}"."expirationTime"
            FROM public."Users"
                     JOIN public."${tableName}"
                          ON "Users".id = "${tableName}"."userId"
            WHERE "${tableName}".code = $1
                LIMIT 1;`,
            [code]
        );

        if (searchItem.length == 0)
            return null;

        await this.dataSource.query(`
            DELETE FROM public."${tableName}"
            WHERE id = $1;`,
            [searchItem[0].entity_id]
        );
        const result = new UserEntityAssociated(
            searchItem[0].user_id,
            searchItem[0].email,
            searchItem[0].login,
            searchItem[0].passwordHash,
            searchItem[0].isConfirmEmail,
            searchItem[0].deletedAt,
            searchItem[0].expirationTime);
        return result;
    }

    async saveCode(
        createDto: CreateCodeDto,
        tableName: string,
        ): Promise<void>   {

        await this.dataSource.query(`
            INSERT INTO public."${tableName}" 
                ("userId", code, "expirationTime")
            VALUES ($1, $2, $3)
                ON CONFLICT ("userId")
                DO UPDATE SET
                code = EXCLUDED.code,
                "expirationTime" = EXCLUDED."expirationTime";`,
            [createDto.userId, createDto.code, createDto.expirationTime]);
        return;
    }

    async findUserIdByEmail(
        email: string,
        isConfirmEmail: boolean,
        ):Promise <number|null>{
        // search user with unconfirmed email

        const searchItem = await this.dataSource.query(`
            SELECT id 
                FROM public."Users"
                WHERE email = $1 AND "isConfirmEmail" = ${isConfirmEmail} AND "deletedAt" IS NULL
                LIMIT 1;`,
            [email]
        );

        return searchItem.length == 0
            ? null
            : searchItem[0].id;
    }
}