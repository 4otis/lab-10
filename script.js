const titleInput = document.getElementById('artifact-title');
const categoryInput = document.getElementById('artifact-category');
const imageInput = document.getElementById('artifact-image');
const addBtn = document.getElementById('add-btn');
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search-by-category');
const searchBtn = document.getElementById('search-btn');
const errorBanner = document.getElementById('error-banner');
const totalCounter = document.getElementById('total-counter');
const categoriesTabs = document.getElementById('categories-tabs');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalImage = document.getElementById('modal-image');

let categories = [];
let artifacts = [];

function init() {
    updateCounter();
    addBtn.addEventListener('click', addArtifact);
    searchBtn.addEventListener('click', searchByCategory);
    themeToggle.addEventListener('click', toggleTheme);
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

function addArtifact() {
    if (!titleInput.value.trim() || !categoryInput.value.trim() || !imageInput.value.trim()) {
        errorBanner.classList.remove('hidden');
        return;
    }

    errorBanner.classList.add('hidden');

    const artifact = {
        id: Date.now(),
        title: titleInput.value.trim(),
        category: categoryInput.value.trim(),
        image: imageInput.value.trim(),
        isFavourite: false,
        createdAt: new Date().toLocaleString()
    };

    artifacts.push(artifact);
    createCard(artifact);

    if (!categories.includes(artifact.category)) {
        categories.push(artifact.category);
        createTab(artifact.category);
    }

    titleInput.value = "";
    categoryInput.value = "";
    imageInput.value = "";

    updateCounter();
}

function createCard(artifact) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = artifact.id;
    card.dataset.category = artifact.category.toLowerCase();

    const title = document.createElement('h2');
    title.textContent = artifact.title;

    const category = document.createElement('p');
    category.textContent = `Категория: ${artifact.category}`;

    const image = document.createElement('img');
    image.src = artifact.image;
    image.alt = artifact.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add('del-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.remove();
        artifacts = artifacts.filter(a => a.id !== artifact.id);
        updateCounter();
        checkCategories();
    });

    const favBtn = document.createElement('button');
    favBtn.textContent = artifact.isFavourite ? "★ В избранном" : "☆ В избранное";
    favBtn.classList.add('secondary');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        artifact.isFavourite = !artifact.isFavourite;
        favBtn.textContent = artifact.isFavourite ? "★ В избранном" : "☆ В избранное";

        if (artifact.isFavourite) {
            card.classList.add('favourite');
        } else {
            card.classList.remove('favourite');
        }
    });

    card.appendChild(title);
    card.appendChild(category);
    card.appendChild(image);
    card.appendChild(favBtn);
    card.appendChild(deleteBtn);

    card.addEventListener('click', () => {
        openModal(artifact);
    });

    gallery.appendChild(card);
}

function createTab(category) {
    const tab = document.createElement('button');
    tab.classList.add('tab');
    tab.textContent = category;
    tab.dataset.category = category.toLowerCase();

    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (tab.dataset.category === 'all') {
                card.style.display = 'block';
            } else if (card.dataset.category === tab.dataset.category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    categoriesTabs.appendChild(tab);
}

function checkCategories() {
    const currentCategories = new Set(artifacts.map(a => a.category));
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.dataset.category !== 'all' && !currentCategories.has(tab.textContent)) {
            tab.remove();
        }
    });

    categories = Array.from(currentCategories);
}

function searchByCategory() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        if (searchTerm === '') {
            card.style.display = 'block';
        } else if (card.dataset.category.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    searchInput.value = "";
}

function updateCounter() {
    totalCounter.textContent = artifacts.length;
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');

    if (document.body.classList.contains('dark-theme')) {
        themeToggle.textContent = 'Светлая тема';
    } else {
        themeToggle.textContent = 'Темная тема';
    }
}

function openModal(artifact) {
    modalTitle.textContent = artifact.title;
    modalCategory.textContent = `Категория: ${artifact.category}`;
    modalImage.src = artifact.image;
    modalImage.alt = artifact.title;

    modal.classList.remove('hidden');
}

init();