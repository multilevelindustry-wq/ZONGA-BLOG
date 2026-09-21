/* ==========================================================
   BUYER DASHBOARD
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
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const buyerNameElement =
    document.getElementById("buyerName");

const buyerEmailElement =
    document.getElementById("buyerEmail");

const logoutButton =
    document.getElementById("logoutButton");


/* ==========================================================
   LOAD BUYER PROFILE
========================================================== */

async function loadBuyerProfile(user) {

    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );

        const snapshot =
            await getDoc(userRef);

        let data = {};

        if (snapshot.exists()) {

            data =
                snapshot.data();

        }


        let name =
            data.name ||
            data.fullName ||
            data.displayName ||
            user.displayName;


        if (!name && user.email) {

            name =
                user.email
                    .split("@")[0];

        }


        buyerNameElement.textContent =
            name || "Buyer";

        buyerEmailElement.textContent =
            user.email || "";

    }

    catch (error) {

        console.error(
            "Error loading buyer profile:",
            error
        );

        buyerNameElement.textContent =
            user.displayName ||
            "Buyer";

        buyerEmailElement.textContent =
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
    AUTHENTICATION + BUYER ROLE PROTECTION
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


        /* ======================================================
           LOAD USER ROLE
        ====================================================== */

        try {

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


            /* USER DOCUMENT DOES NOT EXIST */

            if (!snapshot.exists()) {

                window.location.href =
                    "login.html";

                return;

            }


            const userData =
                snapshot.data();


            const role =
                String(
                    userData.role || ""
                )
                .trim()
                .toLowerCase();


            /* ==================================================
               SELLER TRYING TO ENTER BUYER PAGE
            ================================================== */

            if (role === "seller") {

                window.location.replace(
                    "seller-dashboard.html"
                );

                return;

            }


            /* ==================================================
               ONLY BUYERS ARE ALLOWED
            ================================================== */

            if (role !== "buyer") {

                window.location.replace(
                    "login.html"
                );

                return;

            }


            /* ==================================================
               LOAD BUYER PROFILE
            ================================================== */

            await loadBuyerProfile(
                user
            );


        } catch (error) {

            console.error(
                "BUYER AUTH / ROLE ERROR:",
                error
            );


            window.location.replace(
                "login.html"
            );

        }

    }
);


/* ==========================================================
   LOGOUT EVENT
========================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        handleLogout
    );

}
