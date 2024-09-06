import { EntityManagement } from '@genesislcap/foundation-entity-management';
import { Form } from '@genesislcap/foundation-forms';
import { Navigation } from '@genesislcap/foundation-header';
import { foundationLayoutComponents } from '@genesislcap/foundation-layout';
import { getApp } from '@genesislcap/foundation-shell/app';
import { FoundationRouter } from '@genesislcap/foundation-ui';
import * as zeroDesignSystem from '@genesislcap/foundation-zero';

import * as rapidDesignSystem from '@genesislcap/rapid-design-system';
import { rapidGridComponents } from '@genesislcap/rapid-grid-pro';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import { Fdc3ChannelController } from './fdc3-channel-controller/fdc3-channel-controller';

/**
 * Ensure tree shaking doesn't remove these.
 */
FoundationRouter;
Navigation;
EntityManagement;
Form;
Fdc3ChannelController;

/**
 * registerComponents.
 * @public
 */
export async function registerComponents() {
  /**
   * Register any PBC components with the design system
   */
  getApp().registerComponents({
    designSystem: rapidDesignSystem,
  });

  rapidDesignSystem
    .provideDesignSystem()
    .register(
      rapidDesignSystem.baseComponents,
      rapidGridComponents,
      g2plotChartsComponents,
      foundationLayoutComponents,
    )

  /**
   * Still required while we transition all PBCs to rapid. Remove when complete.
   */
  zeroDesignSystem
    .provideDesignSystem()
    .register(zeroDesignSystem.baseComponents, g2plotChartsComponents, foundationLayoutComponents);
}
