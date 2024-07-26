import 'hono';

declare module 'hono' {
    interface Context {
        auth: {
            userId?: string;
        }
    }
}

