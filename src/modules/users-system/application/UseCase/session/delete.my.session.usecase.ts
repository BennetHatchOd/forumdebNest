import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Session } from '@modules/users-system/domain/session.entity';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { FilterQuery } from '@core/infrastucture/filter.query';

export class DeleteMySessionCommand extends Command<void> {
    constructor(
        public userId: number,
        public deviceId: string
    ) {
        super()}
}

@CommandHandler(DeleteMySessionCommand)
export class DeleteMySessionHandler implements ICommandHandler<DeleteMySessionCommand> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        ) {}

    async execute({userId, deviceId}: DeleteMySessionCommand):Promise<void> {

        const deleteQueryFilter = new FilterQuery<Session> ({
            userId: userId,
            deviceId: deviceId
        })

        await this.sessionRepository.deleteByFilter(deleteQueryFilter);
    }
}


