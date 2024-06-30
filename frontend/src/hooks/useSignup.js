import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const { data } = await axios.post(`${url}/api/auth/signup`, {
				fullName,
				username,
				password,
				confirmPassword,
				gender
			}, {
				headers: { "Content-Type": "application/json" }
			});	


			localStorage.setItem("chat-user", JSON.stringify(data));
			localStorage.setItem("access-token",data.token)
			setAuthUser(data);
		} catch (error) {
			toast.error(error?.response?.data?.error || "Internal Server Error");
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
