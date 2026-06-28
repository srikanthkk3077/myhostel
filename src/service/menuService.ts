import { ENDPOINTS } from "./endpoints";
import server from "./index";

export interface IUpdateMessMenuBody {
  breakfast?: string;
  lunch?: string;
  snacks?: string;
  dinner?: string;
}

/**
 * Fetch weekly mess menu schedule
 */
export const getMessMenu = () => {
  return server.get(ENDPOINTS.MESS_MENU, { requiresAuth: true });
};

/**
 * Update mess menu schedule for a specific day of the week
 * @param day 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
 * @param data IUpdateMessMenuBody
 */
export const updateMessMenu = (day: string, data: IUpdateMessMenuBody) => {
  return server.put(`${ENDPOINTS.MESS_MENU}/${day}`, data, { requiresAuth: true });
};
