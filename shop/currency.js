/* ==========================================================
   NEOSTORE GLOBAL CURRENCY SYSTEM
   currency.js
========================================================== */


/* ==========================================================
   STORAGE KEYS
========================================================== */

const CURRENCY_STORAGE_KEY =
    "neostore_currency";

const COUNTRY_STORAGE_KEY =
    "neostore_country";


/* ==========================================================
   DEFAULT CURRENCY
========================================================== */

const DEFAULT_CURRENCY =
    "NGN";


/* ==========================================================
   COUNTRY → CURRENCY
========================================================== */

const countryCurrencyMap = {

    NG: {
        currency: "NGN",
        symbol: "₦",
        name: "Nigerian Naira"
    },

    GH: {
        currency: "GHS",
        symbol: "GH₵",
        name: "Ghanaian Cedi"
    },

    KE: {
        currency: "KES",
        symbol: "KSh",
        name: "Kenyan Shilling"
    },

    ZA: {
        currency: "ZAR",
        symbol: "R",
        name: "South African Rand"
    },

    US: {
        currency: "USD",
        symbol: "$",
        name: "US Dollar"
    },

    CA: {
        currency: "CAD",
        symbol: "C$",
        name: "Canadian Dollar"
    },

    GB: {
        currency: "GBP",
        symbol: "£",
        name: "British Pound"
    },

    AU: {
        currency: "AUD",
        symbol: "A$",
        name: "Australian Dollar"
    },

    IN: {
        currency: "INR",
        symbol: "₹",
        name: "Indian Rupee"
    },

    PK: {
        currency: "PKR",
        symbol: "₨",
        name: "Pakistani Rupee"
    },

    BD: {
        currency: "BDT",
        symbol: "৳",
        name: "Bangladeshi Taka"
    },

    BR: {
        currency: "BRL",
        symbol: "R$",
        name: "Brazilian Real"
    },

    MX: {
        currency: "MXN",
        symbol: "MX$",
        name: "Mexican Peso"
    },

    AR: {
        currency: "ARS",
        symbol: "ARS$",
        name: "Argentine Peso"
    },

    DE: {
        currency: "EUR",
        symbol: "€",
        name: "Euro"
    },

    FR: {
        currency: "EUR",
        symbol: "€",
        name: "Euro"
    },

    IT: {
        currency: "EUR",
        symbol: "€",
        name: "Euro"
    },

    ES: {
        currency: "EUR",
        symbol: "€",
        name: "Euro"
    },

    JP: {
        currency: "JPY",
        symbol: "¥",
        name: "Japanese Yen"
    },

    CN: {
        currency: "CNY",
        symbol: "¥",
        name: "Chinese Yuan"
    },

    AE: {
        currency: "AED",
        symbol: "د.إ",
        name: "UAE Dirham"
    },

    SA: {
        currency: "SAR",
        symbol: "﷼",
        name: "Saudi Riyal"
    },

    EG: {
        currency: "EGP",
        symbol: "E£",
        name: "Egyptian Pound"
    },

    TR: {
        currency: "TRY",
        symbol: "₺",
        name: "Turkish Lira"
    }

};


/* ==========================================================
   FALLBACK CURRENCY INFORMATION
========================================================== */

const currencyInformation = {

    NGN: {
        symbol: "₦",
        name: "Nigerian Naira"
    },

    USD: {
        symbol: "$",
        name: "US Dollar"
    },

    GHS: {
        symbol: "GH₵",
        name: "Ghanaian Cedi"
    },

    KES: {
        symbol: "KSh",
        name: "Kenyan Shilling"
    },

    ZAR: {
        symbol: "R",
        name: "South African Rand"
    },

    CAD: {
        symbol: "C$",
        name: "Canadian Dollar"
    },

    GBP: {
        symbol: "£",
        name: "British Pound"
    },

    AUD: {
        symbol: "A$",
        name: "Australian Dollar"
    },

    INR: {
        symbol: "₹",
        name: "Indian Rupee"
    },

    PKR: {
        symbol: "₨",
        name: "Pakistani Rupee"
    },

    BDT: {
        symbol: "৳",
        name: "Bangladeshi Taka"
    },

    BRL: {
        symbol: "R$",
        name: "Brazilian Real"
    },

    MXN: {
        symbol: "MX$",
        name: "Mexican Peso"
    },

    ARS: {
        symbol: "ARS$",
        name: "Argentine Peso"
    },

    EUR: {
        symbol: "€",
        name: "Euro"
    },

    JPY: {
        symbol: "¥",
        name: "Japanese Yen"
    },

    CNY: {
        symbol: "¥",
        name: "Chinese Yuan"
    },

    AED: {
        symbol: "د.إ",
        name: "UAE Dirham"
    },

    SAR: {
        symbol: "﷼",
        name: "Saudi Riyal"
    },

    EGP: {
        symbol: "E£",
        name: "Egyptian Pound"
    },

    TRY: {
        symbol: "₺",
        name: "Turkish Lira"
    }

};


/* ==========================================================
   GET SAVED COUNTRY
========================================================== */

function getSavedCountry() {

    return (
        localStorage.getItem(
            COUNTRY_STORAGE_KEY
        ) || "NG"
    );

}


/* ==========================================================
   GET SAVED CURRENCY
========================================================== */

function getSavedCurrency() {

    return (
        localStorage.getItem(
            CURRENCY_STORAGE_KEY
        ) || DEFAULT_CURRENCY
    );

}


/* ==========================================================
   SAVE COUNTRY
========================================================== */

