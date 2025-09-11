import { Hub } from "aws-amplify/utils";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

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
        email: data.email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
      };

      // build optional extras without undefined
      const extras: Record<string, any> = {};
  
      if (data.characters?.length) extras.characters = data.characters;
  

      const existing = await client.models.Users.get({ userSub: sub });
      if (existing?.data) {
        await client.models.Users.update({ ...baseRequired, ...extras });
      } else {
        await client.models.Users.create({ ...baseRequired, ...extras });
      }
    } catch (e) {
      console.error("User persist failed:", e);
    } finally {
      localStorage.removeItem(USER_LOCAL_KEY);
    }
  });
}
