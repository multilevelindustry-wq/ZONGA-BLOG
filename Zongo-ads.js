/* =========================================================
   ZONGO CENTRAL ADS ENGINE
   /zongo-ads.js

   PURPOSE:
   - Loads ads from /ads.html
   - Supports ExoClick
   - Supports Clickadilla
   - Supports Adsterra
   - Supports manual partner ads
   - Responsive ad placements
   - 5 minimum ads when enough usable ads exist
   - 20 maximum ads per page
   - Avoids excessive ad clustering
   - Works across Zongo pages
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const ZONGO_AD_CONFIG = {

    source: "/ads.html",

    minimumAds: 5,

    maximumAds: 20,

    minimumContentGap: 450,

    minimumAdGap: 250,

    mobileMinimumAdGap: 350,

    desktopMinimumAdGap: 300,

    loadDelay: 50,

    debug: false

};


/* =========================================================
   STATE
========================================================= */

let zongoAds = [];

let zongoPlacedAds = [];

let zongoAdCount = 0;

let zongoLastAdPosition = -1;

let zongoLastAdType = null;


/* =========================================================
   DEBUG
========================================================= */

function zongoAdLog(...args) {

    if (
        ZONGO_AD_CONFIG.debug
    ) {

        console.log(
            "[ZONGO ADS]",
            ...args
        );

    }

}


/* =========================================================
   GET PAGE TYPE
========================================================= */

function getZongoPageType() {

    const path =
        window.location.pathname
            .toLowerCase();

    const page =
        path
            .split("/")
            .pop();

    if (
        page.includes("article") ||
        page.includes("post") ||
        page.includes("story") ||
        page.includes("health") ||
        page.includes("food") ||
        page.includes("supplement")
    ) {

        return "article";

    }


    if (
        page.includes("product")
    ) {

        return "product";

    }


    if (
        page.includes("category") ||
        page.includes("shop")
    ) {

        return "category";

    }


    if (
        page.includes("search")
    ) {

        return "search";

    }


    if (
        page === "" ||
        page === "index.html"
    ) {

        return "home";

    }


    return "general";

}


/* =========================================================
   DEVICE TYPE
========================================================= */

function isZongoMobile() {

    return window.matchMedia(
        "(max-width: 768px)"
    ).matches;

}


/* =========================================================
   LOAD ADS.HTML
========================================================= */

async function loadZongoAdSource() {

    try {

        const response =
            await fetch(
                ZONGO_AD_CONFIG.source,
                {
                    cache: "no-store"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Unable to load ads.html"
            );

        }


        const html =
            await response.text();


        const parser =
            new DOMParser();


        const documentSource =
            parser.parseFromString(
                html,
                "text/html"
            );


        zongoAds =
            Array.from(
                documentSource.querySelectorAll(
                    "[data-zongo-ad]"
                )
            )
            .filter(
                ad => {

                    const active =
                        ad.dataset.active;

                    return (
                        active !== "false"
                    );

                }
            );


        zongoAdLog(
            "Loaded ad definitions:",
            zongoAds.length
        );


        return true;

    } catch (error) {

        console.error(
            "[ZONGO ADS]",
            error
        );

        return false;

    }

}


/* =========================================================
   FIND MAIN CONTENT
========================================================= */

function getZongoMainContent() {

    const selectors = [

        "main",

        "article",

        ".article-content",

        ".post-content",

        ".blog-content",

        ".content",

        ".main-content",

        ".page-content",

        "#content",

        "#main",

        "body"

    ];


    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element &&
            element.children.length >= 3
        ) {

            return element;

        }

    }


    return document.body;

}


/* =========================================================
   FIND POSSIBLE CONTENT ELEMENTS
========================================================= */

function getZongoPlacementElements() {

    const main =
        getZongoMainContent();


    const elements =
        Array.from(
            main.querySelectorAll(
                "p, h2, h3, h4, section, article, .card, .post-card, .product-card"
            )
        );


    return elements.filter(
        element => {

            const rect =
                element.getBoundingClientRect();


            const height =
                rect.height;


            const text =
                element.textContent
                    ?.trim()
                    .length || 0;


            return (
                height >= 20 ||
                text >= 80
            );

        }
    );

}


/* =========================================================
   CREATE AD CONTAINER
========================================================= */

