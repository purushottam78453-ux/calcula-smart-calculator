const $ = (id) => document.getElementById(id);

let currentInput = "";

let history =
    JSON.parse(
        localStorage.getItem("calculaHistory")
    ) || [];



/* =========================
   PAGE NAVIGATION
========================= */

const pages =
    document.querySelectorAll(".page");

const navItems =
    document.querySelectorAll(".nav-item");


function openPage(pageName) {

    pages.forEach((page) => {

        page.classList.toggle(
            "active",
            page.id === pageName
        );

    });


    navItems.forEach((item) => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });


    const titles = {

        home:
            "Calculate. Convert. Save Time.",

        calculator:
            "Smart Calculator",

        currency:
            "Currency Converter",

        unit:
            "Unit Converter",

        weight:
            "Weight Converter",

        length:
            "Length Converter",

        temperature:
            "Temperature Converter",

        time:
            "Time Converter",

        percentage:
            "Percentage Calculator",

        loan:
            "Loan Calculator",

        bmi:
            "BMI Calculator",

        age:
            "Age Calculator",

        about:
            "About CALCULA"

    };


    $("pageTitle").textContent =
        titles[pageName];


    $("sidebar").classList.remove(
        "open"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => openPage(item.dataset.page)
    );

});


document
    .querySelectorAll("[data-open]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => openPage(
                button.dataset.open
            )
        );

    });



/* MOBILE MENU */

$("menuButton").onclick = () => {

    $("sidebar").classList.add(
        "open"
    );

};


$("closeMenu").onclick = () => {

    $("sidebar").classList.remove(
        "open"
    );

};



/* =========================
   CALCULATOR
========================= */

document
    .querySelectorAll("[data-value]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                handleInput(
                    button.dataset.value
                );

            }
        );

    });



document.addEventListener(
    "keydown",
    (event) => {

        const key = event.key;


        if (
            /^[0-9.]$/.test(key) ||
            ["+", "-", "*", "/", "(", ")"]
                .includes(key)
        ) {

            event.preventDefault();

            handleInput(key);

        }


        else if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            handleInput("=");

        }


        else if (
            key === "Backspace"
        ) {

            event.preventDefault();

            handleInput("⌫");

        }


        else if (
            key === "Escape"
        ) {

            event.preventDefault();

            handleInput("AC");

        }


        else if (key === "%") {

            event.preventDefault();

            handleInput("%");

        }

    }
);



function normalize(value) {

    return value
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replaceAll("−", "-");

}



function formatNumber(number) {

    if (!Number.isFinite(number)) {

        throw new Error();

    }


    return Number(
        number.toFixed(10)
    ).toString();

}



function updateCalculator() {

    $("expression").textContent =
        currentInput || "0";

    $("result").textContent =
        currentInput || "0";


    $("homeExpression").textContent =
        currentInput || "Ready";

    $("homeResult").textContent =
        currentInput || "0";

}



function calculate() {

    if (!currentInput) {

        return;

    }


    try {

        const calculation =
            normalize(currentInput);


        const result =
            Function(
                '"use strict"; return (' +
                calculation +
                ')'
            )();


        const formatted =
            formatNumber(result);


        history.unshift({

            expression:
                currentInput,

            result:
                formatted

        });


        history =
            history.slice(0, 12);


        localStorage.setItem(
            "calculaHistory",
            JSON.stringify(history)
        );


        $("expression").textContent =
            currentInput + " =";


        $("result").textContent =
            formatted;


        currentInput =
            formatted;


        renderHistory();

    }

    catch {

        $("expression").textContent =
            "Invalid calculation";

        $("result").textContent =
            "Error";

        currentInput = "";

    }

}



