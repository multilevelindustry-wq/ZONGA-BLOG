 /* ==========================================================
   NEOSTORE — SELLER PRODUCT UPLOAD
   ==========================================================
   Uses:
   - Firebase Authentication
   - Firebase Firestore
   - Existing firebase.js
   - Existing uploadToCloudinary()

   Seller protection:
   users/{uid}.role === "seller"

   Image system:
   - 1 main product image
   - 1 separate image per variation
========================================================== */


import {
    auth,
    db
} from "./firebase.js";

import "./currency.js";

import {
    uploadToCloudinary
} from "./firebase.js";

import {
    onAuthStateChanged,
    reload
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";



/* ==========================================================
   GLOBAL VARIABLES
========================================================== */

let currentSeller = null;

let sellerData = null;

let variationCounter = 0;

let pageReady = false;



/* ==========================================================
   START
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeSellerUpload
);



/* ==========================================================
   INITIALIZE SELLER UPLOAD PAGE
========================================================== */

async function initializeSellerUpload() {

    try {

        showLoader();


        /*
           Wait for Firebase Authentication
           to determine the current user.
        */

        await waitForAuthentication();


        /*
           Seller protection
        */

        const seller =
            await verifySeller();


        if (!seller) {

            return;

        }


        currentSeller =
            seller.user;

        sellerData =
            seller.data;


        /*
           Initialize page components.
        */

        initializeMainImage();

        initializeCountry();

        initializeVariations();

        initializeForm();


        pageReady =
            true;


        updateProtectionMessage(
            "Seller account verified ✓",
            "success"
        );


        hideLoader();


    } catch (error) {

        console.error(
            "Seller upload initialization error:",
            error
        );


        updateProtectionMessage(
            error.message ||
            "Unable to load seller page.",
            "error"
        );


        hideLoader();

    }

}



/* ==========================================================
   WAIT FOR FIREBASE AUTHENTICATION
========================================================== */

function waitForAuthentication() {

    return new Promise(
        (resolve) => {

            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    async (user) => {

                        unsubscribe();

                        if (!user) {

                            window.location.href =
                                "login.html";

                            resolve(
                                null
                            );

                            return;

                        }


                        try {

                            /*
                               Refresh the Firebase user so
                               emailVerified is current.
                            */

                            await reload(
                                user
                            );

                        } catch (error) {

                            console.warn(
                                "Could not refresh authentication:",
                                error
                            );

                        }


                        resolve(
                            auth.currentUser
                        );

                    }
                );

        }
    );

}



/* ==========================================================
   VERIFY SELLER
========================================================== */

async function verifySeller() {

    const user =
        auth.currentUser;


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    /*
       Email verification is required.
    */

    if (
        user.emailVerified !== true
    ) {

        updateProtectionMessage(
            "Please verify your email before uploading products.",
            "error"
        );


        setTimeout(
            () => {

                window.location.href =
                    "verify-email.html";

            },
            1200
        );


        return null;

    }


    /*
       Read:

       users/{uid}
    */

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const userSnapshot =
        await getDoc(
            userRef
        );


    if (
        !userSnapshot.exists()
    ) {

        throw new Error(
            "Your seller account profile could not be found."
        );

    }


    const data =
        userSnapshot.data();


    /*
       SELLER-ONLY PROTECTION
    */

    if (
        data.role !== "seller"
    ) {

        updateProtectionMessage(
            "This page is available to sellers only.",
            "error"
        );


        setTimeout(
            () => {

                window.location.href =
                    "index.html";

            },
            1200
        );


        return null;

    }


    return {

        user,

        data

    };

}



/* ==========================================================
   MAIN IMAGE
========================================================== */

function initializeMainImage() {

    const input =
        document.getElementById(
            "mainProductImage"
        );


    const preview =
        document.getElementById(
            "mainImagePreview"
        );


    if (
        !input ||
        !preview
    ) {

        return;

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files?.[0];


            if (!file) {

                return;

            }


            if (
                !isValidImage(file)
            ) {

                input.value = "";


                showUploadStatus(
                    "Please select a valid JPG, PNG or WEBP image.",
                    "error"
                );


                return;

            }


            /*
               Show image preview.
            */

            const imageURL =
                URL.createObjectURL(
                    file
                );


            preview.innerHTML = `

                <img
                    src="${imageURL}"
                    alt="Main product image"
                >

            `;


            showUploadStatus(
                "Main product image selected.",
                "success"
            );

        }
    );

}



/* ==========================================================
   COUNTRY / REGION
========================================================== */

function initializeCountry() {

    const country =
        document.getElementById(
            "country"
        );


    const region =
        document.getElementById(
            "region"
        );


    if (
        !country ||
        !region
    ) {

        return;

    }


    country.addEventListener(
        "change",
        () => {

            loadRegions(
                country.value,
                region
            );

        }
    );

}



/* ==========================================================
   LOAD REGIONS
========================================================== */

