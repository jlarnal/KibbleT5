#ifndef H_ROLLING_LOG_H
#define H_ROLLING_LOG_H

#include <Arduino.h>
#include <FS.h>
#include <Stream.h>

/**
 * @class RollingLog
 * @brief A file-based logging class for ESP32 that implements a rolling log mechanism.
 *
 * This class inherits from the Arduino Stream class, allowing it to be used with any
 * library that works with Stream objects (e.g., Print::printf). The log is stored
 * in a single file of a fixed maximum size. When the log is full, new entries
 * overwrite the oldest ones.
 *
 * The state of the log (the start and end points of the data) is maintained by
 * writing two 8-byte markers directly into the file:
 * - STX (0x02) marks the beginning of the oldest log data.
 * - ETX (0x03) marks the end of the newest log data.
 *
 * This marker system ensures that the log's state is preserved even after a
 * power cycle or reset.
 */
class RollingLog : public Stream {
public:
    /**
     * @brief Construct a new Rolling Log object.
     *
     * @param fs Reference to the filesystem object (e.g., LittleFS, SPIFFS).
     * @param path The absolute path to the log file.
     * @param maxLogSize The maximum size of the log file in bytes. This includes the markers.
     */
    RollingLog(FS& fs, const char* path, size_t maxLogSize);

    /**
     * @brief Destroy the Rolling Log object, closing files and freeing memory.
     */
    ~RollingLog();

    /**
     * @brief Initializes the logging system.
     *
     * Must be called before any logging operations. It opens the log file,
     * allocates buffers, and locates the STX/ETX markers to determine the
     * current log state. If markers are not found or the file is invalid,
     * it will format the file.
     *
     * @param formatIfCorrupt If true, the log file will be created or cleared if it's
     * found to be invalid or non-existent.
     * @return true if initialization was successful, false otherwise.
     */
    bool begin(bool formatIfCorrupt = true);

    // --- Stream Interface Implementation ---

    /**
     * @brief Get the number of bytes available for reading from the log.
     * @return The number of bytes available.
     */
    int available() override;

    /**
     * @brief Read a single byte from the log.
     * @return The byte read, or -1 if no data is available.
     */
    int read() override;

    /**
     * @brief Peek at the next byte in the log without consuming it.
     * @return The next byte, or -1 if no data is available.
     */
    int peek() override;

    /**
     * @brief Ensures all written data is committed to the file system.
     */
    void flush() override;

    // --- Print Interface Implementation ---

    /**
     * @brief Write a single byte to the log.
     * @param data The byte to write.
     * @return Number of bytes written (always 1 on success).
     */
    size_t write(uint8_t data) override;

    /**
     * @brief Write a buffer of bytes to the log. This is the core logging method.
     * @param buffer Pointer to the data buffer.
     * @param size Number of bytes to write.
     * @return The number of bytes successfully written.
     */
    size_t write(const uint8_t *buffer, size_t size) override;

    /**
     * @brief Write formatted text to the log, similar to standard printf.
     * @param format The format string.
     * @param ... Variable arguments for the format string.
     * @return The number of bytes written.
     */
    size_t printf(const char* format, ...);

    /**
     * @brief Write formatted text to the log using a va_list.
     * @param format The format string.
     * @param args A va_list of arguments.
     * @return The number of bytes written.
     */
    size_t vprintf(const char* format, va_list args);

    // --- Utility Methods ---

    /**
     * @brief Reads the entire content of the log into a String.
     * @return A String containing the full log content.
     */
    String readString();

    /**
     * @brief Gets the current size of the stored log data in bytes.
     * @return The current log size.
     */
    size_t size();

    /**
     * @brief Resets the internal read cursor to the beginning of the log.
     */
    void rewind();

private:
    static const uint8_t MARKER_STX = 0x02;
    static const uint8_t MARKER_ETX = 0x03;
    static const size_t MARKER_LEN = 8;
    static const size_t BUFFER_SIZE = 2046;

    FS& _fs;
    String _path;
    size_t _maxSize;
    File _file;

    char* _buffer;
    bool _initialized;

    // Positions of the START of each marker block
    size_t _startPos; // Position of the STX marker block
    size_t _endPos;   // Position of the ETX marker block

    // Current read position for the Stream interface
    size_t _readCursor;

    /**
     * @brief Scans the file to locate the STX and ETX markers.
     * @return true if both markers were found, false otherwise.
     */
    bool findMarkers();

    /**
     * @brief Creates a new, empty log file with initial markers.
     * @return true on success, false on failure.
     */
    bool initializeLogFile();

    /**
     * @brief Writes a marker block (STX or ETX) at a specific file position.
     * @param pos The file offset to write to.
     * @param marker The marker byte to repeat (MARKER_STX or MARKER_ETX).
     */
    void writeMarker(size_t pos, uint8_t marker);

    /**
     * @brief Calculates the current size of the valid log data.
     * @return The size of the data in bytes.
     */
    size_t dataSize() const;
};

#endif // H_ROLLING_LOG_H

