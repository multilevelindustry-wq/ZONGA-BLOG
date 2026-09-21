/* ==========================================================
   NEOSTORE PRODUCT PAGE
   product.js
========================================================== */

import {
    auth,
    db
} from "./firebase.js";

import "./currency.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
serverTimestamp,
    increment
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* ==========================================================
   GLOBAL STATE
========================================================== */

let currentUser = null;
let currentProduct = null;
let currentProductId = "";

let productImages = [];
let currentImageIndex = 0;

let allProducts = [];

let selectedRating = 0;

let selectedVariations = {};

let currentChatId = null;


/* ==========================================================
   GET DOM ELEMENTS
========================================================== */

const pageLoader =
    document.getElementById("pageLoader");

const productError =
    document.getElementById("productError");

const productErrorMessage =
    document.getElementById("productErrorMessage");

const productDetails =
    document.getElementById("productDetails");

const productDescriptionSection =
    document.getElementById("productDescriptionSection");

const mainProductImage =
    document.getElementById("mainProductImage");

const productThumbnails =
    document.getElementById("productThumbnails");

const galleryPrevious =
    document.getElementById("galleryPrevious");

const galleryNext =
    document.getElementById("galleryNext");

const galleryImageCounter =
    document.getElementById("galleryImageCounter");

const productCategory =
    document.getElementById("productCategory");

const productName =
    document.getElementById("productName");

const productRating =
    document.getElementById("productRating");

const productReviewCount =
    document.getElementById("productReviewCount");

const productViewCount =
    document.getElementById("productViewCount");

const productPrice =
    document.getElementById("productPrice");

const productOldPrice =
    document.getElementById("productOldPrice");

const productDiscount =
    document.getElementById("productDiscount");

const productShortDescription =
    document.getElementById("productShortDescription");

const productDescription =
    document.getElementById("productDescription");

const productVariationsSection =
    document.getElementById("productVariationsSection");

const productVariations =
    document.getElementById("productVariations");
    
const sellerName =
    document.getElementById("sellerName");

const sellerAvatar =
    document.getElementById("sellerAvatar");

const sellerLocation =
    document.getElementById("sellerLocation");

const chatSellerButton =
    document.getElementById("chatSellerButton");

const callSellerButton =
    document.getElementById("callSellerButton");

const productLocationSection =
    document.getElementById("productLocationSection");

const productLocation =
    document.getElementById("productLocation");

const breadcrumbCategory =
    document.getElementById("breadcrumbCategory");

const breadcrumbProduct =
    document.getElementById("breadcrumbProduct");

const relatedProductsContainer =
    document.getElementById("relatedProductsContainer");

const relatedProductsEmpty =
    document.getElementById("relatedProductsEmpty");

const relatedProductsViewAll =
    document.getElementById("relatedProductsViewAll");

const moreProductsContainer =
    document.getElementById("moreProductsContainer");

const moreProductsEmpty =
    document.getElementById("moreProductsEmpty");

const reviewsSection =
    document.getElementById("reviewsSection");
    
const reviewsAverageRating =
    document.getElementById("reviewsAverageRating");

const reviewsTotalCount =
    document.getElementById("reviewsTotalCount");

const reviewsRatingBreakdown =
    document.getElementById("reviewsRatingBreakdown");

const reviewFormSection =
    document.getElementById("reviewFormSection");

const reviewLoginMessage =
    document.getElementById("reviewLoginMessage");

const reviewForm =
    document.getElementById("reviewForm");

const reviewRatingInput =
    document.getElementById("reviewRatingInput");

const reviewComment =
    document.getElementById("reviewComment");

const reviewsContainer =
    document.getElementById("reviewsContainer");

const reviewsEmpty =
    document.getElementById("reviewsEmpty");

const imageLightbox =
    document.getElementById("imageLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");

const chatModal =
    document.getElementById("chatModal");

const closeChatModal =
    document.getElementById("closeChatModal");

const productChatMessages =
    document.getElementById("productChatMessages");

const productChatForm =
    document.getElementById("productChatForm");

const productChatInput =
    document.getElementById("productChatInput");

const reportProductButton =
    document.getElementById("reportProductButton");

const headerSearchForm =
    document.getElementById("headerSearchForm");

const headerSearch =
    document.getElementById("headerSearch");

const accountLink =
    document.getElementById("accountLink");

const footerYear =
    document.getElementById("footerYear");



/* ==========================================================
   VISIT SELLER STORE
========================================================== */

function updateSellerStoreButton() {

    if (!visitSellerStoreButton) {
        return;
    }


    const sellerId =
        getProductSellerId(
            currentProduct
        );


    if (!sellerId) {

        visitSellerStoreButton.hidden =
            true;

        return;

    }


    visitSellerStoreButton.hidden =
        false;


    visitSellerStoreButton.href =
        `seller-store.html?id=${encodeURIComponent(
            sellerId
        )}`;

}


/* ==========================================================
   BASIC HELPERS
========================================================== */

function normalizeText(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function formatMoney(value) {

    const amount =
        Number(value) || 0;

    return `$${amount.toLocaleString("en-NG")}`;

}


function getTimestampValue(value) {

    if (!value) {
        return 0;
    }

    if (typeof value === "number") {
        return value;
    }

    if (value.seconds) {
        return value.seconds * 1000;
    }

    if (typeof value.toDate === "function") {
        return value.toDate().getTime();
    }

    return 0;

}


function formatDate(value) {

    const timestamp =
        getTimestampValue(value);

    if (!timestamp) {
        return "Recently";
    }

    return new Date(timestamp).toLocaleDateString(
        "en-NG",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


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


function showElement(element) {

    if (element) {
        element.hidden = false;
    }

}


function hideElement(element) {

    if (element) {
        element.hidden = true;
    }

}


/* ==========================================================
   GET PRODUCT ID FROM URL
========================================================== */

function getProductId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("id") ||
        ""
    ).trim();

}


/* ==========================================================
   PRODUCT FIELD HELPERS
========================================================== */

function getProductName(product) {

    return (
        product.name ||
        product.productName ||
        product.title ||
        "Unnamed Product"
    );

}


function getProductPrice(product) {

    return Number(
        product.price ??
        product.sellingPrice ??
        product.productPrice ??
        0
    );

}


function getProductOldPrice(product) {

    return Number(
        product.oldPrice ??
        product.originalPrice ??
        product.compareAtPrice ??
        0
    );

}


function getProductCategory(product) {

    return (
        product.category ||
        product.categoryName ||
        "Other"
    );

}


function getProductDescription(product) {

    return (
        product.description ||
        product.productDescription ||
        ""
    );

}


function getProductShortDescription(product) {

    return (
        product.shortDescription ||
        product.short_description ||
        getProductDescription(product)
    );

}


function getProductSellerId(product) {

    return (
        product.sellerId ||
        product.sellerUID ||
        product.uid ||
        product.ownerId ||
        ""
    );

}


function getProductSellerName(product) {

    return (
        product.sellerName ||
        product.seller?.name ||
        product.seller?.businessName ||
        "Seller"
    );

}


function getProductCountry(product) {

    return (
        product.country ||
        product.location?.country ||
        ""
    );

}


function getProductRegion(product) {

    return (
        product.region ||
        product.state ||
        product.location?.region ||
        product.location?.state ||
        ""
    );

}


function getProductCity(product) {

    return (
        product.city ||
        product.location?.city ||
        ""
    );

}


function getProductArea(product) {

    return (
        product.area ||
        product.location?.area ||
        ""
    );

}


function getProductRating(product) {

    return Number(
        product.rating ??
        product.averageRating ??
        0
    );

}


function getProductReviewCount(product) {

    return Number(
        product.reviewCount ??
        product.reviewsCount ??
        0
    );

}


function getProductViews(product) {

    return Number(
        product.views ??
        product.viewCount ??
        0
    );

}


function getProductDiscount(product) {

    return Number(
        product.discount ??
        product.discountPercentage ??
        0
    );

}

/* ==========================================================
   REVIEW FORM
   STAR SELECTION + SUBMIT PROTECTION
========================================================== */

let selectedReviewRating = 0;


/* ==========================================================
   STAR BUTTONS
========================================================== */

if (reviewRatingInput) {

    const reviewStarButtons =
        reviewRatingInput.querySelectorAll(
            "button[data-rating]"
        );


    reviewStarButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectedReviewRating =
                        Number(
                            button.dataset.rating
                        );


                    reviewStarButtons.forEach(
                        starButton => {

                            const starRating =
                                Number(
                                    starButton.dataset.rating
                                );


                            if (
                                starRating <=
                                selectedReviewRating
                            ) {

                                starButton.classList.add(
                                    "selected"
                                );

                            } else {

                                starButton.classList.remove(
                                    "selected"
                                );

                            }

                        }
                    );

                }
            );

        }
    );

}