function loadRegions(
    countryCode,
    regionElement
) {

    if (!regionElement) {
        return;
    }

    regionElement.innerHTML = "";


    /* ======================================================
       COUNTRY REGIONS DATABASE
    ====================================================== */

    const countryRegions = {

        /* ==================================================
           NIGERIA
        ================================================== */

        /* ==========================================================
   BATCH 1 — COUNTRIES 1–30
========================================================== */


/* ==========================================================
   NIGERIA
========================================================== */

NG: [

    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory"

],


/* ==========================================================
   GHANA
========================================================== */

GH: [

    "Ahafo",
    "Ashanti",
    "Bono",
    "Bono East",
    "Central",
    "Eastern",
    "Greater Accra",
    "North East",
    "Northern",
    "Oti",
    "Savannah",
    "Upper East",
    "Upper West",
    "Volta",
    "Western",
    "Western North"

],


/* ==========================================================
   KENYA
========================================================== */

KE: [

    "Baringo",
    "Bomet",
    "Bungoma",
    "Busia",
    "Elgeyo-Marakwet",
    "Embu",
    "Garissa",
    "Homa Bay",
    "Isiolo",
    "Kajiado",
    "Kakamega",
    "Kericho",
    "Kiambu",
    "Kilifi",
    "Kirinyaga",
    "Kisii",
    "Kisumu",
    "Kitui",
    "Kwale",
    "Laikipia",
    "Lamu",
    "Machakos",
    "Makueni",
    "Mandera",
    "Marsabit",
    "Meru",
    "Migori",
    "Mombasa",
    "Murang'a",
    "Nairobi",
    "Nakuru",
    "Nandi",
    "Narok",
    "Nyamira",
    "Nyandarua",
    "Nyeri",
    "Samburu",
    "Siaya",
    "Taita-Taveta",
    "Tana River",
    "Tharaka-Nithi",
    "Trans Nzoia",
    "Turkana",
    "Uasin Gishu",
    "Vihiga",
    "Wajir",
    "West Pokot"

],


/* ==========================================================
   SOUTH AFRICA
========================================================== */

ZA: [

    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape"

],


/* ==========================================================
   UNITED STATES
========================================================== */

US: [

    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "District of Columbia"

],


/* ==========================================================
   CANADA
========================================================== */

CA: [

    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon"

],


/* ==========================================================
   UNITED KINGDOM
========================================================== */

GB: [

    "England",
    "Scotland",
    "Wales",
    "Northern Ireland"

],


/* ==========================================================
   AUSTRALIA
========================================================== */

AU: [

    "Australian Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia"

],


/* ==========================================================
   INDIA
========================================================== */

IN: [

    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"

],


/* ==========================================================
   PAKISTAN
========================================================== */

PK: [

    "Balochistan",
    "Khyber Pakhtunkhwa",
    "Punjab",
    "Sindh",
    "Islamabad Capital Territory",
    "Azad Jammu and Kashmir",
    "Gilgit-Baltistan"

],


/* ==========================================================
   BANGLADESH
========================================================== */

BD: [

    "Barisal",
    "Chittagong",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet"

],


/* ==========================================================
   BRAZIL
========================================================== */

BR: [

    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
    "Distrito Federal"

],


/* ==========================================================
   MEXICO
========================================================== */

MX: [

    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Mexico City",
    "Mexico State",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas"

],


/* ==========================================================
   ARGENTINA
========================================================== */

AR: [

    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán",
    "Buenos Aires City"

],


/* ==========================================================
   GERMANY
========================================================== */

DE: [

    "Baden-Württemberg",
    "Bavaria",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hesse",
    "Lower Saxony",
    "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia",
    "Rhineland-Palatinate",
    "Saarland",
    "Saxony",
    "Saxony-Anhalt",
    "Schleswig-Holstein",
    "Thuringia"

],


/* ==========================================================
   FRANCE
========================================================== */

FR: [

    "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté",
    "Brittany",
    "Centre-Val de Loire",
    "Corsica",
    "Grand Est",
    "Hauts-de-France",
    "Île-de-France",
    "Normandy",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Pays de la Loire",
    "Provence-Alpes-Côte d'Azur"

],


/* ==========================================================
   ITALY
========================================================== */

IT: [

    "Abruzzo",
    "Aosta Valley",
    "Apulia",
    "Basilicata",
    "Calabria",
    "Campania",
    "Emilia-Romagna",
    "Friuli-Venezia Giulia",
    "Lazio",
    "Liguria",
    "Lombardy",
    "Marche",
    "Molise",
    "Piedmont",
    "Sardinia",
    "Sicily",
    "Trentino-Alto Adige",
    "Tuscany",
    "Umbria",
    "Veneto"

],


/* ==========================================================
   SPAIN
========================================================== */

ES: [

    "Andalusia",
    "Aragon",
    "Asturias",
    "Balearic Islands",
    "Basque Country",
    "Canary Islands",
    "Cantabria",
    "Castile and León",
    "Castilla-La Mancha",
    "Catalonia",
    "Extremadura",
    "Galicia",
    "La Rioja",
    "Madrid",
    "Murcia",
    "Navarre",
    "Valencian Community"

],


/* ==========================================================
   JAPAN
========================================================== */

JP: [

    "Hokkaido",
    "Aomori",
    "Iwate",
    "Miyagi",
    "Akita",
    "Yamagata",
    "Fukushima",
    "Ibaraki",
    "Tochigi",
    "Gunma",
    "Saitama",
    "Chiba",
    "Tokyo",
    "Kanagawa",
    "Niigata",
    "Toyama",
    "Ishikawa",
    "Fukui",
    "Yamanashi",
    "Nagano",
    "Gifu",
    "Shizuoka",
    "Aichi",
    "Mie",
    "Shiga",
    "Kyoto",
    "Osaka",
    "Hyogo",
    "Nara",
    "Wakayama",
    "Tottori",
    "Shimane",
    "Okayama",
    "Hiroshima",
    "Yamaguchi",
    "Tokushima",
    "Kagawa",
    "Ehime",
    "Kochi",
    "Fukuoka",
    "Saga",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Miyazaki",
    "Kagoshima",
    "Okinawa"

],


/* ==========================================================
   CHINA
========================================================== */

CN: [

    "Anhui",
    "Beijing",
    "Chongqing",
    "Fujian",
    "Gansu",
    "Guangdong",
    "Guangxi",
    "Guizhou",
    "Hainan",
    "Hebei",
    "Heilongjiang",
    "Henan",
    "Hubei",
    "Hunan",
    "Jiangsu",
    "Jiangxi",
    "Jilin",
    "Liaoning",
    "Inner Mongolia",
    "Ningxia",
    "Qinghai",
    "Shaanxi",
    "Shandong",
    "Shanghai",
    "Shanxi",
    "Sichuan",
    "Tianjin",
    "Tibet",
    "Xinjiang",
    "Yunnan",
    "Zhejiang",
    "Hong Kong",
    "Macau"

],


/* ==========================================================
   UNITED ARAB EMIRATES
========================================================== */

AE: [

    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain"

],


/* ==========================================================
   SAUDI ARABIA
========================================================== */

SA: [

    "Riyadh",
    "Makkah",
    "Madinah",
    "Eastern Province",
    "Asir",
    "Tabuk",
    "Qassim",
    "Hail",
    "Jazan",
    "Najran",
    "Al Bahah",
    "Al Jawf",
    "Northern Borders"

],


/* ==========================================================
   EGYPT
========================================================== */

EG: [

    "Cairo",
    "Alexandria",
    "Giza",
    "Qalyubia",
    "Port Said",
    "Suez",
    "Dakahlia",
    "Sharqia",
    "Gharbia",
    "Monufia",
    "Beheira",
    "Kafr El Sheikh",
    "Damietta",
    "Ismailia",
    "Faiyum",
    "Beni Suef",
    "Minya",
    "Asyut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "North Sinai",
    "South Sinai"

],


/* ==========================================================
   TURKEY
========================================================== */

TR: [

    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Aksaray",
    "Amasya",
    "Ankara",
    "Antalya",
    "Ardahan",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bartın",
    "Batman",
    "Bayburt",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Düzce",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkâri",
    "Hatay",
    "Iğdır",
    "Isparta",
    "Istanbul",
    "İzmir",
    "Kahramanmaraş",
    "Karabük",
    "Karaman",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kilis",
    "Kırıkkale",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Mardin",
    "Mersin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Osmaniye",
    "Rize",
    "Sakarya",
    "Samsun",
    "Şanlıurfa",
    "Siirt",
    "Sinop",
    "Sivas",
    "Şırnak",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Uşak",
    "Van",
    "Yalova",
    "Yozgat",
    "Zonguldak"

],


/* ==========================================================
   ETHIOPIA
========================================================== */

ET: [

    "Addis Ababa",
    "Afar",
    "Amhara",
    "Benishangul-Gumuz",
    "Dire Dawa",
    "Gambela",
    "Harari",
    "Oromia",
    "Sidama",
    "Somali",
    "South Ethiopia",
    "South West Ethiopia",
    "Tigray",
    "Central Ethiopia"

],


/* ==========================================================
   TANZANIA
========================================================== */

TZ: [

    "Arusha",
    "Dar es Salaam",
    "Dodoma",
    "Geita",
    "Iringa",
    "Kagera",
    "Katavi",
    "Kigoma",
    "Kilimanjaro",
    "Lindi",
    "Manyara",
    "Mara",
    "Mbeya",
    "Morogoro",
    "Mtwara",
    "Mwanza",
    "Njombe",
    "Pemba North",
    "Pemba South",
    "Pwani",
    "Rukwa",
    "Ruvuma",
    "Shinyanga",
    "Simiyu",
    "Singida",
    "Songwe",
    "Tabora",
    "Tanga",
    "Zanzibar North",
    "Zanzibar South and Central",
    "Zanzibar West"

],


/* ==========================================================
   UGANDA
========================================================== */

UG: [

    "Central Region",
    "Eastern Region",
    "Northern Region",
    "Western Region"

],


/* ==========================================================
   RWANDA
========================================================== */

RW: [

    "Kigali",
    "Eastern Province",
    "Northern Province",
    "Southern Province",
    "Western Province"

],


/* ==========================================================
   CAMEROON
========================================================== */

CM: [

    "Adamawa",
    "Centre",
    "East",
    "Far North",
    "Littoral",
    "North",
    "Northwest",
    "South",
    "Southwest",
    "West"

],


/* ==========================================================
   SENEGAL
========================================================== */

SN: [

    "Dakar",
    "Diourbel",
    "Fatick",
    "Kaffrine",
    "Kaolack",
    "Kédougou",
    "Kolda",
    "Louga",
    "Matam",
    "Saint-Louis",
    "Sédhiou",
    "Tambacounda",
    "Thiès",
    "Ziguinchor"

],


/* ==========================================================
   CÔTE D'IVOIRE
========================================================== */

CI: [

    "Abidjan",
    "Bas-Sassandra",
    "Comoé",
    "Denguélé",
    "Gôh-Djiboua",
    "Lacs",
    "Lagunes",
    "Montagnes",
    "Sassandra-Marahoué",
    "Savanes",
    "Vallée du Bandama",
    "Woroba",
    "Yamoussoukro",
    "Zanzan"

],

/* ==========================================================
   BATCH 2 — COUNTRIES 31–60
========================================================== */


/* ==========================================================
   MOROCCO
========================================================== */

MA: [

    "Béni Mellal-Khénifra",
    "Casablanca-Settat",
    "Dakhla-Oued Ed-Dahab",
    "Drâa-Tafilalet",
    "Fès-Meknès",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Marrakesh-Safi",
    "Oriental",
    "Rabat-Salé-Kénitra",
    "Souss-Massa",
    "Tanger-Tetouan-Al Hoceima"

],


/* ==========================================================
   ALGERIA
========================================================== */

DZ: [

    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Algiers",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Menia"

],


/* ==========================================================
   TUNISIA
========================================================== */

TN: [

    "Ariana",
    "Béja",
    "Ben Arous",
    "Bizerte",
    "Gabès",
    "Gafsa",
    "Jendouba",
    "Kairouan",
    "Kasserine",
    "Kébili",
    "Kef",
    "Mahdia",
    "Manouba",
    "Medenine",
    "Monastir",
    "Nabeul",
    "Sfax",
    "Sidi Bouzid",
    "Siliana",
    "Sousse",
    "Tataouine",
    "Tozeur",
    "Tunis",
    "Zaghouan"

],


/* ==========================================================
   LIBYA
========================================================== */

LY: [

    "Tripoli",
    "Benghazi",
    "Misrata",
    "Al Bayda",
    "Zawiya",
    "Zuwara",
    "Derna",
    "Tobruk",
    "Sabha",
    "Murzuq",
    "Ghat",
    "Nalut",
    "Gharyan",
    "Sirte",
    "Ajdabiya",
    "Al Kufra",
    "Jufra",
    "Wadi al Hayaa",
    "Wadi al Shatii",
    "Jabal al Akhdar",
    "Jabal al Gharbi",
    "Marj",
    "Al Jfara",
    "Al Wahat",
    "Al Jabal al Akhdar"

],


/* ==========================================================
   SUDAN
========================================================== */

SD: [

    "Khartoum",
    "Al Jazirah",
    "Al Qadarif",
    "White Nile",
    "Blue Nile",
    "Sennar",
    "Northern",
    "River Nile",
    "Red Sea",
    "Kassala",
    "North Darfur",
    "South Darfur",
    "West Darfur",
    "Central Darfur",
    "East Darfur",
    "North Kordofan",
    "South Kordofan",
    "West Kordofan"

],


/* ==========================================================
   SOUTH SUDAN
========================================================== */

SS: [

    "Central Equatoria",
    "Eastern Equatoria",
    "Western Equatoria",
    "Jonglei",
    "Unity",
    "Upper Nile",
    "Lakes",
    "Warrap",
    "Northern Bahr el Ghazal",
    "Western Bahr el Ghazal",
    "Abyei"

],


/* ==========================================================
   ZAMBIA
========================================================== */

ZM: [

    "Central",
    "Copperbelt",
    "Eastern",
    "Luapula",
    "Lusaka",
    "Muchinga",
    "Northern",
    "North-Western",
    "Southern",
    "Western"

],


/* ==========================================================
   ZIMBABWE
========================================================== */

ZW: [

    "Bulawayo",
    "Harare",
    "Manicaland",
    "Mashonaland Central",
    "Mashonaland East",
    "Mashonaland West",
    "Masvingo",
    "Matabeleland North",
    "Matabeleland South",
    "Midlands"

],


/* ==========================================================
   BOTSWANA
========================================================== */

BW: [

    "Central",
    "Chobe",
    "Francistown",
    "Gaborone",
    "Ghanzi",
    "Jwaneng",
    "Kgalagadi",
    "Kgatleng",
    "Kweneng",
    "Lobatse",
    "North East",
    "North West",
    "Selibe Phikwe",
    "South East",
    "Southern",
    "Sowa"

],


/* ==========================================================
   NAMIBIA
========================================================== */

NA: [

    "Erongo",
    "Hardap",
    "Karas",
    "Kavango East",
    "Kavango West",
    "Khomas",
    "Kunene",
    "Ohangwena",
    "Omaheke",
    "Omusati",
    "Oshana",
    "Oshikoto",
    "Otjozondjupa",
    "Zambezi"

],


/* ==========================================================
   MOZAMBIQUE
========================================================== */

MZ: [

    "Cabo Delgado",
    "Gaza",
    "Inhambane",
    "Manica",
    "Maputo",
    "Maputo City",
    "Nampula",
    "Niassa",
    "Sofala",
    "Tete",
    "Zambézia"

],


/* ==========================================================
   ANGOLA
========================================================== */

AO: [

    "Bengo",
    "Benguela",
    "Bié",
    "Cabinda",
    "Cuando Cubango",
    "Cuanza Norte",
    "Cuanza Sul",
    "Cunene",
    "Huambo",
    "Huíla",
    "Luanda",
    "Lunda Norte",
    "Lunda Sul",
    "Malanje",
    "Moxico",
    "Namibe",
    "Uíge",
    "Zaire"

],


/* ==========================================================
   MALAWI
========================================================== */

MW: [

    "Central Region",
    "Northern Region",
    "Southern Region"

],


/* ==========================================================
   DEMOCRATIC REPUBLIC OF THE CONGO
========================================================== */

CD: [

    "Bas-Uélé",
    "Équateur",
    "Haut-Katanga",
    "Haut-Lomami",
    "Haut-Uélé",
    "Ituri",
    "Kasaï",
    "Kasaï Central",
    "Kasaï Oriental",
    "Kinshasa",
    "Kongo Central",
    "Kwango",
    "Kwilu",
    "Lomami",
    "Lualaba",
    "Mai-Ndombe",
    "Maniema",
    "Mongala",
    "Nord-Kivu",
    "Nord-Ubangi",
    "Sankuru",
    "Sud-Kivu",
    "Sud-Ubangi",
    "Tanganyika",
    "Tshopo",
    "Tshuapa"

],


/* ==========================================================
   REPUBLIC OF THE CONGO
========================================================== */

CG: [

    "Bouenza",
    "Brazzaville",
    "Cuvette",
    "Cuvette-Ouest",
    "Kouilou",
    "Lékoumou",
    "Likouala",
    "Niari",
    "Plateaux",
    "Pool",
    "Sangha",
    "Pointe-Noire"

],


/* ==========================================================
   GABON
========================================================== */

GA: [

    "Estuaire",
    "Haut-Ogooué",
    "Moyen-Ogooué",
    "Ngounié",
    "Nyanga",
    "Ogooué-Ivindo",
    "Ogooué-Lolo",
    "Ogooué-Maritime",
    "Woleu-Ntem"

],


/* ==========================================================
   BENIN
========================================================== */

BJ: [

    "Alibori",
    "Atakora",
    "Atlantique",
    "Borgou",
    "Collines",
    "Donga",
    "Littoral",
    "Mono",
    "Ouémé",
    "Plateau",
    "Zou"

],


/* ==========================================================
   TOGO
========================================================== */

TG: [

    "Centrale",
    "Kara",
    "Maritime",
    "Plateaux",
    "Savanes"

],


/* ==========================================================
   BURKINA FASO
========================================================== */

BF: [

    "Boucle du Mouhoun",
    "Cascades",
    "Centre",
    "Centre-Est",
    "Centre-Nord",
    "Centre-Ouest",
    "Centre-Sud",
    "Est",
    "Hauts-Bassins",
    "Nord",
    "Plateau-Central",
    "Sahel",
    "Sud-Ouest"

],


/* ==========================================================
   MALI
========================================================== */

ML: [

    "Bamako",
    "Gao",
    "Kayes",
    "Kidal",
    "Koulikoro",
    "Ménaka",
    "Mopti",
    "Ségou",
    "Sikasso",
    "Taoudénit",
    "Tombouctou"

],


/* ==========================================================
   NIGER
========================================================== */

NE: [

    "Agadez",
    "Diffa",
    "Dosso",
    "Maradi",
    "Niamey",
    "Tahoua",
    "Tillabéri",
    "Zinder"

],


/* ==========================================================
   CHAD
========================================================== */

TD: [

    "Bahr el Gazel",
    "Batha",
    "Borkou",
    "Chari-Baguirmi",
    "Ennedi-Est",
    "Ennedi-Ouest",
    "Guéra",
    "Hadjer-Lamis",
    "Kanem",
    "Lac",
    "Logone Occidental",
    "Logone Oriental",
    "Mandoul",
    "Mayo-Kebbi Est",
    "Mayo-Kebbi Ouest",
    "Moyen-Chari",
    "N'Djamena",
    "Ouaddaï",
    "Salamat",
    "Sila",
    "Tandjilé",
    "Tibesti",
    "Wadi Fira"

],


/* ==========================================================
   GUINEA
========================================================== */

GN: [

    "Boké",
    "Conakry",
    "Faranah",
    "Kankan",
    "Kindia",
    "Labé",
    "Mamou",
    "Nzérékoré"

],


/* ==========================================================
   SIERRA LEONE
========================================================== */

SL: [

    "Eastern",
    "Northern",
    "North Western",
    "Southern",
    "Western Area"

],


/* ==========================================================
   LIBERIA
========================================================== */

LR: [

    "Bomi",
    "Bong",
    "Gbarpolu",
    "Grand Bassa",
    "Grand Cape Mount",
    "Grand Gedeh",
    "Grand Kru",
    "Lofa",
    "Margibi",
    "Maryland",
    "Montserrado",
    "Nimba",
    "River Cess",
    "River Gee",
    "Sinoe"

],


/* ==========================================================
   THE GAMBIA
========================================================== */

GM: [

    "Banjul",
    "Kanifing",
    "Central River",
    "Lower River",
    "North Bank",
    "Upper River",
    "West Coast"

],


/* ==========================================================
   GUINEA-BISSAU
========================================================== */

GW: [

    "Bafatá",
    "Biombo",
    "Bolama",
    "Cacheu",
    "Gabú",
    "Oio",
    "Quinara",
    "Tombali",
    "Bissau"

],


/* ==========================================================
   MAURITANIA
========================================================== */

MR: [

    "Adrar",
    "Assaba",
    "Brakna",
    "Dakhlet Nouadhibou",
    "Gorgol",
    "Guidimaka",
    "Hodh Ech Chargui",
    "Hodh El Gharbi",
    "Inchiri",
    "Nouakchott Nord",
    "Nouakchott Ouest",
    "Nouakchott Sud",
    "Tagant",
    "Tiris Zemmour",
    "Trarza"

],


/* ==========================================================
   CABO VERDE
========================================================== */

CV: [

    "Boa Vista",
    "Brava",
    "Maio",
    "Mosteiros",
    "Paul",
    "Praia",
    "Ribeira Brava",
    "Ribeira Grande",
    "Ribeira Grande de Santiago",
    "Sal",
    "Santa Catarina",
    "Santa Catarina do Fogo",
    "Santa Cruz",
    "São Domingos",
    "São Filipe",
    "São Lourenço dos Órgãos",
    "São Miguel",
    "São Salvador do Mundo",
    "São Vicente",
    "Tarrafal",
    "Tarrafal de São Nicolau"

],

/* ==========================================================
   BATCH 3 — COUNTRIES 61–90
========================================================== */


/* ==========================================================
   SOMALIA
========================================================== */

SO: [

    "Awdal",
    "Bakool",
    "Banaadir",
    "Bari",
    "Bay",
    "Galguduud",
    "Gedo",
    "Hiiraan",
    "Lower Juba",
    "Lower Shabelle",
    "Middle Juba",
    "Middle Shabelle",
    "Mudug",
    "Nugaal",
    "Sanaag",
    "Sool",
    "Togdheer",
    "Woqooyi Galbeed"

],


/* ==========================================================
   DJIBOUTI
========================================================== */

DJ: [

    "Ali Sabieh",
    "Arta",
    "Dikhil",
    "Djibouti",
    "Obock",
    "Tadjourah"

],


/* ==========================================================
   ERITREA
========================================================== */

ER: [

    "Anseba",
    "Central",
    "Southern",
    "Northern Red Sea",
    "Southern Red Sea",
    "Gash-Barka"

],


/* ==========================================================
   MADAGASCAR
========================================================== */

MG: [

    "Antananarivo",
    "Antsiranana",
    "Fianarantsoa",
    "Mahajanga",
    "Toamasina",
    "Toliara"

],


/* ==========================================================
   MAURITIUS
========================================================== */

MU: [

    "Black River",
    "Flacq",
    "Grand Port",
    "Moka",
    "Pamplemousses",
    "Plaines Wilhems",
    "Port Louis",
    "Rivière du Rempart",
    "Savanne",
    "Agalega Islands",
    "Cargados Carajos",
    "Rodrigues"

],


/* ==========================================================
   SEYCHELLES
========================================================== */

SC: [

    "Anse aux Pins",
    "Anse Boileau",
    "Anse Etoile",
    "Au Cap",
    "Baie Lazare",
    "Baie Sainte Anne",
    "Beau Vallon",
    "Bel Air",
    "Bel Ombre",
    "Cascade",
    "Glacis",
    "Grand Anse",
    "La Digue",
    "La Rivière Anglaise",
    "Les Mamelles",
    "Mont Buxton",
    "Mont Fleuri",
    "Plaisance",
    "Pointe La Rue",
    "Port Glaud",
    "Saint Louis",
    "Takamaka"

],


/* ==========================================================
   COMOROS
========================================================== */

KM: [

    "Grande Comore",
    "Mohéli",
    "Anjouan"

],


/* ==========================================================
   AUSTRIA
========================================================== */

AT: [

    "Burgenland",
    "Carinthia",
    "Lower Austria",
    "Upper Austria",
    "Salzburg",
    "Styria",
    "Tyrol",
    "Vorarlberg",
    "Vienna"

],


/* ==========================================================
   SWITZERLAND
========================================================== */

CH: [

    "Aargau",
    "Appenzell Ausserrhoden",
    "Appenzell Innerrhoden",
    "Basel-Landschaft",
    "Basel-Stadt",
    "Bern",
    "Fribourg",
    "Geneva",
    "Glarus",
    "Graubünden",
    "Jura",
    "Lucerne",
    "Neuchâtel",
    "Nidwalden",
    "Obwalden",
    "Schaffhausen",
    "Schwyz",
    "Solothurn",
    "St. Gallen",
    "Thurgau",
    "Ticino",
    "Uri",
    "Valais",
    "Vaud",
    "Zug",
    "Zürich"

],


/* ==========================================================
   PORTUGAL
========================================================== */

PT: [

    "Aveiro",
    "Beja",
    "Braga",
    "Bragança",
    "Castelo Branco",
    "Coimbra",
    "Évora",
    "Faro",
    "Guarda",
    "Leiria",
    "Lisbon",
    "Portalegre",
    "Porto",
    "Santarém",
    "Setúbal",
    "Viana do Castelo",
    "Vila Real",
    "Viseu",
    "Azores",
    "Madeira"

],


/* ==========================================================
   NETHERLANDS
========================================================== */

NL: [

    "Drenthe",
    "Flevoland",
    "Friesland",
    "Gelderland",
    "Groningen",
    "Limburg",
    "North Brabant",
    "North Holland",
    "Overijssel",
    "South Holland",
    "Utrecht",
    "Zeeland"

],


/* ==========================================================
   BELGIUM
========================================================== */

BE: [

    "Antwerp",
    "East Flanders",
    "Flemish Brabant",
    "Limburg",
    "West Flanders",
    "Hainaut",
    "Liège",
    "Luxembourg",
    "Namur",
    "Brussels-Capital Region"

],


/* ==========================================================
   POLAND
========================================================== */

PL: [

    "Lower Silesian",
    "Kuyavian-Pomeranian",
    "Lublin",
    "Lubusz",
    "Łódź",
    "Lesser Poland",
    "Masovian",
    "Opole",
    "Podkarpackie",
    "Podlaskie",
    "Pomeranian",
    "Silesian",
    "Świętokrzyskie",
    "Warmian-Masurian",
    "Greater Poland",
    "West Pomeranian"

],


/* ==========================================================
   CZECHIA
========================================================== */

CZ: [

    "Central Bohemian",
    "South Bohemian",
    "Plzeň",
    "Karlovy Vary",
    "Ústí nad Labem",
    "Liberec",
    "Hradec Králové",
    "Pardubice",
    "Vysočina",
    "South Moravian",
    "Olomouc",
    "Zlín",
    "Moravian-Silesian",
    "Prague"

],


/* ==========================================================
   SLOVAKIA
========================================================== */

SK: [

    "Bratislava",
    "Trnava",
    "Trenčín",
    "Nitra",
    "Žilina",
    "Banská Bystrica",
    "Prešov",
    "Košice"

],


/* ==========================================================
   HUNGARY
========================================================== */

HU: [

    "Bács-Kiskun",
    "Baranya",
    "Békés",
    "Borsod-Abaúj-Zemplén",
    "Budapest",
    "Csongrád-Csanád",
    "Fejér",
    "Győr-Moson-Sopron",
    "Hajdú-Bihar",
    "Heves",
    "Jász-Nagykun-Szolnok",
    "Komárom-Esztergom",
    "Nógrád",
    "Pest",
    "Somogy",
    "Szabolcs-Szatmár-Bereg",
    "Tolna",
    "Vas",
    "Veszprém",
    "Zala"

],


/* ==========================================================
   ROMANIA
========================================================== */

RO: [

    "Alba",
    "Arad",
    "Argeș",
    "Bacău",
    "Bihor",
    "Bistrița-Năsăud",
    "Botoșani",
    "Brașov",
    "Brăila",
    "Buzău",
    "Caraș-Severin",
    "Călărași",
    "Cluj",
    "Constanța",
    "Covasna",
    "Dâmbovița",
    "Dolj",
    "Galați",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomița",
    "Iași",
    "Ilfov",
    "Maramureș",
    "Mehedinți",
    "Mureș",
    "Neamț",
    "Olt",
    "Prahova",
    "Sălaj",
    "Satu Mare",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timiș",
    "Tulcea",
    "Vaslui",
    "Vâlcea",
    "Vrancea",
    "Bucharest"

],


/* ==========================================================
   BULGARIA
========================================================== */

BG: [

    "Blagoevgrad",
    "Burgas",
    "Dobrich",
    "Gabrovo",
    "Haskovo",
    "Kardzhali",
    "Kyustendil",
    "Lovech",
    "Montana",
    "Pazardzhik",
    "Pernik",
    "Pleven",
    "Plovdiv",
    "Razgrad",
    "Ruse",
    "Shumen",
    "Silistra",
    "Sliven",
    "Smolyan",
    "Sofia City",
    "Sofia Province",
    "Stara Zagora",
    "Targovishte",
    "Varna",
    "Veliko Tarnovo",
    "Vidin",
    "Vratsa",
    "Yambol"

],


/* ==========================================================
   GREECE
========================================================== */

GR: [

    "Attica",
    "Central Greece",
    "Central Macedonia",
    "Crete",
    "Eastern Macedonia and Thrace",
    "Epirus",
    "Ionian Islands",
    "North Aegean",
    "Peloponnese",
    "South Aegean",
    "Thessaly",
    "Western Greece",
    "Western Macedonia",
    "Mount Athos"

],


/* ==========================================================
   SWEDEN
========================================================== */

SE: [

    "Blekinge",
    "Dalarna",
    "Gävleborg",
    "Gotland",
    "Halland",
    "Jämtland",
    "Jönköping",
    "Kalmar",
    "Kronoberg",
    "Norrbotten",
    "Örebro",
    "Östergötland",
    "Skåne",
    "Södermanland",
    "Stockholm",
    "Uppsala",
    "Värmland",
    "Västerbotten",
    "Västernorrland",
    "Västmanland",
    "Västra Götaland"

],


/* ==========================================================
   NORWAY
========================================================== */

NO: [

    "Agder",
    "Akershus",
    "Buskerud",
    "Finnmark",
    "Innlandet",
    "Møre og Romsdal",
    "Nordland",
    "Oslo",
    "Rogaland",
    "Telemark",
    "Troms",
    "Trøndelag",
    "Vestfold",
    "Vestland",
    "Østfold"

],


/* ==========================================================
   DENMARK
========================================================== */

DK: [

    "Capital Region of Denmark",
    "Central Denmark Region",
    "North Denmark Region",
    "Region Zealand",
    "Region of Southern Denmark"

],


/* ==========================================================
   FINLAND
========================================================== */

FI: [

    "Lapland",
    "North Ostrobothnia",
    "Kainuu",
    "North Karelia",
    "Northern Savonia",
    "Southern Savonia",
    "South Karelia",
    "Central Finland",
    "South Ostrobothnia",
    "Ostrobothnia",
    "Central Ostrobothnia",
    "Pirkanmaa",
    "Satakunta",
    "Kanta-Häme",
    "Päijät-Häme",
    "Kymenlaakso",
    "Uusimaa",
    "Southwest Finland",
    "Åland"

],


/* ==========================================================
   ICELAND
========================================================== */

IS: [

    "Capital Region",
    "Southern Peninsula",
    "West",
    "Westfjords",
    "Northwest",
    "Northeast",
    "East",
    "South"

],


/* ==========================================================
   IRELAND
========================================================== */

IE: [

    "Carlow",
    "Cavan",
    "Clare",
    "Cork",
    "Donegal",
    "Dublin",
    "Galway",
    "Kerry",
    "Kildare",
    "Kilkenny",
    "Laois",
    "Leitrim",
    "Limerick",
    "Longford",
    "Louth",
    "Mayo",
    "Meath",
    "Monaghan",
    "Offaly",
    "Roscommon",
    "Sligo",
    "Tipperary",
    "Waterford",
    "Westmeath",
    "Wexford",
    "Wicklow"

],


/* ==========================================================
   UKRAINE
========================================================== */

UA: [

    "Cherkasy",
    "Chernihiv",
    "Chernivtsi",
    "Dnipropetrovsk",
    "Donetsk",
    "Ivano-Frankivsk",
    "Kharkiv",
    "Kherson",
    "Khmelnytskyi",
    "Kirovohrad",
    "Kyiv",
    "Luhansk",
    "Lviv",
    "Mykolaiv",
    "Odesa",
    "Poltava",
    "Rivne",
    "Sumy",
    "Ternopil",
    "Vinnytsia",
    "Volyn",
    "Zakarpattia",
    "Zaporizhzhia",
    "Zhytomyr",
    "Kyiv City",
    "Sevastopol",
    "Crimea"

],


/* ==========================================================
   RUSSIA
========================================================== */

RU: [

    "Adygea",
    "Altai",
    "Altai Krai",
    "Amur",
    "Arkhangelsk",
    "Astrakhan",
    "Bashkortostan",
    "Belgorod",
    "Bryansk",
    "Buryatia",
    "Chechnya",
    "Chelyabinsk",
    "Chukotka",
    "Chuvashia",
    "Dagestan",
    "Ingushetia",
    "Irkutsk",
    "Ivanovo",
    "Kabardino-Balkaria",
    "Kaliningrad",
    "Kalmykia",
    "Kaluga",
    "Kamchatka",
    "Karachay-Cherkessia",
    "Karelia",
    "Kemerovo",
    "Khabarovsk",
    "Khakassia",
    "Khanty-Mansi",
    "Kirov",
    "Komi",
    "Kostroma",
    "Krasnodar",
    "Krasnoyarsk",
    "Kurgan",
    "Kursk",
    "Leningrad",
    "Lipetsk",
    "Magadan",
    "Mari El",
    "Mordovia",
    "Moscow",
    "Moscow Oblast",
    "Murmansk",
    "Nenets",
    "Nizhny Novgorod",
    "North Ossetia-Alania",
    "Novgorod",
    "Novosibirsk",
    "Omsk",
    "Orenburg",
    "Oryol",
    "Penza",
    "Perm",
    "Primorsky",
    "Pskov",
    "Rostov",
    "Ryazan",
    "Sakha",
    "Sakhalin",
    "Samara",
    "Saratov",
    "Sevastopol",
    "Smolensk",
    "Stavropol",
    "Sverdlovsk",
    "Tambov",
    "Tatarstan",
    "Tomsk",
    "Tula",
    "Tuva",
    "Tver",
    "Tyumen",
    "Udmurtia",
    "Ulyanovsk",
    "Vladimir",
    "Volgograd",
    "Vologda",
    "Voronezh",
    "Yamal-Nenets",
    "Yaroslavl",
    "Zabaykalsky"

],


/* ==========================================================
   CROATIA
========================================================== */

HR: [

    "Bjelovar-Bilogora",
    "Brod-Posavina",
    "Dubrovnik-Neretva",
    "Istria",
    "Karlovac",
    "Koprivnica-Križevci",
    "Krapina-Zagorje",
    "Lika-Senj",
    "Međimurje",
    "Osijek-Baranja",
    "Požega-Slavonia",
    "Primorje-Gorski Kotar",
    "Šibenik-Knin",
    "Sisak-Moslavina",
    "Split-Dalmatia",
    "Varaždin",
    "Virovitica-Podravina",
    "Vukovar-Srijem",
    "Zadar",
    "Zagreb County",
    "City of Zagreb"

],


/* ==========================================================
   SERBIA
========================================================== */

RS: [

    "Belgrade",
    "Vojvodina",
    "Šumadija and Western Serbia",
    "Southern and Eastern Serbia",
    "Kosovo and Metohija"

],


/* ==========================================================
   SLOVENIA
========================================================== */

SI: [

    "Central Slovenia",
    "Drava",
    "Savinja",
    "Coastal–Karst",
    "Southeast Slovenia",
    "Carinthia",
    "Upper Carniola",
    "Gorizia",
    "Littoral–Inner Carniola",
    "Mura",
    "Central Sava",
    "Lower Sava",
    "Primorska",
    "Posavje"

],


/* ==========================================================
   BOSNIA AND HERZEGOVINA
========================================================== */

BA: [

    "Federation of Bosnia and Herzegovina",
    "Republika Srpska",
    "Brčko District"

],


/* ==========================================================
   ALBANIA
========================================================== */

AL: [

    "Berat",
    "Dibër",
    "Durrës",
    "Elbasan",
    "Fier",
    "Gjirokastër",
    "Korçë",
    "Kukës",
    "Lezhë",
    "Shkodër",
    "Tirana",
    "Vlorë"

],

/* ==========================================================
   BATCH 4 — NEXT 30 COUNTRIES
========================================================== */

AF: [
    "Badakhshan","Badghis","Baghlan","Balkh","Bamyan","Daykundi","Farah",
    "Faryab","Ghazni","Ghor","Helmand","Herat","Jowzjan","Kabul","Kandahar",
    "Kapisa","Khost","Kunar","Kunduz","Laghman","Logar","Nangarhar",
    "Nimroz","Nuristan","Paktia","Paktika","Panjshir","Parwan","Samangan",
    "Sar-e Pol","Takhar","Uruzgan","Wardak","Zabul"
],

AM: [
    "Aragatsotn","Ararat","Armavir","Gegharkunik","Kotayk","Lori","Shirak",
    "Syunik","Tavush","Vayots Dzor","Yerevan"
],

AZ: [
    "Absheron","Agdam","Agdash","Aghjabadi","Agstafa","Agsu","Astara",
    "Babek","Baku","Balakan","Barda","Beylagan","Bilasuvar","Dashkasan",
    "Fuzuli","Gadabay","Ganja","Goranboy","Goychay","Goygol","Hajigabul",
    "Imishli","Ismayilli","Jabrayil","Jalilabad","Julfa","Kalbajar",
    "Kurdamir","Lachin","Lankaran","Lerik","Masally","Mingachevir",
    "Nakhchivan","Neftchala","Oghuz","Qabala","Qakh","Qazakh","Quba",
    "Qubadli","Qusar","Saatli","Sabirabad","Salyan","Samukh","Shabran",
    "Shaki","Shamakhi","Shirvan","Shusha","Siazan","Tartar","Tovuz",
    "Ujar","Yardimli","Yevlakh","Zagatala","Zangilan","Zardab"
],

BH: [
    "Capital Governorate","Muharraq Governorate","Northern Governorate",
    "Southern Governorate"
],

BT: [
    "Bumthang","Chukha","Dagana","Gasa","Haa","Lhuentse","Mongar",
    "Paro","Pemagatshel","Punakha","Samdrup Jongkhar","Samtse","Sarpang",
    "Thimphu","Trashigang","Trashiyangtse","Trongsa","Tsirang","Wangdue Phodrang",
    "Zhemgang"
],

BN: [
    "Belait","Brunei-Muara","Temburong","Tutong"
],

KH: [
    "Banteay Meanchey","Battambang","Kampong Cham","Kampong Chhnang",
    "Kampong Speu","Kampong Thom","Kampot","Kandal","Kep","Koh Kong",
    "Kratié","Mondulkiri","Oddar Meanchey","Pailin","Phnom Penh",
    "Preah Sihanouk","Preah Vihear","Pursat","Siem Reap","Stung Treng",
    "Svay Rieng","Takeo","Tbong Khmum"
],

ID: [
    "Aceh","Bali","Bangka Belitung Islands","Banten","Bengkulu","Central Java",
    "Central Kalimantan","Central Sulawesi","East Java","East Kalimantan",
    "East Nusa Tenggara","Gorontalo","Jakarta","Jambi","Lampung","Maluku",
    "North Kalimantan","North Maluku","North Sulawesi","North Sumatra",
    "Papua","Riau","Riau Islands","South Kalimantan","South Sulawesi",
    "South Sumatra","Southeast Sulawesi","West Java","West Kalimantan",
    "West Nusa Tenggara","West Papua","West Sulawesi","West Sumatra",
    "Yogyakarta"
],

IR: [
    "Alborz","Ardabil","Bushehr","Chaharmahal and Bakhtiari","East Azerbaijan",
    "Fars","Gilan","Golestan","Hamadan","Hormozgan","Ilam","Isfahan",
    "Kerman","Kermanshah","Khuzestan","Kohgiluyeh and Boyer-Ahmad",
    "Kurdistan","Lorestan","Markazi","Mazandaran","North Khorasan",
    "Qazvin","Qom","Razavi Khorasan","Semnan","Sistan and Baluchestan",
    "South Khorasan","Tehran","West Azerbaijan","Yazd","Zanjan"
],

IQ: [
    "Al Anbar","Babil","Baghdad","Basra","Dhi Qar","Diyala","Duhok",
    "Erbil","Karbala","Kirkuk","Maysan","Muthanna","Najaf","Nineveh",
    "Qadisiyyah","Saladin","Sulaymaniyah","Wasit"
],

JO: [
    "Ajloun","Amman","Aqaba","Balqa","Irbid","Jerash","Karak","Ma'an",
    "Madaba","Mafraq","Tafilah","Zarqa"
],

KW: [
    "Ahmadi","Al Asimah","Farwaniya","Hawalli","Jahra","Mubarak Al-Kabeer"
],

LB: [
    "Akkar","Baalbek-Hermel","Beqaa","Beirut","Mount Lebanon",
    "Nabatieh","North Lebanon","South Lebanon"
],

OM: [
    "Ad Dhahirah","Al Batinah North","Al Batinah South","Al Buraimi",
    "Al Wusta","Ash Sharqiyah North","Ash Sharqiyah South","Dhofar",
    "Musandam","Muscat","Musandam","Al Dakhiliyah"
],

QA: [
    "Ad Dawhah","Al Daayen","Al Khor","Al Rayyan","Al Shamal",
    "Al Shahaniya","Al Wakrah","Umm Salal"
],

YE: [
    "Abyan","Aden","Amran","Al Bayda","Al Hudaydah","Al Jawf",
    "Al Mahrah","Al Mahwit","Dhamar","Hadhramaut","Hajjah","Ibb",
    "Lahij","Marib","Raymah","Saada","Sana'a","Shabwah","Socotra",
    "Taiz"
],

MY: [
    "Johor","Kedah","Kelantan","Malacca","Negeri Sembilan","Pahang",
    "Penang","Perak","Perlis","Sabah","Sarawak","Selangor","Terengganu",
    "Kuala Lumpur","Labuan","Putrajaya"
],

SG: [
    "Central Region","North Region","North-East Region","East Region",
    "West Region"
],

TH: [
    "Amnat Charoen","Ang Thong","Bangkok","Bueng Kan","Buriram",
    "Chachoengsao","Chai Nat","Chaiyaphum","Chanthaburi","Chiang Mai",
    "Chiang Rai","Chon Buri","Chumphon","Kalasin","Kamphaeng Phet",
    "Kanchanaburi","Khon Kaen","Krabi","Lampang","Lamphun","Loei",
    "Lopburi","Mae Hong Son","Maha Sarakham","Mukdahan","Nakhon Nayok",
    "Nakhon Pathom","Nakhon Phanom","Nakhon Ratchasima","Nakhon Sawan",
    "Nakhon Si Thammarat","Nan","Narathiwat","Nong Bua Lamphu","Nong Khai",
    "Nonthaburi","Pathum Thani","Pattani","Phang Nga","Phatthalung",
    "Phayao","Phetchabun","Phetchaburi","Phichit","Phitsanulok",
    "Phra Nakhon Si Ayutthaya","Phrae","Phuket","Prachin Buri",
    "Prachuap Khiri Khan","Ranong","Ratchaburi","Rayong","Roi Et",
    "Sa Kaeo","Sakon Nakhon","Samut Prakan","Samut Sakhon","Samut Songkhram",
    "Saraburi","Satun","Sing Buri","Sisaket","Songkhla","Sukhothai",
    "Suphan Buri","Surat Thani","Surin","Tak","Trang","Trat","Ubon Ratchathani",
    "Udon Thani","Uthai Thani","Uttaradit","Yala","Yasothon"
],

VN: [
    "An Giang","Ba Ria-Vung Tau","Bac Giang","Bac Kan","Bac Lieu",
    "Bac Ninh","Ben Tre","Binh Dinh","Binh Duong","Binh Phuoc",
    "Binh Thuan","Ca Mau","Cao Bang","Da Nang","Dak Lak","Dak Nong",
    "Dien Bien","Dong Nai","Dong Thap","Gia Lai","Ha Giang","Ha Nam",
    "Ha Tinh","Hai Duong","Hai Phong","Hanoi","Hau Giang","Hoa Binh",
    "Hung Yen","Khanh Hoa","Kien Giang","Kon Tum","Lai Chau","Lam Dong",
    "Lang Son","Lao Cai","Long An","Nam Dinh","Nghe An","Ninh Binh",
    "Ninh Thuan","Phu Tho","Phu Yen","Quang Binh","Quang Nam",
    "Quang Ngai","Quang Ninh","Quang Tri","Soc Trang","Son La",
    "Tay Ninh","Thai Binh","Thai Nguyen","Thanh Hoa","Thua Thien Hue",
    "Tien Giang","Tra Vinh","Tuyen Quang","Vinh Long","Vinh Phuc",
    "Yen Bai","Can Tho","Ho Chi Minh City"
],

PH: [
    "Abra","Agusan del Norte","Agusan del Sur","Aklan","Albay","Antique",
    "Apayao","Aurora","Basilan","Bataan","Batanes","Batangas","Benguet",
    "Biliran","Bohol","Bukidnon","Bulacan","Cagayan","Camarines Norte",
    "Camarines Sur","Camiguin","Capiz","Catanduanes","Cavite","Cebu",
    "Cotabato","Davao de Oro","Davao del Norte","Davao del Sur",
    "Davao Occidental","Davao Oriental","Dinagat Islands","Eastern Samar",
    "Guimaras","Ifugao","Ilocos Norte","Ilocos Sur","Iloilo","Isabela",
    "Kalinga","La Union","Laguna","Lanao del Norte","Lanao del Sur",
    "Leyte","Maguindanao","Marinduque","Masbate","Misamis Occidental",
    "Misamis Oriental","Mountain Province","Negros Occidental",
    "Negros Oriental","Northern Samar","Nueva Ecija","Nueva Vizcaya",
    "Occidental Mindoro","Oriental Mindoro","Palawan","Pampanga","Pangasinan",
    "Quezon","Quirino","Rizal","Romblon","Samar","Sarangani","Siquijor",
    "Sorsogon","South Cotabato","Southern Leyte","Sultan Kudarat","Sulu",
    "Surigao del Norte","Surigao del Sur","Tarlac","Tawi-Tawi","Zambales",
    "Zamboanga del Norte","Zamboanga del Sur","Zamboanga Sibugay",
    "Metro Manila"
],

LK: [
    "Central Province","Eastern Province","Northern Province",
    "North Central Province","North Western Province","Sabaragamuwa Province",
    "Southern Province","Uva Province","Western Province"
],

NP: [
    "Bagmati","Gandaki","Karnali","Koshi","Lumbini","Madhesh","Sudurpashchim"
],

MV: [
    "Alif Alif","Alif Dhaal","Baa","Dhaalu","Faafu","Gaafu Alif",
    "Gaafu Dhaalu","Gnaviyani","Haa Alif","Haa Dhaalu","Kaafu","Laamu",
    "Lhaviyani","Maale","Meemu","Noonu","Raa","Seenu","Shaviyani",
    "Thaa","Vaavu"
],

FJ: [
    "Ba","Bua","Cakaudrove","Kadavu","Lau","Lomaiviti","Macuata",
    "Nadroga-Navosa","Naitasiri","Namosi","Ra","Rewa","Serua","Tailevu"
],

PG: [
    "Central","Chimbu","Eastern Highlands","East New Britain","East Sepik",
    "Enga","Gulf","Hela","Jiwaka","Madang","Manus","Milne Bay",
    "Morobe","New Ireland","Northern","Southern Highlands","West New Britain",
    "Western","Western Highlands","West Sepik","National Capital District",
    "Bougainville"
],

NZ: [
    "Auckland","Bay of Plenty","Canterbury","Gisborne","Hawke's Bay",
    "Manawatū-Whanganui","Marlborough","Nelson","Northland","Otago",
    "Southland","Taranaki","Tasman","Waikato","Wellington","West Coast",
    "Chatham Islands"
],

/* ==========================================================
   BATCH 5 — FINAL 30 COUNTRIES
========================================================== */

US: [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
    "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
    "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
    "Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
    "New Mexico","New York","North Carolina","North Dakota","Ohio",
    "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
    "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia",
    "Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"
],

CA: [
    "Alberta","British Columbia","Manitoba","New Brunswick",
    "Newfoundland and Labrador","Northwest Territories","Nova Scotia",
    "Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan",
    "Yukon"
],

GB: [
    "England","Scotland","Wales","Northern Ireland"
],

AU: [
    "New South Wales","Queensland","South Australia","Tasmania",
    "Victoria","Western Australia","Australian Capital Territory",
    "Northern Territory"
],

NZ: [
    "Auckland","Bay of Plenty","Canterbury","Gisborne","Hawke's Bay",
    "Manawatū-Whanganui","Marlborough","Nelson","Northland","Otago",
    "Southland","Taranaki","Tasman","Waikato","Wellington","West Coast"
],

MX: [
    "Aguascalientes","Baja California","Baja California Sur","Campeche",
    "Chiapas","Chihuahua","Coahuila","Colima","Durango","Guanajuato",
    "Guerrero","Hidalgo","Jalisco","México","Mexico City","Michoacán",
    "Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro",
    "Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco",
    "Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"
],

CO: [
    "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá",
    "Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba",
    "Cundinamarca","Guainía","Guaviare","Huila","La Guajira","Magdalena",
    "Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda",
    "San Andrés and Providencia","Santander","Sucre","Tolima","Valle del Cauca",
    "Vaupés","Vichada","Bogotá D.C."
],

PE: [
    "Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca",
    "Callao","Cusco","Huancavelica","Huánuco","Ica","Junín","La Libertad",
    "Lambayeque","Lima","Loreto","Madre de Dios","Moquegua","Pasco",
    "Piura","Puno","San Martín","Tacna","Tumbes","Ucayali"
],

CL: [
    "Arica and Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo",
    "Valparaíso","Santiago Metropolitan","O'Higgins","Maule","Ñuble",
    "Biobío","Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes"
],

EC: [
    "Azuay","Bolívar","Cañar","Carchi","Chimborazo","Cotopaxi",
    "El Oro","Esmeraldas","Galápagos","Guayas","Imbabura","Loja",
    "Los Ríos","Manabí","Morona-Santiago","Napo","Orellana","Pastaza",
    "Pichincha","Santa Elena","Santo Domingo de los Tsáchilas","Sucumbíos",
    "Tungurahua","Zamora-Chinchipe"
],

BO: [
    "Beni","Chuquisaca","Cochabamba","La Paz","Oruro","Pando",
    "Potosí","Santa Cruz","Tarija"
],

PY: [
    "Alto Paraguay","Alto Paraná","Amambay","Asunción","Boquerón",
    "Caaguazú","Caazapá","Canindeyú","Central","Concepción","Cordillera",
    "Guairá","Itapúa","Misiones","Ñeembucú","Paraguarí","Presidente Hayes",
    "San Pedro"
],

UY: [
    "Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores",
    "Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro",
    "Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres"
],

CR: [
    "Alajuela","Cartago","Guanacaste","Heredia","Limón","Puntarenas",
    "San José"
],

PA: [
    "Bocas del Toro","Chiriquí","Coclé","Colón","Darién","Emberá-Wounaan",
    "Guna Yala","Herrera","Los Santos","Ngäbe-Buglé","Panamá",
    "Panamá Oeste","Veraguas"
],

GT: [
    "Alta Verapaz","Baja Verapaz","Chimaltenango","Chiquimula","El Progreso",
    "Escuintla","Guatemala","Huehuetenango","Izabal","Jalapa","Jutiapa",
    "Petén","Quetzaltenango","Quiché","Retalhuleu","Sacatepéquez",
    "San Marcos","Santa Rosa","Sololá","Suchitepéquez","Totonicapán",
    "Zacapa"
],

HN: [
    "Atlántida","Choluteca","Colón","Comayagua","Copán","Cortés",
    "El Paraíso","Francisco Morazán","Gracias a Dios","Intibucá",
    "Islas de la Bahía","La Paz","Lempira","Ocotepeque","Olancho",
    "Santa Bárbara","Valle","Yoro"
],

SV: [
    "Ahuachapán","Cabañas","Chalatenango","Cuscatlán","La Libertad",
    "La Paz","La Unión","Morazán","San Miguel","San Salvador",
    "San Vicente","Santa Ana","Sonsonate","Usulután"
],

NI: [
    "Boaco","Carazo","Chinandega","Chontales","Estelí","Granada",
    "Jinotega","León","Madriz","Managua","Masaya","Matagalpa",
    "Nueva Segovia","Río San Juan","Rivas","North Caribbean Coast",
    "South Caribbean Coast"
],

DO: [
    "Azua","Baoruco","Barahona","Dajabón","Distrito Nacional","Duarte",
    "Elías Piña","El Seibo","Espaillat","Hato Mayor","Hermanas Mirabal",
    "Independencia","La Altagracia","La Romana","La Vega","María Trinidad Sánchez",
    "Monseñor Nouel","Monte Cristi","Monte Plata","Pedernales","Peravia",
    "Puerto Plata","Samaná","San Cristóbal","San José de Ocoa","San Juan",
    "San Pedro de Macorís","Sánchez Ramírez","Santiago","Santiago Rodríguez",
    "Santo Domingo","Valverde"
],

JM: [
    "Clarendon","Hanover","Kingston","Manchester","Portland","Saint Andrew",
    "Saint Ann","Saint Catherine","Saint Elizabeth","Saint James",
    "Saint Mary","Saint Thomas","Trelawny","Westmoreland"
],

HT: [
    "Artibonite","Centre","Grand'Anse","Nippes","Nord","Nord-Est",
    "Nord-Ouest","Ouest","Sud","Sud-Est"
],

CU: [
    "Artemisa","Camagüey","Ciego de Ávila","Cienfuegos","Granma",
    "Guantánamo","Holguín","Isla de la Juventud","La Habana","Las Tunas",
    "Matanzas","Mayabeque","Pinar del Río","Sancti Spíritus","Santiago de Cuba",
    "Villa Clara"
],

TT: [
    "Arima","Chaguanas","Couva-Tabaquite-Talparo","Diego Martin",
    "Eastern Tobago","Penal-Debe","Point Fortin","Port of Spain",
    "Princes Town","Rio Claro-Mayaro","San Fernando","San Juan-Laventille",
    "Sangre Grande","Siparia","Tunapuna-Piarco","Western Tobago"
],

BB: [
    "Christ Church","Saint Andrew","Saint George","Saint James",
    "Saint John","Saint Joseph","Saint Lucy","Saint Michael",
    "Saint Peter","Saint Philip","Saint Thomas"
],

BS: [
    "Acklins","Berry Islands","Bimini","Black Point","Cat Island",
    "Central Abaco","Central Andros","Central Eleuthera","City of Freeport",
    "Crooked Island and Long Cay","East Grand Bahama","Exuma","Grand Cay",
    "Harbour Island","Inagua","Long Island","Mangrove Cay","Mayaguana",
    "New Providence","North Abaco","North Andros","North Eleuthera",
    "Ragged Island","Rum Cay","San Salvador","South Abaco","South Andros",
    "South Eleuthera","Spanish Wells","West Grand Bahama"
],

BZ: [
    "Belize","Cayo","Corozal","Orange Walk","Stann Creek","Toledo"
],

GY: [
    "Barima-Waini","Cuyuni-Mazaruni","Demerara-Mahaica","East Berbice-Corentyne",
    "Essequibo Islands-West Demerara","Mahaica-Berbice","Pomeroon-Supenaam",
    "Potaro-Siparuni","Upper Demerara-Upper Berbice","Upper Takutu-Upper Essequibo"
],

SR: [
    "Brokopondo","Commewijne","Coronie","Marowijne","Nickerie",
    "Para","Paramaribo","Saramacca","Sipaliwini","Wanica"
],

BB_EXTRA: [
    "Bridgetown"
],

MT: [
    "Central Region","Gozo and Comino","Northern Region","South Eastern Region",
    "Southern Region","Western Region","Northern Harbour","South Eastern Harbour",
    "Southern Harbour"
],

CY: [
    "Famagusta","Kyrenia","Larnaca","Limassol","Nicosia","Paphos"
],

AG: [
    "Saint John",
    "Saint Mary",
    "Saint Paul",
    "Saint Peter",
    "Saint Philip",
    "Saint George",
    "Barbuda",
    "Redonda"
],

PW: [
    "Aimeliik",
    "Airai",
    "Angaur",
    "Hatohobei",
    "Kayangel",
    "Koror",
    "Melekeok",
    "Ngaraard",
    "Ngarchelong",
    "Ngardmau",
    "Ngatpang",
    "Ngchesar",
    "Ngeremlengui",
    "Ngiwal",
    "Peleliu",
    "Sonsorol"
],

KI: [
    "Abaiang",
    "Abemama",
    "Aranuka",
    "Arorae",
    "Banaba",
    "Beru",
    "Butaritari",
    "Kanton",
    "Kiritimati",
    "Kuria",
    "Maiana",
    "Makin",
    "Marakei",
    "Nikunau",
    "Nonouti",
    "Onotoa",
    "Tabiteuea",
    "Tabuaeran",
    "Tamana",
    "Tarawa",
    "Teraina"
],

LA: [
    "Attapeu",
    "Bokeo",
    "Bolikhamxay",
    "Champasak",
    "Houaphanh",
    "Khammouane",
    "Luang Namtha",
    "Luang Prabang",
    "Oudomxay",
    "Phongsaly",
    "Salavan",
    "Savannakhet",
    "Sekong",
    "Vientiane Province",
    "Vientiane Prefecture",
    "Xaisomboun",
    "Xayabouly",
    "Xiangkhouang"
],

GD: [
    "Saint Andrew",
    "Saint David",
    "Saint George",
    "Saint John",
    "Saint Mark",
    "Saint Patrick",
    "Carriacou",
    "Petite Martinique"
],

AD: [
    "Andorra la Vella",
    "Canillo",
    "Encamp",
    "Escaldes-Engordany",
    "La Massana",
    "Ordino",
    "Sant Julià de Lòria"
],

KG: [
    "Batken",
    "Chüy",
    "Issyk-Kul",
    "Jalal-Abad",
    "Naryn",
    "Osh",
    "Talas",
    "Bishkek",
    "Osh City"
],

MM: [
    "Ayeyarwady",
    "Bago",
    "Chin",
    "Kachin",
    "Kayah",
    "Kayin",
    "Magway",
    "Mandalay",
    "Mon",
    "Naypyidaw",
    "Rakhine",
    "Sagaing",
    "Shan",
    "Tanintharyi",
    "Yangon"
],

FM: [
    "Chuuk",
    "Kosrae",
    "Pohnpei",
    "Yap"
],

SZ: [
    "Hhohho",
    "Lubombo",
    "Manzini",
    "Shiselweni"
],

ST: [
    "Água Grande",
    "Mé-Zóchi",
    "Cantagalo",
    "Lobata",
    "Lembá",
    "Caué",
    "Príncipe"
],

KN: [
    "Christ Church Nichola Town",
    "Saint Anne Sandy Point",
    "Saint George Basseterre",
    "Saint George Gingerland",
    "Saint James Windward",
    "Saint John Capisterre",
    "Saint John Figtree",
    "Saint Mary Cayon",
    "Saint Paul Capisterre",
    "Saint Paul Charlestown",
    "Saint Peter Basseterre",
    "Saint Thomas Middle Island",
    "Saint Thomas Lowland",
    "Trinity Palmetto Point"
],

MN: [
    "Arkhangai",
    "Bayan-Ölgii",
    "Bayankhongor",
    "Bulgan",
    "Darkhan-Uul",
    "Dornod",
    "Dornogovi",
    "Dundgovi",
    "Govi-Altai",
    "Govisümber",
    "Khentii",
    "Khovd",
    "Khövsgöl",
    "Ömnögovi",
    "Orkhon",
    "Övörkhangai",
    "Selenge",
    "Sükhbaatar",
    "Töv",
    "Uvs",
    "Zavkhan",
    "Ulaanbaatar"
],

UZ: [
    "Andijan",
    "Bukhara",
    "Fergana",
    "Jizzakh",
    "Karakalpakstan",
    "Namangan",
    "Navoiy",
    "Qashqadaryo",
    "Samarkand",
    "Sirdaryo",
    "Surxondaryo",
    "Tashkent",
    "Tashkent City",
    "Xorazm"
],

VU: [
    "Malampa",
    "Penama",
    "Sanma",
    "Shefa",
    "Tafea",
    "Torba"
],

LC: [
    "Anse la Raye",
    "Canaries",
    "Castries",
    "Choiseul",
    "Dennery",
    "Gros Islet",
    "Laborie",
    "Micoud",
    "Soufrière",
    "Vieux Fort"
],

TW: [
    "Changhua",
    "Chiayi",
    "Hsinchu",
    "Hualien",
    "Kaohsiung",
    "Keelung",
    "Kinmen",
    "Lienchiang",
    "Miaoli",
    "Nantou",
    "New Taipei",
    "Penghu",
    "Pingtung",
    "Taichung",
    "Tainan",
    "Taipei",
    "Taitung",
    "Taoyuan",
    "Yilan",
    "Yunlin"
],

TO: [
    "Eua",
    "Ha'apai",
    "Niuas",
    "Tongatapu",
    "Vava'u"
],

MH: [
    "Ailinglaplap",
    "Ailuk",
    "Arno",
    "Aur",
    "Bikini",
    "Ebon",
    "Enewetak",
    "Jabat",
    "Jaluit",
    "Kili",
    "Kwajalein",
    "Lae",
    "Lib",
    "Likiep",
    "Majuro",
    "Maloelap",
    "Mejit",
    "Mili",
    "Namdrik",
    "Namu",
    "Rongelap",
    "Ujae",
    "Ujelang",
    "Utirik",
    "Wotho",
    "Wotje"
]
    
    };


    /* ======================================================
       SELECTED COUNTRY
    ====================================================== */

    const regions =
        countryRegions[countryCode];


    /* ======================================================
       COUNTRY NOT SELECTED
    ====================================================== */

    if (!countryCode) {

        addPlaceholder(
            regionElement,
            "Select country first"
        );

        return;

    }


    /* ======================================================
       COUNTRY WITH REGIONS
    ====================================================== */

    if (
        Array.isArray(regions) &&
        regions.length
    ) {

        addPlaceholder(
            regionElement,
            "Select region / state"
        );


        regions.forEach(
            region => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    region;

                option.textContent =
                    region;


                regionElement.appendChild(
                    option
                );

            }
        );


        return;

    }


    /* ======================================================
       OTHER COUNTRIES
    ====================================================== */

    addPlaceholder(
        regionElement,
        "Select / enter region"
    );


    const option =
        document.createElement(
            "option"
        );


    option.value =
        "Other";

    option.textContent =
        "Other / Not Listed";


    regionElement.appendChild(
        option
    );

}



