

export const BASE_URL = "https://api.finance.alwi.tech"
// export const BASE_URL = "http://localhost:3000"

export const API_PATH = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        GET_USER_INFO: "/auth/me",
        UPLOAD_IMAGE: "/auth/upload-image",
        RESEND_OTP: "/auth/resend-otp",
        VERIFY_REGISTER: "/auth/verify-register",
        UPDATE_PROFILE: "/auth/update-profile"
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: "/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/income/add",
        GET_ALL_INCOME: "/income/get",
        DOWNLOAD_EXCEL: "/income/downloadexcel",
        DELETE_INCOME: "/income/:id",
    },

    EXPENSE: {
        ADD_EXPENSE: "/expense/add",
        GET_ALL_EXPENSE: "/expense/get",
        DOWNLOAD_EXCEL: "/expense/downloadexcel",
        DELETE_EXPENSE: "/expense/:id",
    }
}