function handleInput(value) {


    if (value === "AC") {

        currentInput = "";

        updateCalculator();

        return;

    }


    if (value === "⌫") {

        currentInput =
            currentInput.slice(0, -1);

        updateCalculator();

        return;

    }


    if (value === "=") {

        calculate();

        return;

    }


    if (value === "±") {

        if (currentInput) {

            currentInput =
                currentInput.startsWith("-")
                    ? currentInput.slice(1)
                    : "-" + currentInput;

        }

        updateCalculator();

        return;

    }


    if (value === "sqrt") {

        try {

            const result =
                Math.sqrt(
                    Function(
                        '"use strict"; return (' +
                        normalize(currentInput) +
                        ')'
                    )()
                );

            currentInput =
                formatNumber(result);

            updateCalculator();

        }

        catch {}

        return;

    }


    if (value === "square") {

        try {

            const result =
                Math.pow(
                    Function(
                        '"use strict"; return (' +
                        normalize(currentInput) +
                        ')'
                    )(),
                    2
                );

            currentInput =
                formatNumber(result);

            updateCalculator();

        }

        catch {}

        return;

    }


    if (
        value === "%" &&
        currentInput
    ) {

        try {

            const result =
                Function(
                    '"use strict"; return (' +
                    normalize(currentInput) +
                    ')'
                )() / 100;


            currentInput =
                formatNumber(result);

            updateCalculator();

        }

        catch {}

        return;

    }


    if (value === "*") {

        value = "×";

    }


    if (value === "/") {

        value = "÷";

    }


    if (value === "-") {

        value = "−";

    }


    if (value === ".") {

        const lastNumber =
            currentInput.split(
                /[+×÷−()]/
            ).pop();


        if (
            lastNumber.includes(".")
        ) {

            return;

        }

    }


    if (
        ["+", "×", "÷", "−"]
            .includes(value)
    ) {

        if (!currentInput) {

            return;

        }


        const lastCharacter =
            currentInput[
                currentInput.length - 1
            ];


        if (
            ["+", "×", "÷", "−"]
                .includes(lastCharacter)
        ) {

            currentInput =
                currentInput.slice(0, -1) +
                value;

            updateCalculator();

            return;

        }

    }


    currentInput += value;

    updateCalculator();

}



/* =========================
   HISTORY
========================= */

function renderHistory() {

    const list =
        $("historyList");

    const home =
        $("homeHistory");


    if (!history.length) {

        list.innerHTML = `
            <div class="empty">
                🧮
                <br>
                No calculations yet
            </div>
        `;


        home.innerHTML = `
            <div class="empty">
                🧮
                <br>
                No calculations yet
            </div>
        `;

        return;

    }


    list.innerHTML =
        history.map(
            (item, index) => `

                <div
                    class="history-item"
                    data-history="${index}"
                >

                    <small>
                        ${item.expression} =
                    </small>

                    <strong>
                        ${item.result}
                    </strong>

                </div>
            `
        ).join("");


    home.innerHTML =
        history
            .slice(0, 4)
            .map(
                (item) => `

                    <div class="home-history-item">

                        <small>
                            ${item.expression} =
                        </small>

                        <strong>
                            ${item.result}
                        </strong>

                    </div>
                `
            )
            .join("");


    list
        .querySelectorAll(
            "[data-history]"
        )
        .forEach((item) => {

            item.addEventListener(
                "click",
                () => {

                    currentInput =
                        history[
                            item.dataset.history
                        ].result;


                    updateCalculator();

                    openPage(
                        "calculator"
                    );

                }
            );

        });

}


function clearHistory() {

    history = [];

    localStorage.removeItem(
        "calculaHistory"
    );

    renderHistory();

}


$("clearHistory").onclick =
    clearHistory;

$("homeClearHistory").onclick =
    clearHistory;



/* =========================
   CURRENCY
========================= */

const currencies = {

    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    NPR: 133.2,
    AUD: 1.52,
    CAD: 1.36,
    JPY: 149.5,
    CNY: 7.12,
    AED: 3.67,
    SGD: 1.34

};


function loadCurrencies() {

    const options =
        Object.keys(currencies)
            .map(
                (currency) =>
                    `<option value="${currency}">
                        ${currency}
                    </option>`
            )
            .join("");


    $("currencyFrom").innerHTML =
        options;

    $("currencyTo").innerHTML =
        options;


    $("currencyFrom").value =
        "USD";

    $("currencyTo").value =
        "INR";

}


function convertCurrency() {

    const amount =
        Number(
            $("currencyAmount").value
        ) || 0;


    const from =
        $("currencyFrom").value;


    const to =
        $("currencyTo").value;


    const result =
        amount *
        currencies[to] /
        currencies[from];


    $("currencyResult").textContent =
        formatNumber(result) +
        " " +
        to;

}


["currencyAmount",
 "currencyFrom",
 "currencyTo"]
