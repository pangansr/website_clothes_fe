import jwtDecode from "jwt-decode";
import refreshAccessToken from "../api/refreshToken";

export const isTokenAvailable = async () => {
    const token = localStorage.getItem("ookraToken");

    // No token
    if (!token) {
        return false;
    }

    try {
        const decodedToken: any = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        //  If access token is expired and refresh token is not, generate new access token
        if (currentTime > expirationTime) {
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                console.log("Token refresh");
                localStorage.setItem("ookraToken", newAccessToken);
                return true;
            } else {
                // Refresh Token expired
                return false;
            }
        }

        return true;
    } catch (error) {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
            console.log("Token refresh");
            localStorage.setItem("ookraToken", newAccessToken);
            return true;
        } else {
            // Refresh Token expired
            return false;
        }
    }
};
