export interface FacebookAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface FacebookAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

class FacebookAuthService {
  private config: FacebookAuthConfig;

  constructor(config: FacebookAuthConfig) {
    this.config = config;
  }

  /**
   * Inicia el flujo de autenticación de Facebook
   * Redirige al usuario a la página de autorización de Facebook
   */
  async initiateAuth(): Promise<void> {
    const authUrl = new URL('https://www.facebook.com/v23.0/dialog/oauth');
    
    // Generar un state aleatorio para seguridad
    const state = this.generateRandomState();
    
    console.log('Facebook Auth - Iniciando flujo:', {
      state: state.substring(0, 10) + '...',
      clientId: this.config.clientId ? 'Configurado' : 'No configurado',
      redirectUri: this.config.redirectUri
    });
    
    // Guardar el state en localStorage para verificación posterior
    localStorage.setItem('facebook_auth_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'public_profile,email,pages_read_engagement,pages_show_list,pages_manage_posts',
      state: state,
    });

    console.log('Facebook Auth - Redirigiendo a:', `${authUrl}?${params.toString()}`);
    
    // Redirigir al usuario a Facebook
    window.location.href = `${authUrl}?${params.toString()}`;
  }

  /**
   * Maneja la respuesta de autorización de Facebook
   * Se llama cuando el usuario regresa de Facebook
   */
  async handleCallback(): Promise<FacebookAuthResponse | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Verificar si hay un error
    if (error) {
      console.error('Error en autenticación de Facebook:', error, errorDescription);
      return null;
    }

    // Verificar que tenemos el código y state
    if (!code || !state) {
      console.error('Faltan parámetros de autorización');
      return null;
    }

    // Verificar el state para prevenir CSRF
    const savedState = localStorage.getItem('facebook_auth_state');
    if (state !== savedState) {
      console.error('State no coincide');
      return null;
    }

    // Limpiar el state del localStorage
    localStorage.removeItem('facebook_auth_state');

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
  private async exchangeCodeForToken(_code: string): Promise<FacebookAuthResponse | null> {
    // Retornar null para que el componente maneje la lógica con Convex
    // El componente deberá llamar a la función de Convex directamente
    return null;
  }

  /**
   * Obtiene información del usuario de Facebook
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserInfo(_accessToken: string): Promise<{ data: { id: string; name: string; email?: string } } | null> {
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
const facebookAuthService = new FacebookAuthService({
  clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_FACEBOOK_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI || ''
});

export default facebookAuthService; 