import axios from "axios";
import  {apiBaseUrl} from "./config";

const API: string = apiBaseUrl+"/product";

export const searchProducts = async (productName: string) => {
    const response = await axios.get(
        `${API}/search?productName=${productName}`,
    );
    return response.data;
};

export const getAllProducts = async () => {
    const response = await axios.get(`${API}/all`);
    return response.data;
};

export const getSellerProducts = async (sellerId: string) => {
    const response = await axios.get(`${API}/all?sellerId=${sellerId}`);

    return response.data;
};

export const getSingleProduct = async (productId: string) => {


    if (!productId) {
        throw new Error("❌ productId không hợp lệ");
    }

    const response = await axios.get(`${API}/${productId}`);

    return response.data;
};


export const addNewProduct = async (productInfo: FormData) => {
    const response = await axios.post(`${API}/new`, productInfo, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
    });

    return response.data;
};

export const removeProduct = async (productId: string) => {
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

export const updateProductDetails = async (
    productInfo: FormData,
    productId: string
) => {
    const response = await axios.put(
        `${API}/update?productId=${productId}`,
        productInfo,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
        }
    );

    return response.data;
};
