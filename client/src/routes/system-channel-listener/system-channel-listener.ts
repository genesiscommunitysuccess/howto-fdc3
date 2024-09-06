import { Context } from "@finos/fdc3";
import { customElement, FoundationElement, html, observable } from "@genesislcap/web-core";

@customElement({
  name: 'system-channel-listener',
  template: html<SystemChannelListener>`
    <fdc3-system-channel-listener :config="${x => [
      {
        channelType: 'genesis.fxpair',
        callback: message => x.handleChannelMessage(message)
      }
    ]}"></fdc3-system-channel-listener>
    <h1>System channel listener - FX Pair</h1>
    <h2>Value: ${x => x.fxPair}</h2>
  `
})
export class SystemChannelListener extends FoundationElement {

  @observable fxPair: string;

  handleChannelMessage(message: Context): void {
    this.fxPair = `${message.id.SOURCE_CURRENCY}/${message.id.TARGET_CURRENCY}`;
  }
}
