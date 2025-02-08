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
                    Manage and protect your account
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
                                name={accountDetails?.firstName}
                                size="xl"
                                position="relative"
                            >
                                <BsCamera className="absolute -bottom-2 right-1 text-[2rem] p-2 bg-white shadow-custom rounded-full text-black" />
                            </Avatar>
                        </VStack>

                        <HStack mb={4}>
                            <VStack spacing={0}>
                                <FormLabel w="full" ml={4}>
                                    First name:
                                </FormLabel>
                                <Input
                                    defaultValue={accountDetails?.firstName}
                                    type="text"
                                    placeholder="First Name"
                                    {...register("firstName", {
                                        required: true,
                                    })}
                                />
                            </VStack>
                            <VStack spacing={0}>
                                <FormLabel w="full" ml={4}>
                                    Last name:
                                </FormLabel>
                                <Input
                                    defaultValue={accountDetails?.lastName}
                                    type="text"
                                    placeholder="Last Name"
                                    {...register("lastName", {
                                        required: true,
                                    })}
                                />
                            </VStack>
                        </HStack>
                        <VStack spacing={0}>
                            <FormLabel w="full" ml={4}>
                                Username:
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="Username"
                                {...register("username", { required: true })}
                                mb={4}
                                defaultValue={accountDetails?.username}
                            />
                        </VStack>

                        <Button
                            w="full"
                            type="submit"
                            mt={2}
                            colorScheme="blue"
                            isLoading={updateAccountDetailsMutation.isLoading}
                            isDisabled={
                                watch().firstName ===
                                    accountDetails?.firstName &&
                                watch().lastName === accountDetails?.lastName &&
                                watch().username === accountDetails?.username
                            }
                        >
                            Save Changes
                        </Button>
                    </form>
                    <Link
                        href="/user/settings/password"
                        className="text-sm mt-4 text-blue-600 hover:underline"
                    >
                        Change Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserSettingsPage;