function createZongoAdContainer(
    ad,
    format
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "zongo-auto-ad";


    wrapper.dataset.zongoAd =
        "true";


    wrapper.dataset.adType =
        ad.dataset.zongoAd || "";


    wrapper.dataset.adId =
        ad.dataset.adId || "";


    wrapper.dataset.format =
        format;


    wrapper.style.cssText = `

        width:100%;

        display:flex;

        justify-content:center;

        align-items:center;

        box-sizing:border-box;

        clear:both;

        overflow:hidden;

        margin:
            ${isZongoMobile() ? "24px" : "32px"}
            auto;

        padding:
            ${isZongoMobile() ? "8px" : "10px"}
            0;

        min-height:50px;

        text-align:center;

    `;


    return wrapper;

}


/* =========================================================
   COPY AD CONTENT
========================================================= */

function copyAdContent(
    source,
    wrapper
) {

    const inner =
        source.querySelector(
            ".zongo-ad-unit-inner"
        );


    if (!inner) {

        return;

    }


    const clone =
        inner.cloneNode(
            true
        );


    wrapper.appendChild(
        clone
    );

}


/* =========================================================
   LOAD EXOCLICK
========================================================= */

function loadExoClick(
    wrapper,
    ad
) {

    const banner =
        ad.querySelector(
            "[data-banner-id]"
        );


    if (!banner) {

        return false;

    }


    const bannerId =
        banner.getAttribute(
            "data-banner-id"
        );


    const newBanner =
        document.createElement(
            "div"
        );


    newBanner.setAttribute(
        "data-banner-id",
        bannerId
    );


    newBanner.style.cssText = `

        width:100%;

        display:flex;

        justify-content:center;

        align-items:center;

        text-align:center;

    `;


    wrapper.innerHTML = "";

    wrapper.appendChild(
        newBanner
    );


    return true;

}


/* =========================================================
   LOAD CLICKADILLA
========================================================= */

function loadClickadilla(
    wrapper,
    ad
) {

    const source =
        ad.querySelector(
            "ins[data-zoneid]"
        );


    if (!source) {

        return false;

    }


    const zoneId =
        source.dataset.zoneid;


    const ins =
        document.createElement(
            "ins"
        );


    ins.className =
        "eas6a97888e20";


    ins.dataset.zoneid =
        zoneId;


    wrapper.innerHTML = "";

    wrapper.appendChild(
        ins
    );


    loadScriptOnce(
        "https://a.magsrv.com/ad-provider.js",
        "zongo-clickadilla-script"
    );


    setTimeout(
        () => {

            try {

                window.AdProvider =
                    window.AdProvider || [];


                window.AdProvider.push(
                    {
                        serve: {}
                    }
                );

            } catch (error) {

                zongoAdLog(
                    "Clickadilla error",
                    error
                );

            }

        },
        100
    );


    return true;

}


/* =========================================================
   LOAD ADSTERRA IFRAME
========================================================= */

function loadAdsterra(
    wrapper,
    ad
) {

    const slot =
        ad.querySelector(
            "[data-adsterra-key]"
        );


    if (!slot) {

        return false;

    }


    const key =
        slot.dataset.adsterraKey;


    const width =
        parseInt(
            slot.dataset.width,
            10
        ) || 300;


    const height =
        parseInt(
            slot.dataset.height,
            10
        ) || 250;


    wrapper.innerHTML = "";


    const script =
        document.createElement(
            "script"
        );


    script.type =
        "text/javascript";


    const options =
        document.createElement(
            "script"
        );


    options.text =
        `
        atOptions = {
            'key' : '${key}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
        };
        `;


    const invoke =
        document.createElement(
            "script"
        );


    invoke.src =
        `https://bluntutilities.com/${key}/invoke.js`;


    invoke.async =
        true;


    wrapper.appendChild(
        options
    );


    wrapper.appendChild(
        invoke
    );


    return true;

}


/* =========================================================
   LOAD ADSTERRA NATIVE
========================================================= */

function loadAdsterraNative(
    wrapper,
    ad
) {

    const slot =
        ad.querySelector(
            "[data-native-id]"
        );


    if (!slot) {

        return false;

    }


    const id =
        slot.dataset.nativeId;


    wrapper.innerHTML = "";


    const container =
        document.createElement(
            "div"
        );


    container.id =
        `container-${id}`;


    wrapper.appendChild(
        container
    );


    const script =
        document.createElement(
            "script"
        );


    script.async =
        true;


    script.setAttribute(
        "data-cfasync",
        "false"
    );


    script.src =
        `https://bluntutilities.com/${id}/invoke.js`;


    wrapper.appendChild(
        script
    );


    return true;

}


