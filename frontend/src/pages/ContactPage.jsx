import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '60px 0' }}>
      <div className="melangee-container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            We're Here to Help
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>Get in Touch with MELANGEE</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Have questions about our curriculums, enterprise partnerships, or instructor opportunities? Reach out anytime.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Contact Details Card */}
          <div>
            <div className="melangee-card" style={{ padding: '36px', height: '100%' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Contact Information</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '36px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Email Us</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@melangee.com</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>partnerships@melangee.com</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} color="var(--secondary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Call Toll-Free</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+1 (800) 456-7890</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Mon - Fri from 8am to 6pm PST</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} color="#8B5CF6" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Global Headquarters</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>555 Mission Street, Suite 2400</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>San Francisco, CA 94105, USA</div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div style={{ padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#166534' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <span>Support team is currently online. Average response time: &lt; 2 hours.</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div>
            <div className="melangee-card" style={{ padding: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Send Us a Message</h2>

              {submitted && (
                <Alert
                  type="success"
                  title="Message Received!"
                  message="Thank you for reaching out. A MELANGEE advisor will respond to your email within 24 hours."
                  onClose={() => setSubmitted(false)}
                />
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control-melangee"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Work or Personal Email *</label>
                  <input
                    type="email"
                    required
                    className="form-control-melangee"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    required
                    className="form-control-melangee"
                    placeholder="e.g. Course curriculum inquiry or instructor onboarding"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    className="form-control-melangee"
                    placeholder="Tell us how we can assist you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Send}
                  style={{ marginTop: '8px' }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

