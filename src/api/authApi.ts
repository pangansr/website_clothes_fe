import axios from "axios";
import  {apiBaseUrl} from "./config";

const API: string = apiBaseUrl+"/auth";

type RegisterDetailsType = {
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    location: string;
    role: string;
};


// export const registerUser = async (data: RegisterDetailsType) => {
//     const response = await axios.post(`${API}/register`, data, {
//         withCredentials: true,
//     });

//     if (response.data.token) {
//         localStorage.setItem("ookraToken", response.data.token);
//     }

//     return response.data;
// };

export const registerUser = async (data: RegisterDetailsType) => {
    try {
        const response = await axios.post(`${API}/register`, data, {
            withCredentials: true,
        });

        // Kiểm tra trạng thái HTTP thành công
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`HTTP lỗi! Trạng thái: ${response.status}`);
        }

        if (response.data.token) {
            localStorage.setItem("Token", response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Lỗi trong quá trình đăng ký:", error);
        throw error;
    }
};




export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const response = await axios.post(`${API}/login`, data, {
        withCredentials: true,
    });
    if (response.data.token) {
        localStorage.setItem("Token", response.data.token);
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API}/logout`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};
