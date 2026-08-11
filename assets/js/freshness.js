(function () {
  const CURRENT_VERSION = "20260811-151342";
  const VERSION_KEY = "our-story-site-version";
  const RELOAD_KEY = "our-story-site-reloaded-for-version";

  function assetUrl(path) {
    return new URL(path, document.baseURI).href;
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

  function showUpdateNotice(latestVersion) {
    if (document.querySelector(".site-update-notice")) return;

    const notice = document.createElement("div");
    notice.className = "site-update-notice";
    notice.setAttribute("role", "status");

    const title = document.createElement("strong");
    title.textContent = "Есть новая версия";

    const text = document.createElement("p");
    text.textContent = "Можно обновить сайт и сразу увидеть свежие изменения.";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Обновить";
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Обновляю...";
      await clearBrowserCaches();
      localStorage.setItem(VERSION_KEY, latestVersion);
      sessionStorage.setItem(RELOAD_KEY, latestVersion);

      const freshUrl = new URL(location.href);
      freshUrl.searchParams.set("v", latestVersion);
      location.replace(freshUrl.href);
    });

    notice.append(title, text, button);
    document.body.appendChild(notice);
  }

  async function checkFreshVersion() {
    try {
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

      const url = assetUrl(`assets/site-version.json?check=${Date.now()}`);
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      const latestVersion = String(data.version || "").trim();
      if (!latestVersion || latestVersion === CURRENT_VERSION) return;

      const alreadyReloadedFor = sessionStorage.getItem(RELOAD_KEY);
      if (alreadyReloadedFor === latestVersion) return;

      showUpdateNotice(latestVersion);
    } catch (error) {
      console.warn("Freshness check skipped", error);
    }
  }

  checkFreshVersion();
})();
