import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const { data } = await axios.post(`${url}/api/auth/login`, {
				username,
				password
			}, {
				headers: { "Content-Type": "application/json" }
			});
			console.log(data);

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			localStorage.setItem("access-token",data.token)
			setAuthUser(data);
		} catch (error) {
			toast.error(error?.response?.data?.error || "Internal Server Error");
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
