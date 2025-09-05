import { Hub } from "aws-amplify/utils";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>({ authMode: "userPool" });

const LOCAL_KEY = "duaForm.pending";
const DUA_VERSION = "2025-09-01";

type Queued = {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  username: string;
  orcid?: string;
  disciplines?: string[];
  interests?: string[];
  characters?: string[];
  secondaryEmail?: string;
  phoneNumber?: string;
  github?: string;
};

export function setupDuaPersist() {
  return Hub.listen("auth", async ({ payload }) => {
    if (payload.event !== "signedIn") return;
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return;

    const data: Queued = JSON.parse(raw);

    try {
      const { userId: sub } = await getCurrentUser();
      if (!sub) return;

      // 1) Append consent (minimal)
      await client.models.DuaConsent.create({
        userSub: sub,
        acceptedAt: new Date().toISOString(),
        duaVersion: DUA_VERSION,
        email: data.email,
        username: data.username,
      });

      // 2) Upsert Users (required first)
      const baseRequired = {
        userSub: sub,
        email: data.email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        organization: data.organization,
      };

      // build optional extras without undefined
      const extras: Record<string, any> = {};
      if (data.orcid) extras.orcid = data.orcid;
      if (data.disciplines?.length) extras.disciplines = data.disciplines;
      if (data.interests?.length) extras.interests = data.interests;
      if (data.characters?.length) extras.characters = data.characters;
      if (data.secondaryEmail) extras.secondaryEmail = data.secondaryEmail;
      if (data.phoneNumber) extras.phoneNumber = data.phoneNumber;
      if (data.github) extras.github = data.github;

      const existing = await client.models.Users.get({ userSub: sub });
      if (existing?.data) {
        await client.models.Users.update({ ...baseRequired, ...extras });
      } else {
        await client.models.Users.create({ ...baseRequired, ...extras });
      }
    } catch (e) {
      console.error("DUA persist failed:", e);
    } finally {
      localStorage.removeItem(LOCAL_KEY);
    }
  });
}
