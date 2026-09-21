/* ==========================================================
   NEOSTORE HOME
========================================================== */

import {
    auth,
    db
} from "./firebase.js";

import "./currency.js";

/* ==========================================================
   CATEGORY DATABASE
========================================================== */

const categories = [

    ["Phones & Smartphones", "smartphone"],
    ["Laptops", "laptop"],
    ["Tablets", "tablet"],
    ["Mobile Accessories", "phone accessories"],
    ["Computers", "computer"],
    ["Computer Accessories", "computer accessories"],
    ["Televisions", "television"],
    ["Audio & Speakers", "speaker"],
    ["Headphones", "headphones"],
    ["Cameras", "camera"],

    ["Men's Fashion", "mens fashion"],
    ["Women's Fashion", "womens fashion"],
    ["Children's Fashion", "kids fashion"],
    ["Shoes", "shoes"],
    ["Sneakers", "sneakers"],
    ["Bags", "bags"],
    ["Watches", "watches"],
    ["Jewelry", "jewelry"],
    ["Sunglasses", "sunglasses"],
    ["Underwear", "underwear"],

    ["Beauty", "beauty products"],
    ["Skincare", "skincare"],
    ["Hair Care", "hair care"],
    ["Makeup", "makeup"],
    ["Perfumes", "perfume"],
    ["Men's Grooming", "mens grooming"],
    ["Bath & Body", "bath products"],
    ["Personal Care", "personal care"],
    ["Hair Extensions", "hair extensions"],
    ["Nail Care", "nail care"],

    ["Home & Living", "home interior"],
    ["Furniture", "furniture"],
    ["Bedroom", "bedroom"],
    ["Kitchen", "kitchen"],
    ["Dining", "dining room"],
    ["Bathroom", "bathroom"],
    ["Home Decor", "home decor"],
    ["Lighting", "lighting"],
    ["Curtains", "curtains"],
    ["Storage & Organization", "storage"],

    ["Appliances", "home appliances"],
    ["Refrigerators", "refrigerator"],
    ["Washing Machines", "washing machine"],
    ["Microwaves", "microwave"],
    ["Blenders", "blender"],
    ["Air Conditioners", "air conditioner"],
    ["Fans", "electric fan"],
    ["Cookers", "cooker"],
    ["Coffee Machines", "coffee machine"],
    ["Vacuum Cleaners", "vacuum cleaner"],

    ["Automotive", "car"],
    ["Car Accessories", "car accessories"],
    ["Car Parts", "car parts"],
    ["Motorcycles", "motorcycle"],
    ["Motorcycle Accessories", "motorcycle accessories"],
    ["Tyres & Wheels", "car tire"],
    ["Tools", "tools"],
    ["Car Electronics", "car electronics"],
    ["Car Care", "car wash"],
    ["Vehicle Lighting", "car lights"],

    ["Health", "Health and Supplements", "Health and Wellness", "health products"],
    ["Vitamins", "vitamins"],
    ["Supplements", "supplements"],
    ["Medical Equipment", "medical equipment"],
    ["Fitness", "fitness"],
    ["Exercise Equipment", "exercise equipment"],
    ["Sportswear", "sportswear"],
    ["Running", "running shoes"],
    ["Cycling", "cycling"],
    ["Outdoor Sports", "outdoor sports"],

    ["Baby Products", "baby products"],
    ["Baby Clothing", "baby clothes"],
    ["Baby Feeding", "baby feeding"],
    ["Baby Toys", "baby toys"],
    ["Toys", "toys"],
    ["Games", "board games"],
    ["Educational Toys", "educational toys"],
    ["School Supplies", "school supplies"],
    ["Books", "books"],
    ["Musical Instruments", "musical instrument"],

    ["Groceries", "grocery store"],
    ["Food", "food"],
    ["Beverages", "beverages"],
    ["Snacks", "snacks"],
    ["Fresh Produce", "fresh vegetables"],
    ["Meat & Seafood", "seafood"],
    ["Bakery", "bakery"],
    ["Cooking Ingredients", "cooking ingredients"],
    ["Pet Supplies", "pet supplies"],
    ["Office Supplies", "office supplies"],

    ["Industrial Equipment", "industrial equipment"],
    ["Agricultural Equipment", "farm equipment"],
    ["Farm Products", "farm products"],
    ["Construction", "construction"],
    ["Electrical Equipment", "electrical equipment"],
    ["Security Equipment", "security camera"],
    ["Solar Products", "solar panels"],
    ["Generators", "generator"],
    ["Business Equipment", "business equipment"],
    ["Other Products", "shopping marketplace"]

];


/* ==========================================================
   CREATE UNIQUE IMAGE
========================================================== */

function getCategoryImage(
    keyword,
    index
) {

    return (
        "https://loremflickr.com/700/600/" +
        encodeURIComponent(keyword) +
        "?lock=" +
        (index + 1)
    );

}


/* ==========================================================
   CREATE CATEGORY OBJECTS
========================================================== */

const categoryData =
    categories.map(
        (
            item,
            index
        ) => {

            return {

                id:
                    index + 1,

                name:
                    item[0],

                keyword:
                    item[1],

                image:
                    getCategoryImage(
                        item[1],
                        index
                    )

            };

        }
    );



/* ==========================================================
   CATEGORY URL WITH SAVED COUNTRY
========================================================== */

