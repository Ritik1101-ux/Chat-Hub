import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const { data } = await axios.post(`${url}/api/auth/logout`, {}, {
				headers: { "Content-Type": "application/json" }
			});

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user");
			setAuthUser(null);
		} catch (error) {
			toast.error(error?.response?.data?.error || "Internal Server Error");
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};

export default useLogout;
