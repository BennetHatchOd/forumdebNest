import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';

class PaginationParams {

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageNumber: number = 1;
    @Type(() => Number)
    @Min(1)
    @IsNumber()
    pageSize: number = 10;

    calculateSkip() {
        return (this.pageNumber - 1) * this.pageSize;
    }
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

//базовый класс для query параметров с сортировкой и пагинацией
//поле sortBy должно быть реализовано в наследниках
export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
    @IsEnum(SortDirection)
    sortDirection: SortDirection = SortDirection.Desc;
    abstract sortBy: T;
}