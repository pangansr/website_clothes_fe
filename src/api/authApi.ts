import axios from "axios";

const API: string = "http://localhost:5000/auth";

type RegisterDetailsType = {
    firstName: "string";
    lastName: "string";
    username: "string";
    password: "string";
    location: "string";
    role: "string";
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Kiểm tra nếu có token trong phản hồi và lưu vào localStorage
        if (response.data.token) {
            localStorage.setItem("ookraToken", response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};


// export const registerUser = async (data: RegisterDetailsType) => {
//     try {
//         debugger;

//         const response = await axios.post(`${API}/register`, data, {
//             withCredentials: true,
//         });
//         if (response.data.token) {
//             localStorage.setItem("ookraToken", response.data.token);
//         }

//         return response.data;
//     } catch (error) {
//         console.error('Error during registration:', error); // Log lỗi ở đây
//         throw error;
//     }
// };

export const loginUser = async (data: {
    username: string;
    password: string;
}) => {
    const response = await axios.post(`${API}/login`, data, {
        withCredentials: true,
    });
console.log("fffffffffffffffffffffffffff"+response.data.token);
    if (response.data.token) {
        localStorage.setItem("ookraToken", response.data.token);
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API}/logout`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};
