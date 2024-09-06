/**
 * System              : Genesis Business Library
 * Sub-System          : multi-pro-code-test Configuration
 * Version             : 1.0
 * Copyright           : (c) Genesis
 * Date                : 2022-03-18
 * Function : Provide system definition config for multi-pro-code-test.
 *
 * Modification History
 */
systemDefinition {
    global {
        item(name = "KAFKA_BOOTSTRAP_SERVER", value = "b-2.genesisignite.iz7jhl.c4.kafka.eu-west-2.amazonaws.com:9094,b-1.genesisignite.iz7jhl.c4.kafka.eu-west-2.amazonaws.com:9094")
        item(name = "KAFKA_FX_RATES_TOPIC_NAME", value = "fx-price")
    }

    systems {

    }

}
