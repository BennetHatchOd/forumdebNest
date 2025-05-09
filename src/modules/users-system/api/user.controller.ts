import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserInputDto } from '../dto/input/user.input.dto';
import { UserViewDto } from '../dto/view/user.view.dto';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastucture/query/user.query.repository';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetUserQueryParams } from '../dto/input/get.user.query.params.input.dto';
import { AuthGuard } from '@nestjs/passport';
import { URL_PATH } from '@core/url.path.setting';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { ApiBasicAuth } from '@nestjs/swagger';
import { CreateUserCommand } from '@modules/users-system/application/UseCase/create.user.usecase';
import { CommandBus } from '@nestjs/cqrs';

@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
@Controller(URL_PATH.users)
export class UserControllers {
    constructor(
        private commandBus: CommandBus,
        private userService: UserService,
        private userQueryRepository: UserQueryRepository,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() inputUserDto: UserInputDto):Promise<UserViewDto> {

        const createId: string = await this.commandBus.execute(new CreateUserCommand(inputUserDto, true));
        const userView: UserViewDto = await this.userQueryRepository.findById(createId);
        return userView;
    }

    @Get()
    async getAll(@Query() query: GetUserQueryParams,)
        : Promise<PaginatedViewDto<UserViewDto[]>> {

        const userPaginator: PaginatedViewDto<UserViewDto[]>
            = await this.userQueryRepository.find(query);

        return userPaginator;

    }

    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async deleteUser(@Param('id') inputId: IdInputDto): Promise<void>{
    //
    //     return await this.userService.delete(inputId.id)
    // }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param() { id }: IdInputDto): Promise<void>{
        return await this.userService.delete(id)
    }
}