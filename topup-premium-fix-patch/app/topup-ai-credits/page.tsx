"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Check,
  CircleAlert,
  Coins,
  Copy,
  CreditCard,
  Headphones,
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

const paymentMethods = [
  {
    id: "bkash" as const,
    name: "Bkash",
    subtitle: "Send Money Only",
    available: true,
    badge: "Popular",
    bg: "from-fuchsia-500/30 via-pink-500/18 to-[#071322]",
    ring: "border-fuchsia-400/30",
    text: "text-fuchsia-200",
    box: "bg-fuchsia-500/12",
    short: "bK",
  },
  {
    id: "nagad" as const,
    name: "Nagad",
    subtitle: "Send Money Only",
    available: true,
    badge: "Fast",
    bg: "from-orange-500/30 via-amber-500/16 to-[#071322]",
    ring: "border-orange-400/30",
    text: "text-orange-200",
    box: "bg-orange-500/12",
    short: "NG",
  },
  {
    id: "redot" as const,
    name: "Redot Pay",
    subtitle: "Not available right now",
    available: false,
    badge: "Soon",
    bg: "from-rose-500/15 via-violet-500/8 to-[#071322]",
    ring: "border-white/10",
    text: "text-white/35",
    box: "bg-white/5",
    short: "RP",
  },
  {
    id: "bank" as const,
    name: "Bank Transfer",
    subtitle: "Not available right now",
    available: false,
    badge: "Soon",
    bg: "from-slate-500/15 via-slate-400/6 to-[#071322]",
    ring: "border-white/10",
    text: "text-white/35",
    box: "bg-white/5",
    short: "BK",
  },
];

