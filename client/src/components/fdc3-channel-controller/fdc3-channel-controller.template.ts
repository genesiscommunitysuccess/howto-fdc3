import { Channel } from "@finos/fdc3";
import { ExecutionContext, html, repeat, when } from "@genesislcap/web-core";
import { Fdc3ChannelController } from './fdc3-channel-controller';

export const Fdc3ChannelControllerTemplate = html<Fdc3ChannelController>`
    <template>
      <div class="channel-selector">
        <div class="channel-selector-current" @click="${x => x.toggleChannelSelector()}">
          <label>Current channel</label>
          <div class="channel-selector-current-channel">
            ${when(x => !!x.currentChannel, html<Fdc3ChannelController>`
              ${x => x.currentChannel.displayMetadata.name}
              <span style="display: inline-block; height: 10px; width: 10px; background: ${x => x.currentChannel.displayMetadata.color }"></span>
            `)}
            ${when(x => !x.currentChannel, html<Fdc3ChannelController>`
              None selected
            `)}
          </div>
        </div>
        ${when(x => x.channelSelectorActive, html<Fdc3ChannelController>`
          <div class="channel-selector-options">
            ${repeat(x => x.userChannels, html<Channel>`
            <rapid-button 
              @click="${(x, ctx: ExecutionContext<Fdc3ChannelController>) => ctx.parent.setUserChannel(x)}" 
              appearence="primary">
              ${ x => x.displayMetadata.name }
              <span slot="end" style="height: 10px; width: 10px; background: ${x => x.displayMetadata.color }"></span>
            </rapid-button>
          `)}
          </div>
        `)}    
      </div>
    </template>
`;
