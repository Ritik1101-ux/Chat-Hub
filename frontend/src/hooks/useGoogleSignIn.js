import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useGoogleLogin = () => {
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const { setAuthUser } = useAuthContext();

	const googleLogin = async (fullName, username, password) => {
		const success = handleInputErrors(fullName, username, password);
		if (!success) return;
		setLoadingGoogle(true);
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const { data } = await axios.post(`${url}/api/auth/google-signin`, {
				fullName,
				username,
				password
			}, {
				headers: { "Content-Type": "application/json" }
			});

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error?.response?.data?.error || "Internal Server Error");
		} finally {
			setLoadingGoogle(false);
		}
	};

	return { loadingGoogle, googleLogin };
};

export default useGoogleLogin;

function handleInputErrors(fullName, username, password) {
	if (!username || !password || !fullName) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
