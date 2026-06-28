import { ENDPOINTS } from "./endpoints"
import server from "./index"

export interface ILoginBody {
    email?: string;
    password?: string;
}
export interface IRegisterBody {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    accountType?: string;
    hostelName?: string;
    hostelAddress?: string;
    addressProof?: string;
}

export const loginUser = (data: ILoginBody) =>{
    return server.post(ENDPOINTS.LOGIN, data)
} 

export const registerUser = (data: IRegisterBody) =>{
    return server.post(ENDPOINTS.REGISTER, data)
}

export const forgotPassword = (data: { email: string }) => {
    return server.post(ENDPOINTS.FORGOT_PASSWORD, data);
};

export const resetPassword = (data: { email: string; otp: string; newPassword?: string }) => {
    return server.post(ENDPOINTS.RESET_PASSWORD, data);
};