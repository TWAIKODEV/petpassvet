import { v } from "convex/values";
import { action } from "./_generated/server";

// Intercambiar código por token de Google usando OAuth 2.0
export const exchangeGoogleToken = action({
  args: {
    code: v.string(),
    codeVerifier: v.string(),
  },
  handler: async (ctx, args) => {
    const { code, codeVerifier } = args;
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    console.log('Convex Google - Variables de entorno:', {
      clientId: clientId ? 'Configurado' : 'No configurado',
      clientSecret: clientSecret ? 'Configurado' : 'No configurado',
      redirectUri: redirectUri ? 'Configurado' : 'No configurado'
    });

    console.log('Convex Google - Parámetros recibidos:', {
      code: code.substring(0, 10) + '...',
      codeVerifier: codeVerifier.substring(0, 10) + '...',
      codeLength: code.length,
      codeVerifierLength: codeVerifier.length
    });

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Configuración de Google incompleta. Verifica las variables de entorno: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI");
    }

    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: codeVerifier,
    });

    console.log('Convex Google - Token exchange request:', {
      url: tokenUrl,
      body: body.toString(),
      bodyParams: {
        grant_type: 'authorization_code',
        code: code.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: '***',
        code_verifier: codeVerifier.substring(0, 20) + '...'
      }
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      console.log('Convex Google - Response status:', response.status);
      console.log('Convex Google - Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Log the full response for debugging
      const responseText = await response.text();
      console.log('Convex Google - Full response text:', responseText);
      
      // Try to parse as JSON for better error details
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { raw: responseText };
      }

      if (!response.ok) {
        console.log('Convex Google - Error response body:', responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: 'unknown', error_description: responseText };
        }
        
        throw new Error(`Error en intercambio de token: ${errorData.error} - ${errorData.error_description || ''}`);
      }

      console.log('Convex Google - Success response:', parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error('Error en intercambio de token:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error en intercambio de token: ${errorMessage}`);
    }
  },
});

// Obtener información del usuario de Google
export const getGoogleUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accessToken } = args;

    try {
      // Obtener información del usuario de Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Error obteniendo información del usuario de Google');
      }

      const userInfo = await userInfoResponse.json();
      console.log('Google user info:', userInfo);

      return userInfo;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      throw new Error('Error obteniendo información del usuario de Google');
    }
  },
}); 