import { Loader2, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import sketchBackground from '@/assets/back.svg';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/hooks/useAuth';

// Colours removed: four glowing accent words on a dark panel was the most
// template-looking element on the page. The typewriter motion stays — it's
// user-facing content, not decoration.
const HIGHLIGHTS = [
  { label: 'Monitor' },
  { label: 'Diagnose' },
  { label: 'Solve' },
  { label: 'Boost' },
];

const TYPE_CHAR_MS = 70;
const DELETE_CHAR_MS = 40;
const TYPE_HOLD_MS = 650;
const DELETE_HOLD_MS = 250;
const BOOST_MS = 1200;

function TypewriterHighlights() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');

  const item = HIGHLIGHTS[wordIndex];
  const isLastWord = wordIndex === HIGHLIGHTS.length - 1;

  useEffect(() => {
    if (phase === 'typing') {
      if (charCount < item.label.length) {
        const timer = setTimeout(() => setCharCount((count) => count + 1), TYPE_CHAR_MS);
        return () => clearTimeout(timer);
      }
      setPhase('holding');
      return;
    }

    if (phase === 'holding') {
      const timer = setTimeout(() => setPhase('deleting'), isLastWord ? BOOST_MS : TYPE_HOLD_MS);
      return () => clearTimeout(timer);
    }

    if (charCount > 0) {
      const timer = setTimeout(() => setCharCount((count) => count - 1), DELETE_CHAR_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setWordIndex((index) => (index + 1) % HIGHLIGHTS.length);
      setPhase('typing');
    }, DELETE_HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase, charCount, item.label.length, isLastWord]);

  const isBoosting = isLastWord && phase === 'holding';
  const text = item.label.slice(0, charCount);

  return (
    <div className="flex h-9 items-center">
      {/* The scale-110 pop and coloured glow are gone. Emphasis on the held
          word now comes from opacity alone, which reads as deliberate rather
          than as a effect. */}
      <span
        className={`inline-flex items-baseline text-2xl font-semibold tracking-tight text-ink-panel-foreground transition-opacity duration-300 ${isBoosting ? 'opacity-100' : 'opacity-80'
          }`}
      >
        {text}
        <span className="ml-1 inline-block h-5.5 w-0.5 animate-caret-blink bg-ink-panel-foreground" />
      </span>
    </div>
  );
}

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/projects');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden flex-[1.05] flex-col justify-center overflow-hidden bg-ink-panel px-16 py-16 text-ink-panel-foreground lg:flex">
        {/* Hand-drawn SEO sketch, inverted so the ink reads light on dark */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 invert mix-blend-screen"
          style={{ backgroundImage: `url(${sketchBackground})` }}
        />
        {/* Bottom scrim only — typographic necessity over the sketch, not decoration */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to top, var(--ink-panel) 0%, transparent 55%)',
          }}
        />

        <div className="relative max-w-[520px]">
          <h1 className="mb-5 text-5xl leading-[1.03] font-semibold tracking-tight">
            When Ads Say No,{' '}
            <span className="text-ink-panel-foreground">SEO Says Go.</span>
          </h1>
          <p className="max-w-[440px] text-lg leading-relaxed text-ink-panel-foreground/65">
            Built for businesses that can&apos;t rely on paid ads — Ranky AI reads your Search
            Console data and shows you{' '}
            <b className="font-semibold text-ink-panel-foreground">exactly what to fix to rank higher.</b>
          </p>
          <div className="mt-10 flex items-center gap-3">
            <p className="text-sm font-semibold tracking-[0.08em] text-ink-panel-foreground/50 uppercase">
              Ranky AI helps you
            </p>
            <TypewriterHighlights />
          </div>
        </div>

        {/* <div className="relative pt-12">
          <div className="mb-5 h-px w-16 bg-ink-panel-foreground/15" />
          <p className="max-w-[420px] text-sm leading-relaxed text-ink-panel-foreground/45">
            Not just another SEO tool — an AI agent that turns data into growth decisions.
          </p>
        </div> */}
      </aside>

      {/* bg-muted, not bg-background: in dark mode --background is the same
          #0B1120 as the ink panel, which would erase the split. */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted p-6 sm:p-12">

        <div className="relative w-full max-w-[400px]">
          <Logo iconSize={44} textClassName="text-xl text-center text-foreground " className="mb-8" />

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="p-8">
              <h2 className="mb-2 text-2xl font-semibold tracking-tight">Sign in to your workspace</h2>
              <p className="mb-7 text-md leading-relaxed text-muted-foreground">
                Use the email and password your admin gave you to access your projects.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3.5 text-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3.5 text-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-md font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
