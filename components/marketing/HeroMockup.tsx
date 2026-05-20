'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Monitor, Smartphone } from 'lucide-react'

/* ── images ──────────────────────────────────────────────────────────────── */
const IMG = {
  r1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  r2: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  r3: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&q=80',
  r4: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  r5: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
  c1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  c2: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
  c3: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80',
  av1: 'https://i.pravatar.cc/80?img=44',
  av2: 'https://i.pravatar.cc/80?img=12',
  av3: 'https://i.pravatar.cc/80?img=20',
  av4: 'https://i.pravatar.cc/80?img=33',
  av5: 'https://i.pravatar.cc/80?img=48',
  av6: 'https://i.pravatar.cc/80?img=60',
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <div className="flex flex-col leading-none gap-[2px]">
      <span className={`text-sm font-bold tracking-widest uppercase ${dark ? 'text-white' : 'text-neutral-900'}`}>Arquitetura</span>
      <span className={`text-[9px] font-medium tracking-[0.25em] uppercase self-end ${dark ? 'text-white/40' : 'text-neutral-400'}`}>organizada</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   DESKTOP PAGE — 1280px wide
══════════════════════════════════════════════════════════════════════════ */
function DesktopPage() {
  return (
    <div style={{ width: 1280, background: '#fff' }}>
      <nav style={{ height: 64, borderBottom: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['Projetos','Depoimentos','FAQ'].map(l => <span key={l} className="text-sm text-neutral-600">{l}</span>)}
          <span className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg">Contato</span>
        </div>
      </nav>
      <div style={{ height: 780, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.r1} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)' }} />
        </div>
        <div style={{ width: 208, display: 'flex', flexDirection: 'column' }}>
          {[IMG.r1,IMG.r2,IMG.r3,IMG.r4,IMG.r5].map((src, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden', opacity: i === 0 ? 1 : 0.35 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
              {i === 0 && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'white' }} />}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                <p style={{ color: 'white', fontSize: 11, fontWeight: 500 }}>{['Residência Serra','Apt Jardins','Casa Contemporânea','Cobertura Duplex','Casa de Campo'][i]}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', paddingLeft: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Residencial</p>
            <h1 style={{ fontSize: 64, fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 32 }}>Residência Serra</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Ver Projeto</span>
            </div>
          </div>
        </div>
      </div>
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 className="text-4xl font-bold text-neutral-900 text-center" style={{ marginBottom: 64 }}>Nossos Projetos</h2>
          {[
            { label: 'Residencial', desc: 'Residências projetadas para refletir a identidade de cada família.', img: IMG.r1, items: [
              {src:IMG.r1,t:'Residência Serra',    date:'Jan 2023',excerpt:'Projeto de alto padrão com integração entre interior e paisagismo.'},
              {src:IMG.r2,t:'Apt Jardins',          date:'Mar 2023',excerpt:'Apartamento com planta aberta e materiais nobres.'},
              {src:IMG.r3,t:'Casa Contemporânea',   date:'Jun 2023',excerpt:'Volumes limpos e iluminação natural como protagonistas.'},
              {src:IMG.r4,t:'Cobertura Duplex',     date:'Set 2023',excerpt:'Cobertura com terraço gourmet e vista panorâmica.'},
            ]},
            { label: 'Comercial', desc: 'Ambientes corporativos e gastronômicos que unem estética e função.', img: IMG.c1, items: [
              {src:IMG.c1,t:'Escritório Corp.',     date:'Fev 2023',excerpt:'Open space com zonas de colaboração e foco.'},
              {src:IMG.c2,t:'Restaurante',           date:'Abr 2023',excerpt:'Identidade visual forte com materiais sustentáveis.'},
              {src:IMG.c3,t:'Clínica Médica',        date:'Jul 2023',excerpt:'Ambiente acolhedor que transmite confiança e modernidade.'},
              {src:IMG.c1,t:'Loja Conceito',         date:'Nov 2023',excerpt:'Espaço de varejo com experiência sensorial imersiva.'},
            ]},
          ].map(cat => (
            <div key={cat.label} style={{ marginBottom: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.img} alt="" loading="lazy" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <h3 className="text-2xl font-semibold text-neutral-900">{cat.label}</h3>
                    <span className="text-neutral-400 text-sm">→</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{cat.desc}</p>
                  <p className="text-xs text-neutral-400 mt-1">5 projetos</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
                {cat.items.map((p, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p className="font-medium text-neutral-900 text-sm" style={{ marginBottom: 4 }}>{p.t}</p>
                      <p className="text-xs text-neutral-400" style={{ marginBottom: 6 }}>{p.date}</p>
                      <p className="text-sm text-neutral-500" style={{ fontSize: 12, lineHeight: 1.5 }}>{p.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, border: '1px solid #d1d5db', color: '#404040', padding: '8px 16px', borderRadius: 8 }}>
                  Ver todos de {cat.label} <span style={{ fontSize: 11 }}>→</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#171717', color: 'white', fontSize: 14, fontWeight: 500, padding: '12px 32px', borderRadius: 999 }}>
              Exibir Todos os Projetos →
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: '64px 24px', background: '#171717' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 12 }}>Transforme seu espaço com a Arquitetura Organizada</h2>
          <p style={{ fontSize: 16, color: '#a3a3a3', marginBottom: 40 }}>Entre em contato e vamos criar juntos um projeto único para você.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'white', color: '#171717', padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 500 }}>Fale Conosco →</div>
        </div>
      </section>
      <section style={{ padding: '96px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 48 }}>O que dizem nossos clientes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { av: IMG.av1, name: 'Mariana Costa',   role: 'Cliente residencial', text: '"O projeto superou todas as expectativas, com atenção aos mínimos detalhes e total respeito ao nosso estilo de vida."' },
              { av: IMG.av2, name: 'Rafael Mendes',   role: 'Cliente comercial',   text: '"Produtividade aumentou, a equipe adorou o espaço e os clientes sempre elogiam o ambiente."' },
              { av: IMG.av3, name: 'Juliana Alves',   role: 'Cliente residencial', text: '"Do conceito à entrega, cada etapa foi conduzida com clareza e criatividade."' },
              { av: IMG.av4, name: 'Carlos Ferreira', role: 'Cliente comercial',   text: '"Resultado incrível. O escritório ficou exatamente como imaginamos, mas melhor."' },
              { av: IMG.av5, name: 'Ana Beatriz',     role: 'Cliente residencial', text: '"Profissionalismo e criatividade em cada detalhe. Recomendo muito."' },
              { av: IMG.av6, name: 'Pedro Henrique',  role: 'Cliente residencial', text: '"A equipe foi atenciosa durante todo o processo. O resultado é simplesmente lindo."' },
            ].map(t => (
              <div key={t.name} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24 }}>
                <p className="text-sm text-neutral-600 leading-relaxed" style={{ marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.av} alt="" loading="lazy" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 48 }}>Perguntas Frequentes</h2>
          {['Qual é o prazo médio de um projeto?','Como funciona o processo de contratação?','Vocês acompanham a execução da obra?','O projeto inclui especificação de materiais?','Vocês atendem em todo o Brasil?'].map((q, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === 0 ? 'none' : '1px solid #f5f5f5', padding: '20px 0', paddingBottom: i === 0 ? 8 : 20 }}>
                <span className="text-neutral-800 font-medium">{q}</span>
                <span className="text-neutral-400 text-xl">{i === 0 ? '−' : '+'}</span>
              </div>
              {i === 0 && (
                <div style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: 20 }}>
                  <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.7 }}>Projetos residenciais levam em média 30 a 60 dias, dependendo da complexidade, número de ambientes e aprovações necessárias.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section style={{ padding: '96px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 8 }}>Entre em Contato</h2>
          <p style={{ fontSize: 15, color: '#737373', textAlign: 'center', marginBottom: 40 }}>Adoramos novos projetos. Conte-nos sobre o seu.</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid #171717', color: '#171717', fontSize: 13, fontWeight: 500, padding: '12px 0', borderRadius: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#171717', color: 'white', fontSize: 13, fontWeight: 500, padding: '12px 0', borderRadius: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['Nome','Seu nome'],['Email','seu@email.com']].map(([label, ph]) => (
              <div key={label}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>{label}</p>
                <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#9ca3af', background: 'white' }}>{ph}</div>
              </div>
            ))}
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Mensagem</p>
              <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#9ca3af', background: 'white', height: 100 }}>Conte-nos sobre seu projeto...</div>
            </div>
            <div style={{ background: '#171717', color: 'white', padding: '14px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 500 }}>Enviar Mensagem</div>
          </div>
        </div>
      </section>
      <footer style={{ background: '#171717', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo dark />
          <div style={{ display: 'flex', gap: 24 }}>
            {['Projetos','Contato','FAQ'].map(l => <span key={l} style={{ fontSize: 12, color: '#525252' }}>{l}</span>)}
          </div>
          <span style={{ fontSize: 12, color: '#404040' }}>© 2025 Arquitetura Organizada</span>
        </div>
      </footer>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE PAGE — 390px wide
══════════════════════════════════════════════════════════════════════════ */
function MobilePage() {
  return (
    <div style={{ width: 390, background: '#fff' }}>
      <div style={{ height: 50, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #f5f5f5' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="#171717">
            <rect x="0" y="8" width="3" height="4" rx="0.5" /><rect x="4.5" y="5" width="3" height="7" rx="0.5" /><rect x="9" y="2" width="3" height="10" rx="0.5" /><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 24 18" fill="none" stroke="#171717" strokeWidth="2.5" strokeLinecap="round">
            <path d="M1 6C5.4 1.5 10.5 0 12 0s6.6 1.5 11 6" opacity="0.3"/><path d="M4 10c2.2-2.5 4.8-4 8-4s5.8 1.5 8 4"/><path d="M7.5 14c1.2-1.5 2.7-2.5 4.5-2.5s3.3 1 4.5 2.5"/><circle cx="12" cy="17" r="1.5" fill="#171717" stroke="none"/>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <div style={{ width: 22, height: 11, border: '1.5px solid #171717', borderRadius: 3, padding: 1.5, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '80%', height: '100%', background: '#171717', borderRadius: 1.5 }} />
            </div>
            <div style={{ width: 2, height: 5, background: '#171717', borderRadius: 1 }} />
          </div>
        </div>
      </div>
      <nav style={{ height: 64, borderBottom: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <Logo />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2, background: '#171717', borderRadius: 1 }} />)}
        </div>
      </nav>
      <div style={{ height: 680, position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.r1} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: '0 32px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Residencial</p>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>Residência Serra</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '10px 24px', borderRadius: 999, fontSize: 13 }}>Ver Projeto →</div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 6, borderRadius: 999, background: 'white' }} />
          {[0,1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.4)' }} />)}
        </div>
      </div>
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 48 }}>Nossos Projetos</h2>
        {[
          { label: 'Residencial', desc: 'Residências projetadas para refletir a identidade de cada família.', img: IMG.r1, items: [
            {src:IMG.r1,t:'Residência Serra',  date:'Jan 2023',excerpt:'Projeto de alto padrão com integração entre interior e paisagismo.'},
            {src:IMG.r2,t:'Apt Jardins',        date:'Mar 2023',excerpt:'Apartamento com planta aberta e materiais nobres.'},
          ]},
          { label: 'Comercial', desc: 'Ambientes corporativos e gastronômicos que unem estética e função.', img: IMG.c1, items: [
            {src:IMG.c1,t:'Escritório Corp.',  date:'Fev 2023',excerpt:'Open space com zonas de colaboração e foco.'},
            {src:IMG.c2,t:'Restaurante',        date:'Abr 2023',excerpt:'Identidade visual forte com materiais sustentáveis.'},
          ]},
        ].map(cat => (
          <div key={cat.label} style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.img} alt="" loading="lazy" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: '#171717' }}>{cat.label}</span>
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>→</span>
                </div>
                <p style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>{cat.desc}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>5 projetos</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cat.items.map((p, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontWeight: 500, color: '#171717', fontSize: 14, marginBottom: 3 }}>{p.t}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 5 }}>{p.date}</p>
                    <p style={{ fontSize: 12, color: '#737373', lineHeight: 1.5 }}>{p.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, border: '1px solid #d1d5db', color: '#525252', padding: '7px 14px', borderRadius: 8 }}>
                Ver todos de {cat.label} <span style={{ fontSize: 10 }}>→</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#171717', color: 'white', fontSize: 13, fontWeight: 500, padding: '11px 28px', borderRadius: 999 }}>
            Exibir Todos os Projetos →
          </div>
        </div>
      </section>
      <section style={{ padding: '64px 24px', background: '#171717' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: 12 }}>Transforme seu espaço com a Arquitetura Organizada</h2>
        <p style={{ fontSize: 13, color: '#a3a3a3', textAlign: 'center', marginBottom: 32 }}>Entre em contato e vamos criar juntos um projeto único para você.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'white', color: '#171717', padding: '13px 28px', borderRadius: 999, fontSize: 14, fontWeight: 500 }}>Fale Conosco →</div>
        </div>
      </section>
      <section style={{ padding: '64px 24px', background: '#fafafa' }}>
        <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 32 }}>O que dizem nossos clientes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { av: IMG.av1, name: 'Mariana Costa',   role: 'Cliente residencial', text: '"O projeto superou todas as expectativas, com atenção aos mínimos detalhes."' },
            { av: IMG.av2, name: 'Rafael Mendes',   role: 'Cliente comercial',   text: '"Produtividade aumentou, a equipe adorou o espaço e os clientes sempre elogiam."' },
            { av: IMG.av4, name: 'Carlos Ferreira', role: 'Cliente comercial',   text: '"Resultado incrível. O escritório ficou exatamente como imaginamos, mas melhor."' },
            { av: IMG.av5, name: 'Ana Beatriz',     role: 'Cliente residencial', text: '"Profissionalismo e criatividade em cada detalhe. Recomendo muito."' },
          ].map(t => (
            <div key={t.name} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20 }}>
              <p className="text-sm text-neutral-600 leading-relaxed" style={{ marginBottom: 16 }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.av} alt="" loading="lazy" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 32 }}>Perguntas Frequentes</h2>
        {['Qual o prazo médio?','Como funciona a contratação?','Acompanham a obra?','O projeto inclui materiais?','Atendem fora do estado?'].map((q, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === 0 ? 'none' : '1px solid #f5f5f5', padding: '18px 0', paddingBottom: i === 0 ? 6 : 18 }}>
              <span className="text-neutral-800">{q}</span>
              <span className="text-neutral-400 text-xl">{i === 0 ? '−' : '+'}</span>
            </div>
            {i === 0 && (
              <div style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: 18 }}>
                <p style={{ fontSize: 13, color: '#737373', lineHeight: 1.6 }}>Projetos residenciais levam em média 30 a 60 dias, dependendo da complexidade e aprovações necessárias.</p>
              </div>
            )}
          </div>
        ))}
      </section>
      <section style={{ padding: '64px 24px', background: '#fafafa' }}>
        <h2 className="text-3xl font-bold text-neutral-900 text-center" style={{ marginBottom: 8 }}>Entre em Contato</h2>
        <p style={{ fontSize: 13, color: '#737373', textAlign: 'center', marginBottom: 32 }}>Adoramos novos projetos. Conte-nos sobre o seu.</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid #171717', color: '#171717', fontSize: 12, fontWeight: 500, padding: '11px 0', borderRadius: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#171717', color: 'white', fontSize: 12, fontWeight: 500, padding: '11px 0', borderRadius: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['Nome','Seu nome'],['Email','seu@email.com']].map(([label, ph]) => (
            <div key={label}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>{label}</p>
              <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '11px 14px', fontSize: 12, color: '#9ca3af', background: 'white' }}>{ph}</div>
            </div>
          ))}
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Mensagem</p>
            <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '11px 14px', fontSize: 12, color: '#9ca3af', background: 'white', height: 80 }}>Conte-nos sobre seu projeto...</div>
          </div>
          <div style={{ background: '#171717', color: 'white', padding: '13px 0', borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 500 }}>Enviar Mensagem</div>
        </div>
      </section>
      <footer style={{ background: '#171717', padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Logo dark />
        <div style={{ display: 'flex', gap: 28 }}>
          {['Projetos','Contato','FAQ'].map(l => <span key={l} style={{ fontSize: 12, color: '#525252' }}>{l}</span>)}
        </div>
        <p style={{ fontSize: 11, color: '#404040' }}>© 2025 Arquitetura Organizada</p>
      </footer>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   DRAG-SCROLL HOOK  (com momentum/inércia estilo mobile)
══════════════════════════════════════════════════════════════════════════ */
function useDragScroll(onFirstDrag: () => void) {
  const ref       = useRef<HTMLDivElement>(null)
  const dragging  = useRef(false)
  const startY    = useRef(0)
  const startScroll = useRef(0)
  const hasFired  = useRef(false)
  const lastY     = useRef(0)
  const lastTime  = useRef(0)
  const velocity  = useRef(0)
  const rafId     = useRef<number | null>(null)

  const cancelInertia = () => {
    if (rafId.current !== null) { cancelAnimationFrame(rafId.current); rafId.current = null }
  }

  const launchInertia = useCallback(() => {
    const el = ref.current
    if (!el) return
    let vel = velocity.current
    const tick = () => {
      if (Math.abs(vel) < 0.4) { rafId.current = null; return }
      el.scrollTop += vel
      vel *= 0.93          // friction ~iOS
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
  }, [])

  const stopDrag = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    launchInertia()
  }, [launchInertia])

  // captura mouseup fora do elemento também
  useEffect(() => {
    window.addEventListener('mouseup', stopDrag)
    return () => window.removeEventListener('mouseup', stopDrag)
  }, [stopDrag])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    cancelInertia()
    dragging.current  = true
    startY.current    = e.clientY
    lastY.current     = e.clientY
    startScroll.current = ref.current.scrollTop
    lastTime.current  = performance.now()
    velocity.current  = 0
    e.preventDefault()
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !ref.current) return
    const now = performance.now()
    const dt  = now - lastTime.current
    if (dt > 0) {
      // EMA de velocidade → suaviza jitter
      const rawVel = ((lastY.current - e.clientY) / dt) * 16
      velocity.current = velocity.current * 0.25 + rawVel * 0.75
    }
    lastY.current    = e.clientY
    lastTime.current = now
    const delta = e.clientY - startY.current
    ref.current.scrollTop = startScroll.current - delta
    if (!hasFired.current && Math.abs(delta) > 4) {
      hasFired.current = true
      onFirstDrag()
    }
  }, [onFirstDrag])

  const onMouseUp    = useCallback(() => stopDrag(), [stopDrag])
  const onMouseLeave = useCallback(() => stopDrag(), [stopDrag])

  return { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }
}

