import axios from "axios";
import  {apiBaseUrl} from "./config";

const refreshAccessToken = async () => {
    try {
        const response = await axios.get(apiBaseUrl+"/auth/refresh", {
            withCredentials: true,
        });

        return response.data.token;
    } catch (error: any) {
        console.log(error);
    }
};

export default refreshAccessToken;
