import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Intercambiar código por token de Instagram
export const exchangeInstagramToken = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { code } = args;

    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error(
        "Configuración de Instagram incompleta. Verifica las variables de entorno: INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, INSTAGRAM_REDIRECT_URI"
      );
    }

    const tokenUrl = "https://api.instagram.com/oauth/access_token";
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
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
          errorData = { error: "unknown", error_description: responseText };
        }

        throw new Error(
          `Error en intercambio de token: ${errorData.error} - ${errorData.error_description || ""}`
        );
      }

      return parsedResponse;
    } catch (error) {
      console.error("Error en intercambio de token:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Error en intercambio de token: ${errorMessage}`);
    }
  },
});

// Obtener información del usuario de Instagram
export const getInstagramUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accessToken } = args;

    try {
      // Obtener información básica del usuario
      const url = `https://graph.instagram.com/v23.0/me?fields=id,username,account_type,media_count&access_token=${encodeURIComponent(accessToken)}`;

      const userResponse = await fetch(url, {
        method: "GET",
      });

      if (!userResponse.ok) {
        throw new Error("Error obteniendo información del usuario");
      }

      const userData = await userResponse.json();
      console.log('Instagram user data', userData);

      // Obtener información adicional del usuario
      const userInfoUrl = `https://graph.instagram.com/v23.0/${userData.id}?fields=id,username,account_type,media_count,followers_count,follows_count&access_token=${encodeURIComponent(accessToken)}`;

      const userInfoResponse = await fetch(userInfoUrl, {
        method: "GET",
      });

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        console.log('Instagram user info', userInfo);
        
        return {
          user: userInfo,
          hasAccount: true,
        };
      } else {
        // Si no se puede obtener información adicional, usar los datos básicos
        return {
          user: userData,
          hasAccount: true,
        };
      }
    } catch (error) {
      console.error("Error obteniendo información del usuario:", error);
      throw new Error("Error obteniendo información del usuario");
    }
  },
});

// Guardar cuenta de Instagram
export const saveInstagramAccount = mutation({
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
      accountCreatedAt,
    } = args;

    // Verificar si ya existe una cuenta de Instagram para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) =>
        q.eq("userId", userId).eq("platform", "instagram")
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
        platform: "instagram",
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
    console.log("Test action ejecutada correctamente");
    return { success: true, message: "Action funciona correctamente" };
  },
}); 