/**
  * This file defines the data server queries for the application. Data server
  * will load the data defined here and expose APIs for the clients including
  * Genesis UI Components to present this data as well as keep it up to date as
  * the data set changes underneath.
  *
  * Data server queries also allow for the definition of dynamic columns as well
  * as rich access controls definitions.

  * Full documentation on dataserver may be found here >> https://learn.genesis.global/docs/server/data-server/introduction/

 */

dataServer {
  query("ALL_ENTITYS", ENTITY) {
    fields {
      ENTITY_NAME
      ENTITY_DESCRIPTION
    }
  }
  query("ALL_CLIENTS", CLIENT) {
    fields {
      CLIENT_NAME
      CLIENT_DESCRIPTION
    }
  }
  query("ALL_TRADES", TRADE) {
    fields {
      ENTRY_DATETIME
      TRADE_ID
      VERSION
      STATUS
      SIDE
      TARGET_CURRENCY
      SOURCE_CURRENCY
      NOTIONAL
      RATE
      SETTLEMENT_DATE
      CLIENT_NAME
      ENTITY_NAME
      derivedField("SOURCE_NOTIONAL", DOUBLE) {
        notional * -1.0 / rate
      }
    }
  }



  //TODO - add new queries or update existing queries to add authorization
  /**
    * You can add derived field like below
    * derivedField("FIELD_NAME", BOOLEAN) {
    *                 THIS_ENTITY.ATTR1 == "USD"
    *             }
    * You can add permission to the query by using permission codes like below
    * permissioning {
    *     // 'permission Code' list, users must have the permission to access the enclosing resource
    *     permissionCodes = listOf("PERMISSION1", "PERMISSION2")
    * }
    * Full documentation on permissions may be found here https://learn.genesis.global/docs/server/access-control/authorisation-overview/#authorisation  */

}
