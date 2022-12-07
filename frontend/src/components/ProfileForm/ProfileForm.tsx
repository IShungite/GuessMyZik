import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, TextInput } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ProfileCredentials, RegisterCredentials } from "../../@Types/Auth/User";
import { IProfileInputs } from "../../@Types/Form/IFormInputs";
import { authState } from "../../atoms/authAtom";
import { backendApiUrl } from "../../constants";
import useFetch from "../../hooks/useFetch";
import { profileSchema } from "../../schemas/AuthSchema";
import RegisterButton from "../RegisterButton/RegisterButton";

export default function ProfileForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<IProfileInputs>({
        resolver: yupResolver(profileSchema)
    });

    const getAuth = useRecoilValue(authState);

    const onSubmit = async (formData: IProfileInputs) => {

        const userId = getAuth?.id;
        if (userId) {
            await fetchData(`${backendApiUrl}/users/${userId}`, {
                method: 'PATCH', body: JSON.stringify({
                    updateUserDto: {
                        username: formData.username ? formData.username : undefined,
                        email: formData.email ? formData.email : undefined,
                        password: formData.newPassword ? formData.newPassword : undefined
                    },
                    oldPassword: formData.oldPassword ? formData.oldPassword : undefined
                })
            });
        }

    }

    const { data, isLoading, error, fetchData } = useFetch<ProfileCredentials>();
    const navigate = useNavigate();
    const resetCredentials = useSetRecoilState(authState);

    React.useEffect(() => {
        if (data) {
            localStorage.clear();
            resetCredentials(undefined);
            navigate(`/login`);
        }
    }, [data])

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {error &&
                <Alert
                    color="failure"
                >
                    <span>
                        <span className="font-medium">
                            Error :
                        </span>
                        {' '}{error?.message}
                    </span>
                </Alert>
            }

            <TextInput
                id="username"
                type="string"
                placeholder="Username"
                {...register("username")}
            />
            <p>{errors.username?.message}</p>

            <TextInput
                id="email"
                type="string"
                placeholder="Email"
                {...register("email")}
            />
            <p>{errors.email?.message}</p>

            <TextInput
                id="prevPassword"
                type="password"
                placeholder="Enter current password"
                {...register("oldPassword")}
            />
            <p>{errors.oldPassword?.message}</p>

            <TextInput
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register("newPassword")}
            />
            <p>{errors.newPassword?.message}</p>

            <RegisterButton />

        </form>

    );
}