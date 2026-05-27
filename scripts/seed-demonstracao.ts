/**
 * seed-demonstracao.ts
 * Limpa e repopula o tenant "demonstracao" do zero.
 * 8 categorias | Hero: 3 residencial + 3 comercial (featured)
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

// ── Paletas de imagens por categoria ─────────────────────────────────────────
const R = {
  r1:  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85', // casa moderna, piscina
  r2:  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85', // casa contemporânea noturna
  r3:  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&q=85', // fachada minimalista
  r4:  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85', // mansão moderna
  r5:  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85', // living room luxo
  r6:  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85', // cozinha integrada
  r7:  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85', // sala de estar moderna
  r8:  'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=85', // quarto master
  r9:  'https://images.unsplash.com/photo-1560185127-6a7c3e4e8ebc?w=1200&q=85', // área externa/piscina
  r10: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=85', // casa campo
}

const C = {
  c1: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=85', // restaurante sofisticado
  c2: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=85', // café/bistrô
  c3: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', // escritório corporativo
  c4: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=85', // open office moderno
  c5: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=85', // loja/varejo
  c6: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85', // sala de reunião
  c7: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85', // boutique/retail
  c8: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=85', // bar interior
  c9: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=85', // lobby corporativo
}

const I = {
  i1: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85', // sala contemporânea
  i2: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85', // sala de estar neutra
  i3: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=85', // interior moderno
  i4: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=1200&q=85', // cozinha/sala aberta
  i5: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=85', // cozinha gourmet
  i6: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85', // sala luxo
}

const CO = {
  co1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', // open office
  co2: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=85', // lobby corporativo
  co3: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=1200&q=85', // coworking
  co4: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&q=85', // fachada corp
  co5: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1200&q=85', // sala reunião
  co6: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=85', // planta aberta
}

const IN = {
  in1: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=85', // campus/escola
  in2: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85', // universidade
  in3: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1200&q=85', // auditório/teatro
  in4: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=85', // biblioteca
  in5: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85', // espaço educacional
}

const H = {
  h1: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=85', // hospital moderno
  h2: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=85', // corredor clínico
  h3: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=85', // recepção médica
  h4: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85', // ambiente clínico
  h5: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85', // sala médica
}

const P = {
  p1: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=85', // jardim residencial
  p2: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85', // jardim natural
  p3: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85', // jardim externo
  p4: 'https://images.unsplash.com/photo-1572382489397-3aff5f6d9c21?w=1200&q=85', // paisagismo urbano
  p5: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=85', // jardim verde
  p6: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85', // detalhe jardim
}

const RE = {
  re1: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&q=85', // reforma em andamento
  re2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85', // obra/construção
  re3: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=85', // cozinha pós-reforma
  re4: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85', // resultado residencial
  re5: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85', // sala pós-reforma
}

// ── Categorias ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Residencial',  slug: 'residencial',  order_index: 0, description: 'Casas e apartamentos de alto padrão que transformam o conceito de morar — do projeto à entrega, com cada detalhe pensado para o seu estilo de vida.' },
  { name: 'Comercial',    slug: 'comercial',    order_index: 1, description: 'Restaurantes, escritórios, lojas e clínicas que traduzem a identidade da marca em arquitetura — espaços que vendem, retêm e impressionam.' },
  { name: 'Interiores',   slug: 'interiores',   order_index: 2, description: 'Design de interiores residencial e comercial: marcenaria sob medida, paletas de materiais e iluminação projetadas para cada estilo de vida.' },
  { name: 'Corporativo',  slug: 'corporativo',  order_index: 3, description: 'Sedes empresariais, coworkings e ambientes de trabalho que impulsionam produtividade, cultura organizacional e atração de talentos.' },
  { name: 'Institucional',slug: 'institucional',order_index: 4, description: 'Escolas, universidades, centros culturais e museus projetados para inspirar, incluir e durar — arquitetura que serve à comunidade.' },
  { name: 'Hospitalar',   slug: 'hospitalar',   order_index: 5, description: 'Clínicas, consultórios e centros médicos humanizados — ambientes de saúde que transmitem cuidado, conforto e credibilidade.' },
  { name: 'Paisagismo',   slug: 'paisagismo',   order_index: 6, description: 'Jardins residenciais, corporativos e urbanos que integram natureza, sustentabilidade e experiência sensorial ao projeto.' },
  { name: 'Reformas',     slug: 'reformas',     order_index: 7, description: 'Reformas residenciais e comerciais com projeto técnico completo — modernização de plantas, instalações e acabamentos.' },
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
  // ── Residencial (3 featured → hero) ────────────────────────────────────────
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
        'O projeto de interiores foi desenvolvido em conjunto com a arquitetura: piso em porcelanato 120x120cm formato único em toda a área social, marcenaria em laca branca fosca com inserções em carvalho americano e iluminação projetada em quatro camadas independentes para cada ambiente.',
      ],
    },
    {
      title: 'Casa Minimalista — Ibiúna',
      date: '2024-02-15',
      img: R.r3,
      gallery: [R.r5, R.r8, R.r1],
      featured: true,
      content: [
        'Casa de campo de 340m² em condomínio fechado em Ibiúna. O programa é deliberadamente enxuto: sala única de 80m² integrando estar, jantar e cozinha, 3 suítes e varanda perimetral que abraça toda a construção.',
        'O conceito nasce da subtração: volume puro de concreto e madeira cumaru sem ornamentos, onde cada abertura é calculada para capturar uma vista específica da mata ao redor. Beiral de 1,8m protege do sol poente e permite janelas abertas mesmo na chuva.',
        'Internamente, apenas três materiais: cimento queimado no piso, madeira ipê nas paredes sociais e branco absoluto nos dormitórios. Marcenaria sob medida em MDF cru com poros abertos — textura que envelhece com charme e integra o caráter orgânico da casa.',
      ],
    },
    {
      title: 'Cobertura Duplex — Itaim Bibi',
      date: '2023-11-01',
      img: R.r2,
      gallery: [R.r7, R.r6, R.r8, R.r9],
      featured: true,
      content: [
        'Cobertura duplex de 420m² com terraço de 140m² no Itaim Bibi. A reforma total criou planta aberta de 110m² com pé-direito de 3,4m e visão direta para o skyline de São Paulo.',
        'Os dois pavimentos se conectam por escada monumental em aço carbono com degraus flutuantes em carvalho europeu — peça escultórica no coração do apartamento. No terraço: deck em teca, piscina aquecida e área gourmet com pérgola de aço e trepadeiras.',
        '180 pontos de luz em 11 cenas programáveis via automação KNX. Do despertar ao cinema, cada momento tem sua cena específica — temperatura de cor, intensidade e foco calibrados com consultora especializada.',
      ],
    },
    {
      title: 'Casa de Campo — Bragança Paulista',
      date: '2023-07-01',
      img: R.r4,
      gallery: [R.r10, R.r5, R.r1],
      featured: false,
      content: [
        'Casa de campo de 280m² em terreno de 3 hectares em Bragança Paulista. O projeto aproveitou a topografia acidentada para implantar a residência em platô elevado com vista de 180° para a Serra da Mantiqueira.',
        'Estrutura em concreto e aço com fechamento em vidro nas fachadas de maior insolação e madeira de reflorestamento nas fachadas de serviço. Telhado em duas águas com estrutura aparente em madeira roliça de eucalipto certificado.',
        'Varanda de 14m integra toda a fachada social à piscina natural com sistema biodinâmico e jardim produtivo de 200m². Zero pesticidas — paisagismo concebido como ecossistema autossustentável.',
      ],
    },
    {
      title: 'Apartamento Reformado — Higienópolis',
      date: '2024-06-01',
      img: R.r5,
      gallery: [R.r7, R.r6, R.r8],
      featured: false,
      content: [
        'Reforma completa de apartamento de 210m² em edifício de 1968 em Higienópolis. O desafio: modernizar a planta e instalações dentro das restrições de edifício tombado — fachada e estrutura preservadas, interior totalmente reconfigurado.',
        'Remoção de 6 paredes criou planta social aberta de 90m². As vigas de concreto aparente originais foram lixadas e tratadas com resina — tornaram-se o elemento identitário mais marcante, ao invés de serem escondidas.',
        'Paleta material que combina passado e presente: granilite original restaurado nos quartos, carvalho europeu na área social, mármore Calacata branco no banheiro principal. O projeto narra a história do imóvel sem apagar nenhum capítulo.',
      ],
    },
  ],

  // ── Comercial (3 featured → hero) ──────────────────────────────────────────
  comercial: [
    {
      title: 'Restaurante Brasa — Vila Madalena',
      date: '2024-03-01',
      img: C.c1,
      gallery: [C.c8, C.c2, C.c5],
      featured: true,
      content: [
        'Restaurante de gastronomia contemporânea com 220m² e 70 lugares em casarão de 1942 preservado na Vila Madalena. A estratégia: manter a memória do edifício histórico em contraste com intervenções contemporâneas precisas.',
        'Tijolos de demolição, vigas de madeira originais e janelas guilhotina convivem com trilho de iluminação preto, balcão em granito nero absoluto e cozinha aberta em aço inox visível de qualquer ponto do salão.',
        'Painéis de lã de PET com revestimento em linho natural reduzem o ruído de fundo sem alterar a aparência. Resultado: restaurante com 70 pessoas onde a conversa flui sem esforço — diferencial raro em espaços gastronômicos de alta rotatividade.',
      ],
    },
    {
      title: 'Sede Corporativa — Faria Lima',
      date: '2024-01-15',
      img: C.c3,
      gallery: [C.c4, C.c6, C.c9],
      featured: true,
      content: [
        'Sede de empresa de tecnologia com 1.800m² em dois andares na Avenida Faria Lima. O programa inclui 150 posições híbridas, 6 salas de reunião, cabines de foco, 2 lounges de colaboração e recepção VIP.',
        'Recepção com pé-direito de 5m, jardim vertical de 30m² e escada em aço preto. Salas de reunião com vidro e película de privacidade acionável eletronicamente. Identidade visual da empresa em elementos substituíveis — mobiliário, painéis, sinalização — nunca em paredes.',
        'Escada interna de aço com guarda-corpo em vidro conecta os andares — o fluxo de pessoas torna-se movimento vivo visível da recepção. Flexibilidade garantida para rebranding futuro sem obras.',
      ],
    },
    {
      title: 'Café Origem — Pinheiros',
      date: '2024-05-01',
      img: C.c2,
      gallery: [C.c1, C.c7, C.c8],
      featured: true,
      content: [
        'Café especialidade de 95m² em sobrado dos anos 50 em Pinheiros. Fachada com venezianas originais preservada; interior transformado em espaço onde cada centímetro serve a experiência do café — da torrefação exposta à mesa do barista como elemento central.',
        'Planta dividida em balcão performático (extrovertido) e área de mesas introspectiva com nichos de leitura. Transição marcada por estante biblioteca de piso ao teto em carvalho com abertura central.',
        'Mesas em mármore Branco Paraná com bordas irregulares naturais — cada peça única. Identidade visual desenvolvida em paralelo à arquitetura: mesmo carvalho no cardápio encadernado, mesmo verde da fachada nos elementos gráficos. Arquitetura e marca como obra única.',
      ],
    },
    {
      title: 'Boutique Atelier — Oscar Freire',
      date: '2023-09-01',
      img: C.c7,
      gallery: [C.c5, C.c1, C.c8],
      featured: false,
      content: [
        'Loja de moda autoral com 160m² na Rua Oscar Freire. Cada ambiente projetado como cenografia dos produtos, sem competir com eles.',
        'Fachada em travertino romano com portal em aço corten recortado a laser. Interior em três zonas: vitrine espectral, salão com araras em aço preto e dois provadores VIP em veludo esmeralda.',
        'IRC acima de 97 em todos os focos — roupas parecem exatamente como na luz natural do dia. Todo o mobiliário é desmontável e reconfigurável a cada estação sem obra.',
      ],
    },
    {
      title: 'Clínica Renova — Itaim Bibi',
      date: '2023-12-01',
      img: C.c9,
      gallery: [C.c6, C.c3, C.c4],
      featured: false,
      content: [
        'Clínica de medicina estética com 8 consultórios, sala de espera VIP e 2 salas de procedimentos em 560m² no Itaim Bibi. Conceito: humanização do ambiente clínico — sofisticação sem remeter a hospital.',
        'Paleta em verde sálvia, nude e branco com madeira ripada em tauarí, mármore Bianco carrara e verde natural nas esperas. Iluminação circadiana de 4500K a 2700K ao longo do dia.',
        'Cada consultório tem janela para jardim interno. Sistema de orientação visual nos corredores elimina perguntas ao staff, reduz carga da recepção e a ansiedade dos pacientes.',
      ],
    },
  ],

  // ── Interiores (sem featured) ───────────────────────────────────────────────
  interiores: [
    {
      title: 'Living Biofílico — Moema',
      date: '2024-03-15',
      img: I.i1,
      gallery: [I.i2, I.i4, R.r7],
      featured: false,
      content: [
        'Projeto de interiores para sala de estar de 55m² em apartamento de alto padrão em Moema. O conceito biofílico integrou natureza ao espaço construído de forma ativa — jardim interno de 4m² com espécies tropicais como elemento central da composição, não decorativo.',
        'Piso em porcelanato imitação cimento com juntas irregulares artesanais. Sofá modular em linho natural, mesas de centro em mármore travertino e luminária pendente em rattan. Paleta terrosa e orgânica que envelhece com charme e não exige atualização frequente.',
        'Iluminação em três camadas: geral rebatida no teto, direta com spots sobre obras e pontuações de baixa altura nos móveis. Cada camada tem dimmer independente — o mesmo espaço serve ao almoço familiar, ao trabalho e ao jantar íntimo.',
      ],
    },
    {
      title: 'Cozinha Gourmet Integrada — Vila Nova',
      date: '2024-06-01',
      img: I.i5,
      gallery: [I.i4, I.i2, R.r6],
      featured: false,
      content: [
        'Cozinha gourmet de 38m² integrada à sala de jantar em apartamento de 200m² em Vila Nova Conceição. Ilha central em granito nero absoluto de 3,2m com 6 lugares. Armários em laca branca fosca com puxadores embutidos em alumínio escovado.',
        'Eletrodomésticos de embutir formam parede técnica de 4m em aço inox. Adega climatizada para 100 garrafas integrada à marcenaria e visível através de porta de vidro — showpiece intencional.',
        'Iluminação em três camadas: trilho de spots sobre a ilha, faixa LED dentro dos armários altos e pendentes artesanais em cobre sobre as cadeiras. Cada zona acende independentemente conforme o uso — cozinhar, servir ou receber.',
      ],
    },
    {
      title: 'Suíte Master Boutique — Higienópolis',
      date: '2023-10-01',
      img: I.i3,
      gallery: [I.i6, R.r8, I.i1],
      featured: false,
      content: [
        'Suíte master de 42m² concebida com referência em hotéis boutique europeus. Painel de cabeceira em tecido de linho texturizado de 3,2m de largura com iluminação indireta perimetral e nichos embutidos.',
        'Closet em L de 14m² com sistema de organização modular, espelhos de corpo inteiro e iluminação com sensor de presença. Banheiro com banheira de imersão freestanding em acrílico e chuveiro de coluna com 8 jatos.',
        'Automação integrada ao quarto: cortinas motorizadas com abertura programada, iluminação por cenas e climatização com ajuste automático de temperatura ao longo da noite. Experiência de hotel em residência permanente.',
      ],
    },
  ],

  // ── Corporativo (sem featured) ──────────────────────────────────────────────
  corporativo: [
    {
      title: 'HQ Nexum — Vila Olímpia',
      date: '2024-02-01',
      img: CO.co1,
      gallery: [CO.co6, CO.co5, CO.co3],
      featured: false,
      content: [
        'Sede de fintech em crescimento com 2.400m² em três andares na Vila Olímpia. Programa baseado em análise etnográfica: 55% trabalho concentrado, 30% colaboração informal, 15% reuniões formais. Resultado: 120 posições fixas, 60 hot desk, 12 cabines de foco e 3 lounges de diferentes intensidades.',
        'Transparência como valor arquitetônico: salas de reunião em vidro com película de privacidade acionável eletricamente. Escadas internas em aço com espelho d\'água sob o lance térreo — o fluxo de pessoas torna-se movimento vivo entre os andares.',
        'Identidade visual integrada de forma sistêmica: paleta da empresa em mobiliário, painéis acústicos e sinalização, nunca em paredes — flexibilidade garantida para mudanças de marca sem obras futuras.',
      ],
    },
    {
      title: 'Escritório Jurídico Monteiro & Ramos',
      date: '2023-06-01',
      img: CO.co2,
      gallery: [CO.co5, CO.co4, CO.co1],
      featured: false,
      content: [
        'Sede de escritório de advocacia com 920m² no Centro Expandido. O projeto transmite autoridade e tradição sem parecer antiquado para clientes mais jovens — equilíbrio delicado que define cada decisão material.',
        'Biblioteca jurídica octogonal com prateleiras de piso ao teto em carvalho americano, escada deslizante e mesa oval em mármore Verde Ubatuba para 12 lugares. Esse ambiente híbrido entre sala de reunião e acervo é o cartão de visitas mais forte do escritório.',
        'Área de colaboração em contraste deliberado com os escritórios privados: pé-direito duplo, sofás em linho, mesa de ping-pong. A tensão entre formal e informal é a chave — competência técnica nos acabamentos, modernidade no conjunto espacial.',
      ],
    },
    {
      title: 'Campus Digital Meridian — ABC',
      date: '2024-01-01',
      img: CO.co3,
      gallery: [CO.co6, CO.co2, CO.co4],
      featured: false,
      content: [
        'Complexo corporativo de 8.500m² para 600 colaboradores de empresa de software no ABC Paulista. Três edifícios interligados: administrativo, hub de inovação e infraestrutura de apoio.',
        'Masterplan com parque linear de 2.800m² entre os edifícios: mesas ao ar livre, jardins de permanência, quadra poliesportiva e anfiteatro externo para 150 pessoas. Espaço externo como extensão real do trabalho.',
        'Hub de inovação com estrutura em aço exposto, vão livre de 6m no térreo e mezanino suspenso por rampa helicoidal. Volume projetado para ser transformável: mezanino removível, novos pavimentos adicionáveis sem obra estrutural.',
      ],
    },
  ],

  // ── Institucional (sem featured) ────────────────────────────────────────────
  institucional: [
    {
      title: 'Centro Cultural Raízes — Santo André',
      date: '2024-02-01',
      img: IN.in1,
      gallery: [IN.in3, IN.in4, IN.in2],
      featured: false,
      content: [
        'Equipamento público de 3.200m² com teatro de 250 lugares, escola de música, ateliê de artes, biblioteca comunitária, espaço maker e praça coberta multiuso. Catalisador de vida pública na região.',
        'Partido arquitetônico de edifício aberto: praça coberta sem grades ou portões, acessível 24 horas, funciona como extensão da calçada. Onde acontece a maioria das atividades espontâneas que definem a vida do lugar.',
        'Cobertura verde de 800m², captação de águas pluviais e painel fotovoltaico de 120kWp garantindo 40% da energia do complexo. Certificação AQUA-HQE com classificação Superior em todas as categorias.',
      ],
    },
    {
      title: 'Escola Municipal Horizonte — Guarulhos',
      date: '2023-08-01',
      img: IN.in2,
      gallery: [IN.in5, IN.in1, IN.in4],
      featured: false,
      content: [
        'Escola municipal para 900 alunos em período integral com 24 salas de aula, laboratórios, biblioteca, quadra coberta e refeitório. Edifício de dois pavimentos em topografia acentuada, ambos com acesso direto ao exterior ao nível do chão.',
        'Ventilação cruzada com brises de madeira no norte, janelas altas ao sul sem ofuscamento. Acústica com RT60 abaixo de 0,6s em todas as salas — parâmetro de compreensão de fala raramente atingido em escolas públicas.',
        'Pátio pedagógico: piso com mapas e jogos matemáticos pintados, horta vertical no refeitório, captação de chuva com medidores visíveis como objeto de aula. A escola projetada como instrumento de aprendizagem além das quatro paredes.',
      ],
    },
    {
      title: 'Museu Municipal de Arte — Mauá',
      date: '2024-06-01',
      img: IN.in3,
      gallery: [IN.in4, IN.in1, IN.in5],
      featured: false,
      content: [
        'Conversão de fábrica têxtil dos anos 40 em museu municipal para Mauá. Edifício de 4.500m² em tijolo maciço tombado — intervenção dentro das restrições do tombamento estadual, preservando fachada e volumetria original.',
        'Nova estrutura metálica autônoma em aço galvanizado inserida dentro da casca histórica sem tocar nas paredes. O espaço entre a nova estrutura e as paredes antigas cria circulações que revelam a espessura e textura da alvenaria.',
        'Praça externa de 2.800m² com escultura pública, espelho d\'água e iluminação que transforma as fachadas em tela de projeção para eventos. 48.000 visitantes no primeiro ano — equipamento cultural mais frequentado do município.',
      ],
    },
  ],

  // ── Hospitalar (sem featured) ───────────────────────────────────────────────
  hospitalar: [
    {
      title: 'Hospital Dia Renascer — Oncologia',
      date: '2024-01-15',
      img: H.h1,
      gallery: [H.h3, H.h4, H.h2],
      featured: false,
      content: [
        'Centro de tratamento oncológico de 3.400m² com humanização radical do ambiente de saúde. O cliente partiu da premissa de que o ambiente físico é variável terapêutica, não apenas container para procedimentos.',
        'Recepção com pé-direito de 5m, jardim vertical de 40m², luz natural zenital, sofás em tecido natural e música com curadoria de musicoterapia. 94% dos pacientes relatam redução percebida de ansiedade antes do atendimento.',
        'Suítes de quimioterapia com cadeiras reclináveis, televisão por demanda, vista para jardim e iluminação circadiana nas sessões de 4 a 6 horas. Primeira certificação WELL Building Standard Gold em saúde no estado de São Paulo.',
      ],
    },
    {
      title: 'Clínica Integrada Saúde+ — Campinas',
      date: '2023-11-01',
      img: H.h3,
      gallery: [H.h4, H.h2, H.h5],
      featured: false,
      content: [
        'Clínica multiespecialidade de 1.800m² com 20 consultórios, centro cirúrgico com 3 salas, UTI de 8 leitos e área de diagnóstico por imagem. Projeto técnico conforme RDC 50 da ANVISA e NBR 7256.',
        'Layout em fluxo zonal com antecâmaras de pressurização diferencial entre zonas — sem portas ou grades que criam obstáculos operacionais. Centro cirúrgico com salas de assepsia ISO 5 e iluminação cirúrgica de 100.000 lux no campo operatório.',
        'Cada consultório tem janela para área verde interna. Sistema de orientação visual elimina perguntas ao staff. Chamada por senha com painel em tempo real reduz a ansiedade da espera. Detalhes de baixo custo e alto impacto na percepção de qualidade.',
      ],
    },
    {
      title: 'Maternidade Família Luz — São Paulo',
      date: '2024-05-01',
      img: H.h2,
      gallery: [H.h5, H.h1, H.h4],
      featured: false,
      content: [
        'Maternidade de médio porte com 60 leitos e 20 suítes PPP (pré-parto, parto e pós-parto). Toda a jornada do nascimento em um único ambiente — modelo nórdico aplicado pela primeira vez em escala no Brasil.',
        'Suítes com banheira de parturição, poltrona familiar, berço aquecido integrado, iluminação de 100% regulável (ambiente íntimo a clínico em segundos) e piso aquecido. Suporte estrutural para barra de parede invisível no acabamento.',
        'UTI Neonatal com boxes semi-privativos, poltrona para kangaroo care 24h e acesso à internet para os pais — presença constante da família como fator terapêutico comprovado pela literatura científica.',
      ],
    },
  ],

  // ── Paisagismo (sem featured) ───────────────────────────────────────────────
  paisagismo: [
    {
      title: 'Jardim Suspenso — Pinheiros',
      date: '2024-03-01',
      img: P.p1,
      gallery: [P.p2, P.p5, P.p3],
      featured: false,
      content: [
        'Projeto para terraço de 180m² em cobertura residencial em Pinheiros. Jardim de alto impacto em substrato raso de 30cm — limitação estrutural da laje transformada em premissa de projeto que definiu toda a seleção de espécies.',
        '47 espécies de gramíneas ornamentais, suculentas, cactáceas e bromeliáceas em três camadas: cobertura rasteira de grama amendoim, maciços de bromélias e agaves, e cactus colunar como esculturas verticais.',
        'Irrigação por gotejamento subsuperficial com controlador climático — ajuste automático baseado em temperatura, umidade e previsão de chuva. Consumo 70% menor que aspersão convencional. Iluminação noturna em baixa voltagem com espetos direcionais que valorizam texturas vegetais.',
      ],
    },
    {
      title: 'Parque Corporativo Estrela — ABC',
      date: '2023-10-01',
      img: P.p4,
      gallery: [P.p2, P.p6, P.p1],
      featured: false,
      content: [
        'Paisagismo para campus empresarial de 15.000m² de área verde no ABC Paulista. Programa: conectar quatro edifícios por verde, gerenciar escoamento pluvial de 40.000m² impermeabilizados e criar espaços de qualidade para 1.800 colaboradores.',
        'Parque produtivo: biovaletas gramadas captam e filtram água da chuva, arborização na fachada oeste reduz carga térmica dos edifícios, jardins de retenção amortecem chuvas intensas. Cada elemento vegetado tem função técnica além da estética.',
        '85% das espécies são nativas da Mata Atlântica. Anfiteatro externo para 300 pessoas — gramado escalonado, palco em concreto e iluminação no piso. Paisagismo como infraestrutura social.',
      ],
    },
    {
      title: 'Jardim de Chuva — Morumbi',
      date: '2024-01-15',
      img: P.p2,
      gallery: [P.p5, P.p3, P.p4],
      featured: false,
      content: [
        'Paisagismo sustentável para residência de 600m² no Morumbi, com ênfase em manejo hídrico. A propriedade sofria com alagamento recorrente em chuvas intensas — resolvido sem nenhuma infraestrutura de drenagem convencional.',
        'Seis jardins de chuva deprimidos com espécies higrófilas captam e infiltram toda a água das coberturas. Capacidade calculada para 100mm em 1 hora. Desde a inauguração, zero alagamentos.',
        'Piscina natural de 40m² sem cloro — purificada por jardim aquático com macrófitas. Peixes, anfíbios e aves retornaram em menos de seis meses. Custo de manutenção 60% menor que piscina convencional de mesmo porte.',
      ],
    },
  ],

  // ── Reformas (sem featured) ─────────────────────────────────────────────────
  reformas: [
    {
      title: 'Retrofit Integral — Apto Anos 80',
      date: '2024-01-01',
      img: RE.re1,
      gallery: [RE.re5, RE.re3, RE.re4],
      featured: false,
      content: [
        'Reforma completa de apartamento de 95m² construído nos anos 80 em edifício tombado. Modernizar planta e instalações preservando as restrições da fachada histórica — o desafio técnico definiu cada decisão do projeto.',
        'Remoção de 3 paredes para planta aberta. Substituição completa de instalações hidráulicas e elétricas. Resultado: estética contemporânea preservando o charme original do edifício — sem perda de identidade, sem compromisso funcional.',
        'Acabamentos escolhidos para contrastar intencionalmente com o período original: porcelanato 120x120cm substituiu granito, laca branca substituiu madeira laqueada dos anos 80. A reforma é legível — você sabe onde está a camada nova.',
      ],
    },
    {
      title: 'Reforma Banheiro Master — Alto de Pinheiros',
      date: '2023-08-01',
      img: RE.re3,
      gallery: [RE.re5, RE.re1, RE.re4],
      featured: false,
      content: [
        'Reforma de banheiro master de 16m² com troca completa de revestimentos, louças e metais. Projeto com ducha de corpo, banheira de imersão freestanding, dupla bancada e nicho de mármore empena a empena.',
        'Mármore Calacata piso a teto nas paredes e no piso. Sistema de aquecimento elétrico radiante sob o piso — ativado automaticamente 30 minutos antes do horário programado. Torneiras e chuveiros em bronze envelhecido.',
        'Iluminação em três regimes: funcional para banho (500 lux), relaxamento (150 lux, 2700K) e limpeza (600 lux, 5000K). Cada regime acionado por um único toque no painel touchscreen ao lado da entrada.',
      ],
    },
    {
      title: 'Retrofit Comercial — Escritório de Advocacia',
      date: '2023-05-01',
      img: RE.re2,
      gallery: [RE.re4, RE.re3, RE.re5],
      featured: false,
      content: [
        'Retrofit de escritório de advocacia de 350m² em imóvel dos anos 70 no Centro Histórico de São Paulo. Piso original em granilite restaurado — elemento de memória que ancora a identidade do projeto reformado.',
        'Salas de reunião com piso elevado técnico para distribuição de dados. Painéis de madeira cumaru desmontáveis permitem reconfiguração futura sem obras — investimento que protege o cliente de custos futuros.',
        'Toda a infraestrutura elétrica e de dados foi substituída por sistema de 10A sem elevar o custo da reforma acima de 15% do orçamento total. Resultado: escritório com aparência de edifício novo e instalações modernas dentro de um imóvel histórico.',
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

  // ── 1. Limpa dados existentes ─────────────────────────────────────────────
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
    console.log('  ✓ Projetos deletados')

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
      console.warn(`  ⚠ Categoria "${catSlug}" não no mapa, pulando.`)
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

    const f = rows.filter((r) => r.is_featured).length
    console.log(`  ✓ [${catSlug}] ${rows.length} projetos${f > 0 ? ` (${f} em destaque)` : ''}`)
    totalInserted += rows.length
  }

  console.log(`\n✓ Concluído. ${totalInserted} projetos em ${insertedCats.length} categorias.`)
  console.log('  Hero: 3 residencial + 3 comercial (6 destaques).')
}

main().catch(console.error)
