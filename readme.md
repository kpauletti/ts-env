# TS-ENV

Simple utility to validate environment variables

## Description

No more console logging to see if correct environment variables are set, with [zod](https://zod.dev/) 
we can validate envs at runtime or buildtime, set detaults, and enforce strict schemas. 

## Getting Started

Create an `env.js` file.

```js
const { getEnv, z } = require('@kpauletti/ts-env')

exports.env = getEnv({
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().default('1337'),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    APP_ENV: z.enum(['development', 'staging', 'qa', 'production']),
    SOME_TOKEN: z.string().optional()
})
```


```ts
import { getEnv, z } from '@kpauletti/ts-env';

interface Env {
    DB_HOST: string
    DB_PORT: string
    DB_USER: string
    DB_PASS: string
    APP_ENV: string
    SOME_TOKEN: string
}

export const env = getEnv<Env>({
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().default('1337'),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    APP_ENV: z.enum(['development', 'staging', 'qa', 'production']),
    SOME_TOKEN: z.string().optional()
})
```

Now wherever you need to reference an env variable

```js

import { env } from '@/env'

const db = await connect({
    host: env.DB_HOST,
    port: env.DB_PASS,
    auth: {
        user: env.DB_USER,
        password: env.DB_PASS
    }

})
```

## Authors

[@kpauletti](https://github.com/kpauletti)


## Acknowledgments

This is heavily inspired by [t3-env](https://env.t3.gg/).