/* ==========================================================
   REVIEW FORM SUBMIT
========================================================== */

if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!currentProductId) {

                alert(
                    "No product selected."
                );

                return;

            }


            if (
                selectedReviewRating < 1 ||
                selectedReviewRating > 5
            ) {

                alert(
                    "Please select a star rating."
                );

                return;

            }


            const comment =
                reviewComment
                    ? reviewComment.value.trim()
                    : "";


            if (!comment) {

                alert(
                    "Please write your review."
                );

                return;

            }


            const submitButton =
                reviewForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

            }


            try {

                /*
                 * PREPARE REVIEW DATA
                 */

                const reviewData = {

                    productId:
                        currentProductId,

                    rating:
                        selectedReviewRating,

                    comment:
                        comment,

                    createdAt:
                        serverTimestamp()

                };


                /*
                 * ADD USER INFORMATION
                 */

                if (currentUser) {

                    reviewData.userId =
                        currentUser.uid;

                    reviewData.buyerName =
                        currentUser.displayName ||
                        currentUser.email ||
                        "Buyer";

                    reviewData.buyerEmail =
                        currentUser.email ||
                        "";

                } else {

                    reviewData.userId =
                        "guest";

                    reviewData.buyerName =
                        "Guest Buyer";

                    reviewData.buyerEmail =
                        "";

                }


                /*
                 * SAVE REVIEW
                 */

                await addDoc(
                    collection(
                        db,
                        "productReviews"
                    ),
                    reviewData
                );


                /*
                 * UPDATE PRODUCT RATING
                 * AND REVIEW COUNT
                 */

                const ratingResult =
                    await updateProductRating(
                        currentProductId
                    );


                if (ratingResult) {

                    if (currentProduct) {

                        currentProduct.rating =
                            ratingResult.rating;

                        currentProduct.reviewCount =
                            ratingResult.reviewCount;

                    }

                }


                /*
                 * CLEAR FORM
                 */

                if (reviewComment) {

                    reviewComment.value = "";

                }


                selectedReviewRating = 0;


                reviewStarButtons.forEach(
                    starButton => {

                        starButton.classList.remove(
                            "selected"
                        );

                    }
                );


                /*
                 * RELOAD MAIN PRODUCT REVIEWS
                 */

                await loadProductReviews();


                /*
                 * REFRESH RELATED PRODUCTS
                 */

                await loadRelatedProducts();


                /*
                 * REFRESH MORE PRODUCTS
                 */

                await loadMoreProducts();


                alert(
                    "Your review has been submitted successfully."
                );

            }

            catch (error) {

                console.error(
                    "REVIEW SUBMIT ERROR:",
                    error
                );

                alert(
                    "Unable to submit your review. Please try again."
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Submit Review";

                }

            }

        }
    );

}


/* ==========================================================
   GET REVIEW STAR BUTTONS
========================================================== */

const reviewStarButtons =
    reviewRatingInput
        ? reviewRatingInput.querySelectorAll(
            "button[data-rating]"
        )
        : [];


/* ==========================================================
   STAR SELECTION
========================================================== */

reviewStarButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                selectedReviewRating =
                    Number(
                        button.dataset.rating
                    );


                reviewStarButtons.forEach(
                    starButton => {

                        const starRating =
                            Number(
                                starButton.dataset.rating
                            );


                        if (
                            starRating <=
                            selectedReviewRating
                        ) {

                            starButton.classList.add(
                                "selected"
                            );

                        } else {

                            starButton.classList.remove(
                                "selected"
                            );

                        }

                    }
                );

            }
        );

    }
);




/* ==========================================================
   PRODUCT IMAGES
========================================================== */

function getProductImages(product) {

    const images = [];

    function addImage(image) {

        if (
            typeof image !== "string" ||
            !image.trim()
        ) {
            return;
        }

        const cleanImage =
            image.trim();

        if (
            !images.includes(cleanImage)
        ) {

            images.push(cleanImage);

        }

    }


    /*
     * Main product image
     */

    addImage(product.mainImage);
    addImage(product.image);
    addImage(product.imageUrl);


    /*
     * Product gallery
     */

    if (Array.isArray(product.images)) {

        product.images.forEach(image => {

            if (typeof image === "string") {

                addImage(image);

            }

            else if (
                image &&
                typeof image.url === "string"
            ) {

                addImage(image.url);

            }

        });

    }


    /*
     * Gallery field
     */

    if (Array.isArray(product.gallery)) {

        product.gallery.forEach(image => {

            if (typeof image === "string") {

                addImage(image);

            }

            else if (
                image &&
                typeof image.url === "string"
            ) {

                addImage(image.url);

            }

        });

    }


    /*
     * Variation images
     */

    if (Array.isArray(product.variations)) {

        product.variations.forEach(
            variation => {

                if (!variation) {
                    return;
                }

                addImage(
                    variation.image
                );

                addImage(
                    variation.imageUrl
                );

                if (
                    Array.isArray(
                        variation.images
                    )
                ) {

                    variation.images.forEach(
                        image => {

                            addImage(image);

                        }
                    );

                }

            }
        );

    }


    /*
     * Fallback
     */

    if (!images.length) {

        images.push(
            "https://via.placeholder.com/700x700?text=NeoStore"
        );

    }

    return images;

}



/* ==========================================================
   REVIEW FORM / LOGIN MESSAGE
========================================================== */

if (currentUser) {

    if (reviewFormSection) {

        reviewFormSection.hidden = false;

    }

    if (reviewLoginMessage) {

        reviewLoginMessage.hidden = true;

    }

} else {

    if (reviewFormSection) {

        reviewFormSection.hidden = true;

    }

    if (reviewLoginMessage) {

        reviewLoginMessage.hidden = false;

    }

}


