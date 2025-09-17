import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'sesame-street-images',
  access: (allow) => ({
    'dev/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),          // all signed-in users can read
      allow.groups(["RESEARCHER", "USER"]).to(["read"]), 
      allow.groups(["ADMIN"]).to(["read", "write"]), // admins can help edit
    ],
    'input/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),          // all signed-in users can read
      allow.groups(["RESEARCHER", "USER"]).to(["read"]), 
      allow.groups(["ADMIN"]).to(["read", "write"]), // admins can help edit
    ],
    'data/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),          // all signed-in users can read
      allow.groups(["RESEARCHER", "USER"]).to(["read"]), 
      allow.groups(["ADMIN"]).to(["read", "write"]), // admins can help edit
    ],
    'images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),          // all signed-in users can read this makes the USER group redundant
      allow.groups(["RESEARCHER", "USER"]).to(["read"]), 
      allow.groups(["ADMIN"]).to(["read", "write"]), // admins can help edit
    ]
  })
});
