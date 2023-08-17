import { z, ZodType, type ZodError } from "zod";
export { z } from "zod";

type Schema = Record<string, ZodType>;
type SchemaArray = Array<string>;

const arrayToSchema = (keys: SchemaArray) => {
    return keys.reduce((acc, key) => {
        acc[key] = z.string();
        return acc;
    }, {} as Schema);
};

const schemaToZodObject = (schema: Schema, defaults: boolean) => {

    if (defaults) {
        return z.object(applyDefaults(schema));
    }

    return z.object(schema);
};

const onValidationError = (error: ZodError) => {
    console.error("Invalid env variables:", error.flatten().fieldErrors);
    throw new Error("Invalid env variables");
};

const throwIfEmpty = (obj: Schema | SchemaArray) => {
    if (!obj) {
        throw new Error("No schema provided");
    }

    const keys = Array.isArray(obj) ? obj : Object.keys(obj);

    if (keys.length === 0) {
        throw new Error("Empty schema provided");
    }
};

const throwIfInvalid = (obj: Schema | SchemaArray) => {
    throwIfEmpty(obj);

    if (!isValidSchema(obj)) {
        throw new Error("Invalid schema provided");
    }
};

const isValidSchema = (obj: Schema | SchemaArray) => {
    if (Array.isArray(obj)) {
        return obj.every((key) => typeof key === "string");
    }
    return Object.values(obj).every((value) => {
        return typeof value === "object" && value instanceof ZodType;
    });
};

const applyDefaults = (obj: Schema) => {
    return Object.keys(obj).reduce((acc, key) => {
        const field = obj[key] as ZodType;

        acc[key] = field.default(key + "_DEFAULT_VALUE");

        return acc;
    }, {} as Schema);
};

type EnvOpts = {
    onValidationError?: (error: ZodError) => void;
    defaults?: boolean;
};

export const getEnv = (schema: Schema | SchemaArray, opts?: EnvOpts) => {
    throwIfInvalid(schema);

    const _schema = Array.isArray(schema)
        ? schemaToZodObject(arrayToSchema(schema), opts?.defaults ?? false)
        : schemaToZodObject(schema, opts?.defaults ?? false);
    const parsed = _schema.safeParse(process.env);

    if (parsed.success === false) {
        opts?.onValidationError ? opts.onValidationError(parsed.error) : onValidationError(parsed.error);
        return;
    }

    return parsed.data as any;
};
