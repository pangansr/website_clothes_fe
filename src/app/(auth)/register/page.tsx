"use client";
import { registerUser } from "@/src/api/authApi";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import {
    Button,
    HStack,
    Image,
    Input,
    Radio,
    RadioGroup,
    Stack,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

const Registerpage = () => {
    const router = useRouter();
    const toast = useToast();
    const [registerDetails, setRegisterDetails] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        location: "",
        role: "",
    });
    const [role, setRole] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setRegisterDetails((state) => ({
            ...state,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Gửi yêu cầu đăng ký người dùng
            await registerUser({ ...registerDetails, role });
        
            // Reset dữ liệu sau khi đăng ký thành công
            setRegisterDetails({
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                role: "",
                location: "",
            });
            setRole("");
        
            // Hiển thị thông báo thành công
            toast({
                title: "Registration Complete",
                status: "success",
                isClosable: true,
                duration: 3000,
                position: "top",
                variant: "subtle",
            });
        
           
        
        } catch (error: any) {
            console.log(error);
        
            // Lấy thông báo lỗi
            const errMessage =
                error?.response?.data?.error?.message || "An error occurred";
        
            // Hiển thị thông báo lỗi
            toast({
                title: errMessage,
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top",
                variant: "solid",
            });
        }
         finally {
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
                       hỗ trợ?
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
                       Tạo tài khoản của bạn
                    </p>
                    <form onSubmit={handleSubmit}>
                        <HStack mb={4}>
                            <Input
                                type="text"
                                placeholder="tên người dùng"
                                name="firstName"
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Số điện thoại"
                                name="lastName"
                                onChange={handleInputChange}
                                required
                            />
                        </HStack>
                        <Input
                            type="text"
                            placeholder="email"
                            mb={4}
                            name="username"
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="mật khẩu"
                            mb={4}
                            name="password"
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            name="confirmPassword"
                            onChange={handleInputChange}
                            required
                        />
                        <RadioGroup
                            w="full"
                            mt={4}
                            onChange={setRole}
                            value={role}
                            className="flex justify-center items-center "
                        >
                            <Stack direction="row" gap={4}>
                                <Radio value="Buyer" isRequired>
                                    Người mua
                                </Radio>
                                <Radio value="Seller" isRequired>
                                    Người bán
                                </Radio>
                            </Stack>
                        </RadioGroup>
                        <Button
                            w="full"
                            mt={4}
                            colorScheme="blue"
                            type="submit"
                            isLoading={isLoading}
                            spinnerPlacement="start"
                        >
                            Tạo tài khoản
                        </Button>
                    </form>
                    <small className="w-full text-center mt-2">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Đăng nhập
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Registerpage;
