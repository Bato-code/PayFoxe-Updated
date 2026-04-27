import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: '✅',
    tag: 'TASKS',
    title: 'Complete Tasks',
    desc: 'Simple micro-tasks that pay. Watch ads, click links, download apps — get credited instantly.',
    color: '#7c3aed',
  },
  {
    icon: '🎮',
    tag: 'GAMES',
    title: 'Play & Earn',
    desc: 'Enjoy casual games and tournaments. The more you play, the more you earn. Fun has a payout.',
    color: '#9333ea',
  },
  {
    icon: '📋',
    tag: 'SURVEYS',
    title: 'Share Opinions',
    desc: 'Brands pay for your feedback. Complete short surveys and get rewarded for your thoughts.',
    color: '#a855f7',
  },
  {
    icon: '🪙',
    tag: 'REFERRALS',
    title: 'Refer & Multiply',
    desc: 'Invite friends and earn commissions on everything they make. Build passive income effortlessly.',
    color: '#d4a017',
  },
]

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up free in under 60 seconds. No card required.' },
  { num: '02', title: 'Pick Your Activity', desc: 'Choose tasks, games, or surveys that suit your schedule.' },
  { num: '03', title: 'Earn Real Money', desc: 'Credits hit your wallet instantly after each activity.' },
  { num: '04', title: 'Withdraw Anytime', desc: 'Cash out to bank or mobile money — no minimum hold.' },
]

const stats = [
  { value: '50K+', label: 'Active Earners' },
  { value: '₦2B+', label: 'Total Paid Out' },
  { value: '4.9★', label: 'User Rating' },
  { value: '3 min', label: 'Avg. First Payout' },
]

const floatingSymbols = [
  { symbol: '₦',  top: '18%', left: '6%',   size: 40, delay: '0s',   duration: '6s' },
  { symbol: '💰', top: '28%', right: '7%',  size: 36, delay: '1.5s', duration: '7s' },
  { symbol: '🪙', top: '62%', left: '4%',   size: 30, delay: '0.8s', duration: '5.5s' },
  { symbol: '💵', top: '72%', right: '9%',  size: 34, delay: '2s',   duration: '6.5s' },
  { symbol: '₦',  top: '48%', right: '4%',  size: 26, delay: '1s',   duration: '8s' },
  { symbol: '💸', top: '82%', left: '10%',  size: 28, delay: '3s',   duration: '6s' },
]

const earningsRows = [
  { label: 'Daily Tasks',     amount: '₦2,500',  icon: '✅' },
  { label: 'Game Bonuses',    amount: '₦1,800',  icon: '🎮' },
  { label: 'Survey Rewards',  amount: '₦1,200',  icon: '📋' },
  { label: 'Referral Income', amount: '₦3,000+', icon: '🪙' },
]

