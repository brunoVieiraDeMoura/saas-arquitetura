import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function tiptap(paragraphs: string[]) {
  return {
    type: 'doc',
    content: paragraphs.map(text => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })),
  }
}

const IMAGES = {
  residencial: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=900&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80',
  ],
  interiores: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80',
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80',
  ],
  comercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=900&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
  ],
  reforma: [
    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=900&q=80',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  ],
}

async function main() {
  // ── Find tenant ───────────────────────────────────────────────────────────────
  const { data: tenant, error } = await admin
    .from('tenants')
    .select('id, slug, plan')
    .eq('slug', 'brunomoura')
    .single()

  if (error || !tenant) {
    console.error('Tenant brunomoura não encontrado:', error?.message)
    process.exit(1)
  }

  console.log(`✓ Tenant: ${tenant.slug} (${tenant.id}) — plano: ${tenant.plan}`)

  // ── Get existing categories to avoid duplicates ───────────────────────────────
  const { data: existingCats } = await admin
    .from('categories')
    .select('slug, id, order_index')
    .eq('tenant_id', tenant.id)

  const existingSlugs = new Set((existingCats ?? []).map(c => c.slug))
  const maxOrder = Math.max(...(existingCats ?? []).map(c => c.order_index ?? 0), -1)

  console.log(`  Categorias existentes: ${[...existingSlugs].join(', ') || 'nenhuma'}`)

  // ── Insert new categories ─────────────────────────────────────────────────────
  const newCats = [
    { name: 'Residencial',  slug: 'residencial',  description: 'Casas, apartamentos e coberturas que transformam o conceito de morar.', order_index: maxOrder + 1 },
    { name: 'Interiores',   slug: 'interiores',   description: 'Design de interiores que une funcionalidade, estética e identidade pessoal.', order_index: maxOrder + 2 },
    { name: 'Comercial',    slug: 'comercial',    description: 'Espaços corporativos e gastronômicos que comunicam a identidade da marca.', order_index: maxOrder + 3 },
    { name: 'Reformas',     slug: 'reformas',     description: 'Reformas residenciais e comerciais com projeto técnico e acompanhamento completo.', order_index: maxOrder + 4 },
  ].filter(c => !existingSlugs.has(c.slug))

  let insertedCats: { id: string; slug: string }[] = []
  if (newCats.length > 0) {
    const { data, error: catErr } = await admin
      .from('categories')
      .insert(newCats.map(c => ({ ...c, tenant_id: tenant.id })))
      .select('id, slug')
    if (catErr) { console.error('Erro ao criar categorias:', catErr.message); process.exit(1) }
    insertedCats = data ?? []
    console.log(`  + Categorias criadas: ${insertedCats.map(c => c.slug).join(', ')}`)
  } else {
    console.log('  Nenhuma categoria nova para criar.')
  }

  // Merge existing + inserted
  const allCats: { id: string; slug: string }[] = [
    ...(existingCats ?? []).map(c => ({ id: c.id, slug: c.slug })),
    ...insertedCats,
  ]

  const catMap = Object.fromEntries(allCats.map(c => [c.slug, c.id]))

  // ── Projects data ─────────────────────────────────────────────────────────────
  type ProjectDef = { title: string; date: string; img: string; gallery: string[]; featured: boolean; content: string[] }

  const PROJECTS: Record<string, ProjectDef[]> = {
    residencial: [
      {
        title: 'Residência Alto da Boa Vista',
        date: '2024-03-01',
        img: IMAGES.residencial[0],
        gallery: [IMAGES.residencial[1], IMAGES.residencial[2], IMAGES.interiores[0]],
        featured: true,
        content: [
          'Residência de 420m² inserida em lote privilegiado com vista para mata preservada. O programa contemplou 4 suítes master, home office integrado, living expandido e área gourmet com piscina de borda infinita.',
          'O partido arquitetônico explorou a topografia natural do terreno em três níveis interligados por escada monumental em concreto aparente. Grandes planos de vidro garantem a integração visual entre interior e paisagem.',
        ],
      },
      {
        title: 'Apartamento Itaim Bibi',
        date: '2023-11-01',
        img: IMAGES.residencial[1],
        gallery: [IMAGES.residencial[2], IMAGES.interiores[1]],
        featured: true,
        content: [
          'Reforma completa de apartamento de 180m² em edifício de alto padrão. O projeto unificou sala, jantar e cozinha em planta aberta com pé-direito duplo, maximizando a sensação de amplitude.',
          'Paleta neutra em tons de greige e off-white com inserções em verde musgo e madeira carvalho. Todo o mobiliário é sob medida, desenvolvido em parceria com marcenaria especializada.',
        ],
      },
      {
        title: 'Casa Minimalista — Alphaville',
        date: '2024-01-15',
        img: IMAGES.residencial[2],
        gallery: [IMAGES.residencial[3], IMAGES.residencial[4], IMAGES.interiores[2]],
        featured: false,
        content: [
          'Projeto de 320m² concebido a partir de um único volume puro recortado por vazios estratégicos que distribuem luz natural por todos os ambientes ao longo do dia.',
          'Materialidade reduzida a três elementos: concreto aparente, vidro temperado e ipê natural. A paisagem torna-se o quarto elemento — sempre presente como pano de fundo de cada cômodo.',
        ],
      },
      {
        title: 'Cobertura Duplex — Vila Nova Conceição',
        date: '2023-07-01',
        img: IMAGES.residencial[3],
        gallery: [IMAGES.residencial[4], IMAGES.residencial[0]],
        featured: false,
        content: [
          'Cobertura de 260m² com terraço gourmet de 80m² e jacuzzi. O projeto integrou os dois pavimentos por uma escada em aço corten com degraus flutuantes em madeira maciça.',
          'O destaque do projeto é a fachada verde — painel de plantas naturais com sistema de irrigação automatizado que funciona como isolamento térmico e elemento estético.',
        ],
      },
      {
        title: 'Casa de Campo — Fazenda Boa Esperança',
        date: '2023-04-01',
        img: IMAGES.residencial[4],
        gallery: [IMAGES.residencial[5], IMAGES.residencial[0]],
        featured: true,
        content: [
          'Casa de campo de 280m² projetada para imersão na natureza. Telhado em duas águas com estrutura aparente em madeira de reflorestamento e cobertura em telha de barro.',
          'Varanda perimetral de 12 metros integra todos os ambientes sociais ao jardim e piscina. Pedra ferro e madeira cumaru predominam na materialidade externa.',
        ],
      },
    ],
    interiores: [
      {
        title: 'Home Office Contemporâneo',
        date: '2024-02-01',
        img: IMAGES.interiores[0],
        gallery: [IMAGES.interiores[1], IMAGES.interiores[2]],
        featured: true,
        content: [
          'Projeto de home office de 18m² em apartamento residencial. O desafio foi criar um ambiente produtivo e esteticamente refinado que dialogasse com a decoração existente do imóvel.',
          'Estante biblioteca customizada do piso ao teto em MDF laqueado cinza grafite com iluminação embutida LED. Mesa em carvalho natural de 2,20m com tampo único maciço.',
        ],
      },
      {
        title: 'Sala de Estar — Conceito Biofílico',
        date: '2024-04-01',
        img: IMAGES.interiores[1],
        gallery: [IMAGES.interiores[2], IMAGES.interiores[3], IMAGES.interiores[0]],
        featured: true,
        content: [
          'Reforma de sala de estar de 45m² com conceito biofílico — integração ativa da natureza ao espaço construído. Jardim vertical interno de 3m² com espécies tropicais e iluminação espectral.',
          'Piso em porcelanato imitação cimento com juntas irregulares artesanais. Sofá modular em linho natural, mesas de centro em mármore travertino e luminária pendente em rattan artesanal.',
        ],
      },
      {
        title: 'Cozinha Gourmet Integrada',
        date: '2023-09-01',
        img: IMAGES.interiores[2],
        gallery: [IMAGES.interiores[3], IMAGES.interiores[4]],
        featured: false,
        content: [
          'Cozinha gourmet de 32m² integrada à sala de jantar. Ilha central em granito nero absoluto de 3,5m com 8 lugares. Armários em laca branca fosca com puxadores embutidos em alumínio escovado.',
          'Eletrodomésticos de embutir inox formam parede técnica de 4m. Adega climatizada para 120 garrafas integrada ao projeto de marcenaria. Iluminação em três camadas: geral, direta e de destaque.',
        ],
      },
      {
        title: 'Suíte Master — Estilo Boutique',
        date: '2024-05-01',
        img: IMAGES.interiores[3],
        gallery: [IMAGES.interiores[4], IMAGES.interiores[5], IMAGES.interiores[0]],
        featured: false,
        content: [
          'Suíte master de 38m² concebida com referência em hotéis boutique europeus. Painel de cabeceira em tecido de linho texturizado de 3m de largura com iluminação indireta perimetral.',
          'Closet em L de 12m² com sistema de organização modular, espelhos de corpo inteiro e iluminação com sensor de presença. Banheiro com banheira de imersão freestanding em acrílico.',
        ],
      },
    ],
    comercial: [
      {
        title: 'Sede Corporativa — Fintech São Paulo',
        date: '2024-02-15',
        img: IMAGES.comercial[0],
        gallery: [IMAGES.comercial[1], IMAGES.comercial[2]],
        featured: true,
        content: [
          'Projeto de 1.200m² para sede de fintech em crescimento acelerado. Layout de trabalho híbrido com 60 estações fixas, 40 posições hot desk, 8 salas de reunião e 2 lounges de descompressão.',
          'Identidade visual da empresa integrada ao projeto de arquitetura: paleta de azul elétrico e cinza chumbo em elementos pontuais. Acústica com painéis de lã de rocha e forração em tecido.',
        ],
      },
      {
        title: 'Restaurante Tradição — Jardins',
        date: '2023-10-01',
        img: IMAGES.comercial[1],
        gallery: [IMAGES.comercial[2], IMAGES.comercial[3], IMAGES.comercial[0]],
        featured: true,
        content: [
          'Restaurante de alta gastronomia com 180m² e 60 lugares. Conceito industrial refinado: pé-direito de 5m, lajes aparentes, tijolos de demolição e iluminação pendente em cobre artesanal.',
          'Área do bar destacada por arco em tijolo refratário. Adega exposta com capacidade para 300 garrafas torna-se elemento cenográfico central do projeto.',
        ],
      },
      {
        title: 'Clínica Dermatológica Premium',
        date: '2023-06-01',
        img: IMAGES.comercial[2],
        gallery: [IMAGES.comercial[3], IMAGES.comercial[4]],
        featured: false,
        content: [
          'Clínica de dermatologia com 8 consultórios, recepção, sala de espera VIP e 2 salas de procedimentos. Conceito de humanização do ambiente clínico: espaço que transmite cuidado sem parecer hospital.',
          'Paleta em verde sálvia e nude com materiais suaves — madeira ripada, mármore branco e muito verde natural. Iluminação circadiana que ajusta a temperatura de cor ao longo do dia.',
        ],
      },
      {
        title: 'Loja Conceito — Moda Autoral',
        date: '2024-06-01',
        img: IMAGES.comercial[3],
        gallery: [IMAGES.comercial[4], IMAGES.comercial[0]],
        featured: false,
        content: [
          'Loja de 120m² para marca de moda autoral feminina. O projeto transforma a experiência de compra em imersão sensorial — cada metro quadrado é cenografia para os produtos.',
          'Estrutura metálica aparente em aço corten com arara suspensa. Cabines de prova em veludo esmeralda. Vitrine com sistema de iluminação que cria halo de luz ao redor dos manequins.',
        ],
      },
    ],
    reformas: [
      {
        title: 'Reforma Integral — Apto Anos 80',
        date: '2024-01-01',
        img: IMAGES.reforma[0],
        gallery: [IMAGES.reforma[1], IMAGES.reforma[2]],
        featured: true,
        content: [
          'Reforma completa de apartamento de 95m² construído nos anos 80 em edifício tombado. O desafio técnico foi modernizar toda a planta e instalações respeitando as restrições da fachada histórica.',
          'Remoção de 3 paredes para criar planta aberta. Substituição completa de instalações hidráulicas e elétricas. Resultado: apartamento com estética contemporânea preservando o charme do edifício original.',
        ],
      },
      {
        title: 'Reforma Banheiro Master',
        date: '2023-08-01',
        img: IMAGES.reforma[1],
        gallery: [IMAGES.reforma[2], IMAGES.reforma[3]],
        featured: false,
        content: [
          'Reforma de banheiro master de 14m² com troca completa de revestimentos, louças e metais. Projeto com ducha de corpo, banheira de imersão, dupla bancada e nicho de mármore empena a empena.',
          'Revestimento em mármore Calacata piso a teto nas paredes e piso aquecido com sistema de resistência elétrica. Torneiras e chuveiros em bronze envelhecido Deca.',
        ],
      },
      {
        title: 'Retrofit Comercial — Escritório Advocacia',
        date: '2023-05-01',
        img: IMAGES.reforma[2],
        gallery: [IMAGES.reforma[3], IMAGES.reforma[0]],
        featured: true,
        content: [
          'Retrofit de escritório de advocacia em imóvel dos anos 70 no centro histórico de São Paulo. 350m² reformados com manutenção do piso original em granilite restaurado.',
          'Salas de reunião com piso elevado técnico para distribuição de infraestrutura de dados. Painéis de madeira cumaru desmontáveis permitem reconfiguração futura sem obras.',
        ],
      },
    ],
  }

  // ── Insert projects ───────────────────────────────────────────────────────────
  let totalInserted = 0
  for (const [catSlug, projects] of Object.entries(PROJECTS)) {
    const categoryId = catMap[catSlug]
    if (!categoryId) {
      console.log(`  ⚠ Categoria "${catSlug}" não encontrada, pulando projetos.`)
      continue
    }

    // Check existing slugs in this category to avoid duplicates
    const { data: existingProjects } = await admin
      .from('projects')
      .select('slug')
      .eq('tenant_id', tenant.id)
      .eq('category_id', categoryId)

    const existingProjectSlugs = new Set((existingProjects ?? []).map(p => p.slug))

    const rows = projects
      .filter(p => !existingProjectSlugs.has(slugify(p.title)))
      .map(p => ({
        tenant_id:        tenant.id,
        category_id:      categoryId,
        title:            p.title,
        slug:             slugify(p.title),
        date:             p.date,
        main_image:       p.img,
        gallery:          p.gallery,
        content:          tiptap(p.content),
        is_featured:      p.featured,
        meta_description: p.content[0].slice(0, 160),
      }))

    if (rows.length === 0) {
      console.log(`  [${catSlug}] Todos os projetos já existem.`)
      continue
    }

    const { error: projErr } = await admin.from('projects').insert(rows)
    if (projErr) {
      console.error(`  Erro ao inserir projetos de ${catSlug}:`, projErr.message)
    } else {
      console.log(`  + [${catSlug}] ${rows.length} projetos inseridos.`)
      totalInserted += rows.length
    }
  }

  console.log(`\n✓ Concluído. ${totalInserted} projetos novos inseridos.`)
}

main().catch(console.error)
