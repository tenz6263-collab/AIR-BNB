import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../api/client';
import styles from './Modals.module.css';

const REASONS = [
  "It's inaccurate or incorrect",
  "It's not a real place to stay",
  "It's a scam",
  "It's offensive",
  'Something else',
];

/** Compose a message to the host; stored through the API. */
export function MessageHostModal({ open, slug, host, onClose, onSent }) {
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const send = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.sendMessage(slug, body);
      setBody('');
      onSent();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} label={`Message ${host.name}`} title="Message host" width={560}>
      <form onSubmit={send}>
        <div className={styles.summary}>
          <img src={host.avatar} alt="" className={styles.avatar} />
          <div>
            <div className={styles.summaryTitle}>{host.name}</div>
            <div className={styles.muted}>
              {host.details[0]} · {host.details[1]}
            </div>
          </div>
        </div>
        <label className={styles.label} htmlFor="hostMessage">
          Your message
        </label>
        <textarea
          id="hostMessage"
          className={styles.textarea}
          rows={6}
          placeholder="Hi Mirashya Homes, I'm interested in your place…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={2}
        />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.primary} disabled={busy || body.trim().length < 2}>
          {busy ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </Modal>
  );
}

/** Pick a reason and describe the problem; stored through the API. */
export function ReportModal({ open, slug, onClose, onSent }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const send = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.reportListing(slug, reason, body || reason);
      setBody('');
      onSent();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} label="Report this listing" title="Report this listing" width={560}>
      <form onSubmit={send}>
        <h2 className={styles.h2}>Why are you reporting this listing?</h2>
        <p className={styles.muted}>This won&apos;t be shared with the host.</p>
        <div className={styles.radios} role="radiogroup" aria-label="Reason">
          {REASONS.map((r) => (
            <label key={r} className={styles.radio}>
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
        <label className={styles.label} htmlFor="reportBody">
          Tell us more (optional)
        </label>
        <textarea
          id="reportBody"
          className={styles.textarea}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </Modal>
  );
}
