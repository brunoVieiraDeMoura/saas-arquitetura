'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { saveTheme } from '../actions'
import type { Plan } from '@/lib/plans'

type ThemeValue = 1 | 2 | 3
type Themes = {
  hero: ThemeValue
  projects: ThemeValue
  cta: ThemeValue
  testimonials: ThemeValue
  faq: ThemeValue
  contact: ThemeValue
}

// ── SVG Previews ─────────────────────────────────────────────────────────────
// viewBox: 0 0 320 180 (~16:9)

const P = {
  img:    '#D1D5DB', // image placeholders
  imgDk:  '#9CA3AF', // darker image
  dark:   '#1F2937', // dark backgrounds
  vdark:  '#111827', // very dark
  white:  '#FFFFFF',
  lgray:  '#F9FAFB', // light bg
  mgray:  '#E5E7EB', // medium gray
  text:   '#374151', // dark text
  mtext:  '#6B7280', // medium text
  ltext:  '#9CA3AF', // light text
  pri:    '#374151', // represents primary color
}

// ── HERO ─────────────────────────────────────────────────────────────────────

function HeroSplit() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main photo */}
      <rect width="242" height="180" fill={P.img}/>
      {/* Dark overlay bottom */}
      <rect y="90" width="242" height="90" fill={P.dark} opacity="0.65"/>
      {/* Category */}
      <rect x="16" y="108" width="36" height="2.5" rx="1.25" fill={P.white} opacity="0.55"/>
      {/* Title */}
      <rect x="16" y="117" width="100" height="7" rx="2" fill={P.white}/>
      <rect x="16" y="128" width="72" height="7" rx="2" fill={P.white}/>
      {/* Link */}
      <rect x="16" y="143" width="20" height="1.5" rx="0.75" fill={P.white} opacity="0.5"/>
      <rect x="40" y="143" width="38" height="1.5" rx="0.75" fill={P.white} opacity="0.7"/>
      {/* Dots */}
      <rect x="16" y="165" width="10" height="3" rx="1.5" fill={P.white}/>
      <circle cx="31" cy="166.5" r="2" fill={P.white} opacity="0.4"/>
      <circle cx="38" cy="166.5" r="2" fill={P.white} opacity="0.4"/>
      {/* Thumbnail strip */}
      <rect x="243" width="77" height="60" fill={P.imgDk}/>
      <rect x="243" y="0" width="3" height="60" fill={P.white}/>
      <rect x="246" y="3" width="70" height="5" rx="1" fill={P.white} opacity="0.6"/>
      <rect x="243" y="61" width="77" height="59" fill="#B0B7C0"/>
      <rect x="246" y="72" width="70" height="5" rx="1" fill={P.white} opacity="0.5"/>
      <rect x="243" y="121" width="77" height="59" fill={P.imgDk}/>
      <rect x="246" y="134" width="70" height="5" rx="1" fill={P.white} opacity="0.5"/>
    </svg>
  )
}

function HeroCentered() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.img}/>
      <rect width="320" height="180" fill={P.dark} opacity="0.55"/>
      {/* Category */}
      <rect x="130" y="64" width="60" height="2" rx="1" fill={P.white} opacity="0.5"/>
      {/* Title */}
      <rect x="80" y="74" width="160" height="10" rx="3" fill={P.white}/>
      <rect x="100" y="88" width="120" height="10" rx="3" fill={P.white}/>
      {/* Button */}
      <rect x="116" y="108" width="88" height="20" rx="10" fill="none" stroke={P.white} strokeWidth="1.5" opacity="0.7"/>
      <rect x="130" y="115" width="60" height="6" rx="2" fill={P.white} opacity="0.7"/>
      {/* Dots */}
      <rect x="146" y="160" width="14" height="3" rx="1.5" fill={P.white}/>
      <circle cx="165" cy="161.5" r="2" fill={P.white} opacity="0.4"/>
      <circle cx="172" cy="161.5" r="2" fill={P.white} opacity="0.4"/>
    </svg>
  )
}

