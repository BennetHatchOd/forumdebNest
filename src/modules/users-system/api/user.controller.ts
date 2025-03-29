import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { URL_PATH } from 'src/core/setting';
import { UserInputDto } from '../dto/input/user.input.dto';
import { UserViewDto } from '../dto/view/user.view.dto';
import { UserService } from '../apllication/user.service';
import { UserQueryRepository } from '../infrastucture/query/user.query.repository';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetUserQueryParams } from '../dto/input/get.user.query.params.input.dto';

@Controller(URL_PATH.users)
export class UserControllers {
    constructor(
        private userService: UserService,
        private userQueryRepository: UserQueryRepository,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() user: UserInputDto):Promise<UserViewDto> {
    // 
    // Create new blog

        const createId: string = await this.userService.create(user);
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

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string): Promise<void>{
    //
    // Delete blog specified by id

        return await this.userService.delete(id)
    }

}