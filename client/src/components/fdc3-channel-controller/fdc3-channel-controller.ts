import { customElement, FoundationElement, observable } from '@genesislcap/web-core';
import { Fdc3ChannelControllerStyles as styles } from "./fdc3-channel-controller.styles";
import { Fdc3ChannelControllerTemplate as template } from './fdc3-channel-controller.template';

import { Channel, getUserChannels } from '@finos/fdc3';
import { FDC3, FDC3Channel } from "@genesislcap/foundation-fdc3";
import { Subscription } from "rxjs";

@customElement({
  template,
  name: 'fdc3-channel-controller',
  styles
})
export class Fdc3ChannelController extends FoundationElement {

  @FDC3 fdc3: FDC3;

  @observable currentChannel: FDC3Channel;

  @observable userChannels: Channel[] = [];

  @observable channelSelectorActive: boolean;

  private channelSubscription: Subscription;

  async connectedCallback() {
    super.connectedCallback();

    if (window.fdc3) {
      this.channelSubscription = this.fdc3.currentChannel$.subscribe(channel => {
        this.currentChannel = channel;
      });
      this.userChannels = await getUserChannels();
    }
  }

  disconnectedCallback() {
    this.channelSubscription?.unsubscribe();
    super.disconnectedCallback();
  }

  async setUserChannel(channel: Channel) {
    await this.fdc3.joinChannel(channel.id);
    this.currentChannel = await this.fdc3.getCurrentChannel();
    this.channelSelectorActive = false;
  }

  toggleChannelSelector(): void {
    this.channelSelectorActive = !this.channelSelectorActive;
  }
}
