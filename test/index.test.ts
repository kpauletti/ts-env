import { getEnv, z } from '../index';

const setEnv = (key: string, value: string) => {
    process.env[key] = value;
}

const unsetEnv = (key: string) => {
    process.env[key] = undefined;
}

test('ts-env: It should throw if no schema is provided.', () => {
    expect(() => getEnv(undefined as any)).toThrowError("No schema provided");
});

test('ts-env: It should throw if empty schema is provided.', () => {
    expect(() => getEnv({})).toThrowError("Empty schema provided");
});

test('ts-env: It should throw if invalid schema is provided.', () => {
    expect(() => getEnv({ FOO: "BAR" } as any)).toThrowError(/invalid|schema/i);
});

test('ts-env: It should throw if missing and env from a object schema', () => {
    expect(() => getEnv({ FOO: z.string() })).toThrowError("Invalid env variables");
});

test('ts-env: It should not throw if missing and env from a object schema with defaults option', () => {
    expect(() => getEnv({ FOO: z.string().default('FOO') })).not.toThrowError("Invalid env variables");
});


test('ts-env: It should return a default value if env is not set and defaults option is set to true', () => {

        const { BAR } = getEnv({ BAR: z.string().default("BAR_DEFAULT") });
        expect(BAR).toBe("BAR_DEFAULT");
});

test('ts-env: It should be able to create complex zod schemas', () => {

    const _FOO = 'pk_some_default_value';
    const _BAR = '12345';
    const _BAZ = 'FOO';

    setEnv('BAR', _BAR);
    setEnv('BAZ', _BAZ);

    const schema = {
        FOO: z.string().default(_FOO),
        BAR: z.string().length(_BAR.length),
        BAZ: z.enum(['FOO', 'BAR', 'BAZ'])
    }

    const { FOO, BAR, BAZ } = getEnv(schema)

    expect(FOO).toBe(FOO);
    expect(BAR).toBe(BAR);
    expect(BAZ).toBe(BAZ);


    unsetEnv('BAR');

    expect(() => getEnv(schema)).toThrowError("Invalid env variables");
});

test('ts-env: It should be able to pass a custom onValidationError function', () => {

    const onValidationError = (error: z.ZodError) => {
        const missingEnvs = Object.keys(error.flatten().fieldErrors)
        throw new Error('Looks like you forgot: ' + missingEnvs.join(', '));
    }

    const schema = {
        FOO: z.string(),
    }

    expect(() => getEnv(schema, { onValidationError })).toThrowError("Looks like you forgot: FOO");
})