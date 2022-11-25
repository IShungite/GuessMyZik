import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, TextInput } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RegisterCredentials } from "../../@Types/Auth/User";
import { IRegisterInputs } from "../../@Types/Form/IFormInputs";
import { backendApiUrl } from "../../constants";
import useFetch from "../../hooks/useFetch";
import { registerSchema } from "../../schemas/AuthSchema";
import RegisterButton from "../RegisterButton/RegisterButton";

export default function RegisterForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<IRegisterInputs>({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = async (formData: IRegisterInputs) => {
        await fetchData(`${backendApiUrl}/users`, { method: 'POST', body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }) });
    }

    const { data, isLoading, error, fetchData } = useFetch<RegisterCredentials>();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (data) {
            navigate(`/`);
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
                required={true}
                {...register("username")}
            />
            <p>{errors.username?.message}</p>

            <TextInput
                id="email"
                type="string"
                placeholder="Email"
                required={true}
                {...register("email")}
            />
            <p>{errors.email?.message}</p>

            <TextInput
                id="password"
                type="password"
                placeholder="Password"
                required={true}
                {...register("password")}
            />
            <p>{errors.password?.message}</p>

            <RegisterButton />

        </form>

    );
}