/* ==========================================================
   ADD SELECT PLACEHOLDER
========================================================== */

function addPlaceholder(
    select,
    text
) {

    const option =
        document.createElement(
            "option"
        );


    option.value =
        "";


    option.textContent =
        text;


    select.appendChild(
        option
    );

}



/* ==========================================================
   VARIATIONS
========================================================== */

function initializeVariations() {

    const button =
        document.getElementById(
            "addVariationButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        addVariation
    );

}



/* ==========================================================
   ADD VARIATION
========================================================== */

function addVariation() {

    const container =
        document.getElementById(
            "productVariations"
        );


    if (!container) {

        return;

    }


    variationCounter++;


    const id =
        variationCounter;


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "variation-card";


    card.dataset.variationId =
        id;


    card.innerHTML = `

        <div class="variation-top">

            <div class="variation-title">

                Variation ${id}

            </div>


            <button
                type="button"
                class="remove-variation"
            >

                Remove

            </button>

        </div>


        <div class="variation-grid">


            <!-- ==========================================
                 TYPE
            =========================================== -->

            <div class="form-group">

                <label>
                    Variation Type
                </label>

                <input
                    type="text"
                    class="variation-name"
                    placeholder="e.g. Color"
                >

            </div>


            <!-- ==========================================
                 VALUE
            =========================================== -->

            <div class="form-group">

                <label>
                    Variation Value
                </label>

                <input
                    type="text"
                    class="variation-value"
                    placeholder="e.g. Black"
                >

            </div>


            <!-- ==========================================
                 PRICE
            =========================================== -->

            <div class="form-group">

                <label>
                    Variation Price
                </label>

                <div class="input-prefix">

                    <span>
                        $
                    </span>

                    <input
                        type="number"
                        class="variation-price"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    >

                </div>

            </div>


            <!-- ==========================================
                 STOCK
            =========================================== -->

            <div class="form-group">

                <label>
                    Variation Stock
                </label>

                <input
                    type="number"
                    class="variation-stock"
                    min="0"
                    step="1"
                    placeholder="e.g. 10"
                >

            </div>


            <!-- ==========================================
                 IMAGE
            =========================================== -->

            <div class="form-group full">

                <label>
                    Variation Image
                </label>


                <label
                    class="variation-image-label"
                >

                    <input
                        type="file"
                        class="variation-image-input"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                    >


                    <div
                        class="variation-image-content"
                    >

                        <div
                            class="variation-image-text"
                        >

                            📷 Add Variation Image

                            <br>

                            <small>
                                JPG, PNG or WEBP
                            </small>

                        </div>

                    </div>

                </label>

            </div>


        </div>

    `;


    container.appendChild(
        card
    );


    initializeVariationImage(
        card
    );


    const removeButton =
        card.querySelector(
            ".remove-variation"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            () => {

                card.remove();

                renumberVariations();

            }
        );

    }

}



