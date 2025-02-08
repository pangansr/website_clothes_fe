import { removeProduct } from "@/src/api/productsApi";
import useUserStore from "@/src/stores/userStore";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

type ClearCartAlertProps = {
    warningDisclosure: {
        isOpen: boolean;
        onClose: () => void;
    };
    productId: string;
};

const RemoveProductAlert = ({
    warningDisclosure,
    productId,
}: ClearCartAlertProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const toast = useToast();
    const cancelRef = useRef(null);
    const queryClient = useQueryClient();
    const accountDetails = useUserStore((state) => state.accountDetails);

    const removeProductMutation = useMutation({
        mutationFn: removeProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products", accountDetails?._id],
            });
            warningDisclosure.onClose();

            toast({
                title: "Product removed!",
                status: "success",
                isClosable: true,
                duration: 2000,
                position: "top",
                variant: "subtle",
            });
        },
        onError: (err: any) => {
            const errMessage =
                err.response.data.error.message || "An error occured";
            toast({
                title: errMessage,
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top",
                variant: "top-accent",
            });
        },
    });

    const handleCloseAlert = () => {
        warningDisclosure.onClose();

        // Remove the query
        router.replace(pathname);
    };

    return (
        <AlertDialog
            isOpen={warningDisclosure.isOpen}
            leastDestructiveRef={cancelRef}
            onClose={handleCloseAlert}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Remove product
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You cant undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={warningDisclosure.onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            isLoading={removeProductMutation.isLoading}
                            onClick={() =>
                                removeProductMutation.mutate(productId)
                            }
                            ml={3}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default RemoveProductAlert;
