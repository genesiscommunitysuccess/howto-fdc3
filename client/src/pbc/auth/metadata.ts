import type { AppMetadata } from '@genesislcap/foundation-shell/app';

/**
 * @public
 */
export const metadata: AppMetadata = {
  name: '@genesislcap/pbc-auth-ui',
  description: 'Genesis Auth PBC',
  version: '1.2.2',
  prerequisites: {
    '@genesislcap/foundation-ui': '14.*',
    gsf: '7.*',
  },
  dependencies: {
    '@genesislcap/pbc-auth-ui': '1.0.4',
    serverDepId: '7.2.1',
  },
};
