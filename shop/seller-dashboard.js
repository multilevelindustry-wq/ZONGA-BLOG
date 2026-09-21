/* ==========================================================
   SELLER DASHBOARD
========================================================== */

import {
    auth,
    db
} from "./firebase.js";
import "./currency.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const sellerNameElement =
    document.getElementById("sellerName");

const sellerEmailElement =
    document.getElementById("sellerEmail");

const productCountElement =
    document.getElementById("productCount");

const totalViewsElement =
    document.getElementById("totalViews");

const activeProductsElement =
    document.getElementById("activeProducts");

const productsContainer =
    document.getElementById("productsContainer");

const logoutButton =
    document.getElementById("logoutButton");


/* ==========================================================
   SELLER AUTHENTICATION + ROLE PROTECTION
========================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        /* ======================================================
           NOT LOGGED IN
        ====================================================== */

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        /* ======================================================
           EMAIL VERIFICATION
        ====================================================== */

        if (!user.emailVerified) {

            window.location.href =
                "verify-email.html";

            return;

        }


        try {

            /* ==================================================
               LOAD USER DOCUMENT
            ================================================== */

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const snapshot =
                await getDoc(
                    userRef
                );


            /* ==================================================
               USER DOCUMENT DOES NOT EXIST
            ================================================== */

            if (!snapshot.exists()) {

                window.location.href =
                    "login.html";

                return;

            }


            const userData =
                snapshot.data();


            /* ==================================================
               GET USER ROLE
            ================================================== */

            const role =
                String(
                    userData.role || ""
                )
                .trim()
                .toLowerCase();


            /* ==================================================
               BUYER TRYING TO ENTER SELLER PAGE
            ================================================== */

            if (role === "buyer") {

                window.location.replace(
                    "buyer-dashboard.html"
                );

                return;

            }


            /* ==================================================
               ONLY SELLERS ARE ALLOWED
            ================================================== */

            if (role !== "seller") {

                window.location.replace(
                    "login.html"
                );

                return;

            }


            /* ==================================================
               LOAD SELLER PROFILE
            ================================================== */

            await loadSellerProfile(
                user
            );


            /* ==================================================
               LOAD SELLER PRODUCTS
            ================================================== */

            await loadSellerProducts(
                user.uid
            );


        }

        catch (error) {

            console.error(
                "SELLER DASHBOARD ERROR:",
                error
            );

        }

    }
);


/* ==========================================================
   VIEW MY SELLER STORE
========================================================== */

const viewMyStoreButton =
    document.getElementById(
        "viewMyStoreButton"
    );


viewMyStoreButton?.addEventListener(
    "click",
    () => {

        const user =
            auth.currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        window.location.href =
            `seller-store.html?sellerId=${encodeURIComponent(user.uid)}`;

    }
);



/* ==========================================================
   FORMAT MONEY
========================================================== */

function formatMoney(value) {

    const amount = Number(value) || 0;

    return "₦" + amount.toLocaleString("en-NG");

}


/* ==========================================================
   ESCAPE HTML
========================================================== */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent =
        value === undefined ||
        value === null
            ? ""
            : String(value);

    return div.innerHTML;

}


/* ==========================================================
   GET SELLER NAME
========================================================== */

function getSellerDisplayName(user, sellerData) {

    if (sellerData?.name) {
        return sellerData.name;
    }

    if (sellerData?.fullName) {
        return sellerData.fullName;
    }

    if (sellerData?.displayName) {
        return sellerData.displayName;
    }

    if (user.displayName) {
        return user.displayName;
    }

    if (user.email) {

        return user.email
            .split("@")[0];

    }

    return "Seller";

}


/* ==========================================================
   LOAD SELLER PRODUCTS
========================================================== */

