
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session, SessionDocument, SessionModelType } from '@modules/users-system/domain/session.entity';
import { SessionViewDto } from '@modules/users-system/dto/view/session.view.dto';


@Injectable()
export class SessionQueryRepository {

    constructor(
        @InjectModel(Session.name) private SessionModel: SessionModelType,
    ){}

    async  findByUserId(userId: string): Promise<SessionViewDto[]> {

        const devices: Array<SessionDocument> = await this.SessionModel.find({
            userId: userId
        })
        const items = devices.map(SessionViewDto.mapToView);
        return items;
    }
}