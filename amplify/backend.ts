import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

const { groups } = backend.auth.resources
groups["ADMIN"].role
groups["RESEARCHER"].role
groups["USER"].role

