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

// ── Images por categoria ──────────────────────────────────────────────────────
const IMGS = {
  comercial: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=900&q=80',
    'https://images.unsplash.com/photo-1600494448853-8d3e5b43ceee?w=900&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80',
  ],
  corporativo: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=900&q=80',
    'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=900&q=80',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=900&q=80',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=900&q=80',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=900&q=80',
  ],
  interiores: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80',
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=900&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
  ],
  paisagismo: [
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80',
    'https://images.unsplash.com/photo-1572382489397-3aff5f6d9c21?w=900&q=80',
    'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=900&q=80',
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=900&q=80',
  ],
  institucional: [
    'https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80',
    'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=900&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=900&q=80',
    'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=900&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80',
  ],
  hospitalar: [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80',
    'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=900&q=80',
  ],
  industrial: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80',
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&q=80',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=900&q=80',
    'https://images.unsplash.com/photo-1567942712661-82b9b407abbf?w=900&q=80',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=900&q=80',
    'https://images.unsplash.com/photo-1558618047-f2a56e8b7de8?w=900&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80',
  ],
}

// ── Definição das categorias ──────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Comercial',     slug: 'comercial',     description: 'Projetos de varejo, restaurantes, bares e espaços de consumo que traduzem a identidade da marca em arquitetura.', order_index: 0 },
  { name: 'Corporativo',   slug: 'corporativo',   description: 'Sedes empresariais, escritórios e ambientes de trabalho que impulsionam produtividade e cultura organizacional.', order_index: 1 },
  { name: 'Interiores',    slug: 'interiores',    description: 'Design de interiores residencial e comercial com foco em funcionalidade, conforto e identidade visual.', order_index: 2 },
  { name: 'Paisagismo',    slug: 'paisagismo',    description: 'Projetos de paisagismo urbano e residencial que integram natureza, sustentabilidade e experiência sensorial.', order_index: 3 },
  { name: 'Institucional', slug: 'institucional', description: 'Escolas, universidades, museus e centros culturais projetados para promover conhecimento, inclusão e cultura.', order_index: 4 },
  { name: 'Hospitalar',    slug: 'hospitalar',    description: 'Ambientes de saúde que humanizam o cuidado — clínicas, hospitais e centros médicos com foco em bem-estar e eficiência.', order_index: 5 },
  { name: 'Industrial',    slug: 'industrial',    description: 'Fábricas, galpões logísticos e plantas industriais com arquitetura técnica, segurança operacional e sustentabilidade.', order_index: 6 },
]

// ── Projetos por categoria ────────────────────────────────────────────────────
type ProjectDef = {
  title: string
  date: string
  img: string
  gallery: string[]
  featured: boolean
  content: string[]
}

