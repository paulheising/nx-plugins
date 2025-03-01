import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import generator from './generator';
import { ServerlessGeneratorSchema } from './schema';

describe('serverless generator', () => {
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  describe('serverless-bundle', () => {
    const options: ServerlessGeneratorSchema = {
      plugin: 'serverless-bundle',
      name: 'sample',
      unitTestRunner: 'jest',
      linter: Linter.EsLint,
      strict: true,
      port: 3333,
    };

    it('should run successfully', async () => {
      await generator(appTree, options);
      const config = readProjectConfiguration(appTree, 'sample');
      expect(config).toEqual({
        root: 'apps/sample',
        projectType: 'application',
        sourceRoot: 'apps/sample/src',
        targets: {
          serve: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'offline',
            },
          },
          package: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['apps/sample/.serverless', 'dist/apps/sample'],
            dependsOn: [
              {
                target: 'build',
                projects: 'dependencies',
              },
            ],
            options: {
              command: 'package',
            },
          },
          deploy: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['apps/sample/.serverless', 'dist/apps/sample'],
            dependsOn: [
              {
                target: 'package',
                projects: 'self',
              },
            ],
            options: {
              command: 'deploy',
              package: '.serverless',
            },
          },
          remove: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'remove',
            },
          },
          sls: {
            executor: '@ns3/nx-serverless:sls',
            options: {},
          },
          test: {
            executor: '@nrwl/jest:jest',
            outputs: ['coverage/apps/sample'],
            options: {
              jestConfig: 'apps/sample/jest.config.ts',
              passWithNoTests: true,
            },
          },
          lint: {
            executor: '@nrwl/linter:eslint',
            outputs: ['{options.outputFile}'],
            options: {
              lintFilePatterns: ['apps/sample/src/**/*.{ts,tsx,js,jsx}'],
            },
          },
        },
        tags: [],
      });
    });
  });

  describe('@ns3/nx-serverless/plugin', () => {
    const options: ServerlessGeneratorSchema = {
      plugin: '@ns3/nx-serverless/plugin',
      name: 'sample',
      unitTestRunner: 'jest',
      linter: Linter.EsLint,
      strict: true,
      port: 3333,
    };

    it('should run successfully', async () => {
      await generator(appTree, options);
      const config = readProjectConfiguration(appTree, 'sample');
      expect(config).toEqual({
        root: 'apps/sample',
        projectType: 'application',
        sourceRoot: 'apps/sample/src',
        targets: {
          build: {
            executor: '@nrwl/node:webpack',
            outputs: ['{options.outputPath}'],
            options: {
              outputPath: 'dist/apps/sample',
              main: 'apps/sample/src/main.ts',
              tsConfig: 'apps/sample/tsconfig.app.json',
              externalDependencies: 'all',
            },
            configurations: {
              production: {
                optimization: true,
                extractLicenses: true,
                inspect: false,
                externalDependencies: 'none',
              },
            },
          },
          serve: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'offline',
              buildTarget: 'sample:build',
            },
          },
          package: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['apps/sample/.serverless', 'dist/apps/sample'],
            dependsOn: [
              {
                target: 'build',
                projects: 'dependencies',
              },
            ],
            options: {
              command: 'package',
              buildTarget: 'sample:build:production',
            },
          },
          deploy: {
            executor: '@ns3/nx-serverless:sls',
            outputs: ['apps/sample/.serverless', 'dist/apps/sample'],
            dependsOn: [
              {
                target: 'package',
                projects: 'self',
              },
            ],
            options: {
              command: 'deploy',
              package: '.serverless',
              buildTarget: 'sample:build:production',
            },
          },
          remove: {
            executor: '@ns3/nx-serverless:sls',
            options: {
              command: 'remove',
            },
          },
          sls: {
            executor: '@ns3/nx-serverless:sls',
            options: {},
          },
          test: {
            executor: '@nrwl/jest:jest',
            outputs: ['coverage/apps/sample'],
            options: {
              jestConfig: 'apps/sample/jest.config.ts',
              passWithNoTests: true,
            },
          },
          lint: {
            executor: '@nrwl/linter:eslint',
            outputs: ['{options.outputFile}'],
            options: {
              lintFilePatterns: ['apps/sample/src/**/*.{ts,tsx,js,jsx}'],
            },
          },
        },
        tags: [],
      });
    });
  });
});
