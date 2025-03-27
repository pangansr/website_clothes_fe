import "./globals.css";
import type { Metadata } from "next";
import App from "./_app";

export const metadata: Metadata = {
    title: "Thương mai điện tử",
    description: "trao đổi mua bán hàng hóa",
    keywords: "thương mại điện tử, mua bán, hàng hóa",

};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <App>{children}</App>
            </body>
        </html>
    );
}
