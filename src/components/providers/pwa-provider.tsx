"use client";

import { useEffect } from "react";

const VERSION_ENDPOINT = "/api/version";
const VERSION_POLL_INTERVAL_MS = 60_000;

type VersionResponse = {
  version?: string;
};

async function fetchAppVersion() {
  const response = await fetch(VERSION_ENDPOINT, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch app version: ${response.status}`);
  }

  const payload = (await response.json()) as VersionResponse;
  return payload.version ?? null;
}

function requestImmediateActivation(registration: ServiceWorkerRegistration) {
  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
}

async function registerServiceWorker(version: string | null) {
  const versionQuery = version ? `?v=${encodeURIComponent(version)}` : "";

  return navigator.serviceWorker.register(`/sw.js${versionQuery}`, {
    scope: "/",
    updateViaCache: "none",
  });
}

export function PwaProvider() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;
    let disposed = false;
    let knownVersion: string | null = null;
    let hasReloaded = false;
    let canReloadOnControllerChange = Boolean(navigator.serviceWorker.controller);
    let pollTimer: number | null = null;
    const observedRegistrations = new WeakSet<ServiceWorkerRegistration>();

    const onControllerChange = () => {
      if (!canReloadOnControllerChange) {
        canReloadOnControllerChange = true;
        return;
      }

      if (hasReloaded) {
        return;
      }

      hasReloaded = true;
      window.location.reload();
    };

    const attachUpdateHandler = (target: ServiceWorkerRegistration) => {
      if (observedRegistrations.has(target)) {
        return;
      }

      observedRegistrations.add(target);
      target.addEventListener("updatefound", () => {
        const installingWorker = target.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            installingWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    };

    const checkVersionAndUpdate = async () => {
      if (!registration) {
        return;
      }

      try {
        const latestVersion = await fetchAppVersion();

        if (!latestVersion) {
          return;
        }

        if (!knownVersion) {
          knownVersion = latestVersion;
          return;
        }

        if (latestVersion !== knownVersion) {
          knownVersion = latestVersion;
          registration = await registerServiceWorker(latestVersion);
          attachUpdateHandler(registration);
          requestImmediateActivation(registration);
        }
      } catch {
        // Ignore polling failures and retry on the next interval.
      }
    };

    const initialize = async () => {
      try {
        try {
          knownVersion = await fetchAppVersion();
        } catch {
          knownVersion = null;
        }

        registration = await registerServiceWorker(knownVersion);

        if (disposed) {
          return;
        }

        attachUpdateHandler(registration);
        requestImmediateActivation(registration);

        pollTimer = window.setInterval(() => {
          if (document.visibilityState === "hidden") {
            return;
          }

          void checkVersionAndUpdate();
        }, VERSION_POLL_INTERVAL_MS);
      } catch {
        // Keep silent to avoid surfacing background PWA setup errors to users.
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    void initialize();

    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );

      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }
    };
  }, []);

  return null;
}
