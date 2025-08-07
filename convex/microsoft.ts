import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Intercambiar código por token de Microsoft
export const exchangeMicrosoftToken = action({
  args: {
    code: v.string(),
  },
  handler: async (_ctx, args) => {
    const { code } = args;
    
    const clientId = process.env.MS_CLIENT_ID;
    const clientSecret = process.env.MS_CLIENT_SECRET;
    const redirectUri = process.env.MS_REDIRECT_URI;
    const tenantId = process.env.MS_TENANT_ID;

    if (!clientId || !clientSecret || !redirectUri || !tenantId) {
      throw new Error("Configuración de Microsoft incompleta. Verifica las variables de entorno: MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI, MS_TENANT_ID");
    }

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'openid profile email User.Read Mail.Read Mail.Send Calendars.ReadWrite'
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
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

// Obtener información del usuario de Microsoft
export const getMicrosoftUserInfo = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (_ctx, args) => {
    const { accessToken } = args;

    try {
      // Obtener información básica del usuario
      const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
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

// Guardar cuenta de Microsoft conectada
export const saveMicrosoftAccount = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    name: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    email: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
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
      email,
      profileImageUrl,
      accountCreatedAt
    } = args;

    // Verificar si ya existe una cuenta de Microsoft para este usuario
    const existingAccount = await ctx.db
      .query("socialAccounts")
      .withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", "microsoft")
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
        email,
        profileImageUrl,
        accountCreatedAt,
        connected: true,
        updatedAt: new Date().getTime(),
      });
    } else {
      // Crear nueva cuenta
      return await ctx.db.insert("socialAccounts", {
        userId,
        platform: "microsoft",
        username,
        name,
        accessToken,
        refreshToken,
        expiresAt,
        email,
        profileImageUrl,
        accountCreatedAt,
        connected: true,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      });
    }
  },
});

// Obtener cuentas conectadas del usuario (reutilizar la función de twitter)
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

// Desconectar cuenta (reutilizar la función de twitter)
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

// Obtener correos recibidos de Microsoft
export const getMicrosoftEmails = action({
  args: {
    accessToken: v.string(),
    top: v.optional(v.number()),
    skip: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const { accessToken, top = 50, skip = 0 } = args;

    try {
      // Obtener correos recibidos usando Microsoft Graph API
      // Filtrar para excluir correos enviados por el usuario actual
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$top=${top}&$skip=${skip}&$orderby=receivedDateTime desc&$filter=isDraft eq false`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo correos recibidos');
      }

      const data = await response.json();
      console.log('received emails', data);
      
      // Filtrar en el cliente para asegurar que solo obtenemos correos recibidos
      // Los correos enviados tienen el remitente igual al usuario actual
      const userInfo = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (userInfo.ok) {
        const userData = await userInfo.json();
        const userEmail = userData.mail || userData.userPrincipalName;
        
                 // Filtrar para excluir correos donde el remitente es el usuario actual
         if (data.value) {
           data.value = data.value.filter((email: { from?: { emailAddress?: { address?: string } } }) => {
             const senderEmail = email.from?.emailAddress?.address;
             return senderEmail && senderEmail.toLowerCase() !== userEmail.toLowerCase();
           });
         }
      }
      
      return data;
    } catch (error) {
      console.error('Error obteniendo correos recibidos:', error);
      throw new Error('Error obteniendo correos recibidos');
    }
  },
});

// Enviar correo a través de Microsoft
export const sendMicrosoftEmail = action({
  args: {
    accessToken: v.string(),
    toRecipients: v.array(v.string()),
    ccRecipients: v.optional(v.array(v.string())),
    bccRecipients: v.optional(v.array(v.string())),
    subject: v.string(),
    body: v.string(),
    saveToSentItems: v.optional(v.boolean()),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      contentType: v.string(),
      contentBytes: v.string()
    }))),
  },
  handler: async (_ctx, args) => {
    const { 
      accessToken, 
      toRecipients, 
      ccRecipients = [], 
      bccRecipients = [], 
      subject, 
      body, 
      saveToSentItems = true,
      attachments = []
    } = args;

    try {
      const emailData: {
        message: {
          subject: string;
          body: {
            contentType: string;
            content: string;
          };
          toRecipients: Array<{
            emailAddress: {
              address: string;
            };
          }>;
          ccRecipients?: Array<{
            emailAddress: {
              address: string;
            };
          }>;
          bccRecipients?: Array<{
            emailAddress: {
              address: string;
            };
          }>;
          attachments?: Array<{
            "@odata.type": string;
            name: string;
            contentType: string;
            contentBytes: string;
          }>;
        };
        saveToSentItems: boolean;
      } = {
        message: {
          subject: subject,
          body: {
            contentType: 'HTML',
            content: body
          },
          toRecipients: toRecipients.map(recipient => ({
            emailAddress: {
              address: recipient
            }
          }))
        },
        saveToSentItems: saveToSentItems
      };

      // Añadir CC si hay destinatarios
      if (ccRecipients.length > 0) {
        emailData.message.ccRecipients = ccRecipients.map(recipient => ({
          emailAddress: {
            address: recipient
          }
        }));
      }

      // Añadir BCC si hay destinatarios
      if (bccRecipients.length > 0) {
        emailData.message.bccRecipients = bccRecipients.map(recipient => ({
          emailAddress: {
            address: recipient
          }
        }));
      }

      // Añadir archivos adjuntos si hay
      if (attachments.length > 0) {
        emailData.message.attachments = attachments.map(attachment => ({
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: attachment.name,
          contentType: attachment.contentType,
          contentBytes: attachment.contentBytes
        }));
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error enviando correo: ${errorText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('Error enviando correo');
    }
  },
});

// Responder a un correo específico
export const replyToMicrosoftEmail = action({
  args: {
    accessToken: v.string(),
    messageId: v.string(),
    body: v.string(),
  },
  handler: async (_ctx, args) => {
    const { accessToken, messageId, body } = args;

    try {
      const replyData = {
        comment: body
      };

      const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error respondiendo correo: ${errorText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error respondiendo correo:', error);
      throw new Error('Error respondiendo correo');
    }
  },
});

// Obtener detalles de un mensaje específico con adjuntos
export const getMicrosoftMessageDetails = action({
  args: {
    accessToken: v.string(),
    messageId: v.string(),
  },
  handler: async (_ctx, args) => {
    const { accessToken, messageId } = args;

    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${messageId}?$expand=attachments`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo detalles del mensaje');
      }

      const data = await response.json();
      console.log('message details', data);
      return data;
    } catch (error) {
      console.error('Error obteniendo detalles del mensaje:', error);
      throw new Error('Error obteniendo detalles del mensaje');
    }
  },
});

