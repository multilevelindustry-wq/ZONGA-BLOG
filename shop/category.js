/* ==========================================================
NEOSTORE CATEGORY PAGE
PART 5 — CATEGORY / COUNTRY / REGION / SEARCH
========================================================== */

import {
    auth,
    db
} from "./firebase.js";

import "./currency.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* ==========================================================
GLOBAL STATE
========================================================== */

let allProducts = [];

let selectedCategory = "all";
let selectedCountry = "all";
let selectedRegion = "all";

let searchTerm = "";

let selectedSort = "random";

let selectedStyle = "mixed";

let isSearchMode = false;

/* ==========================================================
CATEGORY DATA
========================================================== */

const CATEGORY_NAMES = {

all: "All Products",

phones: "Phones",

computers: "Computers",

electronics: "Electronics",

fashion: "Fashion",

shoes: "Shoes",

beauty: "Beauty",

health: "Health",

home: "Home",

automotive: "Automotive",

sports: "Sports",

other: "Other"

};

/* ==========================================================
DOM ELEMENTS
========================================================== */

const pageLoader =
document.getElementById("pageLoader");

const categoryTitle =
document.getElementById("categoryTitle");

const categoryDescription =
document.getElementById("categoryDescription");

const breadcrumbCurrent =
document.getElementById("breadcrumbCurrent");

const categoryLocationInfo =
document.getElementById("categoryLocationInfo");

const productSearch =
document.getElementById("productSearch");

const searchButton =
document.getElementById("searchButton");

const clearSearchButton =
document.getElementById("clearSearchButton");

const searchStatus =
document.getElementById("searchStatus");

const productsHeading =
document.getElementById("productsHeading");

const productCount =
document.getElementById("productCount");

const displayLimitText =
document.getElementById("displayLimitText");

const productsContainer =
document.getElementById("productsContainer");

const productsLoading =
document.getElementById("productsLoading");

const productsEmpty =
document.getElementById("productsEmpty");

const emptyMessage =
document.getElementById("emptyMessage");

const productsError =
document.getElementById("productsError");

const errorMessage =
document.getElementById("errorMessage");

const retryProductsButton =
document.getElementById("retryProductsButton");

const clearFiltersButton =
document.getElementById("clearFiltersButton");

const activeFilters =
document.getElementById("activeFilters");

const featuredProducts =
document.getElementById("featuredProducts");

const dealsProducts =
document.getElementById("dealsProducts");

const recentProducts =
document.getElementById("recentProducts");

const featuredProductsSection =
document.getElementById("featuredProductsSection");

const dealsProductsSection =
document.getElementById("dealsProductsSection");

const recentProductsSection =
document.getElementById("recentProductsSection");

const categoryFilterButton =
document.getElementById("categoryFilterButton");

const countryFilterButton =
document.getElementById("countryFilterButton");

const regionFilterButton =
document.getElementById("regionFilterButton");

const sortButton =
document.getElementById("sortButton");

const styleButton =
document.getElementById("styleButton");

const categoryFilterPanel =
document.getElementById("categoryFilterPanel");

const countryFilterPanel =
document.getElementById("countryFilterPanel");

const regionFilterPanel =
document.getElementById("regionFilterPanel");

const sortFilterPanel =
document.getElementById("sortFilterPanel");

const styleFilterPanel =
document.getElementById("styleFilterPanel");

const categoryFilterOptions =
document.getElementById("categoryFilterOptions");

const countryFilterOptions =
document.getElementById("countryFilterOptions");

const regionFilterOptions =
document.getElementById("regionFilterOptions");

const countrySearch =
document.getElementById("countrySearch");

const regionSearch =
document.getElementById("regionSearch");

const backButton =
document.getElementById("backButton");

const backToTopButton =
document.getElementById("backToTopButton");

const footerYear =
document.getElementById("footerYear");

/* ==========================================================
NORMALIZE TEXT
========================================================== */

function normalizeText(value) {

return String(value ?? "")
    .trim()
    .toLowerCase();

}

/* ==========================================================
ESCAPE HTML
========================================================== */

