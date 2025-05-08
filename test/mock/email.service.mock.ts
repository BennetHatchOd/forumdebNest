export class EmailServiceMock {
    createConfirmEmail = jest.fn();
    createNewConfirmEmail = jest.fn();
    createPasswordRecovery = jest.fn();
}
//
// {
//     //override method
//     async sendConfirmationEmail(email: string, code: string): Promise<void> {
//         console.log('Call mock method sendConfirmationEmail / EmailServiceMock');
//
//         return;
//     }
// }