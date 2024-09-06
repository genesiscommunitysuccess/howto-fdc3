import { html } from '@genesislcap/web-core';
import type { Blotter } from './blotter';


export const BlotterTemplate = html<Blotter>`
  <!-- insert template code here -->
  <rapid-grid-pro 
    persist-filter-model-key="grid-pro-all-positions"
    >
    <fdc3-channel-event
      event-name="rowClicked" <!-- the event name you want to listen to  !-->
      channel-type="genesis.fxpair" <!-- this value will be passed as the context type on the channel ! -->
      <!-- the mapping function is callback that takes the event.detail and returns your payload, remember to include the 'id' property ! -->
      :mappingFunction="${() => ({SOURCE_CURRENCY, TARGET_CURRENCY}) => ({ id: { SOURCE_CURRENCY, TARGET_CURRENCY }})}"
    >
    </fdc3-channel-event>
    <fdc3-channel-event
      event-name="rowClicked"  <!-- the event name you want to listen to  !-->
      channel-type="genesis.fxpair" <!-- this value will be passed as the context type on the channel ! -->
      channel-name="customAppChannel" <!-- if this value is set a custom app channel will be used instead of the system color channel ! -->
      <!-- the mapping function is callback that takes the event.detail and returns your payload, remember to include the 'id' property ! -->
      :mappingFunction="${() => ({SOURCE_CURRENCY, TARGET_CURRENCY, NOTIONAL}) => ({ id: { SOURCE_CURRENCY, TARGET_CURRENCY, NOTIONAL }})}"
      >
    </fdc3-channel-event>
    <grid-pro-genesis-datasource
      resource-name="ALL_TRADES"
      :deferredGridOptions=${(x) => x.positionsGridOptions}
    >
    </grid-pro-genesis-datasource>
    <grid-pro-column :definition="${(x) => x.singlePositionActionColDef}"/>
  </rapid-grid-pro>
`;
