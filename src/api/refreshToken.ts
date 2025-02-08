import axios from "axios";

const refreshAccessToken = async () => {
    try {
        const response = await axios.get("http://localhost:5000/auth/refresh", {
            withCredentials: true,
        });

        return response.data.token;
    } catch (error: any) {
        console.log(error);
    }
};

export default refreshAccessToken;
