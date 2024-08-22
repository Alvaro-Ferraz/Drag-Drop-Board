const columns = document.querySelectorAll(".column__cards");

let draggedCard = null;

const dragStart = (event) => {
    // Verifica se o elemento arrastado é o card
    if (event.target.classList.contains("card")) {
        draggedCard = event.target;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", ""); 
    } else {
        event.preventDefault(); 
    }
};

const dragOver = (event) => {
    event.preventDefault(); 
};

const dragEnter = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.add("column--highlight");
    }
};

const dragLeave = ({ target }) => {
    target.classList.remove("column--highlight");
};

const drop = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.remove("column--highlight");
        if (draggedCard) {
            target.append(draggedCard);
            draggedCard = null; 
        }
    }
};

const createCard = ({ target }) => {
    if (!target.classList.contains("column__cards")) return;
    const card = document.createElement("section");

    card.className = "card";
    card.draggable = "true";
    card.contentEditable = "true";

    card.addEventListener("focusout", () => {
        card.contentEditable = "false";
        if (!card.textContent.trim()) card.remove(); 
    });

    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dblclick", editCard);

    target.append(card);
    card.focus();
};

const editCard = (event) => {
    const card = event.target;
    card.contentEditable = "true";
    card.focus();

    // Seleciona todo o conteúdo do card ao editar
    selectAllContent(card);

    card.addEventListener("focusout", () => {
        card.contentEditable = "false";
        if (!card.textContent.trim()) card.remove(); 
    });
};

// Função para selecionar todo o conteúdo do card
const selectAllContent = (element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);
    column.addEventListener("dragenter", dragEnter);
    column.addEventListener("dragleave", dragLeave);
    column.addEventListener("drop", drop);
    column.addEventListener("dblclick", createCard);
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("dblclick", editCard);
        card.addEventListener("dragstart", dragStart); 
    });
});
