import {
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Spacer,
    VStack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import CartItem, { CartItemType } from "./CartItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartCheckout, getCartItems, removeToCart } from "@/src/api/cartApi";
import { UserType } from "@/src/stores/userStore";
import SuccessOrder from "../alerts/SuccessOrder";
import ClearCartAlert from "../alerts/ClearCartAlert";
import { useEffect } from "react";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import { useRouter } from "next/navigation";

type CartProps = {
    onClose: () => void;
    isOpen: boolean;
    accountDetails: UserType;
};

const Cart = ({ onClose, isOpen, accountDetails }: CartProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToast();
    const successDisclosure = useDisclosure();
    const warningDisclosure = useDisclosure();

    const cartItemsQuery = useQuery({
        queryKey: ["cart"],
        queryFn: getCartItems,
        enabled: accountDetails != null,
    });

    // Get the total of each item in cart
    const totals: number[] = cartItemsQuery?.data?.map(
        (item: CartItemType) => item.inCart * item.price
    );
    // the total of all items in cart
    const grandTotal = totals?.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // Check out mutation
    const placeOrderMutation = useMutation({
        mutationFn: () => cartCheckout(accountDetails._id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["product"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });

            onClose();
            successDisclosure.onOpen();
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
        <>
            <Drawer onClose={onClose} isOpen={isOpen} size="md">
                <DrawerOverlay />
                <DrawerContent p={2}>
                    <DrawerCloseButton />
                    <DrawerHeader>Giỏ hàng</DrawerHeader>
                    <DrawerBody>
                        <div className="w-full h-full flex flex-col">
                            <div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
                                {cartItemsQuery.data?.length <= 0 && (
                                    <p className="w-full h-full flex justify-center items-center mt-6">
                                        Giỏ hàng hiện tại đang trống
                                    </p>
                                )}
                                {cartItemsQuery?.data?.map(
                                    (item: CartItemType) => (
                                        <CartItem
                                            item={item}
                                            key={item._id}
                                            onClose={onClose}
                                        />
                                    )
                                )}
                            </div>

                            <Divider />
                            <div className="w-full flex flex-col gap-4 mt-4">
                                <HStack>
                                    <p className="font-semibold">Tổng cộng</p>
                                    <Spacer />
                                    <HStack>
                                        <small className="text-gray-500 font-semibold">
                                            VNĐ
                                        </small>
                                        <p className="text-xl font-semibold">
                                            {grandTotal?.toFixed(2)}
                                        </p>
                                    </HStack>
                                </HStack>

                                <VStack>
                                    <Button
                                        w="full"
                                        colorScheme="blue"
                                        onClick={() =>
                                            placeOrderMutation.mutate()
                                        }
                                        isLoading={placeOrderMutation.isLoading}
                                        spinnerPlacement="start"
                                        isDisabled={
                                            cartItemsQuery?.data?.length === 0
                                        }
                                    >
                                        Đặt hàng
                                    </Button>
                                    <Button
                                        w="full"
                                        colorScheme="red"
                                        onClick={warningDisclosure.onOpen}
                                        isDisabled={
                                            cartItemsQuery?.data?.length === 0
                                        }
                                        variant="ghost"
                                    >
                                        Xóa tất cả
                                    </Button>
                                </VStack>
                            </div>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <ClearCartAlert warningDisclosure={warningDisclosure} />

            {successDisclosure.isOpen && (
                <SuccessOrder successDisclosure={successDisclosure} />
            )}
        </>
    );
};

export default Cart;
