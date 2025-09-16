
'use client';
import { Hub } from "aws-amplify/utils";
import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "amplify/data/resource"

const client = generateClient<Schema>({ authMode: "userPool" });

const USER_LOCAL_KEY = "userForm.pending";

type Queued = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  characters?: string[];
};

export function setupUserPersist() {
  return Hub.listen("auth", async ({ payload }) => {
    if (payload.event !== "signedIn") return;
    const raw = localStorage.getItem(USER_LOCAL_KEY);
    if (!raw) return;

    const data: Queued = JSON.parse(raw);

    

    try {
      const { userId: sub } = await getCurrentUser();
      if (!sub) return;
      console.log (sub);
      // 1) Pull verified identity data from Cognito (authoritative)
      let attrs = await fetchUserAttributes();            // { email, email_verified, given_name, family_name, ... }
      let email = attrs.email;

      // 2) Fallback if provider didn’t return attributes
      if (!email) {
        const sess = await fetchAuthSession();
        email = (sess.tokens?.idToken?.payload as any)?.email ?? "";
      }

      // 1) Append consent (minimal)
    //   await client.models.DuaConsent.create({
    //     userSub: sub,
    //     acceptedAt: new Date().toISOString(),
    //     email: data.email,
    //     username: data.username,
    //   });

      // 2) Upsert Users (required first)
      const baseRequired = {
        userSub: sub,
        email: email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
      };
      type UsersIdentifier = Parameters<typeof client.models.Users.get>[0];
// If this line errors, your PK is NOT userSub.
const ident: UsersIdentifier = { userSub: sub };

      // build optional extras without undefined
      const extras: Record<string, any> = {};
  
      if (data.characters?.length) extras.characters = data.characters;
  

      const existing = await client.models.Users.get({ userSub: sub });
      if (existing?.data) {
        await client.models.Users.update({
            userSub: sub,
            email,
            username: data.username,
            first_name: data.firstName,
            last_name: data.lastName,
            ...(data.characters?.length ? { characters: data.characters } : {}),
            } as any);

      } else {
        await client.models.Users.create({
            userSub: sub,
            email,
            username: data.username,
            first_name: data.firstName,
            last_name: data.lastName,
            ...(data.characters?.length ? { characters: data.characters } : {}),
            } as any);

      }
    } catch (e) {
      console.error("User persist failed:", e);
    } finally {
      localStorage.removeItem(USER_LOCAL_KEY);
    }
  });
}
