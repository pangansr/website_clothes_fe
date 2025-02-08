import {
    HStack,
    IconButton,
    Image,
    Spacer,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { BsPencil, BsStarFill, BsTrash } from "react-icons/bs";
import RemoveProductAlert from "../alerts/RemoveProductAlert";
import { usePathname } from "next/navigation";
import useUserStore from "@/src/stores/userStore";
import EditProductModal from "../modals/EditProductModal";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'    
export type ProductType = {
    productName: string;
    productImg: {
        url: string;
        id: string;
    };
    _id: string;
    description: string;
    category: string;
    price: number;
    stocks: number;
    sold: number;
    createdAt?: string;
    updatedAt?: string;
    seller?: {
        _id: string;
        firstName: string;
        lastName: string;
        username: string;
        location: string;
        totalSales: number;
    };
};

export type ProductCardProps = {
    productData: ProductType;
};

// Manually set cache data
//queryClient.setQueryData(["products", sellerId], products);



const ProductCard = ({ productData }: ProductCardProps) => {
    const { productName, productImg, _id, price, sold, seller } = productData;
    console.log("dddd",productImg?.url);
    const pathname = usePathname();
    const accountDetails = useUserStore((state) => state.accountDetails);
    const RemoveProductAlertDisclosure = useDisclosure();
    const editProductDisclosure = useDisclosure();

    const imageHValues = useBreakpointValue({
        base: "8rem", // xs
        lg: "11rem",
    });

    const isSellerProfile = pathname === `/user/${accountDetails?._id}`;

    return (
        <>
            <div className="relative">
                {isSellerProfile && (
                    <div className=" absolute z-30 -top-2 -left-2 flex items-center gap-2">
                        <IconButton
                            colorScheme="blue"
                            aria-label="Search database"
                            icon={<BsPencil />}
                            size="xs"
                            rounded="full"
                            onClick={() => editProductDisclosure.onOpen()}
                        />
                        <IconButton
                            colorScheme="red"
                            aria-label="Search database"
                            icon={<BsTrash />}
                            size="xs"
                            rounded="full"
                            onClick={() =>
                                RemoveProductAlertDisclosure.onOpen()
                            }
                        />
                    </div>
                )}

                <Link href={`/product/${_id}`}>
                    <div className="relative w-[9rem] h-[13rem] md:w-[12rem] md:h-[16rem] bg-white flex flex-col rounded-sm shadow-sm overflow-hidden hover:scale-[1.01] hover:shadow-md transition">
                        <p className="absolute top-2 right-2 px-2 py-1 text-red-600 bg-white text-xs font-semibold rounded-sm">
                            P{price}
                        </p>
                        <Image
                            w="full"
                            minH={imageHValues}
                            src={productImg?.url || "http://res.cloudinary.com/daxrbuhbx/image/upload/v1738906035/sp1.jpg.jpg"} // Nếu `null`, dùng ảnh mặc định
                            objectFit="cover"
                            loading="lazy"
                            alt="product"
                        />

                        <div className="w-full h-full flex flex-col p-2">
                            <p className="font-semibold text-xs md:text-sm">
                                {productName}
                            </p>
                            <Spacer />

                            <HStack spacing={1}>
                                <BsStarFill className="text-xs text-gray-400" />
                                <BsStarFill className="text-xs text-gray-400" />
                                <BsStarFill className="text-xs text-gray-400" />
                                <BsStarFill className="text-xs text-gray-400" />
                                <BsStarFill className="text-xs text-gray-400" />
                                <small className="font-semibold ml-1">
                                    {sold} Sold
                                </small>
                            </HStack>
                        </div>
                    </div>
                </Link>
            </div>

            <RemoveProductAlert
                warningDisclosure={RemoveProductAlertDisclosure}
                productId={_id}
            />
            <EditProductModal
                isOpen={editProductDisclosure?.isOpen}
                onClose={editProductDisclosure?.onClose}
                productData={productData}
            />
        </>
    );
};

export default ProductCard;
