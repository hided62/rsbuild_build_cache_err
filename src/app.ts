import { createSSRApp, type App as VueApp } from 'vue';
import App from './App.vue';
import './index.css';
import { buildRouter } from './router';
import type { LocationQueryRaw } from 'vue-router';

export type ServerPageContextType = {
    isSSR: true;
    isDev: boolean;
    path: string;
    query?: LocationQueryRaw;
};

export type ClientPageContextType = {
    isSSR: false;
    isDev: boolean;
};

export type PageContextType = ServerPageContextType | ClientPageContextType;

export function createVueApp(
    args: ServerPageContextType,
): Promise<VueApp<Element> | undefined>;
export function createVueApp(
    args: ClientPageContextType,
): Promise<VueApp<Element>>;
export async function createVueApp(
    args: PageContextType,
): Promise<VueApp<Element> | undefined> {
    if (args === undefined) {
        throw new Error('createVueApp args is undefined');
    }

    const app = createSSRApp(App);
    const router = buildRouter(args.isSSR);
    app.use(router);
    if (args.isSSR) {
        if (
            router.resolve({
                path: args.path,
                query: args.query,
            }).matched.length === 0
        ) {
            return undefined;
        }

        await router.push({
            path: args.path,
            query: args.query,
        });
    }

    await router.isReady();

    return app;
}
