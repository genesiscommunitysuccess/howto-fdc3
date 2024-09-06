import { Context } from "@finos/fdc3";
import { customElement, FoundationElement, html, observable } from "@genesislcap/web-core";

@customElement({
  name: 'system-channel-listener',
  template: html<SystemChannelListener>`
    <!-- Add the system color channel listener to the template. !-->
    <fdc3-system-channel-listener :config="${x => [
      {
        channelType: 'genesis.fxpair', // the channel context type is 'genesis-fxpair'
        // when a channel message with correspdonding context is received, 
        // the callback is called with channel event payload
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
    // this method is passed to the channel listener as a callback
    // it generates a string showing the fx pair from the payload
    this.fxPair = `${message.id.SOURCE_CURRENCY}/${message.id.TARGET_CURRENCY}`;
  }
}
