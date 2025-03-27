import { useRef } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    FaTshirt, FaLaptop, FaHome, FaHeartbeat, FaBook, FaUtensils,
    FaBaby, FaBicycle, FaCouch, FaShoppingBag, FaGem, FaMedkit,
    FaGift, FaEllipsisH, FaGamepad, FaMusic
} from "react-icons/fa";

const categoryIcons: { [key: string]: typeof FaTshirt } = {
    "Thời trang": FaTshirt,
    "Điện tử": FaLaptop,
    "Gia dụng": FaHome,
    "Mỹ phẩm & Chăm sóc \n cá nhân": FaHeartbeat,
    "Sách\n & Văn phòng phẩm": FaBook,
    "Thực phẩm & Đồ uống": FaUtensils,
    "Đồ chơi & Mẹ & Bé": FaBaby,
    "Thể thao & Dã ngoại": FaBicycle,
    "Xe máy, Ô tô & Xe đạp": FaBicycle,
    "Nhà cửa & Đời sống": FaCouch,
    "Phụ kiện thời trang": FaShoppingBag,
    "Đồng hồ & Trang sức": FaGem,
    "Sức khỏe & Sắc đẹp": FaMedkit,
    "Voucher & Dịch vụ": FaGift,
    "Gaming": FaGamepad,
    "Audio": FaMusic,
    "Khác": FaEllipsisH
};

const Category = ({ category }: { category: keyof typeof categoryIcons }) => {
    const IconComponent = categoryIcons[category] || FaEllipsisH;
    return (
<Link href="/" className="w-full">
    <div className="flex flex-col items-center justify-center gap-1.5 
        w-full min-w-[6rem] min-h-[7rem] p-3 border border-gray-200 
        rounded-lg bg-white shadow-sm hover:shadow-md transition 
        hover:bg-gray-100">
        {/* Icon hiển thị nhỏ hơn */}
        <IconComponent className="text-blue-500 text-4xl md:text-5xl" />
        {/* Tên danh mục */}
        <p className="text-center text-gray-700 font-medium text-xs md:text-sm">
            {category}
        </p>
    </div>
</Link>


    );
};

const Categories = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.7;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const categories = Object.keys(categoryIcons);

    return (
        <div className="w-full flex flex-col bg-white rounded-md mt-6 relative">
            <p className="p-4 font-medium text-gray-600 border-b text-lg">Loại sản phẩm</p>

            {/* Nút trái */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-md hover:bg-gray-300"
            >
                <FaChevronLeft size={20} />
            </button>

            {/* Danh mục cuộn ngang */}
            <div 
                ref={scrollRef} 
                className="flex overflow-x-scroll scrollbar-hide space-x-4 p-4 scroll-smooth"
                style={{ scrollBehavior: "smooth" }}
            >
                {categories.map((category, index) => (
                    <div key={index} className="min-w-[120px] flex-shrink-0">
                        <Category category={category} />
                    </div>
                ))}
            </div>

            {/* Nút phải */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-md hover:bg-gray-300"
            >
                <FaChevronRight size={20} />
            </button>
        </div>
    );
};

export default Categories;