function escapeHTML(value) {

return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* ==========================================================
GET PRODUCT IMAGE
========================================================== */

function getProductImage(product) {

if (
    product.mainImage &&
    typeof product.mainImage === "string"
) {
    return product.mainImage;
}

if (
    product.image &&
    typeof product.image === "string"
) {
    return product.image;
}

if (
    product.imageUrl &&
    typeof product.imageUrl === "string"
) {
    return product.imageUrl;
}

if (
    Array.isArray(product.images) &&
    product.images.length > 0
) {

    const firstImage =
        product.images.find(
            image => typeof image === "string"
        );

    if (firstImage) {
        return firstImage;
    }

}

return "https://via.placeholder.com/600x600?text=No+Image";

}

/* ==========================================================
GET PRODUCT NAME
========================================================== */

function getProductName(product) {

return (
    product.name ||
    product.productName ||
    "Unnamed Product"
);

}

/* ==========================================================
GET PRODUCT PRICE
========================================================== */

function getProductPrice(product) {

const value =
    product.price ??
    product.sellerPrice ??
    product.amount ??
    0;

const number =
    Number(value);

return Number.isFinite(number)
    ? number
    : 0;

}

/* ==========================================================
FORMAT MONEY
========================================================== */

function formatMoney(amount, product = {}) {

const currency =
    product.currency ||
    product.priceCurrency ||
    "USD";

const number =
    Number(amount) || 0;


if (
    currency === "USD" ||
    currency === "$"
) {

    return "$" +
        number.toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

}


if (currency === "NGN") {

    return "₦" +
        number.toLocaleString(
            "en-NG",
            {
                maximumFractionDigits: 2
            }
        );

}


return (
    currency +
    " " +
    number.toLocaleString(
        undefined,
        {
            maximumFractionDigits: 2
        }
    )
);

}


/* ==========================================================
GET PRODUCT CATEGORY
========================================================== */

function getProductCategory(product) {

return normalizeText(
    product.category
);

}

/* ==========================================================
GET PRODUCT COUNTRY
========================================================== */

function getProductCountry(product) {

const location =
    product.location || {};

return normalizeText(
    location.country ||
    product.country ||
    ""
);

}


/* ==========================================================
GET PRODUCT REGION
========================================================== */

function getProductRegion(product) {

const location =
    product.location || {};

return normalizeText(
    location.region ||
    product.region ||
    ""
);

}

/* ==========================================================
GET PRODUCT CITY
========================================================== */

function getProductCity(product) {

const location =
    product.location || {};

return (
    location.city ||
    product.city ||
    ""
);

}

/* ==========================================================
GET PRODUCT AREA
========================================================== */

function getProductArea(product) {

const location =
    product.location || {};

return (
    location.area ||
    product.area ||
    ""
);

}

/* ==========================================================
GET PRODUCT SELLER
========================================================== */

function getProductSeller(product) {

return (
    product.sellerName ||
    product.sellerDisplayName ||
    product.sellerEmail ||
    "Seller"
);

}

/* ==========================================================
GET PRODUCT RATING
========================================================== */

function getProductRating(product) {

const rating =
    Number(
        product.rating ??
        product.averageRating ??
        0
    );

if (!Number.isFinite(rating)) {
    return 0;
}

return Math.max(
    0,
    Math.min(5, rating)
);

}

/* ==========================================================
GET PRODUCT VIEWS
========================================================== */

function getProductViews(product) {

return Number(
    product.views || 0
);

}

/* ==========================================================
GET PRODUCT SALES
========================================================== */

function getProductSales(product) {

return Number(
    product.sales || 0
);

}

/* ==========================================================
GET PRODUCT DISCOUNT
========================================================== */

function getProductDiscount(product) {

const discount =
    Number(
        product.discount ??
        product.discountPercent ??
        0
    );

if (
    Number.isFinite(discount) &&
    discount > 0
) {

    return Math.min(
        99,
        Math.round(discount)
    );

}

const oldPrice =
    Number(
        product.oldPrice ||
        product.compareAtPrice ||
        0
    );

const price =
    getProductPrice(product);

if (
    oldPrice > price &&
    price > 0
) {

    return Math.round(
        ((oldPrice - price) / oldPrice) * 100
    );

}

return 0;

}

/* ==========================================================
GET OLD PRICE
========================================================== */

function getOldPrice(product) {

const oldPrice =
    Number(
        product.oldPrice ||
        product.compareAtPrice ||
        0
    );

return oldPrice > getProductPrice(product)
    ? oldPrice
    : 0;

}

/* ==========================================================
PRODUCT ACTIVE CHECK
========================================================== */

function isProductActive(product) {

if (
    product.status === undefined ||
    product.status === null ||
    product.status === ""
) {

    return true;

}

return normalizeText(
    product.status
) === "active";

}

/* ==========================================================
SHUFFLE ARRAY
========================================================== */

function shuffleArray(array) {

const result =
    [...array];

for (
    let i = result.length - 1;
    i > 0;
    i--
) {

    const j =
        Math.floor(
            Math.random() * (i + 1)
        );

    [
        result[i],
        result[j]
    ] = [
        result[j],
        result[i]
    ];

}

return result;

}

/* ==========================================================
   READ URL PARAMETERS + SAVED LOCATION
========================================================== */

function readURLParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlCategory =
        params.get("category");

    const urlSearch =
        params.get("search");

    const urlCountry =
        params.get("country");

    const urlRegion =
        params.get("region");


    /* ======================================================
       CATEGORY
    ====================================================== */

    if (urlCategory) {

        selectedCategory =
            normalizeText(
                urlCategory
            );

    }


    /* ======================================================
       SEARCH
    ====================================================== */

    if (urlSearch) {

        searchTerm =
            urlSearch.trim();

        isSearchMode =
            searchTerm.length > 0;

        if (productSearch) {

            productSearch.value =
                searchTerm;

        }

    }


    /* ======================================================
       COUNTRY
    ====================================================== */

    if (urlCountry) {

        selectedCountry =
            normalizeText(
                urlCountry
            );

    } else {

        /*
         * No country in URL?
         * Read the country saved on home page.
         */

        try {

            const savedLocation =
                JSON.parse(
                    localStorage.getItem(
                        "neoStoreBuyerLocation"
                    ) || "null"
                );


            if (
                savedLocation &&
                savedLocation.country
            ) {

                selectedCountry =
                    normalizeText(
                        savedLocation.country
                    );

            }

        } catch (error) {

            console.error(
                "Could not read saved location:",
                error
            );

        }

    }


    /* ======================================================
       REGION
    ====================================================== */

    if (urlRegion) {

        selectedRegion =
            normalizeText(
                urlRegion
            );

    } else {

        /*
         * If no region in URL, use saved region.
         */

        try {

            const savedLocation =
                JSON.parse(
                    localStorage.getItem(
                        "neoStoreBuyerLocation"
                    ) || "null"
                );


            if (
                savedLocation &&
                savedLocation.region
            ) {

                selectedRegion =
                    normalizeText(
                        savedLocation.region
                    );

            }

        } catch (error) {

            console.error(
                "Could not read saved region:",
                error
            );

        }

    }

}



