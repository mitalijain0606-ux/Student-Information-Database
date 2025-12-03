
🎓 Student Information Database – In-Browser Key-Value Store with TTL & Indexing

This project is a fully interactive in-browser database system built using HTML, CSS, and JavaScript, designed to behave like a simplified NoSQL key-value database.
It includes support for:

✔ Key-value storage
✔ JSON documents
✔ TTL (Time-To-Live)
✔ Live TTL countdown
✔ Document-based indexing
✔ Numeric range queries
✔ LocalStorage persistence
✔ Real-time visualization of stored data

The project allows users to run database-style commands inside a Query Console, and immediately visualize results on the right side in a live table-based UI.


🚀 Features

🔑 1. Key-Value Store (localStorage-backed)

All data is stored in an in-memory DB object, and automatically synced to localStorage, ensuring persistence across browser sessions.
The UI displays:
	•	Key
	•	JSON value
	•	TTL / expiration countdown

Even expired keys are not auto-deleted, but flagged as "Expired" visually.

📊 4. Data Visualization Panel

A real-time UI shows:
	•	Current key-value pairs
	•	JSON values formatted nicely
	•	TTL countdowns
	•	All created indices

The right panel makes debugging and data inspection simple and user-friendly.


🎨 8. Modern UI (Glassmorphism Style)

Your style.css includes:
	•	Glass-effect panels
	•	Neon gradient titles
	•	Syntax-inspired monospace fonts
	•	A responsive two-column layout
	•	Custom scrollbar styling
	•	Semantic color system

The UI gives a dashboard-like database console feeling.


⌨️ 9. Enhanced UX Features
	•	Pressing Enter executes the command
	•	Pressing Ctrl+P / Cmd+P is disabled (prevents accidental printing)
	•	Automatic redraw of the UI after every operation
	•	Console output panel with “Clear” button


  🛠️ Tech Stack
	•	HTML5 – Layout & structure
	•	CSS3 – Glassmorphism UI + responsive design
	•	JavaScript (Vanilla) – Core logic, parser, DB engine
	•	localStorage – Persistence

  🧠 Why This Project Is Useful

This project is a great demonstration of:
	•	Designing a simple database engine
	•	Implementing TTL logic
	•	Parsing custom commands
	•	Building a real-time visual dashboard
	•	Indexing & querying data
	•	Using localStorage like a NoSQL store

Excellent for learning systems design, JS data structures, and frontend engineering
