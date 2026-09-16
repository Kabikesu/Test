/* =========================================================
   DXN MANUFACTURING NEPAL
   PRODUCT IMAGE FALLBACK

   Purpose:
   1. Keep a real product image when it loads successfully.
   2. If the real image is missing or fails to load, show a
      clean placeholder containing the product name.
   3. Keep product descriptions free from obsolete image-update
      messaging when a real image is already available.

   The product catalogue in script.js is responsible for
   selecting the real image from images.json. This file handles
   the final image load/error fallback and presentation cleanup.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const PLACEHOLDER_LABEL = "Product Image";

    function escapeSvgText(value) {
        return String(value || "Product").replace(/[&<>\"]/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;"
        }[character]));
    }

    function createPlaceholder(productName) {
        const name = escapeSvgText(productName || "Product");
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${name} image placeholder">
                <rect width="800" height="600" fill="#f3f4f6"/>
                <rect x="40" y="40" width="720" height="520" rx="18" fill="#ffffff" stroke="#d1d5db" stroke-width="3"/>
                <circle cx="400" cy="245" r="70" fill="#e5e7eb"/>
                <path d="M360 245h80M400 205v80" stroke="#9ca3af" stroke-width="10" stroke-linecap="round"/>
                <text x="400" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#4b5563">${PLACEHOLDER_LABEL}</text>
                <text x="400" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">${name}</text>
            </svg>`;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function isPendingPath(src) {
        return String(src || "").includes("images/products/pending/");
    }

    function applyFallback(image) {
        if (!image || image.dataset.placeholderApplied === "true") return;

        const productCard = image.closest(".product-card");
        const productName = productCard?.querySelector(".product-card-body h3")?.textContent?.trim()
            || image.alt
            || "Product";

        image.dataset.placeholderApplied = "true";
        image.src = createPlaceholder(productName);
        image.alt = `${productName} image placeholder`;
        image.removeAttribute("data-image-fallback-pending");
    }

    function watchImage(image) {
        if (!image || image.dataset.fallbackWatcher === "true") return;
        image.dataset.fallbackWatcher = "true";

        image.addEventListener("error", function () {
            applyFallback(image);
        });

        /* script.js uses the pending path when no real image is found. */
        if (isPendingPath(image.getAttribute("src"))) {
            applyFallback(image);
        }
    }

    /*
       Product descriptions should describe the product, not the
       temporary state of its image. If a product already has a
       real image, remove obsolete wording such as "image can be
       replaced/updated" from the visible modal description.
    */
    function cleanProductDescription() {
        const description = document.getElementById("modalProductDescription");
        const image = document.getElementById("modalProductImage");
        if (!description || !image) return;

        const text = description.textContent || "";
        if (!text) return;

        const cleaned = text
            .replace(/\s*The existing Nepal product image is retained and can be replaced with an updated product image at any time\.?/gi, "")
            .replace(/\s*The product image can be replaced with an updated product image at any time\.?/gi, "")
            .replace(/\s*The image will be updated soon\.?/gi, "")
            .replace(/\s*Product image will be updated soon\.?/gi, "")
            .replace(/\s{2,}/g, " ")
            .trim();

        if (cleaned !== text) description.textContent = cleaned;
    }

    function scanImages(root = document) {
        root.querySelectorAll?.(".product-card-image img, #modalProductImage").forEach(watchImage);
        cleanProductDescription();
    }

    const catalog = document.getElementById("productCatalog");
    if (catalog) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) scanImages(node);
                });
            });
        });

        observer.observe(catalog, { childList: true, subtree: true });
    }

    /* Watch the modal as well because script.js updates its
       contents only when a product is opened. */
    const modal = document.getElementById("productModal");
    if (modal) {
        const modalObserver = new MutationObserver(() => {
            scanImages(modal);
        });
        modalObserver.observe(modal, { childList: true, subtree: true, characterData: true });
    }

    scanImages();
});
