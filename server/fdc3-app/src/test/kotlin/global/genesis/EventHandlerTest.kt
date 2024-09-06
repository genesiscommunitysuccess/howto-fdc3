/**
  * This file tests the event handler APIs. 
  
  * The events: INSERT, MODIFY and DELETE are tested
  * Full documentation on event handler tests may be found here >> https://docs.genesis.global/docs/develop/server-capabilities/core-business-logic-event-handler/#integration-testing

 */

import global.genesis.db.rx.entity.multi.AsyncEntityDb
import global.genesis.gen.dao.Client
import global.genesis.gen.dao.Entity
import global.genesis.gen.dao.Trade
import global.genesis.gen.dao.enums.fdc3.trade.Side
import global.genesis.gen.dao.enums.fdc3.trade.Status
import global.genesis.message.core.event.EventReply
import global.genesis.testsupport.client.eventhandler.EventClientSync
import global.genesis.testsupport.jupiter.GenesisJunit
import global.genesis.testsupport.jupiter.TestScriptFile
import global.genesis.testsupport.jupiter.assertedCast
import jakarta.inject.Inject
import kotlin.String
import kotlin.Unit
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.runBlocking
import org.joda.time.DateTime.now
import org.joda.time.DateTime.parse
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(GenesisJunit::class)
@TestScriptFile("fdc3-eventhandler.kts")
class EventHandlerTest {
  @Inject
  lateinit var client: EventClientSync

  @Inject
  lateinit var entityDb: AsyncEntityDb

  private val adminUser: String = "admin"

  @Test
  fun `test insert ENTITY`(): Unit = runBlocking {
    val result = client.sendEvent(
      details = Entity {
        entityDescription = "1"
        entityName = "1"
      },
      messageType = "EVENT_ENTITY_INSERT",
      userName = adminUser
    )
    result.assertedCast<EventReply.EventAck>()
    val entity = entityDb.getBulk<Entity>().toList()
    assert(entity.isNotEmpty())
  }

  @Test
  fun `test modify ENTITY`(): Unit = runBlocking {
    val result = entityDb.insert(
      Entity {
        entityDescription = "1"
        entityName = "1"
      }
    )
    val entityNameValue = result.record.entityName
    val modifyResult = client.sendEvent(
      details = Entity {
        entityName = entityNameValue
        entityDescription = "2"
      },
      messageType = "EVENT_ENTITY_MODIFY",
      userName = adminUser
    )
    modifyResult.assertedCast<EventReply.EventAck>()
    val modifiedRecord = entityDb.get(Entity.ByName(entityNameValue))
    assert(modifiedRecord?.entityDescription == "2")
  }

  @Test
  fun `test delete ENTITY`(): Unit = runBlocking {
    val result = entityDb.insert(
      Entity {
        entityDescription = "1"
        entityName = "1"
      }
    )
    val numRecordsBefore = entityDb.getBulk<Entity>().toList().size
    val entityNameValue = result.record.entityName
    val deleteResult = client.sendEvent(
      details = Entity.ByName(entityNameValue),
      messageType = "EVENT_ENTITY_DELETE",
      userName = adminUser
    )
    deleteResult.assertedCast<EventReply.EventAck>()
    val numRecordsAfter = entityDb.getBulk<Entity>().toList().size
    assert(numRecordsAfter == numRecordsBefore - 1)
  }

  @Test
  fun `test insert CLIENT`(): Unit = runBlocking {
    val result = client.sendEvent(
      details = Client {
        clientName = "1"
        clientDescription = "1"
      },
      messageType = "EVENT_CLIENT_INSERT",
      userName = adminUser
    )
    result.assertedCast<EventReply.EventAck>()
    val client = entityDb.getBulk<Client>().toList()
    assert(client.isNotEmpty())
  }

  @Test
  fun `test modify CLIENT`(): Unit = runBlocking {
    val result = entityDb.insert(
      Client {
        clientName = "1"
        clientDescription = "1"
      }
    )
    val clientNameValue = result.record.clientName
    val modifyResult = client.sendEvent(
      details = Client {
        clientName = clientNameValue
        clientDescription = "2"
      },
      messageType = "EVENT_CLIENT_MODIFY",
      userName = adminUser
    )
    modifyResult.assertedCast<EventReply.EventAck>()
    val modifiedRecord = entityDb.get(Client.ByName(clientNameValue))
    assert(modifiedRecord?.clientDescription == "2")
  }

