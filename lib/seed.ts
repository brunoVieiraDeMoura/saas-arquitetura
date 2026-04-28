import type { SupabaseClient } from '@supabase/supabase-js'

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function tiptap(text: string) {
  return {
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text }] }
    ]
  }
}

const RESIDENTIAL_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=900&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80',
]

const COMMERCIAL_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=900&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
]

const GALLERY_EXTRA = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80',
  'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80',
]

const RESIDENTIAL_PROJECTS = [
  {
    title: 'Residência Serra',
    desc: 'Projeto residencial integrado com a natureza, explorando volumes clean e materiais naturais como madeira e pedra. O programa de necessidades contemplou 4 suítes, living amplo e área gourmet integrada.',
  },
  {
    title: 'Apartamento Jardins',
    desc: 'Reforma completa de apartamento de 120m² com foco em integração de ambientes e aproveitamento máximo da luz natural. Paleta neutras com toques em verde e terracota.',
  },
  {
    title: 'Casa Contemporânea',
    desc: 'Residência de alto padrão com programa de 380m², três pavimentos e piscina de borda infinita. Conceito minimalista com grandes planos de vidro e concreto aparente.',
  },
]

const COMMERCIAL_PROJECTS = [
  {
    title: 'Escritório Corporativo',
    desc: 'Projeto de 800m² para empresa de tecnologia. Layout open space com zonas de concentração, colaboração e descompressão. Acústica planejada e iluminação biofílica integrada ao teto.',
  },
  {
    title: 'Restaurante Moderno',
    desc: 'Restaurante de 300m² com conceito industrial refinado. Pé-direito duplo, tijolos à vista, iluminação pendente em cobre e mobiliário sob medida em MDF lacado e metal.',
  },
  {
    title: 'Clínica Médica',
    desc: 'Projeto de clínica multiespecialidade com 12 consultórios, recepção ampla e circulação setorizada. Foco em humanização do ambiente clínico com paleta suave e muito verde.',
  },
]

