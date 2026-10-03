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
