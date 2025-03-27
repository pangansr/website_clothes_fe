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
import EditProductModal from "../modals/EditProductModal";

export type ProductType = {
    productName: string;
    productImg: [{ url: string; id: string }];
    _id: string;
    description: string;
    price: number;
    stocks: number;
    category: string;
    sold: number;
    seller?: string;
};

export type ProductCardProps = { productData: ProductType };

const ProductCard = ({ productData }: ProductCardProps) => {
    const { productName, productImg, _id, price, sold, seller } = productData;
    const pathname = usePathname();
    const RemoveProductAlertDisclosure = useDisclosure();
    const editProductDisclosure = useDisclosure();
    
    const imageSize = useBreakpointValue({
        base: "8rem", 
        md: "10rem",
        lg: "12rem", 
    });

    const isSellerProfile = pathname === `/user/${seller}`;

    return (
        <>
            <div className="relative">
                {isSellerProfile && (
                    <div className="absolute z-30 -top-2 -left-2 flex gap-2">
                        <IconButton
                            colorScheme="blue"
                            aria-label="Edit Product"
                            icon={<BsPencil />}
                            size="xs"
                            rounded="full"
                            onClick={editProductDisclosure.onOpen}
                        />
                        <IconButton
                            colorScheme="red"
                            aria-label="Delete Product"
                            icon={<BsTrash />}
                            size="xs"
                            rounded="full"
                            onClick={RemoveProductAlertDisclosure.onOpen}
                        />
                    </div>
                )}

<Link href={`/product/${_id}`}>
    <div className="relative w-full max-w-[16rem] min-w-[12rem] bg-white border border-gray-200 
        rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">
        
        {/* Ảnh sản phẩm */}
        <div className="w-full aspect-[5/5] relative">
            <Image
                src={productImg[0]?.url || "/default-product.png"}
                alt="product"
                boxSize="100%"
                objectFit="cover"
            />
        </div>

        {/* Nội dung */}
        <div className="p-4 flex flex-col gap-2">
            {/* Giá sản phẩm */}
            <p className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg w-max">
                ${price}
            </p>

            {/* Tên sản phẩm */}
            <p className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2">
                {productName}
            </p>

            {/* Xếp hạng và số lượng bán */}
            <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                    <BsStarFill key={i} className="text-sm text-yellow-400" />
                ))}
                <small className="font-semibold ml-1 text-gray-600">
                    {sold} Đã bán
                </small>
            </div>
        </div>
    </div>
</Link>

            </div>

            <RemoveProductAlert
                warningDisclosure={RemoveProductAlertDisclosure}
                productId={_id}
            />
            <EditProductModal
                isOpen={editProductDisclosure.isOpen}
                onClose={editProductDisclosure.onClose}
                productData={productData}
            />
        </>
    );
};

export default ProductCard;
