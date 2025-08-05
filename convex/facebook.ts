import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Intercambiar código por token de Facebook
export const exchangeFacebookToken = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { code } = args;

    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error(
        "Configuración de Facebook incompleta. Verifica las variables de entorno: FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URI"
      );
    }

    const tokenUrl = "https://graph.facebook.com/v23.0/oauth/access_token";
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

// Obtener información del usuario de Facebook
export const getFacebookUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accessToken } = args;

    try {
      // Obtener información básica del usuario
      const url =
        `https://graph.facebook.com/v23.0/me` +
        `?fields=id,first_name,last_name,name,picture` +
        `&access_token=${encodeURIComponent(accessToken)}`;

      const userResponse = await fetch(url, {
        method: "GET",
      });

      if (!userResponse.ok) {
        throw new Error("Error obteniendo información del usuario");
      }

      const userData = await userResponse.json();
      console.log('Facebook user data', userData)

      // Obtener información de la página si el usuario tiene una
      try {
        const pagesResponse = await fetch(
          `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
        );
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          console.log('Facebook pagesData', pagesData)
          if (pagesData.data && pagesData.data.length > 0) {
            // Usar la primera página como información principal
            const page = pagesData.data[0];
            const pageInfoResponse = await fetch(
              `https://graph.facebook.com/v23.0/${page.id}?fields=id,name,username,fan_count,followers_count,verification_status,published_posts&access_token=${page.access_token}`
            );  

            if (pageInfoResponse.ok) {
              const pageInfo = await pageInfoResponse.json();
              return {
                user: userData,
                page: pageInfo,
                hasPage: true,
              };
            }
          }
        }
      } catch (pageError) {
        console.log("No se pudo obtener información de página:", pageError);
      }

      return {
        user: userData,
        hasPage: false,
      };
    } catch (error) {
      console.error("Error obteniendo información del usuario:", error);
      throw new Error("Error obteniendo información del usuario");
    }
  },
});

// Guardar cuenta de Facebook
export const saveFacebookAccount = mutation({
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

    // Verificar si ya existe una cuenta de Facebook para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) =>
        q.eq("userId", userId).eq("platform", "facebook")
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
        platform: "facebook",
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
