
import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Session } from '@modules/users-system/domain/session.entity';
import { SessionViewDto } from '@modules/users-system/dto/view/session.view.dto';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { FilterQuery } from '@core/infrastucture/filter.query';


@Injectable()
export class SessionQueryRepository {

    constructor(
        @Inject(DATA_SOURCE) private dataSource: DataSource,
    ){}

    async  findByUserId(userId: number): Promise<SessionViewDto[]> {

        const {clause, values} = new FilterQuery({
            userId: userId}).buildWhereClause()
        const devices
            = await this.dataSource.query(`SELECT * FROM "Session" ${clause}`, values);

        const items = devices.map(SessionViewDto.mapToView);
        return items;
    }
}