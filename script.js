//-------------------------------------------------------
// SIMPLE KEY-VALUE STORE WITH LOCALSTORAGE (FINAL VERSION)
//-------------------------------------------------------

// IN-MEMORY STORAGE (will sync with localStorage)
const DB = {};
const INDICES = {};

//-------------------------------------------------------
// PREVENT PRINT DIALOG (CMD+P / CTRL+P)
//-------------------------------------------------------
document.addEventListener("keydown", function (e) {
    if ((e.key === "p" || e.key === "P") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
    }
});

//-------------------------------------------------------
// ENTER KEY HANDLER
//-------------------------------------------------------
function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        runCommand();
    }
}

//-------------------------------------------------------
// PRINT + CLEAR OUTPUT
//-------------------------------------------------------
function print(msg) {
    document.getElementById("consoleOutput").textContent = msg;
}

function clearOutput() {
    document.getElementById("consoleOutput").textContent = "";
}

//-------------------------------------------------------
// LOCAL STORAGE: SAVE
//-------------------------------------------------------
function persist() {
    localStorage.setItem("simple_kv_db", JSON.stringify(DB));
    localStorage.setItem("simple_kv_index", JSON.stringify(INDICES));
}

//-------------------------------------------------------
// VISUALIZER (RIGHT SIDE)
//-------------------------------------------------------
function renderVisualizer() {
    renderKV();
    renderIndices();
    updateTTLCountdown(); // start TTL immediately
}