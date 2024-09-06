import type { AppRoute } from '@genesislcap/foundation-shell/app';

/**
 * Main route
 * @public
 */
export const users: AppRoute = {
    title: 'users',
    path: 'users',
    name: 'users',
    element: async () => (await import('@genesislcap/pbc-auth-ui')).Users,
    settings: { autoAuth: true, maxRows: 500 },
    navItems: [
        {
            navId: 'header',
            title: 'User Management',
        },
    ],
};

export const profiles: AppRoute = {
    title: 'profiles',
    path: 'profiles',
    name: 'profiles',
    element: async () => (await import('@genesislcap/pbc-auth-ui')).Profiles,
    settings: { autoAuth: true, maxRows: 500 },
    navItems: [
        {
            navId: 'header',
            title: 'Profiles',
        },
    ],
};
