import * as yup from "yup";

export const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().min(3, 'Password must have at least 3 characters.').required(),
}).required();