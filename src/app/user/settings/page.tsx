"use client";
import {
    updateAccountDetails,
    updateAccountDetailsType,
} from "@/src/api/userApi";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import useUserStore from "@/src/stores/userStore";
import {
    Avatar,
    Button,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    Input,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BsCamera } from "react-icons/bs";
import { useForm } from "react-hook-form";
import Link from "next/link";

const UserSettingsPage = () => {
    const toast = useToast();
    const router = useRouter();
    const accountDetails = useUserStore((state) => state.accountDetails);
    const getAccountDetails = useUserStore((state) => state.getAccountDetails);
    const { register, handleSubmit, watch } =
        useForm<updateAccountDetailsType>();

    const updateAccountDetailsMutation = useMutation({
        mutationFn: updateAccountDetails,
        onSuccess: () => {
            getAccountDetails();
            toast({
                title: "Update successfully",
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
                <p className="w-full text-lg font-medium">Account Details</p>
                <p className="w-full text-sm text-gray-700 mb-4">
                    quản lý và bảo vệ tài khoản của bạn
                </p>
                <Divider />
                <div className="w-[80%] flex flex-col items-center p-4 ">
                    <form
                        onSubmit={handleSubmit((data) =>
                            updateAccountDetailsMutation.mutate(data)
                        )}
                    >
                        <VStack mb={8}>
                            <Avatar
                                name={accountDetails?.username}
                                size="xl"
                                position="relative"
                            >
                                <BsCamera className="absolute -bottom-2 right-1 text-[2rem] p-2 bg-white shadow-custom rounded-full text-black" />
                            </Avatar>
                        </VStack>

                        <HStack mb={4}>
                            <VStack spacing={0}>
                                <FormLabel w="full" ml={4}>
                                   Tên người dùng:
                                </FormLabel>
                                <Input
                                    defaultValue={accountDetails?.username}
                                    type="text"
                                    placeholder="username"
                                    {...register("username", {
                                        required: true,
                                    })}
                                />
                            </VStack>
                            <VStack spacing={0}>
                                <FormLabel w="full" ml={4}>
                                    Số điện thoại:
                                </FormLabel>
                                <Input
                                    defaultValue={accountDetails?.phoneNumber}
                                    type="text"
                                    placeholder="phoneNumber"
                                    {...register("phoneNumber", {
                                        required: true,
                                    })}
                                />
                            </VStack>
                        </HStack>
                        <VStack spacing={0}>
                            <FormLabel w="full" ml={4}>
                                Email:
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="email"
                                {...register("email", { required: true })}
                                mb={4}
                                defaultValue={accountDetails?.email}
                            />
                        </VStack>

                        <Button
                            w="full"
                            type="submit"
                            mt={2}
                            colorScheme="blue"
                            isLoading={updateAccountDetailsMutation.isLoading}
                            isDisabled={
                                watch().username ===
                                    accountDetails?.username &&
                                watch().phoneNumber === accountDetails?.phoneNumber &&
                                watch().email === accountDetails?.email
                            }
                        >
                           Lưu thay đổi
                        </Button>
                    </form>
                    <Link
                        href="/user/settings/password"
                        className="text-sm mt-4 text-blue-600 hover:underline"
                    >
                        Đổi mật khẩu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserSettingsPage;