export async function seedTenant(
  admin: SupabaseClient,
  tenantId: string,
  officeName: string
) {
  const ARCH_SUFFIXES = new Set(['arquitetura', 'arquiteto', 'arquitetos', 'design', 'studio', 'estudio', 'estúdio', 'interiores', 'urbanismo'])
  const nameParts = officeName.trim().split(/\s+/)
  const lastLower = nameParts[nameParts.length - 1].toLowerCase()
  const logoName = (ARCH_SUFFIXES.has(lastLower) && nameParts.length > 1)
    ? nameParts.slice(0, -1).join(' ')
    : officeName.trim()
  const logoSubname = 'Arquitetura'

  // ── Settings ─────────────────────────────────────────────────────────────────
  const settings = [
    { key: 'company_name',       value: officeName },
    { key: 'logo_type',          value: 'text' },
    { key: 'logo_name',          value: logoName },
    { key: 'logo_subname',       value: logoSubname },
    { key: 'logo_subname_align', value: 'end' },
    { key: 'logo_font',          value: '' },
    { key: 'logo_image_url',     value: '' },
    { key: 'whatsapp_number',    value: '5511999999999' },
    { key: 'whatsapp_message',   value: `Olá! Gostaria de saber mais sobre os projetos de ${officeName}.` },
    { key: 'instagram_path',     value: slugify(officeName) },
  ]
  await admin.from('settings').insert(settings.map(s => ({ ...s, tenant_id: tenantId })))

  // ── Categories ────────────────────────────────────────────────────────────────
  const { data: cats } = await admin.from('categories').insert([
    {
      tenant_id: tenantId,
      name: 'Residencial',
      slug: 'residencial',
      description: 'Projetos residenciais — casas, apartamentos e coberturas que transformam o conceito de morar.',
      order_index: 0,
    },
    {
      tenant_id: tenantId,
      name: 'Comercial',
      slug: 'comercial',
      description: 'Espaços comerciais que comunicam a identidade da marca e potencializam resultados.',
      order_index: 1,
    },
  ]).select('id, slug')

  if (!cats || cats.length < 2) return

  const [residencial, comercial] = cats

  // ── Projects ──────────────────────────────────────────────────────────────────
  const baseYear = 2023
  const residentialRows = RESIDENTIAL_PROJECTS.map((p, i) => ({
    tenant_id:   tenantId,
    category_id: residencial.id,
    title:       p.title,
    slug:        slugify(p.title),
    date:        `${baseYear + Math.floor(i / 2)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
    main_image:  RESIDENTIAL_IMAGES[i],
    gallery:     [GALLERY_EXTRA[i % 3], RESIDENTIAL_IMAGES[(i + 1) % 5]],
    content:     tiptap(p.desc),
    is_featured: i < 2,
  }))

  const commercialRows = COMMERCIAL_PROJECTS.map((p, i) => ({
    tenant_id:   tenantId,
    category_id: comercial.id,
    title:       p.title,
    slug:        slugify(p.title),
    date:        `${baseYear + Math.floor(i / 2)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    main_image:  COMMERCIAL_IMAGES[i],
    gallery:     [GALLERY_EXTRA[(i + 1) % 3], COMMERCIAL_IMAGES[(i + 1) % 5]],
    content:     tiptap(p.desc),
    is_featured: i < 1,
  }))

  await admin.from('projects').insert([...residentialRows, ...commercialRows])

  // ── Testimonials ──────────────────────────────────────────────────────────────
  await admin.from('testimonials').insert([
    { tenant_id: tenantId, author: 'Mariana Costa',  role: 'Cliente residencial',       avatar: 'https://i.pravatar.cc/150?img=44', content: `A ${officeName} transformou completamente nossa casa. O projeto superou todas as expectativas, com atenção aos mínimos detalhes e total respeito ao nosso estilo de vida.` },
    { tenant_id: tenantId, author: 'Rafael Mendes',  role: 'Cliente comercial',          avatar: 'https://i.pravatar.cc/150?img=12', content: `Contratamos a ${officeName} para o nosso escritório e o resultado foi incrível. Produtividade aumentou, a equipe adorou o espaço e os clientes sempre elogiam.` },
    { tenant_id: tenantId, author: 'Juliana Alves',  role: 'Cliente residencial',        avatar: 'https://i.pravatar.cc/150?img=20', content: 'Profissionais excepcionais. Do conceito à entrega, cada etapa foi conduzida com clareza e criatividade. Nosso apartamento ficou exatamente como sonhamos.' },
    { tenant_id: tenantId, author: 'Carlos Ribeiro', role: 'Proprietário de restaurante', avatar: 'https://i.pravatar.cc/150?img=33', content: 'O espaço que criaram para o nosso restaurante virou ponto de referência na cidade. As pessoas vêm pela comida e ficam encantadas com o ambiente.' },
    { tenant_id: tenantId, author: 'Fernanda Lima',  role: 'Cliente residencial',        avatar: 'https://i.pravatar.cc/150?img=48', content: `Trabalhar com a ${officeName} foi uma experiência incrível do início ao fim. Comunicação impecável, prazos cumpridos e um resultado que nos deixa orgulhosos todo dia.` },
    { tenant_id: tenantId, author: 'André Santos',   role: 'Diretor comercial',          avatar: 'https://i.pravatar.cc/150?img=60', content: 'Nossa nova sede foi projetada com maestria. O equilíbrio entre funcionalidade e estética criou um ambiente que reflete perfeitamente os valores da nossa empresa.' },
  ])

  // ── FAQs ──────────────────────────────────────────────────────────────────────
  await admin.from('faqs').insert([
    { tenant_id: tenantId, question: 'Qual é o prazo médio de um projeto?', answer: 'O prazo varia conforme a complexidade e o tamanho do projeto. Em média, projetos residenciais levam de 30 a 90 dias para a fase de desenvolvimento, enquanto obras podem durar de 4 a 18 meses dependendo da extensão.', order_index: 0 },
    { tenant_id: tenantId, question: 'Como funciona o processo de contratação?', answer: 'Começamos com uma reunião inicial gratuita para entender suas necessidades e apresentar nossa metodologia. Em seguida, elaboramos uma proposta personalizada com escopo, prazo e investimento detalhados.', order_index: 1 },
    { tenant_id: tenantId, question: 'Vocês acompanham a execução da obra?', answer: 'Sim! Oferecemos o serviço de administração e acompanhamento de obra, garantindo que o projeto seja executado fielmente ao que foi planejado, com visitas técnicas periódicas e relatórios de progresso.', order_index: 2 },
    { tenant_id: tenantId, question: 'O projeto inclui especificação de materiais e mobiliário?', answer: 'Sim, nossos projetos completos incluem memorial descritivo com especificação de todos os materiais, acabamentos e mobiliário, com indicação de fornecedores e alternativas por faixa de preço.', order_index: 3 },
    { tenant_id: tenantId, question: 'Vocês atendem em todo o Brasil?', answer: 'Atendemos presencialmente na região de atuação do escritório e realizamos projetos remotos para todo o Brasil, com visitas técnicas pontuais programadas conforme necessidade de cada etapa.', order_index: 4 },
  ])
}
