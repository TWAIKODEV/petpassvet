import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Intercambiar código por token de TikTok
export const exchangeTikTokToken = action({
  args: {
    code: v.string(),
    codeVerifier: v.string(),
  },
  handler: async (ctx, args) => {
    const { code, codeVerifier } = args;
    
    const clientId = process.env.TIKTOK_CLIENT_ID;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Configuración de TikTok incompleta. Verifica las variables de entorno: TIKTOK_CLIENT_ID, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI");
    }

    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_key: clientId,
      client_secret: clientSecret,
      code_verifier: codeVerifier
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        body: body.toString()
      });

      const responseText = await response.text();
      
      // Try to parse as JSON for better error details
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { raw: responseText };
      }

      if (!response.ok) {
        console.log('Convex TikTok - Error response body:', responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: 'unknown', error_description: responseText };
        }
        
        throw new Error(`Error en intercambio de token: ${errorData.error} - ${errorData.error_description || ''}`);
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error en intercambio de token:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error en intercambio de token: ${errorMessage}`);
    }
  },
});

// Obtener información del usuario de TikTok
export const getTikTokUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verificar que args existe
    if (!args) {
      console.error('Convex TikTok - Args es null o undefined');
      throw new Error('Args no válidos');
    }
    
    // Verificar que accessToken existe
    if (!args.accessToken) {
      console.error('Convex TikTok - accessToken es null o undefined');
      throw new Error('AccessToken no válido');
    }
    
    const { accessToken } = args;

    // Verificar que accessToken es una string válida
    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      console.error('Convex TikTok - accessToken no es una string válida');
      throw new Error('AccessToken debe ser una string no vacía');
    }

    try {
      // Obtener información básica del usuario
      const userInfoUrl = 'https://open.tiktokapis.com/v2/user/info/';
      
      // Parámetros requeridos por la API de TikTok
      const params = new URLSearchParams({
        fields: 'open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count'
      });
      
      const fullUrl = `${userInfoUrl}?${params.toString()}`;
      
      const userHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      };
      
      let userResponse;
      let responseText;
      
      try {
        userResponse = await fetch(fullUrl, {
          method: 'GET',
          headers: userHeaders
        });
        
        // Leer la respuesta completa primero
        responseText = await userResponse.text();
      } catch (fetchError) {
        console.error('Convex TikTok - Fetch error:', fetchError);
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        throw new Error(`Error en la llamada a la API de TikTok: ${errorMessage}`);
      }

      if (!userResponse.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: 'unknown', error_description: responseText };
        }
        
        throw new Error(`Error obteniendo información del usuario: ${errorData.error} - ${errorData.error_description || ''}`);
      }

      // Intentar parsear la respuesta como JSON
      let userData;
      try {
        userData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Convex TikTok - Error parsing JSON response:', parseError);
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        throw new Error(`Error parseando respuesta de TikTok: ${errorMessage}`);
      }

      return userData;
    } catch (error) {
      console.error('Convex TikTok - Error obteniendo información del usuario:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error obteniendo información del usuario: ${errorMessage}`);
    }
  },
});

// Guardar cuenta de TikTok conectada
export const saveTikTokAccount = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    name: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    followers: v.optional(v.number()),
    following: v.optional(v.number()),
    videos: v.optional(v.number()),
    likes: v.optional(v.number()),
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
      videos,
      profileImageUrl,
      verified,
      accountCreatedAt
    } = args;

    // Verificar si ya existe una cuenta de TikTok para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", "tiktok")
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
        posts: videos, // Usar el campo tweets para videos de TikTok
        profileImageUrl,
        verified,
        accountCreatedAt,
        updatedAt: new Date().getTime(),
        connected: true,
      });
    } else {
      // Crear nueva cuenta
      return await ctx.db.insert("socialAccounts", {
        userId,
        platform: "tiktok",
        username,
        name,
        accessToken,
        refreshToken,
        expiresAt,
        followers,
        following,
        posts: videos, // Usar el campo tweets para videos de TikTok
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