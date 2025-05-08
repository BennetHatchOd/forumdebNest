export enum DomainExceptionCode {
    NotFound = 1,
    BadRequest = 2,
    InternalServerError = 3,
    Forbidden = 4,
    ValidationError = 5,
    Unauthorized = 6,
    EmailNotConfirmed = 7,
    EmailNotExist = 11,
    ConfirmationCodeExpired = 8,
    PasswordRecoveryCodeExpired = 9,
    PasswordRecoveryCodeNotFound = 10,
}