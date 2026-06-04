import { useCallback, useEffect, useRef, useState } from "react";

interface UseShortcutConfirmOptions {
  timeout?: number;
  onConfirm: () => void;
  onArm?: () => void;
  onDisarm?: () => void;
}

interface UseShortcutConfirmReturn {
  trigger: () => void;
  isArmed: boolean;
  disarm: () => void;
}

export function useShortcutConfirm(opts: UseShortcutConfirmOptions): UseShortcutConfirmReturn {
  const { timeout = 2000, onConfirm, onArm, onDisarm } = opts;
  const [isArmed, setIsArmed] = useState(false);
  const armedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;
  const onArmRef = useRef(onArm);
  onArmRef.current = onArm;
  const onDisarmRef = useRef(onDisarm);
  onDisarmRef.current = onDisarm;

  const disarm = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (armedRef.current) {
      armedRef.current = false;
      setIsArmed(false);
      onDisarmRef.current?.();
    }
  }, []);

  const trigger = useCallback(() => {
    if (armedRef.current) {
      disarm();
      onConfirmRef.current();
    } else {
      armedRef.current = true;
      setIsArmed(true);
      onArmRef.current?.();
      timerRef.current = setTimeout(() => {
        armedRef.current = false;
        setIsArmed(false);
        timerRef.current = null;
        onDisarmRef.current?.();
      }, timeout);
    }
  }, [timeout, disarm]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { trigger, isArmed, disarm };
}
