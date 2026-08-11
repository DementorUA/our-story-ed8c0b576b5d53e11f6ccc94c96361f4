(function () {
  const CURRENT_VERSION = "20260811-140551";
  const VERSION_KEY = "our-story-site-version";
  const RELOAD_KEY = "our-story-site-reloaded-for-version";

  function rootPath() {
    const path = location.pathname;
    return path.endsWith("/") ? path : path.replace(/[^/]*$/, "");
  }

  async function clearBrowserCaches() {
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    }

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }
  }

  async function checkFreshVersion() {
    try {
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

      const url = `${rootPath()}assets/site-version.json?check=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      const latestVersion = String(data.version || "").trim();
      if (!latestVersion || latestVersion === CURRENT_VERSION) return;

      const alreadyReloadedFor = sessionStorage.getItem(RELOAD_KEY);
      if (alreadyReloadedFor === latestVersion) return;

      await clearBrowserCaches();
      localStorage.setItem(VERSION_KEY, latestVersion);
      sessionStorage.setItem(RELOAD_KEY, latestVersion);

      const freshUrl = new URL(location.href);
      freshUrl.searchParams.set("v", latestVersion);
      location.replace(freshUrl.href);
    } catch (error) {
      console.warn("Freshness check skipped", error);
    }
  }

  checkFreshVersion();
})();
