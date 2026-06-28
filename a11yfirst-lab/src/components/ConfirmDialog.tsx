import { useEffect, useRef, type KeyboardEvent } from 'react';
import { getFocusableElements } from '../a11y/focusManagement';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Anuluj',
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (typeof dialog.showModal === 'function' && !dialog.open) {
        dialog.showModal();
      }
      cancelRef.current?.focus();
      return;
    }

    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    }
    previousFocusRef.current?.focus();
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) {
      return;
    }

    const focusable = getFocusableElements(dialogRef.current);
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      aria-labelledby="confirm-dialog-heading"
      className="confirm-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onKeyDown={handleKeyDown}
      open={open && typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal}
      ref={dialogRef}
    >
      <h2 id="confirm-dialog-heading">{title}</h2>
      <p>{description}</p>
      <div className="action-row">
        <Button ref={cancelRef} onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
