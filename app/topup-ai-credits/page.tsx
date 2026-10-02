"use client";

import { useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import styles from "./topup.module.css";

type PaymentMethod = "bkash" | "nagad" | "redot" | "bank" | null;

const RATE = 130;
const PAYMENT_NUMBER = "01303498506";
const PLATFORM = "My Jersey Ecosystem";

const paymentMethods = [
  {
    id: "bkash" as const,
    label: "Bkash",
    icon: "/topup-exact/bkash.png",
    available: true,
    instruction: "Send Money Only",
  },
  {
    id: "nagad" as const,
    label: "Nagad",
    icon: "/topup-exact/nagad.png",
    available: true,
    instruction: "Send Money Only",
  },
  {
    id: "redot" as const,
    label: "Redot Pay",
    icon: "/topup-exact/redot-pay.png",
    available: false,
    instruction: "Not available right now",
  },
  {
    id: "bank" as const,
    label: "Bank Transfer",
    icon: "/topup-exact/bank-transfer.png",
    available: false,
    instruction: "Not available right now",
  },
];

export default function TopupAiCreditsPage() {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const txnInput = useRef<HTMLInputElement | null>(null);

  const [amountUsd, setAmountUsd] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [popupMethod, setPopupMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);

  const usd = Number(amountUsd || 0);
  const bdt = useMemo(() => {
    if (!Number.isFinite(usd) || usd <= 0) return 0;
    return Math.round(usd * RATE);
  }, [usd]);

  const activeMethod = paymentMethods.find((item) => item.id === method) ?? null;
  const modalMethod = paymentMethods.find((item) => item.id === popupMethod) ?? null;

  const selectPayment = (id: Exclude<PaymentMethod, null>) => {
    const item = paymentMethods.find((entry) => entry.id === id);
    if (!item?.available) return;
    setMethod(id);
    setPopupMethod(id);
    setMessage(null);
  };

  const acceptScreenshot = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file for the payment screenshot." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Payment screenshot must be 5 MB or smaller." });
      return;
    }

    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
    setMessage(null);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    acceptScreenshot(event.dataTransfer.files?.[0]);
  };

  const validate = () => {
    if (!usd || usd <= 0) return "Enter a valid topup amount in USD.";
    if (!activeMethod?.available) return "Select Bkash or Nagad as your payment method.";
    if (!transactionId.trim()) return "Transaction ID is required.";
    return "";
  };

  const addCredit = () => {
    const error = validate();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    setMessage({
      type: "info",
      text: "Your payment details are complete. The persistent topup backend is not connected yet, so no request has been stored or marked as received.",
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.appShell}>
        <aside className={styles.sidebar}>
          <img src="/brand/jerseyos-logo.png" alt="JerseyOS" className={styles.brand} style={{ objectFit: "contain" }} />

          <nav className={styles.nav}>
            <NavItem href="/" icon="⌂">Dashboard</NavItem>
            <NavItem href="/image-to-vector" icon="♢">AI Jersey Design</NavItem>
            <NavItem href="/projects" icon="▣">My Designs</NavItem>
            <NavItem href="/" icon="✓">Templates</NavItem>
            <NavItem href="/projects" icon="⌑">My Orders</NavItem>
            <NavItem href="/topup-ai-credits" icon="▰" active>TopUp AI Credit</NavItem>
            <NavItem href="/topup-ai-credits" icon="≡">Transaction History</NavItem>
            <NavItem href="/upgrade" icon="◫">Subscription</NavItem>
            <NavItem href="/settings" icon="⚙">Settings</NavItem>
          </nav>

          <div className={styles.sidebarBottom}>
            <img src="/topup-exact/promo-card.png" alt="Powering the future of jersey design" className={styles.promoCard} />
            <img src="/topup-exact/ecosystem-card.png" alt="My Jersey Ecosystem" className={styles.ecosystemCard} />
          </div>
        </aside>

        <section className={styles.workspace}>
          <header className={styles.topbar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input aria-label="Search" placeholder="Search designs, templates, or anything..." />
              <kbd>Ctrl + K</kbd>
            </div>

            <div className={styles.topActions}>
              <button className={styles.iconButton} type="button" aria-label="Theme">☼</button>
              <button className={styles.iconButton} type="button" aria-label="Notifications">♧<span className={styles.notificationDot} /></button>
              <div className={styles.avatar}>M</div>
              <div className={styles.profileText}>
                <strong>JerseyOS</strong>
                <span>Creator</span>
              </div>
              <span className={styles.chevron}>⌄</span>
            </div>
          </header>

          <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
              <section className={styles.hero}>
                <div className={styles.heroTitleWrap}>
                  <img src="/topup-exact/ai-credit.png" alt="" className={styles.heroIcon} />
                  <div>
                    <h1>TopUp <span>AI Credit</span></h1>
                    <p>Top up your AI credits to continue creating amazing jersey designs in the My Jersey Ecosystem.</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <img src="/topup-exact/information.png" alt="" />
                  <p>AI credits are used for AI jersey generation, editing, and premium features across the <strong>My Jersey Ecosystem.</strong></p>
                </div>
              </section>

              <div className={styles.steps}>
                <StepCard
                  number="1"
                  icon="/topup-exact/amount-usd.png"
                  title="Enter Amount"
                  subtitle="Enter the amount you want to top up (USD)."
                >
                  <div className={styles.amountLayout}>
                    <label className={styles.amountField}>
                      <span className={styles.currencySign}>$</span>
                      <input
                        value={amountUsd}
                        onChange={(event) => {
                          setAmountUsd(event.target.value.replace(/[^\d.]/g, ""));
                          setMessage(null);
                        }}
                        inputMode="decimal"
                        placeholder="Enter amount"
                      />
                      <b>USD</b>
                    </label>

                    <div className={styles.rateBox}>
                      <img src="/topup-exact/convert.png" alt="" />
                      <div>
                        <span>Conversion Rate</span>
                        <strong>1 USD = 130 BDT</strong>
                      </div>
                    </div>
                  </div>
                </StepCard>

                <StepCard
                  number="2"
                  icon="/topup-exact/usd-bdt.png"
                  title="Converted Amount"
                  subtitle="Total amount in BDT (automatic calculation)."
                >
                  <div className={styles.convertedField}>
                    <img src="/topup-exact/usd-bdt.png" alt="" />
                    <strong>{bdt > 0 ? bdt.toLocaleString("en-US") : "0"}</strong>
                    <b>BDT</b>
                  </div>
                </StepCard>

                <StepCard
                  number="3"
                  icon="/topup-exact/platform.png"
                  title="Platform"
                  subtitle="Select platform to top up credit."
                >
                  <div className={styles.platformCard}>
                    <img src="/topup-exact/platform.png" alt="" />
                    <div>
                      <strong>{PLATFORM}</strong>
                      <span>Use AI credits across all My Jersey products</span>
                    </div>
                    <span className={styles.selectedTick}>✓</span>
                  </div>
                </StepCard>

                <StepCard
                  number="4"
                  icon="/topup-exact/payment-method.png"
                  title="Payment Method"
                  subtitle="Choose your preferred payment method."
                >
                  <div className={styles.paymentGrid}>
                    {paymentMethods.map((item) => {
                      const selected = method === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={!item.available}
                          onClick={() => selectPayment(item.id)}
                          className={[
                            styles.paymentCard,
                            selected ? styles.paymentSelected : "",
                            !item.available ? styles.paymentDisabled : "",
                          ].join(" ")}
                        >
                          {selected ? <span className={styles.miniTick}>✓</span> : null}
                          <img src={item.icon} alt="" />
                          <strong>{item.label}</strong>
                          {!item.available ? <small>Unavailable</small> : null}
                        </button>
                      );
                    })}
                  </div>
                </StepCard>

                <StepCard
                  number="5"
                  icon="/topup-exact/transaction-id.png"
                  title="Transaction Details"
                  subtitle="Provide your payment information."
                >
                  <div className={styles.transactionGrid}>
                    <label className={styles.txnBlock}>
                      <span>Submit Transaction ID <em>*</em></span>
                      <div className={styles.txnInput}>
                        <img src="/topup-exact/transaction-id.png" alt="" />
                        <input
                          ref={txnInput}
                          value={transactionId}
                          onChange={(event) => {
                            setTransactionId(event.target.value);
                            setMessage(null);
                          }}
                          placeholder="Enter your transaction ID"
                        />
                      </div>
                    </label>

                    <div className={styles.txnBlock}>
                      <span>Upload Payment Screenshot</span>
                      <button
                        type="button"
                        className={styles.uploadBox}
                        onClick={() => fileInput.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                      >
                        <img src="/topup-exact/upload-file.png" alt="" />
                        <div>
                          <strong>{screenshot ? screenshot.name : "Click to upload or drag and drop"}</strong>
                          <small>PNG, JPG, JPEG (Max 5MB)</small>
                        </div>
                      </button>
                      <input
                        ref={fileInput}
                        className={styles.hiddenInput}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => acceptScreenshot(event.target.files?.[0])}
                      />
                    </div>
                  </div>

                  {screenshotPreview ? (
                    <div className={styles.previewWrap}>
                      <img src={screenshotPreview} alt="Payment screenshot preview" />
                    </div>
                  ) : null}
                </StepCard>

                <StepCard
                  number="6"
                  icon="/topup-exact/add-credit.png"
                  title="Add Credit"
                  subtitle="Review your details and submit your request."
                >
                  <button type="button" className={styles.addCreditButton} onClick={addCredit}>
                    <span>➤</span> Add Credit
                  </button>

                  {message ? (
                    <div className={message.type === "error" ? styles.errorMessage : styles.infoMessage}>
                      {message.text}
                    </div>
                  ) : null}
                </StepCard>
              </div>
            </div>

            <aside className={styles.rightColumn}>
              <Panel title="TopUp Summary" icon="/topup-exact/payment-method.png">
                <div className={styles.summaryRows}>
                  <SummaryRow label="Amount (USD)" value={usd > 0 ? `$ ${usd.toFixed(2)}` : "—"} />
                  <SummaryRow label="Conversion Rate" value="1 USD = 130 BDT" />
                  <SummaryRow label="Total Amount (BDT)" value={bdt > 0 ? `${bdt.toLocaleString("en-US")} BDT` : "—"} accent />
                  <hr />
                  <SummaryRow label="Platform" value={PLATFORM} />
                  <SummaryRow
                    label="Payment Method"
                    value={activeMethod?.available ? activeMethod.label : "Not selected"}
                    icon={activeMethod?.available ? activeMethod.icon : undefined}
                  />
                </div>
              </Panel>

              <section className={`${styles.panel} ${styles.statusPanel}`}>
                <div className={styles.statusHeader}>
                  <img src="/topup-exact/pending.png" alt="" />
                  <div>
                    <h2>Request Status</h2>
                    <p>No topup request has been submitted yet.</p>
                  </div>
                </div>

                <div className={styles.timeline}>
                  <TimelineItem title="Awaiting Submission" text="Complete the required payment information." active={false} />
                  <TimelineItem title="Under Review" text="This starts only after a real request is received." active={false} />
                  <TimelineItem title="Credit Update" text="Credit status will update after backend verification." active={false} />
                </div>
              </section>

              <Panel title="Need Help?" icon="/topup-exact/help-support.png">
                <p className={styles.helpText}>Facing any issue with payment or top up? Contact our support team.</p>
                <a className={styles.supportButton} href="https://wa.me/8801303498506" target="_blank" rel="noreferrer">
                  <span>◉</span> Contact Support <b>→</b>
                </a>
              </Panel>
            </aside>
          </div>
          <div style={{ marginTop: 18, padding: "12px 0", textAlign: "center", fontSize: 12, opacity: 0.45 }}>
            Copyright 2027- 2028 @ My Jersey
          </div>
        </section>
      </div>

      {modalMethod?.available ? (
        <PaymentModal
          method={modalMethod.id}
          title={modalMethod.label}
          icon={modalMethod.icon}
          amountBdt={bdt}
          onClose={() => setPopupMethod(null)}
          onCompleted={() => {
            setPopupMethod(null);
            requestAnimationFrame(() => txnInput.current?.focus());
          }}
        />
      ) : null}
    </main>
  );
}

