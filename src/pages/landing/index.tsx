import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, GitBranch, Layers, MessageSquare, Shield, Zap } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { apiRequest } from "../../api/client";
import Logo from "../../assets/invisapprove-logo-light.png";

const SIGNUP_MODE = (import.meta.env["VITE_SIGNUP_MODE"] as string | undefined) ?? "waitlist";

const FEATURES = [
    {
        icon: MessageSquare,
        title: "Slack & Teams native",
        desc: "Request and approve without switching apps. Meet your team where they already work.",
    },
    {
        icon: Zap,
        title: "Auto-approve rules",
        desc: "Set thresholds by amount, category, or requester. Low-risk requests approved in seconds.",
    },
    {
        icon: GitBranch,
        title: "Smart routing",
        desc: "Assign to the right approver automatically. No more 'who do I ask about this?'",
    },
    {
        icon: Shield,
        title: "Audit trail",
        desc: "Every decision logged with actor, timestamp, and context. Compliance-ready from day one.",
    },
    {
        icon: Layers,
        title: "Multi-step flows",
        desc: "Sequential or parallel approvals. Escalate automatically when someone doesn't respond.",
    },
    {
        icon: Code2,
        title: "API-first",
        desc: "Trigger approvals from any system. Full REST API for custom integrations.",
    },
];

const STEPS = [
    {
        num: "01",
        title: "Request",
        desc: "Use /request-approval in Slack or the web dashboard. Fill in what you need approved.",
    },
    {
        num: "02",
        title: "Route",
        desc: "Rules evaluate context. Amount, category, team. Assign or auto-approve instantly.",
    },
    {
        num: "03",
        title: "Decide",
        desc: "One click to approve or reject, right from Slack. The requester is notified immediately.",
    },
];

