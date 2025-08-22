/*
 * Copyright (c) 2023 mjcross
 * Copyright (c) 2024 Gemini
 *
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * This file is a unified and adapted version of the esp32-onewire component.
 * It has been modified to use the legacy driver/rmt.h API instead of the
 * newer driver/rmt_tx.h and driver/rmt_rx.h APIs.
 */

#include "1wire.h"
#include "esp_log.h"
#include <string.h>

static const char *TAG = "onewire";

// Helper macros to access rmt_item32_t fields without triggering Intellisense warnings
// about anonymous structs. This is done by accessing the raw 'val' and using bitmasks.
#define RMT_DURATION0(item) ((item).val & 0x7FFF)
#define RMT_LEVEL0(item)    (((item).val >> 15) & 0x1)
#define RMT_DURATION1(item) (((item).val >> 16) & 0x7FFF)
#define RMT_LEVEL1(item)    (((item).val >> 31) & 0x1)

// File-scope constants for RMT symbols, initialized directly for maximum compatibility.
static const rmt_item32_t ow_symbol_0 = { .val = ( (OW_TIMING_PARAM_D << 16) | (OW_BUS_RELEASED << 31) | (OW_TIMING_PARAM_C) | (OW_BUS_ASSERTED << 15) ) };
static const rmt_item32_t ow_symbol_1 = { .val = ( (OW_TIMING_PARAM_B << 16) | (OW_BUS_RELEASED << 31) | (OW_TIMING_PARAM_A) | (OW_BUS_ASSERTED << 15) ) };
static const rmt_item32_t ow_symbol_reset = { .val = ( ((OW_TIMING_PARAM_I + OW_TIMING_PARAM_J) << 16) | (OW_BUS_RELEASED << 31) | (OW_TIMING_PARAM_H) | (OW_BUS_ASSERTED << 15) ) };


// --- ow_init.c ---

/**
 * @brief Initialize the RMT peripheral for OneWire communication.
 */
bool ow_init(OneWireConfig_t *ow, gpio_num_t gpio_num) {
    if (ow == NULL) {
        return false;
    }
    memset(ow, 0, sizeof(OneWireConfig_t));
    ow->gpio_num = gpio_num;
    ow->rmt_channel = OW_RMT_CHANNEL;

    // Configure RMT using C89/C++ compatible member assignment
    rmt_config_t rmt_cfg;
    memset(&rmt_cfg, 0, sizeof(rmt_cfg)); // Zero-initialize the struct

    rmt_cfg.rmt_mode = RMT_MODE_TX;
    rmt_cfg.channel = ow->rmt_channel;
    rmt_cfg.gpio_num = ow->gpio_num;
    rmt_cfg.clk_div = OW_RMT_CLK_DIV;
    rmt_cfg.mem_block_num = 1;
    
    // Configure TX-specific parameters
    rmt_cfg.tx_config.carrier_en = false;
    rmt_cfg.tx_config.idle_output_en = true;
    rmt_cfg.tx_config.idle_level = RMT_IDLE_LEVEL_HIGH; // Bus released
    rmt_cfg.tx_config.loop_en = false;
    
    // The RMT peripheral will be set to open-drain mode by setting the GPIO pin mode.
    rmt_cfg.flags = RMT_CHANNEL_FLAGS_INVERT_SIG; // Invert signal to pull bus low
    
    ESP_ERROR_CHECK(rmt_config(&rmt_cfg));

    // Install RMT driver with a receive buffer
    ESP_ERROR_CHECK(rmt_driver_install(ow->rmt_channel, OW_RX_BUFFER_SIZE, 0));

    // Get the ring buffer handle
    ESP_ERROR_CHECK(rmt_get_ringbuf_handle(ow->rmt_channel, &ow->rx_ringbuf));

    // Set GPIO to open-drain mode
    gpio_set_direction(ow->gpio_num, GPIO_MODE_INPUT_OUTPUT_OD);

    return true;
}

/**
 * @brief De-initialize the OneWire driver.
 */
void ow_deinit(OneWireConfig_t *ow) {
    if (ow) {
        rmt_driver_uninstall(ow->rmt_channel);
    }
}


// --- ow_reset.c ---

/**
 * @brief Send a reset pulse and check for presence.
 */