/* ==========================================================
   VARIATION IMAGE PREVIEW
========================================================== */

function initializeVariationImage(
    card
) {

    const input =
        card.querySelector(
            ".variation-image-input"
        );


    const content =
        card.querySelector(
            ".variation-image-content"
        );


    if (
        !input ||
        !content
    ) {

        return;

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files?.[0];


            if (!file) {

                return;

            }


            if (
                !isValidImage(file)
            ) {

                input.value = "";


                showUploadStatus(
                    "Please select a valid variation image.",
                    "error"
                );


                return;

            }


            const imageURL =
                URL.createObjectURL(
                    file
                );


            content.innerHTML = `

                <img
                    src="${imageURL}"
                    alt="Variation image"
                >

            `;

        }
    );

}



/* ==========================================================
   RENUMBER VARIATIONS
========================================================== */

function renumberVariations() {

    const cards =
        document.querySelectorAll(
            ".variation-card"
        );


    cards.forEach(
        (card, index) => {

            const title =
                card.querySelector(
                    ".variation-title"
                );


            if (title) {

                title.textContent =
                    `Variation ${index + 1}`;

            }

        }
    );

}



/* ==========================================================
   FORM
========================================================== */

function initializeForm() {

    const form =
        document.getElementById(
            "productUploadForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        handleProductSubmit
    );

}



