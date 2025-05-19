import { Body, Controller, UseGuards, HttpCode, HttpStatus, Get, Delete, Param, Req } from '@nestjs/common';
import { URL_PATH } from '@core/url.path.setting';
import { CommandBus } from '@nestjs/cqrs';
import { SessionIsActiveGuard } from '@core/guards/session.is.active';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { SessionViewDto } from '@modules/users-system/dto/view/session.view.dto';
import { TokenPayloadDto } from '@modules/users-system/dto/token.payload.dto';
import { SessionQueryRepository } from '@modules/users-system/infrastucture/query/session.query.repository';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { DeleteOthersSessionCommand } from '@modules/users-system/application/UseCase/delete.others.sessions.usecase';
import { DeleteOneSessionCommand } from '@modules/users-system/application/UseCase/delete.one.session.usecase';
import { CurrentUserId } from '@core/decorators/current.user';

@Controller(URL_PATH.devices)
export class DeviceController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly sessionQueryRepository: SessionQueryRepository,
        private readonly sessionRepository: SessionRepository,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(SessionIsActiveGuard)
    async getAllSessions(@CurrentUserId() user: TokenPayloadDto
    ):Promise<SessionViewDto[]>{

        await this.sessionRepository.clearExpired(user.userId);
        const sessions: SessionViewDto[]
            = await this.sessionQueryRepository.findByUserId(user.userId);
        return sessions;
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(SessionIsActiveGuard)
    async deleteOtherDevices(@CurrentUserId() user: TokenPayloadDto) : Promise<void> {

        await this.commandBus.execute(new DeleteOthersSessionCommand(
            user.userId,
            user.deviceId));
        return;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(SessionIsActiveGuard)
    async deleteSession(
        @CurrentUserId() user: TokenPayloadDto,
        @Param() { id }: IdInputDto
    ): Promise<void> {

        await this.commandBus.execute(new DeleteOneSessionCommand(
            user.userId,
            id));
        return;
    }

}

