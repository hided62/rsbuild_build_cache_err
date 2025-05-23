import { createVueApp } from "./app";

const isDev = import.meta.env.DEV;

const app = await createVueApp({
    isSSR: false,
    isDev,
})
app.mount('#app');