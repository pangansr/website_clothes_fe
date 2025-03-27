"use client";
import { getAllProducts } from "@/src/api/productsApi";
import ProductCard, { ProductType } from "@/src/components/product/ProductCard";
import ImageSlider from "@/src/components/main-page/ImageSlider";
import { Image, useBreakpointValue } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Categories from "../components/main-page/Categories";
import useUserStore from "../stores/userStore";
import React from "react";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const Homepage = () => {
    const getAccountDetails = useUserStore((state) => state.getAccountDetails);

    const productQuery = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });

    useEffect(() => {
        getAccountDetails();
    }, []);

    // Số lượng sản phẩm hiển thị thay đổi theo khung hình
    const slidesPerView = useBreakpointValue({
        base: 2,  // Mobile
        sm: 3,    // Tablet nhỏ
        md: 4,    // Tablet lớn
        lg: 5,    // Laptop
        xl: 6,    // PC lớn
    });

    return (
      <div className="w-full max-w-[90vw] min-h-screen flex flex-col items-center p-1">
  

        {/* Danh mục sản phẩm */}
        <Categories />

        {/* Danh sách sản phẩm */}
        <div className="w-full flex flex-col gap-4 mt-8">
          <p className="w-full text-lg md:text-xl font-bold">
            Sản phẩm mới nhất
          </p>

          <Swiper
            slidesPerView={slidesPerView}
            spaceBetween={10}
            grabCursor={true}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="w-full"
          >
            {productQuery.isLoading && <h1>Đang tải sản phẩm ... </h1>}
            {productQuery?.data?.slice(0, 10).map((product: ProductType) => (
              <SwiperSlide key={product._id}>
                <ProductCard productData={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
};

export default Homepage;
