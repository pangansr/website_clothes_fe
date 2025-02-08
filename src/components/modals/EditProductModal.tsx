"use client";
import { updateProductDetails } from "@/src/api/productsApi";
import useUserStore from "@/src/stores/userStore";
import {
    Avatar,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    Image,
    HStack,
    VStack,
    Button,
    Input,
    Textarea,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormLabel,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductType } from "../product/ProductCard";
import { usePathname, useRouter } from "next/navigation";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";

export type EditProductType = {
    productName: string;
    productImg: File;
    description: string;
    category: string;
    price: any;
    stocks: any;
};

type NewProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    productData: ProductType;
};

const EditProductModal = ({
    isOpen,
    onClose,
    productData,
}: NewProductModalProps) => {
    const queryClient = useQueryClient();
    const toast = useToast();
    const pathname = usePathname();
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState(
        productData?.productImg?.url
    );
    const { register, handleSubmit, setValue } = useForm<EditProductType>();

    const accountDetails = useUserStore((state) => state.accountDetails);
    const products: ProductType[] | undefined = queryClient.getQueryData([
        "products",
    ]);
    const categories = [
        ...new Set(products?.map((product: ProductType) => product.category)),
    ];

    // upload img and display in the ui
    const handleImgUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result as string);
        };

        if (file) {
            reader.readAsDataURL(file);
            setValue("productImg", file);
        }
    };

    const newProductMutation = useMutation({
        mutationFn: (formData: FormData) =>
            updateProductDetails(formData, productData?._id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products", accountDetails?._id],
            });

            toast({
                title: "Product details changed",
                status: "success",
                isClosable: true,
                position: "top-left",
                variant: "left-accent",
                duration: 3000,
            });
            onClose();
            setPreviewImage("");
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
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setPreviewImage(productData?.productImg?.url);
            }}
            size="3xl"
        >
            <form
                onSubmit={handleSubmit((data) => {
                    const formData = new FormData();
                    formData.set("productName", data.productName);
                    formData.set("description", data.description);
                    formData.set("price", data.price);
                    formData.set("stocks", data.stocks);
                    formData.set("productImg", data.productImg);
                    formData.set("category", data.category);

                    newProductMutation.mutate(formData);
                })}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update product details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="w-full flex justify-center items-center gap-10">
                            <VStack w="45%">
                                <Image
                                    w="full"
                                    h="20rem"
                                    objectFit="cover"
                                    rounded="lg"
                                    src={previewImage}
                                    fallbackSrc="https://via.placeholder.com/400"
                                    alt="Product preview"
                                />
                                <Button size="sm" w="full" colorScheme="blue">
                                    <label
                                        htmlFor="productImg-upload"
                                        className="w-full"
                                    >
                                        Upload Product image
                                    </label>
                                    <input
                                        onChange={handleImgUpload}
                                        type="file"
                                        accept="image/*"
                                        id="productImg-upload"
                                        className="hidden"
                                    />
                                </Button>
                            </VStack>

                            <VStack w="55%" spacing={0}>
                                <FormLabel w="full">Product name:</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Product name"
                                    autoComplete="off"
                                    required
                                    mb={2}
                                    {...register("productName", {
                                        required: true,
                                    })}
                                    defaultValue={productData.productName}
                                />
                                <FormLabel w="full">Description:</FormLabel>
                                <Textarea
                                    height="10rem"
                                    placeholder="Description"
                                    {...register("description", {
                                        required: true,
                                    })}
                                    required
                                    mb={2}
                                    defaultValue={productData.description}
                                />
                                <HStack w="full" mb={2}>
                                    <VStack spacing={0}>
                                        <FormLabel w="full">Stocks:</FormLabel>
                                        <NumberInput
                                            size="md"
                                            defaultValue={productData.stocks}
                                            min={1}
                                        >
                                            <NumberInputField
                                                placeholder="Stocks"
                                                {...register("stocks", {
                                                    required: true,
                                                    min: 1,
                                                })}
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </VStack>

                                    <VStack spacing={0}>
                                        <FormLabel w="full">Price:</FormLabel>
                                        <NumberInput
                                            size="md"
                                            defaultValue={productData.price}
                                            min={1}
                                        >
                                            <NumberInputField
                                                placeholder="Price"
                                                {...register("price", {
                                                    required: true,
                                                    min: 1,
                                                })}
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </VStack>
                                </HStack>

                                <FormLabel w="full">Category:</FormLabel>
                                <Select
                                    placeholder="- Product Category -"
                                    required
                                    mb={2}
                                    {...register("category", {
                                        required: true,
                                    })}
                                    defaultValue={productData.category}
                                >
                                    {categories?.map(
                                        (category: string, index) => (
                                            <option
                                                value={category}
                                                key={index}
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </VStack>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            isDisabled={!previewImage}
                            type="submit"
                            colorScheme="blue"
                            isLoading={newProductMutation?.isLoading}
                            spinnerPlacement="start"
                        >
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default EditProductModal;
