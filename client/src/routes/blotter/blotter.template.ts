import { html } from '@genesislcap/web-core';
import type { Blotter } from './blotter';


export const BlotterTemplate = html<Blotter>`
  <!-- insert template code here -->
  <rapid-grid-pro 
    persist-filter-model-key="grid-pro-all-positions"
    >
    <fdc3-channel-event
      event-name="rowClicked"
      channel-type="genesis.fxpair"
      :mappingFunction="${() => ({SOURCE_CURRENCY, TARGET_CURRENCY}) => ({SOURCE_CURRENCY, TARGET_CURRENCY})}">
    </fdc3-channel-event>
    <fdc3-channel-event
      event-name="rowClicked"
      channel-name="customAppChannel"
      channel-type="genesis.fxtrade">
    </fdc3-channel-event>
    <grid-pro-genesis-datasource
      resource-name="ALL_TRADES"
      :deferredGridOptions=${(x) => x.positionsGridOptions}
    >
    </grid-pro-genesis-datasource>
    <grid-pro-column :definition="${(x) => x.singlePositionActionColDef}"/>
  </rapid-grid-pro>
`;