/* ==========================================================
UPDATE PAGE TITLE
========================================================== */

function updatePageInformation() {

let title =
    "All Products";


if (
    selectedCategory !== "all"
) {

    title =
        CATEGORY_NAMES[selectedCategory] ||
        selectedCategory
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );

}


if (searchTerm) {

    title =
        `Search results for "${searchTerm}"`;

}


if (
    selectedCountry !== "all" &&
    selectedRegion === "all" &&
    !searchTerm
) {

    title +=
        ` in ${selectedCountry.toUpperCase()}`;

}


if (
    selectedRegion !== "all" &&
    !searchTerm
) {

    title +=
        ` - ${selectedRegion
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            )}`;

}


if (categoryTitle) {

    categoryTitle.textContent =
        title;

}


if (breadcrumbCurrent) {

    breadcrumbCurrent.textContent =
        title;

}


if (categoryDescription) {

    if (searchTerm) {

        categoryDescription.textContent =
            "Products matching your search.";

    } else if (
        selectedRegion !== "all"
    ) {

        categoryDescription.textContent =
            "Browse products available in this region.";

    } else if (
        selectedCountry !== "all"
    ) {

        categoryDescription.textContent =
            "Browse products available in this country.";

    } else if (
        selectedCategory !== "all"
    ) {

        categoryDescription.textContent =
            "Discover products from sellers in this category.";

    } else {

        categoryDescription.textContent =
            "Discover products from sellers across countries and regions.";

    }

}


document.title =
    `${title} | NeoStore`;

}

/* ==========================================================
FILTER PRODUCTS
========================================================== */

function filterProducts() {

const normalizedSearch =
    normalizeText(searchTerm);


return allProducts.filter(
    product => {

        const category =
            getProductCategory(
                product
            );

        const country =
            getProductCountry(
                product
            );

        const region =
            getProductRegion(
                product
            );


        /*
         * CATEGORY
         */

        const categoryMatches =
            selectedCategory === "all" ||
            category === selectedCategory;


        /*
         * COUNTRY
         */

        const countryMatches =
            selectedCountry === "all" ||
            country === selectedCountry;


        /*
         * REGION
         */

        const regionMatches =
            selectedRegion === "all" ||
            region === selectedRegion;


        /*
         * SEARCH
         *
         * Search through important product
         * fields, including name, description,
         * category, seller and location.
         */

        let searchMatches = true;


        if (normalizedSearch) {

            const searchableText = [

                getProductName(product),

                product.description,

                product.shortDescription,

                product.category,

                getProductSeller(product),

                getProductCountry(product),

                getProductRegion(product),

                getProductCity(product),

                getProductArea(product),

                product.sku,

                product.brand,

                product.tags

            ]
                .map(value =>
                    normalizeText(value)
                )
                .join(" ");


            searchMatches =
                searchableText.includes(
                    normalizedSearch
                );

        }


        return (
            categoryMatches &&
            countryMatches &&
            regionMatches &&
            searchMatches
        );

    }
);

}

/* ==========================================================
SORT PRODUCTS
========================================================== */

function sortProducts(products) {

const result =
    [...products];


if (
    selectedSort === "random"
) {

    return shuffleArray(
        result
    );

}


if (
    selectedSort === "price-low"
) {

    return result.sort(
        (a, b) =>
            getProductPrice(a) -
            getProductPrice(b)
    );

}


if (
    selectedSort === "price-high"
) {

    return result.sort(
        (a, b) =>
            getProductPrice(b) -
            getProductPrice(a)
    );

}


if (
    selectedSort === "popular"
) {

    return result.sort(
        (a, b) => {

            const scoreA =
                getProductViews(a) +
                getProductSales(a) * 10;

            const scoreB =
                getProductViews(b) +
                getProductSales(b) * 10;

            return scoreB - scoreA;

        }
    );

}


if (
    selectedSort === "newest"
) {

    return result.sort(
        (a, b) => {

            const dateA =
                getTimestampValue(
                    a.createdAt
                );

            const dateB =
                getTimestampValue(
                    b.createdAt
                );

            return dateB - dateA;

        }
    );

}


return result;

}

/* ==========================================================
GET FIRESTORE TIMESTAMP VALUE
========================================================== */

function getTimestampValue(value) {

if (!value) {
    return 0;
}


if (
    typeof value.toMillis === "function"
) {

    return value.toMillis();

}


if (
    value.seconds !== undefined
) {

    return (
        Number(value.seconds) * 1000
    );

}


const date =
    new Date(value);

const time =
    date.getTime();

return Number.isFinite(time)
    ? time
    : 0;

}

/* ==========================================================
   GET DISPLAY PRODUCTS
========================================================== */

function getDisplayProducts() {

    const filtered =
        filterProducts();


    /*
     * SEARCH MODE
     *
     * Search still shows all matching products.
     * Selected country is prioritized first.
     */

    if (searchTerm) {

        isSearchMode = true;

        return sortBySelectedCountry(
            sortProducts(
                filtered
            )
        );

    }


    /*
     * NORMAL BROWSING
     *
     * Selected country first.
     * Other countries remain visible.
     */

    isSearchMode = false;


    let sorted =
        sortProducts(
            filtered
        );


    sorted =
        sortBySelectedCountry(
            sorted
        );


    return sorted.slice(
        0,
        100
    );

}



