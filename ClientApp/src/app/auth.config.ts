import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'http://localhost:8080/auth/realms/myrealm',
    redirectUri: window.location.origin,
    clientId: 'clienttest',
    scope: 'openid profile email offline_access',
    requireHttps: false, // TEST Only
    useSilentRefresh: true,
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    sessionChecksEnabled: true,
    showDebugInformation: false
}