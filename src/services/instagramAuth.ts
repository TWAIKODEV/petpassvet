class InstagramAuthService {
  private clientId: string;
  private redirectUri: string;
  private scope: string;

  constructor() {
    this.clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '';
    this.redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || '';
    this.scope = 'instagram_business_basic';
    
    console.log('Instagram Auth Service initialized:');
    console.log('Client ID:', this.clientId ? 'Set' : 'Not set');
    console.log('Redirect URI:', this.redirectUri ? 'Set' : 'Not set');
  }

  generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async initiateAuth(): Promise<void> {
    if (!this.clientId || !this.redirectUri) {
      throw new Error('Configuración de Instagram incompleta');
    }

    const state = this.generateState();
    
    // Guardar el state en localStorage para verificación posterior
    localStorage.setItem('instagram_auth_state', state);

    const authUrl = new URL('https://api.instagram.com/oauth/authorize');
    authUrl.searchParams.append('force_reauth', 'true');
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('scope', this.scope);
    authUrl.searchParams.append('response_type', 'code');
    // authUrl.searchParams.append('state', state);

    console.log('Instagram Auth URL:', authUrl.toString());
    console.log('Client ID:', this.clientId);
    console.log('Redirect URI:', this.redirectUri);

    // Redirigir al usuario a la página de autorización de Instagram
    window.location.href = authUrl.toString();
  }
}

const instagramAuthService = new InstagramAuthService();
export default instagramAuthService; 