// ============================================================
// DUMMY DATA & MOCK SERVICE LAYER
// Replaces all real API calls with instant dummy responses.
// Supports both 'merchant' and 'User' (student) roles.
//
// Demo credentials:
//   Merchant: merchant@demo.com / demo1234
//   Student:  student@demo.com  / demo1234
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Utility ──────────────────────────────────────────────────
const delay = (ms = 400) => new Promise<void>((res) => setTimeout(res, ms));
const ok = (data: any) => ({ status: 200, data: { success: true, ...data } });
const created = (data: any) => ({ status: 201, data: { success: true, ...data } });
const fail = (message: string) => ({ status: 400, data: { success: false, message } });
const genId = () => Math.random().toString(36).slice(2, 10);

// ── Demo Accounts ─────────────────────────────────────────────
const DUMMY_ACCOUNTS = [
  {
    email: 'merchant@demo.com',
    phone: '9876543210',
    password: 'demo1234',
    role: 'merchant',
    token: 'dummy-merchant-token-abc123',
    name: 'Rajesh Kumar',
  },
  {
    email: 'student@demo.com',
    phone: '9123456789',
    password: 'demo1234',
    role: 'User',
    token: 'dummy-user-token-xyz789',
    name: 'Arjun Sharma',
  },
];

// ── Static Dummy Data ─────────────────────────────────────────

export const DUMMY_ROOMS = [
  {
    _id: 'room-001',
    roomNumber: '101',
    floor: 1,
    pricePerMonth: 4500,
    roomType: 'Double',
    roomCapacity: 2,
    occupiedBeds: 2,
    availableBeds: 0,
    members: [
      { _id: 'm-001', name: 'Arjun Sharma', bed: 'Bed 1', email: 'arjun@demo.com', phone: '9123456789' },
      { _id: 'm-002', name: 'Priya Patel', bed: 'Bed 2', email: 'priya@demo.com', phone: '9988776655' },
    ],
  },
  {
    _id: 'room-002',
    roomNumber: '102',
    floor: 1,
    pricePerMonth: 3500,
    roomType: 'Single',
    roomCapacity: 1,
    occupiedBeds: 1,
    availableBeds: 0,
    members: [
      { _id: 'm-003', name: 'Rohan Mehta', bed: 'Bed 1', email: 'rohan@demo.com', phone: '9001122334' },
    ],
  },
  {
    _id: 'room-003',
    roomNumber: '201',
    floor: 2,
    pricePerMonth: 6000,
    roomType: 'Triple',
    roomCapacity: 3,
    occupiedBeds: 1,
    availableBeds: 2,
    members: [
      { _id: 'm-004', name: 'Sneha Gupta', bed: 'Bed 1', email: 'sneha@demo.com', phone: '9876000001' },
    ],
  },
  {
    _id: 'room-004',
    roomNumber: '202',
    floor: 2,
    pricePerMonth: 4500,
    roomType: 'Double',
    roomCapacity: 2,
    occupiedBeds: 0,
    availableBeds: 2,
    members: [],
  },
  {
    _id: 'room-005',
    roomNumber: '301',
    floor: 3,
    pricePerMonth: 5500,
    roomType: 'Double',
    roomCapacity: 2,
    occupiedBeds: 2,
    availableBeds: 0,
    members: [
      { _id: 'm-005', name: 'Vikram Nair', bed: 'Bed 1', email: 'vikram@demo.com', phone: '9777444111' },
      { _id: 'm-006', name: 'Deepa Raj', bed: 'Bed 2', email: 'deepa@demo.com', phone: '9666333222' },
    ],
  },
];

