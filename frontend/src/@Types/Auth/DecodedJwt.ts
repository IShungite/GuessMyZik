export default interface DecodedJwt {
    username: string;

    iat: number;
    exp: number;
}