import { ENDPOINTS } from "./endpoints";
import server from "./index";

export interface ICreateNoticeBody {
  title: string;
  message: string;
  type?: 'Normal' | 'Important' | 'Urgent';
  author?: string;
}

/**
 * Fetch notice board announcements
 */
export const getNotices = () => {
  return server.get(ENDPOINTS.NOTICES, { requiresAuth: true });
};

/**
 * Create/publish a new notice announcement
 */
export const createNotice = (data: ICreateNoticeBody) => {
  return server.post(ENDPOINTS.NOTICES, data, { requiresAuth: true });
};
