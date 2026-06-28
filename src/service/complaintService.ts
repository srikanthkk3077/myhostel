import { ENDPOINTS } from "./endpoints";
import server from "./index";

export interface ICreateComplaintBody {
  title: string;
  category: string;
  description: string;
  image?: string | null;
}

/**
 * Raise a new complaint (Student)
 */
export const createComplaint = (data: ICreateComplaintBody) => {
  return server.post(ENDPOINTS.COMPLAINTS, data, { requiresAuth: true });
};

/**
 * Get all complaints raised by the logged-in student (User)
 */
export const getMyComplaints = () => {
  return server.get(`${ENDPOINTS.COMPLAINTS}/my`, { requiresAuth: true });
};

/**
 * Get a single complaint details by ID (Student or Merchant)
 */
export const getComplaintById = (id: string) => {
  return server.get(`${ENDPOINTS.COMPLAINTS}/${id}`, { requiresAuth: true });
};

/**
 * Update complaint status (Merchant)
 */
export const updateComplaintStatus = (id: string, data: { status: 'In Progress' | 'Resolved', updateText?: string }) => {
  return server.put(`${ENDPOINTS.COMPLAINTS}/${id}/status`, data, { requiresAuth: true });
};

/**
 * Get all complaints for the merchant's hostel (Merchant)
 */
export const getMerchantComplaints = () => {
  return server.get(`${ENDPOINTS.COMPLAINTS}/merchant`, { requiresAuth: true });
};