/* ==========================================================
   SUBMIT PRODUCT
========================================================== */

async function handleProductSubmit(
    event
) {

    event.preventDefault();


    if (
        !pageReady ||
        !currentSeller
    ) {

        showUploadStatus(
            "Seller authentication is not ready.",
            "error"
        );


        return;

    }


    const publishButton =
        document.getElementById(
            "publishProductButton"
        );


    try {

        setButtonLoading(
            publishButton,
            true
        );


        showUploadStatus(
            "Checking your product information...",
            "loading"
        );


        /*
           Make sure the user is still
           authenticated.
        */

        if (
            !auth.currentUser
        ) {

            throw new Error(
                "Your session has expired. Please log in again."
            );

        }


        /*
           Get product data.
        */

        const product =
            collectProductData();


        /*
           Validate.
        */

        validateProduct(
            product
        );


       
        /* ==================================================
           MAIN IMAGE
        ================================================== */

        showUploadStatus(
            "Uploading main product image...",
            "loading"
        );


        const mainImageInput =
            document.getElementById(
                "mainProductImage"
            );


        const mainImageFile =
            mainImageInput?.files?.[0];


        if (!mainImageFile) {

            throw new Error(
                "Please select a main product image."
            );

        }


        const mainImageURL =
            await uploadToCloudinary(
                mainImageFile
            );


        /* ==================================================
           VARIATION IMAGES
        ================================================== */

        showUploadStatus(
            "Preparing product variations...",
            "loading"
        );


        const uploadedVariations =
            await uploadVariationImages(
                product.variations
            );


        /* ==================================================
           FINAL FIRESTORE DATA
        ================================================== */

        const productDocument = {

            /*
               Seller
            */

            sellerId:
                currentSeller.uid,

            sellerEmail:
                currentSeller.email || "",

            sellerName:
                sellerData?.name || "",


            /*
               Product
            */

            productName:
                product.productName,

            category:
                product.category,

            condition:
                product.condition,

            description:
                product.description,


            /*
               Price
            */

            price:
                product.price,

            stock:
                product.stock,

            sku:
                product.sku,

            weight:
                product.weight,


            /*
               Images
            */

            mainImage:
                mainImageURL,

            images: [
                mainImageURL
            ],


            /*
               Variations
            */

            variations:
                uploadedVariations,


            /*
               Location
            */

            location: {

                country:
                    product.country,

                region:
                    product.region,

                city:
                    product.city,

                area:
                    product.area

            },


            /*
               Contact
            */

            contact: {

                phone1:
                    product.phone1,

                phone2:
                    product.phone2,

                whatsapp:
                    product.whatsapp,

                telegram:
                    product.telegram

            },


            /*
               Delivery
            */

            delivery: {

                type:
                    product.deliveryType,

                time:
                    product.deliveryTime

            },


            /*
               Product status
            */

            status:
                "active",

            approved:
                false,

            featured:
                false,


            /*
               Statistics
            */

            views:
                0,

            likes:
                0,

            sales:
                0,


            /*
               Seller information
            */

            sellerRole:
                "seller",

            sellerEmailVerified:
                currentSeller.emailVerified === true,


            /*
               Timestamps
            */

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()

        };


        /* ==================================================
           SAVE PRODUCT
        ================================================== */

        showUploadStatus(
            "Saving your product...",
            "loading"
        );


        const productsCollection =
            collection(
                db,
                "products"
            );


        const productReference =
            await addDoc(
                productsCollection,
                productDocument
            );


        console.log(
            "Product successfully created:",
            productReference.id
        );


        /* ==================================================
           SUCCESS
        ================================================== */

        showUploadStatus(
            "Product published successfully ✓",
            "success"
        );


        /*
           Prevent accidental second submission.
        */

        const form =
            document.getElementById(
                "productUploadForm"
            );


        if (form) {

            form.reset();

        }


        /*
           Redirect after a short delay.
        */

        setTimeout(
            () => {

                window.location.href =
                    `product.html?id=${encodeURIComponent(
                        productReference.id
                    )}`;

            },
            1000
        );


    } catch (error) {

        console.error(
            "Product publishing error:",
            error
        );


        showUploadStatus(
            getUploadErrorMessage(
                error
            ),
            "error"
        );


    } finally {

        setButtonLoading(
            publishButton,
            false
        );

    }

}