export const DUMMY_MEMBERS = [
  { _id: 'm-001', name: 'Arjun Sharma', email: 'arjun@demo.com', phone: '9123456789', mobile: '9123456789', roomNumber: '101', room: '101', bed: 'Bed 1', joinDate: '2025-01-10', joiningDate: '2025-01-10', dueAmount: 4500, totalPaid: 18000, status: 'Active', computedStatus: 'Active', monthlyRent: 4500, securityDeposit: 5000, computedBalance: -4500, aadhar: '1234-5678-9012' },
  { _id: 'm-002', name: 'Priya Patel', email: 'priya@demo.com', phone: '9988776655', mobile: '9988776655', roomNumber: '101', room: '101', bed: 'Bed 2', joinDate: '2025-02-05', joiningDate: '2025-02-05', dueAmount: 0, totalPaid: 13500, status: 'Active', computedStatus: 'Active', monthlyRent: 4500, securityDeposit: 5000, computedBalance: 0, aadhar: '2345-6789-0123' },
  { _id: 'm-003', name: 'Rohan Mehta', email: 'rohan@demo.com', phone: '9001122334', mobile: '9001122334', roomNumber: '102', room: '102', bed: 'Bed 1', joinDate: '2025-01-20', joiningDate: '2025-01-20', dueAmount: 7000, totalPaid: 7000, status: 'Active', computedStatus: 'Overdue', monthlyRent: 3500, securityDeposit: 4000, computedBalance: -7000, aadhar: '3456-7890-1234' },
  { _id: 'm-004', name: 'Sneha Gupta', email: 'sneha@demo.com', phone: '9876000001', mobile: '9876000001', roomNumber: '201', room: '201', bed: 'Bed 1', joinDate: '2025-03-01', joiningDate: '2025-03-01', dueAmount: 0, totalPaid: 12000, status: 'Active', computedStatus: 'Active', monthlyRent: 6000, securityDeposit: 6000, computedBalance: 0, aadhar: '4567-8901-2345' },
  { _id: 'm-005', name: 'Vikram Nair', email: 'vikram@demo.com', phone: '9777444111', mobile: '9777444111', roomNumber: '301', room: '301', bed: 'Bed 1', joinDate: '2024-12-15', joiningDate: '2024-12-15', dueAmount: 5500, totalPaid: 22000, status: 'Active', computedStatus: 'Overdue', monthlyRent: 5500, securityDeposit: 6000, computedBalance: -5500, aadhar: '5678-9012-3456' },
  { _id: 'm-006', name: 'Deepa Raj', email: 'deepa@demo.com', phone: '9666333222', mobile: '9666333222', roomNumber: '301', room: '301', bed: 'Bed 2', joinDate: '2025-04-01', joiningDate: '2025-04-01', dueAmount: 0, totalPaid: 5500, status: 'Active', computedStatus: 'Active', monthlyRent: 5500, securityDeposit: 6000, computedBalance: 0, aadhar: '6789-0123-4567' },
];


export const DUMMY_MERCHANT_DASHBOARD = {
  merchant: {
    _id: 'merch-001',
    name: 'Rajesh Kumar',
    email: 'merchant@demo.com',
    phone: '9876543210',
    hostelName: 'Green Valley Hostel',
  },
  stats: {
    totalMembers: 6,
    totalRooms: 5,
    totalCapacity: 13,
    totalOccupied: 6,
    availableBeds: 7,
    occupancyRate: 46,
    totalRevenue: 78000,
    thisMonthRevenue: 21000,
    pendingFees: 17000,
    monthlyRevenue: [
      { value: 12500, label: 'Mar' },
      { value: 18000, label: 'Apr' },
      { value: 22000, label: 'May' },
      { value: 19500, label: 'Jun' },
      { value: 24000, label: 'Jul' },
      { value: 21000, label: 'Aug' },
    ],
  },
  recentActivity: [
    { id: 'm-001', type: 'admission', title: 'Arjun Sharma admitted', subtitle: 'Room 101 · Bed 1', detail: '₹4,500/mo', createdAt: '2026-08-25T10:00:00Z' },
    { id: 'm-002', type: 'admission', title: 'Priya Patel admitted', subtitle: 'Room 101 · Bed 2', detail: '₹4,500/mo', createdAt: '2026-08-20T09:00:00Z' },
    { id: 'm-003', type: 'admission', title: 'Rohan Mehta admitted', subtitle: 'Room 102 · Bed 1', detail: '₹3,500/mo', createdAt: '2026-08-15T11:00:00Z' },
  ],
};

