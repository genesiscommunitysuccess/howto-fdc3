import { Connect, ConnectConfig, defaultConnectConfig } from '@genesislcap/foundation-comms';
import { EventEmitter } from '@genesislcap/foundation-events';
import { App } from '@genesislcap/foundation-shell/app';
import { importPBCAssets } from '@genesislcap/foundation-shell/pbc';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import { baseLayerLuminance, Container, customElement, DefaultRouteRecognizer, DOM, FASTElement, inject, observable, Registration, Route, StandardLuminance } from '@genesislcap/web-core';
import * as Components from '../components';
import { MainRouterConfig } from '../routes';
import { Store, StoreEventDetailMap, StoreEvents } from '../store';
import designTokens from '../styles/design-tokens.json';
import { MainStyles as styles } from './main.styles';
import { LoadingTemplate, MainTemplate, DynamicTemplate as template } from './main.template';

const name = 'fdc3showcase-root';

/**
 * @fires store-connected - Fired when the store is connected.
 * @fires store-ready - Fired when the store is ready.
 */
@customElement({
  name,
  template,
  styles,
})
export class MainApplication extends EventEmitter<StoreEventDetailMap>(FASTElement) {
  @App app: App;
  @Connect connect!: Connect;
  @Container container!: Container;
  @Store store: Store;

  @inject(MainRouterConfig) config!: MainRouterConfig;

  @observable provider!: any;
  @observable ready: boolean = false;
  @observable data: any = null;

  async connectedCallback() {
    this.registerDIDependencies();
    super.connectedCallback();
    this.addEventListeners();
    this.readyStore();
    await this.loadPBCs();
    await this.loadRemotes();
    DOM.queueUpdate(() => {
      configureDesignSystem(this.provider, designTokens);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
    this.disconnectStore();
  }

  onDarkModeToggle() {
    baseLayerLuminance.setValueFor(
      this.provider,
      baseLayerLuminance.getValueFor(this.provider) === StandardLuminance.DarkMode
        ? StandardLuminance.LightMode
        : StandardLuminance.DarkMode,
    );
  }

  async loadPBCs() {
    /**
     * Import PBC assets that may have been added to the ./pbc directory by genx or by hand
     */
    const pbcAssets = await importPBCAssets();
    /**
     * Register bulk assets
     */
    this.app.registerAssets(pbcAssets);
    /**
     * Register the top-level route collection
     */
    this.app.registerRouteCollection(this.config.routes);
  }

  async loadRemotes() {
    const { registerComponents } = Components;
    await registerComponents();
    this.ready = true;
  }

  selectTemplate() {
    return this.ready ? MainTemplate : LoadingTemplate;
  }

  private registerDIDependencies() {
    this.container.register(
      Registration.transient(DefaultRouteRecognizer, DefaultRouteRecognizer),
      /**
       * Register custom configs for core services and micro frontends. Note this can also be done via
       * provideDesignSystem().register(...) if preferred.
       *
       * Registration.instance<CredentialManagerConfig>(CredentialManagerConfig, {
       *  ...defaultCredentialManagerConfig,
       *  cookie: {
       *    ...defaultCredentialManagerConfig.cookie,
       *    path: '/login',
       *  },
       * }),
       */
      Registration.instance<ConnectConfig>(ConnectConfig, {
        ...defaultConnectConfig,
        connect: {
          ...defaultConnectConfig.connect,
          heartbeatInterval: 15_000,
        },
      }),
      /**
       * // example of setting grid options for all grids from app level
       * Registration.instance<GridOptionsConfig>(GridOptionsConfig, {
       *  defaultCsvExportParams: csvExportParams,
       * }),
       */
    );
  }

  protected addEventListeners() {
    this.addEventListener('store-connected', this.store.onConnected);
  }

  protected removeEventListeners() {
    this.removeEventListener('store-connected', this.store.onConnected);
  }

  protected readyStore() {
    // @ts-ignore
    this.$emit('store-connected', this);
    this.$emit('store-ready', true);
  }

  protected disconnectStore() {
    this.$emit('store-disconnected');
  }

  handleTicketIntent(message): void {
    // Dispatch the event to the store
    // The reason for this is the intent must be handled within 30 seconds
    // This code can be called before authentication
    this.$emit(StoreEvents.OpenTradeTicket, message.id);
    // when the intent is received redirect to the intent listener
    Route.path.push('/intent-listener');
  }
}
