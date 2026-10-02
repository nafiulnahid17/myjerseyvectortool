"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Banknote,
  Check,
  CircleAlert,
  Coins,
  Copy,
  CreditCard,
  Headphones,
  ImageUp,
  Info,
  Landmark,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
  Wallet,
  X,
} from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "redot" | "bank" | null;

const CONVERSION_RATE = 130;
const PAYMENT_NUMBER = "01303498506";
const PLATFORM_NAME = "My Jersey Ecosystem";

const METHODS = [
  {
    id: "bkash" as const,
    title: "Bkash",
    subtitle: "Send Money Only",
    available: true,
    short: "bK",
    accent: "from-pink-500/28 via-fuchsia-500/16 to-slate-900",
    border: "border-pink-400/28",
    glow: "shadow-[0_12px_35px_rgba(236,72,153,0.15)]",
  },
  {
    id: "nagad" as const,
    title: "Nagad",
    subtitle: "Send Money Only",
    available: true,
    short: "NG",
    accent: "from-orange-500/28 via-amber-500/16 to-slate-900",
    border: "border-orange-400/28",
    glow: "shadow-[0_12px_35px_rgba(249,115,22,0.15)]",
  },
  {
    id: "redot" as const,
    title: "Redot Pay",
    subtitle: "Not available right now",
    available: false,
    short: "RP",
    accent: "from-rose-500/16 via-rose-400/10 to-slate-900",
    border: "border-white/10",
    glow: "",
  },
  {
    id: "bank" as const,
    title: "Bank Transfer",
    subtitle: "Not available right now",
    available: false,
    short: "BK",
    accent: "from-sky-500/12 via-slate-400/8 to-slate-900",
    border: "border-white/10",
    glow: "",
  },
];

