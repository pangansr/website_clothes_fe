"use client";
import { changeAccountPassword } from "@/src/api/userApi";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import {
    Button,
    Divider,
    FormLabel,
    Input,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const PasswordSettingsPage = () => {
    const toast = useToast();
    const router = useRouter();

    const { register, handleSubmit } = useForm<{
        oldPassword: string;
        newPassword: string;
    }>();

    const changePasswordMutation = useMutation({
        mutationFn: changeAccountPassword,
        onSuccess: () => {
            toast({
                title: "You changed your password",
                status: "success",
                isClosable: true,
                duration: 2000,
                position: "top",
                variant: "subtle",
            });
        },
        onError: (err: any) => {
            const errMessage =
                err.response.data.error.message || "An error occured";
            toast({
                title: errMessage,
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top",
                variant: "top-accent",
            });
        },
    });

    useEffect(() => {
        const checkToken = async () => {
            if (!(await isTokenAvailable())) {
                router.push("/login");
            }
        };

        checkToken();
    }, []);

    return (
        <div className="w-full h-[70vh] flex items-center justify-center p-4">
            <div className="w-[40rem] flex flex-col items-center p-4 bg-white rounded-lg shadow">
                <p className="w-full text-lg font-medium">Change Password</p>
                <p className="w-full text-sm text-gray-700 mb-4">
                    Quản lý và bảo vệ tài khoản của bạn
                </p>
                <Divider />
                <div className="w-full flex flex-col items-center p-4 ">
                    <form
                        onSubmit={handleSubmit((data) => {
                            changePasswordMutation.mutate(data);
                        })}
                    >
                        <VStack spacing={0}>
                            <FormLabel w="full" ml={4}>
                                Old Password:
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="oldPassword"
                                {...register("oldPassword", { required: true })}
                                mb={4}
                            />
                        </VStack>
                        <VStack spacing={0}>
                            <FormLabel w="full" ml={4}>
                                New Password:
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="New Password"
                                {...register("newPassword", { required: true })}
                                mb={4}
                            />
                        </VStack>

                        <Button
                            w="full"
                            type="submit"
                            mt={4}
                            colorScheme="blue"
                            isLoading={changePasswordMutation.isLoading}
                        >
                            Change Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordSettingsPage;
