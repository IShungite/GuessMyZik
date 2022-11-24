import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { IAuthInputs } from "../../@Types/Form/IFormInputs";
import { loginSchema } from "../../schemas/AuthSchema";
import { Alert, Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import LoginButton from "../LoginButton/LoginButton";
import useFetch from "../../hooks/useFetch";
import { Credentials } from "../../@Types/Auth/User";
import { useSetRecoilState } from "recoil";
import { authState } from "../../atoms/authAtom";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function LoginForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<IAuthInputs>({
        resolver: yupResolver(loginSchema)
    });
    //const onSubmit = () => console.log(data);
    const onSubmit = async (formData: IAuthInputs) => {
        await fetchData(`http://localhost:3000/login`, { method: 'POST', body: JSON.stringify({ username: formData.username, password: formData.password }) });
    }

    const { data, isLoading, error, fetchData } = useFetch<Credentials>();
    const setAuth = useSetRecoilState(authState);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (data) {
            setAuth(data);
            localStorage.setItem("auth", JSON.stringify(data));
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
                id="password"
                type="password"
                placeholder="Password"
                required={true}
                {...register("password")}
            />
            <p>{errors.password?.message}</p>

            <LoginButton />

        </form>

    );
}