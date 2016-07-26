import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.upsert({
  service: 'dropbox',
}, {
  $set: {
    clientId: 'k40gdcd1fyo5m8f',
    secret: 'x9tbry0s3lg2kgy',
  },
});