function SlackMockup() {
    const [phase, setPhase] = useState<"pending" | "approved">("pending");
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const cycle = () => {
            setVisible(false);
            setTimeout(() => {
                setPhase((p) => (p === "pending" ? "approved" : "pending"));
                setVisible(true);
            }, 350);
        };
        const id = setInterval(cycle, 4200);
        return () => clearInterval(id);
    }, []);

    return (
        <div
            className="relative"
            style={{
                filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.8))",
            }}
        >
            {/* Glow behind card */}
            <div
                className="absolute inset-0 -z-10 rounded-[20px]"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(91,79,217,0.25) 0%, transparent 70%)",
                    transform: "scale(1.3)",
                }}
            />

            <div
                className="w-full max-w-[360px] rounded-[12px] border border-[#1E2A3F] bg-[#121828] p-4"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}
            >
                {/* Slack bar chrome */}
                <div className="mb-1 flex items-center gap-1 opacity-30">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#F43F5E]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                </div>

                {/* Bot header */}
                <div className="mt-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B4FD9] text-[10px] font-bold text-white">
                        IA
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-white">Invisapprove</span>
                        <span className="rounded bg-[#1E2A3F] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                            APP
                        </span>
                    </div>
                    <span className="ml-auto text-[11px] text-slate-600">just now</span>
                </div>

                {/* Card content with cross-fade */}
                <div
                    className="mt-3 transition-opacity duration-300"
                    style={{ opacity: visible ? 1 : 0 }}
                >
                    {phase === "pending" ? (
                        <div>
                            <p className="text-[13px] text-slate-400">
                                New approval request from{" "}
                                <span className="font-medium text-slate-200">@sarah.chen</span>
                            </p>

                            <div className="mt-2.5 rounded-r-md border-l-[3px] border-[#F59E0B] bg-[#0B0F1A] pl-3 pr-3 py-2.5">
                                <p className="text-[13px] font-semibold text-white">
                                    Purchase Order: AWS Credits
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Vendor Contract ·{" "}
                                    <span className="font-semibold text-[#F59E0B]">$5,000</span>
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500">Needs approval by EOD</p>
                            </div>

                            <div className="mt-3 flex gap-2">
                                <button className="flex-1 rounded-[4px] bg-[#5B4FD9] py-2 text-[12px] font-semibold text-white">
                                    Approve
                                </button>
                                <button className="flex-1 rounded-[4px] bg-[#1E2A3F] py-2 text-[12px] font-semibold text-slate-300">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10B981]/15 ring-1 ring-[#10B981]/30">
                                <span className="text-[15px] text-[#10B981]">✓</span>
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-[#10B981]">
                                    Purchase Order: AWS Credits
                                </p>
                                <p className="text-[13px] text-[#10B981]/80">has been approved.</p>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    Approved by{" "}
                                    <span className="text-slate-400">@mike.johnson</span> · just now
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CTASection() {
    const { signInWithSlack, signInWithMagicLink, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [magicEmail, setMagicEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [magicSent, setMagicSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        try {
            await apiRequest("/api/waitlist", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            setSubmitted(true);
        } catch {
            setSubmitted(true); // treat any response as success UX-wise
        } finally {
            setSubmitting(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!magicEmail) return;
        await signInWithMagicLink(magicEmail);
        setMagicSent(true);
    };

    if (SIGNUP_MODE === "open") {
        return (
            <div className="mx-auto max-w-md w-full">
                <button
                    onClick={() => void signInWithSlack()}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-[6px] bg-[#5B4FD9] py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#4A3FC5] disabled:opacity-60"
                >
                    <SlackIcon />
                    Sign in with Slack
                </button>

                <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#1E2A3F]" />
                    <span className="text-[11px] font-medium uppercase tracking-widest text-slate-600">or</span>
                    <div className="h-px flex-1 bg-[#1E2A3F]" />
                </div>

                {magicSent ? (
                    <div className="rounded-[6px] border border-[#10B981]/20 bg-[#10B981]/10 px-4 py-3 text-center">
                        <p className="text-[13px] font-medium text-[#10B981]">Check your inbox.</p>
                        <p className="mt-0.5 text-[12px] text-slate-500">We sent a sign-in link to {magicEmail}</p>
                    </div>
                ) : (
                    <form onSubmit={(e) => void handleMagicLink(e)} className="flex gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={magicEmail}
                            onChange={(e) => setMagicEmail(e.target.value)}
                            className="flex-1 rounded-[4px] border border-[#1E2A3F] bg-[#0B0F1A] px-3 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-600 focus:border-[#5B4FD9] focus:outline-none focus:ring-1 focus:ring-[#5B4FD9]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-[4px] bg-[#1E2A3F] px-4 py-2.5 text-[13px] font-medium text-slate-200 hover:bg-[#2A3547] disabled:opacity-60"
                        >
                            Send link
                        </button>
                    </form>
                )}
            </div>
        );
    }

    // Waitlist mode
    return (
        <div className="mx-auto max-w-md w-full">
            {submitted ? (
                <div className="rounded-[8px] border border-[#10B981]/20 bg-[#10B981]/10 px-6 py-5 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/20">
                        <span className="text-xl text-[#10B981]">✓</span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#10B981]">You're on the list.</p>
                    <p className="mt-1 text-[12px] text-slate-500">We'll reach out when your spot is ready.</p>
                </div>
            ) : (
                <form onSubmit={(e) => void handleWaitlist(e)} className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="email"
                        placeholder="your@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 rounded-[6px] border border-[#1E2A3F] bg-[#0B0F1A] px-4 py-3 text-[14px] text-slate-200 placeholder:text-slate-600 focus:border-[#5B4FD9] focus:outline-none focus:ring-1 focus:ring-[#5B4FD9]"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-[6px] bg-[#5B4FD9] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#4A3FC5] disabled:opacity-60 whitespace-nowrap"
                    >
                        {submitting ? "Joining…" : "Join waitlist"}
                    </button>
                </form>
            )}
            {!submitted && (
                <p className="mt-3 text-center text-[12px] text-slate-600">
                    No spam. Early access teams only.
                </p>
            )}
        </div>
    );
}

function SlackIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 54 54" fill="none">
            <path d="M13.5 34.5a4.5 4.5 0 1 1-4.5-4.5H13.5v4.5z" fill="#E01E5A" />
            <path d="M15.75 34.5a4.5 4.5 0 0 1 9 0v11.25a4.5 4.5 0 0 1-9 0V34.5z" fill="#E01E5A" />
            <path d="M20.25 13.5a4.5 4.5 0 1 1 4.5-4.5v4.5H20.25z" fill="#36C5F0" />
            <path d="M20.25 15.75a4.5 4.5 0 0 1 0 9H9a4.5 4.5 0 0 1 0-9h11.25z" fill="#36C5F0" />
            <path d="M40.5 20.25a4.5 4.5 0 1 1 4.5 4.5H40.5v-4.5z" fill="#2EB67D" />
            <path d="M38.25 20.25a4.5 4.5 0 0 1-9 0V9a4.5 4.5 0 0 1 9 0v11.25z" fill="#2EB67D" />
            <path d="M33.75 40.5a4.5 4.5 0 1 1-4.5 4.5V40.5h4.5z" fill="#ECB22E" />
            <path d="M33.75 38.25a4.5 4.5 0 0 1 0-9H45a4.5 4.5 0 0 1 0 9H33.75z" fill="#ECB22E" />
        </svg>
    );
}

export function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, initialized } = useAuth();

    useEffect(() => {
        if (initialized && isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [initialized, isAuthenticated, navigate]);

    return (
        <div
            className="min-h-screen overflow-x-hidden bg-[#0B0F1A] text-slate-100"
            style={{
                backgroundImage: `
          linear-gradient(rgba(91,79,217,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(91,79,217,0.04) 1px, transparent 1px)
        `,
                backgroundSize: "48px 48px",
            }}
        >
            {/* NAV */}
            <nav className="sticky top-0 z-50 border-b border-[#1E2A3F]/60 bg-[#0B0F1A]/90 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                    <div className="flex h-10 items-center gap-2">
                        <div className="flex h-7 items-center justify-center">
                            <img src={Logo} alt="Invisapprove Logo" className="h-7 w-10" />
                        </div>
                        <span
                            className="text-[15px] font-bold tracking-tight text-white"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >Invisapprove</span>
                    </div>
                    <a
                        href="/login"
                        className="rounded-[6px] border border-[#1E2A3F] bg-[#121828] px-4 py-1.5 text-[13px] font-medium text-slate-300 transition-colors hover:border-[#5B4FD9]/50 hover:text-white"
                    >
                        Sign in
                    </a>
                </div>
            </nav>

            {/* HERO */}
            <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left: copy */}
                    <div className="animate-page-enter">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5B4FD9]/30 bg-[#5B4FD9]/10 px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5B4FD9]">
                                Now in early access
                            </span>
                        </div>

                        <h1
                            className="text-[42px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[52px] lg:text-[56px]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Approval decisions
                            <br />
                            at the{" "}
                            <span
                                className="relative"
                                style={{
                                    color: "#F59E0B",
                                }}
                            >
                                speed of work.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-slate-400">
                            Route requests to the right approver, auto-approve within policy,
                            and log every decision, without leaving Slack or Teams.
                        </p>

                        <div className="mt-10">
                            <CTASection />
                        </div>
                    </div>

                    {/* Right: mockup */}
                    <div className="flex justify-center lg:justify-end">
                        <SlackMockup />
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-y border-[#1E2A3F] bg-[#121828]/60">
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <p
                        className="mb-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                    >
                        How it works
                    </p>
                    <div className="grid gap-8 sm:grid-cols-3 sm:gap-0">
                        {STEPS.map((step, i) => (
                            <div key={step.num} className="relative flex flex-col items-center text-center px-8">
                                {/* Connector line (not on last item) */}
                                {i < STEPS.length - 1 && (
                                    <div className="absolute left-[calc(50%+32px)] top-5 hidden h-px w-[calc(100%-64px)] bg-gradient-to-r from-[#1E2A3F] via-[#5B4FD9]/40 to-[#1E2A3F] sm:block" />
                                )}
                                <div
                                    className="mb-4 text-[28px] font-extrabold leading-none text-[#5B4FD9]/30"
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                    {step.num}
                                </div>
                                <h3 className="mb-2 text-[15px] font-bold text-white">{step.title}</h3>
                                <p className="text-[13px] leading-relaxed text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <p
                    className="mb-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                    Everything you need
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="rounded-[8px] border border-[#1E2A3F] bg-[#121828] p-5 transition-all duration-200 hover:border-[#5B4FD9]/30 hover:bg-[#172033]"
                            >
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#5B4FD9]/15">
                                    <Icon className="h-4 w-4 text-[#5B4FD9]" />
                                </div>
                                <h3 className="mb-1.5 text-[14px] font-semibold text-white">{f.title}</h3>
                                <p className="text-[13px] leading-relaxed text-slate-500">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="border-t border-[#1E2A3F]">
                <div
                    className="relative mx-auto max-w-6xl overflow-hidden px-6 py-24 text-center"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(91,79,217,0.12) 0%, transparent 70%)",
                    }}
                >
                    <h2
                        className="mb-4 text-[32px] font-extrabold tracking-tight text-white sm:text-[40px]"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        {SIGNUP_MODE === "open" ? "Start approving smarter." : "Be first in line."}
                    </h2>
                    <p className="mx-auto mb-10 max-w-sm text-[15px] text-slate-400">
                        {SIGNUP_MODE === "open"
                            ? "Connect your Slack workspace and invite your team in minutes."
                            : "We're onboarding teams now. Drop your email and we'll reach out when your spot is ready."}
                    </p>
                    <CTASection />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-[#1E2A3F]">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 items-center justify-center">
                            <img src={Logo} alt="Invisapprove Logo" className="h-7 w-10" />
                        </div>                        <span
                            className="text-[13px] font-semibold text-slate-400"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Invisapprove
                        </span>
                    </div>
                    <p className="text-[12px] text-slate-600">
                        © {new Date().getFullYear()} Invisapprove. Friction-free approvals.
                    </p>
                </div>
            </footer>
        </div>
    );
}