/* ==========================================================
   COLLECT PRODUCT DATA
========================================================== */

function collectProductData() {

    return {

        productName:
            getValue(
                "productName"
            ),

        category:
            getValue(
                "category"
            ),

        condition:
            getValue(
                "condition"
            ),

        description:
            getValue(
                "description"
            ),


        price:
            getNumber(
                "price"
            ),

        stock:
            getInteger(
                "stock"
            ),

        sku:
            getValue(
                "sku"
            ),

        weight:
            getNumber(
                "weight"
            ),


        country:
            getValue(
                "country"
            ),

        region:
            getValue(
                "region"
            ),

        city:
            getValue(
                "city"
            ),

        area:
            getValue(
                "area"
            ),


        phone1:
            getValue(
                "phone1"
            ),

        phone2:
            getValue(
                "phone2"
            ),

        whatsapp:
            getValue(
                "whatsapp"
            ),

        telegram:
            getValue(
                "telegram"
            ),


        deliveryType:
            getValue(
                "deliveryType"
            ),

        deliveryTime:
            getValue(
                "deliveryTime"
            ),


        variations:
            collectVariations()

    };

}



/* ==========================================================
   COLLECT VARIATIONS
========================================================== */

function collectVariations() {

    const cards =
        document.querySelectorAll(
            ".variation-card"
        );


    const variations = [];


    cards.forEach(
        card => {

            const name =
                card.querySelector(
                    ".variation-name"
                )?.value?.trim() || "";


            const value =
                card.querySelector(
                    ".variation-value"
                )?.value?.trim() || "";


            const price =
                Number(
                    card.querySelector(
                        ".variation-price"
                    )?.value || 0
                );


            const stock =
                Number(
                    card.querySelector(
                        ".variation-stock"
                    )?.value || 0
                );


            const imageInput =
                card.querySelector(
                    ".variation-image-input"
                );


            variations.push({

                name,

                value,

                price,

                stock,

                imageFile:
                    imageInput?.files?.[0] || null

            });

        }
    );


    return variations;

}



