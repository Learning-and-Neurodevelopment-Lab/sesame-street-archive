"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import CustomHeader from '@/components/CustomHeader';

export default function SignInPage() {
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