export const DUMMY_USER_DASHBOARD = {
  user: { _id: 'u-001', name: 'Arjun Sharma', email: 'student@demo.com', phone: '9123456789', role: 'User' },
  room: { roomNumber: '101', floor: 1, roomType: 'Double', pricePerMonth: 4500, bed: 'Bed 1' },
  roommates: [{ name: 'Priya Patel', bed: 'Bed 2', phone: '9988776655' }],
  dues: { amount: 4500, dueDate: '2026-09-05' },
  recentPayments: [
    { _id: 'p-01', amount: 4500, type: 'Room Rent', date: '2026-07-30', paymentMethod: 'UPI', status: 'Paid' },
    { _id: 'p-02', amount: 4500, type: 'Room Rent', date: '2026-06-28', paymentMethod: 'Cash', status: 'Paid' },
  ],
  notices: [
    { _id: 'n-01', title: 'Water supply interruption', message: 'Water supply will be off on 2nd Sep 8 AM – 12 PM.', type: 'Urgent', createdAt: '2026-08-29T10:00:00Z' },
    { _id: 'n-02', title: 'Hostel Day Celebration', message: 'Annual hostel day on Sept 10. Everyone is invited!', type: 'Normal', createdAt: '2026-08-27T09:00:00Z' },
  ],
};

export const DUMMY_ME = {
  _id: 'u-001', name: 'Arjun Sharma', email: 'student@demo.com', phone: '9123456789',
  role: 'User', hostelName: 'Green Valley Hostel', hostelAddress: '42, MG Road, Bangalore',
  roomNumber: '101', bed: 'Bed 1',
};

export const DUMMY_MERCHANT_ME = {
  _id: 'merch-001', name: 'Rajesh Kumar', email: 'merchant@demo.com', phone: '9876543210',
  role: 'merchant', hostelName: 'Green Valley Hostel', hostelAddress: '42, MG Road, Bangalore',
  subscription: { plan: 'Pro', expiresAt: '2027-01-01' },
};

export const DUMMY_FEE_STATS = {
  // Fields for PendingFeesScreen & DuesListScreen
  expectedRevenue: 27000,
  received: 21000,
  pending: 17000,
  recentDues: [
    { id: 'm-001', _id: 'm-001', name: 'Arjun Sharma', roomNumber: '101', type: 'Room Rent', amount: 4500, dueAmount: 4500, status: 'Pending', phone: '9123456789' },
    { id: 'm-003', _id: 'm-003', name: 'Rohan Mehta', roomNumber: '102', type: 'Room Rent', amount: 7000, dueAmount: 7000, status: 'Overdue', phone: '9001122334' },
    { id: 'm-005', _id: 'm-005', name: 'Vikram Nair', roomNumber: '301', type: 'Room Rent', amount: 5500, dueAmount: 5500, status: 'Overdue', phone: '9777444111' },
  ],
  // Legacy fields
  currentMonthRevenue: 21000, pendingDues: 17000, totalCollected: 78000,
  totalMembers: 6, paidCount: 4, unpaidCount: 2,
};

export const DUMMY_MY_PAYMENTS = [
  { _id: 'p-01', amount: 4500, type: 'Room Rent', paymentMonth: '2026-07', paymentMethod: 'UPI', date: '2026-07-30', status: 'Paid', receiptNumber: 'RCPT-2026-001' },
  { _id: 'p-02', amount: 4500, type: 'Room Rent', paymentMonth: '2026-06', paymentMethod: 'Cash', date: '2026-06-28', status: 'Paid', receiptNumber: 'RCPT-2026-002' },
  { _id: 'p-03', amount: 4500, type: 'Room Rent', paymentMonth: '2026-05', paymentMethod: 'UPI', date: '2026-05-25', status: 'Paid', receiptNumber: 'RCPT-2026-003' },
];