/* ==========================================================
   LOAD PRODUCT REVIEWS
========================================================== */

async function loadProductReviews() {

    if (!currentProductId) return;
    
    /* ==========================================================
   SHOW REVIEWS SECTION
========================================================== */

if (reviewsSection) {

    reviewsSection.hidden = false;

}

    try {

        const reviewsRef = collection(
            db,
            "productReviews"
        );

        let snapshot;

        try {

            const reviewsQuery = query(
                reviewsRef,
                where(
                    "productId",
                    "==",
                    currentProductId
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(100)
            );

            snapshot = await getDocs(reviewsQuery);

        } catch (indexError) {

            /*
             * If Firestore requires an index,
             * load without orderBy.
             */

            const reviewsQuery = query(
                reviewsRef,
                where(
                    "productId",
                    "==",
                    currentProductId
                ),
                limit(100)
            );

            snapshot = await getDocs(reviewsQuery);
        }


        const reviews = [];


        snapshot.forEach((reviewDoc) => {

            const data = reviewDoc.data();

            reviews.push({
                id: reviewDoc.id,
                ...data
            });

        });

/* ==========================================================
   UPDATE PRODUCT REVIEW SUMMARY
========================================================== */

updateReviewSummary(reviews);

        /*
         * Sort newest first.
         */

        reviews.sort((a, b) => {

            const dateA =
                getTimestampValue(a.createdAt);

            const dateB =
                getTimestampValue(b.createdAt);

            return dateB - dateA;

        });


        /*
         * Calculate average rating.
         */

        let totalRating = 0;

        reviews.forEach((review) => {

            const rating =
                Number(review.rating) || 0;

            totalRating += rating;

        });


        const totalReviews =
            reviews.length;


        const averageRating =
            totalReviews > 0
                ? totalRating / totalReviews
                : 0;


        /*
         * Update review summary.
         */

        if (reviewsAverageRating) {

            reviewsAverageRating.textContent =
                totalReviews > 0
                    ? averageRating.toFixed(1)
                    : "0.0";

        }


        if (reviewsTotalCount) {

            reviewsTotalCount.textContent =
                totalReviews;

        }


        /*
         * Rating breakdown.
         */

        if (reviewsRatingBreakdown) {

            const breakdown = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            };


            reviews.forEach((review) => {

                const rating =
                    Number(review.rating);

                if (breakdown[rating] !== undefined) {

                    breakdown[rating]++;

                }

            });


            reviewsRatingBreakdown.innerHTML = "";


            for (let rating = 5; rating >= 1; rating--) {

                const count =
                    breakdown[rating];

                const percentage =
                    totalReviews > 0
                        ? (count / totalReviews) * 100
                        : 0;


                const row =
                    document.createElement("div");

                row.className =
                    "rating-breakdown-row";


                row.innerHTML = `
                    <span>${rating} ★</span>

                    <div class="rating-breakdown-bar">
                        <div
                            class="rating-breakdown-fill"
                            style="width:${percentage}%"
                        ></div>
                    </div>

                    <span>${count}</span>
                `;


                reviewsRatingBreakdown.appendChild(row);

            }

        }


        /*
         * No reviews.
         */

        if (!reviews.length) {

            if (reviewsContainer) {

                reviewsContainer.innerHTML = "";

            }

            if (reviewsEmpty) {

                reviewsEmpty.hidden = false;

            }

            return;

        }


        if (reviewsEmpty) {

            reviewsEmpty.hidden = true;

        }


        /*
         * Display reviews.
         */

        if (!reviewsContainer) return;


        reviewsContainer.innerHTML = "";


        reviews.forEach((review) => {

            const reviewElement =
                document.createElement("article");

            reviewElement.className =
                "product-review";


            const reviewerName =
                review.buyerName ||
                review.userName ||
                review.displayName ||
                review.name ||
                review.buyerEmail ||
                review.email ||
                "Buyer";


            const rating =
                Math.min(
                    5,
                    Math.max(
                        0,
                        Number(review.rating) || 0
                    )
                );


            const comment =
                review.comment ||
                review.review ||
                review.text ||
                "";


            const date =
                formatDate(review.createdAt);


            const stars =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);


            reviewElement.innerHTML = `

                <div class="review-header">

                    <strong>
                        ${escapeHTML(reviewerName)}
                    </strong>

                    <span class="review-stars">
                        ${stars}
                    </span>

                </div>

                <div class="review-date">
                    ${escapeHTML(date)}
                </div>

                <p class="review-comment">
                    ${escapeHTML(comment)}
                </p>

            `;


            reviewsContainer.appendChild(
                reviewElement
            );

        });

    } catch (error) {

        console.error(
            "",
            error
        );
        

        if (reviewsContainer) {

            reviewsContainer.innerHTML = `
                <div class="reviews-error">
                    Unable to load reviews.
                </div>
            `;

        }

    }

}


/* ==========================================================
   UPDATE RATINGS FOR PRODUCT CARDS
========================================================== */

async function updateProductsRatings(products) {

    if (!Array.isArray(products) || !products.length) {
        return products;
    }

    try {

        await Promise.all(

            products.map(
                async product => {

                    if (!product.id) {
                        return;
                    }

                    const reviewsQuery =
                        query(
                            collection(
                                db,
                                "productReviews"
                            ),
                            where(
                                "productId",
                                "==",
                                product.id
                            )
                        );


                    const snapshot =
                        await getDocs(
                            reviewsQuery
                        );


                    let totalRating = 0;


                    snapshot.forEach(
                        reviewDoc => {

                            const review =
                                reviewDoc.data();

                            totalRating +=
                                Number(
                                    review.rating || 0
                                );

                        }
                    );


                    const reviewCount =
                        snapshot.size;


                    const averageRating =
                        reviewCount > 0
                            ? Number(
                                (
                                    totalRating /
                                    reviewCount
                                ).toFixed(1)
                            )
                            : 0;


                    product.rating =
                        averageRating;

                    product.reviewCount =
                        reviewCount;

                }
            )

        );


        return products;

    }

    catch (error) {

        console.error(
            "UPDATE CARD RATINGS ERROR:",
            error
        );

        return products;

    }

}

/* ==========================================================
   CALCULATE AND SAVE PRODUCT RATING
========================================================== */

async function updateProductRating(productId) {

    if (!productId) {
        return;
    }

    try {

        const reviewsQuery =
            query(
                collection(
                    db,
                    "productReviews"
                ),
                where(
                    "productId",
                    "==",
                    productId
                )
            );


        const snapshot =
            await getDocs(
                reviewsQuery
            );


        let totalRating = 0;


        snapshot.forEach(
            reviewDoc => {

                const review =
                    reviewDoc.data();

                totalRating +=
                    Number(
                        review.rating || 0
                    );

            }
        );


        const reviewCount =
            snapshot.size;


        const averageRating =
            reviewCount > 0
                ? Number(
                    (
                        totalRating /
                        reviewCount
                    ).toFixed(1)
                )
                : 0;


        await updateDoc(
            doc(
                db,
                "products",
                productId
            ),
            {

                rating:
                    averageRating,

                reviewCount:
                    reviewCount

            }
        );


        return {
            rating:
                averageRating,

            reviewCount:
                reviewCount
        };

    }

    catch (error) {

        console.error(
            "UPDATE PRODUCT RATING ERROR:",
            error
        );

        throw error;

    }

} 