  @Test
  fun `test delete CLIENT`(): Unit = runBlocking {
    val result = entityDb.insert(
      Client {
        clientName = "1"
        clientDescription = "1"
      }
    )
    val numRecordsBefore = entityDb.getBulk<Client>().toList().size
    val clientNameValue = result.record.clientName
    val deleteResult = client.sendEvent(
      details = Client.ByName(clientNameValue),
      messageType = "EVENT_CLIENT_DELETE",
      userName = adminUser
    )
    deleteResult.assertedCast<EventReply.EventAck>()
    val numRecordsAfter = entityDb.getBulk<Client>().toList().size
    assert(numRecordsAfter == numRecordsBefore - 1)
  }

  @Test
  fun `test insert TRADE`(): Unit = runBlocking {
    val result = client.sendEvent(
      details = Trade {
        notional = 0.1
        clientName = "1"
        rate = 0.1
        entryDatetime = now()
        version = 1
        status = Status.New
        side = Side.Buy
        sourceCurrency = "1"
        settlementDate = now()
        targetCurrency = "1"
        entityName = "1"
      },
      messageType = "EVENT_TRADE_INSERT",
      userName = adminUser
    )
    result.assertedCast<EventReply.EventAck>()
    val trade = entityDb.getBulk<Trade>().toList()
    assert(trade.isNotEmpty())
  }

  @Test
  fun `test modify TRADE`(): Unit = runBlocking {
    val result = entityDb.insert(
      Trade {
        notional = 0.1
        clientName = "1"
        rate = 0.1
        entryDatetime = now()
        version = 1
        status = Status.New
        side = Side.Buy
        sourceCurrency = "1"
        settlementDate = now()
        targetCurrency = "1"
        entityName = "1"
      }
    )
    val tradeIdValue = result.record.tradeId
    val modifyResult = client.sendEvent(
      details = Trade {
        tradeId = tradeIdValue
        notional = 0.2
        clientName = "2"
        rate = 0.2
        entryDatetime = parse("2024-01-01T00:00:00.000Z")
        version = 2
        status = Status.Amended
        side = Side.Sell
        sourceCurrency = "2"
        settlementDate = parse("2024-01-01T00:00:00.000Z")
        targetCurrency = "2"
        entityName = "2"
      },
      messageType = "EVENT_TRADE_MODIFY",
      userName = adminUser
    )
    modifyResult.assertedCast<EventReply.EventAck>()
    val modifiedRecord = entityDb.get(Trade.ById(tradeIdValue))
    assert(modifiedRecord?.notional == 0.2)
    assert(modifiedRecord?.clientName == "2")
    assert(modifiedRecord?.rate == 0.2)
    assert(parse("2024-01-01T00:00:00.000Z").compareTo(modifiedRecord?.entryDatetime) == 0)
    assert(modifiedRecord?.version == 2)
    assert(modifiedRecord?.status == Status.Amended)
    assert(modifiedRecord?.side == Side.Sell)
    assert(modifiedRecord?.sourceCurrency == "2")
    assert(parse("2024-01-01T00:00:00.000Z").compareTo(modifiedRecord?.settlementDate) == 0)
    assert(modifiedRecord?.targetCurrency == "2")
    assert(modifiedRecord?.entityName == "2")
  }

  @Test
  fun `test delete TRADE`(): Unit = runBlocking {
    val result = entityDb.insert(
      Trade {
        notional = 0.1
        clientName = "1"
        rate = 0.1
        entryDatetime = now()
        version = 1
        status = Status.New
        side = Side.Buy
        sourceCurrency = "1"
        settlementDate = now()
        targetCurrency = "1"
        entityName = "1"
      }
    )
    val numRecordsBefore = entityDb.getBulk<Trade>().toList().size
    val tradeIdValue = result.record.tradeId
    val deleteResult = client.sendEvent(
      details = Trade.ById(tradeIdValue),
      messageType = "EVENT_TRADE_DELETE",
      userName = adminUser
    )
    deleteResult.assertedCast<EventReply.EventAck>()
    val numRecordsAfter = entityDb.getBulk<Trade>().toList().size
    assert(numRecordsAfter == numRecordsBefore - 1)
  }
}
