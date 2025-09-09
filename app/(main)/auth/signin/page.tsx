"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import CustomHeader from '@/components/CustomHeader';
import { redirect } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if (res?.error) setError("Invalid credentials");
  };

  return (
    <>
      <div className="max-w-sm mx-auto py-16">
        
        <Authenticator hideSignUp={true} components={{ Header: CustomHeader }}>
          {({ signOut, user }) => {
            if (user) window.location.replace("/dashboard");
            return null;
          }}
        </Authenticator>
      </div>
    </>
  );
}