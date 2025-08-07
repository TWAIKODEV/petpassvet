export interface MicrosoftAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tenantId: string;
}

export interface MicrosoftAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string;
}

class MicrosoftAuthService {
  private config: MicrosoftAuthConfig;

  constructor(config: MicrosoftAuthConfig) {
    this.config = config;
  }

  /**
   * Inicia el flujo de autenticación de Microsoft
   * Redirige al usuario a la página de autorización de Microsoft
   */
  async initiateAuth(): Promise<void> {
    const authUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/authorize`;
    
    // Generar un state aleatorio para seguridad
    const state = this.generateRandomState();
    
    console.log('Microsoft Auth - Iniciando flujo:', {
      state: state.substring(0, 10) + '...',
      clientId: this.config.clientId ? 'Configurado' : 'No configurado',
      redirectUri: this.config.redirectUri,
      tenantId: this.config.tenantId
    });
    
    // Guardar el state en localStorage para verificación posterior
    localStorage.setItem('microsoft_auth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: 'openid profile email User.Read Mail.Read Mail.Send Calendars.ReadWrite',
      state: state,
      response_mode: 'query'
    });

    console.log('Microsoft Auth - Redirigiendo a:', `${authUrl}?${params.toString()}`);
    
    // Redirigir al usuario a Microsoft
    window.location.href = `${authUrl}?${params.toString()}`;
  }

  /**
   * Maneja la respuesta de autorización de Microsoft
   * Se llama cuando el usuario regresa de Microsoft
   */
  async handleCallback(): Promise<MicrosoftAuthResponse | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Verificar si hay un error
    if (error) {
      console.error('Error en autenticación de Microsoft:', error, errorDescription);
      return null;
    }

    // Verificar que tenemos el código y state
    if (!code || !state) {
      console.error('Faltan parámetros de autorización');
      return null;
    }

    // Verificar el state para prevenir CSRF
    const savedState = localStorage.getItem('microsoft_auth_state');
    if (state !== savedState) {
      console.error('State no coincide');
      return null;
    }

    // Limpiar el state del localStorage
    localStorage.removeItem('microsoft_auth_state');

    try {
      // Intercambiar el código por un token de acceso
      const tokenResponse = await this.exchangeCodeForToken(code);
      return tokenResponse;
    } catch (error) {
      console.error('Error intercambiando código por token:', error);
      return null;
    }
  }

  /**
   * Intercambia el código de autorización por un token de acceso
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async exchangeCodeForToken(_code: string): Promise<MicrosoftAuthResponse | null> {
    // Retornar null para que el componente maneje la lógica con Convex
    // El componente deberá llamar a la función de Convex directamente
    return null;
  }

  /**
   * Obtiene información del usuario de Microsoft
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserInfo(_accessToken: string): Promise<{ id: string; displayName: string; userPrincipalName: string; mail?: string } | null> {
    // Esta función será manejada por Convex
    // Retornar null para que el componente maneje la lógica
    return null;
  }

  /**
   * Genera un state aleatorio para seguridad
   */
  private generateRandomState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Crear instancia del servicio con configuración del entorno
const microsoftAuthService = new MicrosoftAuthService({
  clientId: import.meta.env.VITE_MS_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_MS_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_MS_REDIRECT_URI || '',
  tenantId: import.meta.env.VITE_MS_TENANT_ID || ''
});

export default microsoftAuthService; 