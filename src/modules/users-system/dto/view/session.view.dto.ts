import { Session, SessionDocument } from '@modules/users-system/domain/session.entity';

export class SessionViewDto{
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;

    public static mapToView(dto: SessionDocument): SessionViewDto{
        const session = new SessionViewDto();

        session.deviceId = dto.deviceId;
        session.title = dto.deviceName;
        session.lastActiveDate = dto.createdAt.toISOString();
        session.ip = dto.ip;

        return session;
    }
}