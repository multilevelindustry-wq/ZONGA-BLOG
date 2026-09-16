"use strict";


/* =========================================================
   SUPPLEMENT BLOG DATABASE
========================================================= */

const supplementPosts = [

    {
        title:
            "Understanding Vitamin C",

        description:
            "Learn about vitamin C, its role in normal body functions, dietary sources and what to consider when choosing a supplement.",

        image:
            "https://images.unsplash.com/photo-1616671276441-2f6c7e3f5f3a?auto=format&fit=crop&w=900&q=85",

        alt:
            "Vitamin C supplement capsules and citrus fruits",

        category:
            "Vitamins",

        readTime:
            "7 min read",

        url:
            "vitamin-c.html"
    },


    {
        title:
            "What Is Vitamin D and Why Is It Important?",

        description:
            "Explore the role of vitamin D in the body, common sources and important considerations when using vitamin D supplements.",

        image:
            "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=900&q=85",

        alt:
            "Vitamin D supplement bottle and healthy lifestyle setting",

        category:
            "Vitamins",

        readTime:
            "8 min read",

        url:
            "vitamin-d.html"
    },


    {
        title:
            "Understanding Multivitamins",

        description:
            "Learn what multivitamins are, why people use them and what to look for when reading a supplement label.",

        image:
            "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=85",

        alt:
            "Multivitamin capsules and supplement containers",

        category:
            "Supplements",

        readTime:
            "7 min read",

        url:
            "multivitamins.html"
    },


    {
        title:
            "What Are Minerals and Why Does the Body Need Them?",

        description:
            "Explore essential minerals, their roles in normal body functions and common food sources.",

        image:
            "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=85",

        alt:
            "Nutritional supplements representing essential minerals",

        category:
            "Minerals",

        readTime:
            "7 min read",

        url:
            "minerals.html"
    },


    {
        title:
            "Understanding Calcium",

        description:
            "Learn about calcium, dietary sources and its role in normal bones, teeth and other body functions.",

        image:
            "https://images.unsplash.com/photo-1559757175-7cb057fba93d?auto=format&fit=crop&w=900&q=85",

        alt:
            "Calcium supplement and nutritious foods",

        category:
            "Minerals",

        readTime:
            "6 min read",

        url:
            "calcium.html"
    },


    {
        title:
            "Understanding Iron",

        description:
            "Explore iron, its role in normal body functions, food sources and why supplementation should be approached carefully.",

        image:
            "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=900&q=85",

        alt:
            "Iron supplement capsules and nutritional foods",

        category:
            "Minerals",

        readTime:
            "7 min read",

        url:
            "iron.html"
    },


    {
        title:
            "What Is Omega-3?",

        description:
            "Learn about omega-3 fatty acids, dietary sources and the different types commonly discussed in nutrition.",

        image:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85",

        alt:
            "Fish representing a natural source of omega-3 fatty acids",

        category:
            "Nutrition",

        readTime:
            "7 min read",

        url:
            "omega-3.html"
    },


    {
        title:
            "Understanding Probiotics",

        description:
            "Explore probiotics, fermented foods and the basic concepts behind products containing live microorganisms.",

        image:
            "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=900&q=85",

        alt:
            "Fermented food representing probiotic nutrition",

        category:
            "Nutrition",

        readTime:
            "8 min read",

        url:
            "probiotics.html"
    },


    {
        title:
            "What Should You Look for on a Supplement Label?",

        description:
            "Learn how to read serving sizes, ingredients, directions and other information commonly found on supplement labels.",

        image:
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85",

        alt:
            "Supplement containers and product labels",

        category:
            "Guides",

        readTime:
            "6 min read",

        url:
            "supplement-label.html"
    },


    {
        title:
            "When Should You Talk to a Healthcare Professional About Supplements?",

        description:
            "Understand situations where discussing supplement use with a qualified healthcare professional is especially important.",

        image:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthcare professional discussing health information with a patient",

        category:
            "Safety",

        readTime:
            "6 min read",

        url:
            "supplement-safety.html"
    },


    {
        title:
            "Food First: Can a Balanced Diet Provide Essential Nutrients?",

        description:
            "Explore the relationship between a balanced diet and nutritional supplements.",

        image:
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85",

        alt:
            "Balanced selection of nutritious foods",

        category:
            "Nutrition",

        readTime:
            "7 min read",

        url:
            "food-first.html"
    },


    {
        title:
            "Understanding Herbal Supplements",

        description:
            "Learn what herbal supplements are and why understanding ingredients, dosage and possible interactions is important.",

        image:
            "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=900&q=85",

        alt:
            "Fresh herbs representing herbal supplements",

        category:
            "Herbal",

        readTime:
            "8 min read",

        url:
            "herbal-supplements.html"
    },


    {
        title:
            "Can Supplements Replace Healthy Food?",

        description:
            "Understand why supplements and nutritious foods serve different purposes in a healthy eating pattern.",

        image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthy meal containing a variety of nutritious foods",

        category:
            "Nutrition",

        readTime:
            "6 min read",

        url:
            "supplements-and-food.html"
    },


    {
        title:
            "Understanding Supplement Dosage",

        description:
            "Learn why serving size, dosage instructions and individual circumstances matter when using nutritional supplements.",

        image:
            "https://images.unsplash.com/photo-1550572017-edd951aa8ca9?auto=format&fit=crop&w=900&q=85",

        alt:
            "Supplement capsules arranged beside a container",

        category:
            "Safety",

        readTime:
            "6 min read",

        url:
            "supplement-dosage.html"
    },


    {
        title:
            "How to Store Vitamins and Supplements Properly",

        description:
            "Explore practical storage considerations that can help protect supplement products from unsuitable conditions.",

        image:
            "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=85",

        alt:
            "Vitamin supplements stored in containers",

        category:
            "Supplement Care",

        readTime:
            "5 min read",

        url:
            "storing-supplements.html"
    }


    /* =====================================================
       ADD MORE SUPPLEMENT POSTS HERE

       You can add as many as required.
       Only 25 will appear on the page.

    ===================================================== */

];



