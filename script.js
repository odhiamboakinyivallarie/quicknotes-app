
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function renderNotes() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(note =>
        note.text.toLowerCase().includes(searchTerm)
    );

    filteredNotes.forEach(note => {
        const listItem = document.createElement("li");
        listItem.classList.add(
            "note-card",
            `category-${note.category}`
        );

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const categoryText = document.createElement("small");
        categoryText.textContent = `Category: ${note.category}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter(item => item.id !== note.id);
            saveNotes();
            renderNotes();
        });

        listItem.append(noteText, categoryText, deleteButton);
        notesList.appendChild(listItem);
    });

    if (searchTerm && filteredNotes.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    }

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

noteForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const newNote = {
        id: Date.now(),
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes();

    noteInput.value = "";
    errorMessage.textContent = "";

    renderNotes();
});

searchInput.addEventListener("input", renderNotes);

renderNotes();
