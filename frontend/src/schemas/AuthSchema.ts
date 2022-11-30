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

export const profileSchema = yup.object({
    username: yup.string().nullable().notRequired(),
    email: yup.string().email('Please enter a valid email address.').nullable().notRequired(),
    oldPassword: yup.string().matches(/.{3,}/, {
        excludeEmptyString: true,
        message: 'Password must have at least 3 characters.',
    }),
    newPassword: yup.string().matches(/.{3,}/, {
        excludeEmptyString: true,
        message: 'Password must have at least 3 characters.',
    }),
}).required();