function NavItem({
  href,
  icon,
  active = false,
  children,
}: {
  href: string;
  icon: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <a href={href} className={`${styles.navItem} ${active ? styles.navActive : ""}`}>
      <span className={styles.navIcon}>{icon}</span>
      <span>{children}</span>
    </a>
  );
}

function StepCard({
  number,
  icon,
  title,
  subtitle,
  children,
}: {
  number: string;
  icon: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.stepCard}>
      <div className={styles.stepNumber}>{number}</div>

      <div className={styles.stepLabel}>
        <img src={icon} alt="" />
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className={styles.stepBody}>{children}</div>
    </section>
  );
}

function Panel({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelTitle}>
        <img src={icon} alt="" />
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  icon?: string;
}) {
  return (
    <div className={styles.summaryRow}>
      <span>{label}</span>
      <strong className={accent ? styles.summaryAccent : ""}>
        {icon ? <img src={icon} alt="" /> : null}
        {value}
      </strong>
    </div>
  );
}

function TimelineItem({ title, text, active }: { title: string; text: string; active: boolean }) {
  return (
    <div className={styles.timelineItem}>
      <span className={`${styles.timelineDot} ${active ? styles.timelineDotActive : ""}`} />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function PaymentModal({
  method,
  title,
  icon,
  amountBdt,
  onClose,
  onCompleted,
}: {
  method: "bkash" | "nagad";
  title: string;
  icon: string;
  amountBdt: number;
  onClose: () => void;
  onCompleted: () => void;
}) {
  const [copied, setCopied] = useState<"number" | "amount" | null>(null);
  const amountText = amountBdt > 0 ? `${amountBdt.toLocaleString("en-US")} BDT` : "Enter USD amount first";

  const copyText = async (value: string, field: "number" | "amount") => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const element = document.createElement("textarea");
        element.value = value;
        document.body.appendChild(element);
        element.select();
        document.execCommand("copy");
        element.remove();
      }
      setCopied(field);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-label={`${title} payment details`}>
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close payment details">×</button>

        <header className={styles.modalHeader}>
          <div className={styles.modalBrand}>
            <img src={icon} alt="" />
            <span>{title}</span>
          </div>
          <div>
            <h2>Payment Method <span>Details</span></h2>
            <p>You have selected <strong>{title} Send Money</strong> as your payment method.</p>
          </div>
        </header>

        <div className={styles.modalValueRows}>
          <ModalValue
            icon="/topup-exact/payment-method.png"
            label="Account Number"
            helper={`Send money to this ${title} number`}
            value={PAYMENT_NUMBER}
            copied={copied === "number"}
            onCopy={() => copyText(PAYMENT_NUMBER, "number")}
          />
          <ModalValue
            icon="/topup-exact/usd-bdt.png"
            label="Amount"
            helper="Send this exact amount"
            value={amountText}
            copied={copied === "amount"}
            onCopy={() => copyText(amountText, "amount")}
          />
        </div>

        <section className={styles.instructions}>
          <div className={styles.instructionsContent}>
            <div className={styles.instructionsHeading}>
              <img src="/topup-exact/information.png" alt="" />
              <div>
                <h3>Payment Instructions</h3>
                <p>Please follow the steps below to complete your payment via {title}.</p>
              </div>
            </div>

            <ol>
              <li><span>1</span>Go to your payment app.</li>
              <li><span>2</span>Choose “Send Money”.</li>
              <li><span>3</span>Copy the account number and amount.</li>
              <li><span>4</span>Complete the payment.</li>
              <li><span>5</span>Copy the Txn ID and place it in the submission field.</li>
            </ol>
          </div>

          <img src="/topup-exact/payment-phone.png" alt="" className={styles.phoneIllustration} />
        </section>

        <section className={styles.afterPayment}>
          <img src="/topup-exact/submit-txn.png" alt="" />
          <div>
            <strong>After payment, submit your transaction ID and upload your screenshot.</strong>
            <span>The payment will remain unverified until your backend verification flow is connected.</span>
          </div>
          <div className={styles.uploadHint}>
            <img src="/topup-exact/upload-file.png" alt="" />
            <div>
              <strong>Upload Screenshot</strong>
              <span>PNG, JPG, JPEG (Max 5MB)</span>
            </div>
          </div>
        </section>

        <div className={styles.disclaimerBox}>
          <strong>Important</strong>
          <span>Use Send Money only.</span>
          <span>Send the exact amount shown above.</span>
          <span>Transaction ID is mandatory.</span>
          <span>Do not treat this screen as payment verification.</span>
        </div>

        <footer className={styles.modalFooter}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>Close</button>
          <button type="button" className={styles.primaryButton} onClick={onCompleted}>➤ I Have Completed the Payment</button>
        </footer>
      </section>
    </div>
  );
}

function ModalValue({
  icon,
  label,
  helper,
  value,
  copied,
  onCopy,
}: {
  icon: string;
  label: string;
  helper: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className={styles.modalValueRow}>
      <img src={icon} alt="" />
      <div className={styles.modalValueLabel}>
        <strong>{label}</strong>
        <span>{helper}</span>
      </div>
      <div className={styles.modalValueBox}>{value}</div>
      <button type="button" onClick={onCopy}>
        <img src="/topup-exact/copy.png" alt="" />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
