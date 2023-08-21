import { z, ZodType, type ZodError, ZodObject } from "zod";
export { z } from "zod";

type Simplify<T> = { [P in keyof T]: T[P] } & {};
type Schema = Record<string, ZodType>;

interface Options {
    onValidationError?: (error: ZodError) => void;
    skipValidation?: boolean;
}

const onValidationError = (error: ZodError) => {
    console.error("Invalid env variables:", error.flatten().fieldErrors);
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

export const getEnv = <T extends Schema>(
    schema: T,
    opts?: Options
): Readonly<Simplify<z.infer<ZodObject<T>>>> => {

    if(opts?.skipValidation) return process.env as any;

    const validationError = opts?.onValidationError ?? onValidationError;
    
    isValidSchema(schema);
    
    const _schema = z.object(schema);
    const parsed = _schema.safeParse(process.env);

    if (parsed.success === false) {
        validationError(parsed.error);
        throw new Error("Invalid env variables");
    }

    return parsed.data;
};