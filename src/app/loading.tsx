import "./globals.css";

export default function Loading() {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="loading-wave">
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
            </div>
        </div>
    );
}
