"use strict";


/* =========================================================
   HEALTH BLOG DATABASE
========================================================= */

const healthPosts = [

    {
        title:
            "Understanding Cough: Common Causes and What to Know",

        description:
            "Learn about common causes of cough, different types of cough and when persistent symptoms may require professional medical attention.",

        image:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthcare professional discussing symptoms with a patient",

        category:
            "Health",

        readTime:
            "7 min read",

        url:
            "cough.html"
    },


    {
        title:
            "Why Getting Enough Sleep Matters",

        description:
            "Explore the importance of healthy sleep habits and how regular, quality sleep supports everyday wellbeing.",

        image:
            "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person sleeping comfortably in bed",

        category:
            "Wellness",

        readTime:
            "6 min read",

        url:
            "sleep.html"
    },


    {
        title:
            "Understanding Blood Pressure",

        description:
            "A simple educational guide to blood pressure, why it matters and some everyday factors that can influence it.",

        image:
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthcare professional measuring a patient's blood pressure",

        category:
            "Health",

        readTime:
            "8 min read",

        url:
            "blood-pressure.html"
    },


    {
        title:
            "Why Regular Physical Activity Matters",

        description:
            "Discover why regular movement is an important part of a healthy lifestyle and practical ways to stay active.",

        image:
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person exercising as part of a healthy lifestyle",

        category:
            "Fitness",

        readTime:
            "6 min read",

        url:
            "physical-activity.html"
    },


    {
        title:
            "Understanding Dehydration",

        description:
            "Learn what dehydration means, common situations that can increase fluid needs and why hydration matters.",

        image:
            "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=85",

        alt:
            "Glass of clean drinking water representing hydration",

        category:
            "Wellness",

        readTime:
            "5 min read",

        url:
            "dehydration.html"
    },


    {
        title:
            "Healthy Habits for Everyday Wellness",

        description:
            "Small everyday habits can contribute to a healthier lifestyle. Explore practical habits worth building into your routine.",

        image:
            "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person practicing a healthy and peaceful lifestyle",

        category:
            "Lifestyle",

        readTime:
            "7 min read",

        url:
            "healthy-habits.html"
    },


    {
        title:
            "Understanding Stress and Everyday Wellbeing",

        description:
            "Learn about everyday stress, common experiences and practical lifestyle approaches that may support wellbeing.",

        image:
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person practicing relaxation and mindfulness",

        category:
            "Mental Wellness",

        readTime:
            "7 min read",

        url:
            "stress.html"
    },


    {
        title:
            "The Importance of Personal Hygiene",

        description:
            "Explore everyday personal hygiene practices and why they are an important part of maintaining general wellbeing.",

        image:
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85",

        alt:
            "Personal care and hygiene products",

        category:
            "Wellness",

        readTime:
            "5 min read",

        url:
            "personal-hygiene.html"
    },


    {
        title:
            "Why Preventive Health Checks Matter",

        description:
            "Learn why routine health checks can help people identify potential health concerns and discuss questions with professionals.",

        image:
            "https://images.unsplash.com/photo-1638202993928-7d113b8d2a9c?auto=format&fit=crop&w=900&q=85",

        alt:
            "Doctor discussing health information with a patient",

        category:
            "Prevention",

        readTime:
            "6 min read",

        url:
            "preventive-health.html"
    },


    {
        title:
            "Understanding Fever",

        description:
            "Learn what fever is, some common causes and why certain symptoms may require medical evaluation.",

        image:
            "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=85",

        alt:
            "Healthcare professional providing medical care",

        category:
            "Health",

        readTime:
            "7 min read",

        url:
            "fever.html"
    },


    {
        title:
            "Healthy Ways to Build a Daily Routine",

        description:
            "A consistent routine can make healthy habits easier to maintain. Explore practical ideas for organizing your day.",

        image:
            "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person planning a healthy daily routine",

        category:
            "Lifestyle",

        readTime:
            "6 min read",

        url:
            "daily-routine.html"
    },


    {
        title:
            "Understanding Headaches",

        description:
            "Explore common types and causes of headaches and learn about situations where medical advice may be appropriate.",

        image:
            "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person experiencing a headache",

        category:
            "Health",

        readTime:
            "7 min read",

        url:
            "headache.html"
    },


    {
        title:
            "Why Hand Washing Is Important",

        description:
            "Learn why proper hand washing is an important everyday hygiene practice.",

        image:
            "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=900&q=85",

        alt:
            "Hands being washed with soap and water",

        category:
            "Hygiene",

        readTime:
            "4 min read",

        url:
            "hand-washing.html"
    },


    {
        title:
            "Understanding Healthy Body Weight",

        description:
            "Explore the basics of body weight, nutrition, physical activity and why individual health needs can differ.",

        image:
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",

        alt:
            "Person exercising for general health and fitness",

        category:
            "Wellness",

        readTime:
            "7 min read",

        url:
            "healthy-weight.html"
    },


    {
        title:
            "Why Regular Movement Matters as We Age",

        description:
            "Explore the role of movement and physical activity in maintaining everyday mobility and wellbeing.",

        image:
            "https://images.unsplash.com/photo-1550259979-ed79b48d2a7a?auto=format&fit=crop&w=900&q=85",

        alt:
            "Older adults participating in physical activity",

        category:
            "Healthy Aging",

        readTime:
            "6 min read",

        url:
            "healthy-aging.html"
    }


    /* =====================================================
       ADD MORE HEALTH POSTS HERE

       You can add as many as you want.
       The page will display a maximum of 25.

    ===================================================== */

];



/* =========================================================
   SHUFFLE POSTS
========================================================= */

function shuffleHealthPosts(array){

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
   CREATE HEALTH POST CARD
========================================================= */

function createHealthPostCard(post){

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
   DISPLAY HEALTH POSTS
========================================================= */

function displayHealthPosts(){

    const container =
        document.getElementById(
            "healthPosts"
        );


    if(!container){
        return;
    }


    const shuffledPosts =
        shuffleHealthPosts(
            healthPosts
        );


    /*
     * NEVER SHOW MORE THAN 25 POSTS
     */

    const postsToShow =
        shuffledPosts.slice(
            0,
            25
        );


    container.innerHTML =
        postsToShow
            .map(
                createHealthPostCard
            )
            .join("");

}



/* =========================================================
   MOBILE MENU
========================================================= */

function setupHealthMenu(){

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



    /*
     * CLOSE MENU AFTER LINK CLICK
     */

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
   CLOSE MENU WHEN CLICKING OUTSIDE
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


        const clickedButton =
            button.contains(
                event.target
            );


        const clickedMenu =
            menu.contains(
                event.target
            );


        if(
            !clickedButton &&
            !clickedMenu
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

function hideHealthLoader(){

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
   INITIALIZE HEALTH PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        displayHealthPosts();

        setupHealthMenu();

        hideHealthLoader();

    }
);
