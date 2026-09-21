/* =========================================================
   HEALTHWISE ARTICLE ENGINE
   article.js
========================================================= */

"use strict";


/* =========================================================
   GLOBAL ARTICLE SETTINGS
========================================================= */

const ARTICLE_CONFIG = {

    /*
     * Change this to your website name.
     */
    siteName: "HealthWise",

    /*
     * Change this to your real website URL.
     */
    siteUrl: "https://yourdomain.com",

    /*
     * Default image if an article image is missing.
     */
    defaultImage:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85",

    /*
     * Maximum number of related articles.
     */
    maxRelatedPosts: 6,

    /*
     * Storage key for articles.
     */
    storageKey: "healthwise_articles"

};



/* =========================================================
   DEFAULT ARTICLES
   ---------------------------------------------------------
   You can later replace these with your real articles.
========================================================= */

const DEFAULT_ARTICLES = [

    {
        title:
            "Vitamin C: Benefits, Food Sources and What You Should Know",

        description:
            "Learn about vitamin C, its role in the body, common food sources and important considerations when using supplements.",

        url:
            "vitamin-c.html",

        category:
            "Health",

        image:
            "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=85",

        alt:
            "Fresh oranges and vitamin C rich fruits",

        date:
            "2026-08-22",

        author:
            "HealthWise Editorial Team",

        readTime:
            "6 min read"

    },

    {
        title:
            "Healthy Foods That Can Support Everyday Wellness",

        description:
            "Discover nutritious foods that can become part of a balanced everyday diet.",

        url:
            "healthy-foods.html",

        category:
            "Food",

        image:
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85",

        alt:
            "Colorful healthy foods and vegetables",

        date:
            "2026-08-21",

        author:
            "HealthWise Editorial Team",

        readTime:
            "5 min read"

    },

    {
        title:
            "Simple Healthy Habits Worth Building Every Day",

        description:
            "Small, consistent lifestyle habits can make healthy living easier and more sustainable.",

        url:
            "healthy-habits.html",

        category:
            "Health",

        image:
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person practicing healthy lifestyle habits",

        date:
            "2026-08-20",

        author:
            "HealthWise Editorial Team",

        readTime:
            "7 min read"

    },

    {
        title:
            "Understanding Dietary Supplements",

        description:
            "A practical introduction to dietary supplements, responsible use and why product information matters.",

        url:
            "supplements.html",

        category:
            "Supplements",

        image:
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",

        alt:
            "Dietary supplement capsules and nutrition products",

        date:
            "2026-08-19",

        author:
            "HealthWise Editorial Team",

        readTime:
            "6 min read"

    },

    {
        title:
            "Why a Balanced Diet Matters",

        description:
            "Learn why variety, balance and moderation are important parts of healthy eating.",

        url:
            "balanced-diet.html",

        category:
            "Food",

        image:
            "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthy balanced meal with vegetables and grains",

        date:
            "2026-08-18",

        author:
            "HealthWise Editorial Team",

        readTime:
            "5 min read"

    },

    {
        title:
            "Common Nutrition Mistakes to Avoid",

        description:
            "A practical look at some common nutrition mistakes and better approaches to everyday eating.",

        url:
            "nutrition-mistakes.html",

        category:
            "Food",

        image:
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthy nutritious meal prepared with fresh ingredients",

        date:
            "2026-08-17",

        author:
            "HealthWise Editorial Team",

        readTime:
            "7 min read"

    }

];



/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        initializeArticlePage();

    }
);



/* =========================================================
   MAIN INITIALIZER
========================================================= */

function initializeArticlePage(){

    try{

        setupLoader();

        setupMobileNavigation();

        setupArticleShare();

        setupArticleData();

        setupRelatedArticles();

        setupSidebarArticles();

        setupSEO();

        setupStructuredData();

        setupLazyImages();

        setupCurrentYear();

        setupExternalLinks();

        hideLoader();

    }
    catch(error){

        console.error(
            "HEALTHWISE ARTICLE INITIALIZATION ERROR:",
            error
        );

        hideLoader();

    }

}



/* =========================================================
   LOADER
========================================================= */

function setupLoader(){

    const loader =
        document.querySelector(
            ".article-loader"
        );

    if(!loader){
        return;
    }

    loader.classList.remove(
        "hidden"
    );

}



