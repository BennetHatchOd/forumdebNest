import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session, SessionDocument, SessionModelType } from '@modules/users-system/domain/session.entity';
import { getTime } from 'date-fns';
import { tokenPayloadDto } from '@modules/users-system/dto/token.payload.dto';
import { CommentDocument } from '@modules/blogging.platform/domain/comment.entity';

@Injectable()
export class SessionRepository {

    constructor(@InjectModel(Session.name) private SessionModel: SessionModelType)
    {}

    async isActive(session: tokenPayloadDto): Promise<boolean> {
        //  check if the session is valid and
        //  additionally clears the database of expired sessions for this user

        await this.clearExpired(session.userId)

        const findAnswer
            = await this.SessionModel.findOne({
                userId: session.userId,
                version: session.version,
                deviceId: session.deviceId
            })

        return findAnswer
            ? true
            : false

    }
    private async clearExpired(userId: string): Promise<void> {
        // clears the database of expired sessions for this user

        await this.SessionModel.deleteMany({
            userId:   userId,
            exp: { $lt: getTime(new Date) }})
    }

    async save(changedItem: SessionDocument): Promise<void> {
        await changedItem.save();
    }
    mapTokenFromSession(session: SessionDocument): tokenPayloadDto{
        return {
            userId:     session.userId,
            version:    session.version,
            iat:        Math.floor(getTime(session.createdAt) / 1000),
            deviceId:   session.deviceId
        }
    }
}
