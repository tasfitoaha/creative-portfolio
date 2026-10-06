import { useState } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { BRAND } from '@/data/portfolio';
import { supabase } from '@/lib/supabase';
import {
  Send,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Facebook,
  Github,
  ExternalLink,
} from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function MessagePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (error) throw error;

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <div className="px-6 pb-20 pt-32">
      <section className="mx-auto max-w-3xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Message Box
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/50">
            Send a message directly — I'll get back to you through the most appropriate
            channel.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_280px]">
          {/* Form */}
          <GlassPanel className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-cyan-400/40 focus:bg-white/[0.07] disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-cyan-400/40 focus:bg-white/[0.07] disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                  rows={5}
                  placeholder="Your message…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-cyan-400/40 focus:bg-white/[0.07] disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-6 py-3.5 font-medium text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-sm text-green-200">
                    Message sent successfully. I'll get back to you soon.
                  </span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <span className="text-sm text-red-200">{errorMsg}</span>
                </div>
              )}
            </form>
          </GlassPanel>

          {/* Contact channels */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Direct Channels
            </h2>

            <GlassPanel className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Primary Email
                </span>
              </div>
              <a
                href={`mailto:${BRAND.contacts.primary}`}
                className="break-all text-sm text-white/80 transition-colors hover:text-cyan-300"
              >
                {BRAND.contacts.primary}
              </a>
            </GlassPanel>

            <GlassPanel className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Secondary
                </span>
              </div>
              <a
                href={`mailto:${BRAND.contacts.secondary}`}
                className="break-all text-sm text-white/80 transition-colors hover:text-cyan-300"
              >
                {BRAND.contacts.secondary}
              </a>
            </GlassPanel>

            <GlassPanel className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Mobile
                </span>
              </div>
              <a
                href={`tel:${BRAND.contacts.mobile}`}
                className="text-sm text-white/80 transition-colors hover:text-cyan-300"
              >
                {BRAND.contacts.mobile}
              </a>
            </GlassPanel>

            {/* Media links */}
            <h2 className="pt-2 text-sm font-semibold uppercase tracking-wider text-white/40">
              Media
            </h2>

            <a
              href={BRAND.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-500/[0.08] hover:shadow-[0_0_20px_rgba(0,153,255,0.12)]"
            >
              <Facebook className="h-5 w-5 text-cyan-400 transition-transform group-hover:scale-110" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80">Facebook</p>
                <p className="text-xs text-white/40 transition-colors group-hover:text-cyan-300/60">
                  /haniw.mejelin
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-cyan-400/60" />
            </a>

            <a
              href={BRAND.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-500/[0.08] hover:shadow-[0_0_20px_rgba(0,153,255,0.12)]"
            >
              <Github className="h-5 w-5 text-cyan-400 transition-transform group-hover:scale-110" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80">GitHub</p>
                <p className="text-xs text-white/40 transition-colors group-hover:text-cyan-300/60">
                  /tasfitoaha
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-cyan-400/60" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