function hideLoader(){

    const loader =
        document.querySelector(
            ".article-loader"
        );

    if(!loader){
        return;
    }

    window.setTimeout(
        function(){

            loader.classList.add(
                "hidden"
            );

        },
        350
    );

}



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function setupMobileNavigation(){

    const button =
        document.querySelector(
            ".article-menu-button"
        );

    const navigation =
        document.querySelector(
            ".article-mobile-nav"
        );

    if(
        !button ||
        !navigation
    ){
        return;
    }


    button.addEventListener(
        "click",
        function(){

            const isOpen =
                navigation.classList.toggle(
                    "open"
                );

            button.classList.toggle(
                "active",
                isOpen
            );

            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    const links =
        navigation.querySelectorAll(
            "a"
        );

    links.forEach(
        function(link){

            link.addEventListener(
                "click",
                function(){

                    navigation.classList.remove(
                        "open"
                    );

                    button.classList.remove(
                        "active"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}



/* =========================================================
   SHARE ARTICLE
========================================================= */

function setupArticleShare(){

    const button =
        document.getElementById(
            "shareArticleButton"
        );

    if(!button){
        return;
    }


    button.addEventListener(
        "click",
        async function(){

            await shareArticle();

        }
    );

}



async function shareArticle(){

    const title =
        document.title ||
        "HealthWise Article";

    const url =
        window.location.href;


    /*
     * Native mobile/browser sharing.
     */

    if(
        navigator.share
    ){

        try{

            await navigator.share({

                title:title,

                text:
                    "I found this health article useful.",

                url:url

            });

            return;

        }
        catch(error){

            /*
             * User cancelled share.
             * Do nothing.
             */

            if(
                error &&
                error.name ===
                "AbortError"
            ){
                return;
            }

        }

    }


    /*
     * Clipboard fallback.
     */

    if(
        navigator.clipboard &&
        navigator.clipboard.writeText
    ){

        try{

            await navigator.clipboard.writeText(
                url
            );

            showShareMessage(
                "Article link copied."
            );

            return;

        }
        catch(error){

            console.warn(
                "Clipboard failed:",
                error
            );

        }

    }


    /*
     * Final fallback.
     */

    window.prompt(
        "Copy this article link:",
        url
    );

}



function showShareMessage(
    message
){

    const button =
        document.getElementById(
            "shareArticleButton"
        );

    if(!button){
        return;
    }

    const original =
        button.innerHTML;

    button.innerHTML =
        "✓ " + message;

    window.setTimeout(
        function(){

            button.innerHTML =
                original;

        },
        2200
    );

}



/* =========================================================
   ARTICLE DATA
========================================================= */

function setupArticleData(){

    const article =
        getCurrentArticle();

    if(!article){
        return;
    }

    updateElementText(
        ".article-category",
        article.category
    );

    updateElementText(
        ".article-hero h1",
        article.title
    );

    updateElementText(
        ".article-introduction",
        article.description
    );

    updateElementText(
        ".article-author strong",
        article.author
    );

    updateElementText(
        ".article-date strong",
        formatDate(article.date)
    );

    updateElementText(
        ".article-read-time strong",
        article.readTime
    );


    /*
     * Featured image.
     */

    const featuredImage =
        document.querySelector(
            ".article-featured-image img"
        );

    if(featuredImage){

        featuredImage.src =
            article.image ||
            ARTICLE_CONFIG.defaultImage;

        featuredImage.alt =
            article.alt ||
            article.title;

        featuredImage.loading =
            "eager";

        featuredImage.decoding =
            "async";

    }


    /*
     * Page title.
     */

    if(article.title){

        document.title =
            article.title +
            " | " +
            ARTICLE_CONFIG.siteName;

    }

}



/* =========================================================
   FIND CURRENT ARTICLE
========================================================= */

function getCurrentArticle(){

    const currentFile =
        getCurrentFileName();


    /*
     * First try articles from localStorage.
     */

    let articles =
        loadArticles();


    /*
     * If nothing exists,
     * use default articles.
     */

    if(
        !Array.isArray(articles) ||
        articles.length === 0
    ){

        articles =
            DEFAULT_ARTICLES;

    }


    const found =
        articles.find(
            function(article){

                return normalizeUrl(
                    article.url
                ) ===
                normalizeUrl(
                    currentFile
                );

            }
        );


    /*
     * If the current page is not
     * registered, return default
     * article information from
     * page metadata.
     */

    if(found){
        return found;
    }


    return buildArticleFromHTML();

}



/* =========================================================
   BUILD ARTICLE DATA FROM HTML
========================================================= */

function buildArticleFromHTML(){

    const titleElement =
        document.querySelector(
            ".article-hero h1"
        );

    const descriptionElement =
        document.querySelector(
            ".article-introduction"
        );

    const categoryElement =
        document.querySelector(
            ".article-category"
        );

    const imageElement =
        document.querySelector(
            ".article-featured-image img"
        );


    return {

        title:
            titleElement ?
            titleElement.textContent.trim() :
            document.title,

        description:
            descriptionElement ?
            descriptionElement.textContent.trim() :
            "",

        category:
            categoryElement ?
            categoryElement.textContent.trim() :
            "Health",

        image:
            imageElement ?
            imageElement.src :
            ARTICLE_CONFIG.defaultImage,

        alt:
            imageElement ?
            imageElement.alt :
            "",

        url:
            getCurrentFileName(),

        date:
            new Date().toISOString(),

        author:
            "HealthWise Editorial Team",

        readTime:
            "5 min read"

    };

}



/* =========================================================
   LOAD ARTICLES
========================================================= */

function loadArticles(){

    try{

        const stored =
            localStorage.getItem(
                ARTICLE_CONFIG.storageKey
            );

        if(!stored){
            return DEFAULT_ARTICLES;
        }

        const parsed =
            JSON.parse(stored);

        if(
            !Array.isArray(parsed)
        ){
            return DEFAULT_ARTICLES;
        }

        return parsed;

    }
    catch(error){

        console.warn(
            "Unable to load articles:",
            error
        );

        return DEFAULT_ARTICLES;

    }

}



/* =========================================================
   RELATED ARTICLES
========================================================= */

function setupRelatedArticles(){

    const container =
        document.getElementById(
            "articleRelatedGrid"
        );

    if(!container){
        return;
    }


    const current =
        getCurrentArticle();

    const articles =
        loadArticles();


    const candidates =
        articles.filter(
            function(article){

                return normalizeUrl(
                    article.url
                ) !==
                normalizeUrl(
                    current.url
                );

            }
        );


    /*
     * Prefer same category.
     */

    const sameCategory =
        candidates.filter(
            function(article){

                return normalizeText(
                    article.category
                ) ===
                normalizeText(
                    current.category
                );

            }
        );


    const otherCategory =
        candidates.filter(
            function(article){

                return normalizeText(
                    article.category
                ) !==
                normalizeText(
                    current.category
                );

            }
        );


    let selected =
        shuffleArray(
            sameCategory
        ).slice(
            0,
            ARTICLE_CONFIG.maxRelatedPosts
        );


    if(
        selected.length <
        ARTICLE_CONFIG.maxRelatedPosts
    ){

        selected =
            selected.concat(
                shuffleArray(
                    otherCategory
                ).slice(
                    0,
                    ARTICLE_CONFIG.maxRelatedPosts -
                    selected.length
                )
            );

    }


    container.innerHTML =
        selected
        .map(
            createRelatedCard
        )
        .join("");

}



/* =========================================================
   SIDEBAR ARTICLES
========================================================= */

function setupSidebarArticles(){

    const container =
        document.getElementById(
            "relatedPosts"
        );

    if(!container){
        return;
    }


    const current =
        getCurrentArticle();

    const articles =
        loadArticles();


    const candidates =
        articles.filter(
            function(article){

                return normalizeUrl(
                    article.url
                ) !==
                normalizeUrl(
                    current.url
                );

            }
        );


    const selected =
        shuffleArray(
            candidates
        ).slice(
            0,
            4
        );


    container.innerHTML =
        selected
        .map(
            createSidebarCard
        )
        .join("");

}



/* =========================================================
   RELATED CARD
========================================================= */

function createRelatedCard(
    article
){

    const image =
        escapeAttribute(
            article.image ||
            ARTICLE_CONFIG.defaultImage
        );

    const alt =
        escapeAttribute(
            article.alt ||
            article.title
        );

    const title =
        escapeHTML(
            article.title ||
            "Health Article"
        );

    const description =
        escapeHTML(
            article.description ||
            ""
        );

    const category =
        escapeHTML(
            article.category ||
            "Health"
        );

    const url =
        safeUrl(
            article.url
        );


    return `

        <article
            class="article-related-card"
        >

            <a
                href="${url}"
                aria-label="${title}"
            >

                <div
                    class="article-related-card-image"
                >

                    <img
                        src="${image}"
                        alt="${alt}"
                        loading="lazy"
                        decoding="async"
                    >

                </div>

            </a>


            <div
                class="article-related-card-content"
            >

                <span>
                    ${category}
                </span>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

                <a
                    href="${url}"
                >

                    Read Article

                    <span>
                        →
                    </span>

                </a>

            </div>

        </article>

    `;

}


/* =========================================================
   SIDEBAR CARD
========================================================= */

function createSidebarCard(
    article
){

    const image =
        escapeAttribute(
            article.image ||
            ARTICLE_CONFIG.defaultImage
        );

    const alt =
        escapeAttribute(
            article.alt ||
            article.title
        );

    const title =
        escapeHTML(
            article.title ||
            "Health Article"
        );

    const category =
        escapeHTML(
            article.category ||
            "Health"
        );

    const url =
        safeUrl(
            article.url
        );


    return `

        <a
            class="related-post"
            href="${url}"
        >

            <div
                class="related-post-image"
            >

                <img
                    src="${image}"
                    alt="${alt}"
                    loading="lazy"
                    decoding="async"
                >

            </div>


            <div
                class="related-post-content"
            >

                <span>
                    ${category}
                </span>

                <h4>
                    ${title}
                </h4>

            </div>

        </a>

    `;

}



/* =========================================================
   SEO
========================================================= */

function setupSEO(){

    const article =
        getCurrentArticle();

    if(!article){
        return;
    }


    const canonical =
        buildAbsoluteUrl(
            article.url
        );


    setMeta(
        "description",
        article.description
    );


    setMeta(
        "robots",
        "index, follow, max-image-preview:large"
    );


    setMeta(
        "author",
        article.author ||
        "HealthWise Editorial Team"
    );


    /*
     * Open Graph.
     */

    setMetaProperty(
        "og:title",
        article.title
    );

    setMetaProperty(
        "og:description",
        article.description
    );

    setMetaProperty(
        "og:type",
        "article"
    );

    setMetaProperty(
        "og:url",
        canonical
    );

    setMetaProperty(
        "og:image",
        article.image
    );

    setMetaProperty(
        "og:site_name",
        ARTICLE_CONFIG.siteName
    );


    /*
     * Twitter.
     */

    setMeta(
        "twitter:card",
        "summary_large_image"
    );

    setMeta(
        "twitter:title",
        article.title
    );

    setMeta(
        "twitter:description",
        article.description
    );

    setMeta(
        "twitter:image",
        article.image
    );


    /*
     * Canonical.
     */

    let canonicalElement =
        document.querySelector(
            'link[rel="canonical"]'
        );


    if(!canonicalElement){

        canonicalElement =
            document.createElement(
                "link"
            );

        canonicalElement.rel =
            "canonical";

        document.head.appendChild(
            canonicalElement
        );

    }


    canonicalElement.href =
        canonical;

}



/* =========================================================
   STRUCTURED DATA
========================================================= */

function setupStructuredData(){

    const article =
        getCurrentArticle();

    if(!article){
        return;
    }


    const canonical =
        buildAbsoluteUrl(
            article.url
        );


    const image =
        article.image ||
        ARTICLE_CONFIG.defaultImage;


    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "Article",

        mainEntityOfPage:{

            "@type":
                "WebPage",

            "@id":
                canonical

        },

        headline:
            article.title,

        description:
            article.description,

        image:[
            buildAbsoluteUrl(
                image
            )
        ],

        datePublished:
            article.date,

        dateModified:
            article.date,

        author:{

            "@type":
                "Organization",

            name:
                article.author ||
                "HealthWise Editorial Team"

        },

        publisher:{

            "@type":
                "Organization",

            name:
                ARTICLE_CONFIG.siteName

        },

        articleSection:
            article.category,

        inLanguage:
            "en"

    };


    let script =
        document.getElementById(
            "healthwiseArticleSchema"
        );


    if(!script){

        script =
            document.createElement(
                "script"
            );

        script.type =
            "application/ld+json";

        script.id =
            "healthwiseArticleSchema";

        document.head.appendChild(
            script
        );

    }


    script.textContent =
        JSON.stringify(
            schema
        );

}



/* =========================================================
   META HELPERS
========================================================= */

function setMeta(
    name,
    content
){

    if(!content){
        return;
    }


    let meta =
        document.querySelector(
            `meta[name="${name}"]`
        );


    if(!meta){

        meta =
            document.createElement(
                "meta"
            );

        meta.name =
            name;

        document.head.appendChild(
            meta
        );

    }


    meta.content =
        content;

}



function setMetaProperty(
    property,
    content
){

    if(!content){
        return;
    }


    let meta =
        document.querySelector(
            `meta[property="${property}"]`
        );


    if(!meta){

        meta =
            document.createElement(
                "meta"
            );

        meta.setAttribute(
            "property",
            property
        );

        document.head.appendChild(
            meta
        );

    }


    meta.content =
        content;

}



/* =========================================================
   LAZY IMAGES
========================================================= */

function setupLazyImages(){

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        function(image){

            if(
                !image.hasAttribute(
                    "loading"
                )
            ){

                image.loading =
                    "lazy";

            }

            if(
                !image.hasAttribute(
                    "decoding"
                )
            ){

                image.decoding =
                    "async";

            }

        }
    );

}



/* =========================================================
   CURRENT YEAR
========================================================= */

function setupCurrentYear(){

    const elements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    elements.forEach(
        function(element){

            element.textContent =
                new Date().getFullYear();

        }
    );

}



/* =========================================================
   EXTERNAL LINKS
========================================================= */

function setupExternalLinks(){

    const links =
        document.querySelectorAll(
            "a[href]"
        );


    links.forEach(
        function(link){

            const href =
                link.getAttribute(
                    "href"
                );


            if(
                !href ||
                href.startsWith("#") ||
                href.startsWith("tel:") ||
                href.startsWith("mailto:")
            ){
                return;
            }


            try{

                const url =
                    new URL(
                        href,
                        window.location.href
                    );


                if(
                    url.origin !==
                    window.location.origin
                ){

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                }

            }
            catch(error){

                /*
                 * Ignore malformed URLs.
                 */

            }

        }
    );

}



/* =========================================================
   IMAGE ERROR FALLBACK
========================================================= */

document.addEventListener(
    "error",
    function(event){

        const target =
            event.target;


        if(
            target &&
            target.tagName ===
            "IMG"
        ){

            if(
                target.dataset.fallbackUsed ===
                "true"
            ){
                return;
            }


            target.dataset.fallbackUsed =
                "true";

            target.src =
                ARTICLE_CONFIG.defaultImage;

        }

    },
    true
);



/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(
    array
){

    const copy =
        Array.isArray(array) ?
        [...array] :
        [];


    for(
        let i =
            copy.length - 1;

        i > 0;

        i--
    ){

        const random =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            copy[i],
            copy[random]
        ] =
        [
            copy[random],
            copy[i]
        ];

    }


    return copy;

}



/* =========================================================
   RANDOMIZE RELATED POSTS
========================================================= */

function randomizeArticleContentCards(){

    const containers =
        document.querySelectorAll(
            ".article-related-grid, .related-posts"
        );


    containers.forEach(
        function(container){

            const children =
                Array.from(
                    container.children
                );


            shuffleArray(
                children
            ).forEach(
                function(child){

                    container.appendChild(
                        child
                    );

                }
            );

        }
    );

}



/* =========================================================
   UTILITY:
   CURRENT FILE
========================================================= */

function getCurrentFileName(){

    let pathname =
        window.location.pathname;


    pathname =
        pathname.split(
            "/"
        ).pop();


    if(
        !pathname
    ){

        pathname =
            "index.html";

    }


    return pathname;

}



/* =========================================================
   UTILITY:
   NORMALIZE URL
========================================================= */

function normalizeUrl(
    url
){

    if(!url){
        return "";
    }


    return String(url)
        .split("?")[0]
        .split("#")[0]
        .replace(
            /^.*\//,
            ""
        )
        .toLowerCase();

}



/* =========================================================
   UTILITY:
   NORMALIZE TEXT
========================================================= */

function normalizeText(
    value
){

    return String(
        value || ""
    )
    .trim()
    .toLowerCase();

}



/* =========================================================
   UTILITY:
   DATE
========================================================= */

function formatDate(
    date
){

    if(!date){
        return "";
    }


    const parsed =
        new Date(
            date
        );


    if(
        Number.isNaN(
            parsed.getTime()
        )
    ){

        return String(
            date
        );

    }


    return parsed.toLocaleDateString(
        "en-US",
        {

            year:
                "numeric",

            month:
                "long",

            day:
                "numeric"

        }
    );

}



/* =========================================================
   UTILITY:
   ABSOLUTE URL
========================================================= */

function buildAbsoluteUrl(
    url
){

    if(!url){
        return (
            ARTICLE_CONFIG.siteUrl
        );
    }


    try{

        return new URL(
            url,
            window.location.href
        ).href;

    }
    catch(error){

        return url;

    }

}



/* =========================================================
   UTILITY:
   SAFE URL
========================================================= */

function safeUrl(
    url
){

    if(!url){
        return "#";
    }


    const value =
        String(url).trim();


    /*
     * Allow normal internal files.
     */

    if(
        value.endsWith(
            ".html"
        ) ||
        value.startsWith(
            "/"
        ) ||
        value.startsWith(
            "./"
        ) ||
        value.startsWith(
            "../"
        ) ||
        value.startsWith(
            "#"
        )
    ){

        return escapeAttribute(
            value
        );

    }


    /*
     * Allow HTTPS URLs.
     */

    if(
        value.startsWith(
            "https://"
        )
    ){

        return escapeAttribute(
            value
        );

    }


    return "#";

}



/* =========================================================
   UTILITY:
   UPDATE TEXT
========================================================= */

function updateElementText(
    selector,
    value
){

    const element =
        document.querySelector(
            selector
        );


    if(
        element &&
        value !== undefined &&
        value !== null
    ){

        element.textContent =
            value;

    }

}



/* =========================================================
   UTILITY:
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
){

    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}



/* =========================================================
   UTILITY:
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(
    value
){

    return escapeHTML(
        value
    );

}



/* =========================================================
   ARTICLE VIEW TRACKING
========================================================= */

function trackArticleView(){

    const article =
        getCurrentArticle();

    if(!article){
        return;
    }


    const storageKey =
        "healthwise_article_views";


    let views = {};


    try{

        views =
            JSON.parse(
                localStorage.getItem(
                    storageKey
                ) || "{}"
            );

    }
    catch(error){

        views = {};

    }


    const articleKey =
        normalizeUrl(
            article.url
        );


    if(
        !articleKey
    ){
        return;
    }


    /*
     * Only count once per browser
     * session.
     */

    const sessionKey =
        "healthwise_viewed_" +
        articleKey;


    if(
        sessionStorage.getItem(
            sessionKey
        )
    ){
        return;
    }


    sessionStorage.setItem(
        sessionKey,
        "true"
    );


    views[articleKey] =
        Number(
            views[articleKey] || 0
        ) + 1;


    try{

        localStorage.setItem(
            storageKey,
            JSON.stringify(
                views
            )
        );

    }
    catch(error){

        console.warn(
            "Unable to save article view:",
            error
        );

    }

}



/* =========================================================
   START VIEW TRACKING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        trackArticleView();

    }
);



/* =========================================================
   RANDOMIZE AFTER LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        /*
         * This makes the related article
         * order different after reload.
         */

        randomizeArticleContentCards();

    }
);



/* =========================================================
   GLOBAL EXPORTS
   ---------------------------------------------------------
   Useful later when we build the
   admin/article publishing system.
========================================================= */

window.HealthWiseArticle = {

    getCurrentArticle:
        getCurrentArticle,

    loadArticles:
        loadArticles,

    setupRelatedArticles:
        setupRelatedArticles,

    setupSidebarArticles:
        setupSidebarArticles,

    shuffleArray:
        shuffleArray,

    formatDate:
        formatDate,

    shareArticle:
        shareArticle

};