/* =========================================================
   MANUAL PARTNER AD
========================================================= */

function loadManualAd(
    wrapper,
    ad
) {

    const inner =
        ad.querySelector(
            ".zongo-ad-unit-inner"
        );


    if (!inner) {

        return false;

    }


    const content =
        inner.innerHTML.trim();


    if (!content) {

        return false;

    }

wrapper.innerHTML =
        content;


    return true;

}


/* =========================================================
   GENERIC AD LOADER
========================================================= */

function renderZongoAd(
    ad,
    format
) {

    const type =
        ad.dataset.zongoAd;


    const wrapper =
        createZongoAdContainer(
            ad,
            format
        );


    let loaded =
        false;


    if (
        type === "exoclick"
    ) {

        loaded =
            loadExoClick(
                wrapper,
                ad
            );

    }


    else if (
        type === "clickadilla"
    ) {

        loaded =
            loadClickadilla(
                wrapper,
                ad
            );

    }


    else if (
        type === "adsterra"
    ) {

        if (
            ad.querySelector(
                "[data-native-id]"
            )
        ) {

            loaded =
                loadAdsterraNative(
                    wrapper,
                    ad
                );

        } else {

            loaded =
                loadAdsterra(
                    wrapper,
                    ad
                );

        }

    }


    else if (
        type === "manual"
    ) {

        loaded =
            loadManualAd(
                wrapper,
                ad
            );

    }


    if (!loaded) {

        return null;

    }


    return wrapper;

}


/* =========================================================
   DETERMINE FORMAT
========================================================= */

function getZongoFormat(
    ad
) {

    const id =
        ad.dataset.adId || "";


    const width =
        ad.querySelector(
            "[data-width]"
        )?.dataset.width;


    const height =
        ad.querySelector(
            "[data-height]"
        )?.dataset.height;


    if (
        width &&
        height
    ) {

        return `${width}x${height}`;

    }


    if (
        id === "1502127" ||
        id === "1502123" ||
        id === "1502124" ||
        id === "1502125" ||
        id === "1502126"
    ) {

        return "banner";

    }


    if (
        id === "6034284"
    ) {

        return "responsive";

    }


    return "responsive";

}


/* =========================================================
   LOAD SCRIPT ONLY ONCE
========================================================= */

function loadScriptOnce(
    src,
    id
) {

    if (
        document.getElementById(id)
    ) {

        return;

    }


    const script =
        document.createElement(
            "script"
        );


    script.id =
        id;


    script.src =
        src;


    script.async =
        true;


    document.head.appendChild(
        script
    );

}


/* =========================================================
   CHECK AD SPACING
========================================================= */

function hasNearbyZongoAd(
    element
) {

    const rect =
        element.getBoundingClientRect();


    const ads =
        document.querySelectorAll(
            ".zongo-auto-ad"
        );


    for (
        const ad of ads
    ) {

        const adRect =
            ad.getBoundingClientRect();


        const distance =
            Math.abs(
                rect.top -
                adRect.bottom
            );


        const minimum =
            isZongoMobile()
                ? ZONGO_AD_CONFIG.mobileMinimumAdGap
                : ZONGO_AD_CONFIG.desktopMinimumAdGap;


        if (
            distance < minimum
        ) {

            return true;

        }

    }


    return false;

}


/* =========================================================
   CHECK ELEMENT
========================================================= */

