import { css } from '@genesislcap/web-core';

export const Fdc3ChannelControllerStyles = css`

  .channel-selector {
    position: relative;
  }

  .channel-selector-current {
    cursor: pointer;
    padding: 10px;
    
    label {
      font-size: 12px;
      text-transform: uppercase;
    }
  }
  
  .channel-selector-options {
    position: absolute;
    top: 0;
    background: var(--neutral-fill-rest);
  }
`;
