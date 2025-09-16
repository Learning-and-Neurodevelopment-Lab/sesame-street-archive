"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import CustomHeader from '@/components/CustomHeader';
import { useState } from "react";


export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    // ---- SSA Profile / signup gating ----
  const [profileCreated, setProfileCreated] = useState(false);

  const components = {
    Header: () => (
      <CustomHeader
        profileCreated={profileCreated}
        onProfileCreated={() => setProfileCreated(true)}
      />
    ),
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const res = await signIn("credentials", {
  //     username,
  //     password,
  //     redirect: true,
  //     callbackUrl: "/dashboard",
  //   });
  //   if (res?.error) setError("Invalid credentials");
  // };

  return (
    <>
      <div className="max-w-sm mx-auto py-16">
        
        <Authenticator hideSignUp={!profileCreated} className="authenticator-popup" components={components}>
          {({ signOut, user }) => {
            if (user) window.location.replace("/dashboard");
            return null;
          }}
        </Authenticator>
      </div>
    </>
  );
}