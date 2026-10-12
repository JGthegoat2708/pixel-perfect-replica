import { AnimatePresence, animate, motion, useInView, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiArrowUpRight, FiDownload, FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiSend, FiTwitter, FiInstagram, FiAward } from "react-icons/fi";
import { SiMedium } from "react-icons/si";
import { achievements, certifications, education, experience, profile, projects, skills, stats, timeline, type Skill } from "@/lib/portfolio";
import { scrollToId } from "@/lib/scroll";
import { GlowButton, SectionHeading, TiltCard, reveal } from "./interactive";

const spring = { type: "spring", stiffness: 70, damping: 18 } as const;

/* ------------------------------ HERO ------------------------------ */
export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % profile.titles.length), 2400);
    return () => clearInterval(id);
  }, []);
  const letters = (w: string, d: number) =>
    w.split("").map((c, k) => (
      <motion.span key={k} className="inline-block" initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: d + k * 0.04 }}>
        {c}
      </motion.span>
    ));

  return (
    <section id="hero" className="zone-light relative flex min-h-[100svh] items-center px-6 pt-28 md:px-14">
      <div className="mx-auto w-full max-w-7xl">
        <motion.p className="font-mono text-xs uppercase tracking-[0.4em] text-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}>
          ◉ System online — {profile.location}
        </motion.p>
        <h1 className="mt-6 font-display text-[clamp(3.2rem,11vw,9.5rem)] font-extrabold leading-[0.88] tracking-tighter">
          <span className="block overflow-hidden">{letters(profile.firstName, 2.9)}</span>
          <span className="block overflow-hidden text-gradient">{letters(profile.lastName, 3.15)}</span>
        </h1>
        <div className="mt-8 flex h-10 items-center gap-3 overflow-hidden font-display text-xl md:text-3xl">
          <span className="text-zone-muted">I am a</span>
          <AnimatePresence mode="wait">
            <motion.span key={i} className="font-semibold text-primary" initial={{ y: 30, opacity: 0, filter: "blur(6px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -30, opacity: 0, filter: "blur(6px)" }} transition={spring}>
              {profile.titles[i]}
            </motion.span>
          </AnimatePresence>
        </div>
        <motion.div className="mt-12 flex flex-wrap gap-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 3.5 }}>
          <GlowButton onClick={() => scrollToId("projects")}>View Projects <FiArrowUpRight /></GlowButton>
          <GlowButton variant="ghost" href={profile.resume} external>Download Resume <FiDownload /></GlowButton>
          <GlowButton variant="ghost" onClick={() => scrollToId("contact")}>Contact Me <FiMail /></GlowButton>
        </motion.div>
      </div>
      <motion.button onClick={() => scrollToId("about")} aria-label="Scroll to about" className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-zone-muted" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
        Scroll to explore ↓
      </motion.button>
    </section>
  );
}

/* ------------------------------ ABOUT ------------------------------ */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function About() {
  const [tab, setTab] = useState<"story" | "education" | "achievements">("story");
  return (
    <section id="about" className="zone-light relative px-6 py-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="01 — Identity" title="Behind the core" />
        <div className="grid gap-6 lg:grid-cols-5">
          <TiltCard className="glass rounded-3xl p-8 lg:col-span-3" max={5}>
            <div className="flex gap-2" role="tablist">
              {(["story", "education", "achievements"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative rounded-full px-4 py-1.5 text-xs font-semibold capitalize">
                  {tab === t && <motion.span layoutId="about-tab" className="absolute inset-0 rounded-full bg-primary/15" />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={spring} className="mt-8 min-h-44 text-lg leading-relaxed text-zone-muted">
                {tab === "story" && <p>{profile.about}</p>}
                {tab === "education" && (
                  <dl className="grid grid-cols-2 gap-6">
                    {Object.entries(education).map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-xs uppercase tracking-widest text-primary">{k}</dt>
                        <dd className="mt-1 font-display text-xl text-zone">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {tab === "achievements" && (
                  <ul className="space-y-3">
                    {achievements.map((a) => (
                      <li key={a} className="flex items-center gap-3 text-zone"><FiAward className="text-primary" /> {a}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </TiltCard>
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {stats.map((s, k) => (
              <motion.div key={s.label} {...reveal} transition={{ ...spring, delay: k * 0.08 }} className="glass rounded-3xl p-6" data-cursor="card">
                <p className="font-display text-4xl font-bold text-gradient md:text-5xl"><Counter to={s.value} suffix={s.suffix} /></p>
                <p className="mt-2 text-sm text-zone-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <ol className="mt-16 grid gap-6 md:grid-cols-4">
          {timeline.map((t, k) => (
            <motion.li key={t.year} {...reveal} transition={{ ...spring, delay: k * 0.1 }} className="glass relative rounded-2xl p-6">
              <span className="font-mono text-xs text-primary">{t.year}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-zone-muted">{t.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ SKILLS ------------------------------ */
function SkillPlanet({ s, k }: { s: Skill; k: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="relative flex flex-col items-center"
      {...reveal}
      transition={{ ...spring, delay: k * 0.08 }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
    >
      <motion.button
        aria-expanded={open}
        aria-label={`${s.name} skills`}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="relative flex items-center justify-center rounded-full"
        style={{ width: s.size, height: s.size }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5 + k * 0.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.12 }}
      >
        <span className="planet-surface absolute inset-0 rounded-full" style={{ ["--planet" as string]: s.planet }} />
        <motion.span className="absolute -inset-5" animate={{ rotate: 360 }} transition={{ duration: 8 + k, repeat: Infinity, ease: "linear" }}>
          <span className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-starlight shadow-glow" />
          <span className="absolute bottom-3 right-2 h-1 w-1 rounded-full bg-primary-glow" />
        </motion.span>
        <span className="absolute -inset-5 rounded-full border border-glass-border" />
      </motion.button>
      <p className="mt-8 font-display text-lg font-semibold">{s.name}</p>
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass absolute top-full z-20 mt-2 w-64 rounded-2xl p-5 text-left"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <p className="text-sm">{s.description}</p>
            <div className="mt-3 flex justify-between font-mono text-[11px] text-zone-muted">
              <span>⏱ {s.experience}</span>
              <span>◆ {s.projects}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.stack.map((t) => (
                <span key={t} className="rounded-full border border-glass-border px-2 py-0.5 text-[11px]">{t}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="zone-dark relative px-6 py-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="02 — Systems" title="A solar system of skills" />
        <p className="-mt-8 mb-16 max-w-xl text-zone-muted">Hover or tap a planet to scan it.</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-20 md:grid-cols-3">
          {skills.map((s, k) => (
            <SkillPlanet key={s.name} s={s} k={k} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PROJECTS ------------------------------ */
export function Projects() {
  return (
    <section id="projects" className="zone-dark relative px-6 py-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="03 — Missions" title="Selected projects" />
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, k) => {
            const featured = k === 0;
            return (
              <motion.article key={p.name} {...reveal} transition={{ ...spring, delay: k * 0.1 }} className={featured ? "md:col-span-2" : ""}>
                <TiltCard className="glass group h-full overflow-hidden rounded-3xl" max={featured ? 5 : 8}>
                  <div className={featured ? "grid md:grid-cols-5" : ""}>
                    <div className={`relative overflow-hidden ${featured ? "aspect-[16/10] md:col-span-3 md:aspect-auto" : "aspect-[16/10]"}`}>
                      <motion.img src={p.image} alt={`${p.name} preview`} loading="lazy" width={1280} height={800} className="h-full w-full object-cover" whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 80, damping: 20 }} />
                      {featured && <span className="absolute left-4 top-4 rounded-full bg-gradient-primary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">Featured mission</span>}
                    </div>
                    <div className={`flex flex-col p-7 ${featured ? "md:col-span-2 md:p-10" : ""}`}>
                      <span className="font-mono text-xs text-primary-glow">0{k + 1}</span>
                      <h3 className={`mt-2 font-display font-bold ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>{p.name}</h3>
                      <p className="mt-3 text-zone-muted">{p.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.stack.map((t) => (
                          <span key={t} className="rounded-full border border-glass-border px-3 py-1 text-xs">{t}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex gap-5 pt-8 text-sm font-semibold">
                        <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary-glow"><FiGithub /> GitHub</a>
                        <a href={p.live} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary-glow"><FiArrowUpRight /> Live demo</a>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ EXPERIENCE ------------------------------ */
export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  return (
    <section id="experience" className="zone-dark relative px-6 py-32 md:px-14">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="04 — Flight log" title="Experience" />
        <div ref={ref} className="relative pl-10 md:pl-0">
          <div className="absolute left-3 top-0 h-full w-px bg-glass-border md:left-1/2" />
          <motion.div className="absolute left-3 top-0 h-full w-px origin-top bg-gradient-primary md:left-1/2" style={{ scaleY }} />
          {experience.map((e, k) => (
            <motion.div
              key={e.role + k}
              initial={{ opacity: 0, x: k % 2 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={spring}
              className={`relative mb-12 md:w-1/2 ${k % 2 ? "md:ml-auto md:pl-12" : "md:pr-12"}`}
            >
              <span className={`absolute top-6 h-3 w-3 rounded-full bg-primary-glow shadow-glow -left-[33px] ${k % 2 ? "md:-left-1.5" : "md:left-auto md:-right-1.5"}`} />
              <TiltCard className="glass rounded-2xl p-6" max={6}>
                <p className="font-mono text-xs text-primary-glow">{e.duration}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{e.role}</h3>
                <p className="text-sm text-zone-muted">{e.company}</p>
                <p className="mt-3 text-sm text-zone-muted">{e.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CERTIFICATIONS ------------------------------ */
export function Certifications() {
  return (
    <section id="certifications" className="zone-dark relative px-6 py-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="05 — Clearances" title="Certifications" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c, k) => (
            <motion.div key={c.name} {...reveal} transition={{ ...spring, delay: k * 0.08 }}>
              <TiltCard className="glass h-full rounded-3xl p-7">
                <motion.div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground" whileHover={{ rotate: 180 }} transition={{ type: "spring", stiffness: 120 }}>
                  <FiAward size={22} />
                </motion.div>
                <h3 className="mt-6 font-display text-lg font-semibold leading-snug">{c.name}</h3>
                <p className="mt-2 text-sm text-zone-muted">{c.issuer}</p>
                <p className="mt-4 font-mono text-xs text-primary-glow">{c.year}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CONTACT ------------------------------ */
export function Contact() {
  const [launched, setLaunched] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLaunched(true);
    setTimeout(() => {
      const subject = encodeURIComponent(`Transmission from ${f.get("name")}`);
      const body = encodeURIComponent(`${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    }, 900);
    setTimeout(() => setLaunched(false), 3200);
  };
  const field = "w-full rounded-2xl border border-glass-border bg-glass px-5 py-4 text-zone placeholder:text-zone-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";
  return (
    <section id="contact" className="zone-dark relative px-6 py-32 md:px-14">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="06 — Mission control" title="Open a channel" />
          <p className="-mt-6 max-w-md text-zone-muted">Have a mission in mind? Send a transmission and I'll respond from orbit.</p>
          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3"><FiMail className="text-primary-glow" /> <a href={`mailto:${profile.email}`} className="hover:text-primary-glow">{profile.email}</a></li>
            <li className="flex items-center gap-3"><FiPhone className="text-primary-glow" /> {profile.phone}</li>
            <li className="flex items-center gap-3"><FiMapPin className="text-primary-glow" /> {profile.location}</li>
          </ul>
        </div>
        <motion.form {...reveal} transition={spring} onSubmit={submit} className="glass space-y-4 rounded-3xl p-7 md:p-10">
          <label className="block"><span className="sr-only">Name</span><input required name="name" placeholder="Your name" className={field} /></label>
          <label className="block"><span className="sr-only">Email</span><input required type="email" name="email" placeholder="Your email" className={field} /></label>
          <label className="block"><span className="sr-only">Message</span><textarea required name="message" rows={5} placeholder="Your message" className={field} /></label>
          <button type="submit" className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-primary py-4 font-semibold text-primary-foreground shadow-glow">
            <motion.span animate={launched ? { y: -140, x: 60, rotate: -45, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }} transition={launched ? { duration: 0.9, ease: [0.5, 0, 0.75, 0] } : { duration: 0 }}>
              <FiSend />
            </motion.span>
            {launched ? "Launching…" : "Launch transmission"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
const constellation = [
  [40, 60], [120, 30], [210, 70], [290, 40], [360, 90], [450, 55], [530, 100], [610, 50],
];
export function Footer() {
  const socials = [
    { href: profile.socials.github, icon: FiGithub, label: "GitHub" },
    { href: profile.socials.linkedin, icon: FiLinkedin, label: "LinkedIn" },
    { href: profile.socials.twitter, icon: FiTwitter, label: "Twitter" },
    { href: profile.socials.instagram, icon: FiInstagram, label: "Instagram" },
    { href: profile.socials.medium, icon: SiMedium, label: "Medium" },
  ];
  return (
    <footer className="zone-dark relative px-6 pb-12 pt-20 md:px-14">
      <div className="mx-auto max-w-7xl text-center">
        <svg viewBox="0 0 650 130" className="mx-auto w-full max-w-2xl" aria-hidden>
          <motion.polyline
            points={constellation.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="var(--primary-glow)"
            strokeOpacity={0.4}
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          {constellation.map(([x, y], k) => (
            <motion.circle key={k} cx={x} cy={y} r={3} fill="var(--starlight)" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2 + (k % 3), repeat: Infinity, delay: k * 0.2 }} />
          ))}
        </svg>
        <p className="mt-8 font-display text-2xl italic text-zone-muted">"{profile.quote}"</p>
        <div className="mt-10 flex justify-center gap-4">
          {socials.map(({ href, icon: Icon, label }) => (
            <motion.a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="glass flex h-12 w-12 items-center justify-center rounded-full" whileHover={{ rotate: 360, scale: 1.15 }} transition={{ type: "spring", stiffness: 160, damping: 12 }}>
              <Icon />
            </motion.a>
          ))}
        </div>
        <p className="mt-12 font-mono text-xs text-zone-muted">© {new Date().getFullYear()} {profile.name} — Transmitting from deep space.</p>
      </div>
    </footer>
  );
}
