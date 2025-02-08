"use client";
import { getSellerProducts, getSingleProduct } from "@/src/api/productsApi";
import ProductCard, { ProductType } from "@/src/components/product/ProductCard";
import ProductOverview from "@/src/components/product/ProductOverview";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isTokenAvailable } from "@/src/utils/checkAccessToken";
import useUserStore from "@/src/stores/userStore";

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

const ProductPage = () => {
    const router = useRouter();
    const productId = useParams().productId as string;
    const accountDetails = useUserStore((state) => state.accountDetails);

    const queryClient = useQueryClient();

    const allProducts: ProductType[] | undefined = queryClient.getQueryData([
        "products",
    ]);

    // Single product
    const singleProductQuery = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getSingleProduct(productId),
    });

    // other products of the seller
    // const sellerProductsQuery = useQuery({
    //     queryKey: ["products", singleProductQuery?.data?.seller?._id],
    //     queryFn: () => getSellerProducts(singleProductQuery?.data?.seller?._id),
    //     enabled: singleProductQuery?.data != undefined,
    // });

    const sellerId = singleProductQuery?.data?.seller?._id ?? "unknown";
const sellerProductsQuery = useQuery({
    queryKey: ["products", sellerId],
    queryFn: () => (sellerId === "unknown" ? Promise.resolve([]) : getSellerProducts(sellerId)),
    enabled: sellerId !== "unknown",
});


    // useEffect(() => {
    //     const checkToken = async () => {
    //         if (!(await isTokenAvailable())) {
    //             router.push("/login");
    //         }
    //     };

    //     checkToken();
    // }, []);

    if (accountDetails == null) {
        return <div className="w-full h-screen bg-[#EBEAF3]"></div>;
    }

    return (
        <div className="w-[85vw] 2xl:w-[65vw] flex flex-col items-center p-6 mb-6">
            <p className="w-full text-lg font-semibold text-gray-800 mb-4">
                <Link href="/">Tất cả sản phẩm</Link>
                {" - "}
                <Link href="/">Loại sản phẩm</Link> {" - "}
                {productId}
            </p>
            <ProductOverview
                sellerId={singleProductQuery?.data?.seller?._id}
                productData={singleProductQuery?.data}
            />

            {allProducts && (
                <div className="w-full flex flex-col gap-4 mt-14">
                    <p className="text-xl font-semibold">Related Products</p>
                    <Swiper
                        slidesPerView={6}
                        spaceBetween={35}
                        grabCursor={true}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="w-full "
                    >
                        {allProducts
                            ?.filter(
                                (item) =>
                                    item.category ==
                                    singleProductQuery.data?.category
                            )
                            .map((product: ProductType) => (
                                <SwiperSlide key={product._id}>
                                    <ProductCard productData={product} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            )}

            <div className="w-full flex flex-col gap-4 mt-14">
                <p className="text-xl font-semibold">From the same shop</p>
                {/* className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  justify-items-center gap-2 lg:gap-6" */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-items-center gap-2 lg:gap-8">
                    {sellerProductsQuery?.isLoading && (
                        <h1>Loading products...</h1>
                    )}
                    {sellerProductsQuery?.data?.map((product: ProductType) => (
                        <ProductCard productData={product} key={product._id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
