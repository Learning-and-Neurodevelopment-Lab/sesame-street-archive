"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import CustomHeader from '@/components/CustomHeader';
import { useEffect, useState } from "react";
import { setupUserPersist } from '@/app/(main)/auth/signin/userPersist';

function SignIn() {
  const [profileCreated, setProfileCreated] = useState(false);

  const components = {
    Header: () => (
      <CustomHeader
        profileCreated={profileCreated}
        onProfileCreated={() => setProfileCreated(true)}
      />
    ),
  };

  useEffect(() => {
    setupUserPersist();
  }, [profileCreated]);

  return (
    <div className="max-w-sm mx-auto py-16">
      <Authenticator hideSignUp={!profileCreated} className="authenticator-popup" components={components}>
        {({ user }) => {
          if (user) setTimeout(() => window.location.replace("/dashboard"), 300);
          return null;
        }}
      </Authenticator>
    </div>
  );
}

export default function SignInPage() {
  return <SignIn />;
}