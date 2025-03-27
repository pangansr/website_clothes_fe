"use client";
import { useParams } from "next/navigation";
import {
  Avatar,
  Button,
  HStack,
  Image,
  Spacer,
  VStack,
  useToast,
  Box,
  Center,
} from "@chakra-ui/react";
import { BsCartPlus } from "react-icons/bs";
import { FaStoreAlt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/src/api/cartApi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getSingleProduct } from "@/src/api/productsApi";
import { set } from "react-hook-form";

const ProductOverview = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { productId } = useParams(); // Lấy productId từ URL
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  console.log("🔎 Product ID từ URL:", productId);

  // Gọi API để lấy dữ liệu sản phẩm
  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getSingleProduct(productId as string), 
    enabled: !!productId,   
  });

  console.log("📦 productData:", productData);


  useEffect(() => {
    if (productData?.productImg?.length > 0) {
      setMainImage(productData.productImg[0].url);
    }
  }, [productData]);

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(productId as string, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Thêm vào giỏ hàng thành công",
        status: "success",
        isClosable: true,
        duration: 1000,
        position: "top",
        variant: "subtle",
      });
    },
    onError: (err: any) => {
      toast({
        title: err.response?.data?.error?.message || "An error occurred",
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top",
        variant: "top-accent",
      });
    },
  });

  if (isLoading) return <p>Đang tải...</p>;
  if (isError || !productData) return <p>Không tìm thấy sản phẩm!</p>;

  return (
    <div className="w-full flex flex-col md:flex-row gap-2">
      {/* Phần hình ảnh (4 phần) */}
      <div className="w-full md:w-6/12 flex flex-col items-center">
        <Box
          textAlign="center"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box width="100%">
            <Image
              src={mainImage}
              fallbackSrc="https://via.placeholder.com/500"
              objectFit="cover"
              width="100%"
              height="auto"
              aspectRatio={16 / 16}
              rounded="xl"
              boxShadow="lg"
              alt="Product Image"
            />
          </Box>

          {productData?.productImg?.length > 0 && (
            <HStack
              mt={4}
              spacing={2}
              justifySelf="center"
              alignItems="center"
              flexWrap="wrap"
            >
              {productData.productImg.map(
                (img: { url: string }, index: number) => (
                  <Image
                    key={index}
                    src={img.url}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    border={
                      mainImage === img.url ? "2px solid #3182CE" : "none"
                    }
                    _hover={{ opacity: 0.3 }}
                    onClick={() => setMainImage(img.url)}
                    alt={`Product image ${index + 1}`}
                  />
                )
              )}
            </HStack>
          )}
        </Box>
      </div>

      <div className="w-full md:w-6/12 flex flex-col gap-2">
        {/* Thông tin sản phẩm */}
        <div className="w-full flex flex-col gap-4 p-6 bg-white shadow-sm rounded-xl">
        <VStack w="full" align="start" spacing={1}>
    <h1 className="text-3xl font-bold">{productData?.productName}</h1>
    <p className="p-2 text-red-500 font-semibold text-2xl">
        {productData?.price?.toLocaleString()} VNĐ
    </p>
</VStack>


          <p className="my-4 font-medium text-center w-full max-w-[100%] break-words">
            {productData?.description}
          </p>

          <div className="w-full flex justify-around text-center">
            <VStack spacing={1}>
              <p className="font-semibold text-gray-600">Loại sản phẩm</p>
              <p className="text-gray-800">{productData?.category}</p>
            </VStack>
            <VStack spacing={1}>
              <p className="font-semibold text-gray-600">Số lượng kho</p>
              <p className="text-gray-800">{productData?.stocks}</p>
            </VStack>
            <VStack spacing={1}>
              <p className="font-semibold text-gray-600">Đã bán</p>
              <p className="text-gray-800">{productData?.sold}</p>
            </VStack>
          </div>

          {/* Nút thao tác */}
          <HStack spacing={5} className="mt-4">
            <Button
              variant="outline"
              borderColor="black"
              leftIcon={<BsCartPlus size={20} />}
              onClick={() => addToCartMutation.mutate()}
              isLoading={addToCartMutation.isLoading}
              isDisabled={productData?.stocks == 0}
              className="min-w-[40px] px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Thêm vào giỏ hàng</span>
            </Button>

            {/* Chọn số lượng */}
            <VStack>
              <p className="font-semibold">Số lượng</p>
              <HStack>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
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
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </Button>
              </HStack>
            </VStack>

            <Button
              rounded="full"
              variant="outline"
              borderColor="black"
              isDisabled
            >
              Mua
            </Button>
          </HStack>
        </div>

        {/* Thông tin người bán */}
        <div className="w-full flex items-center p-4 bg-white shadow-sm rounded-lg">
          <HStack>
            <Avatar name={productData?.seller?.username} />
            <VStack spacing={0}>
              <p className="font-semibold">
                {productData?.seller?.firstName} {productData?.seller?.lastName}
              </p>
              <small className="w-full">
                Sản phẩm: {productData?.seller?.productCount || 0}
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
            Xem
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
