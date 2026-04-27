import { useNavigate } from 'react-router-dom'
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Clock } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  { q: 'How do I withdraw my coins?', a: 'Go to the Wallet page, click "Request Withdrawal", enter your bank details and the amount (minimum 500 coins). Withdrawals are processed within 1–5 business days.' },
  { q: 'Why was my task completion not credited?', a: 'Task credits may take up to 30 minutes to reflect. If it has been longer, contact support with the task name and approximate completion time.' },
  { q: 'My referral did not get credited', a: 'Referral bonuses are paid when your referred user completes their first task. Make sure they used your referral link during registration.' },
  { q: 'My account has been suspended', a: 'Account suspensions happen when our system detects policy violations. Contact support at banned@payfoxe.com with your username for a review.' },
  { q: 'How long does withdrawal take?', a: 'Most withdrawals are processed within 24 hours on business days. Complex cases may take up to 5 business days.' },
  { q: 'Can I have multiple accounts?', a: 'No. Multiple accounts are strictly prohibited and will result in permanent banning of all associated accounts and forfeiture of earnings.' },
  { q: 'How do I increase my earning rate?', a: 'Level up by completing tasks and earning XP. Higher levels give you an XP multiplier (up to 2×) that boosts your coin rewards on every task.' },
  { q: 'Is PayFoxe available outside Nigeria?', a: 'Currently PayFoxe supports Nigerian bank accounts. International withdrawals are on our roadmap.' },
]

export default function SupportPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff', minHeight: '100vh', color: '#0d0d0d' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '5rem 1.5rem 4rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '3rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #0d0d0d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={24} color="#d4a017" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Support Center</h1>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>We're here to help</p>
          </div>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {[
            { icon: <Mail size={22} color="#7c3aed" />, title: 'Email Support', sub: 'support@payfoxe.com', note: 'Reply within 24 hrs' },
            { icon: <MessageCircle size={22} color="#22c55e" />, title: 'Live Chat', sub: 'Available in-app', note: '9am–6pm WAT, Mon–Fri' },
            { icon: <Clock size={22} color="#d4a017" />, title: 'Response Time', sub: 'Under 24 hours', note: 'For most enquiries' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '1.25rem', border: '1.5px solid rgba(13,13,13,0.08)', borderRadius: '1rem', boxShadow: '0 4px 16px rgba(13,13,13,0.05)' }}>
              <div style={{ marginBottom: '0.6rem' }}>{c.icon}</div>
              <p style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{c.title}</p>
              <p style={{ fontSize: '0.82rem', color: '#555' }}>{c.sub}</p>
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>{c.note}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              border: '1.5px solid rgba(13,13,13,0.08)',
              borderRadius: '0.9rem',
              marginBottom: '0.75rem',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
              {faq.q}
              <span style={{ color: '#7c3aed', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>{open === i ? '−' : '+'}</span>
            </div>
            {open === i && (
              <div style={{ padding: '0 1.25rem 1rem', color: '#555', fontSize: '0.9rem', lineHeight: 1.75 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
