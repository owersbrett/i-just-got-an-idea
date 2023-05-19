require('dotenv').config()
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        IJGAI_FIREBASE_API_KEY:process.env.IJGAI_FIREBASE_API_KEY,
        IJGAI_FIREBASE_AUTH_DOMAIN:process.env.IJGAI_FIREBASE_AUTH_DOMAIN,
        IJGAI_FIREBASE_PROJECT_ID:process.env.IJGAI_FIREBASE_PROJECT_ID,
        IJGAI_FIREBASE_STORAGE_BUCKET:process.env.IJGAI_FIREBASE_STORAGE_BUCKET,
        IJGAI_FIREBASE_MESSAGING_SENDER_ID:process.env.IJGAI_FIREBASE_MESSAGING_SENDER_ID,
        IJGAI_FIREBASE_APP_ID:process.env.IJGAI_FIREBASE_APP_ID,
        IJGAI_FIREBASE_MEASUREMENT_ID:process.env.IJGAI_FIREBASE_MEASUREMENT_ID
    }
}

module.exports = nextConfig
