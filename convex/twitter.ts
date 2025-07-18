import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Intercambiar código por token de Twitter
export const exchangeTwitterToken = action({
  args: {
    code: v.string(),
    codeVerifier: v.string(),
  },
  handler: async (ctx, args) => {
    const { code, codeVerifier } = args;
    
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const redirectUri = process.env.TWITTER_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Configuración de Twitter incompleta. Verifica las variables de entorno: TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_REDIRECT_URI");
    }

    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    });


    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
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

// Obtener información del usuario de Twitter
export const getTwitterUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accessToken } = args;

    try {
      // Obtener información básica del usuario
      const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics,profile_image_url,verified,created_at', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Error obteniendo información del usuario');
      }

      const userData = await userResponse.json();

      return userData;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      throw new Error('Error obteniendo información del usuario');
    }
  },
});

// Guardar cuenta de Twitter conectada
export const saveTwitterAccount = mutation({
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

    // Verificar si ya existe una cuenta de Twitter para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", "twitter")
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
        platform: "twitter",
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

// Obtener cuentas conectadas del usuario
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

// Desconectar cuenta
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