function categoryURL(category) {

    const params =
        new URLSearchParams();


    params.set(
        "category",
        category.name
    );


    /*
     * Read the country chosen on home page.
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

            params.set(
                "country",
                savedLocation.country
            );

        }


        if (
            savedLocation &&
            savedLocation.region
        ) {

            params.set(
                "region",
                savedLocation.region
            );

        }

    } catch (error) {

        console.error(
            "Could not read saved location:",
            error
        );

    }


    return (
        "category.html?" +
        params.toString()
    );

}



/* ==========================================================
   ESCAPE HTML
========================================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

function renderCircleCategories() {

    const container =
        document.getElementById(
            "circleCategories"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            0,
            12
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="circle-card"
                    >

                        <div class="circle-image">

                            <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        </div>

                        <span>
                            ${escapeHTML(category.name)}
                        </span>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   STYLE 2 — MOVIE
========================================================== */

function renderMovieCategories() {

    const container =
        document.getElementById(
            "movieTrack"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            10,
            22
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="movie-card"
                    >

                      <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >
                            
                        <div class="movie-card-content">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                            <p>
                                Explore products →
                            </p>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   STYLE 3 — 3D
========================================================== */

function renderThreeD() {

    const container =
        document.getElementById(
            "threeDGrid"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            22,
            30
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="three-card"
                    >

                        <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        <div class="three-card-content">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   STYLE 4 — BENTO
========================================================== */

function renderBento() {

    const container =
        document.getElementById(
            "bentoGrid"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            30,
            38
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="bento-card"
                    >

                        <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        <div class="bento-card-content">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   STYLE 5 — GLASS
========================================================== */

function renderGlass() {

    const container =
        document.getElementById(
            "glassGrid"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            38,
            50
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="glass-card"
                    >

                     <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        <div class="glass-card-content">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                            <p>
                                Shop now
                            </p>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   STYLE 6 — STACKED
========================================================== */

function renderStacked() {

    const container =
        document.getElementById(
            "stackedContainer"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            50,
            53
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="stacked-card"
                    >

                        <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        <div class="stacked-card-content">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   STYLE 7 — GRADIENT
========================================================== */

function renderGradient() {

    const container =
        document.getElementById(
            "gradientGrid"
        );


    if (!container) {

        return;

    }


    const selected =
        categoryData.slice(
            53,
            61
        );


    container.innerHTML =
        selected.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="gradient-card"
                    >

                     <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        <div class="gradient-card-content">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                            <span>
                                Discover →
                            </span>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   SIDEBAR
========================================================== */

function renderSidebar() {

    const container =
        document.getElementById(
            "sidebarCategories"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        categoryData
            .slice(0, 15)
            .map(
                category => {

                    return `

                        <a
                            class="sidebar-category"
                            href="${categoryURL(category)}"
                        >

                           <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                            <span>
                                ${escapeHTML(category.name)}
                            </span>

                        </a>

                    `;

                }
            )
            .join("");

}


/* ==========================================================
   ALL 96 CATEGORIES
========================================================== */

function renderAllCategories() {

    const container =
        document.getElementById(
            "allCategoryGrid"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        categoryData.map(
            category => {

                return `

                    <a
                        href="${categoryURL(category)}"
                        class="directory-card"
                    >

                        <div class="directory-card-image">

                          <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        </div>

                        <div class="directory-card-info">

                            <h3>
                                ${escapeHTML(category.name)}
                            </h3>

                            <span>
                                Explore products
                            </span>

                        </div>

                    </a>

                `;

            }
        ).join("");

}


/* ==========================================================
   COUNTRIES
========================================================== */

const countries = [

    ["NG", "Nigeria"],
["GH", "Ghana"],
["KE", "Kenya"],
["ZA", "South Africa"],
["EG", "Egypt"],
["US", "United States"],
["GB", "United Kingdom"],
["CA", "Canada"],
["DE", "Germany"],
["FR", "France"],
["IN", "India"],
["AE", "United Arab Emirates"],

];


function renderCountries() {

    const container =
        document.getElementById(
            "countryGrid"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        countries.map(
            (
                country,
                index
            ) => {

                const image =
                    `https://loremflickr.com/700/500/${encodeURIComponent(country[1])}?lock=${200 + index}`;


                return `

                    <a
                        href="category.html?country=${encodeURIComponent(country[0])}"
                        class="country-card"
                    >

                        <img
                            src="${image}"
                            alt="${escapeHTML(country[0])}"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='https://loremflickr.com/700/500/shopping?lock=${200 + index}';"
                        >

                        <span>
                            ${escapeHTML(country[0])}
                        </span>

                    </a>

                `;

            }
        ).join("");

}



/* ==========================================================
   FLASH PRODUCTS
========================================================== */

function renderFlashProducts() {

    const container =
        document.getElementById(
            "flashProducts"
        );


    if (!container) {

        return;

    }


    const products =
        categoryData.slice(
            61,
            66
        );


    container.innerHTML =
        products.map(
            (
                category,
                index
            ) => {

                const price =
                    15.62 +
                    (
                        index *
                        17.52
                    );


                return `

                    <a
                        href="${categoryURL(category)}"
                        class="flash-product"
                    >

                        <div class="flash-product-image">

                            <img
                                src="${category.image}"
                                alt="${escapeHTML(category.name)}"
                                loading="lazy"
                                onerror="this.onerror=null; this.src='https://loremflickr.com/700/600/shopping?lock=${category.id}';"
                            >

                        </div>

                        <h3>
                            ${escapeHTML(category.name)}
                        </h3>

                        <div class="flash-price">

                            $${price.toLocaleString()}

                        </div>

                        <div class="old-price">

                            $${(price * 1.25).toLocaleString()}

                        </div>

                    </a>

                `;

            }
        ).join("");

}



/* ==========================================================
   SEARCH
========================================================== */

function performSearch(
    value
) {

    const search =
        value
            .trim()
            .toLowerCase();


    if (!search) {

        return;

    }


    const exactCategory =
        categoryData.find(
            category =>
                category.name
                    .toLowerCase()
                    .includes(search)
        );


    if (exactCategory) {

        window.location.href =
            categoryURL(
                exactCategory
            );

        return;

    }


    window.location.href =
        "category.html?search=" +
        encodeURIComponent(
            search
        );

}


/* ==========================================================
   SEARCH EVENTS
========================================================== */

function initializeSearch() {

    const headerInput =
        document.getElementById(
            "globalSearch"
        );

    const headerButton =
        document.getElementById(
            "searchButton"
        );

    const heroInput =
        document.getElementById(
            "heroSearch"
        );

    const heroButton =
        document.getElementById(
            "heroSearchButton"
        );


    if (headerButton) {

        headerButton.addEventListener(
            "click",
            () => {

                performSearch(
                    headerInput?.value || ""
                );

            }
        );

    }


    if (heroButton) {

        heroButton.addEventListener(
            "click",
            () => {

                performSearch(
                    heroInput?.value || ""
                );

            }
        );

    }


    [headerInput, heroInput]
        .forEach(
            input => {

                if (!input) {

                    return;

                }


                input.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            performSearch(
                                input.value
                            );

                        }

                    }
                );

            }
        );

}


/* ==========================================================
   MOBILE MENU
========================================================== */

function initializeMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuButton"
        );

    const menu =
        document.getElementById(
            "mobileNav"
        );

    const closeButton =
        document.getElementById(
            "mobileNavClose"
        );


    if (
        !button ||
        !menu
    ) {
        return;
    }


    /* ======================================================
       OPEN / TOGGLE MENU
    ====================================================== */

    button.addEventListener(
        "click",
        () => {

            menu.classList.toggle(
                "active"
            );

        }
    );


    /* ======================================================
       CLOSE MENU
    ====================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                menu.classList.remove(
                    "active"
                );

            }
        );

    }


    /* ======================================================
       CLOSE AFTER CLICKING A LINK
    ====================================================== */

    const links =
        menu.querySelectorAll(
            "a"
        );

    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    menu.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}

/* ==========================================================
   LOCATION PANEL
========================================================== */

function initializeLocationPanel() {

    const openButtons = [

        document.getElementById(
            "locationButton"
        ),

        document.getElementById(
            "heroLocationButton"
        )

    ];


    const panel =
        document.getElementById(
            "locationPanel"
        );


    const close =
        document.getElementById(
            "closeLocation"
        );


    if (!panel) {

        return;

    }


    openButtons.forEach(
        button => {

            if (!button) {

                return;

            }


            button.addEventListener(
                "click",
                () => {

                    panel.classList.add(
                        "active"
                    );

                }
            );

        }
    );


    if (close) {

        close.addEventListener(
            "click",
            () => {

                panel.classList.remove(
                    "active"
                );

            }
        );

    }


    panel.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                panel
            ) {

                panel.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* ==========================================================
   BUYER LOCATION DATA
========================================================== */

const buyerLocationData = {

    NG: [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara",
        "Federal Capital Territory"
    ],

    GH: [
        "Greater Accra",
        "Ashanti",
        "Brong-Ahafo",
        "Central",
        "Eastern",
        "Northern",
        "Upper East",
        "Upper West",
        "Volta",
        "Western"
    ],

    KE: [
        "Nairobi",
        "Mombasa",
        "Kisumu",
        "Nakuru",
        "Kiambu",
        "Machakos",
        "Kajiado",
        "Uasin Gishu",
        "Meru",
        "Nyeri"
    ],

    ZA: [
        "Gauteng",
        "Western Cape",
        "KwaZulu-Natal",
        "Eastern Cape",
        "Free State",
        "Limpopo",
        "Mpumalanga",
        "Northern Cape",
        "North West"
    ],

    US: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
        "District of Columbia"
    ],

    GB: [
        "England",
        "Scotland",
        "Wales",
        "Northern Ireland"
    ],

    CA: [
        "Ontario",
        "Quebec",
        "British Columbia",
        "Alberta",
        "Manitoba",
        "Saskatchewan",
        "Nova Scotia",
        "New Brunswick",
        "Newfoundland and Labrador",
        "Prince Edward Island",
        "Northwest Territories",
        "Yukon",
        "Nunavut"
    ],

    IN: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh"
    ],

    AE: [
        "Abu Dhabi",
        "Dubai",
        "Sharjah",
        "Ajman",
        "Umm Al Quwain",
        "Ras Al Khaimah",
        "Fujairah"
    ],

    CN: [
        "Beijing",
        "Shanghai",
        "Guangdong",
        "Zhejiang",
        "Jiangsu",
        "Sichuan",
        "Hubei",
        "Fujian",
        "Shandong",
        "Henan",
        "Hebei",
        "Hunan",
        "Anhui",
        "Jiangxi",
        "Liaoning",
        "Yunnan",
        "Shaanxi",
        "Fujxi",
        "Guangxi",
        "Inner Mongolia",
        "Heilongjiang",
        "Jilin",
        "Gansu",
        "Xinjiang",
        "Tibet",
        "Ningxia",
        "Qinghai",
        "Hainan",
        "Hong Kong",
        "Macau"
    ],

    DE: [
        "Baden-Württemberg",
        "Bavaria",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hesse",
        "Lower Saxony",
        "Mecklenburg-Vorpommern",
        "North Rhine-Westphalia",
        "Rhineland-Palatinate",
        "Saarland",
        "Saxony",
        "Saxony-Anhalt",
        "Schleswig-Holstein",
        "Thuringia"
    ],

    FR: [
        "Île-de-France",
        "Auvergne-Rhône-Alpes",
        "Bourgogne-Franche-Comté",
        "Brittany",
        "Centre-Val de Loire",
        "Corsica",
        "Grand Est",
        "Hauts-de-France",
        "Normandy",
        "Nouvelle-Aquitaine",
        "Occitanie",
        "Pays de la Loire",
        "Provence-Alpes-Côte d'Azur"
    ],

    AU: [
        "New South Wales",
        "Victoria",
        "Queensland",
        "Western Australia",
        "South Australia",
        "Tasmania",
        "Northern Territory",
        "Australian Capital Territory"
    ],

    BR: [
        "Acre",
        "Alagoas",
        "Amapá",
        "Amazonas",
        "Bahia",
        "Ceará",
        "Espírito Santo",
        "Goiás",
        "Maranhão",
        "Mato Grosso",
        "Mato Grosso do Sul",
        "Minas Gerais",
        "Pará",
        "Paraíba",
        "Paraná",
        "Pernambuco",
        "Piauí",
        "Rio de Janeiro",
        "Rio Grande do Norte",
        "Rio Grande do Sul",
        "Rondônia",
        "Roraima",
        "Santa Catarina",
        "São Paulo",
        "Sergipe",
        "Tocantins",
        "Distrito Federal"
    ],

    TZ: [
        "Arusha",
        "Dar es Salaam",
        "Dodoma",
        "Geita",
        "Iringa",
        "Kagera",
        "Katavi",
        "Kigoma",
        "Kilimanjaro",
        "Lindi",
        "Manyara",
        "Mara",
        "Mbeya",
        "Morogoro",
        "Mtwara",
        "Mwanza",
        "Njombe",
        "Pemba North",
        "Pemba South",
        "Pwani",
        "Rukwa",
        "Ruvuma",
        "Shinyanga",
        "Simiyu",
        "Singida",
        "Songwe",
        "Tabora",
        "Tanga",
        "Zanzibar North",
        "Zanzibar South"
    ],
    
        JP: [
        "Tokyo",
        "Osaka",
        "Kyoto",
        "Hokkaido",
        "Aichi",
        "Kanagawa",
        "Saitama",
        "Chiba",
        "Hyogo",
        "Fukuoka"
    ],

    KR: [
        "Seoul",
        "Busan",
        "Incheon",
        "Daegu",
        "Daejeon",
        "Gwangju",
        "Ulsan",
        "Gyeonggi",
        "Gangwon",
        "Jeju"
    ],

    ID: [
        "Jakarta",
        "West Java",
        "East Java",
        "Central Java",
        "Banten",
        "North Sumatra",
        "South Sulawesi",
        "Bali",
        "East Kalimantan",
        "West Sumatra"
    ],

    MY: [
        "Selangor",
        "Kuala Lumpur",
        "Johor",
        "Penang",
        "Perak",
        "Sabah",
        "Sarawak",
        "Negeri Sembilan",
        "Malacca",
        "Pahang",
        "Kedah",
        "Kelantan",
        "Terengganu",
        "Perlis",
        "Putrajaya",
        "Labuan"
    ],

    SG: [
        "Central Region",
        "North Region",
        "North-East Region",
        "East Region",
        "West Region"
    ],

    PH: [
        "Metro Manila",
        "Cebu",
        "Davao",
        "Calabarzon",
        "Central Luzon",
        "Western Visayas",
        "Central Visayas",
        "Northern Mindanao",
        "Ilocos Region",
        "Bicol Region"
    ],

    TH: [
        "Bangkok",
        "Chiang Mai",
        "Phuket",
        "Chon Buri",
        "Nonthaburi",
        "Pathum Thani",
        "Samut Prakan",
        "Khon Kaen",
        "Nakhon Ratchasima",
        "Surat Thani"
    ],

    VN: [
        "Hanoi",
        "Ho Chi Minh City",
        "Da Nang",
        "Hai Phong",
        "Can Tho",
        "Quang Ninh",
        "Dong Nai",
        "Binh Duong",
        "Khanh Hoa",
        "Thua Thien Hue"
    ],

    PK: [
        "Punjab",
        "Sindh",
        "Khyber Pakhtunkhwa",
        "Balochistan",
        "Islamabad Capital Territory",
        "Gilgit-Baltistan",
        "Azad Jammu and Kashmir"
    ],

    BD: [
        "Dhaka",
        "Chattogram",
        "Rajshahi",
        "Khulna",
        "Barisal",
        "Sylhet",
        "Rangpur",
        "Mymensingh"
    ],

    LK: [
        "Western Province",
        "Central Province",
        "Southern Province",
        "Northern Province",
        "Eastern Province",
        "North Western Province",
        "North Central Province",
        "Uva Province",
        "Sabaragamuwa Province"
    ],

    NP: [
        "Bagmati",
        "Gandaki",
        "Karnali",
        "Koshi",
        "Lumbini",
        "Madhesh",
        "Sudurpashchim"
    ],

    SA: [
        "Riyadh",
        "Makkah",
        "Madinah",
        "Eastern Province",
        "Asir",
        "Tabuk",
        "Qassim",
        "Jazan",
        "Najran",
        "Al Bahah",
        "Hail",
        "Northern Borders",
        "Al Jawf"
    ],

    TR: [
        "Istanbul",
        "Ankara",
        "Izmir",
        "Antalya",
        "Bursa",
        "Adana",
        "Konya",
        "Gaziantep",
        "Mersin",
        "Kayseri"
    ],

    IL: [
        "Central District",
        "Tel Aviv District",
        "Jerusalem District",
        "Haifa District",
        "Northern District",
        "Southern District",
        "Judea and Samaria Area"
    ],

    IR: [
        "Tehran",
        "Isfahan",
        "Fars",
        "Razavi Khorasan",
        "East Azerbaijan",
        "Mazandaran",
        "Gilan",
        "Khuzestan",
        "Kerman",
        "Alborz"
    ],

    IQ: [
        "Baghdad",
        "Basra",
        "Nineveh",
        "Erbil",
        "Sulaymaniyah",
        "Duhok",
        "Kirkuk",
        "Najaf",
        "Karbala",
        "Anbar"
    ],

    JO: [
        "Amman",
        "Zarqa",
        "Irbid",
        "Aqaba",
        "Balqa",
        "Madaba",
        "Jerash",
        "Ajloun",
        "Karak",
        "Mafraq"
    ],

    QA: [
        "Doha",
        "Al Rayyan",
        "Al Wakrah",
        "Umm Salal",
        "Al Khor",
        "Al Daayen",
        "Al Shamal",
        "Al Shahaniya"
    ],

    KW: [
        "Al Asimah",
        "Hawalli",
        "Farwaniya",
        "Mubarak Al-Kabeer",
        "Ahmadi",
        "Jahra"
    ],

    OM: [
        "Muscat",
        "Dhofar",
        "North Al Batinah",
        "South Al Batinah",
        "North Ash Sharqiyah",
        "South Ash Sharqiyah",
        "Ad Dakhiliyah",
        "Al Wusta",
        "Al Buraimi",
        "Musandam"
    ],

    BH: [
        "Manama",
        "Muharraq",
        "Northern Governorate",
        "Southern Governorate"
    ],

    NZ: [
        "Auckland",
        "Wellington",
        "Canterbury",
        "Waikato",
        "Bay of Plenty",
        "Otago",
        "Manawatu-Wanganui",
        "Northland",
        "Hawke's Bay",
        "Taranaki",
        "Southland",
        "Nelson",
        "Marlborough",
        "Tasman",
        "Gisborne",
        "West Coast"
    ],

    RU: [
        "Moscow",
        "Saint Petersburg",
        "Moscow Oblast",
        "Krasnodar Krai",
        "Sverdlovsk Oblast",
        "Rostov Oblast",
        "Tatarstan",
        "Novosibirsk Oblast",
        "Nizhny Novgorod Oblast",
        "Samara Oblast"
    ],

    UA: [
        "Kyiv",
        "Lviv",
        "Odesa",
        "Kharkiv",
        "Dnipro",
        "Vinnytsia",
        "Poltava",
        "Chernihiv",
        "Zakarpattia",
        "Ivano-Frankivsk"
    ],

    PL: [
        "Masovian",
        "Lesser Poland",
        "Lower Silesian",
        "Silesian",
        "Greater Poland",
        "Pomeranian",
        "Łódź",
        "West Pomeranian",
        "Lublin",
        "Podlaskie"
    ],

    CZ: [
        "Prague",
        "Central Bohemian",
        "South Moravian",
        "Moravian-Silesian",
        "South Bohemian",
        "Plzeň",
        "Olomouc",
        "Zlín",
        "Liberec",
        "Hradec Králové"
    ],

    AT: [
        "Vienna",
        "Lower Austria",
        "Upper Austria",
        "Styria",
        "Tyrol",
        "Carinthia",
        "Salzburg",
        "Vorarlberg",
        "Burgenland"
    ],

    CH: [
        "Zurich",
        "Bern",
        "Geneva",
        "Vaud",
        "Ticino",
        "Basel-Stadt",
        "Basel-Landschaft",
        "Lucerne",
        "St. Gallen",
        "Valais"
    ],

    BE: [
        "Brussels-Capital",
        "Antwerp",
        "East Flanders",
        "West Flanders",
        "Flemish Brabant",
        "Limburg",
        "Hainaut",
        "Liège",
        "Luxembourg",
        "Namur",
        "Walloon Brabant"
    ],
    
        NL: [
        "North Holland",
        "South Holland",
        "Utrecht",
        "Gelderland",
        "North Brabant",
        "Limburg",
        "Overijssel",
        "Groningen",
        "Friesland",
        "Drenthe",
        "Flevoland",
        "Zeeland"
    ],

    ES: [
        "Madrid",
        "Catalonia",
        "Andalusia",
        "Valencia",
        "Galicia",
        "Basque Country",
        "Castile and León",
        "Canary Islands",
        "Castile-La Mancha",
        "Murcia",
        "Aragon",
        "Balearic Islands"
    ],

    IT: [
        "Lazio",
        "Lombardy",
        "Campania",
        "Sicily",
        "Veneto",
        "Piedmont",
        "Emilia-Romagna",
        "Tuscany",
        "Liguria",
        "Apulia",
        "Sardinia",
        "Calabria"
    ],

    PT: [
        "Lisbon",
        "Porto",
        "Braga",
        "Aveiro",
        "Faro",
        "Setúbal",
        "Leiria",
        "Coimbra",
        "Viseu",
        "Madeira",
        "Azores"
    ],

    IE: [
        "Dublin",
        "Cork",
        "Galway",
        "Limerick",
        "Waterford",
        "Kildare",
        "Meath",
        "Wicklow",
        "Donegal",
        "Kerry"
    ],

    SE: [
        "Stockholm",
        "Västra Götaland",
        "Skåne",
        "Uppsala",
        "Östergötland",
        "Jönköping",
        "Halland",
        "Örebro",
        "Dalarna",
        "Värmland"
    ],

    NO: [
        "Oslo",
        "Vestland",
        "Rogaland",
        "Trøndelag",
        "Akershus",
        "Innlandet",
        "Agder",
        "Nordland",
        "Møre og Romsdal",
        "Buskerud"
    ],

    DK: [
        "Capital Region",
        "Central Denmark",
        "North Denmark",
        "Region Zealand",
        "Region of Southern Denmark"
    ],

    FI: [
        "Uusimaa",
        "Pirkanmaa",
        "Southwest Finland",
        "North Ostrobothnia",
        "Central Finland",
        "Northern Savonia",
        "Satakunta",
        "Päijät-Häme",
        "Kymenlaakso",
        "Lapland"
    ],

    IS: [
        "Capital Region",
        "Southern Peninsula",
        "West Region",
        "Westfjords",
        "Northwestern Region",
        "Northeastern Region",
        "Eastern Region",
        "Southern Region"
    ],

    GR: [
        "Attica",
        "Central Macedonia",
        "Thessaly",
        "Crete",
        "Western Greece",
        "Eastern Macedonia and Thrace",
        "Peloponnese",
        "Central Greece",
        "Epirus",
        "Ionian Islands"
    ],

    RO: [
        "Bucharest",
        "Cluj",
        "Timiș",
        "Iași",
        "Constanța",
        "Brașov",
        "Prahova",
        "Dolj",
        "Sibiu",
        "Argeș"
    ],

    HU: [
        "Budapest",
        "Pest",
        "Bács-Kiskun",
        "Baranya",
        "Békés",
        "Borsod-Abaúj-Zemplén",
        "Csongrád-Csanád",
        "Fejér",
        "Győr-Moson-Sopron",
        "Hajdú-Bihar"
    ],

    BG: [
        "Sofia",
        "Plovdiv",
        "Varna",
        "Burgas",
        "Ruse",
        "Stara Zagora",
        "Pleven",
        "Sliven",
        "Dobrich",
        "Veliko Tarnovo"
    ],

    RS: [
        "Belgrade",
        "Vojvodina",
        "Šumadija",
        "Western Serbia",
        "Southern Serbia",
        "Eastern Serbia",
        "Raška",
        "Zlatibor"
    ],

    HR: [
        "Zagreb",
        "Split-Dalmatia",
        "Primorje-Gorski Kotar",
        "Istria",
        "Osijek-Baranja",
        "Zadar",
        "Dubrovnik-Neretva",
        "Varaždin",
        "Međimurje",
        "Karlovac"
    ],

    SI: [
        "Central Slovenia",
        "Drava",
        "Savinja",
        "Coastal-Karst",
        "Southeast Slovenia",
        "Upper Carniola",
        "Mura",
        "Central Sava",
        "Lower Sava",
        "Gorizia"
    ],

    SK: [
        "Bratislava",
        "Trnava",
        "Trenčín",
        "Nitra",
        "Žilina",
        "Banská Bystrica",
        "Prešov",
        "Košice"
    ],

    LT: [
        "Vilnius",
        "Kaunas",
        "Klaipėda",
        "Šiauliai",
        "Panevėžys",
        "Alytus",
        "Marijampolė",
        "Telšiai",
        "Tauragė",
        "Utena"
    ],

    LV: [
        "Riga",
        "Daugavpils",
        "Jelgava",
        "Jūrmala",
        "Liepāja",
        "Ventspils",
        "Valmiera",
        "Rēzekne",
        "Ogre"
    ],

    EE: [
        "Harju",
        "Tartu",
        "Ida-Viru",
        "Pärnu",
        "Lääne-Viru",
        "Viljandi",
        "Rapla",
        "Saare",
        "Jõgeva",
        "Võru"
    ],

    EE: [
        "Harju",
        "Tartu",
        "Ida-Viru",
        "Pärnu",
        "Lääne-Viru",
        "Viljandi",
        "Rapla",
        "Saare",
        "Jõgeva",
        "Võru"
    ],

    MX: [
        "Mexico City",
        "Jalisco",
        "Nuevo León",
        "Puebla",
        "Guanajuato",
        "Veracruz",
        "Chihuahua",
        "Baja California",
        "Sonora",
        "Querétaro",
        "Yucatán",
        "Quintana Roo"
    ],

    AR: [
        "Buenos Aires",
        "Córdoba",
        "Santa Fe",
        "Mendoza",
        "Tucumán",
        "Entre Ríos",
        "Salta",
        "Misiones",
        "Chaco",
        "Neuquén"
    ],

    CL: [
        "Santiago Metropolitan",
        "Valparaíso",
        "Biobío",
        "Maule",
        "Araucanía",
        "Los Lagos",
        "Coquimbo",
        "O'Higgins",
        "Antofagasta",
        "Atacama"
    ],

    CO: [
        "Bogotá",
        "Antioquia",
        "Valle del Cauca",
        "Cundinamarca",
        "Atlántico",
        "Santander",
        "Bolívar",
        "Nariño",
        "Tolima",
        "Caldas"
    ],

    PE: [
        "Lima",
        "Arequipa",
        "La Libertad",
        "Piura",
        "Cusco",
        "Junín",
        "Lambayeque",
        "Loreto",
        "Ancash",
        "Ica"
    ],

    VE: [
        "Distrito Capital",
        "Miranda",
        "Zulia",
        "Carabobo",
        "Aragua",
        "Lara",
        "Anzoátegui",
        "Bolívar",
        "Táchira",
        "Mérida"
    ],

    EC: [
        "Pichincha",
        "Guayas",
        "Azuay",
        "Manabí",
        "El Oro",
        "Tungurahua",
        "Loja",
        "Chimborazo",
        "Imbabura",
        "Esmeraldas"
    ],

    UY: [
        "Montevideo",
        "Canelones",
        "Maldonado",
        "Salto",
        "Colonia",
        "Paysandú",
        "Rivera",
        "Tacuarembó",
        "Rocha",
        "San José"
    ],

    CR: [
        "San José",
        "Alajuela",
        "Cartago",
        "Heredia",
        "Guanacaste",
        "Puntarenas",
        "Limón"
    ],

    PA: [
        "Panamá",
        "Panamá Oeste",
        "Colón",
        "Chiriquí",
        "Coclé",
        "Veraguas",
        "Herrera",
        "Los Santos",
        "Bocas del Toro",
        "Darién"
    ],
    
        GT: [
        "Guatemala",
        "Alta Verapaz",
        "Baja Verapaz",
        "Chimaltenango",
        "Chiquimula",
        "Escuintla",
        "Huehuetenango",
        "Izabal",
        "Jalapa",
        "Jutiapa",
        "Petén",
        "Quetzaltenango",
        "Quiché",
        "Retalhuleu",
        "Sacatepéquez",
        "San Marcos",
        "Santa Rosa",
        "Sololá",
        "Suchitepéquez",
        "Totonicapán",
        "Zacapa"
    ],

    DO: [
        "Distrito Nacional",
        "Santo Domingo",
        "Santiago",
        "La Altagracia",
        "Puerto Plata",
        "La Romana",
        "San Cristóbal",
        "Duarte",
        "San Pedro de Macorís",
        "La Vega"
    ],

    JM: [
        "Kingston",
        "Saint Andrew",
        "Saint Catherine",
        "Clarendon",
        "Manchester",
        "Saint Ann",
        "Saint James",
        "Westmoreland",
        "Hanover",
        "Trelawny",
        "Saint Mary",
        "Portland",
        "Saint Thomas"
    ],

    TT: [
        "Port of Spain",
        "San Fernando",
        "Arima",
        "Chaguanas",
        "Point Fortin",
        "Scarborough",
        "Tunapuna-Piarco",
        "Diego Martin",
        "Penal-Debe",
        "Princes Town"
    ],

    BB: [
        "Bridgetown",
        "Christ Church",
        "Saint Michael",
        "Saint George",
        "Saint Philip",
        "Saint James",
        "Saint Andrew",
        "Saint Joseph",
        "Saint Lucy",
        "Saint Peter",
        "Saint Thomas",
        "Saint John"
    ],

    BS: [
        "New Providence",
        "Grand Bahama",
        "Abaco",
        "Andros",
        "Eleuthera",
        "Exuma",
        "Long Island",
        "Cat Island",
        "Bimini",
        "San Salvador"
    ],

    CU: [
        "Havana",
        "Santiago de Cuba",
        "Camagüey",
        "Holguín",
        "Villa Clara",
        "Guantánamo",
        "Pinar del Río",
        "Cienfuegos",
        "Matanzas",
        "Las Tunas"
    ],

    HT: [
        "Ouest",
        "Nord",
        "Nord-Est",
        "Artibonite",
        "Centre",
        "Sud",
        "Sud-Est",
        "Grand'Anse",
        "Nippes",
        "Nord-Ouest"
    ],

    MA: [
        "Casablanca-Settat",
        "Rabat-Salé-Kénitra",
        "Marrakesh-Safi",
        "Fès-Meknès",
        "Tangier-Tetouan-Al Hoceima",
        "Souss-Massa",
        "Oriental",
        "Béni Mellal-Khénifra",
        "Drâa-Tafilalet",
        "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra",
        "Dakhla-Oued Ed-Dahab"
    ],

    DZ: [
        "Algiers",
        "Oran",
        "Constantine",
        "Annaba",
        "Blida",
        "Sétif",
        "Batna",
        "Tlemcen",
        "Béjaïa",
        "Tizi Ouzou"
    ],

    TN: [
        "Tunis",
        "Sfax",
        "Sousse",
        "Ariana",
        "Ben Arous",
        "Monastir",
        "Nabeul",
        "Bizerte",
        "Gabès",
        "Kairouan",
        "Médenine",
        "Gafsa"
    ],

    LY: [
        "Tripoli",
        "Benghazi",
        "Misrata",
        "Zawiya",
        "Sabha",
        "Derna",
        "Sirte",
        "Tobruk",
        "Gharyan",
        "Al Bayda"
    ],

    EG: [
        "Cairo",
        "Giza",
        "Alexandria",
        "Qalyubia",
        "Dakahlia",
        "Sharqia",
        "Gharbia",
        "Beheira",
        "Port Said",
        "Suez",
        "Luxor",
        "Aswan"
    ],

    SD: [
        "Khartoum",
        "Gezira",
        "Red Sea",
        "Kassala",
        "River Nile",
        "Northern",
        "White Nile",
        "Blue Nile",
        "North Darfur",
        "South Darfur"
    ],

    ET: [
        "Addis Ababa",
        "Oromia",
        "Amhara",
        "Tigray",
        "Somali",
        "Sidama",
        "SNNPR",
        "Afar",
        "Benishangul-Gumuz",
        "Gambela"
    ],

    GH: [
        "Greater Accra",
        "Ashanti",
        "Central",
        "Eastern",
        "Western",
        "Western North",
        "Northern",
        "Savannah",
        "North East",
        "Upper East",
        "Upper West",
        "Volta",
        "Oti",
        "Bono",
        "Bono East",
        "Ahafo"
    ],

    SN: [
        "Dakar",
        "Thiès",
        "Diourbel",
        "Saint-Louis",
        "Louga",
        "Kaolack",
        "Fatick",
        "Kolda",
        "Ziguinchor",
        "Tambacounda",
        "Matam",
        "Kaffrine",
        "Sédhiou"
    ],

    CI: [
        "Abidjan",
        "Yamoussoukro",
        "Bas-Sassandra",
        "Comoé",
        "Denguélé",
        "Gôh-Djiboua",
        "Lacs",
        "Lagunes",
        "Montagnes",
        "Sassandra-Marahoué",
        "Savanes",
        "Vallée du Bandama",
        "Woroba",
        "Zanzan"
    ],

    CM: [
        "Centre",
        "Littoral",
        "Southwest",
        "Northwest",
        "West",
        "Adamawa",
        "North",
        "Far North",
        "East",
        "South"
    ],

    UG: [
        "Central Region",
        "Eastern Region",
        "Northern Region",
        "Western Region",
        "Kampala"
    ],

    RW: [
        "Kigali",
        "Eastern Province",
        "Northern Province",
        "Southern Province",
        "Western Province"
    ],

    ZM: [
        "Lusaka",
        "Copperbelt",
        "Central",
        "Eastern",
        "Luapula",
        "Northern",
        "North-Western",
        "Southern",
        "Western",
        "Muchinga"
    ],

    ZW: [
        "Harare",
        "Bulawayo",
        "Manicaland",
        "Mashonaland Central",
        "Mashonaland East",
        "Mashonaland West",
        "Matabeleland North",
        "Matabeleland South",
        "Midlands",
        "Masvingo"
    ],

    BW: [
        "Central",
        "Ghanzi",
        "Kgalagadi",
        "Kgatleng",
        "Kweneng",
        "North-East",
        "North-West",
        "South-East",
        "Southern"
    ],

    NA: [
        "Khomas",
        "Erongo",
        "Oshana",
        "Oshikoto",
        "Ohangwena",
        "Omusati",
        "Kunene",
        "Hardap",
        "Karas",
        "Otjozondjupa",
        "Zambezi",
        "Kavango East",
        "Kavango West"
    ],

    MZ: [
        "Maputo",
        "Maputo City",
        "Gaza",
        "Inhambane",
        "Sofala",
        "Manica",
        "Tete",
        "Zambézia",
        "Nampula",
        "Cabo Delgado",
        "Niassa"
    ],

    MG: [
        "Antananarivo",
        "Toamasina",
        "Antsiranana",
        "Fianarantsoa",
        "Mahajanga",
        "Toliara",
        "Analamanga",
        "Vakinankaratra",
        "Atsinanana",
        "Diana"
    ],

    MU: [
        "Port Louis",
        "Black River",
        "Flacq",
        "Grand Port",
        "Moka",
        "Pamplemousses",
        "Plaines Wilhems",
        "Rivière du Rempart",
        "Savanne"
    ],

    SC: [
        "Mahé",
        "Praslin",
        "La Digue",
        "Silhouette",
        "Fregate",
        "Cerf Island"
    ],

    AO: [
        "Luanda",
        "Benguela",
        "Huambo",
        "Cabinda",
        "Malanje",
        "Namibe",
        "Uíge",
        "Zaire",
        "Bié",
        "Cuando Cubango",
        "Cuanza Norte",
        "Cuanza Sul"
    ],

    CD: [
        "Kinshasa",
        "Kongo Central",
        "Kwango",
        "Kwilu",
        "Mai-Ndombe",
        "Équateur",
        "Mongala",
        "North Kivu",
        "South Kivu",
        "Ituri",
        "Haut-Katanga",
        "Lualaba"
    ],
    
    /* ==========================================================
   BATCH 5 — 45 MORE COUNTRIES
========================================================== */

AF: [
    "Kabul",
    "Herat",
    "Kandahar",
    "Mazar-i-Sharif",
    "Nangarhar",
    "Balkh"
],

AL: [
    "Tirana",
    "Durres",
    "Vlore",
    "Shkoder",
    "Fier",
    "Elbasan"
],

AM: [
    "Yerevan",
    "Gyumri",
    "Vanadzor",
    "Vagharshapat",
    "Hrazdan",
    "Kapan"
],

AZ: [
    "Baku",
    "Ganja",
    "Sumqayit",
    "Lankaran",
    "Mingachevir",
    "Nakhchivan"
],

BA: [
    "Sarajevo",
    "Banja Luka",
    "Tuzla",
    "Zenica",
    "Mostar",
    "Bijeljina"
],

BY: [
    "Minsk",
    "Gomel",
    "Mogilev",
    "Vitebsk",
    "Grodno",
    "Brest"
],

CY: [
    "Nicosia",
    "Limassol",
    "Larnaca",
    "Paphos",
    "Famagusta",
    "Kyrenia"
],

GE: [
    "Tbilisi",
    "Batumi",
    "Kutaisi",
    "Rustavi",
    "Gori",
    "Zugdidi"
],

MD: [
    "Chisinau",
    "Balti",
    "Bender",
    "Cahul",
    "Ungheni",
    "Soroca"
],

MT: [
    "Valletta",
    "Birkirkara",
    "Mosta",
    "Qormi",
    "Sliema",
    "St. Paul's Bay"
],

ME: [
    "Podgorica",
    "Niksic",
    "Budva",
    "Bar",
    "Herceg Novi",
    "Kotor"
],

MK: [
    "Skopje",
    "Bitola",
    "Kumanovo",
    "Prilep",
    "Tetovo",
    "Ohrid"
],

LU: [
    "Luxembourg City",
    "Esch-sur-Alzette",
    "Differdange",
    "Dudelange",
    "Ettelbruck",
    "Diekirch"
],

LI: [
    "Vaduz",
    "Schaan",
    "Triesen",
    "Balzers",
    "Eschen",
    "Mauren"
],

AD: [
    "Andorra la Vella",
    "Escaldes-Engordany",
    "Encamp",
    "Sant Julia de Loria",
    "La Massana",
    "Canillo"
],

KZ: [
    "Astana",
    "Almaty",
    "Shymkent",
    "Karaganda",
    "Aktobe",
    "Atyrau"
],

KG: [
    "Bishkek",
    "Osh",
    "Jalal-Abad",
    "Karakol",
    "Tokmok",
    "Naryn"
],

TJ: [
    "Dushanbe",
    "Khujand",
    "Kulob",
    "Bokhtar",
    "Istaravshan",
    "Tursunzoda"
],

TM: [
    "Ashgabat",
    "Turkmenabat",
    "Dashoguz",
    "Mary",
    "Balkanabat",
    "Turkmenbashi"
],

UZ: [
    "Tashkent",
    "Samarkand",
    "Namangan",
    "Andijan",
    "Bukhara",
    "Fergana"
],

MN: [
    "Ulaanbaatar",
    "Erdenet",
    "Darkhan",
    "Choibalsan",
    "Murun",
    "Nalaikh"
],

KH: [
    "Phnom Penh",
    "Siem Reap",
    "Battambang",
    "Sihanoukville",
    "Kampong Cham",
    "Kampot"
],

LA: [
    "Vientiane",
    "Luang Prabang",
    "Pakse",
    "Savannakhet",
    "Thakhek",
    "Phonsavan"
],

MM: [
    "Yangon",
    "Mandalay",
    "Naypyidaw",
    "Mawlamyine",
    "Bago",
    "Taunggyi"
],

BN: [
    "Bandar Seri Begawan",
    "Kuala Belait",
    "Seria",
    "Tutong",
    "Bangar",
    "Muara"
],

TL: [
    "Dili",
    "Baucau",
    "Maliana",
    "Suai",
    "Lospalos",
    "Same"
],

MV: [
    "Male",
    "Addu City",
    "Fuvahmulah",
    "Kulhudhuffushi",
    "Thinadhoo",
    "Hithadhoo"
],

BT: [
    "Thimphu",
    "Phuntsholing",
    "Paro",
    "Punakha",
    "Wangdue Phodrang",
    "Jakar"
],

FJ: [
    "Suva",
    "Nadi",
    "Lautoka",
    "Labasa",
    "Ba",
    "Savusavu"
],

PG: [
    "Port Moresby",
    "Lae",
    "Mount Hagen",
    "Madang",
    "Kokopo",
    "Goroka"
],

WS: [
    "Apia",
    "Salelologa",
    "Vaitele",
    "Faleula",
    "Siusega",
    "Leulumoega"
],

TO: [
    "Nuku'alofa",
    "Neiafu",
    "Haveluloto",
    "Vaini",
    "Pangai",
    "Ohonua"
],

VU: [
    "Port Vila",
    "Luganville",
    "Isangel",
    "Lakatoro",
    "Sola",
    "Lenakel"
],

SB: [
    "Honiara",
    "Gizo",
    "Auki",
    "Munda",
    "Tulagi",
    "Kirakira"
],

FM: [
    "Palikir",
    "Weno",
    "Kolonia",
    "Tofol",
    "Colonia",
    "Malem"
],

PW: [
    "Ngerulmud",
    "Koror",
    "Airai",
    "Melekeok",
    "Ngaraard",
    "Ngardmau"
],

MH: [
    "Majuro",
    "Ebeye",
    "Jaluit",
    "Wotje",
    "Mili",
    "Kwajalein"
],

KI: [
    "South Tarawa",
    "Betio",
    "Bairiki",
    "Bikenibeu",
    "Teaoraereke",
    "Bonriki"
],

NR: [
    "Yaren",
    "Aiwo",
    "Anabar",
    "Anetan",
    "Boe",
    "Denigomodu"
],

TV: [
    "Funafuti",
    "Vaiaku",
    "Fongafale",
    "Asau",
    "Savave",
    "Tanrake"
],

DJ: [
    "Djibouti City",
    "Ali Sabieh",
    "Tadjourah",
    "Obock",
    "Dikhil",
    "Arta"
],

ER: [
    "Asmara",
    "Keren",
    "Massawa",
    "Assab",
    "Mendefera",
    "Dekemhare"
],

SO: [
    "Mogadishu",
    "Hargeisa",
    "Bosaso",
    "Kismayo",
    "Garowe",
    "Baidoa"
],

SS: [
    "Juba",
    "Wau",
    "Malakal",
    "Yambio",
    "Bor",
    "Aweil"
],

MR: [
    "Nouakchott",
    "Nouadhibou",
    "Rosso",
    "Kiffa",
    "Atar",
    "Zouerat"
]
};


/* ==========================================================
   BUYER LOCATION SELECTION
========================================================== */

function initializeBuyerLocation() {

    const countrySelect =
        document.getElementById("countrySelect");

    const regionSelect =
        document.getElementById("regionSelect");

    const saveLocation =
        document.getElementById("saveLocation");

    const locationPanel =
        document.getElementById("locationPanel");

    const locationText =
        document.getElementById("locationText");

    const heroLocationText =
        document.getElementById("heroLocationText");

    if (
        !countrySelect ||
        !regionSelect ||
        !saveLocation
    ) {

        console.warn(
            "Buyer location elements were not found."
        );

        return;

    }


    /* ======================================================
       LOAD COUNTRIES
    ====================================================== */

    countrySelect.innerHTML = `
        <option value="">
            Select your country
        </option>
    `;

    Object.keys(buyerLocationData).forEach(
        country => {

            const option =
                document.createElement("option");

            option.value = country;
            option.textContent = country;

            countrySelect.appendChild(option);

        }
    );


    /* ======================================================
       LOAD SAVED LOCATION
    ====================================================== */

    let savedLocation = null;

    try {

        savedLocation =
            JSON.parse(
                localStorage.getItem(
                    "neoStoreBuyerLocation"
                )
            );

    } catch (error) {

        savedLocation = null;

    }


    function updateLocationText(location) {

        if (!location) {

            return;

        }

        const displayLocation =
            `${location.region}, ${location.country}`;

        if (locationText) {

            locationText.textContent =
                displayLocation;

        }

        if (heroLocationText) {

            heroLocationText.textContent =
                displayLocation;

        }

    }


    if (savedLocation) {

        countrySelect.value =
            savedLocation.country;

        loadRegions(
            savedLocation.country
        );

        regionSelect.value =
            savedLocation.region;

        updateLocationText(
            savedLocation
        );

    }


    /* ======================================================
       LOAD REGIONS
    ====================================================== */

    function loadRegions(country) {

        regionSelect.innerHTML = `
            <option value="">
                Select your region
            </option>
        `;

        regionSelect.disabled = true;

        if (!country) {

            return;

        }

        const regions =
            buyerLocationData[country] || [];

        regions.forEach(
            region => {

                const option =
                    document.createElement("option");

                option.value = region;
                option.textContent = region;

                regionSelect.appendChild(option);

            }
        );

        regionSelect.disabled =
            regions.length === 0;

    }


    /* ======================================================
       COUNTRY CHANGE
    ====================================================== */

    countrySelect.addEventListener(
        "change",
        () => {

            loadRegions(
                countrySelect.value
            );

        }
    );


    /* ======================================================
       SAVE BUYER LOCATION
    ====================================================== */

    saveLocation.addEventListener(
        "click",
        () => {

            const country =
                countrySelect.value.trim();

            const region =
                regionSelect.value.trim();

            if (!country) {

                alert(
                    "Please select your country."
                );

                return;

            }

            if (!region) {

                alert(
                    "Please select your region."
                );

                return;

            }

            const location = {

                country: country,

                region: region,

                savedAt: new Date().toISOString()

            };


            localStorage.setItem(
                "neoStoreBuyerLocation",
                JSON.stringify(location)
            );


            updateLocationText(
                location
            );


            if (locationPanel) {

                locationPanel.classList.remove(
                    "active"
                );

            }


            alert(
                `Location saved: ${region}, ${country}`
            );

        }
    );

}


/* ==========================================================
   INITIALIZE LOCATION SYSTEM
========================================================== */

initializeBuyerLocation();


/* ==========================================================
   DEAL TIMER
========================================================== */

function initializeDealTimer() {

    const timer =
        document.getElementById(
            "dealTimer"
        );


    if (!timer) {

        return;

    }


    let seconds =
        8 * 60 * 60 +
        45 * 60 +
        12;


    function update() {

        if (
            seconds <= 0
        ) {

            seconds =
                24 * 60 * 60;

        }


        seconds--;


        const hours =
            Math.floor(
                seconds / 3600
            );


        const minutes =
            Math.floor(
                (seconds % 3600) /
                60
            );


        const secs =
            seconds %
            60;


        timer.textContent =

            String(hours)
                .padStart(2, "0") +

            ":" +

            String(minutes)
                .padStart(2, "0") +

            ":" +

            String(secs)
                .padStart(2, "0");

    }


    update();

    setInterval(
        update,
        1000
    );

}


/* ==========================================================
   INITIALIZE
========================================================== */

function initializeHome() {

    renderCircleCategories();

    renderMovieCategories();

    renderThreeD();

    renderBento();

    renderGlass();

    renderStacked();

    renderGradient();

    renderSidebar();

    renderAllCategories();

    renderCountries();

    renderFlashProducts();

    initializeSearch();

    initializeMobileMenu();

    initializeLocationPanel();

    initializeDealTimer();

}


initializeHome();


/* ==========================================================
   BOTTOM SEARCH
========================================================== */

function initializeBottomSearch() {

    const searchInput =
        document.getElementById("bottomSearch");

    const searchButton =
        document.getElementById("bottomSearchButton");


    if (!searchInput || !searchButton) {

        console.warn(
            "Bottom search elements were not found."
        );

        return;

    }


    function performBottomSearch() {

        const searchTerm =
            searchInput.value.trim();


        if (!searchTerm) {

            searchInput.focus();

            return;

        }


        window.location.href =
            `category.html?search=${encodeURIComponent(searchTerm)}`;

    }


    /* Search button */
    searchButton.addEventListener(
        "click",
        performBottomSearch
    );


    /* Search when pressing Enter */
    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                performBottomSearch();

            }

        }
    );

}


/* ==========================================================
   INITIALIZE BOTTOM SEARCH
========================================================== */

initializeBottomSearch();

/* ==========================================================
   POPULAR SEARCH BUTTONS
========================================================== */

function initializePopularSearches() {

    const popularSearchButtons =
        document.querySelectorAll(
            ".popular-search"
        );


    if (!popularSearchButtons.length) {

        return;

    }


    popularSearchButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const searchTerm =
                        button.dataset.search;


                    if (!searchTerm) {

                        return;

                    }


                    window.location.href =
                        `category.html?search=${encodeURIComponent(searchTerm)}`;

                }
            );

        }
    );

}


/* ==========================================================
   INITIALIZE POPULAR SEARCHES
========================================================== */

initializePopularSearches();


/* ==========================================================
   READ HOMEPAGE URL PARAMETERS
========================================================== */

function readURLParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    /*
     * Read category from homepage.
     *
     * Example:
     * category.html?category=phones
     */

    const urlCategory =
        params.get("category");


    if (urlCategory) {

        selectedCategory =
            urlCategory.trim();

    }


    /*
     * Read search from homepage.
     *
     * Example:
     * category.html?search=iPhone%2015
     */

    const urlSearch =
        params.get("search");


    if (urlSearch) {

        searchTerm =
            urlSearch.trim();

        productSearch.value =
            searchTerm;

        clearSearchButton.style.visibility =
            "visible";

    }


    /*
     * Read country from homepage.
     *
     * Example:
     * category.html?country=NG
     */

    const urlCountry =
        params.get("country");


    if (urlCountry) {

        selectedCountry =
            urlCountry.trim();

    }


    /*
     * Read region from homepage.
     *
     * Example:
     * category.html?country=NG&region=Anambra
     */

    const urlRegion =
        params.get("region");


    if (urlRegion) {

        selectedRegion =
            urlRegion.trim();

    }

}