// Marcar correo como leído
export const markMicrosoftEmailAsRead = action({
  args: {
    accessToken: v.string(),
    messageId: v.string(),
  },
  handler: async (_ctx, args) => {
    const { accessToken, messageId } = args;

    try {
      const updateData = {
        isRead: true
      };

      const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error marcando correo como leído: ${errorText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error marcando correo como leído:', error);
      throw new Error('Error marcando correo como leído');
    }
  },
});

// Actualizar cuenta de Microsoft (verificar token y actualizar datos)
export const updateMicrosoftAccount = action({
  args: {
    accountId: v.id("socialAccounts"),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { accountId, accessToken } = args;

    try {
      // Verificar que el token sigue siendo válido obteniendo información del usuario
      const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        // Token expirado o inválido, marcar como desconectada
        await ctx.runMutation(api.microsoft.disconnectAccount, { accountId });
        throw new Error('Token expirado o inválido');
      }

      const userData = await userResponse.json();

      // Actualizar datos del usuario
      await ctx.runMutation(api.microsoft.saveMicrosoftAccount, {
        userId: "current-user", // Esto debería ser el ID real del usuario
        username: userData.userPrincipalName || userData.displayName,
        name: userData.displayName || userData.userPrincipalName,
        accessToken: accessToken,
        expiresAt: Date.now() + (3600 * 1000), // 1 hora por defecto
        email: userData.mail || userData.userPrincipalName,
        accountCreatedAt: new Date().toISOString()
      });

      return { success: true, userData };
    } catch (error) {
      console.error('Error actualizando cuenta de Microsoft:', error);
      throw new Error('Error actualizando cuenta de Microsoft');
    }
  },
}); 

