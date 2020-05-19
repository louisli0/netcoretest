import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

export function initialiser(keycloak:KeycloakService): () => Promise<any> {
    return(): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                keycloak.init({
                    config: {
                        url: environment.keycloak.issuer,
                        realm: environment.keycloak.realm,
                        clientId: environment.keycloak.clientId
                    },
                    loadUserProfileAtStartUp: false,
                    initOptions: {
                        onLoad: 'login-required',
                        checkLoginIframe: true
                    },
                    bearerExcludedUrls: []
                });
                resolve();
            } catch(e) {
                console.error("Keycloak Error", e);
                reject(e);
            }
        })
    }
}

