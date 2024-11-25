import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { isIos } from "@/lib/devices";

const LOCAL_STORAGE_NOTIFICATION_VARIANT_KEY =
  "mysterious-notification-variant";

export const notificationVariantAtom = isIos
  ? atom<NotificationVariant>("none")
  : atomWithStorage<NotificationVariant>(
      LOCAL_STORAGE_NOTIFICATION_VARIANT_KEY,
      "none",
      undefined,
      { getOnInit: true }
    );

type NotificationVariant = "sound" | "vibrate" | "none";