/* ==========================================================
   ENSURE PRODUCT HAS A PERMANENT DISCOUNT
========================================================== */

async function ensureProductDiscount(
    productId,
    productData
) {

    if (!productId || !productData) {
        return productData;
    }


    /*
     * If discount already exists,
     * NEVER generate another one.
     */

    const existingDiscount =
        Number(productData.discount);

    const existingOldPrice =
        Number(productData.oldPrice);


    if (
        Number.isFinite(existingDiscount) &&
        existingDiscount >= 10 &&
        existingDiscount <= 49 &&
        Number.isFinite(existingOldPrice) &&
        existingOldPrice > 0
    ) {

        return productData;

    }


    /*
     * Get the actual selling price.
     */

    const sellingPrice =
        Number(
            productData.price ??
            productData.sellingPrice ??
            productData.productPrice
        );


    if (
        !Number.isFinite(sellingPrice) ||
        sellingPrice <= 0
    ) {

        return productData;

    }


    /*
     * Generate ONE permanent discount.
     */

    const discount =
        generateAutomaticDiscount();


    const oldPrice =
        calculateOldPrice(
            sellingPrice,
            discount
        );


    /*
     * Save it permanently.
     */

    const productRef =
        doc(
            db,
            "products",
            productId
        );


    await updateDoc(
        productRef,
        {
            oldPrice: oldPrice,
            discount: discount,
            discountGenerated: true,
            discountGeneratedAt: serverTimestamp()
        }
    );


    /*
     * Update the local product object too.
     */

    return {
        ...productData,
        oldPrice: oldPrice,
        discount: discount,
        discountGenerated: true
    };

}


/* ==========================================================
   AUTOMATIC PRODUCT DISCOUNT
========================================================== */

function generateAutomaticDiscount() {

    // Random discount from 10% to 49%
    return Math.floor(
        Math.random() * 40
    ) + 10;

}


function calculateOldPrice(
    sellingPrice,
    discountPercentage
) {

    const price = Number(sellingPrice);

    const discount =
        Number(discountPercentage) / 100;

    if (
        !Number.isFinite(price) ||
        price <= 0 ||
        discount <= 0 ||
        discount >= 1
    ) {
        return price;
    }

    /*
     * Selling price =
     * old price × (1 - discount)
     *
     * Therefore:
     *
     * old price =
     * selling price / (1 - discount)
     */

    return Math.round(
        price / (1 - discount)
    );

}

/* ==========================================================
   LOAD SELECTED PRODUCT
========================================================== */

async function loadSelectedProduct() {

    if (!currentProductId) {

        showProductError(
            "No product was selected."
        );

        return;
    }


    try {

        showElement(pageLoader);


        /* ======================================================
           GET PRODUCT
        ====================================================== */

        const productRef =
            doc(
                db,
                "products",
                currentProductId
            );


        const snapshot =
            await getDoc(productRef);


        if (!snapshot.exists()) {

            throw new Error(
                "Product not found."
            );

        }


        let productData =
            snapshot.data();


        /* ======================================================
           CHECK PRODUCT STATUS
        ====================================================== */

        if (
            productData.status &&
            productData.status !== "active"
        ) {

            throw new Error(
                "This product is no longer available."
            );

        }


        /* ======================================================
           AUTOMATIC DISCOUNT
        ====================================================== */

        productData =
            await ensureProductDiscount(
                currentProductId,
                productData
            );


        /* ======================================================
           SAVE CURRENT PRODUCT
        ====================================================== */

        currentProduct = {

            id: snapshot.id,

            ...productData

        };


        /* ======================================================
           RENDER PRODUCT
        ====================================================== */

        renderSelectedProduct();
        
        await recordProductView();


        /* ======================================================
           LOAD RELATED PRODUCTS
        ====================================================== */

        await loadRelatedProducts();


        /* ======================================================
           LOAD MORE PRODUCTS
        ====================================================== */

        await loadMoreProducts();


        /* ======================================================
           LOAD REVIEWS
        ====================================================== */

        await loadProductReviews();


        /* ======================================================
           SHOW PRODUCT
        ====================================================== */

        showElement(
            productDetails
        );


        hideElement(
            productError
        );


    }

    catch (error) {

        console.error(
            "PRODUCT LOAD ERROR:",
            error
        );


        showProductError(
            error.message ||
            "Unable to load this product."
        );

    }

    finally {

        hideElement(
            pageLoader
        );

    }

}



/* ==========================================================
   PRODUCT ERROR
========================================================== */

function showProductError(message) {

    hideElement(pageLoader);
    hideElement(productDetails);
    hideElement(productDescriptionSection);

    if (productErrorMessage) {

        productErrorMessage.textContent =
            message;

    }

    showElement(productError);

}


/* ==========================================================
   RENDER SELECTED PRODUCT
========================================================== */

function renderSelectedProduct() {

    const product =
        currentProduct;

    const name =
        getProductName(product);

    const category =
        getProductCategory(product);

    const price =
        getProductPrice(product);

    const oldPrice =
        getProductOldPrice(product);

    const rating =
    Number(
        product.rating || 0
    );

const reviewCount =
    Number(
        product.reviewCount || 0
    );

    const views =
        getProductViews(product);

    const discount =
        getProductDiscount(product);


    document.title =
        `${name} | NeoStore`;


    if (productName) {

        productName.textContent =
            name;

    }


    if (productCategory) {

        productCategory.textContent =
            category;

    }


    if (productPrice) {

        productPrice.textContent =
            formatMoney(price);

    }


    if (productOldPrice) {

        if (
            oldPrice > price &&
            oldPrice > 0
        ) {

            productOldPrice.textContent =
                formatMoney(oldPrice);

            showElement(
                productOldPrice
            );

        }

        else {

            hideElement(
                productOldPrice
            );

        }

    }


    if (productDiscount) {

        let calculatedDiscount =
            discount;

        if (
            calculatedDiscount <= 0 &&
            oldPrice > price &&
            oldPrice > 0
        ) {

            calculatedDiscount =
                Math.round(
                    (
                        (oldPrice - price) /
                        oldPrice
                    ) * 100
                );

        }


        if (calculatedDiscount > 0) {

            productDiscount.textContent =
                `${calculatedDiscount}% OFF`;

            showElement(
                productDiscount
            );

        }

        else {

            hideElement(
                productDiscount
            );

        }

    }


    if (productShortDescription) {

        productShortDescription.textContent =
            getProductShortDescription(product);

    }


    if (productDescription) {

        productDescription.textContent =
            getProductDescription(product);

    }


    if (productRating) {

        productRating.textContent =
            `★ ${rating.toFixed(1)}`;

    }


    if (productReviewCount) {

        productReviewCount.textContent =
            reviewCount > 0
                ? `${reviewCount} reviews`
                : "No reviews";

    }


    if (productViewCount) {

        productViewCount.textContent =
            `${views.toLocaleString()} views`;

    }


    if (breadcrumbProduct) {

        breadcrumbProduct.textContent =
            name;

    }


    if (breadcrumbCategory) {

        breadcrumbCategory.textContent =
            category;

        breadcrumbCategory.href =
            `category.html?category=${encodeURIComponent(category)}`;

    }


    renderGallery();

    renderVariations();

    renderSeller();

    renderLocation();

}

