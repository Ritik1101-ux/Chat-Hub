import { useState } from "react";
import axios from "axios";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const { data } = await axios.post(`${url}/api/messages/send/${selectedConversation._id}`,
				{ message },
				{
					headers: { "Content-Type": "application/json" },
				}
			);

			if (data.error) throw new Error(data.error);


		} catch (error) {
			toast.error(error?.response?.data?.error || "Internal Server Error");
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
