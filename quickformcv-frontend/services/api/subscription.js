import api from "./axiosConfig";

export const subscriptionService = {
    getStatus: () => {
        return api.get("/subscription/status");
    },

    getTierInfo: (data) => {
        return data?.subscription;
    },

    getUsage: (data) => {
        return data?.usage;
    },

    getPermissions: (data) => {
        return data?.permissions;
    },

    getWarnings: (data) => {
        return data?.warnings;
    }
};