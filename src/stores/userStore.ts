import { fetchAccountDetails } from "@/src/api/userApi";
import { create } from "zustand";
import { isTokenAvailable } from "../utils/checkAccessToken";
import { logoutUser } from "@/src/api/authApi";

export type UserType = {
    _id: string;
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    totalSales?: number;
    location?: string;
    role: string;
};

type UserState = {
    accountDetails: UserType | null;
    getAccountDetails: () => Promise<void>;
    logoutUser: () => void;
};

const useUserStore = create<UserState>((set) => ({
    accountDetails: null,
    getAccountDetails: async () => {
        const response = await fetchAccountDetails();
       

        if ((await isTokenAvailable()) && response) {
            set({ accountDetails: response });
            console.log("resss",response);
        } else {
            set({ accountDetails: null });
        }
    },
    logoutUser: async () => {
        const response = await logoutUser();

        localStorage.removeItem("Token");
        set({ accountDetails: null });
    },
}));

export default useUserStore;
