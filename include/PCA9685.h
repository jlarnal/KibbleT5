
#include <Arduino.h>
#include <Wire.h>


// MODE1 bits
#define MODE1_ALLCAL         0x01 /**< respond to LED All Call I2C-bus address */
#define MODE1_SUB3           0x02 /**< respond to I2C-bus subaddress 3 */
#define MODE1_SUB2           0x04 /**< respond to I2C-bus subaddress 2 */
#define MODE1_SUB1           0x08 /**< respond to I2C-bus subaddress 1 */
#define MODE1_SLEEP          0x10 /**< Low power mode. Oscillator off */
#define MODE1_AI             0x20 /**< Auto-Increment enabled */
#define MODE1_EXTCLK         0x40 /**< Use EXTCLK pin clock */
#define MODE1_RESTART        0x80 /**< Restart enabled */
// MODE2 bits
#define MODE2_OUTNE_0        0x01 /**< Active LOW output enable input */
#define MODE2_OUTNE_1        0x02 /**< Active LOW output enable input - high impedience */
#define MODE2_OUTDRV         0x04 /**< totem pole structure vs open-drain */
#define MODE2_OCH            0x08 /**< Outputs change on ACK vs STOP */
#define MODE2_INVRT          0x10 /**< Output logic state inverted */

#define PCA9685_I2C_ADDRESS  0x40 /**< Default PCA9685 I2C Slave Address */
#define FREQUENCY_OSCILLATOR 25000000 /**< Int. osc. frequency in datasheet */

#define PCA9685_PRESCALE_MIN 3 /**< minimum prescale value */
#define PCA9685_PRESCALE_MAX 255 /**< maximum prescale value */

/*!
 *  @brief  Class that stores state and functions for interacting with PCA9685
 * PWM chip
 */
class PCA9685 {
  public:
    // REGISTER ADDRESSES
    enum I2C_Result_e : uint8_t
    {
        I2C_Ok            = 0,
        I2C_Success       = 0,
        I2C_DataTooLong   = 1,
        I2C_NackOnAddress = 2,
        I2C_NackOnData    = 3,
        I2C_Unknown       = 4,
        I2C_Timeout       = 5,
    };

    enum PCA9685_REGS_t : uint8_t
    {
        PCA9685_MODE1      = 0x00, /**< Mode Register 1 */
        PCA9685_MODE2      = 0x01, /**< Mode Register 2 */
        PCA9685_SUBADR1    = 0x02, /**< I2C-bus subaddress 1 */
        PCA9685_SUBADR2    = 0x03, /**< I2C-bus subaddress 2 */
        PCA9685_SUBADR3    = 0x04, /**< I2C-bus subaddress 3 */
        PCA9685_ALLCALLADR = 0x05, /**< LED All Call I2C-bus address */
        PCA9685_LED0_ON_L  = 0x06, /**< LED0 on tick, low byte*/
        PCA9685_LED0_ON_H  = 0x07, /**< LED0 on tick, high byte*/
        PCA9685_LED0_OFF_L = 0x08, /**< LED0 off tick, low byte */
        PCA9685_LED0_OFF_H = 0x09, /**< LED0 off tick, high byte */
        // etc all 16:  LED15_OFF_H 0x45
        PCA9685_ALLLED_ON_L  = 0xFA, /**< load all the LEDn_ON registers, low */
        PCA9685_ALLLED_ON_H  = 0xFB, /**< load all the LEDn_ON registers, high */
        PCA9685_ALLLED_OFF_L = 0xFC, /**< load all the LEDn_OFF registers, low */
        PCA9685_ALLLED_OFF_H = 0xFD, /**< load all the LEDn_OFF registers,high */
        PCA9685_PRESCALE     = 0xFE, /**< Prescaler for PWM output frequency */
        PCA9685_TESTMODE     = 0xFF, /**< defines the test mode to be entered */
    };

    PCA9685();
    PCA9685(const uint8_t addr);
    PCA9685(const uint8_t addr, TwoWire& i2c);
    void begin(uint8_t prescale = 0);
    void reset();
    void sleep();
    void wakeup();
    void setExtClk(uint8_t prescale);
    void setPWMFreq(float freq);
    void setOutputMode(bool totempole);
    uint8_t getPWM(uint8_t num);
    I2C_Result_e setPWM(int8_t num, uint16_t on, uint16_t off);
    /*!
 *  @brief  Sets the PWM output of one or all of the PCA9685 pins
 *  @param  num One of the PWM[0:15] output pins, or -1 to set all channels in one go.
 *  @param  fullOn Sets the output(s) to 100% duty <true>, or 0% duty <false>.
 *  @return result from endTransmission
 */
    I2C_Result_e setFull(int8_t num = -1, bool fullOn = true) { return setPWM(num, fullOn ? 4096 : 0, fullOn ? 0 : 4096); }
    uint8_t readPrescale(void);
    I2C_Result_e writeMicroseconds(uint8_t num, uint16_t Microseconds);

    void setOscillatorFrequency(uint32_t freq);
    uint32_t getOscillatorFrequency(void);



  protected:
    uint8_t _i2caddr;
    TwoWire* _i2c;

    uint32_t _oscillator_freq;
    uint8_t read8(uint8_t addr);
    void write8(uint8_t addr, uint8_t d);
};