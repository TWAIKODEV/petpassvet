export interface TwitterAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TwitterAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  user_id: string;
  screen_name: string;
}

class TwitterAuthService {
  private config: TwitterAuthConfig;

  constructor(config: TwitterAuthConfig) {
    this.config = config;
  }

  /**
   * Inicia el flujo de autenticación de Twitter
   * Redirige al usuario a la página de autorización de Twitter
   */
  async initiateAuth(): Promise<void> {
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    
    // Generar un state aleatorio para seguridad
    const state = this.generateRandomState();
    
    // Generar code verifier y challenge para PKCE
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    console.log('Twitter Auth - Iniciando flujo:', {
      state: state.substring(0, 10) + '...',
      codeVerifier: codeVerifier.substring(0, 10) + '...',
      clientId: this.config.clientId ? 'Configurado' : 'No configurado',
      redirectUri: this.config.redirectUri
    });
    
    // Guardar el state y code verifier en localStorage para verificación posterior
    localStorage.setItem('twitter_auth_state', state);
    localStorage.setItem('twitter_code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    console.log('Twitter Auth - Redirigiendo a:', `${authUrl}?${params.toString()}`);
    
    // Redirigir al usuario a Twitter
    window.location.href = `${authUrl}?${params.toString()}`;
  }

  /**
   * Maneja la respuesta de autorización de Twitter
   * Se llama cuando el usuario regresa de Twitter
   */
  async handleCallback(): Promise<TwitterAuthResponse | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Verificar si hay un error
    if (error) {
      console.error('Error en autenticación de Twitter:', error);
      return null;
    }

    // Verificar que tenemos el código y state
    if (!code || !state) {
      console.error('Faltan parámetros de autorización');
      return null;
    }

    // Verificar el state para prevenir CSRF
    const savedState = localStorage.getItem('twitter_auth_state');
    if (state !== savedState) {
      console.error('State no coincide');
      return null;
    }

    // Limpiar el state del localStorage
    localStorage.removeItem('twitter_auth_state');

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
  private async exchangeCodeForToken(_code: string): Promise<TwitterAuthResponse | null> {
    // Obtener el code verifier guardado
    const codeVerifier = localStorage.getItem('twitter_code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier no encontrado');
    }
    
    // Limpiar el code verifier del localStorage
    localStorage.removeItem('twitter_code_verifier');

    // Retornar null para que el componente maneje la lógica con Convex
    // El componente deberá llamar a la función de Convex directamente
    return null;
  }

  /**
   * Obtiene información del usuario de Twitter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserInfo(_accessToken: string): Promise<{ data: { id: string; username: string; name: string } } | null> {
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

  /**
   * Genera un code verifier para PKCE
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  /**
   * Genera un code challenge para PKCE
   */
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Crear hash SHA256 del code verifier
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(hashBuffer));
  }



  /**
   * Codifica en base64 URL-safe
   */
  private base64URLEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}

// Crear instancia del servicio con configuración del entorno
const twitterAuthService = new TwitterAuthService({
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_TWITTER_REDIRECT_URI || ''
});

export default twitterAuthService; 