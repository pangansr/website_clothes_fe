import axios from "axios";

const API = "http://localhost:5000/cart";

export const getCartItems = async () => {
    const response = await axios.get(`${API}/all`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });

    return response.data;
};

export const clearCart = async () => {
    const response = await axios.delete(`${API}/remove/all`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });

    return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
    const response = await axios.post(
        `${API}/add?productId=${productId}`,
        { quantity },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
            },
        }
    );

    return response.data;
};

export const removeToCart = async (productId: string) => {
    const response = await axios.delete(
        `${API}/remove?productId=${productId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
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
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
            },
        }
    );

    return response.data;
};
