import { Type } from 'class-transformer';

class PaginationParams {

    @Type(() => Number)
    pageNumber: number = 1;
    @Type(() => Number)
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
    sortDirection: SortDirection = SortDirection.Desc;
    abstract sortBy: T;
}