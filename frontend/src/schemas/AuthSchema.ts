import * as yup from "yup";

export const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().min(3, 'Password must have at least 3 characters.').required(),
}).required();

export const registerSchema = yup.object({
    username: yup.string().required('Please enter a name.'),
    email: yup.string().required('Please enter an email address.').email('Please enter a valid email address.'),
    password: yup.string().min(3, 'Password must have at least 3 characters.').required(),
}).required();