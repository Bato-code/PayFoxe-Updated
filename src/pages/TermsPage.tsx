import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsPage() {
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
            <FileText size={24} color="#d4a017" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Terms of Service</h1>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Effective date: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {[
          { title: '1. Acceptance of Terms', body: 'By creating a PayFoxe account, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use PayFoxe. We reserve the right to update these terms at any time; continued use of the platform constitutes acceptance.' },
          { title: '2. Eligibility', body: 'You must be at least 18 years old and a resident of a supported country (currently Nigeria) to use PayFoxe. By registering, you confirm that the information you provide is accurate and that you are legally permitted to earn and withdraw funds.' },
          { title: '3. Earning Coins', body: 'Coins are earned by completing tasks, surveys, watching videos, and referring new users. Coins have no cash value until redeemed. Minimum redemption is 500 coins. PayFoxe reserves the right to void coins earned through fraudulent means, including bot activity, VPNs, or manipulation of offer walls.' },
          { title: '4. Withdrawals', body: 'Withdrawal requests are reviewed and processed within 1–5 business days. Coins are deducted from your balance upon submission of a withdrawal request. PayFoxe is not liable for delays caused by third-party banking systems. Minimum withdrawal is 500 coins (₦50 equivalent).' },
          { title: '5. Referral Programme', body: 'Referral bonuses are credited when a referred user completes their first task. Self-referrals and referral rings are strictly prohibited and will result in permanent account termination and forfeiture of all earnings.' },
          { title: '6. Prohibited Conduct', body: 'You may not use automated scripts, bots, or proxies; create multiple accounts; submit false task completions; harass other users or staff; or attempt to reverse-engineer or exploit the platform. Violations will result in immediate account suspension without payout.' },
          { title: '7. Limitation of Liability', body: 'PayFoxe is provided "as is". We do not guarantee any minimum level of earnings. In no event shall PayFoxe be liable for indirect, incidental, or consequential damages arising from your use of the platform.' },
          { title: '8. Governing Law', body: 'These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved by the courts of Rivers State, Nigeria.' },
          { title: '9. Contact', body: 'For legal enquiries: legal@payfoxe.com' },
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
