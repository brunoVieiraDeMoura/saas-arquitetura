/**
 * Cria os 4 planos de assinatura no MercadoPago (roda uma única vez).
 *
 * Uso:
 *   node --env-file=.env.local scripts/create-mp-plans.mjs
 *
 * Copie os IDs gerados para o .env.local:
 *   MP_PLAN_ID_PRO_MONTHLY=...
 *   MP_PLAN_ID_PRO_ANNUAL=...
 *   MP_PLAN_ID_AGENCY_MONTHLY=...
 *   MP_PLAN_ID_AGENCY_ANNUAL=...
 */

import { MercadoPagoConfig, PreApprovalPlan } from 'mercadopago'

const accessToken = process.env.MP_ACCESS_TOKEN
if (!accessToken) {
  console.error('❌  MP_ACCESS_TOKEN não definido. Rode: node --env-file=.env.local scripts/create-mp-plans.mjs')
  process.exit(1)
}

const mp = new MercadoPagoConfig({ accessToken })
const planApi = new PreApprovalPlan(mp)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arquiteturaorganizada.com.br'
const BACK_URL = `${BASE_URL}/dashboard/billing`

const plans = [
  {
    key: 'MP_PLAN_ID_PRO_MONTHLY',
    body: {
      reason: 'Arquitetura Organizada — Pro Mensal',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 130,
        currency_id: 'BRL',
      },
      back_url: BACK_URL,
    },
  },
  {
    key: 'MP_PLAN_ID_PRO_ANNUAL',
    body: {
      reason: 'Arquitetura Organizada — Pro Anual',
      auto_recurring: {
        // cobrado 1x por ano (12 meses de intervalo)
        frequency: 12,
        frequency_type: 'months',
        transaction_amount: 1188, // R$99 × 12
        currency_id: 'BRL',
      },
      back_url: BACK_URL,
    },
  },
  {
    key: 'MP_PLAN_ID_AGENCY_MONTHLY',
    body: {
      reason: 'Arquitetura Organizada — Agency Mensal',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 250,
        currency_id: 'BRL',
      },
      back_url: BACK_URL,
    },
  },
  {
    key: 'MP_PLAN_ID_AGENCY_ANNUAL',
    body: {
      reason: 'Arquitetura Organizada — Agency Anual',
      auto_recurring: {
        frequency: 12,
        frequency_type: 'months',
        transaction_amount: 2040, // R$170 × 12
        currency_id: 'BRL',
      },
      back_url: BACK_URL,
    },
  },
]

console.log('Criando planos no MercadoPago...\n')

const results = []

for (const plan of plans) {
  try {
    const res = await planApi.create({ body: plan.body })
    const id = res.id
    console.log(`✅  ${plan.key}=${id}`)
    results.push(`${plan.key}=${id}`)
  } catch (err) {
    console.error(`❌  Erro ao criar ${plan.key}:`, err?.message ?? err)
    process.exit(1)
  }
}

console.log('\n--- Copie para o .env.local ---')
results.forEach((line) => console.log(line))
