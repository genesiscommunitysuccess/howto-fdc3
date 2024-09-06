import { Auth, Session } from '@genesislcap/foundation-comms';
import {
  defaultLoginConfig,
  LoginConfig,
  Settings as LoginSettings,
} from '@genesislcap/foundation-login';
import { FoundationRouterConfiguration } from '@genesislcap/foundation-ui';
import { optional, Route } from '@genesislcap/web-core';
import { defaultLayout, loginLayout } from '../layouts';
import { AppChannelListener } from "./app-channel-listener/app-channel-listener";
import { Blotter } from './blotter/blotter';
import { IntentListener } from "./intent-listener/intent-listener";
import { NotFound } from './not-found/not-found';
import { SystemChannelListener } from "./system-channel-listener/system-channel-listener";

// eslint-disable-next-line
declare var ENABLE_SSO: string;

const ssoSettings =
  typeof ENABLE_SSO !== 'undefined' && ENABLE_SSO === 'true'
    ? {
        autoAuth: true,
        sso: {
          toggled: true,
          identityProvidersPath: 'sso/list',
        },
      }
    : {};

export class MainRouterConfig extends FoundationRouterConfiguration<LoginSettings> {
  constructor(
    @Auth private auth: Auth,
    @Session private session: Session,
    @optional(LoginConfig)
    private loginConfig: LoginConfig = { ...defaultLoginConfig, autoAuth: true, autoConnect: true },
  ) {
    super();
  }

  async configure() {
    this.configureAnalytics();
    this.title = 'Fdc3 Showcase';
    this.defaultLayout = defaultLayout;

    const authPath = 'login';

    this.routes.map(
      { path: '', redirect: authPath },
      {
        path: authPath,
        name: 'login',
        title: 'Login',
        element: async () => {
          const { configure, define } = await import(
            /* webpackChunkName: "foundation-login" */
            '@genesislcap/foundation-login'
          );
          configure(this.container, {
            hostPath: 'login',
            autoConnect: true,
            autoAuth: true,
            defaultRedirectUrl: 'blotter',
            ...ssoSettings,
          });
          return define({
            name: `fdc3showcase-root-login`,
            /**
             * You can augment the template and styles here when needed.
             */
          });
        },
        layout: loginLayout,
        settings: { public: true },
        childRouters: true,
      },
      { path: 'not-found', element: NotFound, title: 'Not Found', name: 'not-found' },
      {
        path: 'blotter',
        element: Blotter,
        title: 'Blotter',
        name: 'blotter',
      },
      {
        path: 'app-channel-listener',
        element: AppChannelListener,
        title: 'App Channel Listener',
        name: 'app-channel-listener',
      },
      {
        path: 'system-channel-listener',
        element: SystemChannelListener,
        title: 'System Channel Listener',
        name: 'system-channel-listener',
      },
      {
        path: 'intent-listener',
        element: IntentListener,
        title: 'Intent Listener',
        name: 'intent-listener'
      },
    );

    /**
     * Example of a FallbackRouteDefinition
     */
    this.routes.fallback(() =>
      this.auth.isLoggedIn ? { redirect: 'not-found' } : { redirect: authPath },
    );

    /**
     * Example of a NavigationContributor
     */
    this.contributors.push({
      navigate: async (phase) => {
        const settings = phase.route.settings;

        /**
         * If public route don't block
         */
        if (settings && settings.public) {
          return;
        }

        /**
         * If logged in don't block
         */
        if (this.auth.isLoggedIn) {
          return;
        }

        /**
         * If allowAutoAuth and session is valid try to connect+auto-login
         */
        if (this.loginConfig.autoAuth && (await this.auth.reAuthFromSession())) {
          return;
        }

        /**
         * Otherwise route them somewhere, like to a login
         */
        phase.cancel(() => {
          this.session.captureReturnUrl();
          Route.name.replace(phase.router, authPath);
        });
      },
    });
  }
}
