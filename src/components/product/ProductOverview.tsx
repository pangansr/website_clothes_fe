import {
    Avatar,
    Button,
    HStack,
    Image,
    Spacer,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { BsCartPlus } from "react-icons/bs";
import { FaStoreAlt } from "react-icons/fa";
import { ProductType } from "./ProductCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/src/api/cartApi";
import { useState } from "react";
import Link from "next/link";

const ProductOverview = ({
    productData,
    sellerId,
}: {
    productData: ProductType;
    sellerId: string;
}) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(1);

    const sellerProducts: ProductType[] | undefined = queryClient.getQueryData([
        "products",
        sellerId,
    ]);
    console.log("productDataqqq",sellerId);
    const addToCartMutation = useMutation({
        
        mutationFn: () => addToCart(productData?._id, quantity),
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast({
                title: "Added to Cart",
                status: "success",
                isClosable: true,
                duration: 1000,
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

    return (
        <div className="w-full h-full flex justify-center gap-4">
            <Image
                src={productData?.productImg?.url||"http://res.cloudinary.com/daxrbuhbx/image/upload/v1738906035/sp1.jpg.jpg"}
                fallbackSrc="https://via.placeholder.com/500"
                objectFit="cover"
                aspectRatio="4/3"
                width="70rem"
                height="30rem"
                rounded="xl"
                boxShadow="sm"
                loading="lazy"
                alt="Product img"
            />
            <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full h-full flex flex-col items-center justify-around gap-4 p-6 bg-white  shadow-sm rounded-xl">
                    <HStack w="full">
                        <h1 className="text-2xl font-bold ">
                            {productData?.productName}
                        </h1>
                        <Spacer />
                        <p className="font-bold text-xl p-2 text-red-500">
                            P{productData?.price}
                        </p>
                    </HStack>

                    <p className="my-4 font-medium text-center">
                        {productData?.description}
                    </p>

                    <div className="w-full flex justify-around">
                        <VStack spacing={0}>
                            <p className="font-semibold">Category</p>
                            <p>{productData?.category}</p>
                        </VStack>
                        <VStack spacing={0}>
                            <p className="font-semibold">Stocks</p>
                            <p>{productData?.stocks}</p>
                        </VStack>
                        <VStack spacing={0}>
                            <p className="font-semibold">Sold</p>
                            <p>{productData?.sold}</p>
                        </VStack>
                    </div>

                    <HStack spacing={5}>
                        <Button
                            w="10rem"
                            rounded="full"
                            variant="outline"
                            borderColor="black"
                            leftIcon={<BsCartPlus size={20} />}
                            onClick={() => addToCartMutation.mutate()}
                            isLoading={addToCartMutation.isLoading}
                            isDisabled={productData?.stocks == 0}
                        >
                            Add to cart
                        </Button>
                        <VStack>
                            <p className="font-semibold">Quantity</p>
                            <HStack>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        setQuantity((prev) => prev - 1)
                                    }
                                    isDisabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <p className="px-3 py-1 bg-gray-100 rounded-md font-semibold">
                                    {quantity}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                >
                                    +
                                </Button>
                            </HStack>
                        </VStack>

                        <Button
                            w="10rem"
                            rounded="full"
                            colorScheme="blue"
                            isDisabled
                        >
                            Buy Now
                        </Button>
                    </HStack>
                </div>
                <div className="w-full flex items-center p-4 bg-white shadow-sm rounded-lg">
                    <HStack>
                        <Avatar name={productData?.seller?.username} />
                        <VStack spacing={0}>
                            <p className="font-semibold">
                                {productData?.seller?.firstName}{" "}
                                {productData?.seller?.lastName}
                            </p>
                            <small className="w-full">
                                Products: {sellerProducts?.length}
                            </small>
                        </VStack>
                    </HStack>
                    <Spacer />

                    <Button
                        leftIcon={<FaStoreAlt size={18} />}
                        variant="outline"
                        size="sm"
                        as={Link}
                        href={`/user/${productData?.seller?._id}`}
                    >
                        View Shop
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductOverview;
