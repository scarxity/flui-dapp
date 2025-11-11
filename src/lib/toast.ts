import toast from "react-hot-toast";

// Track last toast time per message to prevent duplicates
const lastToastTime = new Map<string, number>();
const COOLDOWN_MS = 2000; // 2 seconds cooldown

/**
 * Show success toast with cooldown to prevent spam
 */
export function showSuccessToast(message: string) {
  const now = Date.now();
  const lastTime = lastToastTime.get(message) || 0;

  if (now - lastTime < COOLDOWN_MS) {
    // Skip if same message was shown recently
    return;
  }

  lastToastTime.set(message, now);
  toast.success(message);
}

/**
 * Show error toast with cooldown to prevent spam
 */
export function showErrorToast(message: string) {
  const now = Date.now();
  const lastTime = lastToastTime.get(message) || 0;

  if (now - lastTime < COOLDOWN_MS) {
    // Skip if same message was shown recently
    return;
  }

  lastToastTime.set(message, now);
  toast.error(message);
}

/**
 * Show loading toast (no cooldown needed for loading states)
 */
export function showLoadingToast(message: string) {
  return toast.loading(message);
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  toast.dismiss();
}
