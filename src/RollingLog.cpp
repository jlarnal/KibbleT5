#include "RollingLog.hpp"

RollingLog::RollingLog(FS& fs, const char* path, size_t maxLogSize)
    : _fs(fs), _path(path), _maxSize(maxLogSize), _buffer(nullptr), _initialized(false), _startPos(0), _endPos(0), _readCursor(0)
{
    if (_maxSize < (MARKER_LEN * 2 + 1)) {
        _maxSize = 0;
    }
}

RollingLog::~RollingLog()
{
    if (_file) {
        _file.close();
    }
    if (_buffer) {
        free(_buffer);
    }
}

bool RollingLog::begin(bool formatIfCorrupt)
{
    if (_initialized)
        return true;
    if (_maxSize == 0)
        return false;

#if CONFIG_SPIRAM_SUPPORT
    if (psramFound()) {
        _buffer = (char*)heap_caps_malloc(BUFFER_SIZE, MALLOC_CAP_SPIRAM);
    }
#endif
    if (_buffer == nullptr) {
        _buffer = (char*)heap_caps_malloc(BUFFER_SIZE, MALLOC_CAP_DEFAULT);
    }
    if (_buffer == nullptr) {
        return false;
    }

    if (_fs.exists(_path)) {
        _file = _fs.open(_path, "r+");
    } else {
        _file = _fs.open(_path, "w+");
    }

    if (!_file) {
        free(_buffer);
        _buffer = nullptr;
        return false;
    }

    if (_file.size() < (MARKER_LEN * 2) || !findMarkers()) {
        if (formatIfCorrupt) {
            if (!initializeLogFile()) {
                _file.close();
                free(_buffer);
                _buffer = nullptr;
                return false;
            }
        } else {
            _file.close();
            free(_buffer);
            _buffer = nullptr;
            return false;
        }
    }

    rewind();
    _initialized = true;
    return true;
}

bool RollingLog::findMarkers()
{
    size_t fileSize = _file.size();
    uint8_t marker_buf[MARKER_LEN];
    bool stx_found = false;
    bool etx_found = false;

    // Scan for the STX marker (8 consecutive 0x02 bytes)
    for (size_t i = 0; i <= fileSize - MARKER_LEN; ++i) {
        _file.seek(i);
        if (_file.read(marker_buf, MARKER_LEN) == MARKER_LEN) {
            bool match = true;
            for (size_t j = 0; j < MARKER_LEN; ++j) {
                if (marker_buf[j] != MARKER_STX) {
                    match = false;
                    break;
                }
            }
            if (match) {
                _startPos = i;
                stx_found = true;
                break;
            }
        }
    }

    if (!stx_found)
        return false;

    // Scan for the ETX marker (8 consecutive 0x03 bytes)
    for (size_t i = 0; i <= fileSize - MARKER_LEN; ++i) {
        _file.seek(i);
        if (_file.read(marker_buf, MARKER_LEN) == MARKER_LEN) {
            bool match = true;
            for (size_t j = 0; j < MARKER_LEN; ++j) {
                if (marker_buf[j] != MARKER_ETX) {
                    match = false;
                    break;
                }
            }
            if (match) {
                _endPos   = i;
                etx_found = true;
                break;
            }
        }
    }

    return etx_found;
}

bool RollingLog::initializeLogFile()
{
    _startPos = 0;
    _endPos   = MARKER_LEN;
    writeMarker(_startPos, MARKER_STX);
    writeMarker(_endPos, MARKER_ETX);
    flush();
    return _file;
}

void RollingLog::writeMarker(size_t pos, uint8_t marker)
{
    if (!_file)
        return;
    _file.seek(pos);
    for (size_t i = 0; i < MARKER_LEN; ++i) {
        _file.write(marker);
    }
}

