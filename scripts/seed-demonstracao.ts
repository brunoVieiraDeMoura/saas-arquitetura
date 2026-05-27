/**
 * seed-demonstracao.ts
 * Limpa e repopula o tenant "demonstracao" do zero.
 * Categorias: Residencial + Comercial
 * Destaque hero: 3 residencial + 3 comercial (total 6)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function tiptap(paragraphs: string[]) {
  return {
    type: 'doc',
    content: paragraphs.map((text) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })),
  }
}

// ── Imagens ───────────────────────────────────────────────────────────────────
// Todas verificadas: residencial = exterior/fachada de casas e aptos reais
//                   comercial   = restaurantes, escritórios, varejo reais
const R = {
  // Residencial — exteriores e interiores de alto padrão
  r1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85', // casa moderna, piscina
  r2: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85', // casa contemporânea noturna
  r3: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&q=85', // fachada minimalista
  r4: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85', // mansão moderna
  r5: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85', // living room luxo
  r6: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85', // cozinha integrada
  r7: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85', // sala de estar moderna
  r8: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=85', // quarto master
  r9: 'https://images.unsplash.com/photo-1560185127-6a7c3e4e8ebc?w=1200&q=85', // área externa/piscina
  r10:'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=85', // casa campo
}

const C = {
  // Comercial — restaurantes, escritórios, lojas reais
  c1: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=85', // restaurante sofisticado
  c2: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=85', // café/bistrô
  c3: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', // escritório corporativo
  c4: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=85', // open office moderno
  c5: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=85', // loja/varejo
  c6: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85', // sala de reunião
  c7: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85', // boutique/retail
  c8: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=85', // bar/restaurante bar
  c9: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=85', // lobby corporativo
}

// ── Categorias ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Residencial',
    slug: 'residencial',
    description: 'Casas e apartamentos de alto padrão que transformam o conceito de morar — do projeto à entrega, com cada detalhe pensado para o seu estilo de vida.',
    order_index: 0,
  },
  {
    name: 'Comercial',
    slug: 'comercial',
    description: 'Restaurantes, escritórios, lojas e clínicas que traduzem a identidade da marca em arquitetura — espaços que vendem, retêm e impressionam.',
    order_index: 1,
  },
]

// ── Projetos ──────────────────────────────────────────────────────────────────
type ProjectDef = {
  title: string
  date: string
  img: string
  gallery: string[]
  featured: boolean
  content: string[]
}

const PROJECTS: Record<string, ProjectDef[]> = {
  residencial: [
    {
      title: 'Residência Jardim Europa',
      date: '2024-04-01',
      img: R.r1,
      gallery: [R.r2, R.r7, R.r6, R.r9],
      featured: true,
      content: [
        'Residência unifamiliar de 480m² em lote de esquina no Jardim Europa, São Paulo. O programa contempla 4 suítes, living expandido com pé-direito duplo de 5,8m, home office, adega climatizada e área gourmet com piscina de borda infinita integrada ao jardim.',
        'O partido arquitetônico explora a volumetria em dois blocos ortogonais interligados por passarela envidraçada. A fachada principal combina concreto aparente pigmentado em cinza grafite com planos de vidro temperado de piso a teto, garantindo privacidade para a rua e abertura total para o jardim interno.',
        'O projeto de interiores foi desenvolvido em conjunto com a arquitetura: piso em porcelanato 120x120cm formato único em toda a área social, marcenaria em laca branca fosca com inserções em carvalho americano e iluminação projetada em quatro camadas independentes para cada ambiente. Cada decisão de material considerou durabilidade, estética e facilidade de manutenção.',
      ],
    },
    {
      title: 'Casa Minimalista — Ibiúna',
      date: '2024-02-15',
      img: R.r3,
      gallery: [R.r5, R.r8, R.r1],
      featured: true,
      content: [
        'Casa de campo de 340m² inserida em terreno de 5.000m² em condomínio fechado em Ibiúna. O programa é deliberadamente enxuto: sala única de 80m² que integra estar, jantar e cozinha, 3 suítes e varanda perimetral que abraça a construção.',
        'O conceito nasce da subtração: um volume puro de concreto e madeira cumaru, sem ornamentos, onde cada abertura é calculada para capturar uma vista específica da mata ao redor. A cobertura plana com calha invertida cria beiral de 1,8m que protege do sol poente e permite as janelas permanecerem abertas mesmo na chuva.',
        'Internamente, o projeto usa apenas três materiais: cimento queimado no piso, madeira ipê nas paredes sociais e branco absoluto nos dormitórios. Toda a marcenaria é sob medida em MDF cru com poros abertos — textura intencional que envelhece com charme e se integra cada vez mais ao caráter orgânico da casa.',
      ],
    },
    {
      title: 'Cobertura Duplex — Itaim Bibi',
      date: '2023-11-01',
      img: R.r2,
      gallery: [R.r7, R.r6, R.r8, R.r9],
      featured: true,
      content: [
        'Cobertura duplex de 420m² com terraço de 140m² em edifício de alto padrão no Itaim Bibi. A reforma total incluiu remoção de todas as divisórias do pavimento social, criando planta aberta de 110m² com pé-direito de 3,4m e visão direta para o skyline de São Paulo.',
        'O projeto conecta os dois pavimentos por escada monumental em aço carbono com degraus flutuantes em carvalho europeu — peça escultórica que é o coração visual do apartamento. No terraço, deck em teca, piscina aquecida de 12m² e área gourmet coberta com pérgola de aço e trepadeiras completam o programa.',
        'A iluminação cênica foi o elemento mais trabalhado do projeto: 180 pontos de luz em 11 cenas programáveis, controlados por automação KNX. Do despertar ao cinema, cada momento da vida no apartamento tem sua cena de luz específica — temperatura de cor, intensidade e foco calibrados com consultora especializada em iluminação residencial.',
      ],
    },
    {
      title: 'Casa de Campo — Bragança Paulista',
      date: '2023-07-01',
      img: R.r4,
      gallery: [R.r10, R.r5, R.r1],
      featured: false,
      content: [
        'Casa de campo de 280m² em terreno de 3 hectares em Bragança Paulista. O projeto aproveitou a topografia acidentada do terreno para implantar a residência em platô elevado com vista de 180° para a Serra da Mantiqueira.',
        'Estrutura em concreto e aço com fechamento em vidro nas fachadas de maior insolação e madeira de reflorestamento nas fachadas de serviço. Telhado em duas águas com estrutura aparente em madeira roliça de eucalipto certificado e cobertura em telha de barro artesanal.',
        'A casa foi projetada para conexão permanente com o exterior: varanda de 14m integra toda a fachada social, piscina natural com sistema biodinâmico e jardim produtivo de 200m² com horta, pomar e ervas aromáticas manejado pela família. Zero uso de pesticidas ou herbicidas — o projeto de paisagismo foi concebido como ecossistema autossustentável.',
      ],
    },
    {
      title: 'Apartamento Reformado — Higienópolis',
      date: '2024-06-01',
      img: R.r5,
      gallery: [R.r7, R.r6, R.r8],
      featured: false,
      content: [
        'Reforma completa de apartamento de 210m² em edifício de 1968 em Higienópolis. O desafio técnico foi modernizar a planta e todas as instalações dentro das restrições de um edifício tombado — fachada e estrutura preservadas, interior totalmente reconfigurado.',
        'Remoção de 6 paredes criou planta social aberta e contínua de 90m². As vigas de concreto aparente originais foram lixadas e tratadas com resina de proteção — tornaram-se o elemento identitário mais marcante do projeto, ao invés de serem escondidas no forro.',
        'A paleta material combina o passado e o presente do apartamento: granilite original restaurado no piso dos quartos, madeira carvalho europeu na área social, mármore Calacata branco no banheiro principal. Cada material tem uma temporalidade diferente — o projeto narra a história do imóvel sem apagar nenhum capítulo.',
      ],
    },
  ],

  comercial: [
    {
      title: 'Restaurante Brasa — Vila Madalena',
      date: '2024-03-01',
      img: C.c1,
      gallery: [C.c8, C.c2, C.c5],
      featured: true,
      content: [
        'Restaurante de gastronomia contemporânea com 220m² e 70 lugares na Vila Madalena. O projeto ocupa um casarão de 1942 preservado, onde a estratégia foi manter a memória do edifício histórico em contraste com intervenções contemporâneas precisas.',
        'Tijolos de demolição aparentes, vigas de madeira originais e janelas guilhotina em madeira convivem com iluminação em trilho preto, mesa-balcão em granito nero absoluto e cozinha aberta em aço inox escovado visível de qualquer ponto do salão. A tensão entre o histórico e o contemporâneo é a essência estética do projeto.',
        'A acústica recebeu solução técnica invisível: painéis de lã de PET reciclado com revestimento em linho natural foram instalados no teto e nas paredes de fundo, reduzindo o ruído de fundo sem alterar a aparência. O resultado é um restaurante com 70 pessoas onde a conversa flui sem esforço — diferencial raro em espaços gastronômicos de alta rotatividade.',
      ],
    },
    {
      title: 'Sede Corporativa — Faria Lima',
      date: '2024-01-15',
      img: C.c3,
      gallery: [C.c4, C.c6, C.c9],
      featured: true,
      content: [
        'Sede de empresa de tecnologia com 1.800m² em dois andares na Avenida Faria Lima. O programa inclui 150 posições de trabalho em modelo híbrido, 6 salas de reunião, 3 cabines de foco, 2 lounges de colaboração e recepção com sala de espera VIP.',
        'O conceito foi trabalho como experiência: nenhum espaço é genérico. A recepção tem pé-direito de 5m com jardim vertical de 30m² e escada em aço preto com espelho d\'água embaixo. As salas de reunião têm paredes em vidro com película de privacidade acionável eletronicamente. Os lounges têm identidades completamente distintas — um sério, um informal.',
        'A integração entre os dois andares foi resolvida por escada interna de aço com guarda-corpo em vidro laminado — o fluxo de pessoas entre andares torna-se movimento vivo visível da recepção. Toda a identidade visual da empresa foi incorporada em elementos substituíveis: mobiliário, painéis acústicos e sinalização, nunca em paredes — flexibilidade garantida para rebranding futuro.',
      ],
    },
    {
      title: 'Café Origem — Pinheiros',
      date: '2024-05-01',
      img: C.c2,
      gallery: [C.c1, C.c7, C.c8],
      featured: true,
      content: [
        'Café especialidade de 95m² em sobrado dos anos 50 em Pinheiros. O projeto preservou a fachada com venezianas originais e transformou o interior em um espaço onde cada centímetro foi projetado para a experiência do café — da torrefação exposta à mesa do barista como elemento central.',
        'A planta foi organizada em dois momentos: o balcão performático onde acontece o preparo dos cafés, extrovertido e cheio de movimento, e a área de mesas, mais introspectiva com nichos de leitura e iluminação mais baixa. A transição entre essas zonas é marcada por uma estante biblioteca de piso ao teto em carvalho com abertura central.',
        'O mobiliário é exclusivo do projeto: mesas em mármore Branco Paraná com bordas irregulares naturais — cada mesa única. Cadeiras em madeira maciça com assento em couro natural vegetal. A identidade visual do café foi desenvolvida em paralelo à arquitetura — o mesmo carvalho das estantes aparece no cardápio encadernado, o verde da fachada retorna nos elementos gráficos. Arquitetura e marca projetadas como obra única.',
      ],
    },
    {
      title: 'Boutique Atelier — Oscar Freire',
      date: '2023-09-01',
      img: C.c7,
      gallery: [C.c5, C.c1, C.c8],
      featured: false,
      content: [
        'Loja de moda autoral feminina com 160m² na Rua Oscar Freire. O projeto transforma a experiência de compra em imersão — cada ambiente foi projetado para ser cenografia dos produtos, sem competir com eles.',
        'Fachada em travertino romano escovado com portal em aço corten recortado a laser — elemento de identidade que se repete internamente em diferentes materiais e escalas. Interior organizado em três zonas: vitrine performática com iluminação espectral, salão de exposição com araras suspensas em aço preto e dois provadores VIP em veludo esmeralda.',
        'A iluminação foi calibrada para renderização de cores excepcional — índice de reprodução cromática acima de 97 em todos os focos sobre produtos. Isso garante que as roupas pareçam exatamente como parecerão na luz natural do dia, eliminando devoluções por frustração com a cor real. Todo o mobiliário é desmontável e pode ser reconfigurado a cada estação sem obra.',
      ],
    },
    {
      title: 'Clínica Renova — Itaim Bibi',
      date: '2023-12-01',
      img: C.c9,
      gallery: [C.c6, C.c3, C.c4],
      featured: false,
      content: [
        'Clínica de medicina estética e bem-estar com 8 consultórios, recepção, sala de espera VIP e 2 salas de procedimentos em 560m² no Itaim Bibi. O conceito central é a humanização do ambiente clínico — espaço que transmite cuidado e sofisticação sem remeter a hospital.',
        'Paleta em verde sálvia, nude e branco com materiais suaves: madeira ripada em tauarí, mármore Bianco carrara e muito verde natural nas áreas de espera. A iluminação circadiana ajusta automaticamente a temperatura de cor ao longo do dia, de 4500K pela manhã a 2700K à tarde — ambiente sempre adequado ao humor e à função do espaço.',
        'Cada consultório tem janela para jardim interno independentemente de sua posição na planta — requisito imposto pelo cliente que gerou a configuração espacial central do projeto. O sistema de orientação visual em todos os corredores elimina a necessidade de perguntar ao staff, reduzindo a carga operacional da recepção e a ansiedade dos pacientes. Detalhes que custam pouco e elevam muito a percepção de qualidade.',
      ],
    },
  ],
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { data: tenant, error } = await admin
    .from('tenants')
    .select('id, slug, plan')
    .eq('slug', 'demonstracao')
    .single()

  if (error || !tenant) {
    console.error('Tenant "demonstracao" não encontrado:', error?.message)
    process.exit(1)
  }

  console.log(`✓ Tenant: ${tenant.slug} (${tenant.id})`)

  // ── 1. Limpa projetos e categorias existentes ─────────────────────────────
  console.log('\n  Limpando dados existentes...')

  const { data: existingCats } = await admin
    .from('categories')
    .select('id')
    .eq('tenant_id', tenant.id)

  if (existingCats && existingCats.length > 0) {
    const catIds = existingCats.map((c) => c.id)

    const { error: delProjErr } = await admin
      .from('projects')
      .delete()
      .in('category_id', catIds)

    if (delProjErr) {
      console.error('  Erro ao deletar projetos:', delProjErr.message)
      process.exit(1)
    }
    console.log(`  ✓ Projetos deletados`)

    const { error: delCatErr } = await admin
      .from('categories')
      .delete()
      .in('id', catIds)

    if (delCatErr) {
      console.error('  Erro ao deletar categorias:', delCatErr.message)
      process.exit(1)
    }
    console.log(`  ✓ Categorias deletadas (${catIds.length})`)
  } else {
    console.log('  Nenhuma categoria existente.')
  }

  // ── 2. Cria categorias ────────────────────────────────────────────────────
  console.log('\n  Criando categorias...')
  const { data: insertedCats, error: catErr } = await admin
    .from('categories')
    .insert(CATEGORIES.map((c) => ({ ...c, tenant_id: tenant.id })))
    .select('id, slug')

  if (catErr || !insertedCats) {
    console.error('  Erro ao criar categorias:', catErr?.message)
    process.exit(1)
  }

  const catMap = Object.fromEntries(insertedCats.map((c) => [c.slug, c.id]))
  console.log(`  ✓ ${insertedCats.length} categorias: ${insertedCats.map((c) => c.slug).join(', ')}`)

  // ── 3. Insere projetos ────────────────────────────────────────────────────
  console.log('\n  Inserindo projetos...')
  let totalInserted = 0

  for (const [catSlug, projects] of Object.entries(PROJECTS)) {
    const categoryId = catMap[catSlug]
    if (!categoryId) {
      console.warn(`  ⚠ Categoria "${catSlug}" não encontrada no mapa, pulando.`)
      continue
    }

    const rows = projects.map((p) => ({
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

    const { error: projErr } = await admin.from('projects').insert(rows)
    if (projErr) {
      console.error(`  Erro ao inserir projetos de "${catSlug}":`, projErr.message)
      process.exit(1)
    }

    const featuredCount = rows.filter((r) => r.is_featured).length
    console.log(`  ✓ [${catSlug}] ${rows.length} projetos inseridos (${featuredCount} em destaque)`)
    totalInserted += rows.length
  }

  // ── 4. Resumo ─────────────────────────────────────────────────────────────
  console.log(`\n✓ Concluído. ${totalInserted} projetos inseridos em ${insertedCats.length} categorias.`)
  console.log('  Hero vai exibir: 3 residencial + 3 comercial (total 6 destaques).')
}

main().catch(console.error)
