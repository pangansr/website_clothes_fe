import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

const ImageSlider = () => {
    return (
        <>
            <Swiper
                slidesPerView={"auto"}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper w-full h-[14rem]"
            >
                <SwiperSlide className="bg-[url(/banner1.webp)] bg-cover bg-center bg-no-repeat cursor-grab" />
                <SwiperSlide className="bg-[url(/banner2.png)] bg-cover bg-center bg-no-repeat cursor-grab" />
                <SwiperSlide className="bg-[url(/banner3.png)] bg-cover bg-center bg-no-repeat cursor-grab" />
                <SwiperSlide className="bg-[url(/banner4.png)] bg-cover bg-center bg-no-repeat cursor-grab" />
                <SwiperSlide className="bg-[url(/banner5.png)] bg-cover bg-center bg-no-repeat cursor-grab" />
            </Swiper>
        </>
    );
};

export default ImageSlider;
