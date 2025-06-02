import ShortUniqueId from 'short-unique-id';
import { SessionInputDto } from '@modules/users-system/dto/input/session.input.dto';

export class Session {

    id!: number;
    userId:     number;
    version:    string;
    deviceId:   string;
    deviceName: string;
    ip:         string;
    updatedAt:  Date;

    update(){
        const uid = new ShortUniqueId({ length: 7 });
        this.updatedAt = new Date();
        this.version = uid.rnd();
    }

    static createInstance(dto: SessionInputDto): Session {
        const uid = new ShortUniqueId({ length: 7 });
        const session = new this();

        session.userId = dto.userId;
        session.deviceName = dto.deviceName;
        session.ip = dto.ip;
        session.deviceId = uid.rnd();
        session.version = uid.rnd();
        session.updatedAt = new Date();

        return session;
    }
}