export const DUMMY_MESS_MENU_DATA = [
  { day: 'Mon', breakfast: 'Idli Sambar & Chutney', lunch: 'Rice, Dal, Sabzi, Curd', snacks: 'Tea & Biscuits', dinner: 'Chapati, Paneer Curry, Rice' },
  { day: 'Tue', breakfast: 'Poha & Tea', lunch: 'Rice, Rajma, Salad', snacks: 'Samosa & Tea', dinner: 'Chapati, Dal Makhani, Rice' },
  { day: 'Wed', breakfast: 'Upma & Juice', lunch: 'Rice, Mixed Veg, Papad', snacks: 'Bread Butter & Tea', dinner: 'Chapati, Chole, Rice, Kheer' },
  { day: 'Thu', breakfast: 'Paratha & Curd', lunch: 'Rice, Sambar, Rasam', snacks: 'Vada Pav & Tea', dinner: 'Chapati, Egg Curry, Rice' },
  { day: 'Fri', breakfast: 'Dosa & Coconut Chutney', lunch: 'Biryani, Raita, Salan', snacks: 'Corn Chat & Juice', dinner: 'Chapati, Paneer Butter Masala, Rice' },
  { day: 'Sat', breakfast: 'Puri Bhaji', lunch: 'Rice, Kadhi, Pakoda', snacks: 'Maggi & Tea', dinner: 'Fried Rice, Manchurian, Soup' },
  { day: 'Sun', breakfast: 'Aloo Paratha & Lassi', lunch: 'Special Thali', snacks: 'Snack Box', dinner: 'Chapati, Chicken/Veg Curry, Rice' },
];

// ── In-memory mutable state ───────────────────────────────────
let rooms = [...DUMMY_ROOMS];
let members = [...DUMMY_MEMBERS];
let complaints = [
  { _id: 'c-001', title: 'Leaking tap in washroom', category: 'Maintenance', description: 'The tap in the common washroom on floor 1 has been leaking for 3 days.', status: 'In Progress', createdAt: '2026-08-25T08:30:00Z', updates: [{ text: 'Plumber scheduled for tomorrow.', date: '2026-08-26T11:00:00Z' }] },
  { _id: 'c-002', title: 'AC not working in room 101', category: 'Electrical', description: 'The air conditioner in room 101 stopped working.', status: 'Resolved', createdAt: '2026-08-10T14:00:00Z', updates: [{ text: 'AC repaired and functional.', date: '2026-08-12T16:00:00Z' }] },
  { _id: 'c-003', title: 'Noisy neighbours at night', category: 'Noise', description: 'Students in room 302 make noise after 11 PM regularly.', status: 'Pending', createdAt: '2026-08-28T22:00:00Z', updates: [] },
];
let notices = [
  { _id: 'n-01', title: 'Water Supply Interruption', message: 'Water supply will be shut on 2nd Sep from 8 AM to 12 PM for routine maintenance.', type: 'Urgent', author: 'Management', createdAt: '2026-08-29T10:00:00Z' },
  { _id: 'n-02', title: 'Rent Due Reminder', message: 'Monthly rent is due by 5th September. Please ensure payment on time to avoid a late fee.', type: 'Important', author: 'Accounts', createdAt: '2026-08-27T09:00:00Z' },
  { _id: 'n-03', title: 'Hostel Day Celebration', message: 'Annual hostel day will be celebrated on 10th September. All students are warmly invited.', type: 'Normal', author: 'Warden', createdAt: '2026-08-25T14:00:00Z' },
];
let visitorRequests = [
  { _id: 'v-01', visitorName: 'Suresh Sharma', visitorPhone: '9811223344', relation: 'Father', visitDate: '2026-09-02', visitTime: '11:00 AM', purpose: 'Dropping off items', status: 'Approved', createdAt: '2026-08-28T10:00:00Z', remarks: '' },
  { _id: 'v-02', visitorName: 'Kavita Sharma', visitorPhone: '9833221100', relation: 'Mother', visitDate: '2026-09-05', visitTime: '03:00 PM', purpose: 'Visit', status: 'Pending', createdAt: '2026-08-30T09:00:00Z', remarks: '' },
  { _id: 'v-03', visitorName: 'Rahul Sharma', visitorPhone: '9855667788', relation: 'Brother', visitDate: '2026-08-20', visitTime: '10:00 AM', purpose: 'Help with shifting', status: 'Rejected', createdAt: '2026-08-18T08:00:00Z', remarks: 'Visiting hours exceeded' },
];
let expenses = [
  { _id: 'e-01', title: 'Electricity Bill', amount: 8500, category: 'Utilities', description: 'August electricity', date: '2026-08-20', createdAt: '2026-08-20T10:00:00Z' },
  { _id: 'e-02', title: 'Water Supply', amount: 1200, category: 'Utilities', description: 'Monthly water charges', date: '2026-08-15', createdAt: '2026-08-15T10:00:00Z' },
  { _id: 'e-03', title: 'Plumbing Repair', amount: 2500, category: 'Maintenance', description: 'Pipe leak repair', date: '2026-08-10', createdAt: '2026-08-10T10:00:00Z' },
  { _id: 'e-04', title: 'Security Guard Salary', amount: 12000, category: 'Salaries', description: 'August salary', date: '2026-08-01', createdAt: '2026-08-01T10:00:00Z' },
];
let feeHistory = [
  { _id: 'f-01', memberName: 'Arjun Sharma', memberId: 'm-001', amount: 4500, type: 'Room Rent', paymentMonth: '2026-07', paymentMethod: 'UPI', date: '2026-07-30', remarks: '' },
  { _id: 'f-02', memberName: 'Priya Patel', memberId: 'm-002', amount: 4500, type: 'Room Rent', paymentMonth: '2026-08', paymentMethod: 'Cash', date: '2026-08-05', remarks: 'On time' },
  { _id: 'f-03', memberName: 'Rohan Mehta', memberId: 'm-003', amount: 3500, type: 'Room Rent', paymentMonth: '2026-07', paymentMethod: 'UPI', date: '2026-07-28', remarks: '' },
  { _id: 'f-04', memberName: 'Sneha Gupta', memberId: 'm-004', amount: 6000, type: 'Room Rent', paymentMonth: '2026-08', paymentMethod: 'UPI', date: '2026-08-15', remarks: 'Advance paid' },
];
let messMenu = [...DUMMY_MESS_MENU_DATA];

