import { CellClickedEvent, ColDef } from '@ag-grid-community/core';
import { FDC3, FDC3Intents } from '@genesislcap/foundation-fdc3';
import { customElement, FASTElement, observable } from '@genesislcap/web-core';
import { BlotterStyles as styles } from './blotter.styles';
import { BlotterTemplate as template } from './blotter.template';

@customElement({
  name: 'blotter-route',
  template,
  styles,
})
export class Blotter extends FASTElement {
  @FDC3 fdc3: FDC3;

  @observable positionsGridOptions = {
    suppressRowClickSelection: true,
    onCellClicked: (e: CellClickedEvent) => {
      if (e.column.getColId() !== 'ADD_TRADE' || !e.node.isSelected()) {
        e.node.setSelected(!e.node.isSelected());
      }
    },
    defaultColDef: {
      wrapHeaderText: true,
      resizable: true,
      autoHeaderHeight: true,
      floatingFilter: true,
      sortable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      minWidth: 100,
    },
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
      position: 'right',
    },
  };

  public singlePositionActionColDef: ColDef = {
    headerName: 'Action',
    colId: 'ADD_TRADE',
    minWidth: 130,
    maxWidth: 130,
    cellRenderer: 'action', // AgRendererTypes.action
    cellRendererParams: {
      // In the click handler for the button we will raise an intent.
      actionClick: async (rowData) => {
        // Using the fdc3 service, this raises the 'CreateTrade' intent and passes with the 'fdc3.instrument' context type
        // the id value is the whole row. If you need to transform the data sent you can change the rowData property
        this.fdc3.raiseIntent(
          {
            id: rowData,
            type: 'fdc3.instrument',
          },
          'CreateTrade' as FDC3Intents,
        );
      },
      actionName: 'Add Trade',
      appearance: 'primary-gradient',
    },
    pinned: 'right',
  };

  @observable stockChartFilterCriteria: string;

  @observable stockChartConfiguration = {
    padding: 'auto',
    seriesField: 'instrument_id',
    xField: 'date',
    yField: 'open',
    xAxis: {
      type: 'time',
      tickCount: 10,
    },
    slider: {
      start: 0,
      end: 1.0,
    },
  };
}