size_t RollingLog::write(const uint8_t* buffer, size_t size)
{
    if (!_initialized || buffer == nullptr || size == 0) {
        return 0;
    }
    const size_t maxDataSize = _maxSize - (2 * MARKER_LEN);
    if (size > maxDataSize) {
        buffer += (size - maxDataSize);
        size = maxDataSize;
    }
    size_t currentSize = dataSize();
    size_t scrapSize   = 0;
    if (currentSize + size > maxDataSize) {
        scrapSize = (currentSize + size) - maxDataSize;
    }
    size_t writeCursor = _endPos;
    size_t remaining   = size;
    const uint8_t* p   = buffer;
    size_t spaceToEnd  = _maxSize - writeCursor;
    if (remaining > spaceToEnd) {
        _file.seek(writeCursor);
        _file.write(p, spaceToEnd);
        p += spaceToEnd;
        remaining -= spaceToEnd;
        writeCursor = 0;
    }
    _file.seek(writeCursor);
    _file.write(p, remaining);
    size_t newEndPos = writeCursor + remaining;
    writeMarker(newEndPos, MARKER_ETX);
    _endPos = newEndPos;
    if (scrapSize > 0) {
        size_t startOfData    = (_startPos + MARKER_LEN) % _maxSize;
        size_t newStartOfData = (startOfData + scrapSize) % _maxSize;
        size_t newStartPos    = (newStartOfData - MARKER_LEN + _maxSize) % _maxSize;
        writeMarker(newStartPos, MARKER_STX);
        _startPos = newStartPos;
        rewind();
    }
    flush();
    return size;
}

size_t RollingLog::dataSize() const
{
    size_t startOfData = (_startPos + MARKER_LEN) % _maxSize;
    if (_endPos >= startOfData) {
        return _endPos - startOfData;
    } else {
        return (_maxSize - startOfData) + _endPos;
    }
}
size_t RollingLog::size()
{
    if (!_initialized)
        return 0;
    return dataSize();
}
void RollingLog::rewind()
{
    if (!_initialized)
        return;
    _readCursor = (_startPos + MARKER_LEN) % _maxSize;
}
int RollingLog::available()
{
    if (!_initialized)
        return 0;
    if (_endPos >= _readCursor) {
        return _endPos - _readCursor;
    } else {
        return (_maxSize - _readCursor) + _endPos;
    }
}
int RollingLog::read()
{
    if (available() == 0)
        return -1;
    _file.seek(_readCursor);
    int val = _file.read();
    if (val != -1) {
        _readCursor = (_readCursor + 1) % _maxSize;
    }
    return val;
}
int RollingLog::peek()
{
    if (available() == 0)
        return -1;
    _file.seek(_readCursor);
    return _file.read();
}
void RollingLog::flush()
{
    if (_initialized && _file) {
        _file.flush();
    }
}
size_t RollingLog::write(uint8_t data)
{
    return write(&data, 1);
}
size_t RollingLog::printf(const char* format, ...)
{
    va_list arg;
    va_start(arg, format);
    size_t len = vprintf(format, arg);
    va_end(arg);
    return len;
}
size_t RollingLog::vprintf(const char* format, va_list args)
{
    if (!_initialized)
        return 0;
    va_list argcopy;
    va_copy(argcopy, args);
    int len = vsnprintf(nullptr, 0, format, argcopy);
    va_end(argcopy);
    if (len < 0)
        return 0;
    if ((size_t)len < BUFFER_SIZE) {
        vsnprintf(_buffer, len + 1, format, args);
        return write((const uint8_t*)_buffer, len);
    } else {
        char* temp_buffer = (char*)malloc(len + 1);
        if (temp_buffer) {
            vsnprintf(temp_buffer, len + 1, format, args);
            size_t written = write((const uint8_t*)temp_buffer, len);
            free(temp_buffer);
            return written;
        }
        return 0;
    }
}
String RollingLog::readString()
{
    if (!_initialized)
        return "";
    rewind();
    size_t len = available();
    if (len == 0)
        return "";
    String result;
    result.reserve(len);
    char read_buf[64];
    while (available() > 0) {
        size_t toRead    = (available() > (int)sizeof(read_buf)) ? sizeof(read_buf) : available();
        size_t bytesRead = readBytes(read_buf, toRead);
        if (bytesRead > 0) {
            result.concat(read_buf, bytesRead);
        } else {
            break;
        }
    }
    return result;
}