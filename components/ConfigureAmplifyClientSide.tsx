'use client';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import { setupUserPersist } from '@/app/(main)/auth/signin/userPersist';

import type { ResourcesConfig } from 'aws-amplify';

Amplify.configure(outputs as ResourcesConfig, { ssr: true });
setupUserPersist();

export default function ConfigureAmplifyClientSide() {
  return null;
}