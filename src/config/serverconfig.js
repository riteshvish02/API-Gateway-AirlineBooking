const dotenv = require('dotenv');
dotenv.config()

module.exports = {
    PORT:process.env.PORT,
    SALT:process.env.SALT_ROUNDS,
    JWT_EXPIRE:process.env.JWT_EXPIRE,
    JWT_SECRET:process.env.JWT_SECRET,
    FLIGHT_SERVER:process.env.FLIGHT_SERVER,
    BOOKING_SERVER:process.env.BOOKING_SERVER
}