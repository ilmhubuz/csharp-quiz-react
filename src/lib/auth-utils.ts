import type Keycloak from 'keycloak-js';

export const USTOZ_MEMBERSHIP_ATTRIBUTE = 'ustoz-membership';
export const CSHARP_QUIZ_VALUE = 'csharp-quiz';

export function hasCSharpQuizAccess(keycloak: Keycloak): boolean {
  if (!keycloak.authenticated) {
    return false;
  }

  const userAttributes = keycloak.tokenParsed?.[USTOZ_MEMBERSHIP_ATTRIBUTE];
  if (!userAttributes) {
    return false;
  }

  // Handle both string and array attributes
  if (Array.isArray(userAttributes)) {
    return userAttributes.includes(CSHARP_QUIZ_VALUE);
  }

  return userAttributes === CSHARP_QUIZ_VALUE;
}

export function getUserMemberships(keycloak: Keycloak): string[] {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return [];
  }

  const userAttributes = keycloak.tokenParsed[USTOZ_MEMBERSHIP_ATTRIBUTE];
  if (!userAttributes) {
    return [];
  }

  // Handle both string and array attributes
  if (Array.isArray(userAttributes)) {
    return userAttributes;
  }

  return [userAttributes];
}

export function getUserDisplayName(keycloak: Keycloak): string {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return 'Guest';
  }

  const firstName = keycloak.tokenParsed.given_name || '';
  const lastName = keycloak.tokenParsed.family_name || '';
  const username = keycloak.tokenParsed.preferred_username || '';

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return username || 'User';
}

export function getUserAvatar(keycloak: Keycloak): string | undefined {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return undefined;
  }

  return keycloak.tokenParsed.picture || keycloak.tokenParsed.avatar;
}

export function getUserEmail(keycloak: Keycloak): string | undefined {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return undefined;
  }

  return keycloak.tokenParsed.email;
}

export function getUserPhones(keycloak: Keycloak): string[] {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return [];
  }

  const phones = keycloak.tokenParsed.phones;
  if (!phones) {
    return [];
  }

  return Array.isArray(phones) ? phones : [phones];
}

export function getUserRoles(keycloak: Keycloak): string[] {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return [];
  }

  const realmAccess = keycloak.tokenParsed.realm_access;
  if (!realmAccess || !realmAccess.roles) {
    return [];
  }

  return realmAccess.roles;
}

export function hasRole(keycloak: Keycloak, role: string): boolean {
  const roles = getUserRoles(keycloak);
  return roles.includes(role);
} 