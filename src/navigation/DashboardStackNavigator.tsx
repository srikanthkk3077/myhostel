import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/merchant/dashboard/DashboardScreen';
import MessMenuScreen from '../screens/merchant/hostelservices/MessMenuScreen';
import EditMenuScreen from '../screens/merchant/hostelservices/EditMenuScreen';
import ComplaintsListScreen from '../screens/merchant/hostelservices/ComplaintsListScreen';
import RaiseComplaintScreen from '../screens/merchant/hostelservices/RaiseComplaintScreen';
import NoticeBoardScreen from '../screens/merchant/hostelservices/NoticeBoardScreen';
import CreateNoticeScreen from '../screens/merchant/hostelservices/CreateNoticeScreen';
import VisitorsListScreen from '../screens/merchant/hostelservices/VisitorsListScreen';
import AddVisitorScreen from '../screens/merchant/hostelservices/AddVisitorScreen';
import AllServicesScreen from '../screens/merchant/hostelservices/AllServicesScreen';
import ProfileScreen from '../screens/merchant/profile/ProfileScreen';
import NotificationsScreen from '../screens/merchant/dashboard/NotificationsScreen';
import VisitorRequestsApprovalScreen from '../screens/merchant/hostelservices/VisitorRequestsApprovalScreen';

const Stack = createNativeStackNavigator();

export default function DashboardStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="MessMenu" component={MessMenuScreen} />
      <Stack.Screen name="EditMenu" component={EditMenuScreen} />
      <Stack.Screen name="ComplaintsList" component={ComplaintsListScreen} />
      <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
      <Stack.Screen name="NoticeBoard" component={NoticeBoardScreen} />
      <Stack.Screen name="CreateNotice" component={CreateNoticeScreen} />
      <Stack.Screen name="VisitorsList" component={VisitorsListScreen} />
      <Stack.Screen name="AddVisitor" component={AddVisitorScreen} />
      <Stack.Screen name="AllServices" component={AllServicesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="VisitorRequestsApproval" component={VisitorRequestsApprovalScreen} />
    </Stack.Navigator>
  );
}
