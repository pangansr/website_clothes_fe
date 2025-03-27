import axios from "axios";
import  {apiBaseUrl} from "./config";

const API = apiBaseUrl+"/cart";

export const getCartItems = async () => {
    const response = await axios.get(`${API}/all`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
    });

    return response.data;
};

export const clearCart = async () => {
    const response = await axios.delete(`${API}/remove/all`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
    });

    return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
    try {
        const response = await axios.post(
            `${API}/add?productId=${productId}`,
            
            { quantity },   
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            }
        );
        console.log("quantity", quantity);
        console.log("productId", productId);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi FE khi gọi API addToCart:", error);

        if (error.response) {
        
            throw new Error(error.response.data.error || "Lỗi từ server.");
        } else if (error.request) {
            // 📌 Không có phản hồi từ server (server có thể đã bị down)
            throw new Error("Không thể kết nối đến server.");
        } else {
            // 📌 Lỗi xảy ra khi thiết lập request
            throw new Error("Lỗi không xác định.");
        }
    }
};

export const removeToCart = async (productId: string) => {
    const response = await axios.delete(
        `${API}/remove?productId=${productId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
        }
    );

    return response.data;
};

export const cartCheckout = async (userId: string) => {
    const response = await axios.post(
        `${API}/checkout?userId=${userId}`,
        null,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
        }
    );

    return response.data;
};
