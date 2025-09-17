import { type ClientSchema, a, defineData } from "@aws-amplify/backend";



const schema = a.schema({
  Image: a.model({
    episode_id: a.string().required(),
    image_id: a.string().required(),
    isRestricted: a.boolean(),
    source: a.string(),
    height: a.integer(),
    width: a.integer(),
    season: a.integer(),
    air_year: a.integer(),
    episode_title: a.string()
    })
    .identifier(['episode_id','image_id'])
    .authorization(allow => [allow.publicApiKey()]),

Annotation: a
  .model({
    image_id: a.string().required(),
    annotation_id: a.integer().required(),
    user_id: a.string(),
    user: a.string(),
    deleted: a.boolean(),
    occluded: a.boolean(),
    restricted: a.boolean(),
    verified: a.boolean(),
    category: a.string(),
    polygon: a.json(),
    attributes: a.json(),
    species: a.string(),
    representation: a.string(),
    race: a.string(),
    age: a.string(),
    orientation: a.string(),
    angle: a.string(),
    visibility: a.string(),
    rotation: a.float(),
    multiletter: a.string(),
    singleletter: a.string(),
    case: a.string(),
    noun: a.boolean(),
    content: a.string(),
    multidigit: a.boolean(),
    keywords: a.string(),
    clarity: a.string(),
    scope: a.string(),
    function: a.string(),
    construction: a.string(),
    language: a.string(),
    x: a.float(),
    y: a.float(),
    height: a.float(),
    width: a.float()
  })
  .identifier(['image_id','annotation_id'] as const)
  .authorization((allow) => [allow.publicApiKey()]),
  

    // Minimal, stable user profile keyed by Cognito sub.
  Users: a
    .model({
      userSub: a.id().required(),
      email: a.email(),
      username: a.string(),
      first_name: a.string(),
      last_name: a.string(),
      characters: a.string().array(),
      })
    .identifier(["userSub"])
    
    .authorization((allow) => [
      allow.owner(), // the signed-in owner can CRUD their own profile
      allow.groups(["ADMIN"]).to(["read", "update","delete","get"]), // admins can help edit
    ]),
    // Minimal, stable user profile keyed by Cognito sub.
  DuaUsers: a
    .model({
      userSub: a.id().required(),
      email: a.email().required(),
      username: a.string().required(),

      first_name: a.string().required(),
      last_name: a.string().required(),
      organization: a.string().required(),
      // Optional extras (keep or remove as you like)
      orcid: a.string(),
      disciplines: a.string().array(),
      interests: a.string().array(),
      characters: a.string().array(),
      secondaryEmail: a.email(),
      phoneNumber: a.string(),
      github: a.string()
      })
    .identifier(["userSub"])
    .authorization((allow) => [
      allow.owner(), // the signed-in owner can CRUD their own profile
      allow.groups(["ADMIN"]).to(["read", "update", "delete"]), // admins can help edit
    ]),
  // Append-only DUA acceptance history (minimal)
  DuaConsent: a
    .model({
      userSub: a.id().required(),
      acceptedAt: a.datetime().required(), // use new Date().toISOString()
      duaVersion: a.string().required(),
      // Snapshot for audit (keep minimal)
      email: a.email().required(),
      username: a.string().required(),
    })
    .identifier(["userSub", "acceptedAt"])
    .authorization((allow) => [
      allow.owner().to(["create", "read"]), // users see their own consents
      allow.groups(["ADMIN"]).to(["read"]), // admins can audit
    ])

});


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});

