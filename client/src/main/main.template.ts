import { LAYOUT_POPOUT_CONTAINER_CLASS } from '@genesislcap/foundation-layout';
import type { ViewTemplate } from '@genesislcap/web-core';
import { html, ref } from '@genesislcap/web-core';
import type { MainApplication } from './main';

export const DynamicTemplate: ViewTemplate<MainApplication> = html`
  <template>
    <rapid-design-system-provider ${ref('provider')} class="${LAYOUT_POPOUT_CONTAINER_CLASS}">
      <div class="dynamic-template">${(x) => x.selectTemplate()}</div>
    </rapid-design-system-provider>
  </template>
`;

export const LoadingTemplate: ViewTemplate<MainApplication> = html`
  <rapid-progress-ring></rapid-progress-ring>
`;

export const MainTemplate: ViewTemplate<MainApplication> = html`
  <foundation-router
    @luminance-icon-clicked=${(x) => x.onDarkModeToggle()}
    :config=${(x) => x.config}
    :store=${(x) => x.store}
  ></foundation-router>
  <fdc3-intent-listener :intentConfig="${x => [
    { intent: 'CreateTrade', callback: message => x.handleTicketIntent(message) },
  ]}"></fdc3-intent-listener>
`;