.forEach((id) => {

    $(id).addEventListener(
        "input",
        convertCurrency
    );

});


$("currencySwap").onclick = () => {

    const oldFrom =
        $("currencyFrom").value;


    $("currencyFrom").value =
        $("currencyTo").value;


    $("currencyTo").value =
        oldFrom;


    convertCurrency();

};



/* =========================
   UNIT CONVERTER
========================= */

const units = {

    length: {

        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        mile: 1609.344

    },

    weight: {

        mg: 0.000001,
        g: 0.001,
        kg: 1,
        tonne: 1000,
        oz: 0.0283495,
        lb: 0.453592

    },

    volume: {

        ml: 0.001,
        litre: 1,
        gallon: 3.78541,
        cup: 0.236588

    }

};


function loadUnits(
    category,
    fromId,
    toId
) {

    const options =
        Object.keys(
            units[category]
        )
        .map(
            (unit) =>
                `<option value="${unit}">
                    ${unit}
                </option>`
        )
        .join("");


    $(fromId).innerHTML =
        options;

    $(toId).innerHTML =
        options;


    $(fromId).selectedIndex = 0;

    $(toId).selectedIndex = 1;

}



function convertUnit(
    category,
    valueId,
    fromId,
    toId,
    resultId
) {

    const value =
        Number(
            $(valueId).value
        ) || 0;


    const from =
        $(fromId).value;


    const to =
        $(toId).value;


    const result =
        value *
        units[category][from] /
        units[category][to];


    $(resultId).textContent =
        formatNumber(result) +
        " " +
        to;

}


$("unitCategory").onchange =
    () => {

        loadUnits(
            $("unitCategory").value,
            "unitFrom",
            "unitTo"
        );


        convertUnit(
            $("unitCategory").value,
            "unitValue",
            "unitFrom",
            "unitTo",
            "unitResult"
        );

    };


["unitValue",
 "unitFrom",
 "unitTo"]
.forEach((id) => {

    $(id).addEventListener(
        "input",
        () => {

            convertUnit(
                $("unitCategory").value,
                "unitValue",
                "unitFrom",
                "unitTo",
                "unitResult"
            );

        }
    );

});


loadUnits(
    "length",
    "unitFrom",
    "unitTo"
);



/* =========================
   WEIGHT
========================= */

loadUnits(
    "weight",
    "weightFrom",
    "weightTo"
);


["weightValue",
 "weightFrom",
 "weightTo"]
.forEach((id) => {

    $(id).addEventListener(
        "input",
        () => {

            convertUnit(
                "weight",
                "weightValue",
                "weightFrom",
                "weightTo",
                "weightResult"
            );

        }
    );

});



/* =========================
   LENGTH
========================= */

loadUnits(
    "length",
    "lengthFrom",
    "lengthTo"
);


["lengthValue",
 "lengthFrom",
 "lengthTo"]
.forEach((id) => {

    $(id).addEventListener(
        "input",
        () => {

            convertUnit(
                "length",
                "lengthValue",
                "lengthFrom",
                "lengthTo",
                "lengthResult"
            );

        }
    );

});



/* =========================
   TEMPERATURE
========================= */

function convertTemperature() {

    const value =
        Number(
            $("tempValue").value
        );


    if (!Number.isFinite(value)) {

        return;

    }


    const from =
        $("tempFrom").value;


    const to =
        $("tempTo").value;


    let celsius;


    if (from === "°C") {

        celsius = value;

    }

    else if (from === "°F") {

        celsius =
            (value - 32) *
            5 / 9;

    }

    else {

        celsius =
            value - 273.15;

    }


    let result;


    if (to === "°C") {

        result = celsius;

    }

    else if (to === "°F") {

        result =
            celsius *
            9 / 5 +
            32;

    }

    else {

        result =
            celsius +
            273.15;

    }


    $("tempResult").textContent =
        formatNumber(result) +
        " " +
        to;

}


["tempValue",
 "tempFrom",
 "tempTo"]
.forEach((id) => {

    $(id).addEventListener(
        "input",
        convertTemperature
    );

});



/* =========================
   TIME
========================= */

const timeUnits = {

    Seconds: 1,
    Minutes: 60,
    Hours: 3600,
    Days: 86400

};


