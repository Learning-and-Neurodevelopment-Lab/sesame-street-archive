'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

import type { ResourcesConfig } from 'aws-amplify';

Amplify.configure(outputs as ResourcesConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}