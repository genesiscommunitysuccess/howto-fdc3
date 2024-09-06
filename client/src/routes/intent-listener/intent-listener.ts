import { whenElse } from "@genesislcap/foundation-utils";
import { customElement, FoundationElement, html, observable } from "@genesislcap/web-core";
import { Store } from "../../store";

@customElement({
  name: 'intent-resolver',
  template: html<IntentListener>`
    ${whenElse(
      x => !x.tradeSuccess, 
      html`
        <foundation-form
          style="height: 100%;"
          resourceName=${() => 'EVENT_TRADE_INSERT'}
          :data="${x => x.formData}"
          @submit-success=${(x) => x.handleSuccess()}
        ></foundation-form>
      `,
      html`
        <h2 style="margin: 20px; text-align: center">Trade entered</h2>
      `
    )}

  `
})
export class IntentListener extends FoundationElement {
  @Store store: Store;

  @observable formData: any = {};

  @observable tradeSuccess;
s
  connectedCallback() {
    super.connectedCallback();
    this.formData = this.store.trade;
    this.store.binding(
      (s) => s.trade,
      (instrument) => {
        this.tradeSuccess = false;
        const { ENTITY_NAME, SOURCE_CURRENCY, TARGET_CURRENCY, SIDE } = instrument;
        this.formData = {
          ENTITY_NAME,
          SOURCE_CURRENCY,
          TARGET_CURRENCY,
          SIDE
        }
      },
    );
  }

  handleSuccess() {
    this.tradeSuccess = true;
  }

}
