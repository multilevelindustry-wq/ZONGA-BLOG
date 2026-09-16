/* =========================================================
   HEALTHWISE HOME PAGE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   PAGE LOADER
========================================================= */

document.addEventListener("DOMContentLoaded", function(){

    const pageLoader =
        document.getElementById("pageLoader");

    if(pageLoader){

        setTimeout(function(){

            pageLoader.classList.add("hidden");

        }, 700);

    }

});



/* =========================================================
   MOBILE MENU
========================================================= */

document.addEventListener("DOMContentLoaded", function(){

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileNavigation =
        document.getElementById("mobileNavigation");


    if(
        !mobileMenuButton ||
        !mobileNavigation
    ){
        return;
    }


    mobileMenuButton.addEventListener(
        "click",
        function(){

            const isOpen =
                mobileNavigation.classList.contains("open");


            if(isOpen){

                mobileNavigation.classList.remove("open");

                mobileMenuButton.classList.remove("active");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }else{

                mobileNavigation.classList.add("open");

                mobileMenuButton.classList.add("active");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Close menu"
                );

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU AFTER CLICKING A LINK
    ===================================================== */

    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach(function(link){

        link.addEventListener(
            "click",
            function(){

                mobileNavigation.classList.remove("open");

                mobileMenuButton.classList.remove("active");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }
        );

    });

});



/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event){

        const mobileMenuButton =
            document.getElementById("mobileMenuButton");

        const mobileNavigation =
            document.getElementById("mobileNavigation");


        if(
            !mobileMenuButton ||
            !mobileNavigation
        ){
            return;
        }


        const clickedInsideMenu =
            mobileNavigation.contains(event.target);

        const clickedButton =
            mobileMenuButton.contains(event.target);


        if(
            !clickedInsideMenu &&
            !clickedButton
        ){

            mobileNavigation.classList.remove("open");

            mobileMenuButton.classList.remove("active");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Open menu"
            );

        }

    }
);



/* =========================================================
   HEADER SHADOW WHEN SCROLLING
========================================================= */

window.addEventListener(
    "scroll",
    function(){

        const header =
            document.getElementById("mainHeader");


        if(!header){
            return;
        }


        if(window.scrollY > 10){

            header.classList.add(
                "header-scrolled"
            );

        }else{

            header.classList.remove(
                "header-scrolled"
            );

        }

    },
    {
        passive:true
    }
);



/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document.addEventListener(
    "click",
    function(event){

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if(!link){
            return;
        }


        const targetId =
            link.getAttribute("href");


        if(
            !targetId ||
            targetId === "#"
        ){
            return;
        }


        const target =
            document.querySelector(targetId);


        if(!target){
            return;
        }


        event.preventDefault();


        target.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    }
);



/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const images =
            document.querySelectorAll("img");


        images.forEach(function(image){

            image.addEventListener(
                "error",
                function(){

                    image.classList.add(
                        "image-load-error"
                    );

                }
            );

        });

    }
);



/* =========================================================
   CURRENT YEAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const footerYearElements =
            document.querySelectorAll(
                ".footer-bottom p"
            );


        footerYearElements.forEach(
            function(element){

                element.innerHTML =
                    element.innerHTML.replace(
                        /2026/g,
                        new Date().getFullYear()
                    );

            }
        );

    }
);

