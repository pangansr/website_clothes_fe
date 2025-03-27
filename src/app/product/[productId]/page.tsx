"use client";
import { getSellerProducts, getSingleProduct } from "@/src/api/productsApi";
import ProductCard, { ProductType } from "@/src/components/product/ProductCard";
import ProductOverview from "@/src/components/product/ProductOverview";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserStore from "@/src/stores/userStore";
import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProductPage = () => {
    const router = useRouter();
    const productId = useParams().productId as string;
    const accountDetails = useUserStore((state) => state.accountDetails);
    const queryClient = useQueryClient();

    const allProducts: ProductType[] | undefined = queryClient.getQueryData(["products"]);


    const { data: productData, isLoading: isProductLoading } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getSingleProduct(productId),
    });

    // Lấy sản phẩm của cùng người bán
    const sellerId = productData?.seller?._id ?? "unknown";
    const { data: sellerProducts, isLoading: isSellerLoading } = useQuery({
        queryKey: ["sellerProducts", sellerId],
        queryFn: () => (sellerId === "unknown" ? Promise.resolve([]) : getSellerProducts(sellerId)),
        enabled: !!productData,
    });

    if (!accountDetails) {
        return <div className="w-full h-screen bg-[#EBEAF3] flex justify-center items-center">Đang tải...</div>;
    }

    return (
        <div className="w-full max-w-[1400px] flex flex-col items-center p-6 mb-6">
            {/* Đường dẫn điều hướng */}
            <nav className="w-full text-lg font-semibold text-gray-800 mb-4">
                <Link href="/">Chi tiết sản phẩm</Link> {" - "}
             
            </nav>

            {isProductLoading ? (
                <div className="w-full h-60 flex justify-center items-center">Đang tải...</div>
            ) : (
                <ProductOverview />
            )}

            {/* Danh sách sản phẩm liên quan */}
            {allProducts && (
                <section className="w-full flex flex-col gap-4 mt-14">
                    <p className="text-xl font-semibold">Sản phẩm liên quan</p>
                    <Swiper
                        loop={true}
                        navigation={true}
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 10 },
                            480: { slidesPerView: 3, spaceBetween: 15 },
                            768: { slidesPerView: 4, spaceBetween: 20 },
                            1024: { slidesPerView: 5, spaceBetween: 25 },
                            1280: { slidesPerView: 6, spaceBetween: 35 },
                        }}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Navigation]}
                        className="w-full"
                    >
                        {allProducts
                            ?.filter((item) => item._id === productData?._id)
                            .map((product: ProductType) => (
                                <SwiperSlide key={product._id}>
                                    <ProductCard productData={product} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </section>
            )}

            {/* Danh sách sản phẩm từ cùng người bán */}
            <section className="w-full flex flex-col gap-4 mt-14">
                <p className="text-xl font-semibold">Từ cửa hàng</p>
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                    {isSellerLoading ? (
                        <p className="col-span-full text-center">Đang tải sản phẩm...</p>
                    ) : (
                        sellerProducts?.map((product: ProductType) => (
                            <ProductCard productData={product} key={product._id} />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProductPage;
