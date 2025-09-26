#ifndef TEST_H
#define TEST_H

#include "TankManager.hpp"
#include "HX711Scale.hpp"

/**
 * @file test.h
 * @brief Declares the main function for the runtime debug and test CLI.
 */

/**
 * @brief The main entry point for the interactive hardware test suite.
 * * This function will block execution and provide a command-line interface
 * over the Serial port to test various hardware components of the KibbleT5.
 * @param tankManager A reference to the global TankManager instance.
 * @param scale A reference to the global HX711Scale instance.
 */
void doDebugTest(TankManager& tankManager, HX711Scale& scale);

#endif // TEST_H
