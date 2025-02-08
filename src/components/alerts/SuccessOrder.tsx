import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    CloseButton,
    ScaleFade,
} from "@chakra-ui/react";

type SuccessOrderProps = {
    successDisclosure: {
        onClose: () => void;
        isOpen: boolean;
    };
};

const SuccessOrder = ({ successDisclosure }: SuccessOrderProps) => {
    return (
        <div className="fixed bg-black bg-opacity-30 w-full h-screen flex justify-center items-center z-[100]">
            <div
                className="absolute w-full h-screen z-10"
                onClick={successDisclosure.onClose}
            />
            <ScaleFade initialScale={0.9} in={successDisclosure.isOpen}>
                <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="18rem"
                    w="30rem"
                    className="z-40 rounded-2xl shadow-md"
                >
                    <CloseButton
                        alignSelf="flex-start"
                        position="absolute"
                        right={3}
                        top={3}
                        onClick={successDisclosure.onClose}
                    />
                    <AlertIcon boxSize="50px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="xl">
                        Order Success!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        Thanks for purchasing! You can check your orders in
                        purchase History
                    </AlertDescription>
                    {/* <Button
                        colorScheme="green"
                        mt={5}
                        as={Link}
                        href="/"
                        onClick={alertDisclosure.onClose}
                    >
                        Order again
                    </Button> */}
                </Alert>
            </ScaleFade>
        </div>
    );
};

export default SuccessOrder;
