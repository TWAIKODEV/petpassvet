import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Intercambiar código por token de LinkedIn usando OpenID Connect
export const exchangeLinkedInToken = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { code } = args;
    
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    console.log('Convex LinkedIn - Variables de entorno:', {
      clientId: clientId ? 'Configurado' : 'No configurado',
      clientSecret: clientSecret ? 'Configurado' : 'No configurado',
      redirectUri: redirectUri ? 'Configurado' : 'No configurado'
    });

    // Log adicional para debuggear el formato del client secret
    if (clientSecret) {
      console.log('Convex LinkedIn - Client Secret format check:', {
        length: clientSecret.length,
        containsEquals: clientSecret.includes('='),
        containsDot: clientSecret.includes('.'),
        isBase64: /^[A-Za-z0-9+/]*={0,2}$/.test(clientSecret.replace(/\./g, ''))
      });
    }

    console.log('Convex LinkedIn - Parámetros recibidos:', {
      code: code.substring(0, 10) + '...',
      codeLength: code.length,
    });

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Configuración de LinkedIn incompleta. Verifica las variables de entorno: LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI");
    }

    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    console.log('Convex LinkedIn - Token exchange request:', {
      url: tokenUrl,
      body: body.toString(),
      bodyParams: {
        grant_type: 'authorization_code',
        code: code.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: '***',
      }
    });

    // Log adicional para verificar la URL de redirección exacta
    console.log('Convex LinkedIn - Redirect URI verification:', {
      redirectUri: redirectUri,
      redirectUriLength: redirectUri?.length,
      redirectUriEndsWithSlash: redirectUri?.endsWith('/'),
      redirectUriStartsWithHttp: redirectUri?.startsWith('http')
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      console.log('Convex LinkedIn - Response status:', response.status);
      console.log('Convex LinkedIn - Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Log the full response for debugging
      const responseText = await response.text();
      console.log('Convex LinkedIn - Full response text:', responseText);
      
      // Try to parse as JSON for better error details
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { raw: responseText };
      }

      if (!response.ok) {
        console.log('Convex LinkedIn - Error response body:', responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: 'unknown', error_description: responseText };
        }
        
        throw new Error(`Error en intercambio de token: ${errorData.error} - ${errorData.error_description || ''}`);
      }

      console.log('Convex LinkedIn - Success response:', parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error('Error en intercambio de token:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error en intercambio de token: ${errorMessage}`);
    }
  },
});

// Obtener información del usuario de LinkedIn usando el endpoint userinfo
export const getLinkedInUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accessToken } = args;

    try {
      // Obtener información del usuario usando el endpoint userinfo de OpenID Connect
      const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Error obteniendo información del usuario');
      }

      const userData = await userResponse.json();
      console.log('LinkedIn user data:', userData);

      return userData;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      throw new Error('Error obteniendo información del usuario');
    }
  },
});

// Guardar cuenta de LinkedIn conectada
export const saveLinkedInAccount = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    name: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    followers: v.optional(v.number()),
    following: v.optional(v.number()),
    posts: v.optional(v.number()),
    profileImageUrl: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    accountCreatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { 
      userId, 
      username, 
      name, 
      accessToken, 
      refreshToken, 
      expiresAt,
      followers,
      following,
      posts,
      profileImageUrl,
      verified,
      accountCreatedAt
    } = args;

    // Verificar si ya existe una cuenta de LinkedIn para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", "linkedin")
      )
      .first();

    if (existingAccount) {
      // Actualizar cuenta existente
      return await ctx.db.patch(existingAccount._id, {
        username,
        name,
        accessToken,
        refreshToken,
        expiresAt,
        followers,
        following,
        posts,
        profileImageUrl,
        verified,
        accountCreatedAt,
        connected: true,
        updatedAt: new Date().getTime(),
      });
    } else {
      // Crear nueva cuenta
      return await ctx.db.insert("socialAccounts", {
        userId,
        platform: "linkedin",
        username,
        name,
        accessToken,
        refreshToken,
        expiresAt,
        followers,
        following,
        posts,
        profileImageUrl,
        verified,
        accountCreatedAt,
        connected: true,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      });
    }
  },
});

// Obtener cuentas conectadas del usuario (reutilizar la función de Twitter)
export const getConnectedAccounts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const accounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return accounts;
  },
});

// Desconectar cuenta (reutilizar la función de Twitter)
export const disconnectAccount = mutation({
  args: {
    accountId: v.id("socialAccounts"),
  },
  handler: async (ctx, args) => {
    const { accountId } = args;

    return await ctx.db.patch(accountId, {
      connected: false,
      updatedAt: new Date().getTime(),
    });
  },
});

// Función de prueba para verificar que las actions funcionan
export const testAction = action({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler: async (_ctx, _args) => {
    console.log('Test action ejecutada correctamente');
    return { success: true, message: 'Action funciona correctamente' };
  },
}); 