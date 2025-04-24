import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

export class DomainException extends Error {
    message: string;
    code: DomainExceptionCode;
    extension: string;

    constructor(ErrorInfo   :{
        message     : string,
        code: DomainExceptionCode,
    }) {
        super(ErrorInfo.message)
        this.code = ErrorInfo.code;
    }

}