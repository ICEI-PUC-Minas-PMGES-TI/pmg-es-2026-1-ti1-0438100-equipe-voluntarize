(function (global) {
  function readIdFromUrl(options = {}) {
    const paramNames = options.paramNames || ["id"];
    const allowPathId = options.allowPathId !== false;
    const defaultValue = Object.prototype.hasOwnProperty.call(options, "defaultValue")
      ? options.defaultValue
      : null;
    const searchParams = new URLSearchParams(global.location.search);

    for (const paramName of paramNames) {
      const rawValue = searchParams.get(paramName);

      if (rawValue !== null && rawValue !== "") {
        return rawValue;
      }
    }

    if (allowPathId) {
      const pathParts = global.location.pathname.split("/").filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1] || "";

      if (/^\d+$/.test(lastPart)) {
        return lastPart;
      }
    }

    return defaultValue;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Falha ao carregar ${url}: ${response.status}`);
    }

    return response.json();
  }

  function findById(items, id, key = "id") {
    if (!Array.isArray(items)) {
      return null;
    }

    const normalizedId = String(id);
    return items.find((item) => String(item?.[key]) === normalizedId) || null;
  }

  function buildUrlWithId(path, id, paramName = "id") {
    const url = new URL(path, global.location.href);
    url.searchParams.set(paramName, id);
    return url.toString();
  }

  global.VoluntarizePageData = {
    readIdFromUrl,
    fetchJson,
    findById,
    buildUrlWithId
  };
})(window);