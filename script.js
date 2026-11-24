
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentNumber = "";
let previousNumber = "";
let operator = null;
let shouldResetDisplay = false;

// Update Display
function updateDisplay() {
    currentDisplay.textContent = currentNumber || "0";
}

// Add Number
function appendNumber(number) {

    if (currentNumber === "Error") {
        currentNumber = "";
    }

    if (shouldResetDisplay) {
        currentNumber = "";
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) return;

    // Start decimal numbers with 0.
    if (number === "." && currentNumber === "") {
        currentNumber = "0";
    }

    currentNumber += number;

    updateDisplay();
}

// Choose Operator
function chooseOperator(selectedOperator) {

    if (currentNumber === "" || currentNumber === "Error") return;

    if (operator && !shouldResetDisplay) {
        calculate();
    }

    operator = selectedOperator;
    previousNumber = currentNumber;

    previousDisplay.textContent =
        previousNumber + " " + getSymbol(operator);

    currentNumber = "";
    shouldResetDisplay = false;
}

// Operator Symbols
function getSymbol(op) {

    const symbols = {
        "/": "÷",
        "*": "×",
        "+": "+",
        "-": "−"
    };

    return symbols[op];
}

// Calculate Result
function calculate() {

    if (!operator || previousNumber === "" || currentNumber === "") {
        return;
    }

    const prev = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);

    let result;

    switch (operator) {

        case "+":
            result = prev + current;
            break;

        case "-":
            result = prev - current;
            break;

        case "*":
            result = prev * current;
            break;

        case "/":

            if (current === 0) {
                currentNumber = "Error";
                previousDisplay.textContent = "Cannot divide by zero";

                previousNumber = "";
                operator = null;
                shouldResetDisplay = true;

                updateDisplay();
                return;
            }

            result = prev / current;
            break;
    }

    // Avoid floating-point precision issues
    result = Number(result.toPrecision(12));

    // Show previous calculation
    previousDisplay.textContent =
        previousNumber + " " +
        getSymbol(operator) + " " +
        current + " =";

    currentNumber = String(result);

    previousNumber = "";
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

// Clear Everything
function clearDisplay() {

    currentNumber = "";
    previousNumber = "";
    operator = null;
    shouldResetDisplay = false;

    previousDisplay.textContent = "";

    updateDisplay();
}

// Toggle Positive / Negative
function toggleSign() {

    if (!currentNumber || currentNumber === "Error") return;

    currentNumber = String(parseFloat(currentNumber) * -1);

    updateDisplay();
}

// Percentage
function percentage() {

    if (!currentNumber || currentNumber === "Error") return;

    currentNumber = String(parseFloat(currentNumber) / 100);

    updateDisplay();
}

// Dark / Light Theme
function toggleTheme() {

    document.body.classList.toggle("light");

    const button = document.getElementById("themeToggle");

    button.textContent =
        document.body.classList.contains("light") ? "☾" : "☀";
}

// Keyboard Support
document.addEventListener("keydown", function(event) {

    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
    }

    else if (event.key === ".") {
        appendNumber(".");
    }

    else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    }

    else if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    else if (event.key === "Backspace") {
        currentNumber = currentNumber.slice(0, -1);
        updateDisplay();
    }

    else if (event.key === "Escape") {
        clearDisplay();
    }

    else if (event.key === "%") {
        percentage();
    }
});
