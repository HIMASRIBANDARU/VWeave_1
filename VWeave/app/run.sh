#!/bin/sh

echo VG_API_HOST=$VG_API_HOST > .env.local
echo VG_DASHBOARD_HOST=$VG_DASHBOARD_HOST >> .env.local

echo DB_HOST=$DB_HOST >> .env.local
echo DB_PORT=$DB_PORT >> .env.local
echo DB_USER=$DB_USER >> .env.local
echo DB_PASSWORD=$DB_PASSWORD >> .env.local
echo DB_NAME=$DB_NAME >> .env.local

echo akamai_clientToken=$AKAMAI_CLIENT_TOKEN >> .env.local
echo akamai_clientSecret=$AKAMAI_CLIENT_SECRET >> .env.local
echo akamai_accessToken=$AKAMAI_ACCESS_TOKEN >> .env.local
echo akamai_baseUri=$AKAMAI_BASE_URI >> .env.local
echo akamai_contractId=$AKAMAI_CONTRACT_ID >> .env.local
echo akamai_productId=$AKAMAI_PRODUCT_ID >> .env.local

echo THUMBNAIL_S3_BUCKET=$THUMBNAIL_S3_BUCKET >> .env.local
echo THUMBNAIL_S3_REGION=$THUMBNAIL_S3_REGION >> .env.local
echo THUMBNAIL_S3_ACCESS_KEY=$THUMBNAIL_S3_ACCESS_KEY >> .env.local
echo THUMBNAIL_S3_SECRET_KEY=$THUMBNAIL_S3_SECRET_KEY >> .env.local

echo AWS_ACCESS_KEY=$THUMBNAIL_S3_ACCESS_KEY >> .env.local
echo AWS_SECRET_KEY=$THUMBNAIL_S3_SECRET_KEY >> .env.local

echo GOOGLE_APPLICATION_CREDENTIALS='/opt/app/google-clouddnsaccess.json' >> .env.local
echo scheduleLivestreamThumbnailGeneration=$SCHEDULE_LIVE_STREAM_THUMBNAIL_GENERATION >> .env.local
echo scheduleCDNCustomDomainSetup=$SCHEDULE_CDN_CUSTOM_DOMAIN_SETUP >> .env.local

export NODE_ENV=production
npm run build
npm run start
