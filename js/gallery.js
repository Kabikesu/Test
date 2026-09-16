/* =========================================================
   DXN MANUFACTURING NEPAL
   FOLDER-BASED MEDIA GALLERY
   Images and videos are grouped automatically from images.json.
========================================================= */

(function () {
    "use strict";

    const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function titleCase(value) {
        return String(value || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, letter => letter.toUpperCase());
    }

    function isVideo(item) {
        if (item?.type === "video") return true;
        const path = String(item?.path || "").toLowerCase();
        return VIDEO_EXTENSIONS.some(ext => path.endsWith(ext));
    }

    function isImage(item) {
        if (item?.type === "image") return true;
        const path = String(item?.path || "").toLowerCase();
        return IMAGE_EXTENSIONS.some(ext => path.endsWith(ext));
    }

    function folderNameFromPath(item, rootFolder) {
        const path = String(item?.path || "");
        const root = rootFolder.endsWith("/") ? rootFolder : `${rootFolder}/`;
        if (!path.startsWith(root)) return "";
        const parts = path.slice(root.length).split("/");
        if (parts.length > 1 && parts[0]) return parts[0];
        const stem = String(item?.name || parts[0] || "Image").trim();
        return stem.replace(/\s*\(\d+\)\s*$/, "").trim() || "General Gallery";
    }

    function groupMedia(items, rootFolder) {
        const groups = new Map();
        items.forEach(item => {
            if (!item?.src) return;
            const name = folderNameFromPath(item, rootFolder) || "General Gallery";
            if (!groups.has(name)) groups.set(name, []);
            groups.get(name).push(item);
        });
        return [...groups.entries()]
            .map(([name, media]) => ({ name, media: media.sort((a, b) => String(a.path).localeCompare(String(b.path), undefined, { numeric: true })) }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    function collectRootMedia(manifest, rootFolder) {
        const folders = manifest.folders || {};
        const rootItems = [];
        Object.entries(folders).forEach(([folder, items]) => {
            if (folder === rootFolder || folder.startsWith(`${rootFolder}/`)) (items || []).forEach(item => rootItems.push(item));
        });
        return rootItems;
    }

    function createFolderView(container) {
        const detail = document.createElement("div");
        detail.className = "media-folder-detail";
        detail.hidden = true;
        container.appendChild(detail);
        return detail;
    }

    function renderFolderGallery(container, rootFolder, items, options = {}) {
        const groups = groupMedia(items, rootFolder);
        const folderGrid = document.createElement("div");
        folderGrid.className = "media-folder-grid";
        const detail = createFolderView(container);
        const title = options.title || "Gallery";

        if (!groups.length) {
            folderGrid.innerHTML = `<div class="media-gallery-empty">Media will appear here automatically when folders and files are added.</div>`;
            container.appendChild(folderGrid);
            return;
        }

        groups.forEach(group => {
            const firstImage = group.media.find(isImage);
            const firstVideo = group.media.find(isVideo);
            const cover = firstImage?.src || firstVideo?.src || "";
            const imageCount = group.media.filter(isImage).length;
            const videoCount = group.media.filter(isVideo).length;
            const countText = [imageCount ? `${imageCount} Photo${imageCount === 1 ? "" : "s"}` : "", videoCount ? `${videoCount} Video${videoCount === 1 ? "" : "s"}` : ""].filter(Boolean).join(" · ");
            const card = document.createElement("button");
            card.type = "button";
            card.className = "media-folder-card";
            card.innerHTML = `<span class="media-folder-cover">${cover && firstImage ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(group.name)}" loading="lazy">` : "<span class=\"media-folder-video-cover\">▶</span>"}<span class="media-folder-icon">▰</span></span><span class="media-folder-body"><strong>${escapeHtml(titleCase(group.name))}</strong><span>${escapeHtml(countText)}</span></span><span class="media-folder-arrow">→</span>`;
            card.addEventListener("click", () => {
                folderGrid.hidden = true;
                detail.hidden = false;
                renderFolderDetail(detail, group, title, () => {
                    detail.hidden = true;
                    folderGrid.hidden = false;
                });
                detail.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            folderGrid.appendChild(card);
        });
        container.appendChild(folderGrid);
    }

    function renderFolderDetail(detail, group, parentTitle, onBack) {
        detail.innerHTML = `<div class="media-detail-heading"><button type="button" class="media-back-btn">← Back to ${escapeHtml(parentTitle)}</button><span class="section-label">${escapeHtml(parentTitle)}</span><h3>${escapeHtml(titleCase(group.name))}</h3><p>${group.media.filter(isImage).length ? `${group.media.filter(isImage).length} photo${group.media.filter(isImage).length === 1 ? "" : "s"}` : ""}${group.media.filter(isImage).length && group.media.filter(isVideo).length ? " · " : ""}${group.media.filter(isVideo).length ? `${group.media.filter(isVideo).length} video${group.media.filter(isVideo).length === 1 ? "" : "s"}` : ""}</p></div><div class="media-detail-grid"></div>`;
        detail.querySelector(".media-back-btn").addEventListener("click", onBack);
        const grid = detail.querySelector(".media-detail-grid");
        const images = group.media.filter(isImage);

        group.media.forEach(item => {
            if (isVideo(item)) {
                const card = document.createElement("article");
                card.className = "media-detail-card media-video-card";
                card.innerHTML = `<video controls preload="metadata" src="${escapeHtml(item.src)}"></video><div>${escapeHtml(item.name || "Video")}</div>`;
                grid.appendChild(card);
                return;
            }
            if (isImage(item)) {
                const card = document.createElement("figure");
                card.className = "media-detail-card";
                const imageIndex = images.indexOf(item);
                card.innerHTML = `<button type="button" class="media-image-open" aria-label="Open image ${imageIndex + 1}"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.name || group.name)}" loading="lazy"></button><figcaption>${escapeHtml(item.name || group.name)}</figcaption>`;
                card.querySelector(".media-image-open").addEventListener("click", () => openLightbox(images, imageIndex, group.name));
                grid.appendChild(card);
            }
        });
    }

    function openLightbox(images, startIndex, groupName) {
        let currentIndex = startIndex;
        const overlay = document.createElement("div");
        overlay.className = "media-lightbox";
        overlay.innerHTML = `<div class="media-lightbox-panel" role="dialog" aria-modal="true" aria-label="Image viewer"><button type="button" class="media-lightbox-close" aria-label="Close">×</button><button type="button" class="media-lightbox-prev" aria-label="Previous image">‹</button><img class="media-lightbox-image" src="" alt=""><button type="button" class="media-lightbox-next" aria-label="Next image">›</button><div class="media-lightbox-caption"></div></div>`;
        document.body.appendChild(overlay);
        document.body.classList.add("media-lightbox-open");

        const image = overlay.querySelector(".media-lightbox-image");
        const caption = overlay.querySelector(".media-lightbox-caption");
        const prev = overlay.querySelector(".media-lightbox-prev");
        const next = overlay.querySelector(".media-lightbox-next");

        function show(index) {
            currentIndex = (index + images.length) % images.length;
            const item = images[currentIndex];
            image.src = item.src;
            image.alt = item.name || groupName || "Gallery image";
            caption.textContent = `${item.name || groupName || "Image"}  •  ${currentIndex + 1} / ${images.length}`;
            prev.hidden = images.length < 2;
            next.hidden = images.length < 2;
        }
        function close() {
            document.body.classList.remove("media-lightbox-open");
            document.removeEventListener("keydown", onKeydown);
            overlay.remove();
        }
        function onKeydown(event) {
            if (event.key === "Escape") close();
            if (event.key === "ArrowLeft") show(currentIndex - 1);
            if (event.key === "ArrowRight") show(currentIndex + 1);
        }
        overlay.querySelector(".media-lightbox-close").addEventListener("click", close);
        prev.addEventListener("click", () => show(currentIndex - 1));
        next.addEventListener("click", () => show(currentIndex + 1));
        overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
        document.addEventListener("keydown", onKeydown);
        show(currentIndex);
    }

    function initializeGallery(manifest) {
        document.querySelectorAll("[data-media-root]").forEach(container => {
            const rootFolder = container.dataset.mediaRoot;
            const items = collectRootMedia(manifest, rootFolder);
            container.innerHTML = "";
            renderFolderGallery(container, rootFolder, items, { title: container.dataset.mediaTitle || "Gallery" });
        });
    }

    document.addEventListener("DOMContentLoaded", async function () {
        try {
            const response = await fetch(`images.json?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
            initializeGallery(await response.json());
        } catch (error) {
            console.warn("Folder gallery could not load images.json", error);
        }
    });
})();
