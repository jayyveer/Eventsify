"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["userToken"]);
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();

  //Using react-firebase-hook
  //   const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  //   const handleSignUp = async () => {
  //     try {
  //         const res = await createUserWithEmailAndPassword(email, password)
  //         console.log({res})
  //         sessionStorage.setItem('user', "true")
  //         setEmail('');
  //         setPassword('')

  //     } catch(e){
  //         console.error(e)
  //     }
  //   };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;
      // Check for duplicate email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Handle duplicate email case (e.g., alert user)
        console.error('Email already exists');
        return;
      }
      // Create user document in Firestore
      await addDoc(collection(db, 'users'), {
        id: uid,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('User created successfully!');
      setEmail('');
      setPassword('');
      router.push('/sign-in');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Improved error handling using getRedirectResult for potential redirects
      const result = await getRedirectResult(auth);
      console.log('🚀 ~ handleGoogleSignUp ~ result:', result);
      if (result) {
        const user = result.user;
        const uid = user.uid;
        const email = user.email;

        // Check if user already exists in Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // User not found in Firestore, create a new document with correct ID
          await addDoc(collection(db, 'users'), {
            id: uid,
            name: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        // Handle successful Google sign-in with retrieved user data
        const token = await user.getIdToken();
        setCookie('userToken', token, { path: '/' });
        router.push('/');
      } else {
        // User not previously redirected from Google sign-in flow
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const uid = user.uid;
        const email = user.email;

        // Check if user already exists in Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // User not found in Firestore, create a new document with correct ID
          await addDoc(collection(db, 'users'), {
            id: uid,
            name: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        // Handle successful in-page Google sign-in
        const token = await user.getIdToken();
        setCookie('userToken', token, { path: '/' });
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
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
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleSignUp}
          className="w-full p-3 mt-3 bg-red-500 rounded text-white hover:bg-red-600"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
