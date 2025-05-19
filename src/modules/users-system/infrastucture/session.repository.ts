import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session, SessionDocument, SessionModelType } from '@modules/users-system/domain/session.entity';
import { getTime } from 'date-fns';
import { TokenPayloadDto } from '@modules/users-system/dto/token.payload.dto';
import { FilterQuery } from 'mongoose';
import { Comment } from '@modules/blogging.platform/domain/comment.entity';

@Injectable()
export class SessionRepository {

    constructor(@InjectModel(Session.name) private SessionModel: SessionModelType)
    {}

    async isActive(session: TokenPayloadDto): Promise<boolean> {
        //  check if the session is valid

        const findAnswer
            = await this.SessionModel.findOne({
                userId: session.userId,
                version: session.version,
                deviceId: session.deviceId
            },{
                projection: {_id: 1}
            })

        return !!findAnswer;
    }

    async getByDeviceId(id: string): Promise<SessionDocument | null> {

        const findAnswer: SessionDocument | null
            = await this.SessionModel.findOne({ deviceId: id })

        return findAnswer;
    }

    async getByFilter(queryFilter: FilterQuery<Session>): Promise<SessionDocument | null> {

        const findAnswer: SessionDocument | null
            = await this.SessionModel.findOne(queryFilter)

        return findAnswer;
    }

    async deleteByFilter(queryFilter: FilterQuery<Session>): Promise<void> {

        await this.SessionModel.deleteMany(queryFilter)

    }

    async clearExpired(userId: string): Promise<void> {
        // clears the database of expired sessions for this user

        await this.SessionModel.deleteMany({
            userId:   userId,
            exp: { $lt: getTime(new Date) }})
    }

    async save(changedItem: SessionDocument): Promise<void> {
        await changedItem.save();
    }

    mapTokenFromSession(session: SessionDocument): TokenPayloadDto{
        return {
            userId:     session.userId,
            version:    session.version,
            iat:        Math.floor(getTime(session.createdAt) / 1000),
            deviceId:   session.deviceId
        }
    }
}
