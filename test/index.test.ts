import exp from 'constants';
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
    expect(() => getEnv([])).toThrowError("Empty schema provided");
});

test('ts-env: It should throw if invalid schema is provided.', () => {
    expect(() => getEnv({ foo: "bar" } as any)).toThrowError("Invalid schema provided");
});

test('ts-env: It should throw if missing and env from a array schema', () => {
    expect(() => getEnv(["foo"])).toThrowError("Invalid env variables");
})

test('ts-env: It should throw if missing and env from a object schema', () => {
    expect(() => getEnv({ foo: z.string() })).toThrowError("Invalid env variables");
});

test('ts-env: It should not throw if missing and env from a object schema with defaults option', () => {
    expect(() => getEnv({ foo: z.string() }, { defaults: true })).not.toThrowError("Invalid env variables");
});

test('ts-env: It should not throw if missing and env from a array schema with defaults set to true', () => {

    expect(() => getEnv(["foo"], { defaults: true })).not.toThrowError("Invalid env variables");
});

test('ts-env: It should return a default value if env is not set and defaults option is set to true', () => {
    
        const { foo } = getEnv(["foo"], { defaults: true });
        expect(foo).toBe("foo_DEFAULT_VALUE");

        const { bar } = getEnv({ bar: z.string() }, { defaults: true });
        expect(bar).toBe("bar_DEFAULT_VALUE");
});

test('ts-env: It should be able to create complex zod schemas', () => {

    const FOO = 'pk_some_default_value';
    const BAR = '12345';
    const BAZ = 'foo';

    setEnv('bar', BAR);
    setEnv('baz', BAZ);

    const schema = {
        foo: z.string().default(FOO),
        bar: z.string().length(BAR.length),
        baz: z.enum(['foo', 'bar', 'baz'])
    }

    const { foo, bar, baz } = getEnv(schema)

    expect(foo).toBe(FOO);
    expect(bar).toBe(BAR);
    expect(baz).toBe(BAZ);


    unsetEnv('bar');

    expect(() => getEnv(schema)).toThrowError("Invalid env variables");
});