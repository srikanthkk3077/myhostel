import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomsListScreen from '../screens/merchant/rooms/RoomsListScreen';
import AddRoomScreen from '../screens/merchant/rooms/AddRoomScreen';
import RoomDetailsScreen from '../screens/merchant/rooms/RoomDetailsScreen';
import EditRoomScreen from '../screens/merchant/rooms/EditRoomScreen';
import AssignMemberScreen from '../screens/merchant/rooms/AssignMemberScreen';
import RoomMembersScreen from '../screens/merchant/rooms/RoomMembersScreen';
import TransferMemberScreen from '../screens/merchant/rooms/TransferMemberScreen';
import StudentDetailsScreen from '../screens/merchant/members/StudentDetailsScreen';
import MemberTransactionsScreen from '../screens/merchant/members/MemberTransactionsScreen';

const Stack = createNativeStackNavigator();

export default function RoomsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="RoomsList" component={RoomsListScreen} />
      <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
      <Stack.Screen name="AddRoom" component={AddRoomScreen} />
      <Stack.Screen name="EditRoom" component={EditRoomScreen} />
      <Stack.Screen name="AssignMember" component={AssignMemberScreen} />
      <Stack.Screen name="RoomMembers" component={RoomMembersScreen} />
      <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
      <Stack.Screen name="MemberTransactions" component={MemberTransactionsScreen} />
      <Stack.Screen name="TransferMember" component={TransferMemberScreen} />
    </Stack.Navigator>
  );
}
