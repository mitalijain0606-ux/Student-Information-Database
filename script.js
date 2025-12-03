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
