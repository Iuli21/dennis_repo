require('dotenv').config();

module.exports = {
    mongoUri: process.env.MONGO_URI,
    PORT: process.env.PORT || 3000,
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
}