async function loadSellerProducts(uid) {

    productsContainer.innerHTML = `
        <div class="loading-message">
            Loading your products...
        </div>
    `;

    try {

        const productsQuery = query(
            collection(db, "products"),
            where("sellerId", "==", uid)
        );

        const snapshot =
            await getDocs(productsQuery);

        const products = [];

        let totalViews = 0;
        let activeProducts = 0;

        snapshot.forEach((productDoc) => {

            const data =
                productDoc.data();

            products.push({
                id: productDoc.id,
                ...data
            });

            totalViews +=
                Number(data.views) || 0;

            if (data.status === "active") {
                activeProducts++;
            }

        });


        /* ==========================================
           STATISTICS
        ========================================== */

        productCountElement.textContent =
            products.length.toLocaleString();

        totalViewsElement.textContent =
            totalViews.toLocaleString();

        activeProductsElement.textContent =
            activeProducts.toLocaleString();


        /* ==========================================
           EMPTY STATE
        ========================================== */

        if (products.length === 0) {

            productsContainer.innerHTML = `
                <div class="empty-message">
                    <p>
                        You have not uploaded any products yet.
                    </p>
                </div>
            `;

            return;
        }


        /* ==========================================
           DISPLAY PRODUCTS
        ========================================== */

        productsContainer.innerHTML =
            products.map(createProductCard).join("");

    }

    catch (error) {

        console.error(
            "Error loading seller products:",
            error
        );

        productsContainer.innerHTML = `
            <div class="empty-message">
                Unable to load your products.
                Please try again.
            </div>
        `;

    }

}


/* ==========================================================
   CREATE PRODUCT CARD
========================================================== */

function createProductCard(product) {

    const image =
        product.mainImage ||
        product.image ||
        "";

    const name =
        product.productName ||
        "Unnamed Product";

    const price =
        product.price || 0;

    const views =
        Number(product.views) || 0;

    const status =
        product.status || "inactive";

    const statusClass =
        status === "active"
            ? ""
            : "inactive";

    return `

        <article class="product-card">

            <div class="product-image">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                            >
                          `
                        : `
                            <div
                                style="
                                    width:100%;
                                    height:100%;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    color:#9ca3af;
                                    font-size:13px;
                                "
                            >
                                No Image
                            </div>
                          `
                }

            </div>


            <div class="product-info">

                <h3 class="product-name">
                    ${escapeHTML(name)}
                </h3>

                <div class="product-price">
                    ${formatMoney(price)}
                </div>


                <div class="product-meta">

                    <span>
                        👁 ${views.toLocaleString()}
                    </span>

                    <span
                        class="product-status ${statusClass}"
                    >
                        ${escapeHTML(status)}
                    </span>

                </div>

            </div>

        </article>

    `;

}


/* ==========================================================
   LOAD SELLER PROFILE
========================================================== */

async function loadSellerProfile(user) {

    try {

        const sellerDocument =
            await import(
                "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"
            );

        const sellerRef =
            sellerDocument.doc(
                db,
                "users",
                user.uid
            );

        const sellerSnapshot =
            await sellerDocument.getDoc(
                sellerRef
            );

        let sellerData = {};

        if (sellerSnapshot.exists()) {

            sellerData =
                sellerSnapshot.data();

        }

        const name =
            getSellerDisplayName(
                user,
                sellerData
            );

        sellerNameElement.textContent =
            name;

        sellerEmailElement.textContent =
            user.email || "";

    }

    catch (error) {

        console.error(
            "Unable to load seller profile:",
            error
        );

        sellerNameElement.textContent =
            user.displayName ||
            "Seller";

        sellerEmailElement.textContent =
            user.email || "";

    }

}


/* ==========================================================
   LOGOUT
========================================================== */

async function handleLogout() {

    try {

        logoutButton.disabled = true;

        logoutButton.textContent =
            "Logging out...";

        await signOut(auth);

        window.location.href =
            "index.html";

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

        logoutButton.disabled = false;

        logoutButton.textContent =
            "Logout";

        alert(
            "Unable to logout. Please try again."
        );

    }

}


/* ==========================================================
   LOGOUT EVENT
========================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        handleLogout
    );

}