function HeroMinimal() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Photo top 60% */}
      <rect width="320" height="112" fill={P.img}/>
      {/* Dots on photo */}
      <rect x="290" y="98" width="8" height="2" rx="1" fill={P.white}/>
      <circle cx="303" cy="99" r="1.5" fill={P.white} opacity="0.5"/>
      <circle cx="309" cy="99" r="1.5" fill={P.white} opacity="0.5"/>
      {/* White bar */}
      <rect y="112" width="320" height="68" fill={P.white}/>
      <line x1="0" y1="112" x2="320" y2="112" stroke={P.mgray} strokeWidth="1"/>
      {/* Category */}
      <rect x="20" y="124" width="36" height="2" rx="1" fill={P.ltext}/>
      {/* Title */}
      <rect x="20" y="132" width="130" height="10" rx="2" fill={P.text}/>
      <rect x="20" y="146" width="90" height="10" rx="2" fill={P.text}/>
      {/* Button */}
      <rect x="230" y="136" width="70" height="22" rx="6" fill="none" stroke={P.mgray} strokeWidth="1.5"/>
      <rect x="244" y="143" width="42" height="5" rx="1.5" fill={P.mtext}/>
    </svg>
  )
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────

function ProjectsGrid() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      {/* Title */}
      <rect x="110" y="14" width="100" height="8" rx="2" fill={P.text}/>
      {/* Category header */}
      <rect x="20" y="36" width="28" height="28" rx="6" fill={P.img}/>
      <rect x="56" y="38" width="70" height="7" rx="2" fill={P.text}/>
      <rect x="56" y="49" width="100" height="4" rx="1.5" fill={P.ltext}/>
      {/* Grid cards */}
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${20 + i * 95},74)`}>
          <rect width="88" height="90" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
          <rect width="88" height="50" rx="6" fill={P.img}/>
          <rect y="50" width="88" height="40" rx="6" fill={P.white}/>
          <rect x="8" y="58" width="60" height="5" rx="1.5" fill={P.text}/>
          <rect x="8" y="67" width="40" height="3" rx="1" fill={P.ltext}/>
          <rect x="8" y="74" width="72" height="3" rx="1" fill={P.mgray}/>
          <rect x="8" y="80" width="55" height="3" rx="1" fill={P.mgray}/>
        </g>
      ))}
    </svg>
  )
}

function ProjectsMagazine() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      {/* Title */}
      <rect x="110" y="14" width="100" height="8" rx="2" fill={P.text}/>
      {/* Category name */}
      <rect x="20" y="32" width="80" height="7" rx="2" fill={P.text}/>
      {/* Large card */}
      <rect x="20" y="48" width="176" height="118" rx="6" fill={P.img}/>
      <rect x="20" y="136" width="176" height="30" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
      <rect x="28" y="143" width="80" height="6" rx="2" fill={P.text}/>
      <rect x="28" y="153" width="50" height="3.5" rx="1" fill={P.ltext}/>
      {/* Two stacked small */}
      <rect x="204" y="48" width="96" height="56" rx="6" fill={P.imgDk}/>
      <rect x="204" y="108" width="96" height="24" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
      <rect x="212" y="115" width="60" height="5" rx="1.5" fill={P.text}/>
      <rect x="212" y="124" width="40" height="3" rx="1" fill={P.ltext}/>
      <rect x="204" y="134" width="96" height="56" rx="6" fill="#C4C9D0"/>
      <rect x="204" y="170" width="96" height="20" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
    </svg>
  )
}

function ProjectsList() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      {/* Title */}
      <rect x="110" y="14" width="100" height="8" rx="2" fill={P.text}/>
      {/* Category */}
      <rect x="20" y="32" width="80" height="7" rx="2" fill={P.text}/>
      {/* List rows */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="20" y={52 + i * 40} width="280" height="0.5" fill={P.mgray}/>
          <rect x="20" y={58 + i * 40} width="36" height="26" rx="5" fill={P.img}/>
          <rect x="64" y={60 + i * 40} width="90" height="6" rx="2" fill={P.text}/>
          <rect x="64" y={70 + i * 40} width="60" height="3.5" rx="1" fill={P.ltext}/>
          <rect x="64" y={77 + i * 40} width="110" height="3" rx="1" fill={P.mgray}/>
          {/* Arrow */}
          <text x="295" y={74 + i * 40} fontSize="12" fill={P.ltext} textAnchor="middle">→</text>
        </g>
      ))}
      <rect x="20" y="172" width="280" height="0.5" fill={P.mgray}/>
    </svg>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTASolid() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.dark}/>
      <rect x="60" y="52" width="200" height="10" rx="3" fill={P.white}/>
      <rect x="90" y="66" width="140" height="10" rx="3" fill={P.white}/>
      <rect x="110" y="84" width="100" height="6" rx="2" fill={P.white} opacity="0.5"/>
      <rect x="112" y="106" width="96" height="26" rx="13" fill={P.white}/>
      <rect x="130" y="116" width="60" height="6" rx="2" fill={P.dark}/>
    </svg>
  )
}

function CTALight() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      <rect x="130" y="36" width="60" height="4" rx="2" fill={P.ltext}/>
      <rect x="60" y="52" width="200" height="12" rx="3" fill={P.text}/>
      <rect x="90" y="68" width="140" height="12" rx="3" fill={P.text}/>
      <rect x="110" y="88" width="100" height="5" rx="2" fill={P.ltext}/>
      <rect x="112" y="108" width="96" height="26" rx="13" fill="none" stroke={P.text} strokeWidth="1.5"/>
      <rect x="130" y="118" width="60" height="6" rx="2" fill={P.text}/>
    </svg>
  )
}

function CTADark() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.vdark}/>
      <rect x="60" y="52" width="200" height="10" rx="3" fill={P.white}/>
      <rect x="90" y="66" width="140" height="10" rx="3" fill={P.white}/>
      <rect x="110" y="84" width="100" height="5" rx="2" fill={P.mtext}/>
      <rect x="112" y="106" width="96" height="26" rx="13" fill={P.pri}/>
      <rect x="130" y="116" width="60" height="6" rx="2" fill={P.white}/>
    </svg>
  )
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────

function TestimonialsCards() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.lgray}/>
      <rect x="100" y="16" width="120" height="8" rx="2" fill={P.text}/>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={18 + i * 96} y="38" width="88" height="124" rx="8" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
          <rect x={26 + i * 96} y="50" width="72" height="4" rx="1.5" fill={P.mgray}/>
          <rect x={26 + i * 96} y="58" width="72" height="4" rx="1.5" fill={P.mgray}/>
          <rect x={26 + i * 96} y="66" width="50" height="4" rx="1.5" fill={P.mgray}/>
          <circle cx={30 + i * 96} cy="144" r="9" fill={P.mgray}/>
          <rect x={44 + i * 96} y="140" width="44" height="4.5" rx="1.5" fill={P.text}/>
          <rect x={44 + i * 96} y="148" width="32" height="3.5" rx="1" fill={P.ltext}/>
        </g>
      ))}
    </svg>
  )
}

function TestimonialsDark() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.vdark}/>
      <rect x="100" y="16" width="120" height="8" rx="2" fill={P.white}/>
      {[0,1,2].map(i => (
        <g key={i}>
          {/* Big quote mark */}
          <text x={22 + i * 96} y="66" fontSize="32" fill={P.pri} opacity="0.8" fontFamily="serif">"</text>
          <rect x={18 + i * 96} y="70" width="80" height="3.5" rx="1.5" fill={P.white} opacity="0.3"/>
          <rect x={18 + i * 96} y="78" width="80" height="3.5" rx="1.5" fill={P.white} opacity="0.3"/>
          <rect x={18 + i * 96} y="86" width="55" height="3.5" rx="1.5" fill={P.white} opacity="0.3"/>
          <circle cx={26 + i * 96} cy="110" r="7" fill="#374151"/>
          <rect x={38 + i * 96} y="106" width="44" height="4" rx="1.5" fill={P.white} opacity="0.6"/>
          <rect x={38 + i * 96} y="114" width="30" height="3" rx="1" fill={P.mtext}/>
        </g>
      ))}
    </svg>
  )
}

function TestimonialsFeatured() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.lgray}/>
      <rect x="100" y="10" width="120" height="8" rx="2" fill={P.text}/>
      {/* Large featured */}
      <rect x="16" y="28" width="288" height="72" rx="8" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
      <circle cx="40" cy="64" r="16" fill={P.mgray}/>
      <rect x="64" y="50" width="80" height="6" rx="2" fill={P.text}/>
      <rect x="64" y="60" width="220" height="3.5" rx="1" fill={P.mgray}/>
      <rect x="64" y="68" width="180" height="3.5" rx="1" fill={P.mgray}/>
      <rect x="64" y="76" width="130" height="3.5" rx="1" fill={P.mgray}/>
      {/* Smaller cards */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={16 + i * 74} y="112" width="66" height="58" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
          <rect x={24 + i * 74} y="120" width="50" height="3" rx="1" fill={P.mgray}/>
          <rect x={24 + i * 74} y="127" width="50" height="3" rx="1" fill={P.mgray}/>
          <rect x={24 + i * 74} y="134" width="35" height="3" rx="1" fill={P.mgray}/>
          <circle cx={24 + i * 74} cy="155" r="5" fill={P.mgray}/>
          <rect x={34 + i * 74} y="152" width="28" height="3.5" rx="1" fill={P.ltext}/>
        </g>
      ))}
    </svg>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function FAQAccordion() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      <rect x="110" y="14" width="100" height="8" rx="2" fill={P.text}/>
      {/* Open card */}
      <rect x="30" y="34" width="260" height="54" rx="8" fill={P.white} stroke={P.mgray} strokeWidth="1.5"/>
      <rect x="44" y="46" width="150" height="6" rx="2" fill={P.text}/>
      <rect x="282" y="44" width="10" height="10" rx="2" fill={P.mgray}/>
      <text x="287" y="53" fontSize="12" fill={P.mtext} textAnchor="middle">−</text>
      <rect x="44" y="60" width="200" height="3.5" rx="1" fill={P.mgray}/>
      <rect x="44" y="67" width="160" height="3.5" rx="1" fill={P.mgray}/>
      {/* Closed cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="30" y={98 + i * 24} width="260" height="20" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
          <rect x="44" y={106 + i * 24} width="130" height="4" rx="1.5" fill={P.text}/>
          <text x="287" y={110 + i * 24} fontSize="12" fill={P.ltext} textAnchor="middle">+</text>
        </g>
      ))}
    </svg>
  )
}

function FAQLines() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      <rect x="110" y="14" width="100" height="8" rx="2" fill={P.text}/>
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="30" y={35 + i * 28} width="240" height="5" rx="1.5" fill={i === 0 ? P.text : P.mtext}/>
          {i === 0 && <rect x="30" y="46" width="210" height="3.5" rx="1" fill={P.mgray}/>}
          {i === 0 && <rect x="30" y="53" width="170" height="3.5" rx="1" fill={P.mgray}/>}
          <text x="286" y={41 + i * 28} fontSize="14" fill={P.ltext} textAnchor="middle">{i === 0 ? '−' : '+'}</text>
          <rect x="30" y={i === 0 ? 62 : 44 + i * 28} width="260" height="0.75" fill={P.mgray}/>
        </g>
      ))}
    </svg>
  )
}

function FAQOpen() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.lgray}/>
      <rect x="110" y="12" width="100" height="8" rx="2" fill={P.text}/>
      {/* 2 columns */}
      {[0,1].map(col => (
        <g key={col}>
          {[0,1,2].map(row => (
            <g key={row}>
              <rect x={20 + col * 152} y={32 + row * 46} width="140" height="40" rx="7" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
              <rect x={30 + col * 152} y={42 + row * 46} width="90" height="5" rx="1.5" fill={P.text}/>
              <rect x={30 + col * 152} y={52 + row * 46} width="118" height="3.5" rx="1" fill={P.mgray}/>
              <rect x={30 + col * 152} y={58 + row * 46} width="95" height="3.5" rx="1" fill={P.mgray}/>
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────

function ContactCentered() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.lgray}/>
      <rect x="110" y="12" width="100" height="8" rx="2" fill={P.text}/>
      <rect x="90" y="26" width="140" height="4" rx="1.5" fill={P.ltext}/>
      {/* Social buttons */}
      <rect x="20" y="42" width="130" height="22" rx="7" fill={P.white} stroke={P.mgray} strokeWidth="1.5"/>
      <rect x="170" y="42" width="130" height="22" rx="7" fill={P.dark}/>
      <rect x="42" y="50" width="80" height="5" rx="1.5" fill={P.mtext}/>
      <rect x="188" y="50" width="80" height="5" rx="1.5" fill={P.white}/>
      {/* Form fields */}
      {[0,1,2].map(i => (
        <rect key={i} x="20" y={76 + i * 24} width="280" height="18" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
      ))}
      {/* Submit */}
      <rect x="20" y="152" width="280" height="22" rx="7" fill={P.dark}/>
      <rect x="120" y="160" width="80" height="5" rx="1.5" fill={P.white}/>
    </svg>
  )
}

function ContactSplit() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      {/* Left dark panel */}
      <rect width="130" height="180" rx="0" fill={P.dark}/>
      <rect x="14" y="28" width="102" height="9" rx="2" fill={P.white}/>
      <rect x="14" y="42" width="102" height="4" rx="1.5" fill={P.white} opacity="0.45"/>
      <rect x="14" y="50" width="85" height="4" rx="1.5" fill={P.white} opacity="0.45"/>
      {/* Social links */}
      <rect x="14" y="80" width="80" height="14" rx="4" fill={P.white} opacity="0.12"/>
      <rect x="22" y="85" width="55" height="4" rx="1.5" fill={P.white} opacity="0.6"/>
      <rect x="14" y="100" width="80" height="14" rx="4" fill={P.white} opacity="0.12"/>
      <rect x="22" y="105" width="55" height="4" rx="1.5" fill={P.white} opacity="0.6"/>
      {/* Right form */}
      {[0,1,2].map(i => (
        <rect key={i} x="144" y={28 + i * 36} width="162" height="26" rx="6" fill={P.white} stroke={P.mgray} strokeWidth="1"/>
      ))}
      <rect x="144" y="140" width="162" height="28" rx="7" fill={P.dark}/>
      <rect x="185" y="151" width="80" height="5" rx="1.5" fill={P.white}/>
    </svg>
  )
}

function ContactMinimal() {
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="180" fill={P.white}/>
      <rect x="110" y="12" width="100" height="8" rx="2" fill={P.text}/>
      <rect x="115" y="26" width="90" height="4" rx="1.5" fill={P.ltext}/>
      {/* Bottom-border-only inputs */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="30" y={48 + i * 26} width="260" height="4" rx="1.5" fill={P.lgray}/>
          <rect x="30" y={64 + i * 26} width="260" height="0.75" fill={P.mgray}/>
        </g>
      ))}
      {/* Pill button */}
      <rect x="100" y="158" width="120" height="18" rx="9" fill={P.vdark}/>
      <rect x="125" y="164" width="70" height="5" rx="1.5" fill={P.white}/>
      {/* Social links bottom */}
      <rect x="106" y="142" width="46" height="4" rx="1.5" fill={P.ltext}/>
      <rect x="170" y="142" width="46" height="4" rx="1.5" fill={P.ltext}/>
    </svg>
  )
}

// ── Section config ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    key: 'hero' as const,
    label: 'Hero',
    description: 'Seção inicial com fotos em destaque',
    options: [
      { value: 1 as ThemeValue, label: 'Split', Preview: HeroSplit },
      { value: 2 as ThemeValue, label: 'Centralizado', Preview: HeroCentered },
      { value: 3 as ThemeValue, label: 'Minimalista', Preview: HeroMinimal },
    ],
  },
  {
    key: 'projects' as const,
    label: 'Nossos Projetos',
    description: 'Exibição de projetos por categoria',
    options: [
      { value: 1 as ThemeValue, label: 'Grade', Preview: ProjectsGrid },
      { value: 2 as ThemeValue, label: 'Magazine', Preview: ProjectsMagazine },
      { value: 3 as ThemeValue, label: 'Lista', Preview: ProjectsList },
    ],
  },
  {
    key: 'cta' as const,
    label: 'CTA',
    description: '"Transforme seu espaço"',
    options: [
      { value: 1 as ThemeValue, label: 'Sólido', Preview: CTASolid },
      { value: 2 as ThemeValue, label: 'Claro', Preview: CTALight },
      { value: 3 as ThemeValue, label: 'Escuro', Preview: CTADark },
    ],
  },
  {
    key: 'testimonials' as const,
    label: 'Depoimentos',
    description: 'O que dizem nossos clientes',
    options: [
      { value: 1 as ThemeValue, label: 'Cards', Preview: TestimonialsCards },
      { value: 2 as ThemeValue, label: 'Escuro', Preview: TestimonialsDark },
      { value: 3 as ThemeValue, label: 'Destaque', Preview: TestimonialsFeatured },
    ],
  },
  {
    key: 'faq' as const,
    label: 'Perguntas Frequentes',
    description: 'Accordion de dúvidas comuns',
    options: [
      { value: 1 as ThemeValue, label: 'Accordion', Preview: FAQAccordion },
      { value: 2 as ThemeValue, label: 'Linhas', Preview: FAQLines },
      { value: 3 as ThemeValue, label: 'Aberto', Preview: FAQOpen },
    ],
  },
  {
    key: 'contact' as const,
    label: 'Contato',
    description: 'Formulário e links sociais',
    options: [
      { value: 1 as ThemeValue, label: 'Centralizado', Preview: ContactCentered },
      { value: 2 as ThemeValue, label: 'Dividido', Preview: ContactSplit },
      { value: 3 as ThemeValue, label: 'Minimalista', Preview: ContactMinimal },
    ],
  },
]

// ── Upgrade modal ──────────────────────────────────────────────────────────────

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 sm:p-8 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mx-auto mb-4">
          <Lock size={20} className="text-neutral-700" />
        </div>
        <h2 className="text-base font-semibold text-neutral-900 mb-2">Plano necessário</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Para alterar os temas do site é necessário ter algum dos planos ativos.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/billing"
            className="w-full inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-neutral-800 transition-colors"
            onClick={onClose}
          >
            Ver planos
          </Link>
          <button
            className="w-full text-sm text-neutral-500 hover:text-neutral-700 py-2 transition-colors"
            onClick={onClose}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function TemasClient({ plan, themes }: { plan: Plan; themes: Themes }) {
  const [current, setCurrent] = useState<Themes>(themes)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [, startTransition] = useTransition()

  const canEdit = plan === 'pro' || plan === 'agency'

  function handleSelect(section: keyof Themes, value: ThemeValue, locked: boolean) {
    if (locked) { setShowUpgrade(true); return }
    setCurrent((prev) => ({ ...prev, [section]: value }))
    startTransition(() => { saveTheme(section, String(value)) })
  }

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const active = current[section.key]

          return (
            <div key={section.key} className="bg-white rounded-xl border border-neutral-200 p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{section.label}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{section.description}</p>
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {section.options.find(o => o.value === active)?.label}
                </span>
              </div>

              {/* 3 thumbnail options */}
              <div className="grid grid-cols-3 gap-2.5">
                {section.options.map((opt) => {
                  const locked = !canEdit && opt.value !== 1
                  const selected = active === opt.value

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(section.key, opt.value, locked)}
                      className="group relative flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                      {/* Thumbnail */}
                      <div className={`relative w-full overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                        selected
                          ? 'border-neutral-900'
                          : 'border-neutral-200 group-hover:border-neutral-400'
                      }`}>
                        <div className="aspect-video">
                          <opt.Preview />
                        </div>
                        {locked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                            <div className="flex flex-col items-center gap-1">
                              <Lock size={13} className="text-neutral-600" />
                            </div>
                          </div>
                        )}
                        {selected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <span className={`text-[11px] font-medium leading-none ${
                        selected ? 'text-neutral-900' : locked ? 'text-neutral-300' : 'text-neutral-500'
                      }`}>
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