/* ==========================================================
   UPLOAD VARIATION IMAGES
   ONE FILE AT A TIME
========================================================== */

async function uploadVariationImages(
    variations
) {

    const result = [];


    for (
        let index = 0;
        index < variations.length;
        index++
    ) {

        const variation =
            variations[index];


        let imageURL =
            "";


        /*
           Each variation has its own
           individual Cloudinary upload.
        */

        if (
            variation.imageFile
        ) {

            showUploadStatus(
                `Uploading variation ${index + 1} image...`,
                "loading"
            );


            imageURL =
                await uploadToCloudinary(
                    variation.imageFile
                );

        }


        result.push({

            name:
                variation.name,

            value:
                variation.value,

            price:
                variation.price,

            stock:
                variation.stock,

            image:
                imageURL

        });

    }


    return result;

}



/* ==========================================================
   VALIDATE PRODUCT
========================================================== */

function validateProduct(
    product
) {

    if (
        !product.productName
    ) {

        throw new Error(
            "Please enter the product name."
        );

    }


    if (
        product.productName.length < 2
    ) {

        throw new Error(
            "Product name is too short."
        );

    }


    if (
        !product.category
    ) {

        throw new Error(
            "Please select a product category."
        );

    }


    if (
        !product.condition
    ) {

        throw new Error(
            "Please select the product condition."
        );

    }


    if (
        !product.description
    ) {

        throw new Error(
            "Please enter a product description."
        );

    }


    if (
        product.description.length < 10
    ) {

        throw new Error(
            "Please provide a more detailed product description."
        );

    }


    if (
        !Number.isFinite(
            product.price
        ) ||
        product.price <= 0
    ) {

        throw new Error(
            "Please enter a valid product price."
        );

    }


    if (
        !Number.isInteger(
            product.stock
        ) ||
        product.stock < 1
    ) {

        throw new Error(
            "Please enter valid available stock."
        );

    }


    if (
        !product.country
    ) {

        throw new Error(
            "Please select the product country."
        );

    }


    if (
        !product.region
    ) {

        throw new Error(
            "Please select the state or region."
        );

    }


    if (
        !product.city
    ) {

        throw new Error(
            "Please enter the product city."
        );

    }


    /*
       EXACTLY TWO PHONE NUMBERS
    */

    if (
        !product.phone1
    ) {

        throw new Error(
            "Phone number 1 is required."
        );

    }


    if (
        !product.phone2
    ) {

        throw new Error(
            "Phone number 2 is required."
        );

    }


    if (
        product.phone1 ===
        product.phone2
    ) {

        throw new Error(
            "Phone number 1 and phone number 2 must be different."
        );

    }


    /*
       Check phone numbers.
    */

    if (
        !isValidPhone(
            product.phone1
        )
    ) {

        throw new Error(
            "Please enter a valid phone number 1."
        );

    }


    if (
        !isValidPhone(
            product.phone2
        )
    ) {

        throw new Error(
            "Please enter a valid phone number 2."
        );

    }


    /*
       Agreement
    */

    const agreement =
        document.getElementById(
            "sellerAgreement"
        );


    if (
        !agreement?.checked
    ) {

        throw new Error(
            "Please confirm that your product information is accurate."
        );

    }


    /*
       Main image
    */

    const mainImage =
        document.getElementById(
            "mainProductImage"
        )?.files?.[0];


    if (!mainImage) {

        throw new Error(
            "Please select the main product image."
        );

    }


    /*
       Variations
    */

    product.variations.forEach(
        (variation, index) => {

            const number =
                index + 1;


            if (
                !variation.name
            ) {

                throw new Error(
                    `Please enter the variation type for variation ${number}.`
                );

            }


            if (
                !variation.value
            ) {

                throw new Error(
                    `Please enter the variation value for variation ${number}.`
                );

            }


            if (
                !Number.isFinite(
                    variation.price
                ) ||
                variation.price <= 0
            ) {

                throw new Error(
                    `Please enter a valid price for variation ${number}.`
                );

            }


            if (
                !Number.isInteger(
                    variation.stock
                ) ||
                variation.stock < 0
            ) {

                throw new Error(
                    `Please enter valid stock for variation ${number}.`
                );

            }

        }
    );

}



