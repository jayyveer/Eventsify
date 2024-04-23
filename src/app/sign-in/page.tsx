'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    const provider = new GoogleAuthProvider();

    //Using react-firebase-hook
    //   const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    //   const handleSignIn = async () => {
    //     try {
    //         const res = await signInWithEmailAndPassword(email, password);
    //         console.log({res});
    //         sessionStorage.setItem('user', "true")
    //         setEmail('');
    //         setPassword('');
    //         router.push('/')
    //     }catch(e){
    //         console.error(e)
    //     }
    //   };

    const handleSignIn = async () => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log({ res });
            sessionStorage.setItem('user', "true")
            setEmail('');
            setPassword('');
            router.push('/')
        } catch (e) {
            console.error(e)
        }
    };

    const googleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential && credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log({ result, user });
            sessionStorage.setItem('user', "true")
            setEmail('');
            setPassword('');
            router.push('/')
        } catch (error: any) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSignIn}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign In
                </button>
                <button
                    onClick={googleSignIn}
                    className="w-full p-3 mt-2 bg-red-600 rounded text-white hover:bg-red-500"
                >
                    Sign In with Google
                </button>
            </div>
        </div>
    );
};

export default SignIn;