function isValidZongoPlacement(
    element
) {

    if (
        !element ||
        !element.parentNode
    ) {

        return false;

    }


    if (
        element.closest(
            ".zongo-auto-ad"
        )
    ) {

        return false;

    }


    if (
        element.closest(
            "header, nav, footer, form"
        )
    ) {

        return false;

    }


    if (
        hasNearbyZongoAd(
            element
        )
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   INSERT AFTER ELEMENT
========================================================= */

function insertZongoAdAfter(
    element,
    ad,
    format
) {

    if (
        !isValidZongoPlacement(
            element
        )
    ) {

        return false;

    }


    const wrapper =
        renderZongoAd(
            ad,
            format
        );


    if (!wrapper) {

        return false;

    }


    element.insertAdjacentElement(
        "afterend",
        wrapper
    );


    zongoPlacedAds.push(
        wrapper
    );


    zongoAdCount++;


    return true;

}


/* =========================================================
   SELECT NEXT AD
========================================================= */

function getNextZongoAd() {

    if (
        !zongoAds.length
    ) {

        return null;

    }


    const available =
        zongoAds.filter(
            ad => {

                const type =
                    ad.dataset.zongoAd;


                const id =
                    ad.dataset.adId;


                const recentlyUsed =
                    zongoPlacedAds.some(
                        placed => {

                            return (
                                placed.dataset.adType === type &&
                                placed.dataset.adId === id
                            );

                        }
                    );


                /*
                 * Manual ads can be reused.
                 */

                if (
                    type === "manual"
                ) {

                    return true;

                }


                return !recentlyUsed;

            }
        );


    /*
     * If every unit has been used,
     * start another rotation.
     */

    const pool =
        available.length
            ? available
            : zongoAds;


    /*
     * Prefer a different network from
     * the immediately previous placement.
     */

    const differentNetwork =
        pool.filter(
            ad => {

                return (
                    ad.dataset.zongoAd !==
                    zongoLastAdType
                );

            }
        );


    const finalPool =
        differentNetwork.length
            ? differentNetwork
            : pool;


    const randomIndex =
        Math.floor(
            Math.random() *
            finalPool.length
        );


    const selected =
        finalPool[
            randomIndex
        ];


    zongoLastAdType =
        selected.dataset.zongoAd;


    return selected;

}


/* =========================================================
   GET TARGET COUNT
========================================================= */

function getZongoTargetAdCount(
    placements
) {

    const pageType =
        getZongoPageType();


    /*
     * Number of meaningful content
     * elements available.
     */

    const contentCount =
        placements.length;


    let target;


    if (
        pageType === "article"
    ) {

        target =
            Math.floor(
                contentCount / 4
            );

    }

    else if (
        pageType === "category"
    ) {

        target =
            Math.floor(
                contentCount / 6
            );

    }

    else if (
        pageType === "product"
    ) {

        target =
            Math.floor(
                contentCount / 5
            );

    }

    else if (
        pageType === "home"
    ) {

        target =
            Math.floor(
                contentCount / 7
            );

    }

    else {

        target =
            Math.floor(
                contentCount / 5
            );

    }


    /*
     * Minimum 5 where the page has
     * enough content to support them.
     */

    target =
        Math.max(
            ZONGO_AD_CONFIG.minimumAds,
            target
        );


    /*
     * Never exceed 20.
     */

    target =
        Math.min(
            ZONGO_AD_CONFIG.maximumAds,
            target
        );


    /*
     * Do not force 20 ads onto a tiny page.
     */

    if (
        contentCount < 10
    ) {

        target =
            Math.min(
                target,
                Math.max(
                    1,
                    Math.floor(
                        contentCount / 2
                    )
                )
            );

    }


    return target;

}


/* =========================================================
   DISTRIBUTE PLACEMENTS
========================================================= */

function createZongoPlacementIndexes(
    count,
    target
) {

    if (
        count <= 0 ||
        target <= 0
    ) {

        return [];

    }


    const indexes = [];


    /*
     * Spread advertisements across
     * the available content.
     */

    const interval =
        count /
        (target + 1);


    for (
        let i = 1;
        i <= target;
        i++
    ) {

        let index =
            Math.floor(
                interval * i
            );


        index =
            Math.min(
                count - 1,
                Math.max(
                    0,
                    index
                )
            );


        /*
         * Prevent duplicate indexes.
         */

        if (
            !indexes.includes(
                index
            )
        ) {

            indexes.push(
                index
            );

        }

    }


    return indexes;

}


/* =========================================================
   PLACE ADS
========================================================= */

function placeZongoAds() {

    if (
        !zongoAds.length
    ) {

        zongoAdLog(
            "No ads available."
        );

        return;

    }


    const placements =
        getZongoPlacementElements();


    if (
        !placements.length
    ) {

        zongoAdLog(
            "No suitable content placements found."
        );

        return;

    }


    const target =
        getZongoTargetAdCount(
            placements
        );


    const indexes =
        createZongoPlacementIndexes(
            placements.length,
            target
        );


    zongoAdLog(
        "Page type:",
        getZongoPageType()
    );


    zongoAdLog(
        "Content placements:",
        placements.length
    );


    zongoAdLog(
        "Target ads:",
        target
    );


    for (
        let i = 0;
        i < indexes.length;
        i++
    ) {

        if (
            zongoAdCount >=
            ZONGO_AD_CONFIG.maximumAds
        ) {

            break;

        }


        const index =
            indexes[i];


        const element =
            placements[index];


        if (
            !isValidZongoPlacement(
                element
            )
        ) {

            continue;

        }


        const ad =
            getNextZongoAd();


        if (!ad) {

            continue;

        }


const format =
            getZongoFormat(
                ad
            );


        insertZongoAdAfter(
            element,
            ad,
            format
        );

    }


    /*
     * If the first distribution did not
     * reach five ads, try additional
     * safe positions.
     */

    if (
        zongoAdCount <
        ZONGO_AD_CONFIG.minimumAds
    ) {

        for (
            const element of placements
        ) {

            if (
                zongoAdCount >=
                ZONGO_AD_CONFIG.minimumAds
            ) {

                break;

            }


            if (
                zongoAdCount >=
                ZONGO_AD_CONFIG.maximumAds
            ) {

                break;

            }


            if (
                !isValidZongoPlacement(
                    element
                )
            ) {

                continue;

            }


            const ad =
                getNextZongoAd();


            if (!ad) {

                break;

            }


            const format =
                getZongoFormat(
                    ad
                );


            insertZongoAdAfter(
                element,
                ad,
                format
            );

        }

    }


    zongoAdLog(
        "Ads placed:",
        zongoAdCount
    );

}


/* =========================================================
   TOP AD
========================================================= */

function placeZongoTopAd() {

    const main =
        getZongoMainContent();


    if (
        !main
    ) {

        return;

    }


    const firstContent =
        main.querySelector(
            "h1, h2, p, article, section"
        );


    if (
        !firstContent
    ) {

        return;

    }


    /*
     * Only place a top ad if the page
     * doesn't already have one immediately
     * before the first content.
     */

    if (
        firstContent.previousElementSibling
            ?.classList
            ?.contains(
                "zongo-auto-ad"
            )
    ) {

        return;

    }


    const ad =
        getNextZongoAd();


    if (!ad) {

        return;

    }


    const wrapper =
        renderZongoAd(
            ad,
            "top-responsive"
        );


    if (!wrapper) {

        return;

    }


    firstContent.insertAdjacentElement(
        "beforebegin",
        wrapper
    );


    zongoPlacedAds.push(
        wrapper
    );


    zongoAdCount++;

}


/* =========================================================
   BOTTOM AD
========================================================= */

function placeZongoBottomAd() {

    if (
        zongoAdCount >=
        ZONGO_AD_CONFIG.maximumAds
    ) {

        return;

    }


    const main =
        getZongoMainContent();


    if (
        !main
    ) {

        return;

    }


    const ad =
        getNextZongoAd();


    if (!ad) {

        return;

    }


    const wrapper =
        renderZongoAd(
            ad,
            "bottom-responsive"
        );


    if (!wrapper) {

        return;

    }


    main.appendChild(
        wrapper
    );


    zongoPlacedAds.push(
        wrapper
    );


    zongoAdCount++;

}


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeZongoAds() {

    /*
     * Prevent double initialization.
     */

    if (
        window.__ZONGO_ADS_INITIALIZED__
    ) {

        return;

    }


    window.__ZONGO_ADS_INITIALIZED__ =
        true;


    const loaded =
        await loadZongoAdSource();


    if (!loaded) {

        return;

    }


    /*
     * Give the page a moment to finish
     * rendering dynamic content.
     */

    setTimeout(
        () => {

            placeZongoTopAd();

            placeZongoAds();

            placeZongoBottomAd();

        },
        ZONGO_AD_CONFIG.loadDelay
    );

}


/* =========================================================
   START AFTER DOM
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeZongoAds,
        {
            once: true
        }
    );

} else {

    initializeZongoAds();

}


/* =========================================================
   PUBLIC API
========================================================= */

window.ZongoAds = {

    reload: function () {

        /*
         * Useful for pages where products/articles
         * are loaded dynamically.
         */

        zongoAds = [];

        zongoPlacedAds = [];

        zongoAdCount = 0;

        zongoLastAdPosition = -1;

        zongoLastAdType = null;


        loadZongoAdSource()
            .then(
                () => {

                    placeZongoAds();

                }
            );

    },


    count: function () {

        return zongoAdCount;

    },


    pageType: function () {

        return getZongoPageType();

    }

};

