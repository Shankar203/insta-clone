import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./firebase";

export default function PrivateRoute() {
    const currentUser = auth.currentUser;
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}