import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const token=localStorage.getItem('access-token')
				const url = import.meta.env.VITE_BACKEND_URL;
				const { data } = await axios.get(url + "/api/users", {
					withCredentials: true, // Include credentials (cookies)
					headers: {
						'Content-Type': 'application/json',
						'authorization':`Bearer ${token}`
					},
				});
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				console.log(error)
				toast.error(error?.response?.data?.error || "Internal Server Error");
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
