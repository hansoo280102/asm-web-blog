/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function OnlyAdminPrivateRoute() {
  // const { currentUser } = useSelector((state) => state.user);
  // return currentUser && currentUser.role === "admin" ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to={"sign-in"} />
  // );
}