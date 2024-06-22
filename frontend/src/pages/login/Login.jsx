import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import useGoogleLogin from "../../hooks/useGoogleSignIn";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();
	const { loadingGoogle, googleLogin } = useGoogleLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};
	const handleGoogleSignin = () => {
		signInWithPopup(auth, provider)
			.then(async (result) => {

				const { user } = result;
				const firstName = user.displayName;
				const username = user.email;
				const password = user.accessToken;


				await googleLogin(firstName, username, password);

			})
	}

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Login

				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='Enter username'
							className='w-full input input-bordered h-10'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to='/signup' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2' disabled={loading}>
							{loading ? <span className='loading loading-spinner '></span> : "Login"}
						</button>
					</div>
				</form>
				<button className='btn btn-block btn-sm mt-2' onClick={handleGoogleSignin}>
					{loadingGoogle ? <span className='loading loading-spinner '></span> : "Sign In With Google"}
				</button>
			</div>
		</div>
	);
};
export default Login;
