import { renderToString } from 'vue/server-renderer';
import { createVueApp, type ServerPageContextType } from './app';

const isDev = import.meta.env.DEV;

export async function render(args: Omit<ServerPageContextType, 'isSSR'| 'isDev'>) {
    const app = await createVueApp({
        ...args,
        isSSR: true,
        isDev,
    });

    if (app === undefined) {
        return undefined;
    }

    return await renderToString(app);
}