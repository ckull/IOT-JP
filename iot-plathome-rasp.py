"""
IOT-plathome
Nagaoka University of Technology
Created by:
Kullapat Siribodhi

MPU6050 sensors data read -
Originated by: 
MrTijn/Tijndagamer Released under the MIT License Copyright (c) 2015, 
2016, 2017 MrTijn/Tijndagamer """

import smbus
import time
import requests
import sys
import math
import Adafruit_DHT

class mpu6050:

    # Global Variables
    GRAVITIY_MS2 = 9.80665
    address = None
    bus = None
    flag = 0

    # Scale Modifiers
    ACCEL_SCALE_MODIFIER_2G = 16384.0
    ACCEL_SCALE_MODIFIER_4G = 8192.0
    ACCEL_SCALE_MODIFIER_8G = 4096.0
    ACCEL_SCALE_MODIFIER_16G = 2048.0

    GYRO_SCALE_MODIFIER_250DEG = 131.0
    GYRO_SCALE_MODIFIER_500DEG = 65.5
    GYRO_SCALE_MODIFIER_1000DEG = 32.8
    GYRO_SCALE_MODIFIER_2000DEG = 16.4

    # Pre-defined ranges
    ACCEL_RANGE_2G = 0x00
    ACCEL_RANGE_4G = 0x08
    ACCEL_RANGE_8G = 0x10
    ACCEL_RANGE_16G = 0x18

    GYRO_RANGE_250DEG = 0x00
    GYRO_RANGE_500DEG = 0x08
    GYRO_RANGE_1000DEG = 0x10
    GYRO_RANGE_2000DEG = 0x18

    # MPU-6050 Registers
    PWR_MGMT_1 = 0x6B
    PWR_MGMT_2 = 0x6C

    ACCEL_XOUT0 = 0x3B
    ACCEL_YOUT0 = 0x3D
    ACCEL_ZOUT0 = 0x3F

    TEMP_OUT0 = 0x41

    GYRO_XOUT0 = 0x43
    GYRO_YOUT0 = 0x45
    GYRO_ZOUT0 = 0x47

    ACCEL_CONFIG = 0x1C
    GYRO_CONFIG = 0x1B

    def __init__(self, address, bus=1):
        self.address = address
        self.bus = smbus.SMBus(bus)
        # Wake up the MPU-6050 since it starts in sleep mode
        self.bus.write_byte_data(self.address, self.PWR_MGMT_1, 0x00)

    # I2C communication methods

    def read_i2c_word(self, register):
        """Read two i2c registers and combine them.

        register -- the first register to read from.
        Returns the combined read results.
        """
        # Read the data from the registers
        high = self.bus.read_byte_data(self.address, register)
        low = self.bus.read_byte_data(self.address, register + 1)

        value = (high << 8) + low

        if (value >= 0x8000):
            return -((65535 - value) + 1)
        else:
            return value

    # MPU-6050 Methods

    def set_accel_range(self, accel_range):
        """Sets the range of the accelerometer to range.

        accel_range -- the range to set the accelerometer to. Using a
        pre-defined range is advised.
        """
        # First change it to 0x00 to make sure we write the correct value later
        self.bus.write_byte_data(self.address, self.ACCEL_CONFIG, 0x00)

        # Write the new range to the ACCEL_CONFIG register
        self.bus.write_byte_data(self.address, self.ACCEL_CONFIG, accel_range)

    def read_accel_range(self, raw = False):
        """Reads the range the accelerometer is set to.

        If raw is True, it will return the raw value from the ACCEL_CONFIG
        register
        If raw is False, it will return an integer: -1, 2, 4, 8 or 16. When it
        returns -1 something went wrong.
        """
        raw_data = self.bus.read_byte_data(self.address, self.ACCEL_CONFIG)

        if raw is True:
            return raw_data
        elif raw is False:
            if raw_data == self.ACCEL_RANGE_2G:
                return 2
            elif raw_data == self.ACCEL_RANGE_4G:
                return 4
            elif raw_data == self.ACCEL_RANGE_8G:
                return 8
            elif raw_data == self.ACCEL_RANGE_16G:
                return 16
            else:
                return -1

    def get_accel_data(self, g = False):
        """Gets and returns the X, Y and Z values from the accelerometer.

        If g is True, it will return the data in g
        If g is False, it will return the data in m/s^2
        Returns a dictionary with the measurement results.
        """
        x = self.read_i2c_word(self.ACCEL_XOUT0)
        y = self.read_i2c_word(self.ACCEL_YOUT0)
        z = self.read_i2c_word(self.ACCEL_ZOUT0)

        accel_scale_modifier = None
        accel_range = self.read_accel_range(True)

        if accel_range == self.ACCEL_RANGE_2G:
            accel_scale_modifier = self.ACCEL_SCALE_MODIFIER_2G
        elif accel_range == self.ACCEL_RANGE_4G:
            accel_scale_modifier = self.ACCEL_SCALE_MODIFIER_4G
        elif accel_range == self.ACCEL_RANGE_8G:
            accel_scale_modifier = self.ACCEL_SCALE_MODIFIER_8G
        elif accel_range == self.ACCEL_RANGE_16G:
            accel_scale_modifier = self.ACCEL_SCALE_MODIFIER_16G
        else:
            print("Unkown range - accel_scale_modifier set to self.ACCEL_SCALE_MODIFIER_2G")
            accel_scale_modifier = self.ACCEL_SCALE_MODIFIER_2G

        x = x / accel_scale_modifier
        y = y / accel_scale_modifier
        z = z / accel_scale_modifier

        if g is True:
            return [x, y, z]
        elif g is False:
            x = x * self.GRAVITIY_MS2
            y = y * self.GRAVITIY_MS2
            z = z * self.GRAVITIY_MS2
            return [x, y, z]

    def set_gyro_range(self, gyro_range):
        """Sets the range of the gyroscope to range.

        gyro_range -- the range to set the gyroscope to. Using a pre-defined
        range is advised.
        """
        # First change it to 0x00 to make sure we write the correct value later
        self.bus.write_byte_data(self.address, self.GYRO_CONFIG, 0x00)

        # Write the new range to the ACCEL_CONFIG register
        self.bus.write_byte_data(self.address, self.GYRO_CONFIG, gyro_range)

    def read_gyro_range(self, raw = False):
        """Reads the range the gyroscope is set to.

        If raw is True, it will return the raw value from the GYRO_CONFIG
        register.
        If raw is False, it will return 250, 500, 1000, 2000 or -1. If the
        returned value is equal to -1 something went wrong.
        """
        raw_data = self.bus.read_byte_data(self.address, self.GYRO_CONFIG)

        if raw is True:
            return raw_data
        elif raw is False:
            if raw_data == self.GYRO_RANGE_250DEG:
                return 250
            elif raw_data == self.GYRO_RANGE_500DEG:
                return 500
            elif raw_data == self.GYRO_RANGE_1000DEG:
                return 1000
            elif raw_data == self.GYRO_RANGE_2000DEG:
                return 2000
            else:
                return -1

    def get_gyro_data(self):
        """Gets and returns the X, Y and Z values from the gyroscope.

        Returns the read values in a dictionary.
        """
        x = self.read_i2c_word(self.GYRO_XOUT0)
        y = self.read_i2c_word(self.GYRO_YOUT0)
        z = self.read_i2c_word(self.GYRO_ZOUT0)

        gyro_scale_modifier = None
        gyro_range = self.read_gyro_range(True)

        if gyro_range == self.GYRO_RANGE_250DEG:
            gyro_scale_modifier = self.GYRO_SCALE_MODIFIER_250DEG
        elif gyro_range == self.GYRO_RANGE_500DEG:
            gyro_scale_modifier = self.GYRO_SCALE_MODIFIER_500DEG
        elif gyro_range == self.GYRO_RANGE_1000DEG:
            gyro_scale_modifier = self.GYRO_SCALE_MODIFIER_1000DEG
        elif gyro_range == self.GYRO_RANGE_2000DEG:
            gyro_scale_modifier = self.GYRO_SCALE_MODIFIER_2000DEG
        else:
            print("Unkown range - gyro_scale_modifier set to self.GYRO_SCALE_MODIFIER_250DEG")
            gyro_scale_modifier = self.GYRO_SCALE_MODIFIER_250DEG

        x = x / gyro_scale_modifier
        y = y / gyro_scale_modifier
        z = z / gyro_scale_modifier

        return [x, y, z]

    def cal_degree(self, x, y, z):
        theta = math.atan(x/math.sqrt(y*y + z*z))
        psi = math.atan(y/math.sqrt(x*x + z*z))
        phi = math.atan(math.atan(math.sqrt(x*x + y*y)/z))
        deg_theta = math.degrees(theta)
        deg_psi = math.degrees(psi)
        deg_phi = math.degrees(phi)

        return [deg_theta, deg_psi, deg_phi]  

    def get_serial(self):
        # Extract serial from cpuinfo file
        cpuserial = "0000000000000000"
        try:
            f = open('/proc/cpuinfo','r')
            for line in f:
                if line[0:6]=='Serial':
                    cpuserial = line[10:26]
            f.close()
        except:
            cpuserial = "ERROR000000000"
        return cpuserial


