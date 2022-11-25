import DecodedJwt from "../@Types/Auth/DecodedJwt";
import jwt_decode from "jwt-decode";


export default function decodeJwt(jwt: string): DecodedJwt {
    return jwt_decode(jwt);
}