import { ENDPOINTS } from './endpoints';
import server from './index';

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

/** Login a user (merchant or student) */
export const loginUser = (data: ILoginBody) => {
  return server.post(ENDPOINTS.LOGIN, data);
};

/** Register a new hostel owner / student account */
export const registerUser = (data: IRegisterBody) => {
  return server.post(ENDPOINTS.REGISTER, data);
};

/** Send a forgot-password OTP to the given email */
export const forgotPassword = (data: { email: string }) => {
  return server.post(ENDPOINTS.FORGOT_PASSWORD, data);
};

/** Reset password using the OTP received via email */
export const resetPassword = (data: { email: string; otp: string; newPassword?: string }) => {
  return server.post(ENDPOINTS.RESET_PASSWORD, data);
};