/* ==========================================================
GET LOCATION LABEL
========================================================== */

function getLocationLabel(product) {

const city =
    getProductCity(product);

const region =
    getProductRegion(product);

const country =
    getProductCountry(product);


const parts = [];


if (city) {

    parts.push(
        String(city)
    );

}


if (region) {

    parts.push(
        String(region)
    );

}


if (country) {

    parts.push(
        String(country).toUpperCase()
    );

}


return parts.join(", ");

}

/* ==========================================================
CREATE PRODUCT CARD
========================================================== */

function createProductCard(
product,
index = 0
) {

const id =
    product.id;


const name =
    getProductName(product);


const image =
    getProductImage(product);


const price =
    getProductPrice(product);


const oldPrice =
    getOldPrice(product);


const discount =
    getProductDiscount(product);


const rating =
    getProductRating(product);


const location =
    getLocationLabel(product);


const seller =
    getProductSeller(product);


const views =
    getProductViews(product);


const sales =
    getProductSales(product);


const category =
    getProductCategory(product);


let badge =
    "";


if (
    product.featured === true ||
    product.isFeatured === true
) {

    badge =
        `<span class="product-badge">Featured</span>`;

} else if (
    sales >= 10
) {

    badge =
        `<span class="product-badge">Popular</span>`;

} else if (
    index % 7 === 0
) {

    badge =
        `<span class="product-badge">New</span>`;

}


const discountHTML =
    discount > 0
        ? `
            <span class="product-discount">
                -${discount}%
            </span>
          `
        : "";


const oldPriceHTML =
    oldPrice > 0
        ? `
            <span class="product-old-price">
                ${formatMoney(
                    oldPrice,
                    product
                )}
            </span>
          `
        : "";


const ratingHTML =
    rating > 0
        ? `
            <span class="product-rating">
                ★ ${rating.toFixed(1)}
            </span>
          `
        : `
            <span class="product-rating">
                New
            </span>
          `;


const locationHTML =
    location
        ? `
            <span class="product-location">
                📍 ${escapeHTML(location)}
            </span>
          `
        : "";


const sellerHTML =
    `
        <div class="product-seller">
            ${escapeHTML(seller)}
        </div>
    `;


const stock =
    Number(
        product.stock ?? 0
    );


const stockHTML =
    stock > 0
        ? `
            <div class="product-stock">
                ${stock} available
            </div>
          `
        : "";


return `

    <article
        class="product-card"
        data-product-id="${escapeHTML(id)}"
        data-category="${escapeHTML(category)}"
    >

        <a
            href="product.html?id=${encodeURIComponent(id)}"
            class="product-card-link"
        >

            <div class="product-image-wrapper">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    class="product-image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/600x600?text=No+Image'"
                >

                ${badge}

                ${discountHTML}

            </div>


            <div class="product-card-body">

                <div class="product-name">
                    ${escapeHTML(name)}
                </div>


                <div class="product-price">

                    ${formatMoney(
                        price,
                        product
                    )}

                    ${oldPriceHTML}

                </div>


                <div class="product-meta">

                    ${ratingHTML}

                    ${locationHTML}

                </div>


                ${sellerHTML}

                ${stockHTML}

            </div>

        </a>

    </article>

`;

}

/* ==========================================================
RENDER PRODUCTS
========================================================== */

function renderProducts() {

if (!productsContainer) {
    return;
}


productsContainer.innerHTML = "";


hideElement(
    productsEmpty
);


hideElement(
    productsError
);


showElement(
    productsLoading
);


const products =
    getDisplayProducts();


hideElement(
    productsLoading
);


if (productCount) {

    const total =
        filterProducts().length;

    productCount.textContent =
        `${total.toLocaleString()} product${total === 1 ? "" : "s"}`;

}


if (displayLimitText) {

    if (searchTerm) {

        displayLimitText.textContent =
            "Showing all matching products";

    } else {

        displayLimitText.textContent =
            "Showing up to 100";

    }

}


if (!products.length) {

    showElement(
        productsEmpty
    );


    if (emptyMessage) {

        if (searchTerm) {

            emptyMessage.textContent =
                `No products found for "${searchTerm}".`;

        } else {

            emptyMessage.textContent =
                "No products match the selected category, country or region.";

        }

    }

    return;

}


const fragment =
    document.createDocumentFragment();


products.forEach(
    (product, index) => {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.innerHTML =
            createProductCard(
                product,
                index
            );


        const card =
            wrapper.firstElementChild;


        if (card) {

            fragment.appendChild(
                card
            );

        }

    }
);


productsContainer.appendChild(
    fragment
);


productsContainer.className =
    `products-container product-style-${selectedStyle}`;


if (
    productsHeading
) {

    productsHeading.textContent =
        searchTerm
            ? "Search Results"
            : (
                CATEGORY_NAMES[selectedCategory] ||
                "Products"
            );
            }


updateSearchStatus(
    filterProducts().length
);

}

/* ==========================================================
RENDER FEATURED PRODUCTS
========================================================== */

function renderFeaturedProducts() {

if (!featuredProducts) {
    return;
}


const featured =
    allProducts.filter(
        product =>
            isProductActive(product) &&
            (
                product.featured === true ||
                product.isFeatured === true
            )
    );


if (!featured.length) {

    hideElement(
        featuredProductsSection
    );

    return;

}


showElement(
    featuredProductsSection
);


const products =
    shuffleArray(
        featured
    ).slice(0, 4);


featuredProducts.innerHTML =
    products
        .map(
            (product, index) =>
                createProductCard(
                    product,
                    index
                )
        )
        .join("");

}

