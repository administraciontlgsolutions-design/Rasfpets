'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Check,
  ChevronDown,
  HeartHandshake,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Activity,
  Award,
  Zap,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WHATSAPP_BASE =
  'https://api.whatsapp.com/send/?phone=56987898184&type=phone_number&app_absent=0';

function getWhatsAppUrl(text: string) {
  return `${WHATSAPP_BASE}&text=${encodeURIComponent(text)}`;
}

// Editable tag helper for demo/customizable figures
function EditableBadge({ label = 'Editable' }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded bg-amber-100/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 border border-amber-300"
      title="Dato ficticio de demostración configurable"
    >
      {label}
    </span>
  );
}

// 4 Products available in /public
const catalogProducts = [
  {
    id: 'natural-woodland',
    name: 'Natural Woodland Wild Iberian',
    tag: 'Dieta Hipoalergénica',
    suitableFor: 'Perros de todas las razas · Piel y digestión sensible',
    image: '/natural-woodland.jpg',
    description:
      'Carne de jabalí e ibérico deshidratada con legumbres y antioxidantes botánicos. Cero cereales de relleno.',
    formats: ['Saco 7 kg', 'Saco 15 kg', 'Plan Mensual'],
    price: '$38.990',
    frequencyPrice: '$33.140 / mes (Ahorras 15%)',
    keyIngredients: [
      '65% Carne ibérica y jabalí',
      'Sin gluten ni maíz',
      'Aceite de salmón salvaje',
      'Prebióticos MOS & FOS',
    ],
  },
  {
    id: 'forza',
    name: 'Forza Nutrición Familiar',
    tag: 'Rendimiento y Vitalidad',
    suitableFor: 'Perros medianos y grandes · Alta palatabilidad',
    image: '/forza.jpg',
    description:
      'Formulado para perros activos con requerimientos energéticos equilibrados y protección osteoarticular.',
    formats: ['Saco 15 kg', 'Saco 20 kg', 'Plan Mensual'],
    price: '$34.990',
    frequencyPrice: '$29.740 / mes (Ahorras 15%)',
    keyIngredients: [
      'Proteína magra biodisponible',
      'Condroitina y Glucosamina',
      'Extracto de romero natural',
      'Fibras de digestión suave',
    ],
  },
  {
    id: 'pet-palatto',
    name: 'Pet Palatto Senior +7',
    tag: 'Cuidado Longevidad',
    suitableFor: 'Perros maduros y seniors · Soporte renal y articular',
    image: '/pet-palatto.jpg',
    description:
      'Frango & arroz seleccionados con condroprotectores reforzados para cuidar las articulaciones en edad dorada.',
    formats: ['Saco 7 kg', 'Saco 15 kg', 'Plan Mensual'],
    price: '$36.990',
    frequencyPrice: '$31.440 / mes (Ahorras 15%)',
    keyIngredients: [
      'Proteína de fácil digestión',
      'Complejo articular doble',
      'Omega 3 antiinflamatorio',
      'Sodio y fósforo controlados',
    ],
  },
  {
    id: 'bocao',
    name: 'Bocão Signature Salmón & Pollo',
    tag: 'Fórmula Felina Estricta',
    suitableFor: 'Gatos adultos y esterilizados · Salud urinaria',
    image: '/bocao.jpg',
    description:
      'Diseñado específicamente para el tracto urinario felino, control de bolas de pelo y pelaje ultrasedoso.',
    formats: ['Saco 3 kg', 'Saco 7.5 kg', 'Plan Mensual'],
    price: '$26.990',
    frequencyPrice: '$22.940 / mes (Ahorras 15%)',
    keyIngredients: [
      'Salmón fresco y pollo magro',
      'Taurina esencial reforzada',
      'pH urinario regulado',
      '0% Harinas de descarte',
    ],
  },
];

// Quiz configuration
type PetType = 'perro' | 'gato';
type PetSize = 'pequeno' | 'mediano' | 'grande';
type PetAge = 'cachorro' | 'adulto' | 'senior';

interface QuizState {
  petType: PetType;
  size: PetSize;
  age: PetAge;
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quizCardRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [quizStep, setQuizStep] = useState<1 | 2 | 3 | 4>(1);
  const [quizData, setQuizData] = useState<QuizState>({
    petType: 'perro',
    size: 'mediano',
    age: 'adulto',
  });

  // Selected product in detail section
  const [selectedProductId, setSelectedProductId] = useState<string>('natural-woodland');
  const [selectedPlanFormat, setSelectedPlanFormat] = useState<'individual' | 'suscripcion'>(
    'suscripcion'
  );

  // FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // GSAP animations setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // In reduced motion mode, just fill counter targets immediately
      const counters = document.querySelectorAll<HTMLElement>('.counter-value');
      counters.forEach((el) => {
        const target = el.getAttribute('data-target') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = `${prefix}${target}${suffix}`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Hero entrance timeline (fade + slide with stagger ≤ 0.8s)
      gsap.from('.hero-anim', {
        opacity: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out',
      });

      // 2. Trust bar counters on viewport entry
      const counterElements = document.querySelectorAll<HTMLElement>('.counter-value');
      counterElements.forEach((el) => {
        const rawTarget = el.getAttribute('data-target') || '0';
        const targetNumber = parseFloat(rawTarget.replace(/[^0-9.]/g, ''));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        const progressObj = { count: 0 };

        gsap.to(progressObj, {
          count: targetNumber,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onUpdate: () => {
            const formatted = Math.round(progressObj.count).toLocaleString('es-CL');
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });

      // 3. Benefits reveal with stagger
      gsap.from('.benefit-card-anim', {
        scrollTrigger: {
          trigger: '#beneficios',
          start: 'top 80%',
          once: true,
        },
        opacity: 0,
        y: 32,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power2.out',
      });

      // 4. Testimonials reveal
      gsap.from('.testimonial-card-anim', {
        scrollTrigger: {
          trigger: '#testimonios',
          start: 'top 80%',
          once: true,
        },
        opacity: 0,
        y: 32,
        duration: 0.65,
        stagger: 0.14,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate quiz transition on step change
  useEffect(() => {
    if (quizCardRef.current && typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          quizCardRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
  }, [quizStep]);

  // Quiz helper to compute product recommendation
  const getQuizRecommendation = () => {
    if (quizData.petType === 'gato') {
      return catalogProducts.find((p) => p.id === 'bocao') || catalogProducts[0];
    }
    if (quizData.age === 'senior') {
      return catalogProducts.find((p) => p.id === 'pet-palatto') || catalogProducts[0];
    }
    if (quizData.size === 'grande') {
      return catalogProducts.find((p) => p.id === 'forza') || catalogProducts[0];
    }
    return catalogProducts.find((p) => p.id === 'natural-woodland') || catalogProducts[0];
  };

  const recommendedProduct = getQuizRecommendation();
  const activeProduct =
    catalogProducts.find((p) => p.id === selectedProductId) || catalogProducts[0];

  const quizWhatsAppMessage = `Hola RASF Pets, completé el selector personalizado para mi ${quizData.petType} (${quizData.size}, etapa ${quizData.age}) y me recomendó ${recommendedProduct.name}. Quisiera coordinar el plan y entrega.`;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fffaf8] text-[#181313] selection:bg-[#ec101d] selection:text-white">
      {/* 1. Header Minimalista */}
      <header className="sticky top-0 z-50 border-b border-[#eadfdb]/80 bg-[#fffaf8]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
          <a
            href="#inicio"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
            aria-label="RASF Pets, volver al inicio"
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#eadfdb] shadow-sm">
              <Image
                src="/rasf-logo.jpg"
                alt="Logo RASF Pets"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="block text-lg font-black tracking-tight leading-none text-[#181313]">
                RASF <span className="text-[#ec101d]">PETS</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#736766] mt-0.5">
                Nutrición Natural
              </span>
            </div>
          </a>

          {/* Único CTA primario en Header */}
          <a
            href={getWhatsAppUrl('Hola RASF Pets, quisiera pedir asesoría nutricional para mi mascota.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#ec101d] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#c00814] active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Asesoría por WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="inicio">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Columna texto */}
              <div className="lg:col-span-7">
                <div className="hero-anim inline-flex items-center gap-2 rounded-full bg-[#fff0f1] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#ec101d]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Nutrición Real · Concepción y Alrededores</span>
                </div>

                {/* Único H1 del documento */}
                <h1 className="hero-anim mt-5 text-4xl font-black tracking-tight text-[#181313] sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                  Alimento natural a su medida para que tu mascota{' '}
                  <em className="font-black not-italic text-[#ec101d]">viva más y mejor.</em>
                </h1>

                <p className="hero-anim mt-6 max-w-2xl text-lg leading-relaxed text-[#736766] sm:text-xl">
                  Fórmulas biológicamente equilibradas con ingredientes 100% naturales, carnes nobles y cero harinas de descarte. Diseña su plan según especie, tamaño y etapa con despacho directo en el Gran Concepción.
                </p>

                {/* Acciones principales del Hero */}
                <div className="hero-anim mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <a
                    href={getWhatsAppUrl('Hola RASF Pets, quisiera pedir el plan de alimentación natural para mi mascota.')}
                    target="_blank"
                    rel="noreferrer"
                    className="cta-pulse inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#ec101d] px-8 text-base font-extrabold text-white shadow-xl transition-colors hover:bg-[#c00814]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Personalizar plan por WhatsApp</span>
                  </a>

                  <a
                    href="#quiz"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#eadfdb] bg-white px-6 text-sm font-bold text-[#181313] shadow-sm transition-all hover:border-[#181313] hover:bg-[#fffaf8]"
                  >
                    <span>Descubrir su fórmula ideal</span>
                    <ArrowRight className="h-4 w-4 text-[#ec101d]" />
                  </a>
                </div>

                {/* Micro-señales de confianza */}
                <div className="hero-anim mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-[#736766]">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#ec101d]" /> Asesoría directa por expertos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#ec101d]" /> Envío seguro a tu domicilio
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#ec101d]" /> Garantía de adaptación 30 días
                  </span>
                </div>
              </div>

              {/* Columna visual */}
              <div className="hero-anim lg:col-span-5">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-[#eadfdb] bg-white p-3 shadow-2xl lg:max-w-none">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#f5ece8] sm:aspect-5/4">
                    <Image
                      src="/forza.jpg"
                      alt="Alimento natural para mascotas Forza de RASF Pets"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-block rounded bg-[#ec101d] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                        Fórmula Certificada
                      </span>
                      <p className="mt-1 text-base font-bold sm:text-lg">
                        Ingredientes naturales de alta digestibilidad
                      </p>
                    </div>
                  </div>

                  {/* Micro-tarjeta flotante */}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fffaf8] p-3.5 border border-[#eadfdb]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f1] text-[#ec101d]">
                        <HeartHandshake className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#181313]">Atención en Concepción</p>
                        <p className="text-[11px] text-[#736766]">Respuesta rápida en WhatsApp</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#ec101d]">+56 9 8789 8184</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Barra de Confianza con Contadores GSAP */}
        <section className="border-y border-[#eadfdb] bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
              {/* Contador 1 */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#fffaf8] border border-[#eadfdb]/70">
                <div className="flex items-center gap-1.5">
                  <span
                    className="counter-value text-3xl font-black tracking-tight text-[#181313] sm:text-4xl"
                    data-target="10000"
                    data-prefix="+"
                  >
                    +0
                  </span>
                  <EditableBadge />
                </div>
                <p className="mt-1 text-xs font-bold text-[#736766] uppercase tracking-wider">
                  Mascotas nutridas
                </p>
                <span className="mt-1 text-[11px] text-[#736766]/80">Salud digestiva comprobada</span>
              </div>

              {/* Contador 2 */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#fffaf8] border border-[#eadfdb]/70">
                <div className="flex items-center gap-1.5">
                  <span
                    className="counter-value text-3xl font-black tracking-tight text-[#181313] sm:text-4xl"
                    data-target="24"
                    data-suffix=" h"
                  >
                    0 h
                  </span>
                  <EditableBadge />
                </div>
                <p className="mt-1 text-xs font-bold text-[#736766] uppercase tracking-wider">
                  Despacho promedio
                </p>
                <span className="mt-1 text-[11px] text-[#736766]/80">Concepción y comunas vecinas</span>
              </div>

              {/* Contador 3 */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#fffaf8] border border-[#eadfdb]/70">
                <div className="flex items-center gap-1.5">
                  <span
                    className="counter-value text-3xl font-black tracking-tight text-[#181313] sm:text-4xl"
                    data-target="100"
                    data-suffix="%"
                  >
                    0%
                  </span>
                  <EditableBadge />
                </div>
                <p className="mt-1 text-xs font-bold text-[#736766] uppercase tracking-wider">
                  Natural e hipoalergénico
                </p>
                <span className="mt-1 text-[11px] text-[#736766]/80">Sin subproductos ni químicos</span>
              </div>

              {/* Contador 4 */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#fffaf8] border border-[#eadfdb]/70">
                <div className="flex items-center gap-1.5">
                  <span
                    className="counter-value text-3xl font-black tracking-tight text-[#181313] sm:text-4xl"
                    data-target="30"
                    data-suffix=" días"
                  >
                    0 días
                  </span>
                  <EditableBadge />
                </div>
                <p className="mt-1 text-xs font-bold text-[#736766] uppercase tracking-wider">
                  Garantía total
                </p>
                <span className="mt-1 text-[11px] text-[#736766]/80">Prueba sin riesgo de rechazo</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Selector Interactivo (Quiz) */}
        <section id="quiz" className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-8">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ec101d]">
                Selector Interactivo
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#181313] sm:text-4xl">
                Encuentra la fórmula exacta en 3 pasos
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-[#736766]">
                Cada mascota tiene una necesidad biológica única. Configura sus características y obtén una recomendación nutricional precisa.
              </p>
            </div>

            {/* Contenedor del Quiz */}
            <div
              ref={quizCardRef}
              className="mt-10 overflow-hidden rounded-3xl border border-[#eadfdb] bg-white p-6 shadow-xl sm:p-10"
            >
              {/* Barra de progreso */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#736766]">
                  <span>Paso {quizStep} de 3</span>
                  <span>{quizStep === 4 ? '100% Completado' : `${(quizStep - 1) * 33}% completado`}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f5ece8]">
                  <div
                    className="h-full bg-[#ec101d] transition-all duration-300"
                    style={{ width: `${quizStep === 4 ? 100 : (quizStep - 1) * 33.3}%` }}
                  />
                </div>
              </div>

              {/* PASO 1: Tipo de Mascota */}
              {quizStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-[#181313] sm:text-2xl">
                    1. ¿Qué compañero tienes en casa?
                  </h3>
                  <p className="mt-1 text-sm text-[#736766]">
                    Selecciona para adaptar el requerimiento proteico y balance de aminoácidos.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizData({ ...quizData, petType: 'perro' });
                        setQuizStep(2);
                      }}
                      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                        quizData.petType === 'perro'
                          ? 'border-[#ec101d] bg-[#fff0f1]/50 ring-2 ring-[#ec101d]/20'
                          : 'border-[#eadfdb] bg-[#fffaf8] hover:border-[#181313]'
                      }`}
                    >
                      <span className="text-4xl">🐕</span>
                      <div>
                        <strong className="block text-lg font-bold text-[#181313]">Perro</strong>
                        <span className="text-xs text-[#736766]">
                          Cachorro, adulto o senior de cualquier tamaño
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizData({ ...quizData, petType: 'gato' });
                        setQuizStep(2);
                      }}
                      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                        quizData.petType === 'gato'
                          ? 'border-[#ec101d] bg-[#fff0f1]/50 ring-2 ring-[#ec101d]/20'
                          : 'border-[#eadfdb] bg-[#fffaf8] hover:border-[#181313]'
                      }`}
                    >
                      <span className="text-4xl">🐈</span>
                      <div>
                        <strong className="block text-lg font-bold text-[#181313]">Gato</strong>
                        <span className="text-xs text-[#736766]">
                          Carnívoro estricto con soporte urinario
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2: Tamaño / Peso */}
              {quizStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold text-[#181313] sm:text-2xl">
                    2. ¿Cuál es su tamaño o peso aproximado?
                  </h3>
                  <p className="mt-1 text-sm text-[#736766]">
                    Determina el tamaño del bocado (croqueta) y la densidad calórica ideal.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { id: 'pequeno' as PetSize, title: 'Pequeño', desc: 'Hasta 10 kg', icon: '🐾' },
                      { id: 'mediano' as PetSize, title: 'Mediano', desc: '11 a 25 kg', icon: '🐕' },
                      { id: 'grande' as PetSize, title: 'Grande', desc: 'Más de 25 kg', icon: '🦮' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setQuizData({ ...quizData, size: item.id });
                          setQuizStep(3);
                        }}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center transition-all ${
                          quizData.size === item.id
                            ? 'border-[#ec101d] bg-[#fff0f1]/50 ring-2 ring-[#ec101d]/20'
                            : 'border-[#eadfdb] bg-[#fffaf8] hover:border-[#181313]'
                        }`}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <strong className="mt-2 text-base font-bold text-[#181313]">{item.title}</strong>
                        <span className="mt-0.5 text-xs text-[#736766]">{item.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#736766] hover:text-[#181313]"
                    >
                      ← Volver a especie
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: Etapa de Vida */}
              {quizStep === 3 && (
                <div>
                  <h3 className="text-xl font-bold text-[#181313] sm:text-2xl">
                    3. ¿En qué etapa de vida se encuentra?
                  </h3>
                  <p className="mt-1 text-sm text-[#736766]">
                    Ajusta los niveles de calcio, fósforo, condroprotectores y antioxidantes.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      {
                        id: 'cachorro' as PetAge,
                        title: 'Cachorro / Joven',
                        desc: 'Hasta 12 meses · Crecimiento',
                        badge: 'Alto fósforo y calcio',
                      },
                      {
                        id: 'adulto' as PetAge,
                        title: 'Adulto',
                        desc: '1 a 7 años · Mantenimiento óptimo',
                        badge: 'Energía equilibrada',
                      },
                      {
                        id: 'senior' as PetAge,
                        title: 'Senior (+7 años)',
                        desc: 'Cuidado articular y renal',
                        badge: 'Protección articular',
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setQuizData({ ...quizData, age: item.id });
                          setQuizStep(4);
                        }}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center transition-all ${
                          quizData.age === item.id
                            ? 'border-[#ec101d] bg-[#fff0f1]/50 ring-2 ring-[#ec101d]/20'
                            : 'border-[#eadfdb] bg-[#fffaf8] hover:border-[#181313]'
                        }`}
                      >
                        <strong className="text-base font-bold text-[#181313]">{item.title}</strong>
                        <span className="mt-1 text-xs text-[#736766]">{item.desc}</span>
                        <span className="mt-3 inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#ec101d] border border-[#eadfdb]">
                          {item.badge}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQuizStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#736766] hover:text-[#181313]"
                    >
                      ← Volver a tamaño
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 4: Resultado y Sugerencia Personalizada */}
              {quizStep === 4 && (
                <div className="rounded-2xl bg-[#fffaf8] p-6 border border-[#eadfdb]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eadfdb] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ec101d] text-white text-xs font-bold">
                        ✓
                      </span>
                      <h3 className="text-lg font-black text-[#181313] sm:text-xl">
                        Plan Personalizado para tu {quizData.petType === 'perro' ? 'Perro' : 'Gato'} ({quizData.size}, etapa {quizData.age})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#736766] hover:text-[#ec101d]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reiniciar test
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-2xl bg-white border border-[#eadfdb] sm:col-span-4">
                      <Image
                        src={recommendedProduct.image}
                        alt={recommendedProduct.name}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>

                    <div className="sm:col-span-8">
                      <span className="inline-block rounded bg-[#fff0f1] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#ec101d]">
                        Fórmula Recomendada: {recommendedProduct.tag}
                      </span>
                      <h4 className="mt-1.5 text-2xl font-black text-[#181313]">
                        {recommendedProduct.name}
                      </h4>
                      <p className="mt-2 text-sm text-[#736766] leading-relaxed">
                        {recommendedProduct.description}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-white p-3 border border-[#eadfdb]">
                          <span className="block text-[11px] text-[#736766]">Porción sugerida:</span>
                          <strong className="text-sm text-[#181313]">
                            {quizData.size === 'pequeno'
                              ? '90 - 130 g / día'
                              : quizData.size === 'mediano'
                              ? '180 - 260 g / día'
                              : '320 - 450 g / día'}
                          </strong>
                        </div>
                        <div className="rounded-xl bg-white p-3 border border-[#eadfdb]">
                          <span className="block text-[11px] text-[#736766]">Entrega en Concepción:</span>
                          <strong className="text-sm text-[#181313]">En 24 horas</strong>
                        </div>
                      </div>

                      <div className="mt-6">
                        <a
                          href={getWhatsAppUrl(quizWhatsAppMessage)}
                          target="_blank"
                          rel="noreferrer"
                          className="cta-pulse inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#ec101d] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-[#c00814] sm:w-auto"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Pedir este plan por WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Beneficios (Reveal con Stagger GSAP) */}
        <section id="beneficios" className="border-t border-[#eadfdb] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ec101d]">
                Beneficios Visibles
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#181313] sm:text-4xl">
                Diferencias que notarás en las primeras 3 semanas
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[#736766]">
                Nutrir no es solo llenar el estómago. Cuando eliminas los desechos industriales y entregas proteína limpia, el cuerpo de tu mascota reacciona con vitalidad.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Beneficio 1 */}
              <article className="benefit-card-anim rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#ec101d]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-[#181313]">
                  Digestión Óptima y Heces Firmes
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#736766]">
                  Proteínas con asimilación superior al 88% y prebióticos activos. Adiós a gases constantes, deposiciones blandas o mal olor.
                </p>
              </article>

              {/* Beneficio 2 */}
              <article className="benefit-card-anim rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#ec101d]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-[#181313]">
                  Piel Sana y Pelaje Brillante
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#736766]">
                  Ácidos grasos Omega 3 y 6 purificados que alivian picores por alergias alimentarias, reducen la caspa y detienen la caída excesiva.
                </p>
              </article>

              {/* Beneficio 3 */}
              <article className="benefit-card-anim rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#ec101d]">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-[#181313]">
                  Articulaciones Fuertes y Energía
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#736766]">
                  Glucosamina y condroitina biológica para proteger cartílagos en cada paseo, juego o salto, manteniendo su agilidad por años.
                </p>
              </article>

              {/* Beneficio 4 */}
              <article className="benefit-card-anim rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#ec101d]">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-[#181313]">
                  Longevidad y Bienestar Real
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#736766]">
                  Antioxidantes naturales (arándanos, romero, cúrcuma) que protegen órganos vitales y previenen el envejecimiento celular precoz.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 6. Producto en Detalle */}
        <section id="producto-detalle" className="border-t border-[#eadfdb] bg-[#fffaf8] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ec101d]">
                Catálogo Propio
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#181313] sm:text-4xl">
                Conoce nuestras fórmulas al detalle
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-[#736766]">
                Transparencia absoluta en cada etiqueta: ingredientes reales, análisis garantizado y planes ajustables a tu presupuesto.
              </p>
            </div>

            {/* Pestañas de selección de producto */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {catalogProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProductId(p.id)}
                  className={`rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                    selectedProductId === p.id
                      ? 'bg-[#ec101d] text-white shadow-md'
                      : 'border border-[#eadfdb] bg-white text-[#736766] hover:text-[#181313] hover:border-[#181313]'
                  }`}
                >
                  {p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            {/* Ficha técnica del producto seleccionado */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#eadfdb] bg-white p-6 shadow-xl sm:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Imagen del producto */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f5ece8] border border-[#eadfdb]">
                    <Image
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[11px] font-extrabold text-[#ec101d] shadow-sm">
                      {activeProduct.tag}
                    </div>
                  </div>
                </div>

                {/* Información y compra */}
                <div className="lg:col-span-7">
                  <span className="text-xs font-bold text-[#736766] uppercase tracking-wider">
                    {activeProduct.suitableFor}
                  </span>
                  <h3 className="mt-1 text-2xl font-black text-[#181313] sm:text-3xl">
                    {activeProduct.name}
                  </h3>
                  <p className="mt-3 text-base text-[#736766] leading-relaxed">
                    {activeProduct.description}
                  </p>

                  {/* Ingredientes destacados */}
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#181313]">
                      Ingredientes clave de origen natural:
                    </p>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {activeProduct.keyIngredients.map((ing) => (
                        <span
                          key={ing}
                          className="flex items-center gap-2 rounded-xl bg-[#fffaf8] p-2.5 text-xs font-bold text-[#181313] border border-[#eadfdb]"
                        >
                          <Check className="h-4 w-4 text-[#ec101d]" />
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selector de Plan / Modalidad */}
                  <div className="mt-6 rounded-2xl bg-[#fffaf8] p-4 border border-[#eadfdb]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#736766]">
                        Modalidad de compra:
                      </span>
                      <EditableBadge label="Valores referenciales" />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPlanFormat('suscripcion')}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          selectedPlanFormat === 'suscripcion'
                            ? 'border-[#ec101d] bg-[#fff0f1] ring-2 ring-[#ec101d]/20'
                            : 'border-[#eadfdb] bg-white hover:border-[#181313]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-extrabold uppercase text-[#ec101d]">
                            Plan Suscripción
                          </strong>
                          <span className="rounded bg-[#ec101d] px-1.5 py-0.5 text-[9px] font-black text-white">
                            -15%
                          </span>
                        </div>
                        <p className="mt-1 text-lg font-black text-[#181313]">
                          {activeProduct.frequencyPrice.split(' ')[0]}
                        </p>
                        <span className="text-[11px] text-[#736766]">
                          Despacho programado mensual
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPlanFormat('individual')}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          selectedPlanFormat === 'individual'
                            ? 'border-[#ec101d] bg-[#fff0f1] ring-2 ring-[#ec101d]/20'
                            : 'border-[#eadfdb] bg-white hover:border-[#181313]'
                        }`}
                      >
                        <strong className="text-xs font-extrabold uppercase text-[#736766]">
                          Saco Individual
                        </strong>
                        <p className="mt-1 text-lg font-black text-[#181313]">
                          {activeProduct.price}
                        </p>
                        <span className="text-[11px] text-[#736766]">
                          Compra puntual sin compromiso
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* CTA de Compra hacia WhatsApp */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={getWhatsAppUrl(
                        `Hola RASF Pets, quisiera consultar y pedir ${activeProduct.name} en modalidad ${
                          selectedPlanFormat === 'suscripcion' ? 'Plan Suscripción (-15%)' : 'Saco Individual'
                        }.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="cta-pulse inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ec101d] px-8 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-[#c00814]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Comprar por WhatsApp</span>
                    </a>

                    <span className="text-xs text-[#736766] text-center sm:text-left">
                      ✓ Despacho en 24h en Concepción · Asesoría incluida
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonios */}
        <section id="testimonios" className="border-t border-[#eadfdb] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#ec101d]">
                    Comunidad RASF Pets
                  </span>
                  <EditableBadge />
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#181313] sm:text-4xl">
                  Familias y mascotas que ya comprobaron la diferencia
                </h2>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-sm font-black text-[#181313]">4.9 / 5.0</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Testimonio 1 */}
              <article className="testimonial-card-anim flex flex-col justify-between rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#181313]">
                    &ldquo;Apolo sufría de alergias estomacales constantes y comía con desgano. Al mes de cambiar a la fórmula ibérica, su pelaje brilla como nunca y sus digestiones son impecables. La atención en Concepción es increíble.&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-[#eadfdb] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f1] text-[#ec101d] font-black text-sm">
                    CM
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#181313]">Camila Morales</strong>
                    <span className="text-[11px] text-[#736766]">Tutor de Apolo (Golden Retriever, 4 años) · Concepción</span>
                  </div>
                </div>
              </article>

              {/* Testimonio 2 */}
              <article className="testimonial-card-anim flex flex-col justify-between rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#181313]">
                    &ldquo;Mía es muy mañosa con el alimento y siempre dejaba la mitad del plato. Probamos Bocão Signature y lo devoró desde el día uno. Ya no tiene vómitos por bolas de pelo y está llena de energía.&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-[#eadfdb] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f1] text-[#ec101d] font-black text-sm">
                    RT
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#181313]">Rodrigo Toledo</strong>
                    <span className="text-[11px] text-[#736766]">Tutor de Mía (Gata Siamesa, 5 años) · San Pedro de la Paz</span>
                  </div>
                </div>
              </article>

              {/* Testimonio 3 */}
              <article className="testimonial-card-anim flex flex-col justify-between rounded-3xl border border-[#eadfdb] bg-[#fffaf8] p-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#181313]">
                    &ldquo;La comodidad del despacho programado me salvó la vida. Nunca más cargar sacos pesados desde el supermercado. Te escriben con tiempo, coordinan y te aconsejan si ves algún cambio en tu mascota.&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-[#eadfdb] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f1] text-[#ec101d] font-black text-sm">
                    FS
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#181313]">Francisca Silva</strong>
                    <span className="text-[11px] text-[#736766]">Tutora de Rocky (Pastor Alemán, 6 años) · Chiguayante</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 8. Comparación: Tradicional vs RASF Pets */}
        <section id="comparacion" className="border-t border-[#eadfdb] bg-[#fffaf8] py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-8">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ec101d]">
                Comparativa Clara
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#181313] sm:text-4xl">
                Alimento Tradicional vs. Plan Natural RASF Pets
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-[#736766]">
                ¿Por qué pagar por cereales de relleno y harinas de subproductos cuando puedes darle nutrición real?
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-[#eadfdb] bg-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Lado Tradicional */}
                <div className="border-b border-[#eadfdb] p-8 md:border-b-0 md:border-r">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-stone-600 text-xs font-bold">
                      ✕
                    </span>
                    <h3 className="text-lg font-black text-[#736766]">
                      Alimento Tradicional de Supermercado
                    </h3>
                  </div>

                  <ul className="mt-6 space-y-4 text-sm text-[#736766]">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✕</span>
                      <div>
                        <strong className="block text-[#181313]">Proteínas de bajo costo:</strong>
                        Harinas de plumas, vísceras y subproductos animales con baja biodisponibilidad.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✕</span>
                      <div>
                        <strong className="block text-[#181313]">Conservantes químicos:</strong>
                        Uso común de BHA, BHT y colorantes artificiales para alargar vida útil en góndola.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✕</span>
                      <div>
                        <strong className="block text-[#181313]">Digestión pesada:</strong>
                        Exceso de almidón y maíz que genera heces voluminosas, malolientes y gases.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✕</span>
                      <div>
                        <strong className="block text-[#181313]">Compra ciega:</strong>
                        Cero asesoría sobre el peso real de tu mascota o problemas digestivos previos.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Lado RASF Pets */}
                <div className="bg-[#fff0f1]/30 p-8">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ec101d] text-white text-xs font-bold">
                      ✓
                    </span>
                    <h3 className="text-lg font-black text-[#ec101d]">
                      Plan Natural Personalizado RASF Pets
                    </h3>
                  </div>

                  <ul className="mt-6 space-y-4 text-sm text-[#181313]">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#ec101d] shrink-0" />
                      <div>
                        <strong className="block text-[#181313]">Carnes nobles deshidratadas y frescas:</strong>
                        Ibérico, jabalí, salmón y pollo grado humano. Más del 88% de digestibilidad.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#ec101d] shrink-0" />
                      <div>
                        <strong className="block text-[#181313]">Conservación 100% biológica:</strong>
                        Tocoferoles naturales (Vitamina E) y extractos de romero. Cero químicos nocivos.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#ec101d] shrink-0" />
                      <div>
                        <strong className="block text-[#181313]">Heces compactas y cero gases:</strong>
                        Fibras vegetales solubles y legumbres seleccionadas que cuidan la microbiota.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#ec101d] shrink-0" />
                      <div>
                        <strong className="block text-[#181313]">Acompañamiento por WhatsApp:</strong>
                        Cálculo de ración, seguimiento de adaptación y despacho directo a tu puerta.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ Acordeón */}
        <section id="faq" className="border-t border-[#eadfdb] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-8">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ec101d]">
                Preguntas Frecuentes
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#181313] sm:text-4xl">
                Resolvemos tus dudas antes de comenzar
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-[#736766]">
                Todo lo que necesitas saber sobre la transición, entregas en Concepción y nuestra garantía de satisfacción.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {[
                {
                  q: '¿Cómo hago la transición desde su alimento actual sin causarle malestar?',
                  a: 'Recomendamos un período gradual de 7 días: Días 1-2 (75% alimento actual / 25% RASF), Días 3-4 (50% / 50%), Días 5-6 (25% / 75%) y Día 7 (100% RASF Pets). Al ser una fórmula biológicamente compatible, la adaptación suele ser extraordinariamente fluida.',
                },
                {
                  q: '¿Hacen envíos a todo Concepción y comunas vecinas?',
                  a: 'Sí, contamos con despacho coordinado en Concepción centro, San Pedro de la Paz, Chiguayante, Talcahuano, Hualpén y Penco. Te avisamos con anticipación por WhatsApp para coordinar el horario más cómodo para recibirlo.',
                },
                {
                  q: '¿Cómo funciona el plan de suscripción y puedo pausarlo o cancelarlo?',
                  a: 'El plan de suscripción incluye un 15% de descuento permanente y despacho automático cada 15, 30 o 45 días según el consumo de tu mascota. No tiene contratos de permanencia: puedes pausar, cambiar de fórmula o cancelar en cualquier momento con un mensaje por WhatsApp.',
                },
                {
                  q: '¿Tienen opciones para mascotas con alergias alimentarias o piel sensible?',
                  a: 'Absolutamente. Fórmulas como Natural Woodland Wild Iberian utilizan carnes alternativas (jabalí e ibérico) y 0% cereales comunes (sin maíz, trigo ni soya), siendo la opción número uno recomendada para cuadros de dermatitis y alergias digestivas.',
                },
                {
                  q: '¿Qué cubre la garantía de satisfacción de 30 días si a mi mascota no le gusta?',
                  a: 'Si tu perro o gato no se adapta con entusiasmo al alimento o no notas mejoría en su digestión durante los primeros 30 días, te cambiamos la fórmula por otra alternativa sin costo adicional o te reembolsamos tu compra. Queremos que compres con total tranquilidad.',
                },
              ].map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-[#fffaf8] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between p-5 text-left font-bold text-[#181313] hover:text-[#ec101d] transition-colors"
                    >
                      <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-[#ec101d] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                      <div className="faq-inner px-5 pb-5 text-sm text-[#736766] leading-relaxed border-t border-[#eadfdb]/50 pt-3">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 10. CTA Final + Reductor de Riesgo */}
        <section className="relative overflow-hidden border-t border-[#eadfdb] bg-[#181313] py-16 text-white sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ec101d]/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#ec101d] border border-[#ec101d]/30">
              <Zap className="h-3.5 w-3.5" />
              Compromiso de Tranquilidad
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Dale la nutrición que merece hoy mismo sin ningún riesgo
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base text-stone-300 sm:text-lg leading-relaxed">
              Pruébalo por 30 días. Si no notas a tu compañero con más energía, pelaje brillante y digestiones perfectas, te cambiamos el producto o te devolvemos el dinero.
            </p>

            {/* Tarjeta de Garantía Visible */}
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-stone-900/90 border border-stone-700/80 p-5 text-left flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ec101d] text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-white">
                  Garantía &ldquo;Pruébalo 30 Días&rdquo;
                </strong>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  Sabemos que el paladar y la digestión de cada mascota son únicos. Te acompañamos día a día en WhatsApp hasta que su adaptación sea 100% exitosa.
                </p>
              </div>
            </div>

            {/* CTA Primario Final */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={getWhatsAppUrl('Hola RASF Pets, quiero aprovechar la garantía de 30 días y comenzar con el plan de nutrición natural para mi mascota.')}
                target="_blank"
                rel="noreferrer"
                className="cta-pulse inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#ec101d] px-10 text-base font-extrabold text-white shadow-2xl transition-all hover:bg-[#c00814] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Comenzar ahora por WhatsApp</span>
              </a>
            </div>

            <p className="mt-4 text-xs text-stone-400">
              Atención directa en Concepción: +56 9 8789 8184 · Lunes a Sábado de 09:00 a 20:00 h
            </p>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <footer className="border-t border-[#eadfdb] bg-[#fffaf8] py-12 text-[#736766]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            {/* Marca y Propósito */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#eadfdb]">
                  <Image
                    src="/rasf-logo.jpg"
                    alt="Logo RASF Pets"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <span className="text-base font-black tracking-tight text-[#181313]">
                  RASF <span className="text-[#ec101d]">PETS</span>
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed max-w-sm">
                Alimentación biológicamente adecuada para perros y gatos. Nutrición preventiva de calidad superior con entrega personalizada en Concepción, Chile.
              </p>
            </div>

            {/* Contacto y Canales Oficiales */}
            <div className="md:col-span-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#181313]">
                Canales Oficiales
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a
                    href={getWhatsAppUrl('Hola RASF Pets, los contacto desde la web.')}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#ec101d] transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#ec101d]" />
                    WhatsApp: +56 9 8789 8184
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/rasfpets/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#ec101d] transition-colors"
                  >
                    <span>📸</span>
                    Instagram: @rasfpets
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/Deliverypets.ccp/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#ec101d] transition-colors"
                  >
                    <span>👥</span>
                    Facebook: Deliverypets.ccp
                  </a>
                </li>
                <li className="text-stone-500 pt-1">
                  📍 Concepción, Región del Biobío, Chile
                </li>
              </ul>
            </div>

            {/* Transparencia y Legales */}
            <div className="md:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#181313]">
                Transparencia
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-[#736766]">
                Este prototipo de conversión incluye marcas de demostración configurables (precios, cifras estadísticas y testimonios referenciales).
              </p>
              <p className="mt-3 text-[11px] text-[#736766]">
                © 2026 RASF Pets. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
