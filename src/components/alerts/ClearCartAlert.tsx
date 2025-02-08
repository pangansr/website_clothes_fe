import { clearCart } from "@/src/api/cartApi";
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
import { useRef } from "react";

type ClearCartAlertProps = {
    warningDisclosure: {
        isOpen: boolean;
        onClose: () => void;
    };
};

const ClearCartAlert = ({ warningDisclosure }: ClearCartAlertProps) => {
    const toast = useToast();
    const cancelRef = useRef(null);
    const queryClient = useQueryClient();

    const clearCartMutation = useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);

            warningDisclosure.onClose();

            toast({
                title: "Clear cart success",
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

    return (
        <AlertDialog
            isOpen={warningDisclosure.isOpen}
            leastDestructiveRef={cancelRef}
            onClose={warningDisclosure.onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Remove all items
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
                            isLoading={clearCartMutation.isLoading}
                            onClick={() => clearCartMutation.mutate()}
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

export default ClearCartAlert;
