import { ZodType, z, } from 'zod'

export const env = (schema: Record<string, ZodType>) => {
    const _schema = z.object(schema);
    _schema.parse(process.env);
}


env({
    test: z.string().default('test'),
})