bool ow_reset(OneWireConfig_t *ow) {
    size_t rx_size = 0;
    rmt_item32_t *rx_items = NULL;
    bool is_present = false;

    // Set RX idle threshold to be longer than the reset pulse
    rmt_set_rx_idle_thresh(ow->rmt_channel, OW_TIMING_PARAM_H + OW_TIMING_PARAM_J + 10);
    
    // Start RX
    rmt_rx_start(ow->rmt_channel, true);

    // Send the reset pulse
    if (rmt_write_items(ow->rmt_channel, &ow_symbol_reset, 1, true) != ESP_OK) {
        ESP_LOGE(TAG, "Reset pulse send failed");
        rmt_rx_stop(ow->rmt_channel);
        return false;
    }

    // Wait for reception
    rx_items = (rmt_item32_t *)xRingbufferReceive(ow->rx_ringbuf, &rx_size, pdMS_TO_TICKS(OW_RMT_TIMEOUT_MS));
    if (rx_items) {
        size_t num_items = rx_size / sizeof(rmt_item32_t);
        // We expect at least 2 items: the echo of our reset pulse, and the presence pulse from a slave.
        if (num_items >= 2) {
            // Check if the second item looks like a presence pulse (a low signal)
            if (RMT_LEVEL0(rx_items[1]) == OW_BUS_ASSERTED && RMT_DURATION0(rx_items[1]) > 0) {
                 is_present = true;
            }
        }
        vRingbufferReturnItem(ow->rx_ringbuf, (void *)rx_items);
    } else {
        ESP_LOGD(TAG, "Reset: RX timeout");
    }

    rmt_rx_stop(ow->rmt_channel);
    return is_present;
}


// --- ow_send.c ---

/**
 * @brief Send a byte on the OneWire bus.
 */
void ow_send(OneWireConfig_t *ow, uint8_t data) {
    rmt_item32_t tx_items[8];

    for (int i = 0; i < 8; i++) {
        tx_items[i] = (data & (1 << i)) ? ow_symbol_1 : ow_symbol_0;
    }

    if (rmt_write_items(ow->rmt_channel, tx_items, 8, true) != ESP_OK) {
        ESP_LOGE(TAG, "Send byte failed");
    }
}

/**
 * @brief Send a single bit on the OneWire bus.
 */
void ow_send_bit(OneWireConfig_t *ow, bool bit) {
    const rmt_item32_t *symbol = bit ? &ow_symbol_1 : &ow_symbol_0;

    if (rmt_write_items(ow->rmt_channel, symbol, 1, true) != ESP_OK) {
        ESP_LOGE(TAG, "Send bit failed");
    }
}


// --- ow_read.c ---

/**
 * @brief Parse received RMT symbols (which are echoes of read slots) into a byte.
 */
static uint8_t _parse_bits(rmt_item32_t *items, size_t num_items) {
    uint8_t byte = 0;
    size_t bits_to_process = (num_items < 8) ? num_items : 8;

    for (int i = 0; i < bits_to_process; i++) {
        // A short low pulse indicates the slave left the line high (a '1' bit).
        // A long low pulse indicates the slave pulled the line low (a '0' bit).
        // The threshold is between the duration of a '1' (A=6us) and a '0' (C=60us).
        if (RMT_DURATION0(items[i]) < (OW_TIMING_PARAM_A + OW_TIMING_PARAM_C) / 2) {
            byte |= (1 << i);
        }
    }
    return byte;
}

/**
 * @brief Read a byte from the OneWire bus.
 */
uint8_t ow_read(OneWireConfig_t *ow) {
    size_t rx_size = 0;
    rmt_item32_t *rx_items = NULL;
    uint8_t byte = 0;
    
    // Create 8 "read slots" by sending 8 '1' bits
    rmt_item32_t read_slots[8];
    for(int i=0; i<8; i++) read_slots[i] = ow_symbol_1;

    // Set idle threshold for reading bits
    rmt_set_rx_idle_thresh(ow->rmt_channel, OW_TIMING_PARAM_B + 10);
    rmt_rx_start(ow->rmt_channel, true);

    // Send read slots
    rmt_write_items(ow->rmt_channel, read_slots, 8, true);

    // Wait for received data
    rx_items = (rmt_item32_t *)xRingbufferReceive(ow->rx_ringbuf, &rx_size, pdMS_TO_TICKS(OW_RMT_TIMEOUT_MS));
    if (rx_items) {
        size_t num_items = rx_size / sizeof(rmt_item32_t);
        // We expect to receive echoes of our 8 read slots, modified by the slave.
        byte = _parse_bits(rx_items, num_items);
        vRingbufferReturnItem(ow->rx_ringbuf, (void *)rx_items);
    } else {
        ESP_LOGD(TAG, "Read byte: RX timeout");
    }

    rmt_rx_stop(ow->rmt_channel);
    return byte;
}

