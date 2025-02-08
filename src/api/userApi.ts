import axios from "axios";

const API: string = "http://localhost:5000/user";

// fetch the details of the account user (logged in)
export const fetchAccountDetails = async () => {
    const response = await axios.get(`${API}/account/details`, {

        
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });

    return response.data;
};

export type updateAccountDetailsType = {
    firstName: string;
    lastName: string;
    username: string;
};

export const updateAccountDetails = async (
    details: updateAccountDetailsType
) => {
    const response = await axios.post(
        `${API}/account/details/update`,
        details,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
            },
        }
    );

    return response.data;
};

export const changeAccountPassword = async (details: {
    oldPassword: string;
    newPassword: string;
}) => {
    const response = await axios.post(
        `${API}/account/password/update`,
        details,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
            },
        }
    );

    return response.data;
};

// fetch the details of the specific user
export const fetchUserDetails = async (userId: string) => {
    const response = await axios.get(`${API}/details?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });

    return response.data;
};

export const getAllFollowers = async (userId: string) => {
    const response = await axios.get(`${API}/followers/list?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });
    console.log("fffffffffffffffffffffffffff"+response.data.userId);
    return response.data;
};

export const getAllFollowing = async (userId: string) => {
    const response = await axios.get(`${API}/following/list?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });

    return response.data;
};

export const followUser = async (userId: string) => {
    const response = await axios.post(`${API}/follow?userId=${userId}`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
        },
    });

    return response.data;
};

export const unfollowUser = async (userId: string) => {
    const response = await axios.post(
        `${API}/unfollow?userId=${userId}`,
        null,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ookraToken")}`,
            },
        }
    );

    return response.data;
};
