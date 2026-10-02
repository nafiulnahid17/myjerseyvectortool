"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeDollarSign,
  Banknote,
  Check,
  CircleAlert,
  CircleDollarSign,
  Coins,
  FileImage,
  Info,
  Landmark,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
  WalletCards,
  X,
} from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "redot" | "bank" | null;

const CONVERSION_RATE = 130;
const PLATFORM_NAME = "My Jersey Ecosystem";
const PAYMENT_NUMBER = "01303498506";

const paymentMethods = [
  {
    id: "bkash" as const,
    title: "Bkash",
    subtitle: "Send Money Only",
    available: true,
    accent: "from-pink-500/25 to-pink-700/10",
    border: "border-pink-400/30",
    text: "text-pink-300",
  },
  {
    id: "nagad" as const,
    title: "Nagad",
    subtitle: "Send Money Only",
    available: true,
    accent: "from-orange-500/25 to-orange-700/10",
    border: "border-orange-400/30",
    text: "text-orange-300",
  },
  {
    id: "redot" as const,
    title: "Redot Pay",
    subtitle: "Not available right now",
    available: false,
    accent: "from-rose-500/15 to-rose-700/5",
    border: "border-white/10",
    text: "text-white/45",
  },
  {
    id: "bank" as const,
    title: "Bank Transfer",
    subtitle: "Not available right now",
    available: false,
    accent: "from-slate-500/15 to-slate-700/5",
    border: "border-white/10",
    text: "text-white/45",
  },
];