function convertTime() {

    const value =
        Number(
            $("timeValue").value
        ) || 0;


    const from =
        $("timeFrom").value;


    const to =
        $("timeTo").value;


    const result =
        value *
        timeUnits[from] /
        timeUnits[to];


    $("timeResult").textContent =
        formatNumber(result) +
        " " +
        to;

}


["timeValue",
 "timeFrom",
 "timeTo"]
.forEach((id) => {

    $(id).addEventListener(
        "input",
        convertTime
    );

});



/* =========================
   PERCENTAGE
========================= */

$("pctButton").onclick = () => {

    const a =
        Number(
            $("pctA").value
        ) || 0;


    const b =
        Number(
            $("pctB").value
        ) || 0;


    $("pctResult").textContent =
        formatNumber(
            a * b / 100
        );

};


$("pctButton2").onclick = () => {

    const a =
        Number(
            $("pctC").value
        ) || 0;


    const b =
        Number(
            $("pctD").value
        ) || 1;


    $("pctResult2").textContent =
        formatNumber(
            a / b * 100
        ) +
        "%";

};



/* =========================
   LOAN
========================= */

$("loanButton").onclick = () => {

    const principal =
        Number(
            $("loanAmount").value
        );


    const annualRate =
        Number(
            $("loanRate").value
        );


    const years =
        Number(
            $("loanYears").value
        );


    const months =
        years * 12;


    const monthlyRate =
        annualRate /
        12 /
        100;


    let emi;


    if (monthlyRate === 0) {

        emi =
            principal /
            months;

    }

    else {

        emi =
            principal *
            monthlyRate *
            Math.pow(
                1 + monthlyRate,
                months
            ) /
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            );

    }


    const total =
        emi * months;


    const interest =
        total - principal;


    $("emi").textContent =
        "₹ " +
        formatNumber(emi);


    $("interest").textContent =
        "₹ " +
        formatNumber(interest);


    $("payment").textContent =
        "₹ " +
        formatNumber(total);

};



/* =========================
   BMI
========================= */

$("bmiButton").onclick = () => {

    const weight =
        Number(
            $("bmiWeight").value
        );


    const height =
        Number(
            $("bmiHeight").value
        ) / 100;


    const bmi =
        weight /
        (height * height);


    $("bmiResult").textContent =
        formatNumber(bmi);


    let category;


    if (bmi < 18.5) {

        category =
            "Underweight";

    }

    else if (bmi < 25) {

        category =
            "Normal";

    }

    else if (bmi < 30) {

        category =
            "Overweight";

    }

    else {

        category =
            "Obesity";

    }


    $("bmiCategory").textContent =
        category;

};



/* =========================
   AGE
========================= */

$("ageButton").onclick = () => {

    const birth =
        new Date(
            $("dob").value
        );


    if (isNaN(birth)) {

        return;

    }


    const today =
        new Date();


    let years =
        today.getFullYear() -
        birth.getFullYear();


    let months =
        today.getMonth() -
        birth.getMonth();


    let days =
        today.getDate() -
        birth.getDate();


    if (days < 0) {

        months--;

    }


    if (months < 0) {

        years--;

        months += 12;

    }


    $("ageResult").textContent =
        years +
        " years, " +
        months +
        " months";

};



/* =========================
   DARK / LIGHT MODE
========================= */

$("themeButton").onclick = () => {

    document.body.classList.toggle(
        "light"
    );


    const light =
        document.body.classList.contains(
            "light"
        );


    $("themeButton").textContent =
        light
            ? "🌙"
            : "☀️";


    localStorage.setItem(
        "calculaTheme",
        light
            ? "light"
            : "dark"
    );

};


if (
    localStorage.getItem(
        "calculaTheme"
    ) === "light"
) {

    document.body.classList.add(
        "light"
    );

    $("themeButton").textContent =
        "🌙";

}



/* =========================
   INITIALIZE
========================= */

loadCurrencies();

convertCurrency();

convertUnit(
    "length",
    "unitValue",
    "unitFrom",
    "unitTo",
    "unitResult"
);

convertUnit(
    "weight",
    "weightValue",
    "weightFrom",
    "weightTo",
    "weightResult"
);

convertUnit(
    "length",
    "lengthValue",
    "lengthFrom",
    "lengthTo",
    "lengthResult"
);

convertTemperature();

convertTime();

renderHistory();