import {
  mockGetMe,
  mockUpdateProfile,
  mockChangePassword,
  mockGetMyPayments,
  mockCreateRoom,
  mockGetRooms,
  mockUpdateRoom,
  mockGetRoomById,
  mockDeleteRoom,
  mockGetMembers,
  mockRegisterMember,
  mockGetMemberById,
  mockUpdateMember,
  mockDeleteMember,
  mockTransferMember,
  mockGetUnassignedMembers,
  mockAssignMember,
  mockGetDashboardStats,
  mockCollectFee,
  mockGetFeeHistory,
  mockGetFeeStats,
  mockGetFeeById,
  mockGetMemberTransactions,
  mockGetExpenses,
  mockAddExpense,
  mockGetExpenseById,
  mockDeleteExpense,
  mockPayFee,
  mockGetUserDashboard,
} from './dummyData';

export interface ICreateRoomBody {
  roomNumber: string;
  floor: string | number;
  pricePerMonth: number;
  roomType: string;
  roomCapacity: number;
}

// ── PROFILE ────────────────────────────────────────────────────

/** Get current authenticated user profile */
export const getMe = () => mockGetMe();

/** Get user dashboard stats (room, roommate, dues) */
export const getUserDashboard = () => mockGetUserDashboard();

/** Update current user profile details */
export const updateProfile = (data: {
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  password?: string;
  hostelName?: string;
  hostelAddress?: string;
}) => mockUpdateProfile(data);

/** Change current user password */
export const changePassword = (data: { currentPassword?: string; newPassword?: string }) =>
  mockChangePassword(data);

/** Get personal payments and transactions for logged-in user */
export const getMyPayments = () => mockGetMyPayments();

// ── ROOMS ─────────────────────────────────────────────────────

/** Create a new room */
export const createRoom = (data: ICreateRoomBody) => mockCreateRoom(data);

/** Get all rooms */
export const getRooms = () => mockGetRooms();

/** Update an existing room */
export const updateRoom = (roomId: string, data: Partial<ICreateRoomBody>) =>
  mockUpdateRoom(roomId, data);

/** Get a single room by ID */
export const getRoomById = (roomId: string) => mockGetRoomById(roomId);

/** Delete a room */
export const deleteRoom = (roomId: string) => mockDeleteRoom(roomId);

// ── MEMBERS ───────────────────────────────────────────────────

/** Get all members */
export const getMembers = () => mockGetMembers();

/** Register a new member */
export const registerMember = (data: any) => mockRegisterMember(data);

/** Get a single member by ID */
export const getMemberById = (memberId: string) => mockGetMemberById(memberId);

/** Update an existing member */
export const updateMember = (memberId: string, data: any) => mockUpdateMember(memberId, data);

/** Delete a member */
export const deleteMember = (memberId: string) => mockDeleteMember(memberId);

/** Transfer a member to a new room */
export const transferMember = (memberId: string, newRoomNumber: string) =>
  mockTransferMember(memberId, newRoomNumber);

/** Get all unassigned members */
export const getUnassignedMembers = () => mockGetUnassignedMembers();

/** Assign a member to a room and bed */
export const assignMember = (memberId: string, roomNumber: string, bed: string) =>
  mockAssignMember(memberId, roomNumber, bed);

// ── DASHBOARD ─────────────────────────────────────────────────

/** Get aggregated dashboard statistics */
export const getDashboardStats = () => mockGetDashboardStats();

// ── FEES ──────────────────────────────────────────────────────

/** Collect a fee from a member */
export const collectFee = (data: {
  memberId: string;
  amount: number;
  type: string;
  paymentMonth: string;
  paymentMethod: string;
  remarks?: string;
}) => mockCollectFee(data);

/** Get fee transaction history */
export const getFeeHistory = () => mockGetFeeHistory();

/** Get fee revenue stats */
export const getFeeStats = () => mockGetFeeStats();

/** Get a single fee transaction by ID */
export const getFeeById = (id: string) => mockGetFeeById(id);

/** Get all transactions for a specific member */
export const getMemberTransactions = (memberId: string) => mockGetMemberTransactions(memberId);

/** Make a student self-payment */
export const payFee = (data: { amount: number; paymentMethod: string }) => mockPayFee(data);

// ── EXPENSES ──────────────────────────────────────────────────

/** Get all expenses */
export const getExpenses = (_params?: { month?: string; category?: string; all?: boolean }) =>
  mockGetExpenses();

/** Add a new expense */
export const addExpense = (data: {
  title: string;
  amount: number;
  category: string;
  description?: string;
}) => mockAddExpense(data);

/** Get a single expense by ID */
export const getExpenseById = (id: string) => mockGetExpenseById(id);

/** Delete a specific expense */
export const deleteExpense = (id: string) => mockDeleteExpense(id);