const avatarColors = ['#7c3aed', '#d4a017', '#0d0d0d', '#22c55e', '#9333ea']

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navScrolled = scrollY > 50

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#ffffff',
      color: '#0d0d0d',
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%     { transform: translateY(-16px) rotate(4deg); }
          66%     { transform: translateY(-7px) rotate(-3deg); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .pf-btn-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #0d0d0d 100%);
          border: none; color: #fff; border-radius: 3rem;
          cursor: pointer; font-family: inherit; font-weight: 700;
          box-shadow: 0 8px 28px rgba(124,58,237,0.35);
          transition: all 0.25s;
        }
        .pf-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 44px rgba(124,58,237,0.5);
        }
        .pf-btn-outline {
          background: transparent;
          border: 1.5px solid rgba(13,13,13,0.2);
          color: #0d0d0d; border-radius: 3rem;
          cursor: pointer; font-family: inherit; font-weight: 700;
          transition: all 0.25s;
        }
        .pf-btn-outline:hover {
          background: #0d0d0d;
          color: #fff;
          border-color: #0d0d0d;
        }
        .feature-card {
          background: #fff;
          border: 1.5px solid rgba(13,13,13,0.08);
          border-radius: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(13,13,13,0.06);
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(124,58,237,0.13);
          border-color: rgba(124,58,237,0.3);
        }
        .step-card:hover .step-num { color: #d4a017 !important; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #7c3aed !important; }
        .footer-link:hover { color: #7c3aed !important; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: navScrolled ? '0.9rem 2.5rem' : '1.4rem 2.5rem',
        background: navScrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(18px)' : 'none',
        boxShadow: navScrolled ? '0 1px 0 rgba(13,13,13,0.08)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #0d0d0d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: '#d4a017',
          }}>P</div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0d0d0d' }}>
            Pay<span style={{ color: '#7c3aed' }}>Foxe</span>
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it Works', id: 'how-it-works' },
            { label: 'Earnings', id: 'earnings' },
          ].map(({ label, id }) => (
            <span
              key={id}
              className="nav-link"
              style={{ fontSize: '0.88rem', fontWeight: 600, color: '#333', cursor: 'pointer' }}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/login')}
            className="pf-btn-outline"
            style={{ padding: '0.5rem 1.3rem', fontSize: '0.86rem' }}
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="pf-btn-primary"
            style={{ padding: '0.5rem 1.4rem', fontSize: '0.86rem' }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '9rem 1.5rem 5rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-6%', width: '560px', height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '0%', right: '-5%', width: '440px', height: '440px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,23,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(13,13,13,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating money symbols */}
        {floatingSymbols.map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: c.top,
            left: (c as any).left,
            right: (c as any).right,
            fontSize: `${c.size}px`,
            opacity: 0.13,
            animation: `float ${c.duration} ease-in-out ${c.delay} infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {c.symbol}
          </div>
        ))}

        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(13,13,13,0.04))',
          border: '1px solid rgba(13,13,13,0.12)',
          padding: '0.4rem 1.1rem', borderRadius: '2rem', marginBottom: '2rem',
          fontSize: '0.78rem', fontWeight: 700, color: '#0d0d0d',
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          animation: 'fadeUp 0.5s ease both',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
            display: 'inline-block', animation: 'pulse-dot 1.5s ease-in-out infinite',
          }} />
          Live Payouts · 50,000+ Active Earners
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7.5vw, 6rem)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: '-0.04em',
          maxWidth: '860px', marginBottom: '1.5rem',
          animation: 'fadeUp 0.6s ease 0.1s both',
        }}>
          <span style={{ color: '#0d0d0d' }}>Get Paid to Play,</span><br />
          <span style={{
            background: 'linear-gradient(135deg, #7c3aed 20%, #d4a017 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Task & Earn.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: '#444',
          maxWidth: '540px', lineHeight: 1.8, marginBottom: '2.8rem',
          animation: 'fadeUp 0.6s ease 0.2s both',
        }}>
          PayFoxe pays you real Nigerian Naira for completing tasks, playing games, and filling surveys.
          No skills needed. Start earning in minutes.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeUp 0.6s ease 0.3s both',
        }}>
          <button
            onClick={() => navigate('/register')}
            className="pf-btn-primary"
            style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}
          >
            Start Earning Free 🪙
          </button>
          <button
            onClick={() => navigate('/login')}
            className="pf-btn-outline"
            style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}
          >
            Sign In →
          </button>
        </div>

        {/* Social proof */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.9rem',
          marginTop: '3rem', animation: 'fadeUp 0.6s ease 0.4s both',
        }}>
          <div style={{ display: 'flex' }}>
            {avatarColors.map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: '50%', background: c,
                border: '2px solid #fff', marginLeft: i === 0 ? 0 : -9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.68rem', fontWeight: 800, color: '#fff',
              }}>
                {['A','B','C','D','E'][i]}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.84rem', color: '#555', fontWeight: 600 }}>
            <span style={{ color: '#d4a017', fontWeight: 800 }}>₦2B+</span> paid to users this month
          </p>
        </div>
      </section>

      {/* ── SCROLLING TICKER ─────────────────────────────────────────────────── */}
      <div style={{
        background: '#0d0d0d', overflow: 'hidden', padding: '1rem 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          display: 'flex', width: 'max-content',
          animation: 'ticker 22s linear infinite',
        }}>
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
              {['Complete Tasks', 'Play Games', 'Fill Surveys', 'Refer Friends', 'Earn Daily', 'Withdraw Instantly', 'No Skills Needed', 'Free to Join'].map((t, i) => (
                <span key={i} style={{
                  fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap',
                  color: i % 2 === 0 ? '#d4a017' : 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                }}>
                  {t} {i % 2 === 0 ? '🪙' : '·'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0533 50%, #3b0d80 100%)',
        padding: '4rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          textAlign: 'center',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '1.5rem 1rem',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#d4a017' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem', fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '7rem 1.5rem' }} id="features">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#d4a017',
            letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '0.75rem',
          }}>
            How You Earn
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 800,
            letterSpacing: '-0.03em', color: '#0d0d0d', lineHeight: 1.15,
          }}>
            Four ways to make money<br />
            <span style={{ color: '#7c3aed' }}>on your own terms</span>
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{ padding: '2rem', animation: `fadeUp 0.5s ease ${i * 0.1}s both`, cursor: 'default' }}
            >
              <span style={{
                display: 'inline-block',
                background: `${f.color}14`, border: `1px solid ${f.color}35`,
                color: f.color, padding: '0.2rem 0.75rem', borderRadius: '2rem',
                fontSize: '0.67rem', fontWeight: 800, letterSpacing: '0.1em',
                marginBottom: '1.2rem',
              }}>{f.tag}</span>

              <div style={{ fontSize: '2.2rem', marginBottom: '1rem', lineHeight: 1 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0d0d0d', marginBottom: '0.55rem' }}>{f.title}</h3>
              <p style={{ color: '#555', fontSize: '0.91rem', lineHeight: 1.72 }}>{f.desc}</p>

              <div style={{
                marginTop: '1.5rem', paddingTop: '1.1rem',
                borderTop: '1px solid rgba(13,13,13,0.07)',
                color: f.color, fontSize: '0.82rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                Earn now →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, #f9f6ff 0%, #fffbeb 100%)',
        borderTop: '1px solid rgba(13,13,13,0.06)',
        borderBottom: '1px solid rgba(13,13,13,0.06)',
        padding: '7rem 1.5rem',
      }} id="how-it-works">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed',
              letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '0.75rem',
            }}>Simple Process</p>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
              letterSpacing: '-0.03em', color: '#0d0d0d',
            }}>
              Up and earning in{' '}
              <span style={{ color: '#d4a017' }}>4 steps</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '2.5rem' }}>
            {steps.map((s, i) => (
              <div key={i} className="step-card" style={{ cursor: 'default' }}>
                {/* Number */}
                <div className="step-num" style={{
                  fontSize: '3.2rem', fontWeight: 800,
                  color: 'rgba(13,13,13,0.1)', lineHeight: 1,
                  marginBottom: '1rem', transition: 'color 0.3s',
                }}>{s.num}</div>
                {/* Divider */}
                <div style={{ width: 32, height: 3, background: 'linear-gradient(90deg, #7c3aed, #d4a017)', borderRadius: 2, marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0d0d0d', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.68 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS PREVIEW ─────────────────────────────────────────────────── */}
      <section id="earnings" style={{ maxWidth: '960px', margin: '7rem auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0533 60%, #3b0d80 100%)',
          borderRadius: '2rem', padding: '3.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '2.5rem',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative rings */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '300px', height: '300px', borderRadius: '50%',
            border: '1.5px solid rgba(212,160,23,0.1)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '-45px', right: '-45px',
            width: '210px', height: '210px', borderRadius: '50%',
            border: '1.5px solid rgba(212,160,23,0.07)', pointerEvents: 'none',
          }} />
          {/* Gold accent bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #7c3aed, #d4a017, #0d0d0d)',
          }} />

          <div style={{ flex: '1 1 260px' }}>
            <p style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#d4a017',
              letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '1rem',
            }}>Sample Earnings</p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '1rem',
            }}>
              Earn up to<br />
              <span style={{ color: '#d4a017' }}>₦50,000/month</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem', lineHeight: 1.72 }}>
              Active users combining tasks, games, surveys and referrals consistently hit this milestone.
            </p>
          </div>

          <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {earningsRows.map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem',
                padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.87rem',
                  display: 'flex', gap: '0.5rem', alignItems: 'center',
                }}>
                  <span>{row.icon}</span>{row.label}
                </span>
                <span style={{ color: '#d4a017', fontWeight: 800, fontSize: '0.9rem' }}>{row.amount}</span>
              </div>
            ))}
            {/* Total row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(212,160,23,0.12)', borderRadius: '0.75rem',
              padding: '0.75rem 1rem', border: '1px solid rgba(212,160,23,0.25)',
            }}>
              <span style={{ color: '#d4a017', fontSize: '0.87rem', fontWeight: 700 }}>
                💰 Monthly Total
              </span>
              <span style={{ color: '#d4a017', fontWeight: 800, fontSize: '1rem' }}>₦50,000+</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem 8rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '640px', margin: '0 auto',
          background: 'linear-gradient(160deg, rgba(124,58,237,0.05) 0%, rgba(13,13,13,0.04) 50%, rgba(212,160,23,0.05) 100%)',
          border: '1.5px solid rgba(13,13,13,0.1)',
          borderRadius: '2rem', padding: '4.5rem 2.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #7c3aed, #d4a017, #0d0d0d)',
          }} />

          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💰</div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
            color: '#0d0d0d', letterSpacing: '-0.03em', marginBottom: '1rem',
          }}>
            Your earnings are<br />
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #d4a017)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>waiting for you</span>
          </h2>
          <p style={{ color: '#555', marginBottom: '2.4rem', fontSize: '1rem', lineHeight: 1.75 }}>
            Free to join. No card needed. Start completing tasks and see money hit your wallet today.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="pf-btn-primary"
            style={{ padding: '1.15rem 3rem', fontSize: '1.05rem', width: '100%', maxWidth: '340px' }}
          >
            Create Free Account 🪙
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
            No credit card · Instant setup · Withdraw anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{
        background: '#0d0d0d',
        padding: '2.5rem 2.5rem',
        display: 'flex', flexWrap: 'wrap', gap: '1rem',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #d4a017)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 800, color: '#fff',
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
            Pay<span style={{ color: '#7c3aed' }}>Foxe</span>
          </span>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} PayFoxe. All rights reserved.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { label: 'Privacy', path: '/privacy' },
            { label: 'Terms', path: '/terms' },
            { label: 'Support', path: '/support' },
          ].map(({ label, path }) => (
            <span
              key={label}
              className="footer-link"
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
              onClick={() => navigate(path)}
            >
              {label}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}