export default function TopupAiCreditsPage() {
  const screenshotRef = useRef<HTMLInputElement | null>(null);

  const [amountUsd, setAmountUsd] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentModal, setPaymentModal] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amountUsd || 0);
  const amountBdt = useMemo(() => {
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
    return numericAmount * CONVERSION_RATE;
  }, [numericAmount]);

  const selectedPayment = paymentMethods.find((item) => item.id === paymentMethod) ?? null;
  const modalPayment = paymentMethods.find((item) => item.id === paymentModal) ?? null;

  const choosePayment = (method: Exclude<PaymentMethod, null>) => {
    const item = paymentMethods.find((entry) => entry.id === method);
    if (!item?.available) return;
    setPaymentMethod(method);
    setPaymentModal(method);
    setError("");
    setMessage("");
  };

  const onScreenshot = (file?: File | null) => {
    if (!file) {
      setScreenshot(null);
      setScreenshotPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image screenshot.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Payment screenshot must be 5 MB or smaller.");
      return;
    }

    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
    setError("");
  };

  const validateSubmission = () => {
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return "Enter a valid topup amount in USD.";
    }

    if (!selectedPayment || !selectedPayment.available) {
      return "Choose an available payment method.";
    }

    if (!transactionId.trim()) {
      return "Transaction ID is required.";
    }

    return "";
  };

  const submitRequest = () => {
    const validationError = validateSubmission();
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    // There is intentionally no fake server submission here.
    // We validate the complete request client-side and clearly state that
    // a real backend is still required for persistence/processing.
    setError("");
    setMessage(
      "Your topup information is complete and ready for submission. A persistent topup backend is not connected yet, so this request has not been stored or sent to an admin."
    );
  };

  return (
    <main className="min-h-screen bg-[#020812] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(0,139,255,0.16),transparent_24%),radial-gradient(circle_at_87%_20%,rgba(0,216,255,0.10),transparent_22%),linear-gradient(180deg,#03101f,#020812)]" />

        <div className="relative mx-auto max-w-[1650px] px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-[#06111f]/88 px-4 py-3 backdrop-blur-xl">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.07]"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </a>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#0875ff,#20c8ff)] font-black">
                MJ
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">My Jersey Studio</div>
                <div className="text-xs text-white/40">AI Credit Topup</div>
              </div>
            </div>
          </header>

          <section className="mt-4 rounded-[28px] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(6,18,35,.96),rgba(3,10,22,.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,.32)] sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] border border-sky-400/25 bg-sky-400/8 text-sky-400">
                  <Coins className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                    TopUp AI <span className="text-cyan-400">Credit</span>
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
                    Add AI generation credits to your My Jersey Ecosystem workspace.
                    Enter the amount, select a supported payment method, and provide the transaction ID.
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-sky-400/25 bg-sky-400/7 px-4 py-3 text-sm leading-6 text-white/65 xl:max-w-[360px]">
                <div className="flex items-start gap-3">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-sky-400" />
                  <p>
                    AI credits are used for AI jersey generation, editing, and supported premium AI workflows across the My Jersey Ecosystem.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_.75fr]">
              <div className="space-y-4">
                <StepCard
                  number="1"
                  title="Enter Amount"
                  subtitle="Enter the amount you want to top up (USD)."
                >
                  <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                    <label className="flex items-center overflow-hidden rounded-[16px] border border-white/10 bg-[#071524]">
                      <span className="grid h-14 w-14 place-items-center border-r border-white/8 text-xl font-black text-white/60">$</span>
                      <input
                        value={amountUsd}
                        onChange={(event) => {
                          const next = event.target.value.replace(/[^\d.]/g, "");
                          setAmountUsd(next);
                          setError("");
                          setMessage("");
                        }}
                        inputMode="decimal"
                        placeholder="Enter amount"
                        className="h-14 min-w-0 flex-1 bg-transparent px-4 text-lg font-semibold text-white outline-none placeholder:text-white/25"
                      />
                      <span className="px-4 text-sm font-semibold text-white/45">USD</span>
                    </label>

                    <div className="rounded-[16px] border border-cyan-400/20 bg-cyan-400/6 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-cyan-300">
                        <CircleDollarSign className="h-4 w-4" />
                        Conversion Rate
                      </div>
                      <div className="mt-1 font-bold text-emerald-400">1 USD = 130 BDT</div>
                    </div>
                  </div>
                </StepCard>

                <StepCard
                  number="2"
                  title="Converted Amount"
                  subtitle="Total amount in BDT (automatic calculation)."
                >
                  <div className="flex h-14 items-center justify-between rounded-[16px] border border-white/10 bg-[#071524] px-4">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-5 w-5 text-white/50" />
                      <span className="text-2xl font-black">
                        {amountBdt > 0 ? amountBdt.toLocaleString("en-US") : "0"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white/45">BDT</span>
                  </div>
                </StepCard>

                <StepCard
                  number="3"
                  title="Platform"
                  subtitle="Selected platform for this credit topup."
                >
                  <div className="flex items-center justify-between rounded-[18px] border border-sky-400/30 bg-[linear-gradient(90deg,rgba(0,123,255,.14),rgba(0,200,255,.05))] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#0875ff,#20c8ff)] font-black">
                        MJ
                      </div>
                      <div>
                        <div className="font-bold">{PLATFORM_NAME}</div>
                        <div className="text-xs text-white/45">AI credits across supported My Jersey products</div>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-cyan-400" />
                  </div>
                </StepCard>

                <StepCard
                  number="4"
                  title="Payment Method"
                  subtitle="Choose your preferred payment method."
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {paymentMethods.map((method) => {
                      const active = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          disabled={!method.available}
                          onClick={() => choosePayment(method.id)}
                          className={[
                            "relative rounded-[18px] border bg-gradient-to-br p-4 text-left transition",
                            method.accent,
                            method.border,
                            method.available ? "hover:-translate-y-0.5 hover:bg-white/[0.05]" : "cursor-not-allowed opacity-55",
                            active ? "ring-2 ring-sky-400/70" : "",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <PaymentIcon method={method.id} />
                            {active ? (
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-500 text-xs">
                                ✓
                              </span>
                            ) : null}
                          </div>
                          <div className={`mt-4 font-black ${method.text}`}>{method.title}</div>
                          <div className="mt-1 text-xs text-white/45">{method.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>
                </StepCard>

                <StepCard
                  number="5"
                  title="Transaction Details"
                  subtitle="Transaction ID is mandatory."
                >
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/75">
                        Submit Transaction ID <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex h-14 items-center gap-3 rounded-[16px] border border-white/10 bg-[#071524] px-4">
                        <ReceiptText className="h-5 w-5 text-white/40" />
                        <input
                          value={transactionId}
                          onChange={(event) => {
                            setTransactionId(event.target.value);
                            setError("");
                            setMessage("");
                          }}
                          placeholder="Enter your transaction ID"
                          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                        />
                      </div>
                      <p className="mt-2 text-xs text-white/35">
                        Enter the exact transaction ID from your payment app.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/75">
                        Upload Payment Screenshot
                      </label>

                      <button
                        type="button"
                        onClick={() => screenshotRef.current?.click()}
                        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-[16px] border border-dashed border-sky-400/25 bg-sky-400/5 px-4 py-3 text-sm text-white/60 transition hover:bg-sky-400/8"
                      >
                        <UploadCloud className="h-5 w-5 text-sky-400" />
                        {screenshot ? screenshot.name : "Click to upload payment screenshot"}
                      </button>

                      <input
                        ref={screenshotRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => onScreenshot(event.target.files?.[0] || null)}
                      />
                      <p className="mt-2 text-xs text-white/35">PNG, JPG, WEBP • Max 5 MB</p>

                      {screenshotPreview ? (
                        <div className="mt-3 overflow-hidden rounded-[14px] border border-white/10 bg-black/20 p-2">
                          <img
                            src={screenshotPreview}
                            alt="Payment screenshot preview"
                            className="max-h-40 w-full rounded-lg object-contain"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </StepCard>

                <StepCard
                  number="6"
                  title="Add Credit"
                  subtitle="Review your details before sending the request."
                >
                  <button
                    type="button"
                    onClick={submitRequest}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#20c8ff)] px-5 py-4 text-lg font-black text-white shadow-[0_16px_35px_rgba(0,142,255,.24)]"
                  >
                    <WalletCards className="h-5 w-5" />
                    Add Credit
                  </button>

                  {error ? (
                    <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-rose-400/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-200">
                      <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}

                  {message ? (
                    <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-amber-400/25 bg-amber-500/8 px-4 py-3 text-sm leading-6 text-amber-100">
                      <Info className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{message}</span>
                    </div>
                  ) : null}
                </StepCard>
              </div>

              <aside className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#071524,#040d19)] p-5">
                  <div className="flex items-center gap-3">
                    <ReceiptText className="h-6 w-6 text-cyan-400" />
                    <h2 className="text-2xl font-black">TopUp Summary</h2>
                  </div>

                  <div className="mt-5 space-y-4 border-t border-white/8 pt-5">
                    <SummaryRow label="Amount (USD)" value={numericAmount > 0 ? `$ ${numericAmount.toFixed(2)}` : "—"} />
                    <SummaryRow label="Conversion Rate" value="1 USD = 130 BDT" />
                    <SummaryRow
                      label="Total Amount (BDT)"
                      value={amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "—"}
                      strong
                    />
                    <div className="h-px bg-white/8" />
                    <SummaryRow label="Platform" value={PLATFORM_NAME} />
                    <SummaryRow
                      label="Payment Method"
                      value={selectedPayment?.available ? selectedPayment.title : "Not selected"}
                    />
                    <SummaryRow
                      label="Transaction ID"
                      value={transactionId.trim() ? transactionId.trim() : "Required"}
                    />
                  </div>
                </div>

                <div className="rounded-[24px] border border-emerald-400/15 bg-[linear-gradient(180deg,rgba(5,48,39,.44),rgba(4,20,22,.7))] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
                    <div>
                      <h3 className="text-xl font-black">Request Status</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        No persistent topup request has been sent yet.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <StatusLine label="Amount entered" complete={numericAmount > 0} />
                    <StatusLine label="Payment method selected" complete={Boolean(selectedPayment?.available)} />
                    <StatusLine label="Transaction ID entered" complete={Boolean(transactionId.trim())} />
                    <StatusLine label="Backend submission" complete={false} />
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#071524,#040d19)] p-5">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-1 h-6 w-6 text-sky-400" />
                    <div>
                      <h3 className="text-xl font-black">Need Help?</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        For payment or topup support, contact the developer directly.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/8801303498506"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-[16px] border border-sky-400/25 bg-sky-400/8 px-4 py-3 font-semibold text-sky-200"
                  >
                    Contact Support
                  </a>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {modalPayment?.available ? (
        <PaymentModal
          method={modalPayment.id}
          title={modalPayment.title}
          amountBdt={amountBdt}
          onClose={() => setPaymentModal(null)}
        />
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
    <section className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#071524,#040d19)] p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[255px_1fr] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0875ff,#20c8ff)] text-lg font-black shadow-[0_0_22px_rgba(0,159,255,.24)]">
            {number}
          </div>
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

function PaymentIcon({ method }: { method: Exclude<PaymentMethod, null> }) {
  if (method === "bank") return <Landmark className="h-7 w-7 text-white/55" />;
  if (method === "redot") return <BadgeDollarSign className="h-7 w-7 text-rose-400" />;
  if (method === "nagad") return <CircleDollarSign className="h-7 w-7 text-orange-400" />;
  return <WalletCards className="h-7 w-7 text-pink-400" />;
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
      <span className={strong ? "text-right text-lg font-black text-emerald-400" : "text-right font-semibold text-white/80"}>
        {value}
      </span>
    </div>
  );
}

function StatusLine({ label, complete }: { label: string; complete: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={[
          "grid h-6 w-6 place-items-center rounded-full border text-xs",
          complete
            ? "border-emerald-400/40 bg-emerald-400/12 text-emerald-300"
            : "border-white/10 bg-white/[0.03] text-white/30",
        ].join(" ")}
      >
        {complete ? "✓" : ""}
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
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-sky-400/20 bg-[linear-gradient(180deg,#07182a,#030b16)] p-5 shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-13 w-13 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <PaymentIcon method={method} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">Payment Instructions</div>
              <h2 className="mt-1 text-3xl font-black">{title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3 rounded-[20px] border border-white/10 bg-black/20 p-4">
          <InstructionRow label="Payment Number" value={PAYMENT_NUMBER} />
          <InstructionRow label="Method" value="Send Money Only" />
          <InstructionRow
            label="Amount"
            value={amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "Enter USD amount first"}
          />
          <InstructionRow label="Platform" value={PLATFORM_NAME} />
        </div>

        <div className="mt-5 rounded-[18px] border border-amber-400/20 bg-amber-400/7 p-4">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div className="text-sm leading-6 text-amber-100/75">
              <p className="font-bold text-amber-200">Important instructions</p>
              <ul className="mt-2 space-y-1">
                <li>• Use Send Money only.</li>
                <li>• Send the exact BDT amount shown above.</li>
                <li>• Keep the transaction ID after payment.</li>
                <li>• Transaction ID is mandatory in the form.</li>
                <li>• Uploading a payment screenshot is recommended.</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-[16px] bg-[linear-gradient(90deg,#0875ff,#20c8ff)] px-5 py-3.5 font-black text-white"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

function InstructionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[14px] border border-white/8 bg-white/[0.025] px-3 py-3 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="text-right font-black text-white/90">{value}</span>
    </div>
  );
}
