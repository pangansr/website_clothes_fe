"use client";
import { loginUser } from "@/src/api/authApi";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import { Button, Image, Input, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";

const LoginPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await loginUser({ email, password });

            toast({
                title: "Đăng nhập thành công",
                status: "success",
                isClosable: true,
                duration: 3000,
                position: "top",
                variant: "subtle",
            });
            router.push("/");
        } catch (error: any) {
            console.log(error);
            toast({
                title: "Sai thông tin đăng nhập",
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top",
                variant: "solid",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            if (await isTokenAvailable()) {
                router.push("/");
            }
        };

        checkToken();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <nav className="absolute top-0 w-full flex justify-center p-4 bg-white shadow-custom">
                <div className="w-[60%] flex items-center justify-between">
                    <Link href="/">
                        <h1 className="text-2xl font-bold tracking-wider">
                           Clothes
                        </h1>
                    </Link>
                    <Link href="/" className="text-sm text-red-500">
                        Cần hỗ trợ?
                    </Link>
                </div>
            </nav>

            <div className="w-[60rem] h-[30rem] flex justify-center rounded-xl bg-white shadow-custom p-6">
                <div className="w-[50%] h-full flex justify-center items-center">
                    <Image
                        alt="illustration"
                        src="/illu.svg"
                        w="25rem"
                        loading="lazy"
                    />
                </div>

                <div className="w-[50%] h-full flex flex-col items-center justify-center p-6">
                    <p className="text-2xl font-semibold mb-6">
                        Đăng nhập vào tài khoản của bạn
                    </p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            placeholder="Email"
                            mb={4}
                            name="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="mật khẩu"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            w="full"
                            mt={4}
                            colorScheme="blue"
                            type="submit"
                            isLoading={isLoading}
                            spinnerPlacement="start"
                        >
                            Đăng nhập
                        </Button>
                    </form>
                    <small className="w-full text-center mt-2">
                        Không có tài khoản?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Đăng kí
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