/* ==========================================================
   VALIDATE IMAGE
========================================================== */

function isValidImage(
    file
) {

    if (!file) {

        return false;

    }


    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/webp"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        return false;

    }


    /*
       10 MB maximum
    */

    const maxSize =
        10 * 1024 * 1024;


    if (
        file.size >
        maxSize
    ) {

        return false;

    }


    return true;

}



/* ==========================================================
   PHONE VALIDATION
========================================================== */

function isValidPhone(
    phone
) {

    const digits =
        phone.replace(
            /\D/g,
            ""
        );


    /*
       Basic international phone
       validation.

       7–15 digits.
    */

    return (
        digits.length >= 7 &&
        digits.length <= 15
    );

}



/* ==========================================================
   GET VALUE
========================================================== */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return (
        element.value ||
        ""
    ).trim();

}



/* ==========================================================
   GET NUMBER
========================================================== */

function getNumber(
    id
) {

    const value =
        getValue(
            id
        );


    if (!value) {

        return 0;

    }


    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? number
        : 0;

}



/* ==========================================================
   GET INTEGER
========================================================== */

function getInteger(
    id
) {

    const value =
        getValue(
            id
        );


    if (!value) {

        return 0;

    }


    const number =
        Number(
            value
        );


    return Number.isInteger(
        number
    )
        ? number
        : 0;

}



/* ==========================================================
   BUTTON LOADING
========================================================== */

function setButtonLoading(
    button,
    loading
) {

    if (!button) {

        return;

    }


    button.disabled =
        loading;


    const span =
        button.querySelector(
            "span"
        );


    if (!span) {

        return;

    }


    if (loading) {

        span.textContent =
            "Uploading Product...";

    } else {

        span.textContent =
            "Publish Product";

    }

}



/* ==========================================================
   STATUS
========================================================== */

function showUploadStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "uploadStatus"
        );


    if (!status) {

        return;

    }


    status.textContent =
        message;


    status.dataset.status =
        type || "loading";


    if (
        type === "error"
    ) {

        status.style.color =
            "#dc2626";

    } else if (
        type === "success"
    ) {

        status.style.color =
            "#15803d";

    } else {

        status.style.color =
            "#475569";

    }

}



/* ==========================================================
   SELLER PROTECTION MESSAGE
========================================================== */

function updateProtectionMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "sellerProtectionMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.dataset.status =
        type || "loading";


    if (
        type === "success"
    ) {

        element.style.background =
            "#ecfdf3";

        element.style.color =
            "#15803d";

    } else if (
        type === "error"
    ) {

        element.style.background =
            "#fef2f2";

        element.style.color =
            "#dc2626";

    }

}



/* ==========================================================
   LOADER
========================================================== */

function showLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (loader) {

        loader.style.display =
            "flex";

    }

}



/* ==========================================================
   HIDE LOADER
========================================================== */

function hideLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (loader) {

        loader.style.display =
            "none";

    }

}




/* ==========================================================
   ERROR MESSAGE
========================================================== */

function getUploadErrorMessage(
    error
) {

    if (!error) {

        return "Something went wrong.";

    }


    const code =
        error.code || "";


    /*
       Firebase permission errors
    */

    if (
        code ===
        "permission-denied"
    ) {

        return (
            "You do not have permission to publish products."
        );

    }


    /*
       Network errors
    */

    if (
        code ===
        "unavailable"
    ) {

        return (
            "Network connection problem. Please try again."
        );

    }


    /*
       Cloudinary errors
    */

    if (
        error.message &&
        error.message.toLowerCase().includes(
            "cloudinary"
        )
    ) {

        return error.message;

    }


    return (
        error.message ||
        "Unable to publish product."
    );

}



/* ==========================================================
   EXPORT
========================================================== */

export {

    initializeSellerUpload,

    addVariation,

    collectVariations,

    collectProductData

};
