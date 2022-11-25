export interface JWtPayload {
  id: string;
  username: string;
}

export interface IAuthPayload {
  sub: string;
  username: string;
}

export interface IAuthLoginResponse {
  id: string;
  access_token: string;
}

export interface IUserRequest {
  id: string;
  username: string;
}
