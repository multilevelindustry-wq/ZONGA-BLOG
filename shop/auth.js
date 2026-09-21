/* ==========================================================
   AUTHENTICATION SYSTEM
========================================================== */

import {
    auth,
    db
} from "./firebase.js";


import {
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
    reload,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* ==========================================================
   GLOBAL AUTH STATE
========================================================== */

let currentUser = null;

let currentUserRole = null;

let authInitialized = false;

let authResolve;


const authReady =
    new Promise((resolve) => {

        authResolve = resolve;

    });


/* ==========================================================
   FIREBASE AUTH STATE LISTENER
========================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser =
            user || null;

        currentUserRole =
            null;


        if (user) {

            try {

                currentUserRole =
                    await getUserRole(
                        user.uid
                    );

            } catch (error) {

                console.error(
                    "Unable to load user role:",
                    error
                );

            }

        }


        authInitialized =
            true;


        authResolve(
            currentUser
        );


        window.dispatchEvent(
            new CustomEvent(
                "authStateReady",
                {
                    detail: {

                        user:
                            currentUser,

                        role:
                            currentUserRole

                    }
                }
            )
        );

    }
);


/* ==========================================================
   WAIT FOR AUTH
========================================================== */

async function waitForAuth() {

    if (authInitialized) {

        return currentUser;

    }


    return await authReady;

}


/* ==========================================================
   GET CURRENT USER
========================================================== */

function getCurrentUser() {

    return currentUser;

}


/* ==========================================================
   GET CURRENT USER ROLE
========================================================== */

function getCurrentUserRole() {

    return currentUserRole;

}


/* ==========================================================
   CHECK LOGIN
========================================================== */

async function isUserLoggedIn() {

    const user =
        await waitForAuth();

    return !!user;

}


/* ==========================================================
   CHECK EMAIL VERIFICATION
========================================================== */

async function isEmailVerified() {

    const user =
        await waitForAuth();


    if (!user) {

        return false;

    }


    return user.emailVerified === true;

}


/* ==========================================================
   REFRESH VERIFICATION STATUS
========================================================== */

async function refreshVerificationStatus() {

    const user =
        await waitForAuth();


    if (!user) {

        return false;

    }


    try {

        await reload(user);

        currentUser =
            auth.currentUser;


        return !!(
            currentUser &&
            currentUser.emailVerified
        );

    } catch (error) {

        console.error(
            "Unable to refresh verification status:",
            error
        );

        return false;

    }

}


/* ==========================================================
   SEND EMAIL VERIFICATION
========================================================== */

async function sendVerificationEmail() {

    const user =
        await waitForAuth();


    if (!user) {

        throw new Error(
            "You must be logged in to verify your email."
        );

    }


    if (user.emailVerified) {

        return true;

    }


    await sendEmailVerification(
        user
    );


    return true;

}


/* ==========================================================
   REQUIRE EMAIL VERIFICATION
========================================================== */

async function requireEmailVerification(
    redirectPage = "verify-email.html"
) {

    const user =
        await waitForAuth();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    if (!user.emailVerified) {

        window.location.href =
            redirectPage;

        return null;

    }


    return user;

}


/* ==========================================================
   REQUIRE LOGIN
========================================================== */

async function requireLogin(
    redirectPage = "login.html"
) {

    const user =
        await waitForAuth();


    if (!user) {

        window.location.href =
            redirectPage;

        return null;

    }


    return user;

}


/* ==========================================================
   REQUIRE VERIFIED LOGIN
========================================================== */

async function requireVerifiedLogin(
    redirectPage = "verify-email.html"
) {

    return await requireEmailVerification(
        redirectPage
    );

}


/* ==========================================================
   GET USER ROLE
========================================================== */

async function getUserRole(uid) {

    if (!uid) {

        return null;

    }


    const userRef =
        doc(
            db,
            "users",
            uid
        );


    const userSnapshot =
        await getDoc(
            userRef
        );


    if (!userSnapshot.exists()) {

        return null;

    }


    const userData =
        userSnapshot.data();


    return userData.role || null;

}


/* ==========================================================
   CREATE USER PROFILE
========================================================== */

async function createUserProfile(
    user,
    role,
    additionalData = {}
) {

    if (!user) {

        throw new Error(
            "A valid authenticated user is required."
        );

    }


    if (
        role !== "buyer" &&
        role !== "seller"
    ) {

        throw new Error(
            "Invalid account role."
        );

    }


    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const userData = {

        uid:
            user.uid,

        email:
            user.email || "",

        role:
            role,

        emailVerified:
            user.emailVerified === true,

        createdAt:
            serverTimestamp(),

        updatedAt:
            serverTimestamp(),

        ...additionalData

    };


    await setDoc(
        userRef,
        userData,
        {
            merge: true
        }
    );


    currentUserRole =
        role;


    return userData;

}


/* ==========================================================
   CREATE ACCOUNT
========================================================== */

async function registerUser(
    email,
    password,
    name,
    role
) {

    if (
        role !== "buyer" &&
        role !== "seller"
    ) {

        throw new Error(
            "Invalid account role."
        );

    }


    const credential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


    const user =
        credential.user;


    await createUserProfile(
        user,
        role,
        {
            name:
                name.trim()
        }
    );


    await sendEmailVerification(
        user
    );


    return user;

}


/* ==========================================================
   LOGIN
========================================================== */

async function loginUser(
    email,
    password
) {

    const credential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


    return credential.user;

}


/* ==========================================================
   REQUIRE BUYER
========================================================== */

async function requireBuyerLogin() {

    const user =
        await requireVerifiedLogin();


    if (!user) {

        return null;

    }


    const role =
        await getUserRole(
            user.uid
        );


    if (role !== "buyer") {

        throw new Error(
            "This action is available to buyers only."
        );

    }


    currentUserRole =
        role;


    return user;

}


/* ==========================================================
   REQUIRE SELLER
========================================================== */

async function requireSellerLogin() {

    const user =
        await requireVerifiedLogin();


    if (!user) {

        return null;

    }


    const role =
        await getUserRole(
            user.uid
        );


    if (role !== "seller") {

        throw new Error(
            "This action is available to sellers only."
        );

    }


    currentUserRole =
        role;


    return user;

}


/* ==========================================================
   CHECK SELLER
========================================================== */

async function isSeller() {

    const user =
        await waitForAuth();


    if (!user) {

        return false;

    }


    const role =
        await getUserRole(
            user.uid
        );


    return role === "seller";

}


/* ==========================================================
   CHECK BUYER
========================================================== */

async function isBuyer() {

    const user =
        await waitForAuth();


    if (!user) {

        return false;

    }


    const role =
        await getUserRole(
            user.uid
        );


    return role === "buyer";

}


/* ==========================================================
   LOGOUT
========================================================== */

async function logoutUser(
    redirectPage = "login.html"
) {

    await signOut(
        auth
    );


    currentUser =
        null;

    currentUserRole =
        null;


    window.location.href =
        redirectPage;

}


/* ==========================================================
   AUTH ERROR MESSAGE
========================================================== */

function getAuthErrorMessage(error) {

    if (!error) {

        return "An unknown authentication error occurred.";

    }


    switch (error.code) {

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-not-found":
            return "No account was found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/invalid-credential":
            return "The email or password is incorrect.";

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        default:
            return (
                error.message ||
                "Authentication failed."
            );

    }

}


/* ==========================================================
   AUTH STATE HELPER
========================================================== */

function onUserChanged(callback) {

    return onAuthStateChanged(
        auth,
        callback
    );

}


/* ==========================================================
   EXPORT
========================================================== */

export {

    auth,

    currentUser,

    currentUserRole,

    authReady,

    waitForAuth,

    getCurrentUser,

    getCurrentUserRole,

    isUserLoggedIn,

    isEmailVerified,

    refreshVerificationStatus,

    sendVerificationEmail,

    requireEmailVerification,

    requireLogin,

    requireVerifiedLogin,

    requireBuyerLogin,

    requireSellerLogin,

    getUserRole,

    createUserProfile,

    registerUser,

    loginUser,

    isBuyer,

    isSeller,

    logoutUser,

    getAuthErrorMessage,

    onUserChanged

};

