"use client";
import { getAllFollowing } from "@/src/api/userApi";
import useUserStore from "@/src/stores/userStore";
import { Avatar, Button, HStack, Spacer } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaStore } from "react-icons/fa";

const FollowingPage = () => {
    const accountDetails = useUserStore((state) => state.accountDetails);

    const followingListQuery = useQuery({
        queryKey: ["user", accountDetails?._id, "following"],
        queryFn: () => getAllFollowing(accountDetails!._id),
        enabled: accountDetails !== null,
    });
    const followingList = followingListQuery.data as {
        firstName: string;
        lastName: string;
        _id: string;
    }[];

    return (
        <div className="w-[85vw] 2xl:w-[60vw] min-h-screen flex flex-col items-center p-6 mt-4 bg-white rounded-lg shadow">
            <p className="text-xl font-semibold mb-8 mt-4">Following</p>
            {followingList?.length <= 0 && (
                <p>Bạn chưa theo dõi ai</p>
            )}
            <div className="w-full grid grid-cols-3 justify-items-center gap-6">
                {followingList?.map((following) => (
                    <HStack
                        border="1px"
                        borderColor="gray.200"
                        p={2}
                        rounded="lg"
                        w="full"
                        key={following._id}
                    >
                        <HStack>
                            <Avatar name={following.firstName} />
                            <p className="">
                                {following.firstName} {following.lastName}
                            </p>
                        </HStack>
                        <Spacer />
                        <Button
                            size="xs"
                            variant="outline"
                            leftIcon={<FaStore />}
                            as={Link}
                            href={`/user/${following._id}`}
                        >
                            Xem
                        </Button>
                    </HStack>
                ))}
            </div>
        </div>
    );
};

export default FollowingPage;
