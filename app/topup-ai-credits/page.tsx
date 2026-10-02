"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";

type PaymentMethod = "bkash" | "nagad" | "redot" | "bank" | null;

const CONVERSION_RATE = 130;
const PAYMENT_NUMBER = "01303498506";
const PLATFORM_NAME = "My Jersey Ecosystem";

const methods = [
  {
    id: "bkash" as const,
    title: "Bkash",
    subtitle: "Send Money Only",
    available: true,
    icon: "/topup/icons/bkash.svg",
    card: "border-pink-400/30 from-pink-500/22 via-fuchsia-500/12 to-[#071426]",
  },
  {
    id: "nagad" as const,
    title: "Nagad",
    subtitle: "Send Money Only",
    available: true,
    icon: "/topup/icons/nagad.svg",
    card: "border-orange-400/30 from-orange-500/22 via-amber-500/12 to-[#071426]",
  },
  {
    id: "redot" as const,
    title: "Redot Pay",
    subtitle: "Not available right now",
    available: false,
    icon: "/topup/icons/redot.svg",
    card: "border-white/10 from-rose-500/10 via-rose-500/5 to-[#071426]",
  },
  {
    id: "bank" as const,
    title: "Bank Transfer",
    subtitle: "Not available right now",
    available: false,
    icon: "/topup/icons/bank.svg",
    card: "border-white/10 from-sky-500/10 via-slate-500/5 to-[#071426]",
  },
];

