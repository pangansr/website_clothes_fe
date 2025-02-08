"use client";
import { getSellerProducts } from "@/src/api/productsApi";
import {
    fetchUserDetails,
    followUser,
    getAllFollowers,
    getAllFollowing,
    unfollowUser,
} from "@/src/api/userApi";
import NewProductModal from "@/src/components/modals/NewProductModal";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import useUserStore, { UserType } from "@/src/stores/userStore";
import {
    Avatar,
    Button,
    HStack,
    Spacer,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { FaPaperPlane } from "react-icons/fa";
import ProductCard, { ProductType } from "@/src/components/product/ProductCard";

const UserProfilePage = () => {
    const toast = useToast();
    const router = useRouter();
    const paramsId = useParams().userId as string;
    const accountDetails = useUserStore((state) => state.accountDetails);
    const addProductModalDisclosure = useDisclosure();
    const queryClient = useQueryClient();

    // Seller Details
    const userDetailsQuery = useQuery({
        queryKey: ["user", paramsId],
        queryFn: () => fetchUserDetails(paramsId),
    });
    const userDetails: UserType = userDetailsQuery?.data;

    // Products of the seller
    const productsQuery = useQuery({
        queryKey: ["products", paramsId],
        queryFn: () => getSellerProducts(paramsId),
        enabled: userDetailsQuery?.data != undefined,
    });

    // Get seller followers
    const getFollowersQuery = useQuery({
        queryKey: ["user", "followers", paramsId],
        queryFn: () => getAllFollowers(paramsId),
        enabled: userDetailsQuery?.data != undefined,
    });
    useEffect(() => {
        console.log("Followers Data:", getFollowersQuery.data);
        console.log("Type:", typeof getFollowersQuery.data);
        console.log("Is Array?", Array.isArray(getFollowersQuery.data));
    }, [getFollowersQuery.data]);
console.log("param",paramsId);



    // Get seller following
    const getFollowingQuery = useQuery({
        
        queryKey: ["user", "following", paramsId],
        queryFn: () => getAllFollowing(paramsId),
        enabled: userDetailsQuery?.data != undefined,
    });

    // Check if the current user followed this seller
    // const isAlreadyFollowed = getFollowersQuery.data?.find(
    //     (follower: { _id: string; firstName: string; lastName: string }) =>
    //         follower._id === accountDetails?._id
    // );

    const isAlreadyFollowed = Array.isArray(getFollowersQuery.data) 
    ? getFollowersQuery.data.find(
        (follower: { _id: string; firstName: string; lastName: string }) =>
            follower._id === accountDetails?._id
    ) 
    : undefined;


    const followUserMutation = useMutation({
        mutationFn: () => followUser(paramsId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", "followers", paramsId],
            });

            toast({
                title: "You follow this seller",
                status: "success",
                isClosable: true,
                duration: 1000,
                position: "top",
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
            });
        },
    });

    const unfollowUserMutation = useMutation({
        mutationFn: () => unfollowUser(paramsId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", "followers", paramsId],
            });

            toast({
                title: "You unfollow this seller",
                status: "warning",
                isClosable: true,
                duration: 1000,
                position: "top",
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
        <>
            <div className="w-[85vw] 2xl:w-[65vw] min-h-screen flex flex-col items-center p-4">
                <div className="w-full flex items-center p-4 mt-4">
                    <HStack spacing={4}>
                        <Avatar name={userDetails?.firstName} size="xl" />
                        <div>
                            <HStack>
                                <h1 className="text-2xl font-bold">
                                    {userDetails?.firstName}{" "}
                                    {userDetails?.lastName}
                                </h1>
                                <p className="text-gray-600">
                                    @{userDetails?.username}
                                </p>
                            </HStack>
                            <HStack spacing={4} ml={1}>
                                <p className="text-gray-600 font-medium text-sm">
                                    Following:{" "}
                                    <span className="text-blue-600">
                                        {getFollowingQuery.data?.length}
                                    </span>
                                </p>
                                <p className="text-gray-600 font-medium text-sm">
                                    Followers:{" "}
                                    <span className="text-blue-600">
                                        {" "}
                                        {getFollowersQuery.data?.length}
                                    </span>
                                </p>
                            </HStack>
                        </div>
                    </HStack>
                    <Spacer />

                    {accountDetails?._id === paramsId &&
                    accountDetails?.role === "Seller" ? (
                        <HStack spacing={4}>
                            <Button
                                as={Link}
                                href="/user/settings"
                                colorScheme="blue"
                                variant="outline"
                                rounded="full"
                                px={8}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                leftIcon={<BsPlus size={26} />}
                                colorScheme="blue"
                                rounded="full"
                                onClick={addProductModalDisclosure?.onOpen}
                            >
                                Add product
                            </Button>
                        </HStack>
                    ) : (
                        <HStack spacing={4}>
                            {isAlreadyFollowed ? (
                                <Button
                                    colorScheme="blue"
                                    variant="outline"
                                    rounded="full"
                                    px={8}
                                    onClick={() =>
                                        unfollowUserMutation.mutate()
                                    }
                                    isLoading={unfollowUserMutation?.isLoading}
                                >
                                    Unfollow
                                </Button>
                            ) : (
                                <Button
                                    colorScheme="blue"
                                    // variant="outline"
                                    rounded="full"
                                    px={8}
                                    onClick={() => followUserMutation.mutate()}
                                    isLoading={followUserMutation?.isLoading}
                                >
                                    Follow
                                </Button>
                            )}
                            <Button
                                leftIcon={<FaPaperPlane />}
                                colorScheme="blue"
                                rounded="full"
                                px={6}
                                isDisabled
                            >
                                Message
                            </Button>
                        </HStack>
                    )}
                </div>
                <div className="w-full flex items-center justify-around p-6 mt-4 mb-6 rounded-lg bg-gray-50 shadow">
                    <p className="font-medium">
                        Location:{" "}
                        <span className="text-blue-600">
                            {userDetails?.location}
                        </span>
                    </p>
                    <p className="font-medium">
                        Total Products:{" "}
                        <span className="text-blue-600">
                            {productsQuery?.data?.length}
                        </span>
                    </p>
                    <p className="font-medium">
                        Total Sales:{" "}
                        <span className="text-blue-600">
                            {" "}
                            {userDetails?.totalSales?.toFixed(2)}
                        </span>
                    </p>
                </div>

                <Tabs isFitted variant="line" w="full">
                    <TabList mb={6}>
                        <Tab fontWeight="medium">Products</Tab>
                        <Tab fontWeight="medium">Others</Tab>
                        <Tab fontWeight="medium">Others</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel p={0}>
                            <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center gap-2 lg:gap-6">
                                {productsQuery?.data?.map(
                                    (product: ProductType) => (
                                        <ProductCard
                                            key={product._id}
                                            productData={product}
                                        />
                                    )
                                )}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <p>two!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>three!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>

            <NewProductModal
                isOpen={addProductModalDisclosure?.isOpen}
                onClose={addProductModalDisclosure?.onClose}
            />
        </>
    );
};

export default UserProfilePage;
