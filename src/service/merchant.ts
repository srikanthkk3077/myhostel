import { ENDPOINTS } from './endpoints';
import server from './index';

export interface ICreateRoomBody {
  roomNumber: string;
  floor: string | number;
  pricePerMonth: number;
  roomType: string;
  roomCapacity: number;
}

// ── PROFILE ────────────────────────────────────────────────────

/** Get current authenticated user profile */
export const getMe = () => {
  return server.get(ENDPOINTS.ME, { requiresAuth: true });
};

/** Get user dashboard stats (room, roommate, dues) */
export const getUserDashboard = () => {
  return server.get(ENDPOINTS.USER_DASHBOARD, { requiresAuth: true });
};

/** Update current user profile details */
export const updateProfile = (data: {
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  password?: string;
  hostelName?: string;
  hostelAddress?: string;
}) => {
  return server.put(ENDPOINTS.UPDATE_PROFILE, data, { requiresAuth: true });
};

/** Change current user password */
export const changePassword = (data: { currentPassword?: string; newPassword?: string }) => {
  return server.put(ENDPOINTS.CHANGE_PASSWORD, data, { requiresAuth: true });
};

/** Get personal payments and transactions for logged-in user */
export const getMyPayments = () => {
  return server.get(ENDPOINTS.MY_PAYMENTS, { requiresAuth: true });
};

// ── ROOMS ─────────────────────────────────────────────────────

/** Create a new room */
export const createRoom = (data: ICreateRoomBody) => {
  return server.post(ENDPOINTS.ROOMS, data, { requiresAuth: true });
};

/** Get all rooms */
export const getRooms = () => {
  return server.get(ENDPOINTS.ROOMS, { requiresAuth: true });
};

/** Update an existing room */
export const updateRoom = (roomId: string, data: Partial<ICreateRoomBody>) => {
  return server.put(`${ENDPOINTS.ROOMS}/${roomId}`, data, { requiresAuth: true });
};

/** Get a single room by ID */
export const getRoomById = (roomId: string) => {
  return server.get(`${ENDPOINTS.ROOMS}/${roomId}`, { requiresAuth: true });
};

/** Delete a room */
export const deleteRoom = (roomId: string) => {
  return server.delete(`${ENDPOINTS.ROOMS}/${roomId}`, { requiresAuth: true });
};

// ── MEMBERS ───────────────────────────────────────────────────

/** Get all members */
export const getMembers = () => {
  return server.get(ENDPOINTS.MEMBERS, { requiresAuth: true });
};

/** Register a new member */
export const registerMember = (data: any) => {
  return server.post(ENDPOINTS.REGISTER_MEMBER, data, { requiresAuth: true });
};

/** Get a single member by ID */
export const getMemberById = (memberId: string) => {
  return server.get(`${ENDPOINTS.MEMBERS}/${memberId}`, { requiresAuth: true });
};

/** Update an existing member */
export const updateMember = (memberId: string, data: any) => {
  return server.put(`${ENDPOINTS.MEMBERS}/${memberId}`, data, { requiresAuth: true });
};

/** Delete a member */
export const deleteMember = (memberId: string) => {
  return server.delete(`${ENDPOINTS.MEMBERS}/${memberId}`, { requiresAuth: true });
};

/** Transfer a member to a new room */
export const transferMember = (memberId: string, newRoomNumber: string) => {
  return server.put(`${ENDPOINTS.MEMBERS}/${memberId}/transfer`, { newRoomNumber }, { requiresAuth: true });
};

/** Get all unassigned members */
export const getUnassignedMembers = () => {
  return server.get(`${ENDPOINTS.MEMBERS}/unassigned`, { requiresAuth: true });
};

/** Assign a member to a room and bed */
export const assignMember = (memberId: string, roomNumber: string, bed: string) => {
  return server.put(`${ENDPOINTS.MEMBERS}/${memberId}/assign`, { roomNumber, bed }, { requiresAuth: true });
};

// ── DASHBOARD ─────────────────────────────────────────────────

/** Get aggregated dashboard statistics */
export const getDashboardStats = () => {
  return server.get(ENDPOINTS.DASHBOARD, { requiresAuth: true });
};

// ── FEES ──────────────────────────────────────────────────────

/** Collect a fee from a member */
export const collectFee = (data: {
  memberId: string;
  amount: number;
  type: string;
  paymentMonth: string;
  paymentMethod: string;
  remarks?: string;
  paymentDate?: any;
}) => {
  return server.post(`${ENDPOINTS.FEES}/collect`, data, { requiresAuth: true });
};

/** Get fee transaction history */
export const getFeeHistory = () => {
  return server.get(`${ENDPOINTS.FEES}/history`, { requiresAuth: true });
};

/** Get fee revenue stats */
export const getFeeStats = () => {
  return server.get(`${ENDPOINTS.FEES}/stats`, { requiresAuth: true });
};

/** Get a single fee transaction by ID */
export const getFeeById = (id: string) => {
  return server.get(`${ENDPOINTS.FEES}/${id}`, { requiresAuth: true });
};

/** Get all transactions for a specific member */
export const getMemberTransactions = (memberId: string) => {
  return server.get(`${ENDPOINTS.MEMBER_TRANSACTIONS}/${memberId}`, { requiresAuth: true });
};

/** Make a student self-payment */
export const payFee = (data: { amount: number; paymentMethod: string }) => {
  return server.post(ENDPOINTS.PAY_FEE, data, { requiresAuth: true });
};

// ── EXPENSES ──────────────────────────────────────────────────

/** Get all expenses */
export const getExpenses = (params?: { month?: string; category?: string; all?: boolean }) => {
  return server.get(ENDPOINTS.EXPENSES, { params, requiresAuth: true });
};

/** Add a new expense */
export const addExpense = (data: {
  title: string;
  amount: number;
  category: string;
  description?: string;
}) => {
  return server.post(ENDPOINTS.EXPENSES, data, { requiresAuth: true });
};

/** Get a single expense by ID */
export const getExpenseById = (id: string) => {
  return server.get(`${ENDPOINTS.EXPENSES}/${id}`, { requiresAuth: true });
};

/** Delete a specific expense */
export const deleteExpense = (id: string) => {
  return server.delete(`${ENDPOINTS.EXPENSES}/${id}`, { requiresAuth: true });
};
