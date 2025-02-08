import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";

const CookieAlert = () => {
    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: true });

    return (
        isVisible && (
            <div className="fixed bottom-4 left-4 z-50 w-[23rem] p-4 flex flex-col justify-center gap-4 rounded-sm bg-white shadow-custom">
                <p className="text-red-700 font-semibold">Cookies & Privacy</p>
                <p>
                    This website uses cookies to ensure you get the best
                    experience on our website.
                </p>
                <div className="flex justify-end">
                    <HStack spacing={4}>
                        <Link
                            href="/"
                            className="text-red-700 text-sm underline"
                        >
                            More information
                        </Link>
                        <Button size="sm" colorScheme="red" onClick={onClose}>
                            Accept
                        </Button>
                    </HStack>
                </div>
            </div>
        )
    );
};

export default CookieAlert;
