import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Obtener información del canal de YouTube usando YouTube Data API v3
export const getYouTubeChannelInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accessToken } = args;

    try {
      // Primero obtener información del usuario de Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Error obteniendo información del usuario de Google');
      }

      const userInfo = await userInfoResponse.json();
      console.log('YouTube user info:', userInfo);

      // Luego obtener información del canal de YouTube
      const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!channelResponse.ok) {
        throw new Error('Error obteniendo información del canal de YouTube');
      }

      const channelData = await channelResponse.json();
      console.log('YouTube channel data:', channelData);

      // Verificar si el usuario tiene un canal de YouTube
      const hasChannel = channelData.items && channelData.items.length > 0;
      
      if (!hasChannel) {
        // El usuario no tiene canal de YouTube
        return {
          userInfo: userInfo,
          channelInfo: null,
          statistics: {},
          hasChannel: false,
          error: 'NO_CHANNEL'
        };
      }

      // Combinar información del usuario y del canal
      const channelInfo = channelData.items[0];
      
      return {
        userInfo: userInfo,
        channelInfo: channelInfo,
        statistics: channelInfo.statistics || {},
        hasChannel: true,
        error: null,
        viewCount: channelInfo.statistics?.viewCount || '0'
      };
    } catch (error) {
      console.error('Error obteniendo información del canal:', error);
      throw new Error('Error obteniendo información del canal de YouTube');
    }
  },
});

// Guardar cuenta de YouTube conectada
export const saveYouTubeAccount = mutation({
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
    views: v.optional(v.number()),
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
      views,
      profileImageUrl,
      verified,
      accountCreatedAt
    } = args;

    // Verificar si ya existe una cuenta de YouTube para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", "youtube")
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
        views,
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
        platform: "youtube",
        username,
        name,
        accessToken,
        refreshToken,
        expiresAt,
        followers,
        following,
        posts,
        views,
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