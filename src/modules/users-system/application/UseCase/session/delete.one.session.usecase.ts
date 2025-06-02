import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Session } from '@modules/users-system/domain/session.entity';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { FilterQuery } from '@core/infrastucture/filter.query';

export class DeleteOneSessionCommand extends Command<void> {
    constructor(
        public userId: number,
        public deviceId: string
    ) {
        super()}
}

@CommandHandler(DeleteOneSessionCommand)
export class DeleteOneSessionHandler implements ICommandHandler<DeleteOneSessionCommand> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        ) {}

    async execute({userId, deviceId}: DeleteOneSessionCommand):Promise<void> {

        const findQueryFilter = new FilterQuery<Session> ({ deviceId: deviceId })

        const sessionToClose: Session | null
            = await this.sessionRepository.getByFilter(findQueryFilter);

        if(!sessionToClose)
            throw new DomainException({
                message: 'session not found',
                code: DomainExceptionCode.NotFound
            })

        if(sessionToClose.userId !== userId )
            throw new DomainException({
                message: 'this is not your device',
                code: DomainExceptionCode.Forbidden
            })

        const deleteQueryFilter = new FilterQuery<Session>({
            userId: userId,
            deviceId: deviceId
        })

        await this.sessionRepository.deleteByFilter(deleteQueryFilter);
    }
}


