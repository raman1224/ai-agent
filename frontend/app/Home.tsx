
"use client";

import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { Loader2 } from "lucide-react";

import { auth, googleProvider } from "@/utils/firebase";
import api from "@/utils/axios";
import type { UserData } from "@/types/chat";

import { getCurrentUser } from "@/features/getCurrentUser";
import { setUserdata } from "@/redux/userSlice";
import { useAppDispatch } from "@/redux/hooks";

import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import Artifact from "@/components/Artifact";

export default function Home() {
  const dispatch = useAppDispatch();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check for an existing login without blocking the chatbot.
  useEffect(() => {
    let cancelled = false;

    const checkUser = async () => {
      try {
        const data = await getCurrentUser();

        if (!cancelled) {
          dispatch(setUserdata(data));
        }
      } catch {
        if (!cancelled) {
          dispatch(setUserdata(null));
        }
      }
    };

    checkUser();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const googleLogin = async () => {
    setIsSigningIn(true);
    setErrorMessage("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const { data } = await api.post<{ user: UserData }>(
        "/api/auth/login",
        { token }
      );

      dispatch(setUserdata(data.user));
    } catch (error) {
      console.error("Google login failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-[#101114] text-white">
      <Sidebar
        onGoogleLogin={googleLogin}
        isSigningIn={isSigningIn}
        errorMessage={errorMessage}
      />

      <div className="flex min-w-0 flex-1 overflow-hidden">
        <ChatArea />
        <Artifact />
      </div>
    </main>
  );
}
