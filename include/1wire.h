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

#ifndef ONEWIRE_H
#define ONEWIRE_H

#include <stdint.h>
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "driver/rmt.h"
#include "driver/gpio.h"
#include "esp_err.h"

// --- From onewire_timings.h ---
// Onewire bus master timings (standard rate)
// See: https://www.analog.com/en/technical-articles/1wire-communication-through-software.html
#define OW_TIMING_PARAM_A  6   // all values in usec
#define OW_TIMING_PARAM_B  64
#define OW_TIMING_PARAM_C  60
#define OW_TIMING_PARAM_D  10
#define OW_TIMING_PARAM_E  9
#define OW_TIMING_PARAM_F  55
#define OW_TIMING_PARAM_G  0
#define OW_TIMING_PARAM_H  480
#define OW_TIMING_PARAM_I  70
#define OW_TIMING_PARAM_J  410

// --- From onewire_symbols.h ---
// RMT item structure is {duration, level, duration, level}
// The RMT peripheral will assert the signal for the given duration.
// The ESP32 RMT hardware inverts the output signal, so level 1 means pulling the bus low.
#define OW_BUS_ASSERTED 1
#define OW_BUS_RELEASED 0


// --- From onewire.h ---
#define OW_RMT_CHANNEL RMT_CHANNEL_0
#define OW_RMT_CLK_DIV 80 // RMT counter clock is 1MHz (80MHz APB CLK / 80)
#define OW_RMT_TIMEOUT_MS 1000
#define OW_RX_MARGIN_US 3

// Read buffer size (in 32-bit words)
#define OW_RX_BUFFER_SIZE 64

/**
 * @brief Structure to hold OneWire driver context.
 */
typedef struct {
    gpio_num_t gpio_num;
    rmt_channel_t rmt_channel;
    RingbufHandle_t rx_ringbuf;
} OneWireConfig_t;

/**
 * @brief Initialize the OneWire driver.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @param gpio_num GPIO pin to use for the OneWire bus.
 * @return true on success, false on failure.
 */
bool ow_init(OneWireConfig_t *owCfg, gpio_num_t gpio_num);

/**
 * @brief De-initialize the OneWire driver.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 */
void ow_deinit(OneWireConfig_t *owCfg);

/**
 * @brief Send a byte on the OneWire bus.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @param data The byte to send.
 */
void ow_send(OneWireConfig_t *owCfg, uint8_t data);

/**
 * @brief Send a single bit on the OneWire bus.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @param bit The bit to send (0 or 1).
 */
void ow_send_bit(OneWireConfig_t *owCfg, bool bit);

/**
 * @brief Read a byte from the OneWire bus.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @return The byte read from the bus.
 */
uint8_t ow_read(OneWireConfig_t *owCfg);

/**
 * @brief Read a single bit from the OneWire bus.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @return The bit read from the bus (true for 1, false for 0).
 */
bool ow_read_bit(OneWireConfig_t *owCfg);

/**
 * @brief Send a reset pulse on the OneWire bus and check for presence.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @return true if a device is present, false otherwise.
 */
bool ow_reset(OneWireConfig_t *owCfg);

/**
 * @brief Search for OneWire devices on the bus.
 *
 * @param owCfg Pointer to the OneWire driver structure.
 * @param romcodes Pointer to an array to store the found ROM codes.
 * @param maxdevs The maximum number of devices to search for.
 * @param command The ROM search command (e.g., 0xF0 for normal search).
 * @return The number of devices found.
 */
int ow_romsearch(OneWireConfig_t *owCfg, uint64_t *romcodes, int maxdevs, unsigned int command);

#endif // ONEWIRE_H