/* ==========================================================
RENDER DEAL PRODUCTS
========================================================== */

function renderDealsProducts() {

if (!dealsProducts) {
    return;
}


const deals =
    allProducts.filter(
        product =>
            isProductActive(product) &&
            getProductDiscount(product) > 0
    );


if (!deals.length) {

    hideElement(
        dealsProductsSection
    );

    return;

}


showElement(
    dealsProductsSection
);


const products =
    shuffleArray(
        deals
    ).slice(0, 4);


dealsProducts.innerHTML =
    products
        .map(
            (product, index) =>
                createProductCard(
                    product,
                    index
                )
        )
        .join("");

}

/* ==========================================================
RECENTLY VIEWED
========================================================== */

function loadRecentlyViewed() {

if (!recentProducts) {
    return;
}


let ids = [];


try {

    ids =
        JSON.parse(
            localStorage.getItem(
                "neostoreRecentlyViewed"
            ) || "[]"
        );

} catch (error) {

    ids = [];

}


if (!Array.isArray(ids)) {

    ids = [];

}


const viewed =
    ids
        .map(
            id =>
                allProducts.find(
                    product =>
                        product.id === id
                )
        )
        .filter(Boolean)
        .slice(0, 5);


if (!viewed.length) {

    hideElement(
        recentProductsSection
    );

    return;

}


showElement(
    recentProductsSection
);


recentProducts.innerHTML =
    viewed
        .map(
            (product, index) =>
                createProductCard(
                    product,
                    index
                )
        )
        .join("");

}

/* ==========================================================
UPDATE SEARCH STATUS
========================================================== */

function updateSearchStatus(
totalResults
) {

if (!searchStatus) {
    return;
}


if (searchTerm) {

    searchStatus.textContent =
        `${totalResults.toLocaleString()} matching product${totalResults === 1 ? "" : "s"} found`;

    return;

}


searchStatus.textContent =
    "";

}

/* ==========================================================
RENDER CATEGORY OPTIONS
========================================================== */

function renderCategoryOptions() {

if (!categoryFilterOptions) {
    return;
}


categoryFilterOptions.innerHTML =
    Object.entries(
        CATEGORY_NAMES
    )
        .map(
            ([value, label]) => `
                <button
                    type="button"
                    class="filter-option ${
                        selectedCategory === value
                            ? "selected"
                            : ""
                    }"
                    data-select-category="${escapeHTML(value)}"
                >
                    ${escapeHTML(label)}
                </button>
            `
        )
        .join("");

}

/* ==========================================================
GET AVAILABLE COUNTRIES
========================================================== */

function getAvailableCountries() {

const countries =
    new Set();


allProducts.forEach(
    product => {

        const country =
            getProductCountry(
                product
            );

        if (country) {

            countries.add(
                country
            );

        }

    }
);


return Array.from(
    countries
).sort();

}

/* ==========================================================
RENDER COUNTRY OPTIONS
========================================================== */

function renderCountryOptions(
search = ""
) {

if (!countryFilterOptions) {
    return;
}


const normalizedSearch =
    normalizeText(
        search
    );


const countries =
    getAvailableCountries()
        .filter(
            country =>
                !normalizedSearch ||
                country.includes(
                    normalizedSearch
                )
        );


let html = `

    <button
        type="button"
        class="filter-option ${
            selectedCountry === "all"
                ? "selected"
                : ""
        }"
        data-select-country="all"
    >
        All Countries
    </button>

`;


html +=
    countries
        .map(
            country => `
                <button
                    type="button"
                    class="filter-option ${
                        selectedCountry === country
                            ? "selected"
                            : ""
                    }"
                    data-select-country="${escapeHTML(country)}"
                >
                    ${escapeHTML(
                        country.toUpperCase()
                    )}
                </button>
            `
        )
        .join("");


countryFilterOptions.innerHTML =
    html;

}


/* ==========================================================
GET AVAILABLE REGIONS
========================================================== */

function getAvailableRegions() {

const regions =
    new Set();


allProducts.forEach(
    product => {

        const country =
            getProductCountry(
                product
            );


        const region =
            getProductRegion(
                product
            );


        if (
            region &&
            (
                selectedCountry === "all" ||
                country === selectedCountry
            )
        ) {

            regions.add(
                region
            );

        }

    }
);


return Array.from(
    regions
).sort();

}

/* ==========================================================
RENDER REGION OPTIONS
========================================================== */

function renderRegionOptions(
search = ""
) {

if (!regionFilterOptions) {
    return;
}


const normalizedSearch =
    normalizeText(
        search
    );


const regions =
    getAvailableRegions()
        .filter(
            region =>
                !normalizedSearch ||
                region.includes(
                    normalizedSearch
                )
        );


let html = `

    <button
        type="button"
        class="filter-option ${
            selectedRegion === "all"
                ? "selected"
                : ""
        }"
        data-select-region="all"
    >
        All Regions
    </button>

`;


html +=
    regions
        .map(
            region => `
                <button
                    type="button"
                    class="filter-option ${
                        selectedRegion === region
                            ? "selected"
                            : ""
                    }"
                    data-select-region="${escapeHTML(region)}"
                >
                    ${escapeHTML(
                        region
                    )}
                </button>
            `
        )
        .join("");


regionFilterOptions.innerHTML =
    html;

}

