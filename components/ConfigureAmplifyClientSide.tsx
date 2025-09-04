'use client';
import { Amplify } from 'aws-amplify';
// import config from '@/amplifyconfiguration.json';
import outputs from '@/amplify_outputs.json';

import type { ResourcesConfig } from 'aws-amplify';

// if (
//   config.API &&
//   config.API.GraphQL &&
//   typeof config.API.GraphQL.defaultAuthMode === 'string'
// ) {
//   config.API.GraphQL.defaultAuthMode = config.API.GraphQL.defaultAuthMode;
// }

Amplify.configure(outputs as ResourcesConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}