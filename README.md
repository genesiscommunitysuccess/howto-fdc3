# FDC3 Web Client

This application has been generated using Genesis Create and has been adapted to demonstrate the features of `foundation-fdc3` library.

It serves several 'fdc3-apps' that leverage FDC3 interop features to interact with each other.

Note, each 'fdc3-app' is a different route on the web application but as they are loaded in a different Desktop Agent container. In a real life situation, your apps will have different origins.

# Development

1. Install dependencies:

```shell
npm run bootstrap
```

2. Start Web development server in watch mode:

```shell
npm run dev
```

3. Build for production:

```shell
npm run build
```

Preview production build:

```shell
npm run serve
```

## Configure FDC3 App Directory

We have several "fdc3-apps" running from different routes in the application.

We have provided a sample app directory in the `fdc3-config` folder. For interop copy these files into your __insert directory__

The app urls are set to run from localhost:6060/**app-name**. If you're app is not running from localhost:6060 update the url in the fdc3 config files accordingly.

- `howto-fdc3-blotter`: an app with a grid listing trades. When the row is clicked, a message is sent on the system color channel with `fdc3.Instrument` type. There is a button to add a trade which raises the `CreateTrade` intent.
- `howto-fdc3-intent-listener`: Launched by and listens to the `CreateTrade` intent. It contains a form for submitting a trade and is pre filled by the some intent data.
- `howto-fdc3-app-channel-listener`: Listens to the `genesis.fxpair` type on the system color channel.
- `howto-fdc3-system-channel-listener`: Listens to the `genesis.fxtrade` type on the specified custom channel `customAppChannel`.

The app directory json config files are in [Interop config](./fdc3-config/interop/). Copy them to C:\Users\**user-name**\AppData\Local\interop.io\io.Connect Desktop\Desktop\config\apps

You can then select your apps the apps in the interop launcher. Note you will have to login each time you open an application.

## Running in Desktop Agent

The application should be loaded in an [FDC3 Desktop Agent](https://fdc3.finos.org/docs/api/ref/DesktopAgent) to for the FDC3 functionality to work.

Start the server by running the following command in the *./fdc3-client* directory.

```shell
npm run dev
```

The desktop agent will load applications with the url specified in their app directory config files. Each url matches a route on the web application.

## FDC3 Apps Overview

There are 4 applications which interoperate using the foundation-fdc3 library. Each application has a color picker to select system channels (for that application only)

### howto-fdc3-blotter
The main application which displays a list of trades from the backend. Each row in the grid has a button to raise a `CreateTrade` intent.

When a row is clicked the application sends a message on an app channel with type `genesis.fxtrade` - the whole row object - and a message on the color channel with `genesis.fxpair` - use the `mappingFunction` to create and send an object with source and target currency values.

This is done by using `<fdc3-channel-event></fdc3-channel-event>` as a child element of the parent `<rapid-grid-pro></rapid-grid-pro>` element and specifying the event-name. To broadcast on a specific app channel the `channel-name` is specified on one of the elements.

```html
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
  ...
```

Note that you can listen to any event emitted by any parent element.

The intent is raised using the `FDC3` service from foundation-fdc3 library. In the trade button column definition, we invoked the method in the click handler to raise the intent.

```ts
cellRendererParams: {
  actionClick: async (rowData) => {
    this.fdc3.raiseIntent(
      {
        id: rowData,
        type: 'CreateTrade',
      },
      'CreateTrade' as FDC3Intents,
    );
  },
  ...
},
```

### intent-listener
An application with a form for submitting trades. It is launched by the `howto-fdc3-blotter` by the `CreateTrade` intent. On application load a listener is added to retrieve the intent payload and put it in the store. This happens in `main.template`.

```html
    // main.template.ts
  <fdc3-intent-listener :intentConfig="${x => [
    { intent: 'CreateTrade', callback: message => x.handleTicketIntent(message) },
  ]}"></fdc3-intent-listener>
```

Intents time out after 15 seconds so it is important that the listener code happens as early as possible.

When the component is loaded it retrieves the value from the store and populates the form.

### system-channel-listener
The `system-channel-listener` application uses the `<fdc3-system-channel-listener></fdc3-system-channel-listener>` web component to listen to the active color channel for events with channel type of `genesis.fxpair`.

```html
    ...
    <fdc3-system-channel-listener :config="${x => [
      {
        channelType: 'genesis.fxpair',
        callback: message => x.handleChannelMessage(message)
      }
    ]}"></fdc3-system-channel-listener>
    ...
```

### app-channel-listener
The `app-channel-listener` application uses the `<fdc3-context-listener></fdc3-context-listener>` wep component to listen to the `customAppChannel` for events with channel type of `genesis.fxtrade`.

```html
...
<fdc3-context-listener :config="${x => [
  {
    channelType: 'genesis.fxtrade',
    channelName: 'customAppChannel',
    callback: message => x.handleChannelMessage(message)
  }
]}">
</fdc3-context-listener>
...
```

As a non system channel is specified, changing color chanel will have no effect on receiving messages.
# Test results
BDD test results can be found [here](https://genesiscommunitysuccess.github.io/howto-fdc3/test-results)