// ============================================================
// MOCK SERVICE FUNCTIONS
// ============================================================

// ── AUTH ──────────────────────────────────────────────────────

export const mockLoginUser = async (data: { email: string; password: string }) => {
  await delay();
  const account = DUMMY_ACCOUNTS.find(
    (a) => (a.email === data.email || a.phone === data.email) && a.password === data.password,
  );
  if (!account) return fail('Invalid email/phone or password');
  return ok({ token: account.token, user: { role: account.role, name: account.name, email: account.email } });
};

export const mockRegisterUser = async (_data: any) => {
  await delay(600);
  return ok({ message: 'Registration successful! Please log in.' });
};

export const mockForgotPassword = async (_data: any) => {
  await delay();
  return ok({ otp: '123456', message: 'OTP sent to your email/phone.' });
};

export const mockResetPassword = async (data: { otp: string; email?: string; newPassword?: string }) => {
  await delay();
  if (data.otp !== '123456') return fail('Invalid OTP');
  return ok({ message: 'Password reset successfully.' });
};

// ── PROFILE ────────────────────────────────────────────────────

export const mockGetMe = async () => {
  await delay();
  const role = await AsyncStorage.getItem('userRole');
  return ok({ data: role === 'merchant' ? DUMMY_MERCHANT_ME : DUMMY_ME });
};

export const mockUpdateProfile = async (data: any) => {
  await delay();
  const role = await AsyncStorage.getItem('userRole');
  if (role === 'merchant') {
    if (data.phoneNumber && !data.phone) data.phone = data.phoneNumber;
    Object.assign(DUMMY_MERCHANT_ME, data);
    return ok({ data: DUMMY_MERCHANT_ME, message: 'Profile updated successfully.' });
  } else {
    if (data.phoneNumber && !data.phone) data.phone = data.phoneNumber;
    Object.assign(DUMMY_ME, data);
    return ok({ data: DUMMY_ME, message: 'Profile updated successfully.' });
  }
};

export const mockChangePassword = async (_data: any) => {
  await delay();
  return ok({ message: 'Password changed successfully.' });
};

// ── DASHBOARD ─────────────────────────────────────────────────

export const mockGetDashboardStats = async () => {
  await delay();
  return ok({ data: DUMMY_MERCHANT_DASHBOARD });
};

export const mockGetUserDashboard = async () => {
  await delay();
  return ok({ data: DUMMY_USER_DASHBOARD });
};

// ── ROOMS ─────────────────────────────────────────────────────

export const mockGetRooms = async () => {
  await delay();
  return ok({ data: rooms });
};

