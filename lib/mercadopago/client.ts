import { MercadoPagoConfig } from 'mercadopago'

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 10000 },
})
