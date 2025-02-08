import { fetchAccountDetails } from "@/src/api/userApi";
import { create } from "zustand";
import { isTokenAvailable } from "../utils/checkAccessToken";
import { logoutUser } from "@/src/api/authApi";

export type UserType = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    totalSales?: number;
    location?: string;
    _id: string;
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
        } else {
            set({ accountDetails: null });
        }
    },
    logoutUser: async () => {
        const response = await logoutUser();

        localStorage.removeItem("ookraToken");
        set({ accountDetails: null });
    },
}));

export default useUserStore;
