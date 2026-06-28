import { ENDPOINTS } from "./endpoints";
import server from "./index";

/**
 * Get current authenticated user profile
 */
export const getMe = () => {
  return server.get(ENDPOINTS.ME, { requiresAuth: true });
};

/**
 * Get user dashboard stats (room, roommate, dues)
 */
export const getUserDashboard = () => {
  return server.get(ENDPOINTS.USER_DASHBOARD, { requiresAuth: true });
};

/**
 * Update current user profile details
 */
export const updateProfile = (data: { name?: string, email?: string, phoneNumber?: string }) => {
  return server.put(ENDPOINTS.UPDATE_PROFILE, data, { requiresAuth: true });
};

/**
 * Change current user password
 */
export const changePassword = (data: { currentPassword?: string, newPassword?: string }) => {
  return server.put(ENDPOINTS.CHANGE_PASSWORD, data, { requiresAuth: true });
};

/**
 * Get personal payments and transactions for logged-in user
 */
export const getMyPayments = () => {
  return server.get(ENDPOINTS.MY_PAYMENTS, { requiresAuth: true });
};

export interface ICreateRoomBody {
  roomNumber: string;
  floor: string | number;
  pricePerMonth: number;
  roomType: string;
  roomCapacity: number;
}

/**
 * Create a new room for the hostel owner
 * @param data ICreateRoomBody
 */
export const createRoom = (data: ICreateRoomBody) => {
  return server.post(ENDPOINTS.ROOMS, data, { requiresAuth: true });
};

/**
 * Get all rooms for the logged-in hostel owner
 */
export const getRooms = () => {
  return server.get(ENDPOINTS.ROOMS, { requiresAuth: true });
};

/**
 * Update an existing room
 * @param roomId ID of the room to update
 * @param data Partial data to update
 */
export const updateRoom = (roomId: string, data: Partial<ICreateRoomBody>) => {
  return server.put(`${ENDPOINTS.ROOMS}/${roomId}`, data, { requiresAuth: true });
};

/**
 * Get a single room by ID (with live member data)
 * @param roomId ID of the room
 */
export const getRoomById = (roomId: string) => {
  return server.get(`${ENDPOINTS.ROOMS}/${roomId}`, { requiresAuth: true });
};

/**
 * Delete a room
 * @param roomId ID of the room to delete
 */
export const deleteRoom = (roomId: string) => {
  return server.delete(`${ENDPOINTS.ROOMS}/${roomId}`, { requiresAuth: true });
};

/**
 * Get all members for the logged-in hostel owner
 */
export const getMembers = () => {
  return server.get(ENDPOINTS.MEMBERS, { requiresAuth: true });
};

/**
 * Register a new member (admission)
 * @param data Member details
 */
export const registerMember = (data: any) => {
  return server.post(ENDPOINTS.REGISTER_MEMBER, data, { requiresAuth: true });
};

/**
 * Get a single member by ID
 * @param memberId ID of the member
 */
export const getMemberById = (memberId: string) => {
  return server.get(`${ENDPOINTS.MEMBERS}/${memberId}`, { requiresAuth: true });
};

/**
 * Update an existing member
 * @param memberId ID of the member
 * @param data Partial data to update
 */
export const updateMember = (memberId: string, data: any) => {
  return server.put(`${ENDPOINTS.MEMBERS}/${memberId}`, data, { requiresAuth: true });
};

/**
 * Delete a member
 * @param memberId ID of the member to delete
 */
export const deleteMember = (memberId: string) => {
  return server.delete(`${ENDPOINTS.MEMBERS}/${memberId}`, { requiresAuth: true });
};

/**
 * Transfer a member to a new room
 * @param memberId ID of the member
 * @param newRoomNumber The new room number to transfer to
 */
export const transferMember = (memberId: string, newRoomNumber: string) => {
  return server.put(`${ENDPOINTS.MEMBERS}/${memberId}/transfer`, { newRoomNumber }, { requiresAuth: true });
};

/**
 * Get all members who have not been assigned to a room yet
 */
export const getUnassignedMembers = () => {
  return server.get(`${ENDPOINTS.MEMBERS}/unassigned`, { requiresAuth: true });
};

/**
 * Assign a member to a specific room and bed
 * @param memberId ID of the member to assign
 * @param roomNumber The room number
 * @param bed The bed name (e.g. "Bed 1")
 */
export const assignMember = (memberId: string, roomNumber: string, bed: string) => {
  return server.put(`${ENDPOINTS.MEMBERS}/${memberId}/assign`, { roomNumber, bed }, { requiresAuth: true });
};

/**
 * Get aggregated dashboard statistics for the logged-in merchant
 */
export const getDashboardStats = () => {
  return server.get(ENDPOINTS.DASHBOARD, { requiresAuth: true });
};



/**
 * Collect a fee from a member
 */
export const collectFee = (data: { memberId: string, amount: number, type: string, paymentMonth: string, paymentMethod: string, remarks?: string }) => {
  return server.post(`${ENDPOINTS.FEES}/collect`, data, { requiresAuth: true });
};

/**
 * Get fee transaction history
 */
export const getFeeHistory = () => {
  return server.get(`${ENDPOINTS.FEES}/history`, { requiresAuth: true });
};

/**
 * Get fee revenue stats for current month
 */
export const getFeeStats = () => {
  return server.get(`${ENDPOINTS.FEES}/stats`, { requiresAuth: true });
};

/**
 * Get a single fee transaction by ID
 */
export const getFeeById = (id: string) => {
  return server.get(`${ENDPOINTS.FEES}/${id}`, { requiresAuth: true });
};


/**
 * Get all transactions for a specific member (transaction history)
 * @param memberId ID of the member
 */
export const getMemberTransactions = (memberId: string) => {
  return server.get(`${ENDPOINTS.MEMBER_TRANSACTIONS}/${memberId}`, { requiresAuth: true });
};

/**
 * Get all expenses, optionally filtered by month or category
 */
export const getExpenses = (params?: { month?: string, category?: string, all?: boolean }) => {
  let query = '';
  if (params) {
    const queryParts = [];
    if (params.month) queryParts.push(`month=${params.month}`);
    if (params.category) queryParts.push(`category=${params.category}`);
    if (params.all) queryParts.push(`all=true`);
    if (queryParts.length > 0) query = `?${queryParts.join('&')}`;
  }
  return server.get(`${ENDPOINTS.EXPENSES}${query}`, { requiresAuth: true });
};

/**
 * Add a new expense
 */
export const addExpense = (data: { title: string, amount: number, category: string, description?: string }) => {
  return server.post(ENDPOINTS.EXPENSES, data, { requiresAuth: true });
};

/**
 * Get a single expense by ID
 * @param id ID of the expense
 */
export const getExpenseById = (id: string) => {
  return server.get(`${ENDPOINTS.EXPENSES}/${id}`, { requiresAuth: true });
};

/**
 * Delete a specific expense by ID
 * @param id ID of the expense
 */
export const deleteExpense = (id: string) => {
  return server.delete(`${ENDPOINTS.EXPENSES}/${id}`, { requiresAuth: true });
};

/**
 * Make a student self-payment
 */
export const payFee = (data: { amount: number; paymentMethod: string }) => {
  return server.post(ENDPOINTS.PAY_FEE, data, { requiresAuth: true });
};



