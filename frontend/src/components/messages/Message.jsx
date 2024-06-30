import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();

	

	const fromMe = message.senderId === authUser._id ? "currentUser" : (message.senderId === selectedConversation._id
		? "receiverUser"
		: "gpt");

	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe == "currentUser" ? "chat-end" : "chat-start";
	const profilePic = fromMe == "currentUser" ? authUser.profilePic : (fromMe == "receiverUser" ? selectedConversation?.profilePic
		: 'https://static.vecteezy.com/system/resources/thumbnails/021/059/825/small_2x/chatgpt-logo-chat-gpt-icon-on-green-background-free-vector.jpg');
	const bubbleBgColor = fromMe=="currentUser" ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble whitespace-pre-wrap  text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-white'>{formattedTime}</div>
		</div>
	);
};
export default Message;
