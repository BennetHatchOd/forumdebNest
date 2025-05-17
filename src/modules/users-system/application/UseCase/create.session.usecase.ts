import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionInputDto } from '@modules/users-system/dto/input/session.input.dto';
import { UserConfig } from '@modules/users-system/config/user.config';
import { Session, SessionDocument, SessionModelType } from '@modules/users-system/domain/session.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { Inject } from '@nestjs/common';
import { INJECT_TOKEN } from '@modules/users-system/constans/jwt.tokens';
import { JwtService } from '@nestjs/jwt';
import { tokenPayloadDto } from '@modules/users-system/dto/token.payload.dto';

export class CreateSessionCommand extends Command<string> {
    constructor(
        public sessionInputDto: SessionInputDto,
    ) {
        super()}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<CreateSessionCommand, string> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userConfig: UserConfig,
        @Inject(INJECT_TOKEN.REFRESH_TOKEN)
        private readonly refreshJwtService: JwtService,
        @InjectModel(Session.name) private SessionModel: SessionModelType,
        ) {}

    async execute({sessionInputDto}: CreateSessionCommand):Promise<string> {

        const session: SessionDocument = this.SessionModel.createInstance(sessionInputDto)
        await this.sessionRepository.save(session);

        const payload: tokenPayloadDto =  this.sessionRepository.mapTokenFromSession(session)
        const token = await this.refreshJwtService.sign(payload);
        return token;
    }
}


