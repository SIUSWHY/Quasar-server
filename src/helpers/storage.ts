import dotenv from 'dotenv';
dotenv.config();
const EasyYandexS3 = require('easy-yandex-s3');

export const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YANDEX_STORAGE_ACESS_KEY,
    secretAccessKey: process.env.YANDEX_STORAGE_SECRET_ACESS_KEY,
  },
  Bucket: 'quasar-storage',
  debug: false,
});
