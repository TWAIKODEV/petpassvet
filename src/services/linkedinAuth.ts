interface LinkedInConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface LinkedInAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

class LinkedInAuthService {
  private config: LinkedInConfig;

  constructor(config: LinkedInConfig) {
    this.config = config;
  }

  /**
   * Genera un state aleatorio para seguridad CSRF
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
   * Genera un code challenge desde el code verifier
   */
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(digest));
  }

  /**
   * Codifica un array de bytes a base64 URL-safe
   */
  private base64URLEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Inicia el flujo de autenticación de LinkedIn
   * Redirige al usuario a la página de autorización de LinkedIn
   */
  async initiateAuth(): Promise<void> {
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    
    // Generar un state aleatorio para seguridad
    const state = this.generateRandomState();
    
    // Generar code verifier y challenge para PKCE
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    console.log('LinkedIn Auth - Iniciando flujo:', {
      state: state.substring(0, 10) + '...',
      codeVerifier: codeVerifier.substring(0, 10) + '...',
      clientId: this.config.clientId ? 'Configurado' : 'No configurado',
      redirectUri: this.config.redirectUri
    });
    
    // Guardar el state y code verifier en localStorage para verificación posterior
    localStorage.setItem('linkedin_auth_state', state);
    localStorage.setItem('linkedin_code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'openid profile email',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    console.log('LinkedIn Auth - Redirigiendo a:', `${authUrl}?${params.toString()}`);
    
    // Redirigir al usuario a LinkedIn
    window.location.href = `${authUrl}?${params.toString()}`;
  }

  /**
   * Maneja la respuesta de autorización de LinkedIn
   * Se llama cuando el usuario regresa de LinkedIn
   */
  async handleCallback(): Promise<LinkedInAuthResponse | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Verificar si hay un error
    if (error) {
      console.error('Error en autenticación de LinkedIn:', error);
      return null;
    }

    // Verificar que tenemos el código y state
    if (!code || !state) {
      console.error('Faltan parámetros de autorización');
      return null;
    }

    // Verificar el state para prevenir CSRF
    const savedState = localStorage.getItem('linkedin_auth_state');
    if (state !== savedState) {
      console.error('State no coincide');
      return null;
    }

    // Limpiar el state del localStorage
    localStorage.removeItem('linkedin_auth_state');

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
  private async exchangeCodeForToken(_code: string): Promise<LinkedInAuthResponse | null> {
    // Obtener el code verifier guardado
    const codeVerifier = localStorage.getItem('linkedin_code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier no encontrado');
    }
    
    // Limpiar el code verifier del localStorage
    localStorage.removeItem('linkedin_code_verifier');

    // Retornar null para que el componente maneje la lógica con Convex
    // El componente deberá llamar a la función de Convex directamente
    return null;
  }

  /**
   * Verifica si la configuración está completa
   */
  isConfigured(): boolean {
    return !!(this.config.clientId && this.config.clientSecret && this.config.redirectUri);
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): LinkedInConfig {
    return { ...this.config };
  }
}

// Crear instancia del servicio con configuración del entorno
const linkedinAuthService = new LinkedInAuthService({
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI || ''
});

export default linkedinAuthService; 