/* ══════════════════════════════════════════════════════════════════════════
   SCROLL INDICATOR
══════════════════════════════════════════════════════════════════════════ */
function ScrollHint({ visible, top = 13, contentOffset = 16 }: { visible: boolean; top?: number; contentOffset?: number }) {
  return (
    <div
      style={{
        position: 'absolute', top, left: 0, right: 0, zIndex: 10,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        display: 'flex', justifyContent: 'center',
        paddingTop: contentOffset,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.97) 55%, transparent)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBottom: 24 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: 'bounceHint 1.2s ease-in-out infinite' }}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span style={{ fontSize: 11, color: '#525252', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>Arraste para explorar</span>
      </div>
      <style>{`@keyframes bounceHint{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   TOUCH CURSOR
══════════════════════════════════════════════════════════════════════════ */
function TouchCursor({ x, y, visible, active }: { x: number; y: number; visible: boolean; active: boolean }) {
  return (
    <div style={{
      position: 'fixed', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      width: active ? 48 : 38,
      height: active ? 48 : 38,
      borderRadius: '50%',
      background: active ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)',
      border: `2px solid rgba(0,0,0,${active ? 0.3 : 0.18})`,
      pointerEvents: 'none',
      zIndex: 9999,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.2s, width 0.15s ease-out, height 0.15s ease-out, background 0.15s',
    }} />
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════════ */
export default function HeroMockup() {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    if (window.innerWidth < 768) setView('mobile')
  }, [])
  const [desktopZoom, setDesktopZoom] = useState(0.39)
  const [phoneWidth, setPhoneWidth]   = useState(240)
  const [showHintDesktop, setShowHintDesktop] = useState(true)
  const [mobileScrollTop, setMobileScrollTop] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, active: false })

  const wrapperRef = useRef<HTMLDivElement>(null)
  const dragDesktop = useDragScroll(() => setShowHintDesktop(false))
  const dragMobile  = useDragScroll(() => {})

  const showHintMobile = mobileScrollTop < 30

  // dynamic zoom + phone width
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      setDesktopZoom(w / 1280)
      setPhoneWidth(Math.min(280, Math.max(220, Math.round(w * 0.85))))
    }
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // global mouse tracking for cursor
  useEffect(() => {
    const move = (e: MouseEvent) => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY }))
    const up   = () => setCursor(c => ({ ...c, active: false }))
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [])

  function onMockupEnter() { setCursor(c => ({ ...c, visible: true })) }
  function onMockupLeave() { setCursor(c => ({ ...c, visible: false, active: false })) }
  function onMockupDown()  { setCursor(c => ({ ...c, active: true })) }

  const mobileZoom   = (phoneWidth - 16) / 390
  const phoneHeight  = Math.round((phoneWidth - 16) * 2.2)
  const mobileScale  = phoneWidth / 240
  const hintTop      = Math.round((50 + 64) * mobileZoom + 4)

  return (
    <div ref={wrapperRef} className="w-full">
      <TouchCursor {...cursor} />

      {/* toggle */}
      <div className="flex justify-center md:justify-start mb-3">
        <div className="inline-flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          {([
            { key: 'desktop', icon: Monitor,    label: 'Desktop' },
            { key: 'mobile',  icon: Smartphone, label: 'Mobile'  },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === key ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}>
              <Icon size={12} />{label}
            </button>
          ))}
        </div>
      </div>

      {view === 'desktop' ? (
        <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-neutral-200 w-full">
          {/* chrome */}
          <div className="bg-neutral-100 border-b border-neutral-200 px-3 py-2 flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1 text-[11px] text-neutral-400 border border-neutral-200 text-center">
              arquiteturaorganizada.com.br/meu-escritorio
            </div>
          </div>
          {/* scrollable */}
          <div style={{ position: 'relative', isolation: 'isolate' }}
            onMouseEnter={onMockupEnter} onMouseLeave={onMockupLeave} onMouseDown={onMockupDown}>
            <ScrollHint visible={showHintDesktop} />
            <div
              ref={dragDesktop.ref}
              onMouseDown={dragDesktop.onMouseDown}
              onMouseMove={dragDesktop.onMouseMove}
              onMouseUp={dragDesktop.onMouseUp}
              onMouseLeave={dragDesktop.onMouseLeave}
              onWheel={() => setShowHintDesktop(false)}
              style={{ height: 420, overflowY: 'scroll', overflowX: 'hidden', scrollbarWidth: 'none', cursor: 'none', userSelect: 'none' }}
            >
              <div style={{ zoom: desktopZoom }}><DesktopPage /></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center" style={{ isolation: 'isolate' }}
          onMouseEnter={onMockupEnter} onMouseLeave={onMockupLeave} onMouseDown={onMockupDown}>
          <div style={{ position: 'relative', width: phoneWidth }}>
            <div style={{ borderRadius: Math.round(44 * mobileScale), background: '#111', padding: 8, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', outline: '1px solid rgba(255,255,255,0.08)' }}>
              {/* dynamic island pill — centered, stays above status bar */}
              <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: Math.round(80 * mobileScale), height: Math.round(18 * mobileScale), background: '#111', borderRadius: 999, zIndex: 20 }} />
              <div style={{ borderRadius: Math.round(36 * mobileScale), overflow: 'hidden', height: phoneHeight, position: 'relative' }}>
                <ScrollHint visible={showHintMobile} top={0} contentOffset={hintTop} />
                <div
                  ref={dragMobile.ref}
                  onMouseDown={dragMobile.onMouseDown}
                  onMouseMove={dragMobile.onMouseMove}
                  onMouseUp={dragMobile.onMouseUp}
                  onMouseLeave={dragMobile.onMouseLeave}
                  onScroll={(e) => setMobileScrollTop(e.currentTarget.scrollTop)}
                  style={{ height: '100%', overflowY: 'scroll', overflowX: 'hidden', scrollbarWidth: 'none', cursor: 'none', userSelect: 'none' }}
                >
                  <div style={{ zoom: mobileZoom }}><MobilePage /></div>
                </div>
              </div>
            </div>
            {/* side buttons scale with phone */}
            <div style={{ position: 'absolute', right: -4, top: Math.round(100 * mobileScale), width: 4, height: Math.round(32 * mobileScale), background: '#333', borderRadius: '0 2px 2px 0' }} />
            <div style={{ position: 'absolute', left: -4, top: Math.round(80 * mobileScale),  width: 4, height: Math.round(24 * mobileScale), background: '#333', borderRadius: '2px 0 0 2px' }} />
            <div style={{ position: 'absolute', left: -4, top: Math.round(116 * mobileScale), width: 4, height: Math.round(40 * mobileScale), background: '#333', borderRadius: '2px 0 0 2px' }} />
            <div style={{ position: 'absolute', left: -4, top: Math.round(168 * mobileScale), width: 4, height: Math.round(40 * mobileScale), background: '#333', borderRadius: '2px 0 0 2px' }} />
          </div>
        </div>
      )}
    </div>
  )
}
