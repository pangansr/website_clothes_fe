"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/src/components/Footer";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/src/components/Navbar";
import { Suspense } from "react";
import Loading from "./loading";
import CookieAlert from "../components/alerts/CookieAlert";

const queryClient = new QueryClient();

const App = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const hideComponents = pathname === "/login" || pathname === "/register";

    return (
        <QueryClientProvider client={queryClient}>
            <NextTopLoader />
            <ChakraProvider>
                <div className="relative w-full min-h-screen flex flex-col items-center bg-[#EBEAF3] font-roboto">
                    {!hideComponents && <Navbar />}
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                    <Footer />
                    <CookieAlert />
                </div>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </ChakraProvider>
        </QueryClientProvider>
    );
};

export default App;
