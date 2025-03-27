import {
    Avatar,
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useDisclosure,
    useToast,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    IconButton,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { BsCart2, BsCreditCard, BsGear, BsPeople } from "react-icons/bs";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import useUserStore from "@/src/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import { isTokenAvailable } from "../utils/checkAccessToken";
import { useQueryClient } from "@tanstack/react-query";
import { CartItemType } from "./cart/CartItem";
import SearchBar from "./SearchBar";

const Cart = dynamic(() => import("./cart/Cart"));

const Navbar = () => {
    const pathname = usePathname();
    const toast = useToast();
    const router = useRouter();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {
        isOpen: isMenuOpen,
        onOpen: openMenu,
        onClose: closeMenu,
    } = useDisclosure();
    const { accountDetails, getAccountDetails, logoutUser } = useUserStore();
    const queryClient = useQueryClient();

    const itemsInCart: CartItemType[] | undefined = queryClient.getQueryData([
        "cart",
    ]);

    const handleLogout = () => {
        logoutUser();
        toast({
            title: "Logout successfully",
            status: "success",
            isClosable: true,
            duration: 3000,
            position: "top",
            variant: "subtle",
        });

        router.push("/login");
    };

    useEffect(() => {
        const checkToken = async () => await isTokenAvailable();

        if (accountDetails == null) getAccountDetails();
        checkToken();
    }, [pathname]);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full px-4 py-5 bg-white flex items-center justify-between shadow-custom">
        
                <IconButton
                    aria-label="Open menu"
                    icon={<FaBars size={22} />}
                    className="sm:hidden"
                    onClick={openMenu}
                    variant="ghost"
                />

<Link href="/" className="mr-auto">
    <div className="text-2xl font-bold tracking-wider" style={{ color: "#40ff00" }}>
        Clothes
    </div>
</Link>

              

      

                {/* Search + Cart + User */}
                <div className="ms-3 flex items-center gap-4">
                <div className=" w-full sm:w-[15rem] md:w-[20rem] lg:w-[25rem]">
    <SearchBar />
</div>


                    {accountDetails?.role === "Buyer" && (
                        <div className="relative">
                            <div className="absolute -right-1 -top-1 px-[6px] py-[2px] text-[10px] font-bold bg-blue-500 text-white rounded-full">
                                {itemsInCart?.length || 0}
                            </div>
                            <BsCart2
                                className="text-3xl cursor-pointer"
                                onClick={() => {
                                    if (!accountDetails) {
                                        router.push("/login");
                                    } else {
                                        onOpen();
                                    }
                                }}
                            />
                        </div>
                    )}

                    {!accountDetails ? (
                        <Button colorScheme="blue" as={Link} href="/login">
                            Login
                        </Button>
                    ) : (
                        <Menu isLazy>
                            <MenuButton bg="transparent">
                                <Avatar name={accountDetails?.email} size="sm" />
                            </MenuButton>
                            <MenuList>
                                {accountDetails?.role === "Seller" ? (
                                    <MenuItem
                                        icon={<FaUserCircle size={17} />}
                                        as={Link}
                                        href={`/user/${accountDetails?._id}`}
                                        className="hover:bg-gray-100"
                                    >
                                        Trang cá nhân
                                    </MenuItem>
                                ) : (
                                    <MenuItem
                                        as={Link}
                                        href="/user/purchase"
                                        icon={<BsCreditCard size={17} />}
                                        className="hover:bg-gray-100"
                                    >
                                        Đơn hàng
                                    </MenuItem>
                                )}

                                <MenuItem
                                    as={Link}
                                    icon={<BsPeople size={17} />}
                                    className="hover:bg-gray-100"
                                    href="/user/following"
                                >
                                    Đang theo dõi
                                </MenuItem>
                                <MenuItem
                                    as={Link}
                                    icon={<BsGear size={17} />}
                                    className="hover:bg-gray-100"
                                    href="/user/settings"
                                >
                                    Cài đặt
                                </MenuItem>
                                <MenuItem
                                    icon={<MdOutlineLogout size={17} />}
                                    className="hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </div>
            </nav>

            {/* Drawer menu trên mobile */}
            <Drawer isOpen={isMenuOpen} placement="left" onClose={closeMenu}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader className="font-bold text-xl">Menu</DrawerHeader>
                    <DrawerBody>
                        <Link href="/" className="block py-2 text-lg" onClick={closeMenu}>
                            Trang chủ
                        </Link>
                        <Link href="/" className="block py-2 text-lg" onClick={closeMenu}>
                            Tin tức
                        </Link>
                        <Link href="/" className="block py-2 text-lg" onClick={closeMenu}>
                            Sản phẩm nổi bậc
                        </Link>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {accountDetails && accountDetails?.role === "Buyer" && (
                <Cart isOpen={isOpen} onClose={onClose} accountDetails={accountDetails} />
            )}
        </>
    );
};

export default Navbar;
