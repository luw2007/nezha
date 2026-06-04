import { useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useI18n } from "../i18n";

export function useWindowCloseGuard(enabled: boolean) {
  const { t } = useI18n();
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let unlisten: (() => void) | null = null;

    getCurrentWindow()
      .onCloseRequested(async (event) => {
        const ok = await confirm(tRef.current("confirm.closeApp"), {
          title: tRef.current("confirm.closeAppTitle"),
          kind: "warning",
        });
        if (!ok) {
          event.preventDefault();
        }
      })
      .then((fn) => {
        if (cancelled) {
          fn();
        } else {
          unlisten = fn;
        }
      });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [enabled]);
}
