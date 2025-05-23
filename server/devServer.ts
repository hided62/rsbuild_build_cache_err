import express from 'express';
import { createRsbuild, logger } from '@rsbuild/core';

import baseRSBuildConfig from '../rsbuild.config';
import type { LocationQueryRaw } from 'vue-router';
import { ObjectEntries } from '../src/util';
type EntryServerType = typeof import('../src/entry-server');


async function initRsbuild() {
    const rsbuild = await createRsbuild({
        rsbuildConfig: {
            ...baseRSBuildConfig,
            server: {
                middlewareMode: true,
            },
        },
    });
    console.log('rsbuild', rsbuild.getRsbuildConfig());
    return rsbuild.createDevServer();
}

function purifyQuery(query: express.Request['query']): LocationQueryRaw {
    const result: LocationQueryRaw = {};
    for (const [key, value] of ObjectEntries(query)) {
        if (value === undefined) {
            continue;
        }

        if (typeof value === 'string') {
            result[key] = value;
            continue;
        }

        if (Array.isArray(value)) {
            const convArr: string[] = [];
            for (const item of value) {
                if (typeof item === 'string') {
                    convArr.push(item);
                }
            }
        }

        if (typeof value === 'object') {
            continue;
        }

        console.warn('Unknown query type', key, value);
    }
    return result;
}

async function startDevServer() {
    const app = express();
    const rsbuild = await initRsbuild();
    const { environments } = rsbuild;

    logger.info('env', environments);

    const bundle = await environments.node.loadBundle<EntryServerType>('index');
    const template = await environments.web.getTransformedHtml('index');

    app.all('/api/*query', (req, res) => {
        res.json({
            message: 'Hello from API',
            query: req.query,
        });
    });

    // SSR when accessing any path (catch-all)
    app.get('/{*splat}', async (req, res, next) => {
        if (req.path.startsWith('/static')) {
            next();
            return;
        }

        if (req.path.indexOf('.hot-update.') !== -1) {
            // Ignore hot update requests
            next();
            return;
        }

        try {
            // Load server bundle
            const rendered = await bundle.render({
                path: req.path,
                query: purifyQuery(req.query),
            });

            if (rendered === undefined) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
                return;
            }

            const html = template.replace('<!--app-content-->', rendered);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (err) {
            logger.error('SSR failed: ', err);
            next();
        }
    });

    app.use(rsbuild.middlewares);

    const server = app.listen(rsbuild.port, async () => {
        await rsbuild.afterListen();
    });
    rsbuild.connectWebSocket({ server });
}

startDevServer();
