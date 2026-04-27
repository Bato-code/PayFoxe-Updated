import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
  const navigate = useNavigate()
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff', minHeight: '100vh', color: '#0d0d0d' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '5rem 1.5rem 4rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #0d0d0d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#d4a017" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Privacy Policy</h1>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {[
          { title: '1. Information We Collect', body: 'We collect information you provide directly to us when you create an account, including your name, email address, and payment details. We also collect usage data such as tasks completed, pages visited, and device information to improve our services.' },
          { title: '2. How We Use Your Information', body: 'We use your information to operate and improve PayFoxe, process withdrawals to your bank account, send transactional emails (such as payment confirmations), personalise your experience, and detect and prevent fraud.' },
          { title: '3. Data Sharing', body: 'We do not sell your personal data to third parties. We may share data with payment processors (e.g., Flutterwave, Paystack) to facilitate withdrawals, and with offer-wall providers (Timewall, CPALead) to credit task completions. All partners are contractually required to protect your data.' },
          { title: '4. Data Retention', body: 'We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting support@payfoxe.com. Some data may be retained for legal or financial compliance purposes for up to 7 years.' },
          { title: '5. Cookies', body: 'PayFoxe uses cookies solely for authentication (keeping you logged in) and analytics. We do not use advertising cookies. You can disable cookies in your browser settings, but this may affect site functionality.' },
          { title: '6. Security', body: 'All data is encrypted in transit using TLS. Passwords are hashed and never stored in plain text. We use Supabase Row Level Security to ensure users can only access their own data.' },
          { title: '7. Your Rights', body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@payfoxe.com. We will respond within 30 days.' },
          { title: '8. Contact', body: 'For privacy-related enquiries, reach us at privacy@payfoxe.com or via our Support page.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(13,13,13,0.07)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.6rem' }}>{s.title}</h2>
            <p style={{ color: '#444', lineHeight: 1.8, fontSize: '0.95rem' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
