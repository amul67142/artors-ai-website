"use client";

import { useEffect, useRef } from "react";
import LeadForm from "./LeadForm";
import s from "./lead.module.css";

/**
 * The consultation popup, mounted once in the layout.
 *
 * Every CTA on the site opens it: a document-level click listener
 * intercepts any anchor pointing at /contact, so Server Components
 * keep rendering plain links (which still work without JS and for
 * crawlers) and no button needs to become a client component. The
 * dialog element gives focus trapping and Escape for free.
 */
export default function LeadModal() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement).closest?.('a[href="/contact"]');
      if (!a) return;
      e.preventDefault();
      ref.current?.showModal();
    };
    // Capture phase: our preventDefault must land before next/link's own
    // click handler on the anchor, which respects defaultPrevented.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Close when clicking the backdrop (the dialog itself, not its children).
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) ref.current?.close();
  };

  return (
    <dialog ref={ref} className={s.dialog} onClick={onDialogClick} aria-labelledby="lead-title">
      <div className={s.panel}>
        <div className={s.panelHead}>
          <div>
            <p className={s.kicker}>Free strategy call</p>
            <h2 id="lead-title" className={s.title}>
              Tell us the number you want moved.
            </h2>
          </div>
          <button
            type="button"
            className={s.close}
            aria-label="Close"
            onClick={() => ref.current?.close()}
          >
            <svg viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>
        <LeadForm />
      </div>
    </dialog>
  );
}
