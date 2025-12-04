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
// LOCAL STORAGE: LOAD AT STARTUP
//-------------------------------------------------------
function loadFromStorage() {
    const savedDB = localStorage.getItem("simple_kv_db");
    const savedIDX = localStorage.getItem("simple_kv_index");

    if (savedDB) Object.assign(DB, JSON.parse(savedDB));
    if (savedIDX) Object.assign(INDICES, JSON.parse(savedIDX));
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

//-------------------------------------------------------
// TTL LIVE COUNTDOWN — EXPIRED KEYS ARE NOT AUTO-DELETED
//-------------------------------------------------------
function updateTTLCountdown() {
    const now = Date.now();

    for (const [key, entry] of Object.entries(DB)) {
        const cell = document.querySelector(`.ttl-cell[data-key="${key}"]`);
        if (!cell) continue;

        // No TTL → show "-"
        if (!entry.expiresAt) {
            cell.textContent = "-";
            continue;
        }

        const remaining = entry.expiresAt - now;

        // TTL expired → mark but do NOT delete
        if (remaining <= 0) {
            cell.textContent = "Expired";
            continue;
        }

        // Show countdown
        const seconds = Math.floor(remaining / 1000);
        cell.textContent = `Expires in ${seconds}s`;
    }
}

//-------------------------------------------------------
// VALIDATION HELPERS
//-------------------------------------------------------
function validateBaseExists(indexName) {
    if (!DB[indexName]) throw new Error(`Base key '${indexName}' not found.`);
}

function validateField(field, validKeys) {
    if (!validKeys.includes(field)) {
        throw new Error(`Field '${field}' is invalid. Allowed: ${validKeys.join(", ")}`);
    }
}

function validateValue(value, validValues) {
    if (!validValues.includes(String(value))) {
        throw new Error(`Value '${value}' is invalid. Allowed: ${validValues.join(", ")}`);
    }
}

//-------------------------------------------------------
// COMMAND: SET
//-------------------------------------------------------
function commandSET(tokens) {
    const key = tokens[1];
    if (!key) throw new Error("SET needs a key.");

    const jsonStart = tokens.findIndex(t => t.startsWith("{"));
    if (jsonStart === -1) throw new Error("Invalid JSON.");

    let ttl = null;
    if (!isNaN(tokens[tokens.length - 1])) ttl = Number(tokens[tokens.length - 1]);

    const jsonTokens = ttl ? tokens.slice(jsonStart, -1) : tokens.slice(jsonStart);
    const jsonString = jsonTokens.join(" ");

    let json;
    try { json = JSON.parse(jsonString); }
    catch { throw new Error("Invalid JSON."); }

    DB[key] = {
        data: json,
        ttl,
        expiresAt: ttl ? Date.now() + ttl : null,
        validKeys: Object.keys(json),
        validValues: Object.values(json).map(v => String(v))
    };

    return "OK";
}

//-------------------------------------------------------
// COMMAND: GET (Does NOT delete expired keys)
//-------------------------------------------------------
function commandGET(tokens) {
    const key = tokens[1];
    if (!key) throw new Error("GET needs a key.");

    const entry = DB[key];
    if (!entry) throw new Error("Key not found.");

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
        return "This key has expired. Use DEL to remove it.";
    }

    return JSON.stringify(entry.data, null, 2);
}

//-------------------------------------------------------
// COMMAND: DEL (Manual delete only)
//-------------------------------------------------------
function commandDEL(tokens) {
    const key = tokens[1];
    if (!key) throw new Error("DEL needs a key.");

    if (!DB[key]) throw new Error(`Key '${key}' does not exist.`);

    delete DB[key];
    delete INDICES[key];

    renderVisualizer();
    persist();

    return `DELETED: '${key}'`;
}

//-------------------------------------------------------
// COMMAND: INDEX
//-------------------------------------------------------
function commandINDEX(tokens) {
    const indexName = tokens[1];
    const field = tokens[2];
    const value = tokens[3];

    validateBaseExists(indexName);
    const entry = DB[indexName];

    validateField(field, entry.validKeys);
    validateValue(value, entry.validValues);

    if (String(entry.data[field]) !== String(value)) {
        throw new Error("Key-value mismatch for document.");
    }

    INDICES[indexName] = INDICES[indexName] || {};
    INDICES[indexName][field] = value;

    return "INDEXED";
}

//-------------------------------------------------------
// COMMAND: RANGE (numeric search)
//-------------------------------------------------------
function commandRANGE(tokens) {
    const field = tokens[1];
    const start = Number(tokens[2]);
    const end = Number(tokens[3]);

    if (isNaN(start) || isNaN(end)) {
        throw new Error("RANGE requires numeric start and end.");
    }

    const results = {};

    for (const [key, entry] of Object.entries(DB)) {
        const data = entry.data;

        if (data[field] !== undefined && !isNaN(data[field])) {
            const numeric = Number(data[field]);
            if (numeric >= start && numeric <= end) {
                results[key] = data;
            }
        }
    }

    const indexName = `RANGE:${field}:${start}-${end}`;
    INDICES[indexName] = results;

    return Object.keys(results).length
        ? JSON.stringify(results, null, 2)
        : "No results.";
}

//-------------------------------------------------------
// MAIN COMMAND ROUTER
//-------------------------------------------------------
function runCommand() {
    const inputEl = document.getElementById("commandInput");
    const raw = inputEl.value.trim();
    if (!raw) return;

    const tokens = raw.split(/\s+/);
    const cmd = tokens[0].toUpperCase();

    try {
        let result;

        switch (cmd) {
            case "SET": result = commandSET(tokens); break;
            case "GET": result = commandGET(tokens); break;
            case "DEL": result = commandDEL(tokens); break;
            case "INDEX": result = commandINDEX(tokens); break;
            case "RANGE": result = commandRANGE(tokens); break;
            default:
                throw new Error("Unknown command.");
        }

        print(result);
        renderVisualizer();
        persist();

    } catch (err) {
        print("Error: " + err.message);
    }

    inputEl.value = "";
}

//-------------------------------------------------------
// TTL INTERVAL UPDATE
//-------------------------------------------------------
setInterval(updateTTLCountdown, 1000);

//-------------------------------------------------------
// INITIAL LOAD
//-------------------------------------------------------
loadFromStorage();
renderVisualizer();