const PROJECTS: Record<string, ProjectDef[]> = {
  comercial: [
    {
      title: 'Restaurante Ora — Vila Madalena',
      date: '2024-03-01',
      img: IMGS.comercial[0],
      gallery: [IMGS.comercial[1], IMGS.comercial[2], IMGS.comercial[3]],
      featured: true,
      content: [
        'O Restaurante Ora ocupa um casarão histórico de 1940 na Vila Madalena, com 340m² distribuídos em dois pavimentos. O programa inclui salão principal para 80 lugares, bar de coquetéis, área de degustação privativa e cozinha aberta — elemento que se torna espetáculo visual para os comensais.',
        'O partido arquitetônico preservou a estrutura original de tijolos aparentes e vigas de madeira, contrastando-a com intervenções contemporâneas em aço preto e vidro temperado. A escada metálica suspensa que conecta os pavimentos funciona como escultura central do espaço.',
        'A iluminação foi projetada em quatro camadas independentes, permitindo atmosferas distintas para o almoço de negócios, o jantar romântico e os eventos de fim de semana. Pendentes em cobre artesanal, trilhos direcionáveis e fitas LED embutidas em nichos de mármore criam profundidade e drama sem excessos.',
        'A acústica recebeu atenção especial: painéis de lã de PET reciclado revestidos em tecido natural reduzem o ruído de fundo sem comprometer a estética. O resultado é um espaço onde a conversa flui naturalmente mesmo com a casa cheia, algo raro em projetos gastronômicos de alto movimento.',
      ],
    },
    {
      title: 'Boutique Alma — Jardins',
      date: '2023-11-01',
      img: IMGS.comercial[1],
      gallery: [IMGS.comercial[2], IMGS.comercial[4], IMGS.comercial[0]],
      featured: true,
      content: [
        'A Boutique Alma ocupa 280m² em um dos trechos mais nobres da rua Oscar Freire, no bairro Jardins. O projeto transformou uma loja convencional em um ambiente de moda que propõe uma experiência de compra imersiva, onde cada detalhe arquitetônico serve de moldura para as peças expostas.',
        'O volume externo foi revestido com painéis de travertino romano escovado, criando uma fachada que dialoga com o gabarito histórico da rua sem ser historicista. A entrada é marcada por um portal de aço corten recortado a laser com padrão botânico — elemento de identidade que se repete internamente em diferentes materiais.',
        'O interior foi organizado em três zonas: vitrine performática com iluminação espectral, salão principal com araras suspensas em aço preto e provador VIP com espelhos de corpo inteiro em veludo esmeralda. A iluminação foi calibrada para renderização de cores excepcional — IRC acima de 97 em todos os focos sobre produtos.',
        'O projeto de marcenaria utilizou apenas duas madeiras — nogueira americana para as superfícies de exposição e carvalho cru para o mobiliário de apoio —, garantindo coesão visual sem monotonia. Todo o mobiliário é assinado e desmontável, permitindo reconfigurações sazonais sem obras.',
      ],
    },
    {
      title: 'Bar Volta — Pinheiros',
      date: '2024-01-15',
      img: IMGS.comercial[2],
      gallery: [IMGS.comercial[3], IMGS.comercial[5], IMGS.comercial[1]],
      featured: false,
      content: [
        'O Bar Volta foi concebido para um espaço de 190m² em uma galeria comercial dos anos 60 em Pinheiros. O desafio central era criar uma identidade forte dentro de um container arquitetônico genérico, transformando limitações estruturais em elementos narrativos do projeto.',
        'O pé-direito de 4,2m foi explorado com uma instalação de tubulações de cobre expostas que percorrem todo o teto — uma homenagem ao processo de destilação que inspira o conceito da casa. As tubulações são funcionais: conduzem o sistema de climatização e iluminação, unindo estética e técnica de forma indissociável.',
        'O balcão do bar mede 9,5 metros de comprimento em granito preto absoluto com raio de aresta de 50mm. A parede de adega exposta atrás do bar acomoda 400 rótulos e foi projetada como elemento cenográfico principal, visível de qualquer ponto do salão e iluminada por fitas LED de 2700K.',
        'O projeto acústico foi desenvolvido em parceria com engenheiro especializado. Painéis de madeira perfurada com absorvedores de poliuretano nas laterais e teto eliminam o eco característico de espaços com paredes de concreto, criando uma experiência sonora que valoriza tanto a música ao vivo quanto a conversa.',
      ],
    },
    {
      title: 'Mercado Fino — Itaim Bibi',
      date: '2023-08-01',
      img: IMGS.comercial[3],
      gallery: [IMGS.comercial[4], IMGS.comercial[6], IMGS.comercial[2]],
      featured: false,
      content: [
        'O Mercado Fino é um empório gourmet de 520m² projetado para redefinir a experiência de compra de alimentos premium no Itaim Bibi. O programa integra mercearia selecionada, padaria artesanal, açougue de cortes especiais, adega climatizada e café com 24 lugares — tudo em fluxo contínuo e sem barreiras visuais.',
        'O conceito espacial foi inspirado nos mercados públicos europeus: circulação central generosa de 2,5m com gôndolas baixas que preservam a visibilidade total do espaço. O piso em granilite reconstituído com incrustações de latão demarca os diferentes setores sem usar divisórias físicas.',
        'Cada setor recebeu tratamento material específico: a padaria é envolta por azulejo hidráulico artesanal em tom terracota; o açougue tem revestimento em aço inox texturizado; a adega foi isolada em câmara de vidro temperado com sistema de climatização dedicado. A coerência visual é mantida pela paleta unificada de verde musgo, madeira carvalho e latão envelhecido.',
        'A iluminação do Mercado Fino foi um dos aspectos mais trabalhados do projeto. Na padaria, spots focais de 3000K valorizam a cor e textura dos pães. Na adega, 2700K criam atmosfera de cave. Nas gôndolas, iluminação rasante 4000K destaca rótulos e embalagens. Um sistema DALI permite programar diferentes perfis ao longo do dia, da manhã de abertura ao fechamento noturno.',
      ],
    },
    {
      title: 'Café Bruma — Santa Cecília',
      date: '2024-05-01',
      img: IMGS.comercial[4],
      gallery: [IMGS.comercial[0], IMGS.comercial[5], IMGS.comercial[3]],
      featured: true,
      content: [
        'O Café Bruma foi projetado em apenas 85m² de planta — dimensão que exigiu rigor máximo em cada centímetro de decisão espacial. Localizado em um sobrado dos anos 50 em Santa Cecília, o projeto manteve a fachada original com venezianas de madeira e integrou ao interior um vocabulário contemporâneo limpo e coeso.',
        'A planta foi organizada em dois momentos distintos: o balcão de atendimento, dinâmico e extrovertido, e a área de mesas, introspectiva e acolhedora. A transição entre essas zonas é marcada por uma estante de piso a teto em carvalho com abertura central — elemento que filtra o ruído visual sem bloquear a conexão entre os espaços.',
        'O mobiliário foi desenhado exclusivamente para o projeto, produzido por marcenaria local. As mesas têm tampos em mármore Branco Paraná de 30mm com arestas naturais irregulares — cada peça única. As cadeiras em madeira maciça com assento em couro natural vegetal foram desenvolvidas em duas variações de altura para acomodar diferentes perfis de uso ao longo do dia.',
        'O projeto de identidade visual foi desenvolvido em paralelo à arquitetura, com total coerência entre o espaço construído e os elementos de comunicação. O mesmo carvalho das estantes aparece no cardápio encadernado. O tom de verde da fachada retorna nos elementos gráficos. Arquitetura e marca foram projetadas como uma obra única desde o primeiro esboço.',
      ],
    },
    {
      title: 'Galeria de Arte Contemporânea — Consolação',
      date: '2023-06-01',
      img: IMGS.comercial[5],
      gallery: [IMGS.comercial[6], IMGS.comercial[7], IMGS.comercial[0]],
      featured: false,
      content: [
        'A Galeria ocupa dois andares de um edifício modernista dos anos 70 na Consolação, totalizando 680m² de área expositiva. O desafio do projeto era transformar uma planta com pilares irregulares e divisórias estruturais em um espaço de exposição fluido, capaz de acomodar instalações de grande escala e mostras de obras sobre papel.',
        'O primeiro pavimento foi tratado como espaço totalmente livre: remoção de todas as divisórias não estruturais, piso em resina epóxi branca de alta refletância e teto com trilhos de iluminação em cinco circuitos independentes. A flexibilidade do layout permite configurações radicalmente diferentes a cada nova exposição sem nenhuma intervenção física.',
        'O segundo pavimento abriga galerias de menor escala para obras sobre papel e obras tridimensionais delicadas, além de sala de reserva técnica com controle de temperatura e umidade. A circulação entre os pavimentos utiliza uma escada em aço preto com guarda-corpo de vidro temperado que não obstrui a visão do espaço principal ao subir.',
        'O controle de luz natural foi resolvido com brises metálicos motorizados nas grandes janelas frontais, permitindo que a curadoria escolha entre a luz natural filtrada e o controle total da iluminação artificial. A fachada manteve as esquadrias originais em alumínio anodizado bronze, restauradas e revedadas, preservando o diálogo com a arquitetura modernista do edifício.',
      ],
    },
  ],

  corporativo: [
    {
      title: 'Sede Nexum — Vila Olímpia',
      date: '2024-02-15',
      img: IMGS.corporativo[0],
      gallery: [IMGS.corporativo[1], IMGS.corporativo[2], IMGS.corporativo[3]],
      featured: true,
      content: [
        'A Nexum é uma empresa de tecnologia financeira em rápido crescimento. O projeto de sua nova sede, com 2.400m² distribuídos em três andares na Vila Olímpia, precisava traduzir os valores de inovação, transparência e colaboração em um ambiente físico que atraísse e retivesse talentos altamente qualificados.',
        'O programa foi organizado a partir de uma análise etnográfica do comportamento dos colaboradores: 55% do tempo em trabalho concentrado, 30% em colaboração informal e 15% em reuniões formais. Isso gerou uma planta com 120 posições de trabalho fixo, 60 posições hot desk, 4 salas de reunião, 12 cabines de foco e 3 lounges de diferentes intensidades de interação.',
        'O partido arquitetônico utilizou a transparência como valor: todas as salas de reunião têm paredes em vidro laminado com película de privacidade acionável eletricamente. As escadas internas entre pavimentos são de aço com espelho d\'água sob o lance térreo — o fluxo de pessoas torna-se movimento visível e vivo.',
        'A identidade visual da empresa foi integrada ao projeto de forma sistêmica: a paleta azul elétrico e cinza chumbo aparece em mobiliário de assento, painéis acústicos e sinalização, nunca em paredes — isso garante flexibilidade para mudanças de marca no futuro sem grandes obras. Todos os materiais foram selecionados com foco em durabilidade de longo prazo e baixa manutenção.',
      ],
    },
    {
      title: 'Escritório Atrium — Berrini',
      date: '2024-04-01',
      img: IMGS.corporativo[1],
      gallery: [IMGS.corporativo[2], IMGS.corporativo[4], IMGS.corporativo[0]],
      featured: true,
      content: [
        'O Escritório Atrium é a sede de uma gestora de investimentos de médio porte na Avenida Berrini, com 1.100m² em um andar de laje corrida. O cliente buscava um ambiente que transmitisse solidez e credibilidade aos investidores visitantes sem abrir mão de conforto e modernidade para a equipe de 85 pessoas.',
        'O projeto dividiu o andar em duas zonas com tratamentos distintos: a zona de recepção e reuniões de clientes, com acabamentos premium e alto impacto visual, e a zona de trabalho operacional, com foco em ergonomia e produtividade. Essa separação funcional foi resolvida arquitetonicamente por uma parede de pedra São Tomé de 12 metros que organiza a circulação sem fechar o espaço.',
        'A recepção foi projetada com mármore Nero Marquina no piso e painel ripado de madeira tauarí natural de 5 metros na parede principal. O mobiliário de espera é assinado por designer brasileiro e combina couro natural com estrutura em latão envelhecido. Cada detalhe desta área foi selecionado para criar uma primeira impressão de excelência duradoura.',
        'Na zona de trabalho, o projeto priorizou ergonomia: mesas com regulagem de altura elétrica, cadeiras com certificação nível 4 da ABNT, iluminação em 500 lux sobre as superfícies de trabalho com controle individual por zona e acústica com NC-35 — parâmetro de alta exigência para ambientes de concentração. O resultado é um escritório onde a equipe consegue trabalhar em foco máximo por longos períodos.',
      ],
    },
    {
      title: 'HQ Verdant — Pinheiros',
      date: '2023-09-01',
      img: IMGS.corporativo[2],
      gallery: [IMGS.corporativo[3], IMGS.corporativo[5], IMGS.corporativo[1]],
      featured: false,
      content: [
        'A Verdant é uma empresa de tecnologia climática que precisava de uma sede de 1.800m² que fosse, ela mesma, uma demonstração dos valores ambientais da empresa. O projeto na Vila Madalena foi desenvolvido com metas agressivas de sustentabilidade: certificação LEED Gold, 40% de redução no consumo de energia em relação à linha de base e zero uso de materiais com alto teor de COV.',
        'A fachada recebeu um sistema de jardim vertical de 200m² com espécies nativas da Mata Atlântica, com sistema de irrigação por reaproveitamento de água da chuva. As plantas não são apenas decorativas: estudos termorradia mostraram redução de até 4°C na temperatura superficial da fachada exposta ao oeste, reduzindo carga de refrigeração.',
        'Internamente, o conceito biofílico foi levado além da estética. A planta foi desenvolvida com atenção às conexões visuais com a natureza: 85% das estações de trabalho têm visão direta para o exterior verde ou para o jardim interno central. Estudos comprovam que esse índice de conexão visual com natureza reduz o estresse em até 23% e aumenta a produtividade.',
        'O sistema de iluminação combina controle circadiano — ajuste automático da temperatura de cor ao longo do dia, de 4500K pela manhã a 2700K ao final da tarde — com sensores de presença em todas as zonas. A automação integrada ao BMS do edifício apaga automaticamente iluminação e climatização em áreas desocupadas por mais de 15 minutos, contribuindo para a meta energética.',
      ],
    },
    {
      title: 'Sede Jurídica Monteiro & Ramos',
      date: '2023-05-01',
      img: IMGS.corporativo[3],
      gallery: [IMGS.corporativo[4], IMGS.corporativo[6], IMGS.corporativo[2]],
      featured: false,
      content: [
        'O escritório de advocacia Monteiro & Ramos ocupa o 14º andar de um edifício corporativo no Centro Expandido, com 920m² projetados para transmitir a autoridade e a tradição de um escritório com 40 anos de mercado, sem parecer antiquado ou intimidador para clientes mais jovens.',
        'A biblioteca jurídica é o coração do projeto: uma sala octogonal com prateleiras de piso a teto em carvalho americano, escada de carvalho em trilho deslizante e mesa oval em mármore Verde Ubatuba para 12 lugares. Esse ambiente híbrido entre sala de reunião e acervo torna-se o cartão de visitas mais forte do escritório para clientes e visitantes.',
        'Os escritórios individuais dos sócios foram projetados com forte identidade pessoal dentro de um sistema coerente: planta retangular com nicho de leitura, mesa executiva em madeira maciça e parede de vidro que mantém privacidade acústica sem isolar visualmente o ocupante do escritório aberto. Cada sócio escolheu uma madeira diferente — nogueira, tauarí, jequitibá — criando variação sem fragmentação.',
        'A área de colaboração foi intencionalmente projetada em contraste com a sobriedade dos escritórios privados: pé-direito duplo, sofás em linho natural, mesa de ping-pong e trilha de musica ambiente. Essa tensão deliberada entre o formal e o informal é a chave do projeto — o cliente percebe a competência técnica pelos acabamentos cuidadosos e a modernidade pelo conjunto espacial.',
      ],
    },
    {
      title: 'Campus Digital Meridian',
      date: '2024-01-01',
      img: IMGS.corporativo[4],
      gallery: [IMGS.corporativo[5], IMGS.corporativo[7], IMGS.corporativo[3]],
      featured: true,
      content: [
        'O Campus Meridian é um complexo corporativo de 8.500m² em terreno de 12.000m² no ABC Paulista, projetado para abrigar 600 colaboradores de uma empresa de software em três edifícios interligados. O programa incluiu edifício administrativo, hub de inovação, centro de dados e infraestrutura de apoio.',
        'A estratégia de implantação priorizou a criação de espaços externos qualificados entre os edifícios: um parque linear de 2.800m² conecta todos os volumes e serve como extensão do espaço de trabalho. Mesas ao ar livre, jardins de permanência, quadra poliesportiva e anfiteatro externo para 150 pessoas completam o programa.',
        'O hub de inovação é o edifício central do campus: estrutura em aço exposto com fechamento em vidro laminado, pé-direito livre de 6 metros no térreo e mezanino suspenso com acesso por rampa helicoidal. O volume foi projetado para ser transformável — o mezanino pode ser removido, novos pavimentos podem ser adicionados sem obra estrutural.',
        'A infraestrutura tecnológica foi pensada como camada de serviço integrada: cabeamento estruturado Cat.6A, wi-fi 6E com cobertura de 100% do campus incluindo áreas externas, tomadas USB-C embutidas em todos os pisos de trabalho colaborativo e sistema de reserva de salas e mesas controlado por aplicativo próprio desenvolvido junto com o time de TI do cliente.',
      ],
    },
    {
      title: 'Torre Executiva — Faria Lima',
      date: '2023-11-15',
      img: IMGS.corporativo[5],
      gallery: [IMGS.corporativo[6], IMGS.corporativo[0], IMGS.corporativo[4]],
      featured: false,
      content: [
        'Projeto de interiores corporativos para dois andares contíguos na Avenida Faria Lima, totalizando 3.200m², para uma empresa de private equity com 200 colaboradores. O cliente buscava uma sede que posicionasse a empresa no topo do mercado local e fosse reconhecida como referência de excelência por pares e competidores.',
        'A recepção duplex, com pé-direito de 5,4 metros e escada monumental em mármore Statuario branco, define o tom do projeto desde os primeiros passos do visitante. A parede de 8 metros em bas-relief de gesso com padrão geométrico derivado do logotipo da empresa é o elemento de identidade mais marcante do espaço — produzida por artesão especializado em técnica mista.',
        'As salas de reunião foram agrupadas em cluster central com corredor de circulação perimetral, garantindo acesso rápido a qualquer configuração sem cruzar com áreas de trabalho. As salas variam de 4 a 20 lugares, com tecnologia de videoconferência embutida, sistema de blackout motorizado e divisória acústica deslizante que pode unir duas salas para eventos de 40 pessoas.',
        'O clube do andar — espaço de descanso e socialização no 15º andar com terraço — é o diferencial do projeto: bar de água com fachada ativa de plantas, sala de estar com lareira elétrica, terraço com deck de madeira e vista 360° para a cidade. Esse espaço se tornou referência no mercado de atração de talentos e é frequentemente citado nas pesquisas de clima da empresa como motivo de orgulho pelos colaboradores.',
      ],
    },
  ],

  interiores: [
    {
      title: 'Residência T+L — Higienópolis',
      date: '2024-03-15',
      img: IMGS.interiores[0],
      gallery: [IMGS.interiores[1], IMGS.interiores[2], IMGS.interiores[3]],
      featured: true,
      content: [
        'Projeto de interiores para apartamento de 240m² em edifício de 1972 em Higienópolis, reformado completamente para um casal sem filhos com perfil colecionador de arte contemporânea. O desafio central era criar um ambiente que funcionasse simultaneamente como lar íntimo e galeria particular, sem que nenhum dos dois papéis dominasse o outro.',
        'A reforma estrutural removeu todas as divisórias internas da área social, criando uma planta aberta de 90m² que integra sala de estar, sala de jantar e cozinha. O pé-direito de 3,2m foi maximizado com a remoção de forro: as lajes de concreto aparentes foram lixadas e tratadas com resina de proteção, tornando-se o elemento mais marcante do teto.',
        'As paredes foram intencionalmente deixadas neutras — branco pérola mate em toda a extensão — para funcionar como tela para as obras. A iluminação foi desenvolvida em parceria com consultora especializada: trilhos de alta precisão com spots miniatura de 4W permitem iluminar cada obra individualmente com o ângulo exato que o colecionador deseja, ajustável sem ferramentas.',
        'Os dormitórios seguiram conceito oposto: baixa iluminação ambiente, paleta terrosa, texturas táteis e ausência de telas. A suíte master tem 38m² e inclui closet em L com sistema Häfele, banheiro com banheira de imersão autônoma em acrílico sanitário e painel de cabeceira em seda natural plissada. O contraste deliberado entre o social extrovertido e os dormitórios cocooning é a chave experiencial do projeto.',
      ],
    },
    {
      title: 'Cobertura K — Moema',
      date: '2024-05-01',
      img: IMGS.interiores[1],
      gallery: [IMGS.interiores[2], IMGS.interiores[4], IMGS.interiores[0]],
      featured: true,
      content: [
        'Cobertura duplex de 380m² em Moema, incluindo terraço de 120m² com piscina aquecida e área gourmet. O projeto integrou paisagismo e interiores como projeto único, tratando o terraço como extensão natural dos espaços internos em vez de área complementar.',
        'O piso de travertino natural percorre sem interrupção do living interno até o deck externo — a mesma pedra, o mesmo módulo e a mesma direção de assentamento. As esquadrias de alumínio branco com abertura de correr de 4 folhas desaparecem completamente nas caixas de guarda, permitindo que os 9 metros de vão frontal se tornem completamente permeáveis em dias quentes.',
        'A cozinha foi desenvolvida como ambiente de protagonismo: ilha central de 3,5m em Calacata Viola com 8 lugares, armários em laca branca fosca com puxadores de latão escovado, e painel de eletrodomésticos de embutir em aço inox que ocupa a parede posterior de 4 metros. A adega climatizada para 180 garrafas é visível através de porta de vidro temperado — showpiece intencional do projeto.',
        'No terraço, o projeto de paisagismo criou três momentos: área de piscina com deck de madeira cumaru, jardim seco com pedras irregulares e cactos, e área gourmet coberta com pérgola de aço e trepadeiras. O contraste entre os três momentos cria a sensação de percurso — do aberto ao coberto, do contemporâneo ao orgânico — em apenas 120m².',
      ],
    },
    {
      title: 'Loft Industrial — Barra Funda',
      date: '2023-10-01',
      img: IMGS.interiores[2],
      gallery: [IMGS.interiores[3], IMGS.interiores[5], IMGS.interiores[1]],
      featured: false,
      content: [
        'Conversão de galpão industrial dos anos 50 em loft residencial de 320m² em pé único na Barra Funda. O desafio foi transformar um espaço bruto — tijolos de demolição, laje nervurada, janelas de ferro oxidado — em ambiente residencial confortável sem apagar a memória industrial do lugar.',
        'A estratégia foi de mínima intervenção nos elementos existentes: os tijolos foram apenas limpos e selados, as vigas de concreto receberam tratamento estético mas mantiveram aparência industrial, as janelas de ferro foram restauradas e preservadas. As intervenções novas — mezanino em aço cor-de-laranja queimado, cozinha modulada em pré-moldado de concreto, escada helicoidal — foram projetadas para contrastar deliberadamente com o existente.',
        'O mezanino abriga o quarto principal com planta aberta e vista para o living abaixo. O guarda-corpo em tela de aço inox expandido garante segurança com máxima transparência visual, mantendo o pé-direito livre de 7 metros como experiência constante do espaço. O banheiro foi inserido em caixa de alvenaria independente no canto do loft, com teto aberto que mantém a conexão com o volume geral.',
        'A iluminação foi projetada para diferentes momentos do loft: o living recebe iluminação zenital pelas claraboias recuperadas e iluminação rasante que valoriza a textura do tijolo; a cozinha tem iluminação funcional de 500 lux embutida na faixa superior dos armários; o mezanino tem iluminação indireta que desenha o volume sem revelar a fonte. O resultado é um espaço que parece diferente a cada hora do dia.',
      ],
    },
    {
      title: 'Home Spa — Perdizes',
      date: '2024-02-01',
      img: IMGS.interiores[3],
      gallery: [IMGS.interiores[4], IMGS.interiores[6], IMGS.interiores[2]],
      featured: false,
      content: [
        'Reforma e projeto de interiores de apartamento de 160m² em Perdizes, com foco especial no desenvolvimento de um banheiro-spa de 28m² como peça central do projeto. O cliente — médica especialista em longevidade — tinha como premissa central criar uma casa que priorizasse saúde, recuperação e bem-estar em cada detalhe.',
        'O banheiro principal recebeu banheira de imersão freestanding em pedra reconstituída de 1.800mm, ducha de painel com 12 jatos independentes e sauna seca de 2,5m² em cedro canadense com controle digital. O piso aquecido elétrico cobre toda a área úmida, ativado automaticamente 30 minutos antes do horário programado pelo morador.',
        'No restante do apartamento, o projeto escolheu materiais baseados em pesquisa de qualidade do ar interno: tintas à base d\'água com certificação baixo VOC, pisos de carvalho maciço (sem laminação ou compensado), mobiliário com estrutura em madeira maciça e estofados em tecidos naturais sem tratamento com retardadores de chama químicos. Cada escolha foi documentada com ficha técnica de saúde do material.',
        'O home office foi desenvolvido com atenção especial à ergonomia da coluna e à saúde visual: mesa regulável de altura elétrica, monitor posicionado a 80cm de distância e levemente abaixo da linha do olhar, iluminação natural de 500 lux sobre a superfície de trabalho sem reflexos e janela posicionada lateralmente à tela. Um canto de meditação com tatame de bambu natural completa o espaço de recuperação.',
      ],
    },
    {
      title: 'Apartamento Cores — Liberdade',
      date: '2023-07-01',
      img: IMGS.interiores[4],
      gallery: [IMGS.interiores[5], IMGS.interiores[7], IMGS.interiores[3]],
      featured: true,
      content: [
        'Projeto de interiores para casal jovem em apartamento de 75m² no bairro da Liberdade. Com metragem reduzida e budget enxuto, o projeto precisou criar sensação de amplitude, personalidade e funcionalidade sem comprometer nenhum dos três objetivos — desafio que frequentemente obriga a escolher apenas dois.',
        'A paleta cromática foi a chave da solução: branco como base absoluta em paredes, teto e piso de cimento alisado, com inserções de cor saturada em elementos pontualmente substituíveis — almofadas, objetos, luminária de chão, quadros. Isso permite ao morador renovar o ambiente com baixíssimo custo sem exigir reforma.',
        'O mobile bar foi o elemento de destaque do projeto: uma ilha de 1,2m x 0,8m em carvalho com tampo em terrazzo vermelho, sobre rodinhas com trava, que funciona como divisória sutil entre sala e cozinha, mesa auxiliar de jantar para 4 pessoas e home bar. Um único móvel resolve três problemas em sequência.',
        'O quarto recebeu cama baú com elevação elétrica — 400L de armazenamento que elimina a necessidade de armários adicionais. O closet de 4m² foi projetado com sistema modular Elfa e porta de correr com espelho de corpo inteiro que óptica amplia o corredor de passagem. Cada decisão do projeto foi avaliada pela equação valor-espaço-função, sem desperdício de metro quadrado.',
      ],
    },
    {
      title: 'Residência Bosque — Granja Viana',
      date: '2024-06-01',
      img: IMGS.interiores[5],
      gallery: [IMGS.interiores[6], IMGS.interiores[0], IMGS.interiores[4]],
      featured: false,
      content: [
        'Projeto de interiores para casa de 480m² em condomínio arborizado na Granja Viana, para família com três filhos em idades distintas. A premissa central era criar espaços que evoluíssem com as fases da família — o quarto de criança de hoje precisava se tornar o escritório do adolescente amanhã, sem reforma.',
        'A solução foi um sistema modular proprietário desenvolvido especificamente para o projeto: estrutura de perfis de alumínio anodizado grafite que aceita diferentes painéis e módulos de mobiliário. Em dez anos, qualquer quarto pode ser reconfigurado em horas apenas substituindo os módulos, sem furos na parede ou resíduo de obra.',
        'A área social de 120m² foi projetada com cozinha completamente integrada em planta L, living com pé-direito duplo de 5,8m e varanda gourmet de 40m². O piso de porcelanato imitação concreto 120x120cm percorre toda a área sem soleira, unificando os três ambientes em volume único. A lareira de dupla face integra living e varanda, funcionando como elemento de transição entre dentro e fora.',
        'O projeto de iluminação foi desenvolvido com consultora especializada em iluminação residencial de alto padrão. O resultado são 11 cenas programáveis na área social: despertar, café da manhã, trabalho remoto, tarde familiar, jantar formal, jantar descontraído, cinema, festa, romance, limpeza e ausência. Cada cena tem temperatura de cor, intensidade e distribuição espacial específicas, controladas por tablet, voz ou automação por horário.',
      ],
    },
  ],

  paisagismo: [
    {
      title: 'Jardim Suspenso — Pinheiros',
      date: '2024-03-01',
      img: IMGS.paisagismo[0],
      gallery: [IMGS.paisagismo[1], IMGS.paisagismo[2], IMGS.paisagismo[3]],
      featured: true,
      content: [
        'Projeto de paisagismo para terraço de 180m² em cobertura residencial de alto padrão em Pinheiros. O desafio central era criar um jardim de alto impacto visual em substrato raso — máximo de 30cm de profundidade pela limitação estrutural da laje — com espécies que suportassem a exposição intensa ao sol e ao vento em altura.',
        'O projeto selecionou 47 espécies de gramíneas ornamentais, suculentas, cactáceas e bromeliáceas — todas com sistema radicular superficial e alta resistência à seca. A composição foi desenvolvida em três camadas verticais: cobertura rasteira de grama amendoim para as faixas de caminhamento, maciços médios de bromélias e agaves, e pontuações verticais de cactus colunar como elementos escultóricos.',
        'O sistema de irrigação foi projetado para máxima eficiência hídrica: irrigação por gotejamento subsuperficial com controlador climático que ajusta automaticamente a frequência e duração da rega com base em temperatura, umidade do ar e previsão de chuva. O consumo de água do jardim é 70% menor em relação a um sistema de aspersão convencional.',
        'O projeto incluiu mobiliário externo em ipê natural certificado FSC, pergolado de aço cor com trepadeiras selecionadas e piso de deck modular em WPC (madeira plástica) reciclada. A iluminação externa em baixa voltagem cria presença noturna sem poluição luminosa, com espetos direcionais que valorizam as texturas vegetais e spots embutidos no deck que demarcam os caminhos com segurança.',
      ],
    },
    {
      title: 'Parque Corporativo Estrela',
      date: '2023-10-01',
      img: IMGS.paisagismo[1],
      gallery: [IMGS.paisagismo[2], IMGS.paisagismo[4], IMGS.paisagismo[0]],
      featured: true,
      content: [
        'Projeto de paisagismo para campus empresarial de 15.000m² de área verde integrada no ABC Paulista. O complexo abriga quatro edifícios corporativos e o programa paisagístico precisava criar conexões verdes entre os volumes, gerenciar o escoamento pluvial de uma área impermeabilizada de 40.000m² e criar espaços de descanso de alta qualidade para 1.800 colaboradores.',
        'O conceito foi o de parque produtivo: além da função estética e de bem-estar, cada elemento vegetado tem uma função técnica. Biovaletas gramadas captam e filtram a água da chuva antes de infiltrá-la no lençol freático. Arborização de médio porte na fachada oeste reduz carga térmica dos edifícios. Jardins de retenção amortecem eventos de precipitação intensa, evitando inundações no sistema de drenagem municipal.',
        'A seleção de espécies privilegiou a Mata Atlântica: 85% das espécies plantadas são nativas da Floresta Estacional Semidecídua, o bioma original da região. Ipê-amarelo, quaresmeira, pau-brasil, embaúba e pitangueira compõem o bosque central — elemento âncora do projeto que em dez anos formará um dossel fechado de 8 metros de altura sobre a praça de convivência.',
        'O anfiteatro externo para 300 pessoas é o equipamento principal do projeto: gramado em platôs escalonados, palco em concreto aparente e iluminação embutida no piso. Em dias normais, serve como área de almoço ao ar livre. Nos eventos mensais da empresa, transforma-se em palco para apresentações culturais e palestras externas. Paisagismo como infraestrutura social.',
      ],
    },
    {
      title: 'Jardim de Chuva — Morumbi',
      date: '2024-01-15',
      img: IMGS.paisagismo[2],
      gallery: [IMGS.paisagismo[3], IMGS.paisagismo[5], IMGS.paisagismo[1]],
      featured: false,
      content: [
        'Projeto de paisagismo sustentável para residência de 600m² de área construída no Morumbi, com ênfase em manejo hídrico e biodiversidade. A propriedade sofria com alagamento recorrente em eventos de chuva intensa — problema resolvido pelo projeto sem nenhuma infraestrutura de drenagem convencional.',
        'A solução foi um sistema integrado de jardins de chuva: seis faixas deprimidas de absorção, com 30cm de profundidade e plantio de espécies higrófilas, captam e infiltram toda a água das coberturas e pavimentos permeáveis. O cálculo hidrológico garantiu capacidade de absorção para eventos de 100mm em 1 hora — o cenário de projeto para a região. Desde a inauguração, nenhum evento de chuva gerou alagamento.',
        'A piscina natural foi o elemento mais inovador do projeto: sem uso de cloro ou outros biocidas, a água é purificada por um jardim aquático de 40m² com plantas macrófitas. O sistema biodinâmico cria um ecossistema completo — peixes, anfíbios e aves retornaram ao jardim em menos de seis meses após a implantação. O custo de manutenção mensal é 60% menor que uma piscina convencional de mesmo porte.',
        'A horta mandala de 80m² foi projetada como espaço produtivo e educativo para a família: canteiros circulares irradiantes com corredores de acesso, composteira integrada e sistema de coleta de água de chuva para irrigação independente da rede pública. As espécies foram selecionadas em ciclos de plantio escalonados para garantir produção contínua ao longo de todo o ano.',
      ],
    },
    {
      title: 'Praça Linear — Projeto Urbano',
      date: '2023-07-01',
      img: IMGS.paisagismo[3],
      gallery: [IMGS.paisagismo[4], IMGS.paisagismo[6], IMGS.paisagismo[2]],
      featured: false,
      content: [
        'Projeto de paisagismo urbano para reurbanização de canteiro central de via arterial com 1,2km de extensão no Município de São Bernardo do Campo. O projeto foi desenvolvido em parceria com a Prefeitura como modelo replicável de infraestrutura verde urbana de baixo custo e alta resiliência.',
        'O programa de espécies foi desenvolvido com o Herbário do Instituto de Botânica: 100% das espécies arbóreas são nativas do Cerrado e Mata Atlântica, selecionadas por porte, tolerância ao estresse urbano (compactação do solo, poluição e calor) e valor para a fauna. Mudas de 1,80m foram utilizadas para garantir impacto visual imediato e menor índice de vandalismo.',
        'O sistema de calçadas foi reprojetado com piso tátil de alto contraste, faixa de serviço com 1,5m para abrigos e mobiliário urbano e faixa livre de 2m garantida em toda a extensão. As luminárias foram substituídas por modelo solar com célula fotovoltaica integrada — zero custo de energia para o município após a implantação, com payback calculado em 4,2 anos.',
        'O projeto previu um plano de manutenção com capacitação da equipe municipal: fichas técnicas para cada espécie, cronograma de podas por época, protocolo de tratamento de pragas com bioinseticidas e indicadores de monitoramento da biodiversidade. Um QR code em cada árvore leva a informações sobre a espécie — projeto de educação ambiental integrado à infraestrutura pública.',
      ],
    },
    {
      title: 'Bosque Residencial — Alphaville',
      date: '2023-04-01',
      img: IMGS.paisagismo[4],
      gallery: [IMGS.paisagismo[5], IMGS.paisagismo[7], IMGS.paisagismo[3]],
      featured: true,
      content: [
        'Projeto de paisagismo para área comum de condomínio residencial de alto padrão com 42 casas em Alphaville. A área verde de 8.000m² foi projetada como bosque urbano de uso coletivo — conceito que vai além da paisagem decorativa para criar um recurso compartilhado com benefícios ecológicos, sociais e patrimoniais para todos os moradores.',
        'O bosque foi desenhado em três camadas ecológicas sobrepostas: estrato herbáceo com gramíneas nativas e flores silvestres, estrato arbustivo com espécies frutíferas para a fauna e estrato arbóreo com espécies de médio e grande porte. Essa estrutura imita a organização natural da Mata Atlântica e garante que o bosque seja auto-sustentável a longo prazo, com mínima intervenção humana.',
        'Os equipamentos de uso coletivo foram integrados ao bosque como móveis na paisagem: quadra de areia para vôlei e futevôlei com iluminação de baixa altura, parquinho em madeira de reflorestamento com certificação FSC, trilha de caminhada de 800m com piso permeável e três estações de exercício ao ar livre. Tudo projetado para se tornar invisível na vegetação após dois anos de crescimento.',
        'O projeto incluiu um viveiro de mudas comunitário: estrutura coberta de 60m² onde moradores podem cultivar mudas das espécies do bosque, que são periodicamente transplantadas nas áreas de expansão previstas no projeto. Em quatro anos, o condomínio produziu 1.200 mudas que foram doadas a projetos de recuperação de mata ciliar no entorno do município — impacto ambiental que vai além do próprio condomínio.',
      ],
    },
    {
      title: 'Jardim Japonês — Ibirapuera',
      date: '2024-04-01',
      img: IMGS.paisagismo[5],
      gallery: [IMGS.paisagismo[6], IMGS.paisagismo[0], IMGS.paisagismo[4]],
      featured: false,
      content: [
        'Projeto de jardim de contemplação de inspiração japonesa para residência particular no entorno do Parque Ibirapuera. O cliente — professor de filosofia com formação em Quioto — desejava um espaço de meditação que seguisse os princípios do jardim seco zen (karesansui) adaptados ao clima tropical de São Paulo.',
        'O jardim seco de 60m² utiliza pedras graníticas regionais selecionadas por textura, cor e presença escultórica — cada pedra foi escolhida a dedo em canteiro de pedras no interior de São Paulo. O rastelo de areia é executado manualmente pelo jardineiro residente duas vezes por semana, processo que o cliente considera parte integrante da experiência contemplativa do espaço.',
        'A vegetação combina espécies do jardim japonês com espécies nativas brasileiras de morfologia compatível: bambu-mossô ao fundo como barreira visual e acústica, Cycas revoluta como substituto do pinheiro japonês, Heliconia psittacorum substituindo as íris, e liquens e musgos espontâneos que foram preservados intencionalmente sobre as pedras e no piso de pedriscos.',
        'O pavilhão de meditação foi projetado como estrutura leve de aço com telha de fibra de vidro translúcida: 12m² com piso elevado em bambu laminado, shoji de papel natural nas laterais e sistema de borrifadores que cria névoa em dias quentes, reduzindo a temperatura do espaço em 6°C. A luz filtrada pelo papel cria uma qualidade de iluminação única que muda completamente ao longo do dia.',
      ],
    },
  ],

  institucional: [
    {
      title: 'Centro Cultural Raízes — Santo André',
      date: '2024-02-01',
      img: IMGS.institucional[0],
      gallery: [IMGS.institucional[1], IMGS.institucional[2], IMGS.institucional[3]],
      featured: true,
      content: [
        'O Centro Cultural Raízes é um equipamento público de 3.200m² projetado para o Município de Santo André como polo de arte, cultura e formação comunitária. O edifício abriga teatro de 250 lugares, escola de música, ateliê de artes plásticas, biblioteca comunitária, espaço maker e praça coberta multiuso — tudo em programa integrado que funciona como catalisador de vida pública na região.',
        'O partido arquitetônico partiu da ideia de edifício aberto: a praça coberta, formada pela projeção da cobertura sobre área livre, não tem grades ou portões — funciona como extensão da calçada e permanece acessível 24 horas. Esse espaço de transição entre cidade e equipamento cultural é onde acontece a maioria das atividades espontâneas e informais que definem a vida do lugar.',
        'O teatro foi projetado com foco na versatilidade: palco com sistema de varas automatizadas, fosso de orquestra com elevador, arquibancada retrátil que permite configuração em arena, e sistema de iluminação com memória de 99 cenas. O revestimento acústico interno foi desenvolvido com painéis de MDF perfurado com absorvedores variáveis, atingindo o tempo de reverberação ideal para música clássica, MPB e teatro falado em configurações distintas.',
        'A sustentabilidade foi integrada ao projeto desde a concepção: cobertura verde de 800m² reduz a carga térmica do edifício e o escoamento pluvial, sistema de captação de águas pluviais abastece as descargas e a irrigação, e painel fotovoltaico de 120kWp garante 40% da energia do complexo. O projeto recebeu certificação AQUA-HQE com classificação Superior em todas as categorias avaliadas.',
      ],
    },
    {
      title: 'Escola Municipal Horizonte',
      date: '2023-08-01',
      img: IMGS.institucional[1],
      gallery: [IMGS.institucional[2], IMGS.institucional[4], IMGS.institucional[0]],
      featured: true,
      content: [
        'Projeto de nova escola municipal de ensino fundamental para 900 alunos em período integral no Município de Guarulhos. O programa incluiu 24 salas de aula, laboratórios de ciências e informática, biblioteca escolar, quadra coberta, refeitório, cozinha industrial, sala de professores e administração — tudo em edifício de dois pavimentos com implantação em terreno de topografia acentuada.',
        'O projeto explorou a topografia como recurso: os dois pavimentos foram implantados em cotas distintas, permitindo que ambos tenham acesso direto ao exterior ao nível do chão. Isso elimina escadas como barreira para crianças e pessoas com deficiência e cria pátios em diferentes cotas, cada um com ambiência e programa de uso específicos para diferentes idades e atividades.',
        'As salas de aula foram projetadas com atenção especial às condições ambientais: ventilação cruzada com brises de madeira no plano norte, janelas altas na fachada sul que garantem iluminação natural uniforme sem ofuscamento, piso em cimento alisado com baixa absorção de calor e acústica com RT60 inferior a 0,6s — parâmetro exigido para compreensão da fala em sala de aula.',
        'O pátio central descoberto foi pensado como ambiente pedagógico: piso desenhado com mapas e jogos matemáticos pintados, jardim de ervas aromáticas e medicinais manejado pelos alunos, horta vertical na fachada do refeitório e sistema de captação de chuva com medidores visíveis que se tornam objeto de aula de hidrologia. A escola foi projetada para ser um instrumento de aprendizagem além das quatro paredes das salas.',
      ],
    },
    {
      title: 'Biblioteca Pública Central — São Caetano',
      date: '2024-04-01',
      img: IMGS.institucional[2],
      gallery: [IMGS.institucional[3], IMGS.institucional[5], IMGS.institucional[1]],
      featured: false,
      content: [
        'Reforma e modernização da Biblioteca Pública Central de São Caetano do Sul, com área de 1.800m² em edifício dos anos 80. O projeto precisava transformar um espaço obsoleto e de baixa frequência em equipamento cultural atrativo para diferentes gerações — das crianças em fase de alfabetização aos idosos que buscam espaço de convivência intelectual.',
        'O programa foi completamente reformulado a partir de pesquisa de uso com a comunidade: a biblioteca tradicional com estantes fechadas e silêncio compulsório cedeu espaço a uma biblioteca contemporânea com zona maker, podcast studio, estúdio fotográfico, sala de videogame com acervo de jogos físicos e digitais, e café integrado. O acervo físico foi mantido mas reorganizado em estantes baixas que permitem visão ampla do espaço.',
        'A acústica foi o maior desafio da reforma: criar zonas de silêncio rigoroso (sala de leitura individual), silêncio moderado (área de acervo e pesquisa) e alta atividade (zona maker, café) em espaço sem divisórias permanentes. A solução foi um sistema de painéis acústicos suspensos de densidade variável que criam zonas de atenuação acústica sem bloquear visualmente o espaço.',
        'A iluminação natural foi maximizada pela abertura de claraboias na cobertura existente, que criaram três poços de luz sobre as áreas de leitura mais importantes. A luz solar filtrada por vidro laminado com proteção UV não danifica os acervos e reduz 35% o consumo de energia na iluminação artificial durante o dia. A frequência mensal da biblioteca saltou de 800 para 4.200 visitantes após a reinauguração.',
      ],
    },
    {
      title: 'Campus Universitário Norte',
      date: '2023-03-01',
      img: IMGS.institucional[3],
      gallery: [IMGS.institucional[4], IMGS.institucional[6], IMGS.institucional[2]],
      featured: false,
      content: [
        'Projeto de novo campus para faculdade particular no zona norte de São Paulo, com área construída de 12.000m² em terreno de 18.000m². O programa inclui 40 salas de aula, 8 laboratórios especializados, auditório de 400 lugares, restaurante universitário, centro de esportes, biblioteca de 800m² e administração central.',
        'O masterplan organizou o campus em anel de edifícios ao redor de uma praça central arborizada, estratégia que garante que todos os edifícios tenham visão para o verde central e que a circulação de pedestres seja sempre confortável e protegida. As conexões cobertas entre os edifícios permitem circulação sem exposição à chuva em qualquer ponto do campus.',
        'O centro de esportes é o edifício de maior destaque arquitetônico: estrutura metálica com vão livre de 40m, cobertura em arco de treliça e fechamento em policarbonato translúcido que garante luz natural uniforme em toda a quadra poliesportiva. O edifício abriga duas quadras sobrepostas, sala de musculação, piscina semiolímpica e vestiários.',
        'A sustentabilidade do campus foi planejada em escala sistêmica: a cobertura do estacionamento de 300 vagas recebeu cobertura fotovoltaica de 450kWp que gera 30% da energia do campus. O sistema de tratamento de esgoto in loco produz água de reúso para irrigação e descarga, reduzindo 60% do consumo de água potável. O projeto recebeu certificação LEED BD+C Campus Gold.',
      ],
    },
    {
      title: 'Museu Municipal de Arte — Mauá',
      date: '2024-06-01',
      img: IMGS.institucional[4],
      gallery: [IMGS.institucional[5], IMGS.institucional[7], IMGS.institucional[3]],
      featured: true,
      content: [
        'Conversão de antiga fábrica têxtil dos anos 40 em museu municipal de arte para o Município de Mauá. O edifício de 4.500m² em tijolo maciço aparente é patrimônio histórico do município e a intervenção foi desenvolvida dentro das restrições do tombamento estadual, que preserva integralmente a fachada e a volumetria original.',
        'A estratégia de intervenção foi inserir uma nova arquitetura dentro da casca histórica sem confundir as linguagens: estrutura metálica autônoma de aço galvanizado sustenta os novos pavimentos sem tocar nas paredes de tijolo, que se tornaram pano de fundo em vez de estrutura portante. O espaço entre a nova estrutura e as paredes antigas cria circulações perimetrais que revelam a espessura e a textura da alvenaria histórica.',
        'O programa expositivo foi organizado em quatro galerias temáticas de 400m² cada, com sistema de iluminação projetado especificamente para obras de arte: 300 lux sobre pinturas, zero luz ultravioleta, controle automático de temperatura e umidade (18-22°C e 45-55% UR), e sistema de segurança integrado com câmeras de alta resolução, detectores volumétricos e cofres de parede embutidos.',
        'A praça externa de 2.800m² foi reprojetada como extensão do museu: escultura pública de artista local como ponto focal, espelho d\'água raso com bordas em cantaria recuperada da demolição interna, e iluminação noturna que transforma as fachadas em tela de projeção para eventos externos. O museu atraiu 48.000 visitantes no primeiro ano de operação, tornando-se o equipamento cultural mais frequentado do município.',
      ],
    },
    {
      title: 'Centro de Pesquisa Biomédica',
      date: '2023-12-01',
      img: IMGS.institucional[5],
      gallery: [IMGS.institucional[6], IMGS.institucional[0], IMGS.institucional[4]],
      featured: false,
      content: [
        'Centro de pesquisa biomédica de 6.800m² para universidade pública paulista, abrigando 12 laboratórios de diferentes níveis de biossegurança (BSL-1 a BSL-3), 40 escritórios de pesquisa, sala de conferências para 120 pessoas, banco de amostras criogênico e área de apoio. O programa técnico é um dos mais complexos da arquitetura especializada.',
        'O projeto de instalações prediais foi o elemento mais crítico: sistemas de pressão negativa nos laboratórios de maior risco, fluxo de ar unidirecional com filtragem HEPA de 99,97%, circuito de vapor para autoclavagem e rede de gases especiais (N₂, CO₂, O₂) com alarmes de pressão e monitoramento 24 horas. Cada laboratório tem UTA dedicada com controle independente de temperatura, umidade e pressão.',
        'A circulação foi projetada em hierarquia rigorosa: corredor limpo para acesso de pessoal e materiais estéreis, corredor sujo para saída de resíduos e materiais contaminados, e circulação de visitantes completamente segregada. Essa separação de fluxos, invisível para quem usa o edifício, é o elemento mais importante para a biossegurança do laboratório.',
        'A fachada do edifício recebeu tratamento especial para controle solar: sistema de brises verticais em alumínio extrudado com lâminas em ângulo calculado para cada orientação, bloqueando a radiação solar direta mas permitindo iluminação natural difusa nos escritórios. O resultado é um edifício que consomé 35% menos energia de climatização do que a referência da norma NBR 16401 para o mesmo programa.',
      ],
    },
  ],

  hospitalar: [
    {
      title: 'Hospital Dia Renascer',
      date: '2024-01-15',
      img: IMGS.hospitalar[0],
      gallery: [IMGS.hospitalar[1], IMGS.hospitalar[2], IMGS.hospitalar[3]],
      featured: true,
      content: [
        'O Hospital Dia Renascer é um centro de tratamento oncológico de 3.400m² projetado com o conceito de humanização radical do ambiente de saúde. O cliente — cooperativa médica com 30 anos de história — partiu da premissa de que o ambiente físico é variável terapêutica, não apenas container para procedimentos, e investiu proporcionalmente nessa crença.',
        'A recepção e sala de espera foram projetadas com referência em lobbies de hotel de luxo, não em ambientes clínicos: pé-direito de 5m com jardim vertical de 40m², luz natural zenital, sofás em tecido natural, música ambiente com curadoria de musicoterapia, café gratuito em display permanente. Pesquisas de satisfação mostram que 94% dos pacientes relatam redução percebida de ansiedade antes do atendimento.',
        'As salas de quimioterapia — chamadas internamente de "suítes de tratamento" — foram projetadas com cadeiras reclináveis em couro natural, televisão por demanda, vista para jardim externo e sistema de iluminação circadiana que simula a evolução da luz natural ao longo das sessões de tratamento de 4 a 6 horas. A temperatura é controlada individualmente por cada paciente via painel touchscreen.',
        'O projeto recebeu certificação WELL Building Standard Gold — a primeira certificação dessa categoria em estabelecimento de saúde no estado de São Paulo. Os parâmetros avaliados incluem qualidade do ar, qualidade da água, iluminação, conforto acústico, conforto térmico, atividade física e saúde mental. O Hospital Dia Renascer tornou-se referência nacional em arquitetura hospitalar humanizada.',
      ],
    },
    {
      title: 'Clínica Integrada Saúde+',
      date: '2023-11-01',
      img: IMGS.hospitalar[1],
      gallery: [IMGS.hospitalar[2], IMGS.hospitalar[4], IMGS.hospitalar[0]],
      featured: true,
      content: [
        'Projeto de clínica multiespecialidade de 1.800m² com 20 consultórios, centro cirúrgico ambulatorial com 3 salas, UTI de 8 leitos, área de diagnóstico por imagem e farmácia própria. O programa técnico exigiu domínio de normas complexas: RDC 50 da ANVISA, NBR 7256 de climatização de ambientes críticos e requisitos de biossegurança para procedimentos invasivos.',
        'O layout seguiu o conceito de fluxo zonal: zona de acesso público (recepção, espera, sanitários), zona semi-restrita (consultórios, ambulatório), zona restrita (cirúrgico, UTI) e zona de apoio técnico (esterilização, farmácia, almoxarifado). As barreiras entre zonas foram resolvidas com antecâmaras de pressurização diferencial — sem portas ou grades que criam obstáculos operacionais.',
        'O centro cirúrgico é o coração técnico do projeto: três salas com nível de assepsia ISO 5, iluminação cirúrgica com luminância de 100.000 lux no campo operatório, sistema de suspensão com coluna multifuncional para posicionamento de equipamentos e gases medicinais, e piso antiestático condutivo em todos os ambientes com equipamentos elétricos. A central de esterilização é adjacente e conectada por transfer window.',
        'A experiência do paciente recebeu atenção incomum para o programa clínico: sistema de orientação visual em todos os corredores elimina a necessidade de perguntar ao staff, cada consultório tem janela para área verde interna independentemente de sua posição na planta, e o sistema de chamada por senha com painel de acompanhamento em tempo real reduz a ansiedade da espera. Detalhes que custam pouco e impactam muito a percepção de qualidade.',
      ],
    },
    {
      title: 'UPA 24h — Projeto Referência',
      date: '2024-03-01',
      img: IMGS.hospitalar[2],
      gallery: [IMGS.hospitalar[3], IMGS.hospitalar[5], IMGS.hospitalar[1]],
      featured: false,
      content: [
        'Projeto de Unidade de Pronto Atendimento 24h para município de 400.000 habitantes no interior de São Paulo, com área de 2.800m² seguindo o porte V do Ministério da Saúde. O edifício foi projetado como referência construtiva para replicação em outros municípios do estado — requisito que definiu escolhas por sistemas construtivos padronizados e materiais de alta disponibilidade no mercado regional.',
        'O programa de saúde foi organizado a partir do fluxo de emergência: pré-triagem com acesso de ambulâncias coberto e desobstruído, sala de triagem de Manchester com 4 boxes, sala de espera estratificada por risco, sala de estabilização, consultórios de urgência, sala de observação com 20 leitos, pediatria separada com acesso próprio e área de apoio técnico.',
        'O projeto estrutural em concreto pré-moldado foi escolhido pela velocidade de execução — 12 meses da fundação à entrega — e pela facilidade de manutenção futura. As instalações foram projetadas em shafts verticais de acesso fácil sem abrir lajes, com toda a distribuição horizontal em forro removível de gesso acartonado. Isso permite manutenção sem interrupção dos atendimentos.',
        'A biossegurança operacional foi prioridade: piso vinílico heterogêneo com solda química nas emendas (sem frestas para acúmulo de micro-organismos), paredes em tinta epóxi lavável, luminárias com fechamento hermético facilmente removíveis para limpeza e bancadas em aço inox com cantos arredondados. O projeto foi aprovado pela Vigilância Sanitária Estadual sem nenhuma exigência de adequação — dado raro em programas hospitalares.',
      ],
    },
    {
      title: 'Centro de Reabilitação Movimento',
      date: '2023-06-01',
      img: IMGS.hospitalar[3],
      gallery: [IMGS.hospitalar[4], IMGS.hospitalar[6], IMGS.hospitalar[2]],
      featured: false,
      content: [
        'Centro de reabilitação física e neurológica de 2.200m² para 150 pacientes por dia, com piscina terapêutica, ginásio de fisioterapia, salas de terapia ocupacional, fonoaudiologia e neuropsicologia, além de área de convivência e apoio familiar. O projeto foi concebido em torno das necessidades de mobilidade dos pacientes — muitos usuários de cadeira de rodas, muletas ou com limitações motoras severas.',
        'Cada decisão projetual foi avaliada pelo critério de usabilidade para pessoas com deficiência motora severa: rampas com inclinação máxima de 5%, portas com largura mínima de 1m, barras de apoio em todos os corredores e sanitários, piso tátil em todos os percursos e balizadores de luz embutidos no rodapé para orientação em situações de baixa iluminação. O projeto excede os requisitos da NBR 9050 em todos os itens.',
        'A piscina terapêutica de 10mx6m com raia interna tem elevador de acesso para pacientes sem deambulação, piso antiderrapante certificado e sistema de aquecimento da água a 32-34°C. A área de banho e troca foi dimensionada para acesso simultâneo de cadeira de rodas e acompanhante — 4m² por box, o dobro do mínimo normativo. O projeto da área aquática envolveu consultores especializados em hidrologia terapêutica.',
        'A área de convivência e apoio familiar foi dimensionada generosamente: sala de espera com 80 lugares, área de alimentação com cozinha compartilhada, espaço de leitura e televisão, e uma varanda com jardim de contemplação. Familiares que acompanham pacientes em sessões longas precisam de espaço de qualidade — necessidade frequentemente ignorada em programas de saúde que foi tratada aqui com a mesma seriedade dos ambientes clínicos.',
      ],
    },
    {
      title: 'Maternidade Família Luz',
      date: '2024-05-01',
      img: IMGS.hospitalar[4],
      gallery: [IMGS.hospitalar[5], IMGS.hospitalar[7], IMGS.hospitalar[3]],
      featured: true,
      content: [
        'Maternidade de médio porte com 60 leitos em São Paulo, projetada a partir do conceito de parto humanizado: suítes de pré-parto, parto e pós-parto (PPP) que permitem que toda a jornada do nascimento aconteça em um único ambiente, sem transferência da parturiente para diferentes salas. Esse modelo, referência em países nórdicos, foi aplicado pela primeira vez em escala no Brasil neste projeto.',
        'As 20 suítes PPP foram projetadas como quartos de hotel de alto padrão com capacidade cirúrgica: banheira de parturição embutida, poltronas para família, berço aquecido integrado ao layout, iluminação regulável de 100% (do ambiente íntimo para iluminação clínica de 1000 lux em segundos), piso em vinílico aquecido e suporte estrutural invisível para instalação de barra de parede para posições de parto.',
        'A UTI Neonatal de 20 leitos foi projetada com o modelo de cuidado individualizado: cada incubadora em box semi-privativo com cortinas, poltrona para kangaroo care 24h, tomadas e acesso a internet para os pais, e iluminação individual com dimmer. A filosofia de projeto priorizou a presença constante da família como fator terapêutico comprovado pela literatura científica.',
        'O ambiente externo da maternidade recebe atenção especial: jardim de meditação acessível 24h, galeria de arte no corredor principal com obras de artistas locais renovadas trimestralmente, e curadoria de aromas com difusores de óleos essenciais nos corredores de circulação pública. Detalhes sensoriais que custam menos de 1% do orçamento de obra e têm impacto documentado na percepção de qualidade pela clientela.',
      ],
    },
    {
      title: 'Instituto de Saúde Mental Equilibrium',
      date: '2023-09-01',
      img: IMGS.hospitalar[5],
      gallery: [IMGS.hospitalar[6], IMGS.hospitalar[0], IMGS.hospitalar[4]],
      featured: false,
      content: [
        'Instituto de saúde mental com 40 leitos de internação psiquiátrica, hospital dia com 60 vagas e ambulatório com 15 consultórios, totalizando 4.200m². A arquitetura de estabelecimentos psiquiátricos tem desafios específicos que exigem equilíbrio delicado entre segurança e ambiente terapêutico não opressor — uma linha tênue que este projeto buscou com rigor.',
        'Os quartos de internação foram projetados com mobiliário fixo sem peças removíveis ou pontos de ancoragem inadequados, janelas com vidro aramado de abertura limitada e sistema de travamento central, e banheiros com torneiras e acessórios de segurança específicos para o programa. Todas essas exigências de segurança foram resolvidas dentro de uma estética limpa e não institucional — madeira clara, cores suaves e iluminação indireta criam ambiente de recuperação, não de confinamento.',
        'Os espaços terapêuticos coletivos receberam particular atenção: espaço de convivência com jardim interno visível, sala de terapia ocupacional com ateliê de artes, sala de musicoterapia com isolamento acústico e sala de terapia física com pé-direito alto e luz natural abundante. Esses ambientes comunicam que a jornada de recuperação acontece em um lugar de cuidado genuíno.',
        'A área externa de 1.800m² tem percurso de caminhada de 400m, horta terapêutica, espaço de meditação e campo de futebol — atividades ao ar livre são parte essencial do protocolo terapêutico e o projeto as suporta com qualidade de espaço. A cerca perimetral foi projetada como jardim vertical de 2,4m que delimita sem criar sensação de aprisionamento. O projeto recebeu aprovação da Vigilância Sanitária e menção honrosa do IAB-SP na categoria Arquitetura Hospitalar.',
      ],
    },
  ],

  industrial: [
    {
      title: 'Planta Logística Rápido — Cajamar',
      date: '2024-02-01',
      img: IMGS.industrial[0],
      gallery: [IMGS.industrial[1], IMGS.industrial[2], IMGS.industrial[3]],
      featured: true,
      content: [
        'Centro de distribuição de 28.000m² de área construída em terreno de 60.000m² em Cajamar, projetado para operadora logística com foco em e-commerce de alta rotatividade. O programa incluiu galpão principal de armazenagem seca, área frigorificada de 3.000m² para produtos perecíveis, plataforma de expedição com 40 docas, área administrativa de 1.200m² e infraestrutura de apoio operacional.',
        'O projeto estrutural utilizou pré-moldado de concreto para o galpão principal: estrutura de pilares em 12m x 24m com vigas treliçadas de 24m de vão livre — nenhuma coluna interna que limita o layout operacional. O pé-direito livre de 12m permite a utilização de sistemas de armazenagem vertical automáticos (AS/RS) até 10 níveis de altura, maximizando o volume de armazenagem por metro quadrado de área ocupada.',
        'A cobertura de 28.000m² foi projetada para suportar carregamento futuro de painéis fotovoltaicos de 2MW de capacidade: estrutura de treliça dimensionada com 30% de sobrecarga, além dos conectores de montagem dos painéis embutidos nas vigas durante a execução. A instalação fotovoltaica foi executada seis meses após a inauguração do galpão e hoje supre 65% do consumo energético da operação.',
        'O sistema de combate a incêndio foi projetado conforme NFPA 13 para armazenagem acima de 7m de altura: sprinklers de alta demanda com reservatório de 600m³, bomba jockey, bomba principal elétrica e bomba de emergência a diesel. A detecção é por sistema VESDA (aspiração de ar) que detecta partículas de fumaça em concentração 1000x menor que detectores convencionais, garantindo tempo de resposta antes do foco de incêndio crescer.',
      ],
    },
    {
      title: 'Fábrica Sustentável Ecopack',
      date: '2023-10-01',
      img: IMGS.industrial[1],
      gallery: [IMGS.industrial[2], IMGS.industrial[4], IMGS.industrial[0]],
      featured: true,
      content: [
        'Fábrica de embalagens biodegradáveis de 12.000m² em São José dos Campos, projetada com meta de certificação LEED Industrial Gold. A empresa posiciona sua sustentabilidade como diferencial competitivo e precisava que a planta física comunicasse esses valores — o edifício como manifesto arquitetônico dos princípios da empresa.',
        'O projeto optou por iluminação natural como princípio organizador: sheds zenitais cobrem 40% da área do piso industrial, garantindo 500 lux de iluminação natural nas linhas de produção durante 8 horas por dia. Essa escolha reduziu 60% do consumo de energia elétrica para iluminação e, segundo pesquisa com operadores, aumentou 18% a percepção de bem-estar e redução de fadiga visual durante o turno.',
        'O sistema de gestão de água foi desenvolvido para ciclo quase fechado: o processo produtivo utiliza 8.000 litros por hora de água desmineralizada, que após tratamento de efluentes retorna 75% ao processo. A água residual tratada abastece toda a descarga sanitária e irrigação. O consumo de água potável per capita na fábrica é 40% menor que a referência do setor para o mesmo processo.',
        'O paisagismo externo foi integrado ao programa de gestão ambiental: 3.200m² de jardim nativo com espécies da Mata Atlântica circundam o edifício, criando corredor ecológico entre fragmentos de vegetação remanescente. Uma estação de monitoramento de biodiversidade instalada no jardim registra automaticamente presença de aves, borboletas e outros bioindicadores — dados publicados mensalmente no relatório de sustentabilidade da empresa.',
      ],
    },
    {
      title: 'Galpão Multimódulo Flex',
      date: '2024-04-01',
      img: IMGS.industrial[2],
      gallery: [IMGS.industrial[3], IMGS.industrial[5], IMGS.industrial[1]],
      featured: false,
      content: [
        'Projeto de galpão industrial multimódulo de 15.000m² subdivisível em unidades de 500m² para locação flexível, em condomínio industrial em Itapevi. O desafio do projeto era criar um edifício economicamente eficiente de construir (low-cost) mas com qualidade de acabamento e infraestrutura que justificasse preço-prêmio de locação no mercado.',
        'A estrutura em steel frame com fechamento em painel de PVC (wall sandwich) foi escolhida pela velocidade de execução e custo 30% menor que pré-moldado de concreto para o programa. Cada módulo de 500m² tem pé-direito livre de 9m, uma doca exclusiva, escritório de 30m² integrado em mezanino e sanitários masculino e feminino. A subdivisão é possível por paredes de divisória deslizante com isolamento acústico e térmico.',
        'A infraestrutura foi projetada em escala de condomínio: subestação de 1,5MVA com ramal dedicado para cada módulo e medição individual, rede de sprinklers dimensionada para risco médio com distribuição por módulo, sistema CCTV central com acesso remoto por cada locatário, e portaria com controle de acesso biométrico integrado ao sistema de câmeras.',
        'Os módulos receberam acabamento diferenciado para o segmento light industrial: piso de concreto com endurecedor superficial de 6 MPa e planeza F-min 25, paredes internas em pintura epóxi branca, iluminação em LED 200W com sensor de presença e luminância de 300 lux no piso. Esse padrão de acabamento, raro para galpões de locação, resultou em ocupação de 100% em menos de 90 dias após a entrega.',
      ],
    },
    {
      title: 'Centro de Dados Tier III — Barueri',
      date: '2023-08-01',
      img: IMGS.industrial[3],
      gallery: [IMGS.industrial[4], IMGS.industrial[6], IMGS.industrial[2]],
      featured: false,
      content: [
        'Data center de 4.800m² em Barueri com 2.400m² de whitespace certificado Tier III pelo Uptime Institute, capacidade instalada de 12MW e resfriamento por free cooling evaporativo. O projeto envolveu desenvolvimento detalhado em BIM com modelo federado integrando estrutura, instalações elétricas, mecânicas e hidráulicas — essencial para gerenciar a densidade de infraestrutura em cada metro quadrado.',
        'O sistema de energia foi projetado em redundância N+1 em todos os níveis críticos: dois alimentadores de concessionária em subestações distintas, banco de baterias de lítio com autonomia de 10 minutos por sala e grupo gerador a diesel com autonomia de 72 horas com tanques cheios. O tempo médio de comutação entre energia primária e geradores é inferior a 16 milissegundos — critério crítico para sistemas de computação sensíveis a microinterrupções.',
        'O resfriamento por free cooling utiliza a diferença de temperatura entre o ar externo e o ar interno do data center para resfriar diretamente os equipamentos durante parte do ano, reduzindo o uso de compressores. O PUE (Power Usage Effectiveness) projetado é 1,4 — 30% mais eficiente que a média brasileira de 1,6. Nos meses de inverno, o PUE cai para 1,2 com uso predominante de free cooling.',
        'O projeto de biossegurança inclui sistema de detecção de incêndio VESDA com dupla tecnologia (aspiração + linear beam), sistema de supressão com gás Novec 1230 (zero impacto climático comparado a FM-200), salas com pressurização positiva para controle de particulado e monitoramento de 72 parâmetros em tempo real em sala de NOC dedicada. Todos os sistemas de segurança foram testados em simulação antes da aceitação do cliente.',
      ],
    },
    {
      title: 'Refinaria de Biodiesel — Interior SP',
      date: '2023-05-01',
      img: IMGS.industrial[4],
      gallery: [IMGS.industrial[5], IMGS.industrial[7], IMGS.industrial[3]],
      featured: true,
      content: [
        'Projeto arquitetônico e de implantação para planta de produção de biodiesel de 200.000 toneladas por ano em Ribeirão Preto, em terreno industrial de 120.000m². O programa inclui planta de reação e purificação, silos de armazenagem de matéria-prima, tanques de produto acabado, laboratório de controle de qualidade, administração e infraestrutura de utilidades.',
        'A implantação foi desenvolvida em conjunto com o projeto de processo, seguindo os princípios de engenharia de layout industrial: fluxo unidirecional de matéria-prima a produto acabado, afastamentos de segurança entre unidades conforme norma ABNT NBR 17505, zoneamento de áreas classificadas para risco de explosão (ATEX) e segregação de fluxo de veículos de matéria-prima e produto acabado.',
        'O laboratório de controle de qualidade de 400m² foi projetado para análises cromatográficas, espectrométricas e de propriedades físico-químicas: bancadas em granito preto com cuba de lavagem inox em cada bancada, capelas de exaustão classe A em todas as posições de uso de reagentes voláteis, sistema de ar condicionado de precisão (±0,5°C e ±5% UR) e piso em vinil antiestático condutivo.',
        'A construção civil executou as estruturas de concreto no padrão de resistência ao fogo REI-120, exigido para compartimentos de processo com líquidos inflamáveis. O projeto de canaletas de contenção dimensionou o volume para 110% do maior vaso da área, conforme exigência da Cetesb para licença ambiental. Todo o projeto foi desenvolvido em coordenação com o CBPMESP e Cetesb desde a fase de anteprojeto, garantindo aprovação sem pendências.',
      ],
    },
    {
      title: 'Complexo Têxtil Moderna — Americana',
      date: '2024-06-15',
      img: IMGS.industrial[5],
      gallery: [IMGS.industrial[6], IMGS.industrial[0], IMGS.industrial[4]],
      featured: false,
      content: [
        'Ampliação e modernização de complexo industrial têxtil histórico em Americana, com 22.000m² de área reformada e 8.000m² de área nova construída. A empresa tem 80 anos de história e a intervenção precisou modernizar os processos produtivos sem parar a fábrica — desafio logístico que definiu o partido construtivo em fases sequenciais.',
        'A fase 1 construiu o novo galpão de tecelagem de 8.000m² com pré-moldado de concreto, pé-direito de 10m para instalação de teares de alta tecnologia e piso de alta planeza F-min 35 para movimentação de AVGs (veículos guiados automaticamente). Antes da inauguração do novo galpão, as operações foram transferidas de forma escalonada, liberando os galpões antigos para reforma.',
        'A reforma dos galpões existentes de tijolos maciços de 1940 manteve a estrutura original e o telhado em shed de madeira — patrimônio industrial preservado pela empresa por valor histórico e funcional. O shed original, com orientação norte-sul, garante iluminação natural difusa ideal para inspeção visual de tecidos — qualidade impossível de replicar com iluminação artificial. As instalações foram totalmente renovadas com passagem em canaletas elevadas, sem interferir na fundação original.',
        'O projeto incluiu redesenho completo da área de bem-estar dos colaboradores: refeitório de 600m² com cozinha industrial nova, 4 vestiários de 120m² cada com armários individuais com carga USB, área de descanso ao ar livre com cobertura tensionada e jardim com gramado natural. A empresa investiu 15% do orçamento total na qualidade dos espaços dos colaboradores — decisão que resultou em redução de 40% na rotatividade de pessoal no primeiro ano após a conclusão das obras.',
      ],
    },
  ],
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const TENANT_SLUG = 'arquiteturaorganizada'

  const { data: tenant, error } = await admin
    .from('tenants')
    .select('id, slug, plan')
    .eq('slug', TENANT_SLUG)
    .single()

  if (error || !tenant) {
    console.error(`Tenant "${TENANT_SLUG}" não encontrado:`, error?.message)
    process.exit(1)
  }

  console.log(`✓ Tenant: ${tenant.slug} (${tenant.id}) — plano: ${tenant.plan}`)

  // Categorias existentes
  const { data: existingCats } = await admin
    .from('categories')
    .select('slug, id, order_index')
    .eq('tenant_id', tenant.id)

  const existingSlugs = new Set((existingCats ?? []).map(c => c.slug))
  const maxOrder = Math.max(...(existingCats ?? []).map(c => c.order_index ?? 0), -1)

  console.log(`  Categorias existentes: ${[...existingSlugs].join(', ') || 'nenhuma'}`)

  // Inserir categorias novas
  const newCats = CATEGORIES
    .filter(c => !existingSlugs.has(c.slug))
    .map((c, i) => ({ ...c, tenant_id: tenant.id, order_index: maxOrder + 1 + i }))

  let insertedCats: { id: string; slug: string }[] = []
  if (newCats.length > 0) {
    const { data, error: catErr } = await admin
      .from('categories')
      .insert(newCats)
      .select('id, slug')
    if (catErr) { console.error('Erro ao criar categorias:', catErr.message); process.exit(1) }
    insertedCats = data ?? []
    console.log(`  + Categorias criadas: ${insertedCats.map(c => c.slug).join(', ')}`)
  } else {
    console.log('  Nenhuma categoria nova.')
  }

  const allCats: { id: string; slug: string }[] = [
    ...(existingCats ?? []).map(c => ({ id: c.id, slug: c.slug })),
    ...insertedCats,
  ]
  const catMap = Object.fromEntries(allCats.map(c => [c.slug, c.id]))

  // Inserir projetos
  let totalInserted = 0
  for (const [catSlug, projects] of Object.entries(PROJECTS)) {
    const categoryId = catMap[catSlug]
    if (!categoryId) {
      console.log(`  ⚠ Categoria "${catSlug}" não encontrada, pulando.`)
      continue
    }

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
