/* =========================================================
   DXN MANUFACTURING NEPAL
   MAIN JAVASCRIPT
   Frontend functions preserved; backend/image handling cleaned.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const mainNav = document.getElementById("mainNav");

    /* =====================================================
       1. SHARED NAVIGATION
    ===================================================== */
    if (mainNav) {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        mainNav.innerHTML = `
            <a href="index.html" data-page="index.html">Home</a>
            <a href="about.html" data-page="about.html">About Us</a>
            <details class="nav-dropdown" data-menu="products">
                <summary>Products</summary>
                <div class="nav-dropdown-menu">
                    <a href="products.html#all-products">All Products</a>
                    <a href="products.html#upcoming-products">Upcoming Products</a>
                    <details class="nav-subdropdown">
                        <summary>Product Categories</summary>
                        <div class="nav-submenu">
                            <a href="products.html#nutraceuticals">Nutraceuticals</a>
                            <a href="products.html#coffee">Coffee</a>
                        </div>
                    </details>
                    <details class="nav-subdropdown">
                        <summary>Top Products</summary>
                        <div class="nav-submenu">
                            <a href="products.html#all-products" data-top-product="dxn-coffee">DXN Coffee</a>
                            <a href="products.html#all-products" data-top-product="dxn-rg-gl">DXN RG &amp; GL</a>
                            <a href="products.html#all-products" data-top-product="dxn-spirulina">DXN Spirulina</a>
                            <a href="products.html#all-products" data-top-product="dxn-cocozhi">DXN Cocozhi</a>
                        </div>
                    </details>
                    <details class="nav-subdropdown">
                        <summary>Manufacturing Units</summary>
                        <div class="nav-submenu">
                            <a href="products.html#coffee-unit">Coffee Unit</a>
                            <a href="products.html#nutraceutical-unit">Nutraceutical Unit</a>
                        </div>
                    </details>
                </div>
            </details>
            <a href="quality.html" data-page="quality.html">Quality</a>
            <details class="nav-dropdown" data-menu="gallery">
                <summary>Gallery</summary>
                <div class="nav-dropdown-menu">
                    <a href="gallery.html#image-gallery">Image Gallery</a>
                    <a href="gallery.html#video-gallery">Video Gallery</a>
                    <a href="gallery.html#corporate-events">Corporate Events</a>
                    <a href="gallery.html#news-press">News &amp; Press</a>
                </div>
            </details>
            <details class="nav-dropdown" data-menu="company">
                <summary>Company</summary>
                <div class="nav-dropdown-menu">
                    <a href="careers.html">Careers</a>
                    <a href="staff-portal.html">Staff Portal</a>
                </div>
            </details>
            <a href="contact.html" data-page="contact.html">Contact</a>`;

        const activePage = mainNav.querySelector(`[data-page="${currentPage}"]`);
        if (activePage) activePage.classList.add("active");

        const activeMenus = {
            "products.html": "products",
            "gallery.html": "gallery",
            "careers.html": "company",
            "staff-portal.html": "company"
        };
        const activeMenuName = activeMenus[currentPage];
        if (activeMenuName) {
            mainNav.querySelector(`[data-menu="${activeMenuName}"] summary`)?.classList.add("active");
        }

        const desktopQuery = window.matchMedia("(min-width: 993px)");
        mainNav.querySelectorAll("details.nav-dropdown, details.nav-subdropdown").forEach(dropdown => {
            dropdown.addEventListener("mouseenter", () => {
                if (desktopQuery.matches) dropdown.open = true;
            });
            dropdown.addEventListener("mouseleave", () => {
                if (desktopQuery.matches) {
                    dropdown.open = false;
                    dropdown.querySelectorAll("details[open]").forEach(child => child.open = false);
                }
            });
        });
    }

    /* =====================================================
       2. MOBILE MENU
    ===================================================== */
    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.classList.toggle("open", isOpen);
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("active");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", event => {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove("active");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* =====================================================
       3. HEADER SCROLL STATE
    ===================================================== */
    const header = document.querySelector(".site-header");
    if (header) {
        const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 20);
        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();
    }

    /* =====================================================
       4. PRODUCT DATA
    ===================================================== */
    const productData = [
        {id:"gl90",category:"Nutraceuticals",type:"current",name:"Ganocelium (GL-90) Capsule",packaging:"90 Caps. × 450 mg",imageNames:["Ganocelium GL-90","Ganocelium","GL-90"],description:"Ganocelium (GL) is a DXN nutraceutical product featuring Ganoderma-based formulation. Product presentation and reference information are adapted for the Nepal catalogue.",features:["Ganoderma-based nutraceutical","Capsule format","90 capsules"]},
        {id:"rg90",category:"Nutraceuticals",type:"current",name:"Reishi Gano (RG-90) Capsule",packaging:"90 Caps × 270 mg",imageNames:["Reishi Gano RG-90","Reishi Gano","RG-90"],description:"Reishi Gano (RG) is a DXN nutraceutical product featuring Ganoderma. The Nepal catalogue retains the supplied packaging specification.",features:["Ganoderma-based nutraceutical","Capsule format","90 capsules"]},
        {id:"spirulina-powder",category:"Nutraceuticals",type:"current",name:"Spirulina Powder-50 gm",packaging:"50 gm",imageNames:["Spirulina Powder","Spirulina"],description:"Spirulina in powder format for the Nepal product range.",features:["Spirulina powder","50 gm pack"]},
        {id:"spirulina-tab-120",category:"Nutraceuticals",type:"current",name:"Spirulina Tablets 120",packaging:"120 Tabs × 300 mg",imageNames:["Spirulina Tablets 120","Spirulina"],description:"Spirulina tablets presented in a 120-tablet pack for the Nepal product range.",features:["Spirulina tablets","120 tablets","300 mg each"]},
        {id:"spirulina-tab-360",category:"Nutraceuticals",type:"current",name:"Spirulina Tablets 360",packaging:"360 Tabs × 300 mg",imageNames:["Spirulina Tablets 360","Spirulina"],description:"Spirulina tablets presented in a 360-tablet pack for the Nepal product range.",features:["Spirulina tablets","360 tablets","300 mg each"]},
        {id:"spirulina-cap-120",category:"Nutraceuticals",type:"current",name:"Spirulina Capsule 120",packaging:"120 Caps. × 300 mg",imageNames:["Spirulina Capsule 120","Spirulina"],description:"Spirulina capsules presented in a 120-capsule pack for the Nepal product range.",features:["Spirulina capsules","120 capsules","300 mg each"]},
        {id:"spirulina-cap-360",category:"Nutraceuticals",type:"current",name:"Spirulina Capsule 360",packaging:"360 Caps. × 300 mg",imageNames:["Spirulina Capsule 360","Spirulina"],description:"Spirulina capsules presented in a 360-capsule pack for the Nepal product range.",features:["Spirulina capsules","360 capsules","300 mg each"]},
        {id:"rg360",category:"Nutraceuticals",type:"upcoming",name:"Reishi Gano (RG-360) Capsule",packaging:"360 Caps. × 270 mg",imageNames:["Reishi Gano RG-360","Reishi Gano","RG-360"],description:"Upcoming 360-capsule Reishi Gano product for the Nepal range.",features:["Upcoming product","Ganoderma-based nutraceutical","360 capsules"]},
        {id:"gl360",category:"Nutraceuticals",type:"upcoming",name:"Ganocelium (GL-360) Capsule",packaging:"360 Caps. × 450 mg",imageNames:["Ganocelium GL-360","Ganocelium","GL-360"],description:"Upcoming 360-capsule Ganocelium product for the Nepal range.",features:["Upcoming product","Ganoderma-based nutraceutical","360 capsules"]},
        {id:"cordy-cap-120",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Capsule 120",packaging:"120 Caps. × 450 mg",imageNames:["Cordyceps Capsule 120","Cordyceps"],description:"Upcoming Cordyceps capsule product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","120 capsules"]},
        {id:"cordy-cap-360",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Capsule 360",packaging:"360 Caps. × 450 mg",imageNames:["Cordyceps Capsule 360","Cordyceps"],description:"Upcoming Cordyceps capsule product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","360 capsules"]},
        {id:"cordy-tab-120",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Tablets 120",packaging:"120 Tabs × 300 mg",imageNames:["Cordyceps Tablets 120","Cordyceps"],description:"Upcoming Cordyceps tablet product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","120 tablets"]},
        {id:"cordy-tab-360",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Tablets 360",packaging:"360 Tabs × 300 mg",imageNames:["Cordyceps Tablets 360","Cordyceps"],description:"Upcoming Cordyceps tablet product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","360 tablets"]},
        {id:"lion-cap-120",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Capsule 120",packaging:"120 Caps. × 450 mg",imageNames:["LionsMane Capsule 120","LionsMane","Lion's Mane"],description:"Upcoming LionsMane capsule product for the Nepal range.",features:["Upcoming product","LionsMane product","120 capsules"]},
        {id:"lion-cap-360",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Capsule 360",packaging:"360 Caps. × 450 mg",imageNames:["LionsMane Capsule 360","LionsMane","Lion's Mane"],description:"Upcoming LionsMane capsule product for the Nepal range.",features:["Upcoming product","LionsMane product","360 capsules"]},
        {id:"lion-tab-120",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Tablets 120",packaging:"120 Tabs × 300 mg",imageNames:["LionsMane Tablets 120","LionsMane","Lion's Mane"],description:"Upcoming LionsMane tablet product for the Nepal range.",features:["Upcoming product","LionsMane product","120 tablets"]},
        {id:"lion-tab-360",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Tablets 360",packaging:"360 Tabs × 300 mg",imageNames:["LionsMane Tablets 360","LionsMane","Lion's Mane"],description:"Upcoming LionsMane tablet product for the Nepal range.",features:["Upcoming product","LionsMane product","360 tablets"]},
        {id:"reishi-powder",category:"Nutraceuticals",type:"upcoming",name:"Reishi Mushroom Powder - 70 gm",packaging:"70 gm",imageNames:["Reishi Mushroom Powder","Reishi Powder","Reishi"],description:"Upcoming Reishi mushroom powder product for the Nepal range.",features:["Upcoming product","Reishi mushroom powder","70 gm"]},
        {id:"cocozhi",category:"Coffee",type:"current",name:"Cocoa Drink Premix with Ganoderma Extract (Cocozhi)",packaging:"Coffee / cocoa premix",imageNames:["Cocozhi","CocoZhi"],description:"Cocozhi is formulated from cocoa with Ganoderma extract. It can be prepared with hot water or milk and can also be enjoyed as a cold drink.",features:["Cocoa drink premix","Ganoderma extract","Hot or cold preparation"]},
        {id:"lingzhi-coffee",category:"Coffee",type:"current",name:"Coffee Drink Premix with Ganoderma Extract (Lingzhi Coffee 3 in 1)",packaging:"3 in 1 coffee premix",imageNames:["Lingzhi Coffee 3 in 1","Lingzhi Coffee","DXN Coffee"],description:"DXN Lingzhi Coffee 3 in 1 combines coffee powder with Ganoderma mushroom for a convenient premix beverage.",features:["Coffee drink premix","Ganoderma mushroom","3 in 1 format"]},
        {id:"cordyceps-coffee",category:"Coffee",type:"current",name:"Coffee Drink Premix With Cordyceps Powder (Cordyceps Coffee 3 in 1)",packaging:"3 in 1 coffee premix",imageNames:["Cordyceps Coffee 3 in 1","Cordyceys Coffe","Cordyceps Coffee"],description:"DXN Cordyceps Coffee 3 in 1 is a coffee premix with Cordyceps powder.",features:["Coffee drink premix","Cordyceps powder","3 in 1 format"]}
    ];

    /* =====================================================
       5. IMAGE MANIFEST
    ===================================================== */
    async function loadImageManifest() {
        try {
            const response = await fetch(`images.json?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn("Image manifest unavailable; pending images will remain unresolved.", error);
            return { generated: false, folders: {} };
        }
    }

    function normalizeName(value) {
        return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    }

    function findProductImage(product, manifest) {
        const folder = product.category === "Coffee" ? "products/coffee" : "products/nutraceuticals";
        const images = (manifest.folders || {})[folder] || [];
        const terms = product.imageNames.map(normalizeName).filter(Boolean);

        const match = images.find(item => {
            const searchable = normalizeName(`${item.name} ${item.path}`);
            return terms.some(term => searchable.includes(term));
        });

        if (match?.src) return match.src;

        if (product.id === "cordyceps-coffee") {
            const legacyImage = (manifest.folders.products || []).find(item => normalizeName(item.name).includes("cordyceys"));
            if (legacyImage?.src) return legacyImage.src;
        }

        /* Intentionally unresolved until the real Nepal product photograph is added. */
        return `images/products/pending/${product.id}.jpg`;
    }

    /* =====================================================
       6. PRODUCT CATALOGUE
    ===================================================== */
    function renderProducts(filter, manifest) {
        const catalog = document.getElementById("productCatalog");
        const empty = document.getElementById("catalogEmpty");
        if (!catalog) return;

        const normalizedFilter = String(filter || "all").toLowerCase();
        const selected = productData.filter(product => {
            return normalizedFilter === "all" ||
                product.type === normalizedFilter ||
                product.category.toLowerCase() === normalizedFilter;
        });

        catalog.innerHTML = "";

        selected.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";
            card.id = product.id;
            card.dataset.category = product.category.toLowerCase();
            card.dataset.status = product.type;
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `View details for ${product.name}`);

            const image = findProductImage(product, manifest);
            const isTopProduct = ["lingzhi-coffee", "gl90", "rg90", "spirulina-powder", "spirulina-tab-120", "spirulina-tab-360", "spirulina-cap-120", "spirulina-cap-360", "cocozhi"].includes(product.id);
            if (isTopProduct) card.dataset.topProduct = product.id;

            card.innerHTML = `
                <div class="product-card-image">
                    <img src="${image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-card-body">
                    <span class="product-card-category">${product.category}</span>
                    <span class="product-status ${product.type}">${product.type === "upcoming" ? "Upcoming" : "Current"}</span>
                    <h3>${product.name}</h3>
                    <p class="product-card-meta">${product.packaging}</p>
                    <p>${product.description}</p>
                    <div class="product-feature-list">
                        ${product.features.map(feature => `<span>${feature}</span>`).join("")}
                    </div>
                    <button class="product-spec-btn" type="button" aria-label="View ${product.name} details">
                        <span>View Details</span><span aria-hidden="true">→</span>
                    </button>
                </div>`;

            const openDetails = () => openProductModal(product, image);
            card.querySelector(".product-spec-btn")?.addEventListener("click", event => {
                event.stopPropagation();
                openDetails();
            });
            card.addEventListener("click", event => {
                if (!event.target.closest("button, a")) openDetails();
            });
            card.addEventListener("keydown", event => {
                if ((event.key === "Enter" || event.key === " ") && event.target === card) {
                    event.preventDefault();
                    openDetails();
                }
            });

            catalog.appendChild(card);
        });

        if (empty) empty.hidden = selected.length > 0;
    }

    function setupProductFilters(manifest) {
        const catalog = document.getElementById("productCatalog");
        if (!catalog) return;

        const filterButtons = document.querySelectorAll("[data-filter]");
        const categoryLinks = document.querySelectorAll("[data-set-filter]");

        const setFilter = filter => {
            const normalized = String(filter || "all").toLowerCase();
            filterButtons.forEach(button => {
                const active = button.dataset.filter === normalized;
                button.classList.toggle("active", active);
                button.setAttribute("aria-selected", active ? "true" : "false");
            });
            renderProducts(normalized, manifest);
        };

        let initialFilter = document.querySelector("[data-filter].active")?.dataset.filter || "all";
        const hash = window.location.hash.replace(/^#/, "").toLowerCase();
        if (hash === "upcoming-products") initialFilter = "upcoming";
        if (["nutraceuticals", "coffee"].includes(hash)) initialFilter = hash;

        setFilter(initialFilter);

        filterButtons.forEach(button => {
            button.addEventListener("click", () => setFilter(button.dataset.filter));
        });

        categoryLinks.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                setFilter(link.dataset.setFilter);
                document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }

    /* =====================================================
       7. TOP PRODUCT LINKS
    ===================================================== */
    function setupTopProductLinks() {
        const targetMap = {
            "dxn-coffee": "lingzhi-coffee",
            "dxn-rg-gl": "rg90",
            "dxn-spirulina": "spirulina-powder",
            "dxn-cocozhi": "cocozhi"
        };

        document.querySelectorAll("[data-top-product]").forEach(link => {
            link.addEventListener("click", event => {
                if (!document.getElementById("productCatalog")) return;
                event.preventDefault();

                const targetId = targetMap[link.dataset.topProduct];
                const target = targetId ? document.getElementById(targetId) : null;
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                    target.classList.add("top-product-highlight");
                    setTimeout(() => target.classList.remove("top-product-highlight"), 1400);
                    return;
                }

                document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }

    /* =====================================================
       8. PRODUCT MODAL
    ===================================================== */
    function openProductModal(product, image) {
        const modal = document.getElementById("productModal");
        if (!modal) return;

        const modalImage = document.getElementById("modalProductImage");
        const category = document.getElementById("modalProductCategory");
        const name = document.getElementById("modalProductName");
        const description = document.getElementById("modalProductDescription");
        const packaging = document.getElementById("modalProductPackaging");
        const status = document.getElementById("modalProductStatus");
        const features = document.getElementById("modalProductFeatures");

        if (modalImage) {
            modalImage.src = image;
            modalImage.alt = product.name;
        }
        if (category) category.textContent = product.category;
        if (name) name.textContent = product.name;
        if (description) description.textContent = product.description;
        if (packaging) packaging.textContent = product.packaging;
        if (status) status.textContent = product.type === "upcoming" ? "Upcoming" : "Current";
        if (features) features.innerHTML = product.features.map(feature => `<span>${feature}</span>`).join("");

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        modal.querySelector(".product-modal-close")?.focus();
    }

    function closeProductModal() {
        const modal = document.getElementById("productModal");
        if (!modal) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    function setupProductModal() {
        const modal = document.getElementById("productModal");
        if (!modal) return;

        modal.querySelectorAll("[data-modal-close]").forEach(element => {
            element.addEventListener("click", closeProductModal);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && modal.classList.contains("open")) closeProductModal();
        });
    }

    /* =====================================================
       9. AUTOMATIC IMAGE GALLERIES
       Reads images.json generated by the repository workflow.
    ===================================================== */
    function renderAutoImageGalleries(manifest) {
        document.querySelectorAll(".auto-image-gallery[data-image-folder]").forEach(gallery => {
            const folder = gallery.dataset.imageFolder;
            const images = (manifest.folders || {})[folder] || [];
            gallery.innerHTML = "";
            gallery.removeAttribute("data-image-empty");

            if (!images.length) {
                gallery.setAttribute("data-image-empty", "true");
                return;
            }

            images.forEach(item => {
                if (!item?.src) return;

                const figure = document.createElement("figure");
                figure.className = "auto-image-card";
                const caption = item.name || item.path?.split("/").pop() || "Image";

                figure.innerHTML = `
                    <img src="${item.src}" alt="${caption}" loading="lazy">
                    <figcaption>${caption}</figcaption>`;
                gallery.appendChild(figure);
            });

            if (!gallery.children.length) gallery.setAttribute("data-image-empty", "true");
        });
    }

    /* =====================================================
       10. INITIALIZE PAGE FEATURES
    ===================================================== */
    setupProductModal();

    loadImageManifest().then(manifest => {
        if (document.getElementById("productCatalog")) {
            setupProductFilters(manifest);
            setupTopProductLinks();
        }
        renderAutoImageGalleries(manifest);
    });

    /* =====================================================
       11. CURRENT YEAR
    ===================================================== */
    document.querySelectorAll(".current-year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });
});
