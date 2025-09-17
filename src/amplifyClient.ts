// src/amplifyClient.ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs, { ssr: true }); // ssr:true is harmless in SPA, need for Next.js
