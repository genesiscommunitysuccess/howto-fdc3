import { CustomEventMap } from '@genesislcap/foundation-events';
import { getApp } from '@genesislcap/foundation-shell/app';
import {
  AbstractStoreRoot,
  registerStore,
  StoreRoot,
  StoreRootEventDetailMap,
} from '@genesislcap/foundation-store';
import { observable } from '@genesislcap/web-core';

export enum StoreEvents {
  OpenTradeTicket = 'open-trade-ticket',
}

export interface Store extends StoreRoot {
  trade: any
}

export type StoreEventDetailMap = StoreRootEventDetailMap & {
  [StoreEvents.OpenTradeTicket]: any;
};

declare global {
  interface HTMLElementEventMap extends CustomEventMap<StoreEventDetailMap> {}
}

class DefaultStore extends AbstractStoreRoot<Store, StoreEventDetailMap> implements Store {
  @observable trade: Partial<any> = {};

  constructor() {
    super();

    /**
     * Register the store root
     */
    getApp().registerStoreRoot(this);

    this.createListener<any>(StoreEvents.OpenTradeTicket, (instrument) => {
      this.trade = instrument || {}
    });
  }
}

export const Store = registerStore(DefaultStore, 'Store');
