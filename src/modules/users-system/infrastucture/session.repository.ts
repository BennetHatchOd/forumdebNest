import { Inject, Injectable } from '@nestjs/common';
import { Session } from '@modules/users-system/domain/session.entity';
import { getTime } from 'date-fns';
import { TokenPayloadDto } from '@modules/users-system/dto/token.payload.dto';
import { FilterQuery } from '@core/infrastucture/filter.query';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionRepository {

    constructor(
        @Inject(DATA_SOURCE) private dataSource: DataSource,
    )
    {}

    async isActive(session: TokenPayloadDto): Promise<boolean> {
        //  check if the session is valid

        const {clause, values} = new FilterQuery({
            userId: session.userId,
            version: session.version,
            deviceId: session.deviceId})
        .buildWhereClause()

        const findAnswer
            = await this.dataSource.query(`SELECT id FROM "Session" ${clause} LIMIT 1`, values);

        return (findAnswer.length == 1);
    }

    async getByFilter(queryFilter: FilterQuery<Session>): Promise<Session | null> {

        const {clause, values} = queryFilter.buildWhereClause()
        const findAnswer
            = await this.dataSource.query(`SELECT * FROM "Session" ${clause} LIMIT 1`, values);

        if(findAnswer.length == 0)
            return null;

        return  Object.assign(new Session(), findAnswer[0]);
    }

    async deleteByFilter(queryFilter: FilterQuery<Session>): Promise<void> {

        const {clause, values} = queryFilter.buildWhereClause()
        await this.dataSource.query(`DELETE FROM "Session" ${clause}`, values);
    }

    async save(savedItem: Session): Promise<void> {
        const result = await this.dataSource.query(`
                INSERT INTO public."Session"(
                    version, "userId", "deviceId", "deviceName", ip, "updatedAt")
                VALUES($1, $2, $3, $4, $5, $6)
                ON CONFLICT ("deviceId")
                    DO UPDATE SET
                    "updatedAt" = EXCLUDED."updatedAt",
                    version= EXCLUDED.version
                RETURNING id;`,
            [   savedItem.version,
                savedItem.userId,
                savedItem.deviceId,
                savedItem.deviceName,
                savedItem.ip,
                savedItem.updatedAt,
            ])
        savedItem.id ??= result[0].id;
        return ;
    }

    mapTokenFromSession(session: Session): TokenPayloadDto{
        return {
            userId:     session.userId,
            version:    session.version,
            iat:        Math.floor(getTime(session.updatedAt) / 1000),
            deviceId:   session.deviceId
        }
    }
}
