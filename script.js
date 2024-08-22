const columns = document.querySelectorAll(".column__cards");

let draggedCard = null;
let touchStartX = 0;
let touchStartY = 0;
let touchMoveX = 0;
let touchMoveY = 0;

// Função para lidar com o início do toque
const touchStart = (event) => {
    if (event.target.classList.contains("card")) {
        draggedCard = event.target;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        event.target.style.position = "absolute";
        event.target.style.zIndex = 1000;
    } else {
        event.preventDefault();
    }
};

// Função para lidar com o movimento do toque
const touchMove = (event) => {
    if (draggedCard) {
        touchMoveX = event.touches[0].clientX;
        touchMoveY = event.touches[0].clientY;
        draggedCard.style.left = `${touchMoveX - touchStartX}px`;
        draggedCard.style.top = `${touchMoveY - touchStartY}px`;
        event.preventDefault();
    }
};

// Função para lidar com o fim do toque
const touchEnd = (event) => {
    if (draggedCard) {
        draggedCard.style.position = "";
        draggedCard.style.left = "";
        draggedCard.style.top = "";
        draggedCard.style.zIndex = "";
        
        // Verifica a área de soltura
        columns.forEach((column) => {
            const rect = column.getBoundingClientRect();
            const touchX = event.changedTouches[0].clientX;
            const touchY = event.changedTouches[0].clientY;
            if (
                touchX >= rect.left &&
                touchX <= rect.right &&
                touchY >= rect.top &&
                touchY <= rect.bottom
            ) {
                column.append(draggedCard);
            }
        });

        draggedCard = null;
    }
};

const dragStart = (event) => {
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

    selectAllContent(card);

    card.addEventListener("focusout", () => {
        card.contentEditable = "false";
        if (!card.textContent.trim()) card.remove();
    });
};

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
    
    // Eventos de toque para suportar arrastar em dispositivos móveis
    column.addEventListener("touchstart", touchStart);
    column.addEventListener("touchmove", touchMove);
    column.addEventListener("touchend", touchEnd);
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("dblclick", editCard);
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("touchstart", touchStart);
        card.addEventListener("touchmove", touchMove);
        card.addEventListener("touchend", touchEnd);
    });
});
