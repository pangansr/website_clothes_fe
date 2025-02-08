import { Divider } from "@chakra-ui/react";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="w-full flex flex-col items-center p-6 mt-6 bg-[#FBFBFB]">
            <div className="w-[70%] grid grid-cols-4 justify-items-center items-center mt-4">
                <div className="w-full flex flex-col items-center gap-2">
                    <p className="font-bold mb-2 text-sm">CUSTOMER SERVICE</p>

                    <Link href="/" className="text-gray-700 text-xs">
                        Help Center
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Payment Methods
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Return & Refund
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Contact Us
                    </Link>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <p className="font-bold mb-2 text-sm">FOLLOW US</p>

                    <Link href="/" className="text-gray-700 text-xs">
                        Help Center
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Payment Methods
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Return & Refund
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Contact Us
                    </Link>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <p className="font-bold mb-2 text-sm">PAYMENT METHODS</p>

                    <Link href="/" className="text-gray-700 text-xs">
                        Gcash
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Maya
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Credit Card
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Debit Card
                    </Link>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <Link href="/" className="font-bold mb-2 text-sm">
                        ABOUT OOKRA
                    </Link>

                    <Link href="/" className="text-gray-700 text-xs">
                        About Us
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Media Contact
                    </Link>
                    <Link href="/" className="text-gray-700 text-xs">
                        Flash Deals
                    </Link>
                </div>
            </div>
            <Divider w="70%" my={6} />
            <div className="w-[70%] text-gray-600 flex justify-between">
                <p className="font-semibold text-xs">
                    © 2023 Ooka. All Rights Reserved.
                </p>
                <p className="text-xs">
                    Country & Region: Singapore | Indonesia | Taiwan | Thailand
                    | Malaysia | Vietnam | Philippines | Brazil | México |
                    Colombia | Chile
                </p>
            </div>
        </div>
    );
};

export default Footer;