export default function TopupAiCreditsPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [amountUsd, setAmountUsd] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [popupMethod, setPopupMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const usd = Number(amountUsd || 0);
  const amountBdt = useMemo(() => {
    if (!Number.isFinite(usd) || usd <= 0) return 0;
    return Math.round(usd * CONVERSION_RATE);
  }, [usd]);

  const activeMethod = methods.find((item) => item.id === paymentMethod) ?? null;
  const modalMethod = methods.find((item) => item.id === popupMethod) ?? null;

  const selectMethod = (id: Exclude<PaymentMethod, null>) => {
    const item = methods.find((method) => method.id === id);
    if (!item?.available) return;
    setPaymentMethod(id);
    setPopupMethod(id);
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
      setError("Please upload an image file for the payment screenshot.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Payment screenshot must be 5 MB or smaller.");
      return;
    }

    setScreenshot(file);
    setError("");
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const submitRequest = () => {
    if (!usd || usd <= 0) {
      setError("Enter a valid topup amount in USD.");
      setNotice("");
      return;
    }
    if (!activeMethod?.available) {
      setError("Choose Bkash or Nagad as the payment method.");
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
      "All required topup information is ready. A persistent payment backend is not connected yet, so the request has not been stored or submitted automatically."
    );
  };

  return (
    <main
      className="min-h-screen bg-[#020812] text-white"
      style={{
        backgroundImage:
          'linear-gradient(rgba(2,8,18,.84),rgba(2,8,18,.92)),url("/topup/topup-bg.svg")',
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto grid max-w-[1820px] gap-5 px-4 py-5 lg:grid-cols-[250px_1fr]">
        <aside className="hidden h-[calc(100vh-40px)] sticky top-5 overflow-hidden rounded-[28px] border border-sky-400/14 bg-[linear-gradient(180deg,rgba(5,18,35,.94),rgba(3,10,22,.97))] p-4 shadow-[0_28px_90px_rgba(0,0,0,.34)] backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3 rounded-[20px] border border-sky-400/12 bg-white/[0.025] p-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] font-black shadow-[0_12px_30px_rgba(0,145,255,.22)]">
              MJ
            </div>
            <div>
              <div className="font-black">My Jersey Studio</div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-sky-300/70">AI Credit Topup</div>
            </div>
          </div>

          <nav className="mt-5 space-y-1.5 text-sm">
            <Nav href="/" label="Dashboard" />
            <Nav href="/image-to-vector" label="Image to Vector" />
            <Nav href="/oneclick-creation" label="OneClick Creation" />
            <Nav href="/file-converter" label="File Converter" />
            <Nav href="/topup-ai-credits" label="TopUp AI Credit" active />
            <Nav href="/about-us" label="About Us" />
          </nav>

          <div className="mt-auto rounded-[22px] border border-cyan-400/14 bg-[linear-gradient(180deg,rgba(0,157,255,.08),rgba(0,157,255,.02))] p-4">
            <img src="/topup/icons/ai-credit.svg" alt="" className="h-16 w-16" />
            <div className="mt-3 font-black">AI Credit Center</div>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Real payment details only. No fake balance, history, or approval status.
            </p>
          </div>
        </aside>

        <div>
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-sky-400/12 bg-[linear-gradient(180deg,rgba(5,18,35,.88),rgba(3,10,22,.9))] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,.26)] backdrop-blur-xl">
            <a href="/" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06]">
              ← Dashboard
            </a>
            <div className="flex items-center gap-3">
              <img src="/topup/icons/ai-credit.svg" alt="" className="h-11 w-11" />
              <div className="text-right">
                <div className="font-black">My Jersey Ecosystem</div>
                <div className="text-xs text-white/40">Secure AI Credit Topup</div>
              </div>
            </div>
          </header>

          <section className="mt-4 grid gap-5 xl:grid-cols-[1.55fr_.78fr]">
            <div className="space-y-4">
              <section className="rounded-[28px] border border-sky-400/16 bg-[linear-gradient(120deg,rgba(6,27,54,.95),rgba(3,12,25,.97))] p-5 shadow-[0_22px_60px_rgba(0,0,0,.24)] backdrop-blur-xl">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex items-start gap-4">
                    <img src="/topup/icons/ai-credit.svg" alt="" className="h-16 w-16 shrink-0" />
                    <div>
                      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        TopUp AI <span className="text-cyan-400">Credit</span>
                      </h1>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-white/58">
                        Top up your AI credits to continue creating, editing, and using supported AI tools across the My Jersey Ecosystem.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-[390px] rounded-[20px] border border-sky-400/24 bg-[linear-gradient(180deg,rgba(2,31,58,.88),rgba(2,18,35,.88))] p-4 text-sm leading-6 text-white/65">
                    <div className="font-black text-cyan-300">AI Credit Information</div>
                    <p className="mt-1">Credits are used only by supported AI-powered design and generation workflows.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <TopChip icon="/topup/icons/amount.svg" title="Amount (USD)" subtitle="Choose topup amount" />
                  <TopChip icon="/topup/icons/convert.svg" title="USD to BDT" subtitle="1 USD = 130 BDT" />
                  <TopChip icon="/topup/icons/payment.svg" title="Payment Method" subtitle="Bkash / Nagad" />
                  <TopChip icon="/topup/icons/txn.svg" title="Submit Txn ID" subtitle="Mandatory" />
                </div>
              </section>

              <Step number="1" title="Enter Amount" subtitle="Enter the amount you want to top up (USD)." icon="/topup/icons/amount.svg">
                <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
                  <label className="flex h-16 items-center overflow-hidden rounded-[17px] border border-sky-400/14 bg-[#071524]">
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
                      className="h-full min-w-0 flex-1 bg-transparent px-5 text-lg font-semibold text-white outline-none placeholder:text-white/22"
                    />
                    <span className="px-5 text-sm font-bold text-white/45">USD</span>
                  </label>

                  <div className="rounded-[17px] border border-cyan-400/18 bg-cyan-400/6 px-4 py-3">
                    <div className="text-xs font-bold uppercase tracking-[.12em] text-cyan-300">Conversion Rate</div>
                    <div className="mt-2 text-2xl font-black text-emerald-400">1 USD = 130 BDT</div>
                  </div>
                </div>
              </Step>

              <Step number="2" title="Converted Amount" subtitle="Automatic BDT calculation." icon="/topup/icons/convert.svg">
                <div className="flex h-16 items-center justify-between rounded-[17px] border border-sky-400/12 bg-[#071524] px-5">
                  <span className="text-3xl font-black">{amountBdt > 0 ? amountBdt.toLocaleString("en-US") : "0"}</span>
                  <span className="text-sm font-bold text-white/45">BDT</span>
                </div>
              </Step>

              <Step number="3" title="Platform" subtitle="Selected AI credit platform." icon="/topup/icons/platform.svg">
                <div className="flex items-center justify-between rounded-[18px] border border-sky-400/24 bg-[linear-gradient(90deg,rgba(8,127,255,.12),rgba(0,200,255,.04))] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src="/topup/icons/platform.svg" alt="" className="h-12 w-12" />
                    <div>
                      <div className="font-black">{PLATFORM_NAME}</div>
                      <div className="text-xs text-white/45">AI credits across supported My Jersey products</div>
                    </div>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">✓</span>
                </div>
              </Step>

              <Step number="4" title="Payment Method" subtitle="Choose an available payment method." icon="/topup/icons/payment.svg">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {methods.map((method) => {
                    const selected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        disabled={!method.available}
                        onClick={() => selectMethod(method.id)}
                        className={[
                          "relative overflow-hidden rounded-[20px] border bg-gradient-to-br p-4 text-left transition",
                          method.card,
                          method.available ? "hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,.22)]" : "cursor-not-allowed opacity-45",
                          selected ? "ring-2 ring-sky-400/70" : "",
                        ].join(" ")}
                      >
                        <img src={method.icon} alt="" className="h-16 w-16" />
                        <div className="mt-3 text-xl font-black">{method.title}</div>
                        <div className="mt-1 text-xs text-white/50">{method.subtitle}</div>
                        <div className="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-white/35">
                          {method.available ? "Click to view details" : "Unavailable"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Step>

              <Step number="5" title="Transaction Details" subtitle="Transaction ID must be submitted." icon="/topup/icons/txn.svg">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/80">
                      Submit Transaction ID <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex h-14 items-center gap-3 rounded-[17px] border border-sky-400/12 bg-[#071524] px-4">
                      <img src="/topup/icons/txn.svg" alt="" className="h-8 w-8" />
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/80">Upload Payment Screenshot</label>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex min-h-14 w-full items-center justify-center gap-3 rounded-[17px] border border-dashed border-sky-400/25 bg-sky-400/5 px-4 py-3 text-sm text-white/60"
                    >
                      <img src="/topup/icons/screenshot.svg" alt="" className="h-8 w-8" />
                      {screenshot ? screenshot.name : "Click to upload payment screenshot"}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => handleScreenshot(e.target.files?.[0] || null)}
                    />
                    <p className="mt-2 text-xs text-white/35">PNG, JPG, WEBP • Max 5 MB</p>
                    {screenshotPreview ? (
                      <div className="mt-3 overflow-hidden rounded-[15px] border border-white/10 bg-black/20 p-2">
                        <img src={screenshotPreview} alt="Payment screenshot preview" className="max-h-44 w-full rounded-xl object-contain" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </Step>

              <Step number="6" title="Add Credit" subtitle="Validate required information." icon="/topup/icons/ai-credit.svg">
                <button
                  type="button"
                  onClick={submitRequest}
                  className="w-full rounded-[18px] bg-[linear-gradient(90deg,#0a7cff,#29d4ff)] px-5 py-4 text-lg font-black shadow-[0_16px_34px_rgba(0,145,255,.23)]"
                >
                  Add Credit
                </button>

                {error ? <Message tone="error">{error}</Message> : null}
                {notice ? <Message tone="notice">{notice}</Message> : null}
              </Step>
            </div>

            <aside className="space-y-4">
              <SideCard title="TopUp Summary" icon="/topup/icons/payment.svg">
                <div className="space-y-4 border-t border-white/8 pt-5">
                  <Summary label="Amount (USD)" value={usd > 0 ? `$ ${usd.toFixed(2)}` : "—"} />
                  <Summary label="Conversion Rate" value="1 USD = 130 BDT" />
                  <Summary label="Total Amount (BDT)" value={amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "—"} strong />
                  <div className="h-px bg-white/8" />
                  <Summary label="Platform" value={PLATFORM_NAME} />
                  <Summary label="Payment Method" value={activeMethod?.available ? activeMethod.title : "Not selected"} />
                  <Summary label="Transaction ID" value={transactionId.trim() ? transactionId.trim() : "Required"} />
                </div>
              </SideCard>

              <SideCard title="Request Status" icon="/topup/icons/status.svg" green>
                <p className="text-sm leading-6 text-white/50">No topup request has been submitted yet.</p>
                <div className="mt-5 space-y-3">
                  <Status label="Amount entered" ok={usd > 0} />
                  <Status label="Payment method selected" ok={Boolean(activeMethod?.available)} />
                  <Status label="Transaction ID entered" ok={Boolean(transactionId.trim())} />
                  <Status label="Backend submission" ok={false} />
                </div>
              </SideCard>

              <SideCard title="Need Help?" icon="/topup/icons/help.svg">
                <p className="text-sm leading-6 text-white/55">
                  Payment support: WhatsApp 01303498506
                </p>
                <a
                  href="https://wa.me/8801303498506"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded-[15px] border border-sky-400/20 bg-sky-400/7 px-4 py-3 text-center text-sm font-bold text-sky-200"
                >
                  Contact Support
                </a>
              </SideCard>
            </aside>
          </section>
        </div>
      </div>

      {modalMethod?.available ? (
        <PaymentPopup
          method={modalMethod.id}
          title={modalMethod.title}
          icon={modalMethod.icon}
          amountBdt={amountBdt}
          onClose={() => setPopupMethod(null)}
        />
      ) : null}
    </main>
  );
}

function Nav({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={[
        "block rounded-[14px] px-4 py-3 font-semibold transition",
        active ? "bg-[linear-gradient(90deg,#0a7cff,#1598ff)] text-white shadow-[0_10px_24px_rgba(0,145,255,.2)]" : "text-white/62 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function TopChip({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[17px] border border-sky-400/12 bg-[linear-gradient(180deg,rgba(5,20,38,.92),rgba(3,11,23,.92))] px-3 py-3">
      <img src={icon} alt="" className="h-10 w-10" />
      <div>
        <div className="text-sm font-black">{title}</div>
        <div className="text-xs text-white/42">{subtitle}</div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  subtitle,
  icon,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,20,35,.97),rgba(4,13,24,.97))] p-5 shadow-[0_14px_38px_rgba(0,0,0,.17)] backdrop-blur-xl">
      <div className="grid gap-5 lg:grid-cols-[270px_1fr] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-lg font-black">{number}</div>
          <div className="flex items-start gap-3">
            <img src={icon} alt="" className="h-10 w-10 shrink-0" />
            <div>
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-1 text-xs leading-5 text-white/43">{subtitle}</p>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function SideCard({
  title,
  icon,
  children,
  green = false,
}: {
  title: string;
  icon: string;
  children: ReactNode;
  green?: boolean;
}) {
  return (
    <section className={[
      "rounded-[24px] border p-5 shadow-[0_14px_38px_rgba(0,0,0,.17)] backdrop-blur-xl",
      green ? "border-emerald-400/15 bg-[linear-gradient(180deg,rgba(5,48,39,.48),rgba(4,18,20,.76))]" : "border-white/10 bg-[linear-gradient(180deg,rgba(7,20,35,.97),rgba(4,13,24,.97))]",
    ].join(" ")}>
      <div className="flex items-center gap-3">
        <img src={icon} alt="" className="h-11 w-11" />
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Summary({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-white/43">{label}</span>
      <span className={strong ? "text-right text-lg font-black text-emerald-400" : "text-right font-semibold text-white/84"}>{value}</span>
    </div>
  );
}

function Status({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={[
        "grid h-6 w-6 place-items-center rounded-full border text-xs",
        ok ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[0.03] text-white/25",
      ].join(" ")}>
        {ok ? "✓" : ""}
      </span>
      <span className={ok ? "text-white/75" : "text-white/38"}>{label}</span>
    </div>
  );
}

function Message({ children, tone }: { children: ReactNode; tone: "error" | "notice" }) {
  return (
    <div className={[
      "mt-4 rounded-[16px] border px-4 py-3 text-sm leading-6",
      tone === "error" ? "border-rose-400/22 bg-rose-500/7 text-rose-100" : "border-amber-400/20 bg-amber-400/7 text-amber-100",
    ].join(" ")}>
      {children}
    </div>
  );
}

function PaymentPopup({
  method,
  title,
  icon,
  amountBdt,
  onClose,
}: {
  method: "bkash" | "nagad";
  title: string;
  icon: string;
  amountBdt: number;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<"number" | "amount" | null>(null);
  const amountText = amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "Enter USD amount first";

  const copy = async (text: string, field: "number" | "amount") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 p-4 backdrop-blur-md">
      <div className="w-full max-w-[690px] overflow-hidden rounded-[26px] border border-cyan-400/30 bg-[linear-gradient(180deg,#061729,#030b16)] shadow-[0_0_0_1px_rgba(0,196,255,.06),0_35px_120px_rgba(0,0,0,.66),0_0_45px_rgba(0,183,255,.13)]">
        <div className="flex items-start justify-between gap-4 border-b border-sky-400/14 bg-[radial-gradient(circle_at_top_left,rgba(0,174,255,.12),transparent_42%),rgba(4,18,35,.92)] px-5 py-4">
          <div className="flex items-center gap-4">
            <img src={icon} alt="" className="h-16 w-16" />
            <div>
              <h2 className="text-3xl font-black">Payment Method <span className="text-cyan-400">Details</span></h2>
              <p className="mt-1 text-sm text-white/58">
                Selected: <span className="font-bold text-cyan-300">{title} Send Money</span>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-white/65">×</button>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <PopupValue
              icon="/topup/icons/payment.svg"
              label="Account Number"
              hint={`Send money to this ${title} number`}
              value={PAYMENT_NUMBER}
              copied={copied === "number"}
              onCopy={() => copy(PAYMENT_NUMBER, "number")}
            />
            <PopupValue
              icon="/topup/icons/convert.svg"
              label="Amount"
              hint="Send this exact amount"
              value={amountText}
              copied={copied === "amount"}
              onCopy={() => copy(amountText, "amount")}
            />
          </div>

          <div className="mt-3 rounded-[20px] border border-sky-400/22 bg-[linear-gradient(180deg,rgba(0,125,255,.08),rgba(3,16,30,.88))] p-4">
            <div className="flex items-start gap-3">
              <img src="/topup/icons/ai-credit.svg" alt="" className="h-11 w-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-black text-cyan-300">Payment Instructions</h3>
                <p className="mt-1 text-xs text-white/48">Complete the payment via {title} using the steps below.</p>
                <div className="mt-3 grid gap-2">
                  <Instruction n="1" text="Go to your payment app." />
                  <Instruction n="2" text='Choose "Send Money".' />
                  <Instruction n="3" text="Copy the account number and the exact amount." />
                  <Instruction n="4" text="Complete the payment." />
                  <Instruction n="5" text="Copy the Txn ID and place it in the submission field." />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[18px] border border-amber-400/20 bg-amber-400/[0.06] p-4">
            <div className="text-xs font-black uppercase tracking-[.18em] text-amber-200">Important</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Disclaimer text="Use Send Money only." />
              <Disclaimer text="Send the exact BDT amount shown above." />
              <Disclaimer text="Transaction ID is mandatory." />
              <Disclaimer text="Upload payment screenshot if available." />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onClose} className="flex-1 rounded-[16px] border border-white/12 bg-white/[0.03] px-4 py-3.5 font-black text-white/85">
              Close
            </button>
            <button type="button" onClick={onClose} className="flex-[1.35] rounded-[16px] bg-[linear-gradient(90deg,#0a7cff,#29d4ff)] px-4 py-3.5 font-black shadow-[0_14px_28px_rgba(0,145,255,.2)]">
              I Have Completed the Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupValue({
  icon,
  label,
  hint,
  value,
  copied,
  onCopy,
}: {
  icon: string;
  label: string;
  hint: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-[18px] border border-sky-400/14 bg-[#071321] p-3.5">
      <div className="flex items-center gap-3">
        <img src={icon} alt="" className="h-10 w-10" />
        <div>
          <div className="font-black">{label}</div>
          <div className="text-[11px] text-white/42">{hint}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.025] p-2.5">
        <div className="min-w-0 flex-1 truncate px-2 text-lg font-black">{value}</div>
        <button type="button" onClick={onCopy} className="shrink-0 rounded-xl border border-sky-400/20 bg-sky-400/7 px-3 py-2 text-xs font-bold text-sky-200">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function Instruction({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[13px] border border-white/8 bg-white/[0.025] px-3 py-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0a7cff,#29d4ff)] text-xs font-black">{n}</span>
      <span className="text-sm text-white/78">{text}</span>
    </div>
  );
}

function Disclaimer({ text }: { text: string }) {
  return <div className="rounded-[13px] border border-amber-300/12 bg-black/15 px-3 py-2.5 text-xs leading-5 text-amber-100/78">{text}</div>;
}
