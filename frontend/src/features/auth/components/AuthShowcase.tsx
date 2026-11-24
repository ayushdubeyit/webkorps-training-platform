import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, BrainCircuit, BriefcaseBusiness, Cloud, Code2, Database, HeartPulse, Network, ShieldCheck, Smartphone, Truck, Workflow } from 'lucide-react'
import blueLogo from '../../../assets/brand/webkorps_logo_white.png'
import './auth-white-theme.css'

const achievements = [
  { value: 10, suffix: '+', label: 'Years in business' },
  { value: 500, suffix: '+', label: 'Projects delivered' },
  { value: 250, suffix: '+', label: 'Professionals' },
  { value: 30, suffix: '+', label: 'Countries served' },
]

const expertise = [
  { icon: Code2, title: 'Web & mobile', detail: 'Digital products built for people and scale' },
  { icon: Workflow, title: 'Custom software', detail: 'Tailored applications and enterprise systems' },
  { icon: BrainCircuit, title: 'AI & machine learning', detail: 'Intelligent solutions and automation' },
  { icon: Cloud, title: 'Cloud solutions', detail: 'Scalable cloud application development' },
  { icon: Network, title: 'Blockchain & IoT', detail: 'Connected, emerging technology solutions' },
  { icon: Database, title: 'Salesforce & enterprise', detail: 'Business platforms and enterprise applications' },
]

const industries = [
  { icon: HeartPulse, label: 'Healthcare' },
  { icon: BriefcaseBusiness, label: 'Fintech' },
  { icon: Truck, label: 'Logistics' },
  { icon: Code2, label: 'Real estate' },
  { icon: Workflow, label: 'Retail' },
  { icon: Smartphone, label: 'Travel & hospitality' },
  { icon: Database, label: 'Manufacturing' },
  { icon: ShieldCheck, label: 'Warehouse operations' },
]

const stories = [
  {
    name: 'Sonic Healthcare',
    category: 'Healthcare · Systems modernization',
    description: 'Modernizing legacy systems and transforming supply chain operations for a global healthcare organization.',
    image: 'https://webkorps-app.s3.us-east-1.amazonaws.com/sonic-healthcare-ai-driven-platform-for-diagnostic-servicesn.webp',
    href: 'https://www.webkorps.com/case-study/sonichealthcare',
  },
  {
    name: 'Cryoport',
    category: 'Life sciences · Logistics',
    description: 'A temperature-controlled logistics platform supporting the movement of sensitive life-sciences materials.',
    image: 'https://webkorps-app.s3.us-east-1.amazonaws.com/cryoport-temperature-controlled-logistics-and-supply-chain-solution.webp',
    href: 'https://www.webkorps.com/case-study/cryoport',
  },
  {
    name: 'PayPal',
    category: 'Fintech · Payment experience',
    description: 'Payment platform enhancements focused on checkout flexibility, analytics, and a seamless user experience.',
    image: 'https://webkorps-app.s3.us-east-1.amazonaws.com/paypal-payment-platform-for-merchants.webp',
    href: 'https://www.webkorps.com/case-study/paypal',
  },
]