export const mockGetRoomById = async (id: string) => {
  await delay();
  const room = rooms.find((r) => r._id === id);
  if (!room) return fail('Room not found');
  return ok({ data: room });
};

export const mockCreateRoom = async (data: any) => {
  await delay();
  const newRoom = { _id: `room-${genId()}`, ...data, occupiedBeds: 0, availableBeds: data.roomCapacity, members: [] };
  rooms = [newRoom, ...rooms];
  return created({ data: newRoom, message: 'Room created successfully.' });
};

export const mockUpdateRoom = async (id: string, data: any) => {
  await delay();
  rooms = rooms.map((r) => (r._id === id ? { ...r, ...data } : r));
  return ok({ message: 'Room updated successfully.' });
};

export const mockDeleteRoom = async (id: string) => {
  await delay();
  rooms = rooms.filter((r) => r._id !== id);
  return ok({ message: 'Room deleted.' });
};

// ── MEMBERS ───────────────────────────────────────────────────

export const mockGetMembers = async () => {
  await delay();
  return ok({ data: members });
};

export const mockGetMemberById = async (id: string) => {
  await delay();
  const member = members.find((m) => m._id === id);
  if (!member) return fail('Member not found');
  return ok({ data: member });
};

export const mockRegisterMember = async (data: any) => {
  await delay(600);
  const newMember = { _id: `m-${genId()}`, ...data, dueAmount: 0, totalPaid: 0, status: 'Active', computedStatus: 'Active', joinDate: new Date().toISOString().split('T')[0], joiningDate: new Date().toISOString().split('T')[0], room: data.roomNumber || '', monthlyRent: data.pricePerMonth || 0, securityDeposit: 0, computedBalance: 0 };
  members = [newMember, ...members];
  return created({ data: newMember, message: 'Member registered successfully.' });
};

export const mockUpdateMember = async (id: string, data: any) => {
  await delay();
  members = members.map((m) => (m._id === id ? { ...m, ...data } : m));
  return ok({ message: 'Member updated.' });
};

export const mockDeleteMember = async (id: string) => {
  await delay();
  members = members.filter((m) => m._id !== id);
  return ok({ message: 'Member removed.' });
};

export const mockTransferMember = async (id: string, newRoomNumber: string) => {
  await delay();
  members = members.map((m) => (m._id === id ? { ...m, roomNumber: newRoomNumber } : m));
  return ok({ message: 'Member transferred successfully.' });
};

export const mockGetUnassignedMembers = async () => {
  await delay();
  return ok({ data: [] });
};

export const mockAssignMember = async (id: string, roomNumber: string, bed: string) => {
  await delay();
  members = members.map((m) => (m._id === id ? { ...m, roomNumber, bed } : m));
  return ok({ message: 'Member assigned successfully.' });
};

export const mockGetMemberTransactions = async (memberId: string) => {
  await delay();
  const transactions = feeHistory.filter((f) => f.memberId === memberId);
  const totalPaidYTD = transactions.reduce((sum, t) => sum + t.amount, 0);
  return ok({ data: { transactions, summary: { totalPaidYTD, totalFines: 0 } } });
};

// ── FEES ──────────────────────────────────────────────────────

export const mockGetFeeHistory = async () => {
  await delay();
  return ok({ data: feeHistory });
};

export const mockGetFeeStats = async () => {
  await delay();
  return ok({ data: DUMMY_FEE_STATS });
};

export const mockCollectFee = async (data: any) => {
  await delay(600);
  const newFee = {
    _id: `f-${genId()}`,
    ...data,
    date: new Date().toISOString().split('T')[0],
    memberName: members.find((m) => m._id === data.memberId)?.name || 'Unknown',
  };
  feeHistory = [newFee, ...feeHistory];
  return created({ data: newFee, message: 'Fee collected successfully.' });
};

export const mockGetFeeById = async (id: string) => {
  await delay();
  const fee = feeHistory.find((f) => f._id === id);
  if (!fee) return fail('Fee record not found');
  return ok({ data: fee });
};

export const mockGetMyPayments = async () => {
  await delay();
  return ok({ data: DUMMY_MY_PAYMENTS });
};

