import { ENDPOINTS } from "./endpoints";
import server from "./index";

export interface ICreateVisitorRequestBody {
  visitorName: string;
  visitorPhone: string;
  relation: string;
  visitDate: string; // ISO string
  visitTime: string; // E.g., "10:30 AM"
  purpose?: string;
}

/**
 * Request a new visitor entry (Student)
 */
export const createVisitorRequest = (data: ICreateVisitorRequestBody) => {
  return server.post(ENDPOINTS.VISITOR_REQUESTS, data, { requiresAuth: true });
};

/**
 * Get all visitor requests raised by the logged-in student (User)
 */
export const getMyVisitorRequests = () => {
  return server.get(`${ENDPOINTS.VISITOR_REQUESTS}/my`, { requiresAuth: true });
};

/**
 * Get all visitor requests for the merchant's hostel (Merchant)
 */
export const getMerchantVisitorRequests = () => {
  return server.get(`${ENDPOINTS.VISITOR_REQUESTS}/merchant`, { requiresAuth: true });
};

/**
 * Update visitor request status (Merchant)
 */
export const updateVisitorRequestStatus = (id: string, data: { status: 'Approved' | 'Rejected', remarks?: string }) => {
  return server.put(`${ENDPOINTS.VISITOR_REQUESTS}/${id}/status`, data, { requiresAuth: true });
};
