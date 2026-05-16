import { createHash, randomUUID } from 'crypto'

const PIXEL_CODE = 'D849B2RC77U70JIQMHPG'
const API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

function hashValue(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

interface TikTokEventContext {
  ip?: string
  userAgent?: string
  url?: string
  email?: string
  externalId?: string
}

interface TikTokEventProperties {
  contentName?: string
  currency?: string
  value?: number
}

async function sendTikTokEvent(
  event: 'ViewContent' | 'ClickButton' | 'CompleteRegistration',
  context: TikTokEventContext = {},
  properties: TikTokEventProperties = {},
) {
  const token = process.env.TIKTOK_ACCESS_TOKEN
  if (!token) return

  const user: Record<string, string> = {}
  if (context.ip) user.ip = context.ip
  if (context.userAgent) user.user_agent = context.userAgent
  if (context.email) user.email = hashValue(context.email)
  if (context.externalId) user.external_id = hashValue(context.externalId)

  const body = {
    pixel_code: PIXEL_CODE,
    event,
    event_time: Math.floor(Date.now() / 1000),
    event_id: randomUUID(),
    user,
    page: { url: context.url ?? process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    properties: {
      ...(properties.contentName && { content_name: properties.contentName }),
      ...(properties.currency && { currency: properties.currency }),
      ...(properties.value !== undefined && { value: properties.value }),
    },
  }

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': token,
      },
      body: JSON.stringify(body),
    })
  } catch {
    // non-critical — don't let tracking failures bubble up
  }
}

export const tiktokEvents = {
  viewContent: (ctx: TikTokEventContext, props?: TikTokEventProperties) =>
    sendTikTokEvent('ViewContent', ctx, props),
  clickButton: (ctx: TikTokEventContext, props?: TikTokEventProperties) =>
    sendTikTokEvent('ClickButton', ctx, props),
  completeRegistration: (ctx: TikTokEventContext, props?: TikTokEventProperties) =>
    sendTikTokEvent('CompleteRegistration', ctx, props),
}
