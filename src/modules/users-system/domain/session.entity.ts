import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import { SessionInputDto } from '@modules/users-system/dto/input/session.input.dto';

@Schema({ timestamps: true })
export class Session {
    @Prop({ required: true, })
    userId:     string;

    @Prop({ required: true, })
    version:    string;

    @Prop({
        unique: true,
        required: true,
    })
    deviceId:   string;

    @Prop({ required: true, })
    deviceName: string;

    @Prop({ required: true, })
    ip:         string;

    updatedAt:  Date;

    update(){
        const uid = new ShortUniqueId({ length: 7 });

        this.version = uid.rnd();
    }

    static createInstance(dto: SessionInputDto,
    ): SessionDocument {
        const uid = new ShortUniqueId({ length: 7 });
        const session = new this();

        session.userId = dto.userId;
        session.deviceName = dto.deviceName;
        session.ip = dto.ip;

        session.deviceId = uid.rnd();
        session.version = uid.rnd();

        return session as SessionDocument;
    }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

//регистрирует методы сущности в схеме
SessionSchema.loadClass(Session);

//Типизация документа
export type SessionDocument = HydratedDocument<Session>;

//Типизация модели + статические методы
export type SessionModelType = Model<SessionDocument> & typeof Session;