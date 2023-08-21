# TS-ENV

Simple utility to validate environment variables

## Description

No more console logging to see if correct environment variables are set, with [zod](https://zod.dev/) 
we can validate envs at runtime or build-time, set defaults, and enforce strict schemas. 

## Getting Started

Create an `env.ts` file.

```ts
import { getEnv, z } from '@kpauletti/ts-env';

export const env = getEnv({
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().default('1337'),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    APP_ENV: z.enum(['development', 'staging', 'qa', 'production']),
    SOME_TOKEN: z.string().optional()
})
```

Now wherever you need to reference an env variable

```ts
import { env } from '../utils/env'

await connect({
    host: env.DB_HOST,
    port: env.DB_PORT,
    auth: {
        user: env.DB_USER,
        pass: env.DB_PASS
    }
})
```

Provides autocomplete for your environment variables as well.

![gif](https://s11.gifyu.com/images/SgTOK.gif)

## Authors

[@kpauletti](https://github.com/kpauletti)


## Acknowledgments

This is heavily inspired by [t3-env](https://env.t3.gg/).