if (productShortDescription) {

    productShortDescription.addEventListener(
        "click",
        () => {

            productShortDescription.classList.toggle(
                "expanded"
            );

        }
    );

}



/* ==========================================================
   PRODUCT GALLERY
========================================================== */

function renderGallery() {

    productImages =
        getProductImages(
            currentProduct
        );

    currentImageIndex = 0;

    renderMainImage();

    renderThumbnails();

}


function renderMainImage() {

    if (!mainProductImage) {
        return;
    }

    const image =
        productImages[
            currentImageIndex
        ];

    if (!image) {
        return;
    }


    mainProductImage.src =
        image;

    mainProductImage.alt =
        getProductName(
            currentProduct
        );


    if (galleryImageCounter) {

        galleryImageCounter.textContent =
            `${currentImageIndex + 1} / ${productImages.length}`;

    }

}


function renderThumbnails() {

    if (!productThumbnails) {
        return;
    }

    productThumbnails.innerHTML = "";


    productImages.forEach(
        (image, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "product-thumbnail";


            if (
                index === currentImageIndex
            ) {

                button.classList.add(
                    "active"
                );

            }


            const imageElement =
                document.createElement("img");

            imageElement.src =
                image;

            imageElement.alt =
                `Product image ${index + 1}`;

            imageElement.loading =
                "lazy";


            button.appendChild(
                imageElement
            );


            button.addEventListener(
                "click",
                () => {

                    currentImageIndex =
                        index;

                    renderMainImage();
                    renderThumbnails();

                }
            );


            productThumbnails.appendChild(
                button
            );

        }
    );

}


function previousGalleryImage() {

    if (
        productImages.length <= 1
    ) {
        return;
    }


    currentImageIndex--;

    if (
        currentImageIndex < 0
    ) {

        currentImageIndex =
            productImages.length - 1;

    }


    renderMainImage();
    renderThumbnails();

}


function nextGalleryImage() {

    if (
        productImages.length <= 1
    ) {
        return;
    }


    currentImageIndex++;

    if (
        currentImageIndex >=
        productImages.length
    ) {

        currentImageIndex = 0;

    }


    renderMainImage();
    renderThumbnails();

}


/* ==========================================================
   PRODUCT VARIATIONS
========================================================== */

function renderVariations() {

    if (!productVariations) {
        return;
    }


    const variations =
        currentProduct.variations;


    if (
        !Array.isArray(variations) ||
        !variations.length
    ) {

        hideElement(
            productVariationsSection
        );

        return;

    }


    showElement(
        productVariationsSection
    );


    productVariations.innerHTML = "";


    variations.forEach(
        (variation, index) => {

            if (!variation) {
                return;
            }


            const name =
                variation.name ||
                variation.title ||
                `Option ${index + 1}`;


            const value =
                variation.value ||
                variation.label ||
                "";


            const group =
                document.createElement("div");

            group.className =
                "variation-group";


            const label =
                document.createElement("strong");

            label.textContent =
                name;


            const options =
                document.createElement("div");

            options.className =
                "variation-options";


            const option =
                document.createElement("button");

            option.type = "button";

            option.className =
                "variation-option";

            option.textContent =
                value || "Select";


            option.addEventListener(
                "click",
                () => {

                    selectedVariations[index] =
                        variation;


                    options
                        .querySelectorAll(
                            ".variation-option"
                        )
                        .forEach(
                            button => {

                                button.classList.remove(
                                    "active"
                                );

                            }
                        );


                    option.classList.add(
                        "active"
                    );


                    const variationImage =
                        variation.image ||
                        variation.imageUrl;


                    if (variationImage) {

                        const imageIndex =
                            productImages.indexOf(
                                variationImage
                            );


                        if (imageIndex >= 0) {

                            currentImageIndex =
                                imageIndex;

                            renderMainImage();
                            renderThumbnails();

                        }

                    }

                }
            );


            options.appendChild(
                option
            );

            group.appendChild(
                label
            );

            group.appendChild(
                options
            );

            productVariations.appendChild(
                group
            );

        }
    );

}


/* ==========================================================
   SELLER INFORMATION
========================================================== */

function renderSeller() {

    const seller =
        getProductSellerName(
            currentProduct
        );


    if (sellerName) {

        sellerName.textContent =
            seller;

    }


    if (sellerAvatar) {

        sellerAvatar.textContent =
            seller
                .charAt(0)
                .toUpperCase();

    }


    const locationParts = [

        getProductCity(
            currentProduct
        ),

        getProductRegion(
            currentProduct
        ),

        getProductCountry(
            currentProduct
        )

    ].filter(Boolean);


    if (sellerLocation) {

        sellerLocation.textContent =
            locationParts.length
                ? locationParts.join(", ")
                : "Location unavailable";

    }


    const phones =
        getSellerPhones(
            currentProduct
        );


    if (callSellerButton) {

        if (phones.length) {

            callSellerButton.href =
                `tel:${phones[0]}`;

            callSellerButton.textContent =
                "Call Seller";

        }

        else {

            callSellerButton.removeAttribute(
                "href"
            );

            callSellerButton.textContent =
                "Phone unavailable";

        }

    }

updateSellerStoreButton();

}



   

function getSellerPhones(product) {

    const phones = [];

    const possiblePhones = [

        product.phone1,
        product.phone2,

        product.phone,
        product.phoneNumber,

        product.sellerPhone,
        product.sellerPhone1,
        product.sellerPhone2,

        product.contact?.phone,
        product.contact?.phone1,
        product.contact?.phone2

    ];


    possiblePhones.forEach(
        phone => {

            if (
                phone !== undefined &&
                phone !== null
            ) {

                const cleanPhone =
                    String(phone).trim();


                if (
                    cleanPhone &&
                    !phones.includes(
                        cleanPhone
                    )
                ) {

                    phones.push(
                        cleanPhone
                    );

                }

            }

        }
    );


    return phones;

}


productDescription?.addEventListener(
    "click",
    () => {

        const fullDescription =
            productDescription.dataset.fullDescription;

        if (fullDescription) {

            alert(fullDescription);

        }

    }
);


/* ==========================================================
   PRODUCT LOCATION
========================================================== */

function renderLocation() {

    const locationParts = [

        getProductArea(
            currentProduct
        ),

        getProductCity(
            currentProduct
        ),

        getProductRegion(
            currentProduct
        ),

        getProductCountry(
            currentProduct
        )

    ].filter(Boolean);


    if (
        !locationParts.length
    ) {

        hideElement(
            productLocationSection
        );

        return;

    }


    showElement(
        productLocationSection
    );


    if (productLocation) {

        productLocation.textContent =
            locationParts.join(", ");

    }

}


/* ==========================================================
   LOAD RELATED PRODUCTS
   SAME CATEGORY
   MAXIMUM 10
========================================================== */

