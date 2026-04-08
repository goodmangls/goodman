'use client';

import { useTranslations } from '@/contexts/LanguageContext';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message;
        }
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
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex items-center section-md bg-[#070612] relative z-10 py-32">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-32 max-w-6xl mx-auto"
        >
          <h2 className="display-serif text-white text-5xl md:text-6xl lg:text-7xl mb-6 md:mb-8 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-white/50 font-light mt-4">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Contact Info */}
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="glass-panel p-10 md:p-12 rounded-[2.5rem] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-3xl font-serif text-white mb-10">
                  {t('getInTouch')}
                </h3>
                <div className="space-y-10">
                  <div className="group">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FF6B35]">
                          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-white/40 uppercase tracking-widest text-sm font-bold">{t('office')}</span>
                     </div>
                     <p className="text-xl text-white/80 pl-14 font-light leading-relaxed">{t('officeAddress')}</p>
                  </div>

                  <div className="group">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FF6B35]">
                          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-white/40 uppercase tracking-widest text-sm font-bold">{t('email')}</span>
                     </div>
                     <p className="text-xl text-white/80 pl-14 font-light">{t('emailAddress')}</p>
                  </div>

                  <div className="group">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FF6B35]">
                          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-white/40 uppercase tracking-widest text-sm font-bold">{t('officeHours')}</span>
                     </div>
                     <p className="text-xl text-white/80 pl-14 font-light">{t('hours')}</p>
                     
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pl-14">
                 <div className="inline-block px-4 py-2 bg-[#FF6B35]/10 rounded-lg border border-[#FF6B35]/20 text-[#FF6B35] text-sm">
                    ⚠️ {t('emergency')}
                 </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8 p-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-white/40 uppercase tracking-widest ml-1">{t('namePlaceholder')}</label>
                  <input
                    type="text"
                    id="contact-name" name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-6 py-5 bg-white/3 border-b ${errors.name ? 'border-red-500' : 'border-white/10'} text-white placeholder-transparent focus-visible:outline-none focus:border-[#FF6B35] focus:bg-white/5 transition-all text-lg`}
                    placeholder={t('namePlaceholder')}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-400 pl-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-white/40 uppercase tracking-widest ml-1">{t('emailPlaceholder')}</label>
                  <input
                    type="email"
                    id="contact-email" name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-6 py-5 bg-white/3 border-b ${errors.email ? 'border-red-500' : 'border-white/10'} text-white placeholder-transparent focus-visible:outline-none focus:border-[#FF6B35] focus:bg-white/5 transition-all text-lg`}
                    placeholder={t('emailPlaceholder')}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-400 pl-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                   <label htmlFor="contact-message" className="text-sm font-medium text-white/40 uppercase tracking-widest ml-1">{t('messagePlaceholder')}</label>
                  <textarea
                    id="contact-message" name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-6 py-5 bg-white/3 border-b ${errors.message ? 'border-red-500' : 'border-white/10'} text-white placeholder-transparent focus-visible:outline-none focus:border-[#FF6B35] focus:bg-white/5 transition-all text-lg resize-none`}
                    placeholder={t('messagePlaceholder')}
                  />
                  {errors.message && <p className="mt-2 text-sm text-red-400 pl-1">{errors.message}</p>}
                </div>
                
                <div className="pt-4">
                    {submitStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('successMessage')}
                        </div>
                    )}
                    
                    {submitStatus === 'error' && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {t('errorMessage')}
                        </div>
                    )}

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-5 text-lg font-bold uppercase tracking-wider shadow-xl shadow-[#FF6B35]/10 hover:shadow-[#FF6B35]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:outline-none"
                    >
                    <span className="flex items-center justify-center gap-3">
                        {isSubmitting ? t('sending') : t('sendMessage')}
                        {!isSubmitting && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        )}
                    </span>
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
