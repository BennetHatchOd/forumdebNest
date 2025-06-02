import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { Inject } from '@nestjs/common';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from '@modules/users-system/dto/token.payload.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Session } from '@modules/users-system/domain/session.entity';
import { FilterQuery } from '@core/infrastucture/filter.query';

export class UpdateSessionCommand extends Command<string> {
    constructor(
        public payload: TokenPayloadDto,
    ) {
        super()}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler implements ICommandHandler<UpdateSessionCommand, string> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        @Inject(INJECT_TOKEN.REFRESH_TOKEN)
        private readonly refreshJwtService: JwtService,
    ) {}

    async execute({payload}: UpdateSessionCommand):Promise<string> {

        const queryFilter = new FilterQuery<Session> ({
            userId: payload.userId,
            version: payload.version,
            deviceId: payload.deviceId
        })

        const updatingSession
            = await this.sessionRepository.getByFilter(queryFilter)

        if(!updatingSession)
            throw new DomainException({
                message: 'refreshToken is not correct',
                code: DomainExceptionCode.RefreshTokenNotVerify
            })
        updatingSession.update();
        await this.sessionRepository.save(updatingSession);

        const newPayload: TokenPayloadDto =  this.sessionRepository.mapTokenFromSession(updatingSession)
        const token = this.refreshJwtService.sign(newPayload);
        return token;
    }
}