async function loadRelatedProducts() {

    if (!relatedProductsContainer) {
        return;
    }


    try {

        const productsSnapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        const currentCategory =
            normalizeText(
                getProductCategory(
                    currentProduct
                )
            );


        const related = [];


        productsSnapshot.forEach(
            productDoc => {

                if (
                    productDoc.id ===
                    currentProductId
                ) {
                    return;
                }


                const data =
                    productDoc.data();


                if (
                    data.status &&
                    data.status !== "active"
                ) {
                    return;
                }


                const category =
                    normalizeText(
                        getProductCategory(
                            data
                        )
                    );


                if (
                    category ===
                    currentCategory
                ) {

                    related.push({

                        id: productDoc.id,

                        ...data

                    });

                }

            }
        );


        const selectedRelated =
    shuffleArray(
        related
    ).slice(
        0,
        10
    );


await updateProductsRatings(
    selectedRelated
);


renderProductCards(
    relatedProductsContainer,
    selectedRelated,
    relatedProductsEmpty
);

        if (relatedProductsViewAll) {

            relatedProductsViewAll.href =
                `category.html?category=${encodeURIComponent(
                    getProductCategory(
                        currentProduct
                    )
                )}`;

        }

    }

    catch (error) {

        console.error(
            "RELATED PRODUCTS ERROR:",
            error
        );

        renderProductCards(
            relatedProductsContainer,
            [],
            relatedProductsEmpty
        );

    }

}

function setupReviewLimit() {

    const reviewsContainer =
        document.getElementById("reviewsContainer");

    if (!reviewsContainer) return;

    const reviews =
        reviewsContainer.querySelectorAll(".review-item");

    const maxReviews = 3;

    reviews.forEach((review, index) => {

        if (index >= maxReviews) {

            review.classList.add(
                "hidden-review"
            );

        }

    });


    let viewMoreButton =
        document.getElementById(
            "viewMoreReviewsButton"
        );


    if (!viewMoreButton) {

        viewMoreButton =
            document.createElement("button");

        viewMoreButton.id =
            "viewMoreReviewsButton";

        viewMoreButton.textContent =
            "View More Reviews";

        reviewsContainer.after(
            viewMoreButton
        );

    }


    if (reviews.length <= maxReviews) {

        viewMoreButton.style.display =
            "none";

        return;

    }


    viewMoreButton.style.display =
        "block";


    viewMoreButton.onclick = () => {

        reviews.forEach(review => {

            review.classList.remove(
                "hidden-review"
            );

        });

        viewMoreButton.style.display =
            "none";

    };

}


 /* ==========================================================
   LOAD MORE PRODUCTS
   MAXIMUM 40
========================================================== */