export function AuthShowcase() {
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]')
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.dataset.visible = 'true')
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const target = entry.target as HTMLElement
        target.dataset.visible = 'true'
        observer.unobserve(target)
      })
    }, { root, threshold: 0.12, rootMargin: '0px 0px -30px 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <aside className="auth-showcase auth-showcase--light" aria-label="About Webkorps">
      <div className="auth-showcase__glow auth-showcase__glow--one" aria-hidden="true" />
      <div className="auth-showcase__glow auth-showcase__glow--two" aria-hidden="true" />
      <div className="auth-showcase__scroll" ref={contentRef}>
        <div className="auth-showcase__inner">
          <header className="auth-showcase__brand">
            <img src={blueLogo} alt="Webkorps" />
            <span>LEARNING PLATFORM</span>
          </header>
          <section className="auth-hero" data-reveal>
            <p className="auth-eyebrow"><span /> PEOPLE · TECHNOLOGY · IMPACT</p>
            <h2>Engineering ideas into <span>digital impact.</span></h2>
            <p className="auth-hero__copy">Discover how technology, innovation and talented people come together to build solutions for businesses around the world.</p>
            <div className="auth-hero__chips" aria-label="Areas of expertise">
              <span>Digital engineering</span><span>Global delivery</span><span>Continuous learning</span>
            </div>
          </section>
          <button type="button" className="auth-showcase__expand" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
            {expanded ? 'Hide company overview' : 'Explore Webkorps'} <span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </button>
          <div className={`auth-showcase__details${expanded ? ' is-expanded' : ''}`}>
            <section className="auth-section auth-stats" aria-labelledby="auth-stats-title">
              <div className="auth-section__heading" data-reveal>
                <p className="auth-eyebrow">OUR JOURNEY</p><h3 id="auth-stats-title">Built on experience.<br />Focused on what’s next.</h3>
                <p>Company-reported figures from Webkorps.</p>
              </div>
              <div className="auth-stats__grid">
                {achievements.map((item, index) => <AnimatedStat key={item.label} {...item} index={index} />)}
              </div>
            </section>

            <section className="auth-section" aria-labelledby="auth-expertise-title">
              <div className="auth-section__heading" data-reveal><p className="auth-eyebrow">WHAT WE DO</p><h3 id="auth-expertise-title">Technology with purpose.</h3><p>Expertise across services and platforms that help organizations move forward.</p></div>
              <div className="auth-expertise__grid">
                {expertise.map(({ icon: Icon, title, detail }, index) => <article key={title} className="auth-expertise-card" data-reveal style={{ '--reveal-delay': `${index * 60}ms` } as React.CSSProperties}><span><Icon size={18} aria-hidden="true" /></span><div><h4>{title}</h4><p>{detail}</p></div></article>)}
              </div>
            </section>

            <section className="auth-section" aria-labelledby="auth-industries-title">
              <div className="auth-section__heading" data-reveal><p className="auth-eyebrow">INDUSTRIES WE SERVE</p><h3 id="auth-industries-title">Different challenges.<br />Thoughtful solutions.</h3></div>
              <div className="auth-industries__grid">
                {industries.map(({ icon: Icon, label }, index) => <div className="auth-industry" key={label} data-reveal style={{ '--reveal-delay': `${index * 45}ms` } as React.CSSProperties}><Icon size={17} aria-hidden="true" /><span>{label}</span></div>)}
              </div>
            </section>

            <section className="auth-section" aria-labelledby="auth-stories-title">
              <div className="auth-section__heading" data-reveal><p className="auth-eyebrow">SELECTED CASE STUDIES</p><h3 id="auth-stories-title">Ideas put into action.</h3><p>Explore published work from across the Webkorps portfolio.</p></div>
              <div className="auth-stories__grid">
                {stories.map((story, index) => <a key={story.name} className="auth-story" href={story.href} target="_blank" rel="noreferrer" data-reveal style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties}>
                  <div className="auth-story__image"><img src={story.image} alt="" loading="lazy" /><span>CASE STUDY <ArrowUpRight size={14} aria-hidden="true" /></span></div>
                  <div className="auth-story__body"><p>{story.category}</p><h4>{story.name}</h4><span>{story.description}</span></div>
                </a>)}
              </div>
            </section>

            <footer className="auth-closing" data-reveal>
              <p className="auth-eyebrow">KEEP LEARNING. KEEP BUILDING.</p>
              <h3>Grow, learn and build the future with Webkorps.</h3>
              <p>Explore your training resources and keep developing the skills behind tomorrow’s digital solutions.</p>
            </footer>
          </div>
          <p className="auth-showcase__source">Company information: <a href="https://www.webkorps.com/about-us" target="_blank" rel="noreferrer">About Webkorps</a> · <a href="https://www.webkorps.com/case-study" target="_blank" rel="noreferrer">Case studies</a></p>
        </div>
      </div>
    </aside>
  )
}

function AnimatedStat({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const node = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [count, setCount] = useState(() => reducedMotion || !('IntersectionObserver' in window) ? value : 0)
  const [started, setStarted] = useState(() => reducedMotion || !('IntersectionObserver' in window))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
      if (event.matches) {
        setCount(value)
        setStarted(true)
      }
    }
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [value])

  useEffect(() => {
    const element = node.current
    if (!element || reducedMotion || !('IntersectionObserver' in window)) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setStarted(true)
      const startTime = performance.now()
      const duration = 950
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setCount(Math.round(value * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      observer.disconnect()
    }, { root: node.current?.closest('.auth-showcase__scroll'), threshold: 0.35 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion, value])

  return <div ref={node} className="auth-stat" data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}><span className="auth-stat__number">{started ? count : '0'}{suffix}</span><span className="auth-stat__label">{label}</span></div>
}