/**
 * @brief Read a single bit from the OneWire bus.
 */
bool ow_read_bit(OneWireConfig_t *ow) {
    size_t rx_size = 0;
    rmt_item32_t *rx_items = NULL;
    bool bit = false;

    rmt_set_rx_idle_thresh(ow->rmt_channel, OW_TIMING_PARAM_B + 10);
    rmt_rx_start(ow->rmt_channel, true);

    rmt_write_items(ow->rmt_channel, &ow_symbol_1, 1, true);

    rx_items = (rmt_item32_t *)xRingbufferReceive(ow->rx_ringbuf, &rx_size, pdMS_TO_TICKS(OW_RMT_TIMEOUT_MS));
    if (rx_items) {
        size_t num_items = rx_size / sizeof(rmt_item32_t);
        // We expect at least one item (the echo of our read slot).
        if (num_items >= 1) {
             // A short low pulse means a '1' was read.
             if(RMT_DURATION0(rx_items[0]) < (OW_TIMING_PARAM_A + OW_TIMING_PARAM_C) / 2) {
                 bit = true;
             }
        }
        vRingbufferReturnItem(ow->rx_ringbuf, (void *)rx_items);
    } else {
        ESP_LOGD(TAG, "Read bit: RX timeout");
    }

    rmt_rx_stop(ow->rmt_channel);
    return bit;
}


// --- ow_romsearch.c ---

/**
 * @brief Search for OneWire devices. (Standard algorithm from Maxim/Dallas)
 */
int ow_romsearch(OneWireConfig_t *ow, uint64_t *romcodes, int maxdevs, unsigned int command) {
    int index;
    uint64_t romcode = 0ull;
    int last_discrepancy = -1;
    int last_zero = -1;
    int num_found = 0;
    bool finished = false;

    while (!finished && (maxdevs == 0 || num_found < maxdevs)) {
        if (!ow_reset(ow)) {
            return 0; // No devices present
        }

        ow_send(ow, command);
        last_zero = -1;

        for (index = 0; index < 64; index++) {
            bool bit_a = ow_read_bit(ow);
            bool bit_b = ow_read_bit(ow);

            if (bit_a && bit_b) { // Error, no devices responded
                return -1;
            } else if (!bit_a && !bit_b) { // Discrepancy, both 0 and 1 bits present
                if (index == last_discrepancy) {
                    // We are at the last discrepancy point, take the '1' path this time.
                    ow_send_bit(ow, 1);
                    romcode |= (1ULL << index);
                } else if (index > last_discrepancy) {
                    // New discrepancy, take the '0' path first.
                    ow_send_bit(ow, 0);
                    romcode &= ~(1ULL << index);
                    last_zero = index;
                } else { // We are past a discrepancy point that we've already explored the '0' path for.
                         // Follow the path determined by the current romcode bits.
                    if ((romcode >> index) & 1) {
                        ow_send_bit(ow, 1);
                    } else {
                        ow_send_bit(ow, 0);
                        // If we chose '0' here, it could be a new discrepancy point for the next run.
                        last_zero = index;
                    }
                }
            } else { // No discrepancy, all devices have the same bit.
                if (!bit_a) { // Bit is 0
                    ow_send_bit(ow, 0);
                    romcode &= ~(1ULL << index);
                } else { // Bit is 1
                    ow_send_bit(ow, 1);
                    romcode |= (1ULL << index);
                }
            }
        }

        if (romcodes != NULL) {
            romcodes[num_found] = romcode;
        }
        num_found++;

        if (last_zero == -1) {
            finished = true;
        }
        last_discrepancy = last_zero;
    }

    return num_found;
}