async function loadMoreProducts() {

    if (!moreProductsContainer) {
        return;
    }


    try {

        /*
         * ALWAYS REFRESH PRODUCTS
         * so updated ratings are loaded
         */

        allProducts = [];


        const productsSnapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        productsSnapshot.forEach(
            productDoc => {

                if (
                    productDoc.id ===
                    currentProductId
                ) {
                    return;
                }


                const data =
                    productDoc.data();


                if (
                    data.status &&
                    data.status !==
                    "active"
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
         * Shuffle on every page load
         */

        const randomProducts =
    shuffleArray(
        allProducts
    ).slice(
        0,
        40
    );


await updateProductsRatings(
    randomProducts
);


renderProductCards(
    moreProductsContainer,
    randomProducts,
    moreProductsEmpty
);

    }

    catch (error) {

        console.error(
            "MORE PRODUCTS ERROR:",
            error
        );


        renderProductCards(
            moreProductsContainer,
            [],
            moreProductsEmpty
        );

    }

}


/* ==========================================================
   PRODUCT CARDS
========================================================== */

function renderProductCards(
    container,
    products,
    emptyElement
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!products.length) {

        showElement(
            emptyElement
        );

        return;

    }


    hideElement(
        emptyElement
    );


    products.forEach(
        product => {

            container.appendChild(
                createProductCard(
                    product
                )
            );

        }
    );

}



/* ==========================================================
   RECORD PRODUCT VIEW
========================================================== */

async function recordProductView() {

    if (!currentProductId) {
        return;
    }

    try {

        const productRef =
            doc(
                db,
                "products",
                currentProductId
            );


        const snapshot =
            await getDoc(productRef);


        if (!snapshot.exists()) {
            return;
        }


        const data =
            snapshot.data();


        const currentViews =
            Number(
                data.views ??
                data.viewCount ??
                0
            );


        const newViews =
            currentViews + 1;


        await updateDoc(
            productRef,
            {
                views: increment(1)
            }
        );


        currentProduct.views =
            newViews;


        if (productViewCount) {

            productViewCount.textContent =
                `${newViews.toLocaleString()} views`;

        }


        console.log(
            "PRODUCT VIEW RECORDED:",
            newViews
        );

    } catch (error) {

        console.error(
            "RECORD PRODUCT VIEW ERROR:",
            error
        );

    }

}




function createProductCard(product) {

    const card =
        document.createElement("a");


    card.className =
        "product-card";


    card.href =
        `product.html?id=${encodeURIComponent(
            product.id
        )}`;


    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "product-card-image-wrapper";


    const image =
        document.createElement("img");

    image.className =
        "product-card-image";


    image.src =
        getProductImage(
            product
        );


    image.alt =
        getProductName(
            product
        );


    image.loading =
        "lazy";


    const discount =
        getProductDiscount(
            product
        );


    if (discount > 0) {

        const badge =
            document.createElement("span");

        badge.className =
            "product-card-badge";

        badge.textContent =
            `${discount}% OFF`;

        imageWrapper.appendChild(
            badge
        );

    }


    imageWrapper.appendChild(
        image
    );


    const content =
        document.createElement("div");

    content.className =
        "product-card-content";


    const category =
        document.createElement("span");

    category.className =
        "product-card-category";

    category.textContent =
        getProductCategory(
            product
        );


    const name =
        document.createElement("h3");

    name.className =
        "product-card-name";

    name.textContent =
        getProductName(
            product
        );


    const price =
        document.createElement("strong");

    price.className =
        "product-card-price";

    price.textContent =
        formatMoney(
            getProductPrice(
                product
            )
        );


    const rating =
    document.createElement("span");

rating.className =
    "product-card-rating";


const productRating =
    Number(
        product.rating || 0
    );


const productReviewCount =
    Number(
        product.reviewCount || 0
    );


rating.textContent =
    `★ ${productRating.toFixed(1)} (${productReviewCount})`;

    const seller =
        document.createElement("span");

    seller.className =
        "product-card-seller";

    seller.textContent =
        getProductSellerName(
            product
        );


    const location =
        document.createElement("span");

    location.className =
        "product-card-location";


    const locationParts = [

        getProductCity(product),
        getProductRegion(product),
        getProductCountry(product)

    ].filter(Boolean);


    location.textContent =
        locationParts.length
            ? locationParts.join(", ")
            : "Location unavailable";


    content.appendChild(
        category
    );

    content.appendChild(
        name
    );

    content.appendChild(
        price
    );

    content.appendChild(
        rating
    );

    content.appendChild(
        seller
    );

    content.appendChild(
        location
    );


    card.appendChild(
        imageWrapper
    );

    card.appendChild(
        content
    );


    return card;

}


function getProductImage(product) {

    const images =
        getProductImages(
            product
        );

    return images[0];

}



        
        /* ==========================================================
   RENDER REVIEWS
========================================================== */

function renderReviews(reviews) {

    if (!reviewsContainer) {
        return;
    }


    reviewsContainer.innerHTML = "";


    if (!reviews.length) {

        showElement(
            reviewsEmpty
        );

        updateReviewSummary([]);

        return;

    }


    hideElement(
        reviewsEmpty
    );


    reviews.forEach(
        review => {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "product-review";


            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "review-header";


            const buyer =
                document.createElement(
                    "strong"
                );


            buyer.className =
                "review-buyer";


            buyer.textContent =
                review.buyerName ||
                "Buyer";


            const date =
                document.createElement(
                    "span"
                );


            date.className =
                "review-date";


            date.textContent =
                formatDate(
                    review.createdAt
                );


            header.appendChild(
                buyer
            );

            header.appendChild(
                date
            );


            const stars =
                document.createElement(
                    "div"
                );


            stars.className =
                "review-stars";


            const rating =
                Math.max(
                    0,
                    Math.min(
                        5,
                        Number(
                            review.rating
                        ) || 0
                    )
                );


            stars.textContent =
                "★".repeat(
                    rating
                ) +
                "☆".repeat(
                    5 - rating
                );


            const comment =
                document.createElement(
                    "p"
                );


            comment.className =
                "review-comment";


            comment.textContent =
                review.comment ||
                "";


            article.appendChild(
                header
            );

            article.appendChild(
                stars
            );

            article.appendChild(
                comment
            );


            reviewsContainer.appendChild(
                article
            );

        }
    );


    updateReviewSummary(
        reviews
    );

setupReviewLimit();
}


/* ==========================================================
   REVIEW SUMMARY
========================================================== */

function updateReviewSummary(
    reviews
) {

    const total =
        reviews.length;


    const average =
        total
            ? reviews.reduce(
                (
                    sum,
                    review
                ) => {

                    return (
                        sum +
                        Number(
                            review.rating || 0
                        )
                    );

                },
                0
            ) / total
            : 0;


    if (reviewsAverageRating) {

        reviewsAverageRating.textContent =
            average.toFixed(1);

    }


    if (reviewsTotalCount) {

        reviewsTotalCount.textContent =
            `${total} reviews`;

    }


    if (productRating) {

        productRating.textContent =
            `★ ${average.toFixed(1)}`;

    }


    if (productReviewCount) {

        productReviewCount.textContent =
            total
                ? `${total} reviews`
                : "No reviews";

    }


    renderRatingBreakdown(
        reviews
    );

}


function renderRatingBreakdown(
    reviews
) {

    if (!reviewsRatingBreakdown) {
        return;
    }


    reviewsRatingBreakdown.innerHTML = "";


    for (
        let rating = 5;
        rating >= 1;
        rating--
    ) {

        const count =
            reviews.filter(
                review =>
                    Number(
                        review.rating
                    ) === rating
            ).length;


        const percentage =
            reviews.length
                ? (
                    count /
                    reviews.length
                ) * 100
                : 0;


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "rating-breakdown-row";


        const label =
            document.createElement(
                "span"
            );


        label.textContent =
            `${rating} ★`;


        const bar =
            document.createElement(
                "div"
            );


        bar.className =
            "rating-breakdown-bar";


        const fill =
            document.createElement(
                "div"
            );


        fill.className =
            "rating-breakdown-fill";


        fill.style.width =
            `${percentage}%`;


        const countElement =
            document.createElement(
                "span"
            );


        countElement.textContent =
            count;


        bar.appendChild(
            fill
        );


        row.appendChild(
            label
        );

        row.appendChild(
            bar
        );

        row.appendChild(
            countElement
        );


        reviewsRatingBreakdown.appendChild(
            row
        );

    }

}


/* ==========================================================
   REVIEW LOGIN STATE
========================================================== */

function updateReviewInterface() {

    if (!reviewFormSection) {
        return;
    }


    if (currentUser) {

        showElement(
            reviewFormSection
        );

        hideElement(
            reviewLoginMessage
        );

    }

    else {

        hideElement(
            reviewFormSection
        );

        showElement(
            reviewLoginMessage
        );

    }

}


/* ==========================================================
   SELECT RATING
========================================================== */

function selectRating(rating) {

    selectedRating =
        Number(rating) || 0;


    if (!reviewRatingInput) {
        return;
    }


    reviewRatingInput
        .querySelectorAll(
            "button"
        )
        .forEach(
            button => {

                const value =
                    Number(
                        button.dataset.rating
                    );


                button.classList.toggle(
                    "active",
                    value <= selectedRating
                );

            }
        );

}


/* ==========================================================
   SUBMIT REVIEW
========================================================== */

async function submitReview(event) {

    event.preventDefault();


    if (!currentUser) {

        alert(
            "Please login to write a review."
        );

        return;

    }


    if (!selectedRating) {

        alert(
            "Please select a rating."
        );

        return;

    }


    const comment =
        reviewComment?.value.trim() ||
        "";


    if (!comment) {

        alert(
            "Please write a review."
        );

        return;

    }


    try {

        /*
         * Check if this buyer already reviewed.
         */

        const reviewsRef =
            collection(
                db,
                "productReviews"
            );


        const existingQuery =
            query(

                reviewsRef,

                where(
                    "productId",
                    "==",
                    currentProductId
                ),

                where(
                    "buyerId",
                    "==",
                    currentUser.uid
                ),

                limit(1)

            );


        const existingSnapshot =
            await getDocs(
                existingQuery
            );


        if (
            !existingSnapshot.empty
        ) {

            alert(
                "You have already reviewed this product."
            );

            return;

        }


        await addDoc(
            reviewsRef,
            {

                productId:
                    currentProductId,

                buyerId:
                    currentUser.uid,

                buyerName:
                    currentUser.displayName ||
                    currentUser.email ||
                    "Buyer",

                rating:
                    selectedRating,

                comment:
                    comment,

                createdAt:
                    serverTimestamp()

            }
        );


        reviewComment.value =
            "";


        selectRating(0);


        alert(
            "Your review has been submitted."
        );


        await loadProductReviews();

    }

    catch (error) {

        console.error(
            "SUBMIT REVIEW ERROR:",
            error
        );


        alert(
            "Unable to submit your review. Please try again."
        );

    }

}


/* ==========================================================
   CHAT
========================================================== */

function openChat() {

    if (!currentUser) {

        alert(
            "Please login to chat with the seller."
        );

        return;

    }


    const sellerId =
        getProductSellerId(
            currentProduct
        );


    if (!sellerId) {

        alert(
            "Seller information is unavailable."
        );

        return;

    }


    showElement(
        chatModal
    );


    if (productChatInput) {

        productChatInput.focus();

    }

}


/* ==========================================================
   CLOSE CHAT
========================================================== */

function closeChat() {

    hideElement(
        chatModal
    );

}


/* ==========================================================
   SEND CHAT MESSAGE
========================================================== */

async function sendChatMessage() {

    if (!currentUser) {

        alert(
            "Please login to chat."
        );

        return;

    }


    const message =
        productChatInput?.value.trim() ||
        "";


    if (!message) {
        return;
    }


    const sellerId =
        getProductSellerId(
            currentProduct
        );


    if (!sellerId) {

        alert(
            "Seller information is unavailable."
        );

        return;

    }


    try {

        /*
         * For now each product chat is stored
         * as a chat document.
         */

        const chatsRef =
            collection(
                db,
                "chats"
            );


        const chatSnapshot =
            await addDoc(
                chatsRef,
                {

                    buyerId:
                        currentUser.uid,

                    sellerId:
                        sellerId,

                    productId:
                        currentProductId,

                    productName:
                        getProductName(
                            currentProduct
                        ),

                    lastMessage:
                        message,

                    lastMessageAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()

                }
            );


        currentChatId =
            chatSnapshot.id;


        const messagesRef =
            collection(
                db,
                "chats",
                currentChatId,
                "messages"
            );


        await addDoc(
            messagesRef,
            {

                senderId:
                    currentUser.uid,

                senderName:
                    currentUser.displayName ||
                    currentUser.email ||
                    "Buyer",

                text:
                    message,

                createdAt:
                    serverTimestamp()

            }
        );


        if (productChatInput) {

            productChatInput.value =
                "";

        }


        displayChatMessage(
            message,
            true
        );

    }

    catch (error) {

        console.error(
            "CHAT ERROR:",
            error
        );


        alert(
            "Unable to send your message."
        );

    }

}


/* ==========================================================
   DISPLAY CHAT MESSAGE
========================================================== */

function displayChatMessage(
    message,
    sent
) {

    if (!productChatMessages) {
        return;
    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        sent
            ? "chat-message sent"
            : "chat-message received";


    messageElement.textContent =
        message;


    productChatMessages.appendChild(
        messageElement
    );


    productChatMessages.scrollTop =
        productChatMessages.scrollHeight;

}


/* ==========================================================
   REPORT PRODUCT
========================================================== */

function reportProduct() {

    if (!currentProductId) {
        return;
    }


    const confirmed =
        confirm(
            "Do you want to report this product to NeoStore?"
        );


    if (!confirmed) {
        return;
    }


    /*
     * This currently opens the support/contact page.
     * It does not automatically create an admin report.
     */

    window.location.href =
        `contact.html?subject=${encodeURIComponent(
            "Product Report"
        )}&productId=${encodeURIComponent(
            currentProductId
        )}`;

}


/* ==========================================================
   IMAGE LIGHTBOX
========================================================== */

function openLightbox() {

    if (!mainProductImage) {
        return;
    }


    if (lightboxImage) {

        lightboxImage.src =
            mainProductImage.src;

        lightboxImage.alt =
            mainProductImage.alt;

    }


    showElement(
        imageLightbox
    );

}


function closeImageLightbox() {

    hideElement(
        imageLightbox
    );

}


/* ==========================================================
   HEADER SEARCH
========================================================== */

function handleHeaderSearch(event) {

    event.preventDefault();


    const search =
        headerSearch?.value.trim() ||
        "";


    if (!search) {

        window.location.href =
            "category.html";

        return;

    }


    window.location.href =
        `category.html?search=${encodeURIComponent(
            search
        )}`;

}


/* ==========================================================
   ACCOUNT LINK
========================================================== */

function updateAccountLink(user) {

    if (!accountLink) {
        return;
    }


    if (user) {

        accountLink.textContent =
            "Account";

        accountLink.href =
            "buyer-dashboard.html";

    }

    else {

        accountLink.textContent =
            "Login";

        accountLink.href =
            "login.html";

    }

}


/* ==========================================================
   AUTHENTICATION
========================================================== */

function initializeAuthentication() {

    onAuthStateChanged(
        auth,
        user => {

            currentUser =
                user || null;

            updateAccountLink(
                currentUser
            );

            updateReviewInterface();

        }
    );

}


/* ==========================================================
   EVENT LISTENERS
========================================================== */

function initializeEventListeners() {

    galleryPrevious?.addEventListener(
        "click",
        previousGalleryImage
    );


    galleryNext?.addEventListener(
        "click",
        nextGalleryImage
    );


    mainProductImage?.addEventListener(
        "click",
        openLightbox
    );


    closeLightbox?.addEventListener(
        "click",
        closeImageLightbox
    );


    imageLightbox?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                imageLightbox
            ) {

                closeImageLightbox();

            }

        }
    );
    

chatSellerButton?.addEventListener(
    "click",
    openWhatsApp
);
    
    
   /* ==========================================================
   OPEN WHATSAPP WITH PRODUCT PAGE LINK
========================================================== */

async function openWhatsApp(event) {

    event.preventDefault();

    if (!currentProduct) {
        alert("Product information is not available.");
        return;
    }

    try {

        /* ==================================================
           PRODUCT DETAILS
        ================================================== */

        const productName =
            getProductName(currentProduct) ||
            "this product";

        const rawPrice =
    getProductPrice(currentProduct);

const price =
    rawPrice
        ? `$${rawPrice}`
        : "Price unavailable";


        /* ==================================================
           PRODUCT ID
        ================================================== */

        const productId =
            currentProduct.id ||
            currentProduct.productId ||
            currentProductId;


        if (!productId) {

            alert(
                "Product link could not be created."
            );

            return;
        }


        /* ==================================================
           CREATE PRODUCT PAGE LINK
        ================================================== */

        const productURL =
            window.location.origin +
            "/product.html?id=" +
            encodeURIComponent(productId);


        /* ==================================================
           GET SELLER
        ================================================== */

        const sellerId =
            currentProduct.sellerId ||
            currentProduct.userId ||
            currentProduct.uid;


        if (!sellerId) {

            alert(
                "Seller information is not available."
            );

            return;
        }


        const sellerRef =
            doc(
                db,
                "users",
                sellerId
            );


        const sellerSnapshot =
            await getDoc(sellerRef);


        if (!sellerSnapshot.exists()) {

            alert(
                "Seller account could not be found."
            );

            return;
        }


        const seller =
            sellerSnapshot.data();


        /* ==================================================
           SELLER WHATSAPP NUMBER
        ================================================== */

        const sellerPhone =
            seller.whatsapp ||
            seller.whatsappNumber ||
            seller.whatsappPhone ||
            seller.phone1 ||
            seller.phone ||
            seller.phoneNumber;


        if (!sellerPhone) {

            console.log(
                "SELLER DATA:",
                seller
            );

            alert(
                "Seller WhatsApp number is not available."
            );

            return;
        }


        /* ==================================================
           FORMAT PHONE
        ================================================== */

        let phone =
            String(sellerPhone)
                .replace(/[^\d]/g, "");


        /* Nigeria */

        if (
            phone.startsWith("0") &&
            phone.length === 11
        ) {

            phone =
                "234" +
                phone.substring(1);

        }


        /* ==================================================
           WHATSAPP MESSAGE
        ================================================== */

        const message =
`Hello, I am interested in this product.

Product: ${productName}
Price: ${price}

Is this product still available?

View product:
${productURL}

Please confirm availability. Thank you.`;


        /* ==================================================
           WHATSAPP URL
        ================================================== */

        const whatsappURL =
            "https://wa.me/" +
            phone +
            "?text=" +
            encodeURIComponent(message);


        window.location.href =
            whatsappURL;


    } catch (error) {

        console.error(
            "WHATSAPP ERROR:",
            error
        );

        alert(
            "Unable to open WhatsApp. Please try again."
        );
    }
}
}



/* ==========================================================
   INITIALIZE
========================================================== */

async function initializeProductPage() {

    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


    currentProductId =
        getProductId();


    initializeEventListeners();

    initializeAuthentication();


    await loadSelectedProduct();

}

/* ==========================================================
   START
========================================================== */

initializeProductPage();

