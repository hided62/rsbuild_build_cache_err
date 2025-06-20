import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
    environments: {
        web: {
            source: {
                entry: {
                    index: './src/entry-client.ts',
                },
            },
            output: {
                target: 'web',
            },
            html: {
                template: './public/index.html',
            },
        },
        node: {
            source: {
                entry: {
                    index: './src/entry-server.ts',
                },
            },
            output: {
                target: 'node',
            },
            
        },
    },
    plugins: [pluginVue()],
    dev: {
        lazyCompilation: true,
        watchFiles: [
          {
            paths: ['src/**/*', 'public/**/*'],
            type: 'reload-page',
          },
          {
            paths: ['server/**/*'],
            type: 'reload-server',
          }
        ]
    },
    performance: {
        buildCache: true,
    },
    tools: {
        rspack: {
            optimization: {
                //concatenateModules: false, // Workaround
            }
        }
    }
    
});
