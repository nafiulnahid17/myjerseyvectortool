'use client';

import type { ComponentType, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  House,
  Layers3,
  Palette,
  Search,
  ScanLine,
  Settings2,
  Shirt,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { useStudioSession } from '@/components/auth/studio-session';
import { JerseyToolHighlightCard } from '@/components/dashboard/jersey-tool-highlight-card';
import { categoryOrder, jerseyTools, type ToolCategory } from '@/components/dashboard/jersey-tool-catalogue';

const sectionContent: Record<ToolCategory, {
  id: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = {
  'AI Powered Tools': {
    id: 'ai-powered-tools',
    description: 'Move from jersey artwork to editable production output with tools built around the work.',
    icon: Sparkles,
  },
  'Elements Tools': {
    id: 'elements-tools',
    description: 'Build a stronger design library, convert assets, and prepare the formats your workflow needs.',
    icon: Palette,
  },
  'Emergency Tools': {
    id: 'emergency-tools',
    description: 'Keep production moving with hands-on tools for tracing, color, recovery, and cut setup.',
    icon: ShieldCheck,
  },
};

export function JerseyOSLandingPage() {
  const session = useStudioSession();
  const groupedTools = useMemo(
    () => categoryOrder.map((category) => ({
      category,
      tools: jerseyTools.filter((tool) => tool.category === category),
    })),
    [],
  );

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  function featureClick(event: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    if (session.canAccessFeatures) return;
    event.preventDefault();
    session.requestAccess(href);
  }

  return (
    <main className="jerseyos-landing" id="top">
      <div className="landing-showcase">
        <header className="landing-nav">
          <Link className="landing-brand" href="/" aria-label="JerseyOS home">
            <JerseyOSMark />
            <span>Jersey<span className="landing-brand-accent">OS</span></span>
          </Link>
          <nav className="landing-links" aria-label="Main navigation">
            <a href="#ai-powered-tools">Product <ChevronDown aria-hidden="true" /></a>
            <a href="#emergency-tools">Solutions <ChevronDown aria-hidden="true" /></a>
            <a href="/templates" onClick={(event) => featureClick(event, '/templates')}>Templates <ChevronDown aria-hidden="true" /></a>
            <a href="/upgrade" onClick={(event) => featureClick(event, '/upgrade')}>Pricing</a>
            <a href="/help-support" onClick={(event) => featureClick(event, '/help-support')}>Resources <ChevronDown aria-hidden="true" /></a>
          </nav>
          <div className="landing-nav-actions">
            <button
              className="landing-search-button"
              type="button"
              aria-label="Browse the JerseyOS tools"
              title="Browse the tool catalogue"
              onClick={() => document.getElementById('ai-powered-tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Search aria-hidden="true" />
            </button>
            <button className="landing-signin-button" type="button" onClick={() => session.openLogin()}>
              Sign in
            </button>
            <a
              className="landing-nav-cta"
              href="/image-to-vector"
              onClick={(event) => featureClick(event, '/image-to-vector')}
            >
              Get started <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </header>

        <section className="landing-hero" aria-labelledby="landing-title">
          <nav className="landing-side-rail" aria-label="JerseyOS shortcuts">
            <a className="is-active" href="#top" aria-label="Home"><House aria-hidden="true" /></a>
            <a href="#ai-powered-tools" aria-label="AI powered tools"><Box aria-hidden="true" /></a>
            <a href="/image-to-vector" onClick={(event) => featureClick(event, '/image-to-vector')} aria-label="VectorForge"><Shirt aria-hidden="true" /></a>
            <Link href="/control-center" onClick={(event) => featureClick(event, '/control-center')} aria-label="Workspace settings"><Settings2 aria-hidden="true" /></Link>
            <a href="#elements-tools" aria-label="Elements tools"><ChartNoAxesColumnIncreasing aria-hidden="true" /></a>
            <Link href="/control-center/my-workspace/my-profile" onClick={(event) => featureClick(event, '/control-center/my-workspace/my-profile')} aria-label="My profile"><UsersRound aria-hidden="true" /></Link>
          </nav>

          <div className="landing-hero-copy">
            <span className="landing-overline"><span /> AI-POWERED <b>·</b> FROM IDEA TO JERSEY</span>
            <h1 id="landing-title">Make every<br />jersey a <em>masterpiece.</em></h1>
            <p>
              Design, automate, and produce stunning custom jerseys with the power of AI —
              all in one seamless JerseyOS workflow.
            </p>
            <div className="landing-hero-actions">
              <a className="landing-button landing-button-primary" href="#ai-powered-tools">
                Explore <ArrowRight aria-hidden="true" />
              </a>
              <a
                className="landing-button landing-button-secondary"
                href="/image-to-vector"
                onClick={(event) => featureClick(event, '/image-to-vector')}
              >
                <span className="landing-play-icon"><ArrowUpRight aria-hidden="true" /></span>
                Start designing
              </a>
            </div>
            <div className="landing-feature-cards">
              <div className="landing-feature-card">
                <span><Shirt aria-hidden="true" /></span>
                <div><strong>15</strong><small>Connected tools</small></div>
              </div>
              <div className="landing-feature-card">
                <span><Workflow aria-hidden="true" /></span>
                <div><strong>One</strong><small>Jersey workflow</small></div>
              </div>
              <div className="landing-feature-card">
                <span><Layers3 aria-hidden="true" /></span>
                <div><strong>Editable</strong><small>Design outputs</small></div>
              </div>
            </div>
            <div className="landing-trust-row">
              <span className="landing-trust-label">BUILT FOR EVERY STEP</span>
              <div className="landing-trust-marks" aria-label="Design, teams, artwork, and production">
                <span><Palette aria-hidden="true" /> DESIGN</span>
                <span><UsersRound aria-hidden="true" /> TEAMS</span>
                <span><Layers3 aria-hidden="true" /> ARTWORK</span>
                <span><Shirt aria-hidden="true" /> JERSEYS</span>
                <span><Workflow aria-hidden="true" /> PRODUCTION</span>
              </div>
            </div>
          </div>

          <div className="landing-hero-art" aria-hidden="true">
            <div className="hero-ambient hero-ambient-one" />
            <div className="hero-ambient hero-ambient-two" />
            <div className="hero-stadium-light hero-stadium-light-one" />
            <div className="hero-stadium-light hero-stadium-light-two" />
            <div className="hero-screen">
              <div className="hero-screen-top">
                <div className="hero-mini-brand"><JerseyOSMark /><strong>Jersey<span>OS</span></strong></div>
                <div className="hero-search-bar"><Search aria-hidden="true" /><span>Search designs, orders, or anything...</span></div>
                <span className="hero-screen-notification"><i /></span>
                <span className="hero-user-avatar">J</span>
              </div>
              <div className="hero-screen-body">
                <div className="hero-screen-rail">
                  <span className="is-active"><House aria-hidden="true" /> Home</span>
                  <span><Palette aria-hidden="true" /> Design</span>
                  <span><Sparkles aria-hidden="true" /> AI Tools</span>
                  <span><Shirt aria-hidden="true" /> Production</span>
                  <span><Layers3 aria-hidden="true" /> Orders</span>
                  <span><ChartNoAxesColumnIncreasing aria-hidden="true" /> Analytics</span>
                  <span><Settings2 aria-hidden="true" /> Settings</span>
                </div>
                <div className="hero-production-board">
                  <div className="hero-board-main">
                    <div className="hero-board-copy">
                      <div className="hero-board-title"><b>Turn ideas into<br />iconic jerseys.</b></div>
                      <p>AI design. Real production. One seamless workflow.</p>
                      <span className="hero-board-button">Start designing <ArrowRight aria-hidden="true" /></span>
                    </div>
                    <div className="hero-jersey-feature">
                      <span className="hero-generated-label"><Sparkles aria-hidden="true" /> AI assisted</span>
                      <JerseyIllustration />
                    </div>
                  </div>
                  <div className="hero-tool-tiles">
                    <span><i><Sparkles aria-hidden="true" /></i><b>AI Design</b><small>Create with AI</small></span>
                    <span><i><Layers3 aria-hidden="true" /></i><b>Templates</b><small>Browse designs</small></span>
                    <span><i><ScanLine aria-hidden="true" /></i><b>Preview</b><small>Review design</small></span>
                    <span><i><Shirt aria-hidden="true" /></i><b>Production</b><small>Prepare files</small></span>
                  </div>
                  <div className="hero-board-lower">
                    <div className="hero-live-preview">
                      <b>Design preview</b>
                      <div><JerseyIllustration /><JerseyIllustration /><JerseyIllustration /></div>
                    </div>
                    <div className="hero-workflow-preview">
                      <b>Your jersey, step by step.</b>
                      <div><span><i />Design</span><span><i />Review</span><span><i />Prepare</span><span><i />Export</span></div>
                      <small>From first artwork to production files</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <HeroRobot />
            <div className="hero-production-chip"><span><ChartNoAxesColumnIncreasing aria-hidden="true" /></span><b>Production ready</b><small>Editable output</small><ArrowUpRight aria-hidden="true" /></div>
          </div>

          <a className="landing-scroll-cue" href="#ai-powered-tools">
            <span>Explore the workspace</span><ArrowDown aria-hidden="true" />
          </a>
        </section>
      </div>

      <div className="landing-content">
        {groupedTools.map((group) => {
          const content = sectionContent[group.category];
          const CategoryIcon = content.icon;

          return (
            <section
              className={`landing-tool-section landing-tool-section-${content.id}`}
              id={content.id}
              key={group.category}
              data-scroll-reveal
              aria-labelledby={`${content.id}-title`}
            >
              <div className="landing-section-heading">
                <div className="landing-section-title-wrap">
                  <span className="landing-section-icon"><CategoryIcon aria-hidden="true" /></span>
                  <div>
                    <h2 id={`${content.id}-title`}>{group.category}</h2>
                    <p>{content.description}</p>
                  </div>
                </div>
                <span className="landing-section-count">{String(group.tools.length).padStart(2, '0')} tools</span>
              </div>
              <div className="landing-tool-grid">
                {group.tools.map((tool, toolIndex) => (
                  <JerseyToolHighlightCard
                    key={tool.href}
                    tool={tool}
                    index={toolIndex}
                    onOpen={featureClick}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="landing-footer" data-scroll-reveal>
        <div className="landing-footer-main">
          <div className="landing-footer-brand">
            <Link className="landing-brand" href="/" aria-label="JerseyOS home">
              <JerseyOSMark />
              <span>Jersey<span className="landing-brand-accent">OS</span></span>
            </Link>
            <p>A connected workspace for jersey design, artwork refinement, and production preparation.</p>
          </div>
          <div className="landing-footer-column">
            <h2>Explore</h2>
            <a href="#ai-powered-tools">AI powered tools</a>
            <a href="#elements-tools">Elements tools</a>
            <a href="#emergency-tools">Production tools</a>
            <a href="/templates" onClick={(event) => featureClick(event, '/templates')}>Templates</a>
          </div>
          <div className="landing-footer-column">
            <h2>JerseyOS</h2>
            <a href="/about-us" onClick={(event) => featureClick(event, '/about-us')}>About</a>
            <a href="/help-support" onClick={(event) => featureClick(event, '/help-support')}>Help &amp; support</a>
            <a href="/settings" onClick={(event) => featureClick(event, '/settings')}>Settings</a>
          </div>
          <a
            className="landing-footer-cta"
            href="/image-to-vector"
            onClick={(event) => featureClick(event, '/image-to-vector')}
          >
            <span>Ready to shape your next jersey?</span>
            <strong>Open VectorForge <ArrowUpRight aria-hidden="true" /></strong>
          </a>
        </div>
        <div className="landing-footer-bottom">
          <span>JerseyOS</span>
          <span>Design thoughtfully. Prepare confidently.</span>
          <a href="#top">Back to top <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </footer>
    </main>
  );
}

function JerseyOSMark() {
  return (
    <svg className="jerseyos-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M23.8 4.5c-5.4 0-8.3 5.2-5.8 10.7l5.8 8.9 5.8-8.9C32.1 9.7 29.2 4.5 23.8 4.5Z" fill="currentColor" />
      <path d="M43.5 23.8c0-5.4-5.2-8.3-10.7-5.8l-8.9 5.8 8.9 5.8c5.5 2.5 10.7-.4 10.7-5.8Z" fill="currentColor" opacity=".82" />
      <path d="M24.2 43.5c5.4 0 8.3-5.2 5.8-10.7l-5.8-8.9-5.8 8.9c-2.5 5.5.4 10.7 5.8 10.7Z" fill="currentColor" opacity=".68" />
      <path d="M4.5 24.2c0 5.4 5.2 8.3 10.7 5.8l8.9-5.8-8.9-5.8C9.7 15.9 4.5 18.8 4.5 24.2Z" fill="currentColor" opacity=".9" />
      <circle cx="24" cy="24" r="4.1" fill="#071311" />
    </svg>
  );
}

function JerseyIllustration() {
  return (
    <svg className="hero-jersey-art" viewBox="0 0 200 230" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hero-jersey-fill" x1="36" y1="28" x2="166" y2="212" gradientUnits="userSpaceOnUse">
          <stop stopColor="#172F34" />
          <stop offset=".55" stopColor="#0A191F" />
          <stop offset="1" stopColor="#17352D" />
        </linearGradient>
        <linearGradient id="hero-jersey-edge" x1="38" y1="34" x2="158" y2="206" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B5FFE8" />
          <stop offset=".52" stopColor="#3FE6B7" />
          <stop offset="1" stopColor="#198F75" />
        </linearGradient>
      </defs>
      <path d="m63 23 18-11h38l18 11 37 20-20 39-21-11v137H47V71L26 82 6 43l37-20 20 39 18-18" transform="translate(5 0)" fill="url(#hero-jersey-fill)" stroke="url(#hero-jersey-edge)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M84 13c2 17 31 17 34 0" stroke="#A6FFE1" strokeWidth="5" strokeLinecap="round" />
      <path d="m49 105 41 18 12-14 12 14 41-18M49 160l51 22 55-22" stroke="#3FE6B7" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 82 100 94l26-12M75 122l25-10 26 10" stroke="#70F9D3" strokeOpacity=".5" strokeWidth="2" />
      <text x="100" y="153" fill="#D5FFF2" textAnchor="middle" fontSize="31" fontWeight="800" fontFamily="Arial, sans-serif">23</text>
      <path d="M82 38h36" stroke="#A6FFE1" strokeOpacity=".7" strokeWidth="2" />
    </svg>
  );
}

function HeroRobot() {
  return (
    <svg className="hero-robot-art" viewBox="0 0 470 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="robot-shell" x1="106" y1="49" x2="341" y2="407" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9FFFC" />
          <stop offset=".23" stopColor="#94B2AA" />
          <stop offset=".48" stopColor="#253A38" />
          <stop offset=".74" stopColor="#061313" />
          <stop offset="1" stopColor="#A6C9BE" />
        </linearGradient>
        <linearGradient id="robot-head" x1="111" y1="96" x2="355" y2="269" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3FFF9" />
          <stop offset=".17" stopColor="#809D94" />
          <stop offset=".25" stopColor="#122321" />
          <stop offset=".72" stopColor="#020807" />
          <stop offset="1" stopColor="#54726A" />
        </linearGradient>
        <linearGradient id="robot-face" x1="158" y1="132" x2="314" y2="229" gradientUnits="userSpaceOnUse">
          <stop stopColor="#071110" />
          <stop offset=".5" stopColor="#020807" />
          <stop offset="1" stopColor="#142A25" />
        </linearGradient>
        <linearGradient id="robot-arm" x1="73" y1="290" x2="425" y2="333" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4FFFB" />
          <stop offset=".28" stopColor="#A2BDB5" />
          <stop offset=".55" stopColor="#324944" />
          <stop offset=".78" stopColor="#D0E2DA" />
          <stop offset="1" stopColor="#49615B" />
        </linearGradient>
        <radialGradient id="robot-eye">
          <stop stopColor="#C5FFF1" />
          <stop offset=".48" stopColor="#56FFDB" />
          <stop offset="1" stopColor="#00CFA8" />
        </radialGradient>
        <filter id="robot-glow" x="102" y="139" width="261" height="99" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="robot-shadow" x="28" y="29" width="429" height="480" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
          <feOffset dy="12" />
          <feComponentTransfer><feFuncA slope=".42" type="linear" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#robot-shadow)">
        <path d="M228 73V42" stroke="url(#robot-shell)" strokeWidth="11" strokeLinecap="round" />
        <circle cx="228" cy="35" r="12" fill="#68FFE0" />
        <circle cx="228" cy="35" r="18" stroke="#64F9D5" strokeOpacity=".48" strokeWidth="3" />
        <path d="M122 94C128 49 171 27 231 28c70 1 112 24 122 69l18 86c5 27-13 53-40 58-62 12-147 12-207 0-27-5-45-31-40-58l18-89Z" fill="url(#robot-head)" stroke="#B8D2C9" strokeWidth="8" />
        <path d="M146 108c21-22 57-32 93-32 41 0 76 11 96 34" stroke="#F0FFF9" strokeOpacity=".77" strokeWidth="7" strokeLinecap="round" />
        <path d="M145 116c28-19 58-28 94-28 37 0 69 9 96 29l11 54c3 17-8 33-25 36-51 9-111 9-162 0-17-3-28-19-25-36l11-55Z" fill="url(#robot-face)" stroke="#728D83" strokeWidth="4" />
        <ellipse cx="186" cy="161" rx="32" ry="43" fill="#3CFFE0" fillOpacity=".38" filter="url(#robot-glow)" />
        <ellipse cx="284" cy="161" rx="32" ry="43" fill="#3CFFE0" fillOpacity=".38" filter="url(#robot-glow)" />
        <ellipse cx="187" cy="161" rx="23" ry="32" fill="url(#robot-eye)" />
        <ellipse cx="285" cy="161" rx="23" ry="32" fill="url(#robot-eye)" />
        <path d="M218 207c9 7 20 7 29 0" stroke="#60F5D1" strokeWidth="4" strokeLinecap="round" />
        <path d="M124 120c-27 2-42 21-42 48v20c0 15 11 26 26 26h18" fill="url(#robot-shell)" stroke="#A9C1B9" strokeWidth="8" />
        <path d="M355 121c27 2 42 21 42 48v20c0 15-11 26-26 26h-18" fill="url(#robot-shell)" stroke="#A9C1B9" strokeWidth="8" />
        <ellipse cx="91" cy="176" rx="22" ry="34" fill="#0A1B18" stroke="#50DCC0" strokeWidth="5" />
        <ellipse cx="389" cy="176" rx="22" ry="34" fill="#0A1B18" stroke="#50DCC0" strokeWidth="5" />
        <ellipse cx="91" cy="176" rx="9" ry="18" fill="#8FFFE8" fillOpacity=".8" />
        <ellipse cx="389" cy="176" rx="9" ry="18" fill="#8FFFE8" fillOpacity=".8" />

        <path d="M189 249v25c0 20 17 36 38 36h3c21 0 38-16 38-36v-25" fill="url(#robot-shell)" stroke="#A8C1B9" strokeWidth="7" />
        <path d="M148 285c22-15 53-20 80-20s58 5 80 20l36 31c19 16 29 41 29 66v40c0 24-20 44-44 44H127c-24 0-44-20-44-44v-40c0-25 10-50 29-66l36-31Z" fill="url(#robot-shell)" stroke="#B4CFC4" strokeWidth="8" />
        <path d="M163 303c19-10 42-14 65-14s46 4 65 14l25 22c13 12 20 29 20 47v47c0 19-15 34-34 34H150c-19 0-34-15-34-34v-47c0-18 7-35 20-47l27-22Z" fill="#10211E" stroke="#58746B" strokeWidth="4" />
        <path d="M228 329c-27 0-42 26-30 50l30 36 30-36c12-24-3-50-30-50Z" fill="#55F0B4" />
        <path d="M275 377c0-27-26-42-50-30l-36 30 36 30c24 12 50-3 50-30Z" fill="#55F0B4" fillOpacity=".82" />
        <path d="M228 425c27 0 42-26 30-50l-30-36-30 36c-12 24 3 50 30 50Z" fill="#55F0B4" fillOpacity=".68" />
        <path d="M181 377c0 27 26 42 50 30l36-30-36-30c-24-12-50 3-50 30Z" fill="#55F0B4" fillOpacity=".9" />
        <circle cx="228" cy="377" r="12" fill="#0C1E1A" />
        <path d="M169 462v24M287 462v24" stroke="#9AB6AC" strokeWidth="17" strokeLinecap="round" />
        <path d="M146 484h48M261 484h48" stroke="#667E75" strokeWidth="12" strokeLinecap="round" />

        <path d="m116 321-35-6c-24-4-40-27-34-51l13-53" stroke="url(#robot-arm)" strokeWidth="27" strokeLinecap="round" />
        <circle cx="59" cy="208" r="23" fill="url(#robot-shell)" stroke="#C7D9D1" strokeWidth="6" />
        <path d="m65 195-10-23-20-10c-10-5-19 6-12 15l13 16-16 3c-12 3-10 20 3 20h30" fill="url(#robot-shell)" stroke="#C7D9D1" strokeWidth="6" strokeLinejoin="round" />
        <path d="m342 325 35-7c23-5 37-27 31-50l-8-32" stroke="url(#robot-arm)" strokeWidth="28" strokeLinecap="round" />
        <circle cx="399" cy="224" r="23" fill="url(#robot-shell)" stroke="#C7D9D1" strokeWidth="6" />
        <path d="m406 211 18-20 22-9c11-4 18 9 9 17l-15 13 15 5c12 4 8 21-5 20l-29-4" fill="url(#robot-shell)" stroke="#C7D9D1" strokeWidth="6" strokeLinejoin="round" />
        <path d="M395 212v-22M408 215l9-21M387 213l-7-20" stroke="#D4E6DE" strokeWidth="8" strokeLinecap="round" />
        <path d="M111 88c7-20 24-34 47-43" stroke="white" strokeOpacity=".72" strokeWidth="4" strokeLinecap="round" />
        <path d="M327 286c24 9 43 25 58 44" stroke="#80F7D1" strokeOpacity=".58" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
