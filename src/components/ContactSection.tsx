'use client';

import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import DisplayLines from './DisplayLines';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus('idle');
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-canvas section-spacing">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="eyebrow mb-6">{t('home.contact.eyebrow')}</p>
            <DisplayLines
              as="h2"
              lines={[t('home.contact.titleLine1'), t('home.contact.titleLine2')]}
              className="display-lg text-ink mb-8"
            />
            <p className="body-lg text-muted mb-12 max-w-xl">
              {t('home.contact.lead')}
            </p>

            <div className="feature-stack max-w-md">
              <div className="feature-stack-item">
                <h4 className="headline text-ink mb-1">{t('home.contact.office')}</h4>
                <p className="body-default text-muted">{t('home.contact.officeValue')}</p>
              </div>
              <div className="feature-stack-item">
                <h4 className="headline text-ink mb-1">{t('home.contact.email')}</h4>
                <p className="body-default text-muted">contact@goodmangls.com</p>
              </div>
              <div className="feature-stack-item">
                <h4 className="headline text-ink mb-1">{t('home.contact.hours')}</h4>
                <p className="body-default text-muted">{t('home.contact.hoursValue')}</p>
              </div>
            </div>
          </div>

          <div className="panel-bordered p-8 md:p-10 bg-surface-soft">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="body-sm font-bold mb-2 block text-ink">
                  {t('home.contact.nameLabel')}
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-canvas border border-hairline rounded-[var(--radius-feature)] focus:border-obsidian outline-none transition-colors"
                  placeholder={t('home.contact.namePlaceholder')}
                />
                {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="body-sm font-bold mb-2 block text-ink">
                  {t('home.contact.emailLabel')}
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-canvas border border-hairline rounded-[var(--radius-feature)] focus:border-obsidian outline-none transition-colors"
                  placeholder={t('home.contact.emailPlaceholder')}
                />
                {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="body-sm font-bold mb-2 block text-ink">
                  {t('home.contact.messageLabel')}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-canvas border border-hairline rounded-[var(--radius-feature)] focus:border-obsidian outline-none transition-colors resize-none"
                  placeholder={t('home.contact.messagePlaceholder')}
                />
                {errors.message && <p className="mt-2 text-xs text-red-600">{errors.message}</p>}
              </div>

              <div className="pt-2">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-canvas border border-hairline rounded-[var(--radius-feature)] text-sm text-ink">
                    {t('home.contact.success')}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-canvas border border-hairline rounded-[var(--radius-feature)] text-sm text-red-600">
                    {t('home.contact.error')}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill-primary w-full justify-center"
                >
                  {isSubmitting ? t('home.contact.sending') : t('home.contact.send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
