import { z, ZodType, type ZodError, ZodObject } from "zod";
export { z } from "zod";

type Simplify<T> = { [P in keyof T]: T[P] } & {};
type Schema = Record<string, ZodType>;

const onValidationError = (error: ZodError) => {
    console.error("Invalid env variables:", error.flatten().fieldErrors);
    throw new Error("Invalid env variables");
};

const isValidSchema = (obj: Schema) => {
    if(!obj) {
        throw new Error("No schema provided");
    }
    if(Object.keys(obj).length === 0) {
        throw new Error("Empty schema provided");
    }
    for (const key in obj) {
        if (typeof obj[key] !== "object" || !(obj[key] instanceof ZodType)) {
            throw new Error(`Invalid schema for key "${key}"`);
        }
    }
};

type EnvOpts = {
    onValidationError?: (error: ZodError) => void;
};

export const getEnv = <T extends Schema>(
    schema: T,
    opts?: EnvOpts
): Readonly<Simplify<z.infer<ZodObject<T>>>> => {
    
    isValidSchema(schema);
    
    const _schema = z.object(schema);
    const parsed = _schema.safeParse(process.env);


    if (parsed.success === false) {
        opts?.onValidationError ? opts.onValidationError(parsed.error) : onValidationError(parsed.error);
        throw new Error("Invalid env variables");
    }

    return parsed.data;
};