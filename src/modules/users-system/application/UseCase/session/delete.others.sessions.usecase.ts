import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Session } from '@modules/users-system/domain/session.entity';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { FilterQuery } from '@core/infrastucture/filter.query';

export class DeleteOthersSessionCommand extends Command<void> {
    constructor(
        public userId: number,
        public deviceId: string,
    ) {
        super()}
}

@CommandHandler(DeleteOthersSessionCommand)
export class DeleteOthersSessionHandler implements ICommandHandler<DeleteOthersSessionCommand, string> {
    constructor(
        private readonly sessionRepository: SessionRepository,
    ) {}

    async execute({userId, deviceId}: DeleteOthersSessionCommand):Promise<void> {

        const deleteQueryFilter = new FilterQuery<Session>({
            userId: userId,
            deviceId: {$ne: deviceId}
        })
        await this.sessionRepository.deleteByFilter(deleteQueryFilter);
    }
}


