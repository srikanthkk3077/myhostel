import {
  mockLoginUser,
  mockRegisterUser,
  mockForgotPassword,
  mockResetPassword,
} from './dummyData';

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
export const loginUser = (data: ILoginBody) =>
  mockLoginUser(data as { email: string; password: string });

/** Register a new hostel owner / student account */
export const registerUser = (data: IRegisterBody) => mockRegisterUser(data);

/** Send a forgot-password OTP to the given email */
export const forgotPassword = (data: { email: string }) => mockForgotPassword(data);

/** Reset password using the OTP received via email */
export const resetPassword = (data: { email: string; otp: string; newPassword?: string }) =>
  mockResetPassword(data);