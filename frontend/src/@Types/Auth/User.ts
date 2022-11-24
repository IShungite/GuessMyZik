export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

export interface Credentials {
    username: string;
    access_token: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}