/* ==========================================================
UPDATE ACTIVE FILTERS
========================================================== */

function updateActiveFilters() {

if (!activeFilters) {
    return;
}


const filters = [];


if (
    selectedCategory !== "all"
) {

    filters.push({
        type: "category",
        label:
            CATEGORY_NAMES[
                selectedCategory
            ] ||
            selectedCategory
    });

}


if (
    selectedCountry !== "all"
) {

    filters.push({
        type: "country",
        label:
            selectedCountry.toUpperCase()
    });

}


if (
    selectedRegion !== "all"
) {

    filters.push({
        type: "region",
        label:
            selectedRegion
    });

}


if (searchTerm) {

    filters.push({
        type: "search",
        label:
            `"${searchTerm}"`
    });

}


activeFilters.innerHTML =
    filters
        .map(
            filter => `
                <span class="active-filter">

                    ${escapeHTML(
                        filter.label
                    )}

                    <button
                        type="button"
                        data-remove-filter="${escapeHTML(filter.type)}"
                        aria-label="Remove filter"
                    >
                        ×
                    </button>

                </span>
            `
        )
        .join("");

}

/* ==========================================================
UPDATE LOCATION INFORMATION
========================================================== */

function updateLocationInformation() {

if (!categoryLocationInfo) {
    return;
}


const parts = [];


if (
    selectedCountry !== "all"
) {

    parts.push(
        `🌍 ${selectedCountry.toUpperCase()}`
    );

}


if (
    selectedRegion !== "all"
) {

    parts.push(
        `📍 ${selectedRegion}`
    );

}


categoryLocationInfo.innerHTML =
    parts
        .map(
            part =>
                `<span>${escapeHTML(part)}</span>`
        )
        .join("");

}

/* ==========================================================
UPDATE FILTER UI
========================================================== */

function updateFilterUI() {

renderCategoryOptions();

renderCountryOptions(
    countrySearch?.value || ""
);

renderRegionOptions(
    regionSearch?.value || ""
);

updateActiveFilters();

updateLocationInformation();

}

/* ==========================================================
SHOW ELEMENT
========================================================== */

function showElement(
element
) {

if (!element) {
    return;
}

element.hidden = false;

element.classList.remove(
    "hidden"
);

}

/* ==========================================================
HIDE ELEMENT
========================================================== */

function hideElement(
element
) {

if (!element) {
    return;
}

element.hidden = true;

element.classList.add(
    "hidden"
);

}

/* ==========================================================
OPEN FILTER PANEL
========================================================== */

function openFilterPanel(
panel
) {

closeAllFilterPanels();

if (!panel) {
    return;
}

panel.classList.add(
    "open"
);

}

/* ==========================================================
CLOSE FILTER PANEL
========================================================== */

function closeFilterPanel(
panel
) {

if (!panel) {
    return;
}

panel.classList.remove(
    "open"
);

}

/* ==========================================================
CLOSE ALL FILTER PANELS
========================================================== */

function closeAllFilterPanels() {

[
    categoryFilterPanel,
    countryFilterPanel,
    regionFilterPanel,
    sortFilterPanel,
    styleFilterPanel
]
    .forEach(
        panel =>
            panel?.classList.remove(
                "open"
            )
    );

}

/* ==========================================================
SET CATEGORY
========================================================== */

function setCategory(
category
) {

selectedCategory =
    normalizeText(
        category
    ) || "all";


selectedSort =
    "random";


closeAllFilterPanels();

updatePageInformation();

updateFilterUI();

renderProducts();

}

/* ==========================================================
   SET COUNTRY
========================================================== */

function setCountry(country) {

    selectedCountry =
        normalizeText(
            country
        ) || "all";


    /*
     * When changing country,
     * reset the previous region.
     */

    selectedRegion =
        "all";


    /*
     * Save country for BOTH pages.
     */

    try {

        const savedLocation =
            JSON.parse(
                localStorage.getItem(
                    "neoStoreBuyerLocation"
                ) || "{}"
            );


        const updatedLocation = {

            ...savedLocation,

            country:
                country === "all"
                    ? ""
                    : country,

            region: ""

        };


        localStorage.setItem(
            "neoStoreBuyerLocation",
            JSON.stringify(
                updatedLocation
            )
        );

    } catch (error) {

        console.error(
            "Could not save country:",
            error
        );

    }


    closeAllFilterPanels();

    updatePageInformation();

    updateFilterUI();

    renderProducts();

}


/* ==========================================================
   SORT BY SELECTED COUNTRY FIRST
========================================================== */

function sortBySelectedCountry(products) {

    const selected =
        normalizeText(
            selectedCountry
        );


    if (
        !selected ||
        selected === "all"
    ) {

        return products;

    }


    return [...products].sort(
        (a, b) => {

            const countryA =
                getProductCountry(a);

            const countryB =
                getProductCountry(b);


            const aMatches =
                countryA === selected;

            const bMatches =
                countryB === selected;


            if (
                aMatches &&
                !bMatches
            ) {

                return -1;

            }


            if (
                !aMatches &&
                bMatches
            ) {

                return 1;

            }


            return 0;

        }
    );

}



/* ==========================================================
SET REGION
========================================================== */

function setRegion(
region
) {

selectedRegion =
    normalizeText(
        region
    ) || "all";


closeAllFilterPanels();

updatePageInformation();

updateFilterUI();

renderProducts();

}

