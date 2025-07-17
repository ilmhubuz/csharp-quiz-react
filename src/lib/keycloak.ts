import Keycloak from 'keycloak-js';
import { authConfig } from '../config/auth.config';

export function getKeycloakInstance() {
  return new Keycloak({
      url: authConfig.url,
      realm: authConfig.realm,
      clientId: authConfig.clientId,
  });
}