"use client";
import { addNewProduct } from "@/src/api/productsApi";
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
import { isTokenAvailable } from "@/src/utils/checkAccessToken";

type NewProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export type NewProductType = {
    productName: string;
    productImg: [];
    description: string;
    category: string;
    price: any;
    stocks: any;
};


const NewProductModal = ({ isOpen, onClose }: NewProductModalProps) => {
    const queryClient = useQueryClient();
    const toast = useToast();
    const [previewImage, setPreviewImage] = useState("");
    const { register, handleSubmit, setValue } = useForm<NewProductType>();

    const accountDetails = useUserStore((state) => state.accountDetails);
    const products: ProductType[] | undefined = queryClient.getQueryData([
        "products",
    ]);
    // const categories = [
    //     ...new Set(products?.map((product: ProductType) => product.category)),
    // ];

    
const categories = ["Thời trang", "Điện tử", "Gia dụng", "Mỹ phẩm & Chăm sóc cá nhân","Sách & Văn phòng phẩm","Thực phẩm & Đồ uống","Đồ chơi & Mẹ & Bé","Thể thao & Dã ngoại","Xe máy, Ô tô & Xe đạp","Nhà cửa & Đời sống","Phụ kiện thời trang","Đồng hồ & Trang sức","Sức khỏe & Sắc đẹp","Voucher & Dịch vụ","Khác"];
"use client";
const [error, setError] = useState("");
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [previewImages, setPreviewImages] = useState<string[]>([]);

const handleImgUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files); // Lưu file để gửi lên API

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls); // Lưu URL để hiển thị ảnh xem trước
};

    // // upload img and display in the ui
    // const handleImgUpload = (e: ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target?.files?.[0];
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         setPreviewImage(reader.result as string);
    //     };

    //     if (file) {
    //         reader.readAsDataURL(file);
    //         setValue("productImg", file);
    //     }
    // };

    const newProductMutation = useMutation({
        mutationFn: addNewProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products", accountDetails?._id],
            });
    
            toast({
                title: "New product uploaded!",
                status: "success",
                isClosable: true,
                position: "top-left",
                variant: "left-accent",
                duration: 3000,
            });
            onClose();
            setPreviewImages([]);
        },
        onError: (err: any) => {
            const errMessage =
                err?.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!";
    
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
                setPreviewImages([]);
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
                    selectedFiles.forEach((file) => {
                        formData.append("productImg", file);
                    });
                    formData.set("category", "aaa");

                    newProductMutation.mutate(formData);
                })}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="w-full flex justify-center items-center gap-10">
                        <VStack w="45%">



    <HStack spacing={2} wrap="wrap">
        {previewImages.length > 0 ? (
            previewImages.map((image, index) => (
                <Image
                    key={index}
                    w="full"
                    h="20rem"
                    objectFit="cover"
                    rounded="lg"
                    src={image}
                    fallbackSrc="https://via.placeholder.com/400"
                    alt={`Product preview ${index + 1}`}
                />
            ))
        ) : (
            <Image
                w="full"
                h="20rem"
                objectFit="cover"
                rounded="lg"
                src="https://via.placeholder.com/400"
                alt="Product preview"
            />
        )}
    </HStack>


    <Button size="sm" w="full" colorScheme="blue">
        <label htmlFor="productImg-upload" className="w-full">
            Tải ảnh lên
        </label>
        <input
            onChange={handleImgUpload}
            type="file"
            accept="image/*"
            id="productImg-upload"
            className="hidden"
            multiple  // Cho phép chọn nhiều ảnh
            required
        />
    </Button>
</VStack>


                            <VStack w="55%" spacing={0}>
                                <FormLabel w="full">Tên sản phẩm:
                                </FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Tên sản phẩm"
                                    autoComplete="off"
                                    required
                                    mb={2}
                                    {...register("productName", {
                                        required: true,
                                    })}
                                />
                                <FormLabel w="full">Mô tả:</FormLabel>
                                <Textarea
                                    height="10rem"
                                    placeholder="Mô tả sản phẩm"
                                    {...register("description", {
                                        required: true,
                                    })}
                                    required
                                    mb={2}
                                />
                                <HStack w="full" mb={2}>
                                    <VStack spacing={0}>
                                        <FormLabel w="full">Số lượng trong kho:</FormLabel>
                                        <NumberInput
                                            size="md"
                                            defaultValue={1}
                                            min={1}
                                        >
                                            <NumberInputField
                                                placeholder="Số lượng trong kho"
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
                                        <FormLabel w="full">Giá:</FormLabel>
                                        <NumberInput
                                            size="md"
                                            defaultValue={1}
                                            min={1}
                                        >
                                            <NumberInputField
                                                placeholder="Giá"
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
                                    placeholder="- Danh mục sản phẩm -"
                                    required
                                    mb={2}
                                    {...register("category", {
                                        required: true,
                                    })}
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
                            isDisabled={!previewImages}
                            type="submit"
                            colorScheme="blue"
                            isLoading={newProductMutation?.isLoading}
                            spinnerPlacement="start"
                        >
                            Tạo mới
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default NewProductModal;