export default function TopupAiCreditsPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [amountUsd, setAmountUsd] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [modalMethod, setModalMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const usdNumber = Number(amountUsd || 0);
  const amountBdt = useMemo(() => {
    if (!Number.isFinite(usdNumber) || usdNumber <= 0) return 0;
    return Math.round(usdNumber * CONVERSION_RATE);
  }, [usdNumber]);

  const activeMethod = METHODS.find((item) => item.id === paymentMethod) ?? null;
  const popupMethod = METHODS.find((item) => item.id === modalMethod) ?? null;

  const handleSelectMethod = (method: Exclude<PaymentMethod, null>) => {
    const matched = METHODS.find((item) => item.id === method);
    if (!matched?.available) return;
    setPaymentMethod(method);
    setModalMethod(method);
    setError("");
    setNotice("");
  };

  const handleScreenshot = (file?: File | null) => {
    if (!file) {
      setScreenshot(null);
      setScreenshotPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a payment screenshot image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Payment screenshot must be within 5 MB.");
      return;
    }

    setScreenshot(file);
    setError("");

    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const submitRequest = () => {
    if (!usdNumber || usdNumber <= 0) {
      setError("Enter a valid topup amount in USD.");
      setNotice("");
      return;
    }
    if (!activeMethod?.available) {
      setError("Choose an available payment method.");
      setNotice("");
      return;
    }
    if (!transactionId.trim()) {
      setError("Transaction ID is required.");
      setNotice("");
      return;
    }

    setError("");
    setNotice(
      "Topup details are complete. A persistent payment backend is not connected yet, so this page validates the request structure but does not store or submit it automatically."
    );
  };

  return (
    <main className="min-h-screen bg-[#020916] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,153,255,0.18),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(0,217,255,0.09),transparent_22%),radial-gradient(circle_at_60%_72%,rgba(0,77,255,0.08),transparent_26%),linear-gradient(180deg,#020916,#020812)]" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto max-w-[1680px] px-4 py-5 sm:px-6 lg:px-8">
          <header className="rounded-[26px] border border-sky-400/12 bg-[linear-gradient(180deg,rgba(6,18,34,.88),rgba(4,11,23,.88))] p-4 shadow-[0_18px_70px_rgba(0,0,0,.28)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <a href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06]">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-sky-400/10 bg-white/[0.03] px-3 py-2">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] font-black text-white shadow-[0_12px_30px_rgba(0,145,255,0.25)]">
                  MJ
                </div>
                <div className="text-right">
                  <div className="text-lg font-black">My Jersey Studio</div>
                  <div className="text-xs text-white/45">AI Credit Topup</div>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-5 rounded-[32px] border border-sky-400/12 bg-[linear-gradient(180deg,rgba(4,16,31,.96),rgba(3,11,21,.98))] p-5 shadow-[0_35px_110px_rgba(0,0,0,.35)] sm:p-6">
            <div className="grid gap-6 xl:grid-cols-[1.55fr_.75fr]">
              <div>
                <div className="rounded-[28px] border border-sky-400/16 bg-[linear-gradient(120deg,rgba(6,27,54,.96),rgba(3,12,25,.98))] p-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] border border-sky-400/25 bg-[linear-gradient(135deg,rgba(9,130,255,.18),rgba(12,214,255,.08))] text-sky-300 shadow-[0_0_24px_rgba(0,160,255,.15)]">
                        <Coins className="h-8 w-8" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                          TopUp AI <span className="text-cyan-400">Credit</span>
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-white/58">
                          Top up your AI credits to continue creating amazing jersey designs in the My Jersey Ecosystem.
                        </p>
                      </div>
                    </div>

                    <div className="max-w-[380px] rounded-[22px] border border-sky-400/24 bg-[linear-gradient(180deg,rgba(2,31,58,.86),rgba(2,18,35,.86))] p-4 text-sm leading-6 text-white/65">
                      <div className="flex items-start gap-3">
                        <Info className="mt-1 h-5 w-5 shrink-0 text-sky-400" />
                        <p>
                          AI credits are used for AI jersey generation, editing, and supported premium features across the My Jersey Ecosystem.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <FeatureChip icon={<Wallet className="h-4 w-4" />} title="Amount (USD)" subtitle="Enter your topup amount" />
                    <FeatureChip icon={<Banknote className="h-4 w-4" />} title="USD to BDT" subtitle={`Rate ${CONVERSION_RATE}`} />
                    <FeatureChip icon={<CreditCard className="h-4 w-4" />} title="Payment Method" subtitle="Choose available method" />
                    <FeatureChip icon={<ReceiptText className="h-4 w-4" />} title="Submit Txn ID" subtitle="Required before request" />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <StepCard number="1" title="Enter Amount" subtitle="Enter the amount you want to top up (USD).">
                    <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
                      <label className="flex h-16 items-center overflow-hidden rounded-[18px] border border-sky-400/14 bg-[linear-gradient(180deg,#071524,#07121f)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        <span className="grid h-full w-16 place-items-center border-r border-white/8 text-2xl font-black text-white/65">$</span>
                        <input
                          value={amountUsd}
                          onChange={(event) => {
                            setAmountUsd(event.target.value.replace(/[^\d.]/g, ""));
                            setError("");
                            setNotice("");
                          }}
                          inputMode="decimal"
                          placeholder="Enter amount"
                          className="h-full min-w-0 flex-1 bg-transparent px-5 text-lg font-semibold text-white outline-none placeholder:text-white/22"
                        />
                        <span className="px-5 text-sm font-bold tracking-wide text-white/45">USD</span>
                      </label>

                      <div className="rounded-[18px] border border-cyan-400/18 bg-[linear-gradient(180deg,rgba(0,184,255,0.08),rgba(0,184,255,0.03))] px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                          <Coins className="h-4 w-4" /> Conversion Rate
                        </div>
                        <div className="mt-2 text-2xl font-black leading-tight text-emerald-400">1 USD = 130 BDT</div>
                      </div>
                    </div>
                  </StepCard>

                  <StepCard number="2" title="Converted Amount" subtitle="Total amount in BDT (automatic calculation).">
                    <div className="flex h-16 items-center justify-between rounded-[18px] border border-sky-400/12 bg-[linear-gradient(180deg,#071524,#07121f)] px-5">
                      <div className="flex items-center gap-3">
                        <Banknote className="h-5 w-5 text-white/45" />
                        <span className="text-3xl font-black">{amountBdt > 0 ? amountBdt.toLocaleString("en-US") : "0"}</span>
                      </div>
                      <span className="text-sm font-bold tracking-wide text-white/45">BDT</span>
                    </div>
                  </StepCard>

                  <StepCard number="3" title="Platform" subtitle="Selected platform to top up AI credit.">
                    <div className="flex items-center justify-between rounded-[18px] border border-sky-400/25 bg-[linear-gradient(90deg,rgba(8,127,255,0.12),rgba(0,200,255,0.05))] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] font-black text-white">MJ</div>
                        <div>
                          <div className="font-black">{PLATFORM_NAME}</div>
                          <div className="text-xs text-white/45">Use AI credits across supported My Jersey products</div>
                        </div>
                      </div>
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-400/10 text-cyan-300">
                        <Check className="h-5 w-5" />
                      </div>
                    </div>
                  </StepCard>

                  <StepCard number="4" title="Payment Method" subtitle="Choose your preferred payment method.">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {METHODS.map((method) => {
                        const active = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            disabled={!method.available}
                            onClick={() => handleSelectMethod(method.id)}
                            className={[
                              "group relative overflow-hidden rounded-[22px] border bg-gradient-to-br p-4 text-left transition",
                              method.accent,
                              method.border,
                              method.available ? `hover:-translate-y-1 ${method.glow}` : "cursor-not-allowed opacity-55",
                              active ? "ring-2 ring-sky-400/70" : "",
                            ].join(" ")}
                          >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
                            <div className="relative">
                              <div className="flex items-center justify-between">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-black text-white/90">
                                  {method.short}
                                </div>
                                {active ? <span className="rounded-full bg-sky-400/12 px-2.5 py-1 text-[11px] font-bold text-sky-300">Selected</span> : null}
                              </div>
                              <div className="mt-5 text-2xl font-black text-white">{method.title}</div>
                              <div className="mt-1 text-xs leading-5 text-white/48">{method.subtitle}</div>
                              <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/34">
                                {method.available ? "Click to view details" : "Currently unavailable"}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </StepCard>

                  <StepCard number="5" title="Transaction Details" subtitle="Transaction ID is mandatory to proceed.">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                          Submit Transaction ID <span className="text-rose-400">*</span>
                        </label>
                        <div className="flex h-14 items-center gap-3 rounded-[18px] border border-sky-400/12 bg-[linear-gradient(180deg,#071524,#07121f)] px-4">
                          <ReceiptText className="h-5 w-5 text-white/40" />
                          <input
                            value={transactionId}
                            onChange={(event) => {
                              setTransactionId(event.target.value);
                              setError("");
                              setNotice("");
                            }}
                            placeholder="Enter your transaction ID"
                            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/24"
                          />
                        </div>
                        <p className="mt-2 text-xs text-white/38">Enter the exact transaction ID from your payment app.</p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">Upload Payment Screenshot</label>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-[18px] border border-dashed border-sky-400/25 bg-[linear-gradient(180deg,rgba(7,25,45,.95),rgba(5,16,28,.95))] px-4 py-3 text-sm text-white/60 transition hover:bg-sky-400/8"
                        >
                          <UploadCloud className="h-5 w-5 text-sky-400" />
                          {screenshot ? screenshot.name : "Click to upload payment screenshot"}
                        </button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(event) => handleScreenshot(event.target.files?.[0] || null)}
                        />
                        <p className="mt-2 text-xs text-white/38">PNG, JPG, WEBP • Max 5 MB</p>
                        {screenshotPreview ? (
                          <div className="mt-3 overflow-hidden rounded-[16px] border border-white/10 bg-black/20 p-2">
                            <img src={screenshotPreview} alt="Payment screenshot preview" className="max-h-44 w-full rounded-xl object-contain" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </StepCard>

                  <StepCard number="6" title="Add Credit" subtitle="Review your details and validate the request.">
                    <button
                      type="button"
                      onClick={submitRequest}
                      className="inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0b7bff,#1fd6ff)] px-5 py-4 text-lg font-black text-white shadow-[0_18px_35px_rgba(0,145,255,.24)]"
                    >
                      <Wallet className="h-5 w-5" /> Add Credit
                    </button>

                    {error ? (
                      <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-rose-400/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-100">
                        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    ) : null}

                    {notice ? (
                      <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-sm leading-6 text-amber-100">
                        <Info className="mt-0.5 h-5 w-5 shrink-0" />
                        <span>{notice}</span>
                      </div>
                    ) : null}
                  </StepCard>
                </div>
              </div>

              <aside className="space-y-4">
                <GlassCard title="TopUp Summary" icon={<ReceiptText className="h-6 w-6 text-cyan-400" />}>
                  <div className="space-y-4 border-t border-white/8 pt-5">
                    <SummaryRow label="Amount (USD)" value={usdNumber > 0 ? `$ ${usdNumber.toFixed(2)}` : "—"} />
                    <SummaryRow label="Conversion Rate" value={`1 USD = ${CONVERSION_RATE} BDT`} />
                    <SummaryRow label="Total Amount (BDT)" value={amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "—"} strong />
                    <div className="h-px bg-white/8" />
                    <SummaryRow label="Platform" value={PLATFORM_NAME} />
                    <SummaryRow label="Payment Method" value={activeMethod?.available ? activeMethod.title : "Not selected"} />
                    <SummaryRow label="Transaction ID" value={transactionId.trim() ? transactionId.trim() : "Required"} />
                  </div>
                </GlassCard>

                <div className="rounded-[24px] border border-emerald-400/15 bg-[linear-gradient(180deg,rgba(5,50,42,.42),rgba(4,18,20,.72))] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
                    <div>
                      <h2 className="text-2xl font-black">Request Status</h2>
                      <p className="mt-2 text-sm leading-6 text-white/55">No persistent topup request has been sent yet.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <StatusRow label="Amount entered" complete={usdNumber > 0} />
                    <StatusRow label="Payment method selected" complete={Boolean(activeMethod?.available)} />
                    <StatusRow label="Transaction ID entered" complete={Boolean(transactionId.trim())} />
                    <StatusRow label="Backend submission" complete={false} />
                  </div>
                </div>

                <GlassCard title="Need Help?" icon={<Headphones className="h-6 w-6 text-sky-400" />}>
                  <p className="text-sm leading-6 text-white/55">Facing any issue with payment or topup? Contact your support channel from this page later.</p>
                  <div className="mt-5 rounded-[16px] border border-sky-400/18 bg-sky-400/6 px-4 py-3 text-sm text-sky-100/80">
                    Support contact area is ready for your original support details.
                  </div>
                </GlassCard>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {popupMethod?.available ? (
        <PaymentModal method={popupMethod.id} title={popupMethod.title} amountBdt={amountBdt} onClose={() => setModalMethod(null)} />
      ) : null}
    </main>
  );
}

function FeatureChip({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="rounded-[18px] border border-sky-400/12 bg-[linear-gradient(180deg,rgba(5,20,38,.92),rgba(3,11,23,.92))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-400/10 text-sky-300">{icon}</div>
        <div>
          <div className="text-sm font-black">{title}</div>
          <div className="text-xs text-white/45">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#071423,#040d18)] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.16)]">
      <div className="grid gap-5 lg:grid-cols-[265px_1fr] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-lg font-black text-white shadow-[0_0_24px_rgba(0,160,255,0.2)]">{number}</div>
          <div>
            <h2 className="text-lg font-black">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-white/45">{subtitle}</p>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function GlassCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#071423,#040d18)] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-white/45">{label}</span>
      <span className={strong ? "text-right text-lg font-black text-emerald-400" : "text-right font-semibold text-white/85"}>{value}</span>
    </div>
  );
}

function StatusRow({ label, complete }: { label: string; complete: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={[
        "grid h-6 w-6 place-items-center rounded-full border text-xs",
        complete ? "border-emerald-400/40 bg-emerald-400/12 text-emerald-300" : "border-white/10 bg-white/[0.03] text-white/25",
      ].join(" ")}>
        {complete ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <span className={complete ? "text-white/80" : "text-white/40"}>{label}</span>
    </div>
  );
}

function PaymentModal({
  method,
  title,
  amountBdt,
  onClose,
}: {
  method: "bkash" | "nagad";
  title: string;
  amountBdt: number;
  onClose: () => void;
}) {
  const [copiedField, setCopiedField] = useState<"number" | "amount" | null>(null);

  const copy = async (text: string, field: "number" | "amount") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  const amountText = amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "Enter USD amount first";
  const theme = method === "bkash" ? "from-pink-500/20 via-fuchsia-500/6 to-[#07101b] border-pink-400/24" : "from-orange-500/20 via-amber-500/6 to-[#07101b] border-orange-400/24";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[760px] overflow-hidden rounded-[28px] border border-sky-400/20 bg-[linear-gradient(180deg,#071728,#030b16)] shadow-[0_35px_120px_rgba(0,0,0,0.62)]">
        <div className={["border-b bg-gradient-to-br px-5 py-4 sm:px-6", theme].join(" ")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-[22px] border border-sky-400/25 bg-[linear-gradient(135deg,rgba(10,124,255,.14),rgba(41,212,255,.06))] text-sky-300 shadow-[0_0_24px_rgba(0,160,255,.16)]">
                <CreditCard className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Payment Method Details</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  You have selected <span className="font-bold text-cyan-300">{title} Send Money</span> as your payment method.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <PopupRow
              icon={<Wallet className="h-5 w-5" />}
              title="Account Number"
              subtitle="Send money to this number"
              value={PAYMENT_NUMBER}
              buttonLabel={copiedField === "number" ? "Copied" : "Copy"}
              onButtonClick={() => copy(PAYMENT_NUMBER, "number")}
            />
            <PopupRow
              icon={<Coins className="h-5 w-5" />}
              title="Amount"
              subtitle="Send this exact amount"
              value={amountText}
              buttonLabel={copiedField === "amount" ? "Copied" : "Copy"}
              onButtonClick={() => copy(amountText, "amount")}
            />
          </div>

          <div className="mt-3 rounded-[22px] border border-sky-400/16 bg-[linear-gradient(180deg,rgba(5,28,55,.74),rgba(4,16,28,.7))] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-400/10 text-sky-300">
                <Info className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-2xl font-black text-cyan-300">Payment Instructions</div>
                <p className="mt-1 text-sm text-white/60">Please follow the steps below to complete your payment via {title}.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_210px]">
                  <div className="space-y-3">
                    <InstructionStep number="1" text="Go to your payment app." />
                    <InstructionStep number="2" text='Choose "Send Money".' />
                    <InstructionStep number="3" text="Copy the account number and amount." />
                    <InstructionStep number="4" text="Complete the payment." />
                    <InstructionStep number="5" text="Copy the Txn ID and place it in the submission field." />
                  </div>
                  <div className="rounded-[20px] border border-sky-400/14 bg-[linear-gradient(180deg,rgba(7,21,38,.95),rgba(4,12,22,.95))] p-4">
                    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-white shadow-[0_12px_30px_rgba(0,145,255,.22)]">
                      <CreditCard className="h-10 w-10" />
                    </div>
                    <div className="mt-4 text-sm font-bold text-white">After payment, submit your transaction ID and upload your screenshot.</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-sky-400/18 bg-sky-400/8 px-3 py-2 text-xs font-semibold text-sky-200">
                      <ImageUp className="h-4 w-4" /> Upload Screenshot
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[22px] border border-amber-400/18 bg-[linear-gradient(180deg,rgba(255,184,0,0.08),rgba(255,184,0,0.03))] p-4">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">Important Boxed Disclaimer</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <MiniDisclaimer text="Use Send Money only. Other payment flows are not accepted here." />
                  <MiniDisclaimer text="Send the exact amount shown above to avoid manual mismatch during review." />
                  <MiniDisclaimer text="Transaction ID must be submitted in the topup form. Without it the request should not proceed." />
                  <MiniDisclaimer text="Uploading the payment screenshot is strongly recommended for smoother verification." />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-[18px] border border-white/12 bg-white/[0.03] px-5 py-4 text-lg font-black text-white/90"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0b7bff,#1fd6ff)] px-5 py-4 text-lg font-black text-white shadow-[0_16px_35px_rgba(0,145,255,.22)]"
            >
              <Check className="h-5 w-5" /> I Have Completed the Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupRow({
  icon,
  title,
  subtitle,
  value,
  buttonLabel,
  onButtonClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  value: string;
  buttonLabel: string;
  onButtonClick: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-sky-400/14 bg-[linear-gradient(180deg,#071322,#05101c)] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-sky-400/16 bg-sky-400/8 text-sky-300">{icon}</div>
        <div>
          <div className="font-black text-white">{title}</div>
          <div className="text-xs text-white/45">{subtitle}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] p-3">
        <div className="min-w-0 flex-1 truncate px-2 text-xl font-black tracking-wide text-white">{value}</div>
        <button
          type="button"
          onClick={onButtonClick}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-sky-400/18 bg-sky-400/8 px-3 py-2 text-sm font-semibold text-sky-200"
        >
          <Copy className="h-4 w-4" /> {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function InstructionStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-sm font-black text-white">{number}</div>
      <div className="text-sm leading-6 text-white/82">{text}</div>
    </div>
  );
}

function MiniDisclaimer({ text }: { text: string }) {
  return <div className="rounded-[16px] border border-amber-300/14 bg-black/16 px-4 py-3 text-sm leading-6 text-amber-100/78">{text}</div>;
}
