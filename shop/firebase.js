/* ==========================================================
   FIREBASE CONFIGURATION
========================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* ==========================================================
   FIREBASE CONFIG
========================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyAC3qCkDfdS2X8YA6deg01lXif7qAStfQQ",

    authDomain:
        "neostore-81b57.firebaseapp.com",

    projectId:
        "neostore-81b57",

    storageBucket:
        "neostore-81b57.firebasestorage.app",

    messagingSenderId:
        "760637387702",

    appId:
        "1:760637387702:web:3c7c231c34a3513d1a4717"

};


/* ==========================================================
   INITIALIZE FIREBASE
========================================================== */

const app =
    initializeApp(
        firebaseConfig
    );


/* ==========================================================
   FIREBASE SERVICES
========================================================== */

const auth =
    getAuth(
        app
    );

const db =
    getFirestore(
        app
    );


/* ==========================================================
   CLOUDINARY CONFIGURATION
========================================================== */

const CLOUDINARY_CLOUD_NAME =
    "diqrjgobk";

const CLOUDINARY_UPLOAD_PRESET =
    "starcode";


/* ==========================================================
   CLOUDINARY UPLOAD URL
========================================================== */

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


/* ==========================================================
   UPLOAD IMAGE TO CLOUDINARY
========================================================== */

async function uploadToCloudinary(
    file
){

    if(!file){

        throw new Error(
            "No image file was selected."
        );

    }


    /*
       Make sure this is actually
       an image.
    */

    if(
        !file.type ||
        !file.type.startsWith(
            "image/"
        )
    ){

        throw new Error(
            "Please select a valid image."
        );

    }


    /*
       Optional file-size protection.

       10 MB maximum.
    */

    const maxSize =
        10 * 1024 * 1024;


    if(
        file.size >
        maxSize
    ){

        throw new Error(
            "Image is too large. Maximum size is 10MB."
        );

    }


    /* ======================================================
       CREATE CLOUDINARY FORM DATA
    ====================================================== */

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );


    /* ======================================================
       UPLOAD
    ====================================================== */

    const response =
        await fetch(
            CLOUDINARY_UPLOAD_URL,
            {

                method:
                    "POST",

                body:
                    formData

            }
        );


    /* ======================================================
       READ CLOUDINARY RESPONSE
    ====================================================== */

    const result =
        await response.json();


    console.log(
        "Cloudinary response:",
        result
    );


    /* ======================================================
       HANDLE CLOUDINARY ERROR
    ====================================================== */

    if(
        !response.ok
    ){

        console.error(
            "Cloudinary upload failed:",
            result
        );


        throw new Error(

            result?.error?.message ||

            "Cloudinary image upload failed."

        );

    }


    /* ======================================================
       GET SECURE IMAGE URL
    ====================================================== */

    const imageURL =
        result?.secure_url;


    if(
        !imageURL
    ){

        console.error(
            "Cloudinary returned no secure_url:",
            result
        );


        throw new Error(
            "Cloudinary did not return an image URL."
        );

    }


    /* ======================================================
       RETURN IMAGE URL
    ====================================================== */

    return imageURL;

}


/* ==========================================================
   EXPORT
========================================================== */

export {

    app,

    auth,

    db,

    CLOUDINARY_CLOUD_NAME,

    CLOUDINARY_UPLOAD_PRESET,

    CLOUDINARY_UPLOAD_URL,

    uploadToCloudinary

};