export default function TopupAiCreditsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [amountUsd, setAmountUsd] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [modalMethod, setModalMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const numericAmount = Number(amountUsd || 0);
  const amountBdt = useMemo(() => {
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
    return Math.round(numericAmount * CONVERSION_RATE);
  }, [numericAmount]);

  const activePayment = paymentMethods.find((item) => item.id === paymentMethod) ?? null;
  const modalPayment = paymentMethods.find((item) => item.id === modalMethod) ?? null;

  const selectPayment = (method: Exclude<PaymentMethod, null>) => {
    const matched = paymentMethods.find((item) => item.id === method);
    if (!matched?.available) return;
    setPaymentMethod(method);
    setModalMethod(method);
    setError("");
    setNotice("");
  };

  const updateScreenshot = (file?: File | null) => {
    if (!file) {
      setScreenshotFile(null);
      setScreenshotPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file for the payment screenshot.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Payment screenshot must be 5 MB or smaller.");
      return;
    }

    setScreenshotFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!numericAmount || numericAmount <= 0) return "Enter a valid topup amount in USD.";
    if (!activePayment?.available) return "Select an available payment method.";
    if (!transactionId.trim()) return "Transaction ID is required.";
    return "";
  };

  const handleSubmit = () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      setNotice("");
      return;
    }

    setError("");
    setNotice(
      "Your topup details are complete. A real payment-processing backend is not connected yet, so this request is ready for integration but has not been stored or submitted automatically."
    );
  };

  return (
    <main className="min-h-screen bg-[#020812] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(0,140,255,0.18),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(0,220,255,0.08),transparent_22%),radial-gradient(circle_at_60%_70%,rgba(18,70,180,0.08),transparent_28%),linear-gradient(180deg,#020916,#020812)]" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto max-w-[1650px] px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#061120]/85 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </a>

            <div className="flex items-center gap-3 rounded-2xl border border-sky-400/10 bg-white/[0.025] px-3 py-2">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] font-black text-white shadow-[0_10px_30px_rgba(0,162,255,0.28)]">
                MJ
              </div>
              <div className="text-right">
                <div className="text-lg font-black">My Jersey Studio</div>
                <div className="text-xs text-white/45">AI Credit Topup</div>
              </div>
            </div>
          </header>

          <section className="mt-5 rounded-[30px] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(5,19,39,.95),rgba(3,11,23,.97))] p-5 shadow-[0_30px_100px_rgba(0,0,0,.35)] sm:p-6">
            <div className="grid gap-5 xl:grid-cols-[1.55fr_.75fr]">
              <div>
                <div className="flex flex-col gap-4 rounded-[26px] border border-sky-400/14 bg-[linear-gradient(125deg,rgba(8,28,54,.96),rgba(3,13,26,.98))] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] border border-sky-400/25 bg-[linear-gradient(135deg,rgba(9,130,255,0.18),rgba(12,214,255,0.08))] text-sky-300 shadow-[0_0_24px_rgba(0,160,255,0.16)]">
                      <Coins className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        TopUp AI <span className="text-cyan-400">Credit</span>
                      </h1>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-white/58">
                        Top up your AI credits to continue creating, editing, and running supported premium AI workflows inside the My Jersey Ecosystem.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-[370px] rounded-[22px] border border-sky-400/24 bg-[linear-gradient(180deg,rgba(2,31,58,.86),rgba(2,18,35,.86))] p-4 text-sm leading-6 text-white/65">
                    <div className="flex items-start gap-3">
                      <Info className="mt-1 h-5 w-5 shrink-0 text-sky-400" />
                      <p>
                        AI credits are used for AI jersey generation, editing, and supported premium features across the My Jersey Ecosystem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <StepCard number="1" title="Enter Amount" subtitle="Enter the amount you want to top up (USD).">
                    <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                      <label className="flex h-16 items-center overflow-hidden rounded-[18px] border border-sky-400/15 bg-[linear-gradient(180deg,#071524,#07121f)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        <span className="grid h-full w-16 place-items-center border-r border-white/8 text-2xl font-black text-white/65">$</span>
                        <input
                          value={amountUsd}
                          onChange={(e) => {
                            setAmountUsd(e.target.value.replace(/[^\d.]/g, ""));
                            setError("");
                            setNotice("");
                          }}
                          inputMode="decimal"
                          placeholder="Enter amount"
                          className="h-full min-w-0 flex-1 bg-transparent px-5 text-lg font-semibold text-white outline-none placeholder:text-white/24"
                        />
                        <span className="px-5 text-sm font-bold tracking-wide text-white/45">USD</span>
                      </label>

                      <div className="rounded-[18px] border border-cyan-400/18 bg-[linear-gradient(180deg,rgba(0,184,255,0.08),rgba(0,184,255,0.03))] px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                          <Coins className="h-4 w-4" /> Conversion Rate
                        </div>
                        <div className="mt-2 text-2xl font-black text-emerald-400">1 USD = 130 BDT</div>
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

                  <StepCard number="3" title="Platform" subtitle="Selected platform for this AI credit topup.">
                    <div className="flex items-center justify-between rounded-[18px] border border-sky-400/28 bg-[linear-gradient(90deg,rgba(8,127,255,0.12),rgba(0,200,255,0.05))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
                      {paymentMethods.map((method) => {
                        const active = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            disabled={!method.available}
                            onClick={() => selectPayment(method.id)}
                            className={[
                              "group relative overflow-hidden rounded-[22px] border bg-gradient-to-br p-4 text-left transition",
                              method.bg,
                              method.ring,
                              method.available ? "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]" : "cursor-not-allowed opacity-55",
                              active ? "ring-2 ring-sky-400/70 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]" : "",
                            ].join(" ")}
                          >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
                            <div className="relative">
                              <div className="flex items-center justify-between gap-3">
                                <div className={["grid h-12 w-12 place-items-center rounded-2xl border border-white/10 text-sm font-black", method.box].join(" ")}>{method.short}</div>
                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white/60">{method.badge}</span>
                              </div>
                              <div className={["mt-5 text-2xl font-black", method.text].join(" ")}>{method.name}</div>
                              <div className="mt-1 text-xs leading-5 text-white/48">{method.subtitle}</div>
                              <div className="mt-4 flex items-center justify-between text-xs text-white/38">
                                <span>{method.available ? "Tap for payment details" : "Currently unavailable"}</span>
                                {active ? <span className="rounded-full bg-sky-400/12 px-2 py-1 text-sky-300">Selected</span> : null}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </StepCard>

                  <StepCard number="5" title="Transaction Details" subtitle="Transaction ID must be submitted.">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                          Submit Transaction ID <span className="text-rose-400">*</span>
                        </label>
                        <div className="flex h-14 items-center gap-3 rounded-[18px] border border-sky-400/12 bg-[linear-gradient(180deg,#071524,#07121f)] px-4">
                          <ReceiptText className="h-5 w-5 text-white/40" />
                          <input
                            value={transactionId}
                            onChange={(e) => {
                              setTransactionId(e.target.value);
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
                          onClick={() => inputRef.current?.click()}
                          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-[18px] border border-dashed border-sky-400/25 bg-[linear-gradient(180deg,rgba(7,25,45,.95),rgba(5,16,28,.95))] px-4 py-3 text-sm text-white/60 transition hover:bg-sky-400/8"
                        >
                          <UploadCloud className="h-5 w-5 text-sky-400" />
                          {screenshotFile ? screenshotFile.name : "Click to upload payment screenshot"}
                        </button>
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => updateScreenshot(e.target.files?.[0] || null)}
                        />
                        <p className="mt-2 text-xs text-white/38">PNG, JPG, WEBP • Maximum 5 MB</p>
                        {screenshotPreview ? (
                          <div className="mt-3 overflow-hidden rounded-[16px] border border-white/10 bg-black/20 p-2">
                            <img src={screenshotPreview} alt="Payment screenshot preview" className="max-h-44 w-full rounded-xl object-contain" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </StepCard>

                  <StepCard number="6" title="Add Credit" subtitle="Review the details and finalize your topup request.">
                    <button
                      type="button"
                      onClick={handleSubmit}
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
                    <SummaryRow label="Amount (USD)" value={numericAmount > 0 ? `$ ${numericAmount.toFixed(2)}` : "—"} />
                    <SummaryRow label="Conversion Rate" value="1 USD = 130 BDT" />
                    <SummaryRow label="Total Amount (BDT)" value={amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "—"} strong />
                    <div className="h-px bg-white/8" />
                    <SummaryRow label="Platform" value={PLATFORM_NAME} />
                    <SummaryRow label="Payment Method" value={activePayment?.available ? activePayment.name : "Not selected"} />
                    <SummaryRow label="Transaction ID" value={transactionId.trim() ? transactionId.trim() : "Required"} />
                  </div>
                </GlassCard>

                <div className="rounded-[24px] border border-emerald-400/15 bg-[linear-gradient(180deg,rgba(5,50,42,.42),rgba(4,18,20,.72))] p-5 shadow-[0_15px_40px_rgba(0,0,0,.18)]">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
                    <div>
                      <h2 className="text-2xl font-black">Request Status</h2>
                      <p className="mt-2 text-sm leading-6 text-white/55">No persistent topup request has been sent yet.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <StatusRow label="Amount entered" complete={numericAmount > 0} />
                    <StatusRow label="Payment method selected" complete={Boolean(activePayment?.available)} />
                    <StatusRow label="Transaction ID entered" complete={Boolean(transactionId.trim())} />
                    <StatusRow label="Backend submission" complete={false} />
                  </div>
                </div>

                <GlassCard title="Need Help?" icon={<Headphones className="h-6 w-6 text-sky-400" />}>
                  <p className="text-sm leading-6 text-white/55">Facing any issue with topup or payment? Contact support directly.</p>
                  <a
                    href="https://wa.me/8801303498506"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-[16px] border border-sky-400/25 bg-sky-400/8 px-4 py-3 font-semibold text-sky-200"
                  >
                    Contact Support
                  </a>
                </GlassCard>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {modalPayment?.available ? (
        <PaymentModal method={modalPayment.id} title={modalPayment.name} amountBdt={amountBdt} onClose={() => setModalMethod(null)} />
      ) : null}
    </main>
  );
}

function StepCard({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#071423,#040d18)] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.16)]">
      <div className="grid gap-5 lg:grid-cols-[265px_1fr] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-lg font-black text-white shadow-[0_0_24px_rgba(0,160,255,0.22)]">{number}</div>
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

function GlassCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#071423,#040d18)] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
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
      ].join(" ")}>{complete ? <Check className="h-3.5 w-3.5" /> : null}</span>
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

  const copyText = async (value: string, field: "number" | "amount") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  const accent = method === "bkash" ? "from-fuchsia-500/22 to-pink-500/6 border-fuchsia-400/25" : "from-orange-500/22 to-amber-500/6 border-orange-400/25";
  const amountLabel = amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "Enter USD amount first";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/78 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-sky-400/18 bg-[linear-gradient(180deg,#071728,#030b16)] shadow-[0_35px_120px_rgba(0,0,0,0.6)]">
        <div className={["border-b px-5 py-5 sm:px-6", accent, "bg-gradient-to-br"].join(" ")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">Payment Instructions</div>
              <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
              <p className="mt-2 text-sm text-white/60">Follow the payment instructions below and then submit the required transaction ID.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <PremiumBox title="Payment Number" subtitle="Send Money Only">
              <div className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <span className="text-xl font-black tracking-wide">{PAYMENT_NUMBER}</span>
                <CopyButton copied={copiedField === "number"} onClick={() => copyText(PAYMENT_NUMBER, "number")} label="Copy number" />
              </div>
            </PremiumBox>

            <PremiumBox title="Amount To Send" subtitle="Exact amount recommended">
              <div className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <span className="text-xl font-black tracking-wide">{amountLabel}</span>
                <CopyButton copied={copiedField === "amount"} onClick={() => copyText(amountLabel, "amount")} label="Copy amount" />
              </div>
            </PremiumBox>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <PremiumBox title="Platform" subtitle="Applied destination">
              <div className="rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-4 text-lg font-black">{PLATFORM_NAME}</div>
            </PremiumBox>

            <PremiumBox title="Method" subtitle="Payment mode required">
              <div className="rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-4 text-lg font-black">Send Money Only</div>
            </PremiumBox>
          </div>

          <div className="mt-5 rounded-[22px] border border-amber-400/22 bg-[linear-gradient(180deg,rgba(255,184,0,0.07),rgba(255,184,0,0.03))] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-200">Important boxed disclaimer</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <InstructionMiniBox text="Use Send Money only. Cash Out or Personal payments are not accepted." />
                  <InstructionMiniBox text="Send the exact amount shown above to avoid manual mismatch during review." />
                  <InstructionMiniBox text="Transaction ID must be submitted in the topup form. Without it the request should not proceed." />
                  <InstructionMiniBox text="Uploading the payment screenshot is strongly recommended for smoother verification." />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-sky-400/15 bg-[linear-gradient(180deg,#061321,#05101b)] p-4">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">Quick Instructions</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <InstructionStep number="1" text="Copy the payment number or amount if needed." />
              <InstructionStep number="2" text="Send the payment using the selected method." />
              <InstructionStep number="3" text="Come back and submit the transaction ID in the form." />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex w-full items-center justify-center rounded-[18px] bg-[linear-gradient(90deg,#0b7bff,#1fd6ff)] px-5 py-4 text-lg font-black text-white shadow-[0_16px_35px_rgba(0,145,255,.24)]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

function PremiumBox({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#071322,#040d16)] p-4">
      <div className="mb-3">
        <div className="text-base font-black">{title}</div>
        <div className="text-xs text-white/45">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

function CopyButton({ copied, onClick, label }: { copied: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/8 px-3 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/12"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function InstructionMiniBox({ text }: { text: string }) {
  return <div className="rounded-[16px] border border-amber-300/14 bg-black/16 px-4 py-3 text-sm leading-6 text-amber-100/76">{text}</div>;
}

function InstructionStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-sm font-black">{number}</div>
        <div className="text-sm leading-6 text-white/72">{text}</div>
      </div>
    </div>
  );
}
