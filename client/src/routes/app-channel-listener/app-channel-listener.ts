import { Context } from "@finos/fdc3";
import { customElement, FoundationElement, html, observable, repeat } from "@genesislcap/web-core";

export const convertSnakeToCamel = (value: string, upperCamel = false): string => {

  return value.split('_').map((val, index) => {
    const lowerCase = val.toLowerCase();

    if (index === 0 || upperCamel) {
      return `${lowerCase.substring(0, 1).toUpperCase()}${lowerCase.slice(1, lowerCase.length)}`
    } else {
      return lowerCase;
    }

  }).join(' ');
}

interface TradeDetail {
  label: string;
  value: string;
}

@customElement({
  name: 'app-channel-listener',
  template: html<AppChannelListener>`
    <fdc3-context-listener :config="${x => [
      {
        channelType: 'genesis.fxtrade',
        channelName: 'customAppChannel',
        callback: message => x.handleChannelMessage(message)
      }
    ]}">
    </fdc3-context-listener>
    <h2>App Channel Listener</h2>
    ${repeat(x => x.fxTradeDetails, html<TradeDetail>`
        <div style="margin-bottom: 10px">
          <label style="text-transform: uppercase; font-size: 12px; font-weight: bold; margin-bottom: 10px;">
            ${x => x.label}
          </label>
          <div style="font-size: 16px;">
            ${x => x.value}
          </div>
        </div>
    `)}
  `
})
export class AppChannelListener extends FoundationElement {

  @observable fxTradeDetails: TradeDetail[] ;

  handleChannelMessage(message: Context): void {
    this.fxTradeDetails = Object.keys(message.id)
      .map(label => ({
        label: convertSnakeToCamel(label),
        value: message.id[label]
      }));
  }
}
