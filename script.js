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

function renderKV() {
    const body = document.getElementById("kvTableBody");
    const empty = document.getElementById("kvEmptyState");

    body.innerHTML = "";

    const keys = Object.keys(DB);

    if (keys.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    keys.forEach(key => {
        const entry = DB[key];
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${key}</td>
            <td>${JSON.stringify(entry.data)}</td>
            <td class="ttl-cell" data-key="${key}"></td>
        `;

        body.appendChild(tr);
    });
}

function renderIndices() {
    const filtered = {};

    for (const [key, obj] of Object.entries(INDICES)) {
        if (Object.keys(obj).length > 0) filtered[key] = obj;
    }

    document.getElementById("indexVisualizer").textContent =
        JSON.stringify(filtered, null, 2);
}