# AM2302 Method
class am2302:

	def get_temp_humidity(self):
		temp, humidity = Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4)
		return (humidity, temp)

def low_pass(preVal, Val):
    for i in range(0, 2):
        Val[i] = 0.95 * preVal[i] + 0.05 * Val[i]
    return Val

PREVAL_ACC = [0, 0, 0]
PREVAL_GYRO = [0, 0, 0]
PREVAL_EULER = [0, 0, 0]
flag = 0

if __name__ == "__main__":
    while True:
        mpu = mpu6050(0x68)
	am = am2302()
        accel_data = mpu.get_accel_data()
        gyro_data = mpu.get_gyro_data()
        degree = mpu.cal_degree(accel_data[0], accel_data[1], accel_data[2])
	am_data = am.get_temp_humidity()

        lp_acc = low_pass(PREVAL_ACC, accel_data)
        PREVAL_ACC[0], PREVAL_ACC[1], PREVAL_ACC[2] = accel_data[0], accel_data[1], accel_data[2]
        lp_gyro = low_pass(PREVAL_GYRO, gyro_data)
        PREVAL_GYRO[0], PREVAL_GYRO[1], PREVAL_GYRO[2] = gyro_data[0], gyro_data[1], gyro_data[2]
        lp_euler = low_pass(PREVAL_EULER, degree)
        PREVAL_EULER[0], PREVAL_EULER[1], PREVAL_EULER[2] = degree[0], degree[1], degree[2]
        
        print "Serial no: ", mpu.get_serial()
        print "acceleration_x: ", lp_acc[0]
        print "acceleration_y: ",lp_acc[1]
        print "acceleration_z: ",lp_acc[2]
        print "gyro_x: ", lp_gyro[0]
        print "gyro_y: ", lp_gyro[1]
        print "gyro_z: ", lp_gyro[2]
        print "theta: ", lp_euler[0]
        print "psi: ", lp_euler[1]
        print "phi: ", lp_euler[2]
	print "temp: ", am_data[0]
	print "humidity: ", am_data[1]
        print "\n"
        
        #Http request address must be matched with server ip address
        try:
            r = requests.post("http://192.168.11.8:3000/devices/update/" + mpu.get_serial(), json=
                {
                    "uid": mpu.get_serial(),
                    "values": {
                        "temp": am_data[0],
                        "humidity": am_data[1],
                        "acc_x": lp_acc[0],
                        "acc_y": lp_acc[1],
                        "acc_z": lp_acc[2],
                        "gyro_x": lp_gyro[0],
                        "gyro_y": lp_gyro[1],
                        "gyro_z": lp_gyro[2],
                        "theta": lp_euler[0],
                        "psi": lp_euler[1],
                        "phi": lp_euler[2]
                    }
                })
            r.raise_for_status()
        except requests.exceptions.HTTPError as err:
            print err
            sys.exit(1)
        print "POST"
        time.sleep(0.05)