/* ==========================================================
PERFORM SEARCH
========================================================== */

function performSearch() {

searchTerm =
    productSearch?.value.trim() ||
    "";


isSearchMode =
    searchTerm.length > 0;


updatePageInformation();

updateFilterUI();

renderProducts();


if (
    searchTerm &&
    window.history &&
    window.history.replaceState
) {

    const params =
        new URLSearchParams();


    if (
        selectedCategory !== "all"
    ) {

        params.set(
            "category",
            selectedCategory
        );

    }


    if (
        selectedCountry !== "all"
    ) {

        params.set(
            "country",
            selectedCountry
        );

    }


    if (
        selectedRegion !== "all"
    ) {

        params.set(
            "region",
            selectedRegion
        );

    }


    params.set(
        "search",
        searchTerm
    );


    window.history.replaceState(
        {},
        "",
        `category.html?${params.toString()}`
    );

}

}

/* ==========================================================
CLEAR SEARCH
========================================================== */

function clearSearch() {

searchTerm = "";

isSearchMode = false;


if (productSearch) {

    productSearch.value =
        "";

}


updatePageInformation();

updateFilterUI();

renderProducts();

}

/* ==========================================================
CLEAR ALL FILTERS
========================================================== */

function clearAllFilters() {

selectedCategory = "all";

selectedCountry = "all";

selectedRegion = "all";

selectedSort = "random";

searchTerm = "";

isSearchMode = false;


if (productSearch) {

    productSearch.value =
        "";

}


updatePageInformation();

updateFilterUI();

renderProducts();


if (
    window.history &&
    window.history.replaceState
) {

    window.history.replaceState(
        {},
        "",
        "category.html"
    );

}

}

/* ==========================================================
SET SORT
========================================================== */

function setSort(
sort
) {

selectedSort =
    sort || "random";


document
    .querySelectorAll(
        ".sort-option"
    )
    .forEach(
        option => {

            option.classList.toggle(
                "selected",
                option.dataset.sort ===
                    selectedSort
            );

        }
    );


closeAllFilterPanels();

renderProducts();

}

/* ==========================================================
SET PRODUCT STYLE
========================================================== */

function setProductStyle(
style
) {

const validStyles = [

    "mixed",
    "grid",
    "compact",
    "featured",
    "horizontal",
    "deals",
    "minimal",
    "marketplace",
    "location",
    "list"

];


if (
    !validStyles.includes(
        style
    )
) {

    style =
        "mixed";

}


selectedStyle =
    style;


productsContainer.className =
    `products-container product-style-${selectedStyle}`;


document
    .querySelectorAll(
        ".style-option"
    )
    .forEach(
        option => {

            option.classList.toggle(
                "selected",
                option.dataset.style ===
                    selectedStyle
            );

        }
    );


closeAllFilterPanels();

}

/* ==========================================================
REMOVE ONE FILTER
========================================================== */

function removeFilter(
type
) {

if (
    type === "category"
) {

    selectedCategory =
        "all";

}


if (
    type === "country"
) {

    selectedCountry =
        "all";

}


if (
    type === "region"
) {

    selectedRegion =
        "all";

}


if (
    type === "search"
) {

    searchTerm =
        "";

    if (productSearch) {

        productSearch.value =
            "";

    }

}


updatePageInformation();

updateFilterUI();

renderProducts();

}

/* ==========================================================
LOAD ALL PRODUCTS
========================================================== */

async function loadAllProducts() {

showElement(
    pageLoader
);


showElement(
    productsLoading
);


hideElement(
    productsEmpty
);


hideElement(
    productsError
);


try {

    const productsRef =
        collection(
            db,
            "products"
        );


    const snapshot =
        await getDocs(
            productsRef
        );


    allProducts = [];


    snapshot.forEach(
        productDoc => {

            const data =
                productDoc.data();


            if (
                !isProductActive(
                    data
                )
            ) {

                return;

            }


            allProducts.push({

                id:
                    productDoc.id,

                ...data

            });

        }
    );


    /*
     * Randomize the complete catalog
     * immediately after loading.
     *
     * This means normal browsing can show
     * different products after reload.
     */

    allProducts =
        shuffleArray(
            allProducts
        );


    updatePageInformation();

    updateFilterUI();

    renderFeaturedProducts();

    renderDealsProducts();

    renderProducts();

    loadRecentlyViewed();


    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


} catch (error) {

    console.error(
        "Failed to load products:",
        error
    );


    showElement(
        productsError
    );


    if (errorMessage) {

        errorMessage.textContent =
            "We could not load the products. Please check your connection and try again.";

    }

} finally {

    hideElement(
        productsLoading
    );


    setTimeout(
        () => {

            hideElement(
                pageLoader
            );

        },
        250
    );

}

}

/* ==========================================================
RETRY
========================================================== */

function retryLoadingProducts() {

loadAllProducts();

}

/* ==========================================================
BACK BUTTON
========================================================== */

function goBack() {

if (
    window.history.length > 1
) {

    window.history.back();

} else {

    window.location.href =
        "index.html";

}

}

/* ==========================================================
BACK TO TOP
========================================================== */

function handleBackToTop() {

if (!backToTopButton) {
    return;
}


if (
    window.scrollY > 400
) {

    backToTopButton.classList.add(
        "visible"
    );

} else {

    backToTopButton.classList.remove(
        "visible"
    );

}

}


/* ==========================================================
EVENT: CATEGORY FILTER BUTTON
========================================================== */