function saveCountry(
    countryCode
) {

    if (!countryCode) {
        return;
    }


    const code =
        String(countryCode)
            .trim()
            .toUpperCase();


    localStorage.setItem(
        COUNTRY_STORAGE_KEY,
        code
    );


    const currency =
        countryCurrencyMap[code];


    if (currency) {

        localStorage.setItem(
            CURRENCY_STORAGE_KEY,
            currency.currency
        );

    }

}


/* ==========================================================
   SET CURRENCY
========================================================== */

function setCurrency(
    currencyCode
) {

    if (!currencyCode) {
        return;
    }


    localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        String(currencyCode)
            .trim()
            .toUpperCase()
    );

}


/* ==========================================================
   GET CURRENCY INFORMATION
========================================================== */

function getCurrencyInformation(
    currencyCode
) {

    return (
        currencyInformation[
            currencyCode
        ] || {

            symbol: currencyCode,

            name: currencyCode

        }
    );

}


/* ==========================================================
   GET CURRENCY SYMBOL
========================================================== */

function getCurrencySymbol() {

    const currency =
        getSavedCurrency();


    return getCurrencyInformation(
        currency
    ).symbol;

}


/* ==========================================================
   BASE CURRENCY
========================================================== */

function getBaseCurrency() {

    return "NGN";

}


/* ==========================================================
   EXCHANGE RATES
========================================================== */

/*
 * Temporary base rates.
 *
 * These should eventually come from
 * a live exchange-rate source.
 *
 * 1 NGN = rate of target currency.
 */

const exchangeRates = {

    NGN: 1,

    USD: 0.00074,

    GHS: 0.0095,

    KES: 0.095,

    ZAR: 0.013,

    CAD: 0.0010,

    GBP: 0.00055,

    AUD: 0.0011,

    INR: 0.062,

    PKR: 0.21,

    BDT: 0.088,

    BRL: 0.0039,

    MXN: 0.013,

    ARS: 0.96,

    EUR: 0.00063,

    JPY: 0.11,

    CNY: 0.0053,

    AED: 0.0027,

    SAR: 0.0028,

    EGP: 0.038,

    TRY: 0.029

};


/* ==========================================================
   CONVERT PRICE
========================================================== */

function convertCurrency(
    amount,
    fromCurrency = "NGN",
    toCurrency = getSavedCurrency()
) {

    const value =
        Number(amount);


    if (
        !Number.isFinite(value)
    ) {

        return 0;

    }


    if (
        fromCurrency ===
        toCurrency
    ) {

        return value;

    }


    /*
     * Convert source → NGN
     */

    let amountInNGN;


    if (
        fromCurrency === "NGN"
    ) {

        amountInNGN =
            value;

    }

    else {

        const sourceRate =
            exchangeRates[
                fromCurrency
            ];


        if (
            !sourceRate ||
            sourceRate <= 0
        ) {

            return value;

        }


        amountInNGN =
            value /
            sourceRate;

    }


    /*
     * Convert NGN → target
     */

    const targetRate =
        exchangeRates[
            toCurrency
        ];


    if (
        !targetRate ||
        targetRate <= 0
    ) {

        return amountInNGN;

    }


    return (
        amountInNGN *
        targetRate
    );

}


/* ==========================================================
   FORMAT MONEY
========================================================== */

function formatMoney(
    amount,
    fromCurrency = "NGN"
) {

    const targetCurrency =
        getSavedCurrency();


    const convertedAmount =
        convertCurrency(
            amount,
            fromCurrency,
            targetCurrency
        );


    const information =
        getCurrencyInformation(
            targetCurrency
        );


    return (
        information.symbol +
        Number(
            convertedAmount
        ).toLocaleString(
            "en-US",
            {
                minimumFractionDigits:
                    targetCurrency === "JPY"
                        ? 0
                        : 2,

                maximumFractionDigits:
                    targetCurrency === "JPY"
                        ? 0
                        : 2
            }
        )
    );

}


/* ==========================================================
   APPLY CURRENCY TO ELEMENTS
========================================================== */

/*
 * Any element containing:
 *
 * data-price="100000"
 *
 * will automatically display
 * the selected currency.
 */

function updateCurrencyElements() {

    document
        .querySelectorAll(
            "[data-price]"
        )
        .forEach(
            element => {

                const price =
                    Number(
                        element.dataset.price
                    );


                if (
                    Number.isFinite(price)
                ) {

                    element.textContent =
                        formatMoney(
                            price
                        );

                }

            }
        );

}


/* ==========================================================
   INITIALIZE CURRENCY
========================================================== */

function initializeCurrency() {

    const country =
        getSavedCountry();


    const countryData =
        countryCurrencyMap[
            country
        ];


    if (
        countryData
    ) {

        localStorage.setItem(
            CURRENCY_STORAGE_KEY,
            countryData.currency
        );

    }


    updateCurrencyElements();

}


/* ==========================================================
   COUNTRY CHANGE
========================================================== */

function handleCountryCurrencyChange(
    countryCode
) {

    saveCountry(
        countryCode
    );


    /*
     * Refresh all prices on the page.
     */

    updateCurrencyElements();


    /*
     * Allow other page scripts to
     * refresh their dynamically
     * generated prices.
     */

    window.dispatchEvent(
        new CustomEvent(
            "neostoreCurrencyChanged",
            {
                detail: {
                    country:
                        getSavedCountry(),

                    currency:
                        getSavedCurrency()
                }
            }
        )
    );

}


/* ==========================================================
   GLOBAL ACCESS
========================================================== */

window.NeoStoreCurrency = {

    getSavedCountry,

    getSavedCurrency,

    saveCountry,

    setCurrency,

    getCurrencySymbol,

    getCurrencyInformation,

    convertCurrency,

    formatMoney,

    updateCurrencyElements,

    initializeCurrency,

    handleCountryCurrencyChange

};


/* ==========================================================
   START
========================================================== */

initializeCurrency();

