import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from 'src/environments/environment';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: environment.CLOUD_NAME,
    apiKey: environment.API_KEY_CLOUD,
    apiSecret: environment.API_SECRET_CLOUD,
  },
});
export const cloudinaryConfiguration = new Cloudinary();
