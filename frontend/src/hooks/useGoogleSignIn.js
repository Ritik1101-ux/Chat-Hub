import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useGoogleLogin = () => {
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const { setAuthUser } = useAuthContext();

	const googleLogin = async (fullName,username, password) => {
		const success = handleInputErrors(fullName,username, password);
		if (!success) return;
		setLoadingGoogle(true);
		try {
			const res = await fetch("/api/auth/google-signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoadingGoogle(false);
		}
	};

	return { loadingGoogle, googleLogin };
};
export default useGoogleLogin;

function handleInputErrors(fullname,username, password) {
	if (!username || !password || !fullname) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
