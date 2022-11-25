export interface IAuthInputs {
    username: string;
    password: string;
}

export interface IRegisterInputs {
    username: string;
    email: string;
    password: string;
}

export interface IProfileInputs {
    username?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
}