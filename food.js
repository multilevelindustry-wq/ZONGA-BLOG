"use strict";


/* =========================================================
   FOOD BLOG DATABASE
========================================================= */

const foodPosts = [

    {
        title: "The Benefits of Eating More Vegetables",
        description:
            "Learn why vegetables are an important part of a balanced diet and how to include more of them in everyday meals.",
        image:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
        alt:
            "Fresh colorful vegetables arranged for healthy eating",
        category:
            "Nutrition",
        readTime:
            "5 min read",
        url:
            "vegetables.html"
    },


    {
        title: "Yam: Nutrition, Preparation and What You Should Know",
        description:
            "Explore yam, a popular staple food, including its nutritional qualities and different ways it can be prepared.",
        image:
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85",
        alt:
            "Fresh yam and root vegetables",
        category:
            "Food",
        readTime:
            "6 min read",
        url:
            "yam.html"
    },


    {
        title: "Healthy Breakfast Ideas for Busy Mornings",
        description:
            "Simple breakfast ideas that can help you start your day with nutritious and satisfying food choices.",
        image:
            "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=85",
        alt:
            "Healthy breakfast with fruits and nutritious foods",
        category:
            "Healthy Eating",
        readTime:
            "5 min read",
        url:
            "healthy-breakfast.html"
    },


    {
        title: "Why Fiber Matters in Your Diet",
        description:
            "Understand dietary fiber and why fiber-rich foods are commonly included in a balanced eating pattern.",
        image:
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85",
        alt:
            "Healthy foods rich in natural dietary fiber",
        category:
            "Nutrition",
        readTime:
            "5 min read",
        url:
            "fiber.html"
    },


    {
        title: "Understanding Fruits and Their Nutrients",
        description:
            "A simple guide to fruits, their nutrients and practical ways to include different fruits in your meals.",
        image:
            "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=85",
        alt:
            "Assortment of fresh colorful fruits",
        category:
            "Food",
        readTime:
            "6 min read",
        url:
            "fruits.html"
    },


    {
        title: "Healthy Cooking Methods You Should Know",
        description:
            "Learn about common cooking methods and how preparation can affect the foods you eat.",
        image:
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85",
        alt:
            "Healthy food being prepared in a modern kitchen",
        category:
            "Cooking",
        readTime:
            "7 min read",
        url:
            "healthy-cooking.html"
    }


    /* =====================================================
       ADD MORE FOOD POSTS HERE
       Maximum 25 will be displayed.
    ===================================================== */

];



/* =========================================================
   SHUFFLE
========================================================= */

function shufflePosts(array){

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
   CREATE POST CARD
========================================================= */

function createFoodPostCard(post){

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
   DISPLAY POSTS
========================================================= */

function displayFoodPosts(){

    const container =
        document.getElementById("foodPosts");


    if(!container){
        return;
    }


    const shuffledPosts =
        shufflePosts(foodPosts);


    const postsToShow =
        shuffledPosts.slice(0, 25);


    container.innerHTML =
        postsToShow
            .map(createFoodPostCard)
            .join("");

}



/* =========================================================
   MOBILE MENU
========================================================= */

function setupCategoryMenu(){

    const button =
        document.getElementById(
            "categoryMenuButton"
        );

    const menu =
        document.getElementById(
            "categoryMobileNav"
        );


    if(!button || !menu){
        return;
    }


    button.addEventListener(
        "click",
        function(){

            const open =
                menu.classList.toggle("open");


            button.classList.toggle(
                "active",
                open
            );


            button.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );


    menu.querySelectorAll("a")
        .forEach(function(link){

            link.addEventListener(
                "click",
                function(){

                    menu.classList.remove("open");

                    button.classList.remove(
                        "active"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}



/* =========================================================
   PAGE LOADER
========================================================= */

function hideCategoryLoader(){

    const loader =
        document.getElementById(
            "categoryLoader"
        );


    if(!loader){
        return;
    }


    setTimeout(function(){

        loader.classList.add("hidden");

    }, 500);

}



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        displayFoodPosts();

        setupCategoryMenu();

        hideCategoryLoader();

    }
);