// Obtener correos enviados de Microsoft
export const getMicrosoftSentEmails = action({
  args: {
    accessToken: v.string(),
    top: v.optional(v.number()),
    skip: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const { accessToken, top = 50, skip = 0 } = args;

    try {
      // Obtener correos enviados usando Microsoft Graph API
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/SentItems/messages?$top=${top}&$skip=${skip}&$orderby=sentDateTime desc`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo correos enviados');
      }

      const data = await response.json();
      console.log('sent emails', data);
      return data;
    } catch (error) {
      console.error('Error obteniendo correos enviados:', error);
      throw new Error('Error obteniendo correos enviados');
    }
  },
}); 


// Crear evento en el calendario de Microsoft
export const createMicrosoftCalendarEvent = action({
  args: {
    accessToken: v.string(),
    subject: v.string(),
    description: v.string(),
    startDateTime: v.string(),
    endDateTime: v.string(),
    timeZone: v.optional(v.string()),
    reminderMinutes: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const { 
      accessToken, 
      subject, 
      description, 
      startDateTime, 
      endDateTime, 
      timeZone = 'Europe/Madrid',
      reminderMinutes = 1440 // 24 horas = 1440 minutos
    } = args;

    try {
      const eventData = {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: description
        },
        start: {
          dateTime: startDateTime,
          timeZone: timeZone
        },
        end: {
          dateTime: endDateTime,
          timeZone: timeZone
        },
        reminderMinutesBeforeStart: reminderMinutes,
        isReminderOn: true
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { error: { message: errorText } };
        }
        
        const errorMessage = parsedError.error?.message || errorText;
        const errorCode = parsedError.error?.code || 'Unknown';
        
        console.error('Microsoft Calendar API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorCode,
          errorMessage,
          fullError: parsedError
        });
        
        throw new Error(`Error creando evento en calendario (${errorCode}): ${errorMessage}`);
      }

      const createdEvent = await response.json();
      console.log('Calendar event created:', createdEvent);
      return { success: true, event: createdEvent };
    } catch (error) {
      console.error('Error creando evento en calendario:', error);
      throw new Error('Error creando evento en calendario');
    }
  },
});

// Actualizar evento en el calendario de Microsoft
export const updateMicrosoftCalendarEvent = action({
  args: {
    accessToken: v.string(),
    eventId: v.string(),
    subject: v.string(),
    description: v.string(),
    startDateTime: v.string(),
    endDateTime: v.string(),
    timeZone: v.optional(v.string()),
    reminderMinutes: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const { 
      accessToken, 
      eventId,
      subject, 
      description, 
      startDateTime, 
      endDateTime, 
      timeZone = 'Europe/Madrid',
      reminderMinutes = 1440
    } = args;

    try {
      const eventData = {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: description
        },
        start: {
          dateTime: startDateTime,
          timeZone: timeZone
        },
        end: {
          dateTime: endDateTime,
          timeZone: timeZone
        },
        reminderMinutesBeforeStart: reminderMinutes,
        isReminderOn: true
      };

      const response = await fetch(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { error: { message: errorText } };
        }
        
        const errorMessage = parsedError.error?.message || errorText;
        const errorCode = parsedError.error?.code || 'Unknown';
        
        console.error('Microsoft Calendar API Error (Update):', {
          status: response.status,
          statusText: response.statusText,
          errorCode,
          errorMessage,
          fullError: parsedError
        });
        
        throw new Error(`Error actualizando evento en calendario (${errorCode}): ${errorMessage}`);
      }

      const updatedEvent = await response.json();
      console.log('Calendar event updated:', updatedEvent);
      return { success: true, event: updatedEvent };
    } catch (error) {
      console.error('Error actualizando evento en calendario:', error);
      throw new Error('Error actualizando evento en calendario');
    }
  },
});

// Eliminar evento del calendario de Microsoft
export const deleteMicrosoftCalendarEvent = action({
  args: {
    accessToken: v.string(),
    eventId: v.string(),
  },
  handler: async (_ctx, args) => {
    const { accessToken, eventId } = args;

    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { error: { message: errorText } };
        }
        
        const errorMessage = parsedError.error?.message || errorText;
        const errorCode = parsedError.error?.code || 'Unknown';
        
        console.error('Microsoft Calendar API Error (Delete):', {
          status: response.status,
          statusText: response.statusText,
          errorCode,
          errorMessage,
          fullError: parsedError
        });
        
        throw new Error(`Error eliminando evento del calendario (${errorCode}): ${errorMessage}`);
      }

      console.log('Calendar event deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error eliminando evento del calendario:', error);
      throw new Error('Error eliminando evento del calendario');
    }
  },
});