/* =========================================================
   SHUFFLE POSTS
========================================================= */

function shuffleSupplementPosts(array){

    const shuffled = [...array];


    for(
        let i = shuffled.length - 1;
        i > 0;
        i--
    ){

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            shuffled[i],
            shuffled[randomIndex]
        ] = [
            shuffled[randomIndex],
            shuffled[i]
        ];

    }


    return shuffled;

}



/* =========================================================
   CREATE SUPPLEMENT CARD
========================================================= */

function createSupplementPostCard(post){

    return `

        <article class="blog-card">


            <a
                href="${post.url}"
                class="blog-card-image"
                aria-label="Read ${post.title}"
            >

                <img
                    src="${post.image}"
                    alt="${post.alt}"
                    loading="lazy"
                >


                <span class="blog-category">
                    ${post.category}
                </span>

            </a>



            <div class="blog-card-content">


                <div class="blog-meta">

                    <span>
                        HealthWise
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        ${post.readTime}
                    </span>

                </div>



                <h3>

                    <a href="${post.url}">
                        ${post.title}
                    </a>

                </h3>



                <p>
                    ${post.description}
                </p>



                <a
                    href="${post.url}"
                    class="read-article"
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
   DISPLAY SUPPLEMENT POSTS
========================================================= */

function displaySupplementPosts(){

    const container =
        document.getElementById(
            "supplementPosts"
        );


    if(!container){
        return;
    }


    const shuffledPosts =
        shuffleSupplementPosts(
            supplementPosts
        );


    /*
     * MAXIMUM 25 POSTS
     */

    const postsToShow =
        shuffledPosts.slice(
            0,
            25
        );


    container.innerHTML =
        postsToShow
            .map(
                createSupplementPostCard
            )
            .join("");

}



/* =========================================================
   MOBILE MENU
========================================================= */

function setupSupplementMenu(){

    const button =
        document.getElementById(
            "categoryMenuButton"
        );


    const menu =
        document.getElementById(
            "categoryMobileNav"
        );


    if(
        !button ||
        !menu
    ){
        return;
    }


    button.addEventListener(
        "click",
        function(){

            const isOpen =
                menu.classList.toggle(
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


            button.setAttribute(
                "aria-label",
                isOpen
                    ? "Close menu"
                    : "Open menu"
            );

        }
    );



    menu
        .querySelectorAll("a")
        .forEach(
            function(link){

                link.addEventListener(
                    "click",
                    function(){

                        menu.classList.remove(
                            "open"
                        );


                        button.classList.remove(
                            "active"
                        );


                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        button.setAttribute(
                            "aria-label",
                            "Open menu"
                        );

                    }
                );

            }
        );

}



/* =========================================================
   CLOSE MENU OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event){

        const button =
            document.getElementById(
                "categoryMenuButton"
            );


        const menu =
            document.getElementById(
                "categoryMobileNav"
            );


        if(
            !button ||
            !menu
        ){
            return;
        }


        if(
            !button.contains(event.target) &&
            !menu.contains(event.target)
        ){

            menu.classList.remove(
                "open"
            );


            button.classList.remove(
                "active"
            );


            button.setAttribute(
                "aria-expanded",
                "false"
            );


            button.setAttribute(
                "aria-label",
                "Open menu"
            );

        }

    }
);



/* =========================================================
   PAGE LOADER
========================================================= */

function hideSupplementLoader(){

    const loader =
        document.getElementById(
            "categoryLoader"
        );


    if(!loader){
        return;
    }


    setTimeout(
        function(){

            loader.classList.add(
                "hidden"
            );

        },
        500
    );

}



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        displaySupplementPosts();

        setupSupplementMenu();

        hideSupplementLoader();

    }
);