export const mockPayFee = async (data: any) => {
  await delay(600);
  const newPayment = { _id: `p-${genId()}`, ...data, date: new Date().toISOString().split('T')[0], status: 'Paid', receiptNumber: `RCPT-${Date.now()}` };
  return created({ data: newPayment, message: 'Payment successful.' });
};

// ── EXPENSES ──────────────────────────────────────────────────

export const mockGetExpenses = async () => {
  await delay();
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  // Build category segments for the pie chart
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => { categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount; });
  const segments = Object.entries(categoryMap).map(([label, amount]) => ({ label, amount }));
  return ok({ data: { expenses, summary: { totalAmount, segments } } });
};

export const mockAddExpense = async (data: any) => {
  await delay();
  const newExpense = { _id: `e-${genId()}`, ...data, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() };
  expenses = [newExpense, ...expenses];
  return created({ data: newExpense, message: 'Expense added.' });
};

export const mockGetExpenseById = async (id: string) => {
  await delay();
  const expense = expenses.find((e) => e._id === id);
  if (!expense) return fail('Expense not found');
  return ok({ data: expense });
};

export const mockDeleteExpense = async (id: string) => {
  await delay();
  expenses = expenses.filter((e) => e._id !== id);
  return ok({ message: 'Expense deleted.' });
};

// ── COMPLAINTS ────────────────────────────────────────────────

export const mockGetMyComplaints = async () => {
  await delay();
  return ok({ data: complaints });
};

export const mockGetComplaintById = async (id: string) => {
  await delay();
  const c = complaints.find((x) => x._id === id);
  if (!c) return fail('Complaint not found');
  return ok({ data: c });
};

export const mockCreateComplaint = async (data: any) => {
  await delay(500);
  const newComplaint = { _id: `c-${genId()}`, ...data, status: 'Pending', createdAt: new Date().toISOString(), updates: [] };
  complaints = [newComplaint, ...complaints];
  return created({ data: newComplaint, message: 'Complaint raised successfully.' });
};

export const mockUpdateComplaintStatus = async (id: string, data: any) => {
  await delay();
  complaints = complaints.map((c) =>
    c._id === id
      ? { ...c, status: data.status, updates: [...c.updates, { text: data.updateText || data.status, date: new Date().toISOString() }] }
      : c,
  );
  return ok({ message: 'Complaint status updated.' });
};

export const mockGetMerchantComplaints = async () => {
  await delay();
  return ok({ data: complaints });
};

// ── NOTICES ───────────────────────────────────────────────────

export const mockGetNotices = async () => {
  await delay();
  return ok({ data: notices });
};

export const mockCreateNotice = async (data: any) => {
  await delay();
  const newNotice = { _id: `n-${genId()}`, ...data, createdAt: new Date().toISOString() };
  notices = [newNotice, ...notices];
  return created({ data: newNotice, message: 'Notice published.' });
};

// ── MESS MENU ─────────────────────────────────────────────────

export const mockGetMessMenu = async () => {
  await delay();
  return ok({ data: messMenu });
};

export const mockUpdateMessMenu = async (day: string, data: any) => {
  await delay();
  messMenu = messMenu.map((m) => (m.day === day ? { ...m, ...data } : m));
  return ok({ message: `Menu for ${day} updated.` });
};

// ── VISITOR REQUESTS ──────────────────────────────────────────

export const mockGetMyVisitorRequests = async () => {
  await delay();
  return ok({ data: visitorRequests });
};

export const mockCreateVisitorRequest = async (data: any) => {
  await delay(500);
  const newReq = { _id: `v-${genId()}`, ...data, status: 'Pending', createdAt: new Date().toISOString(), remarks: '' };
  visitorRequests = [newReq, ...visitorRequests];
  return created({ data: newReq, message: 'Visitor request submitted.' });
};

export const mockGetMerchantVisitorRequests = async () => {
  await delay();
  return ok({ data: visitorRequests });
};

export const mockUpdateVisitorRequestStatus = async (id: string, data: any) => {
  await delay();
  visitorRequests = visitorRequests.map((v) => (v._id === id ? { ...v, ...data } : v));
  return ok({ message: 'Visitor request updated.' });
};