if (categoryFilterButton) {

categoryFilterButton.addEventListener(
    "click",
    () => {

        renderCategoryOptions();

        openFilterPanel(
            categoryFilterPanel
        );

    }
);

}

/* ==========================================================
EVENT: COUNTRY FILTER BUTTON
========================================================== */

if (countryFilterButton) {

countryFilterButton.addEventListener(
    "click",
    () => {

        renderCountryOptions(
            countrySearch?.value || ""
        );

        openFilterPanel(
            countryFilterPanel
        );

    }
);

}

/* ==========================================================
EVENT: REGION FILTER BUTTON
========================================================== */

if (regionFilterButton) {

regionFilterButton.addEventListener(
    "click",
    () => {

        renderRegionOptions(
            regionSearch?.value || ""
        );

        openFilterPanel(
            regionFilterPanel
        );

    }
);

}

/* ==========================================================
EVENT: SORT BUTTON
========================================================== */

if (sortButton) {

sortButton.addEventListener(
    "click",
    () => {

        openFilterPanel(
            sortFilterPanel
        );

    }
);

}

/* ==========================================================
EVENT: STYLE BUTTON
========================================================== */

if (styleButton) {

styleButton.addEventListener(
    "click",
    () => {

        openFilterPanel(
            styleFilterPanel
        );

    }
);

}

/* ==========================================================
EVENT: SEARCH BUTTON
========================================================== */

if (searchButton) {

searchButton.addEventListener(
    "click",
    performSearch
);

}

/* ==========================================================
EVENT: SEARCH ENTER
========================================================== */

if (productSearch) {

productSearch.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            performSearch();

        }

    }
);

}

/* ==========================================================
EVENT: CLEAR SEARCH
========================================================== */

if (clearSearchButton) {

clearSearchButton.addEventListener(
    "click",
    clearSearch
);

}

/* ==========================================================
EVENT: COUNTRY SEARCH
========================================================== */

if (countrySearch) {

countrySearch.addEventListener(
    "input",
    () => {

        renderCountryOptions(
            countrySearch.value
        );

    }
);

}

/* ==========================================================
EVENT: REGION SEARCH
========================================================== */

if (regionSearch) {

regionSearch.addEventListener(
    "input",
    () => {

        renderRegionOptions(
            regionSearch.value
        );

    }
);

}

/* ==========================================================
EVENT: CLOSE FILTER BUTTONS
========================================================== */

document.addEventListener(
"click",
event => {

    const closeButton =
        event.target.closest(
            "[data-close-filter]"
        );


    if (!closeButton) {
        return;
    }


    const panelId =
        closeButton.dataset.closeFilter;


    closeFilterPanel(
        document.getElementById(
            panelId
        )
    );

}

);

/* ==========================================================
EVENT: CATEGORY OPTIONS
========================================================== */

document.addEventListener(
"click",
event => {

    const button =
        event.target.closest(
            "[data-select-category]"
        );


    if (!button) {
        return;
    }


    setCategory(
        button.dataset.selectCategory
    );

}

);

/* ==========================================================
EVENT: COUNTRY OPTIONS
========================================================== */

document.addEventListener(
"click",
event => {

    const button =
        event.target.closest(
            "[data-select-country]"
        );


    if (!button) {
        return;
    }


    setCountry(
        button.dataset.selectCountry
    );

}

);

/* ==========================================================
EVENT: REGION OPTIONS
========================================================== */

document.addEventListener(
"click",
event => {

    const button =
        event.target.closest(
            "[data-select-region]"
        );


    if (!button) {
        return;
    }


    setRegion(
        button.dataset.selectRegion
    );

}

);

/* ==========================================================
EVENT: SORT OPTIONS
========================================================== */

document.addEventListener(
"click",
event => {

    const button =
        event.target.closest(
            "[data-sort]"
        );


    if (!button) {
        return;
    }


    setSort(
        button.dataset.sort
    );

}

);

/* ==========================================================
EVENT: STYLE OPTIONS
========================================================== */

document.addEventListener(
"click",
event => {

    const button =
        event.target.closest(
            "[data-style]"
        );


    if (!button) {
        return;
    }


    setProductStyle(
        button.dataset.style
    );

}

);

/* ==========================================================
EVENT: ACTIVE FILTER REMOVE
========================================================== */

document.addEventListener(
"click",
event => {

    const button =
        event.target.closest(
            "[data-remove-filter]"
        );


    if (!button) {
        return;
    }


    removeFilter(
        button.dataset.removeFilter
    );

}

);

/* ==========================================================
EVENT: CLEAR ALL FILTERS
========================================================== */

if (clearFiltersButton) {

clearFiltersButton.addEventListener(
    "click",
    clearAllFilters
);

}

/* ==========================================================
EVENT: RETRY
========================================================== */

if (retryProductsButton) {

retryProductsButton.addEventListener(
    "click",
    retryLoadingProducts
);

}

/* ==========================================================
EVENT: BACK
========================================================== */

if (backButton) {

backButton.addEventListener(
    "click",
    goBack
);

}

/* ==========================================================
EVENT: BACK TO TOP
========================================================== */

if (backToTopButton) {

backToTopButton.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);

}

/* ==========================================================
EVENT: WINDOW SCROLL
========================================================== */

window.addEventListener(
"scroll",
handleBackToTop,
{
passive: true
}
);

/* ==========================================================
INITIALIZE
========================================================== */

readURLParameters();

updatePageInformation();

updateFilterUI();

setProductStyle(
selectedStyle
);

loadAllProducts();

