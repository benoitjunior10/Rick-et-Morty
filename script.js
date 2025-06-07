// --- VARIABLES GLOBALES ET CONSTANTES ---
        const API_BASE_URL = 'https://rickandmortyapi.com/api/character/';
        let currentPageUrl = API_BASE_URL;
        let currentPageNumber = 1;
        let totalPages = 1;

        // --- REFERENCES AUX ÉLÉMENTS DU DOM ---
        const charactersContainer = document.getElementById('charactersContainer');
        const messageContainer = document.getElementById('messageContainer');
        const searchInput = document.getElementById('searchInput');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const pageInfo = document.getElementById('pageInfo');
        
        // --- FONCTIONS PRINCIPALES ---

        function showLoader() {
            charactersContainer.innerHTML = '';
            messageContainer.innerHTML = '<div class="loader"></div>';
        }
        
        function showMessage(message) {
            charactersContainer.innerHTML = '';
            messageContainer.innerHTML = `<p>${message}</p>`;
        }

        async function fetchCharacters(url) {
            showLoader();
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: Impossible de trouver des personnages.`);
                }
                const data = await response.json();
                displayCharacters(data.results);
                updatePagination(data.info);
            } catch (error) {
                console.error("Erreur lors de la récupération des personnages:", error);
                showMessage(error.message);
                updatePagination(null);
            }
        }

        function displayCharacters(characters) {
            charactersContainer.innerHTML = '';
            messageContainer.innerHTML = '';
            
            characters.forEach(character => {
                const card = document.createElement('div');
                card.className = 'character-card';
                
                // M itilize yon class css pou statut a au lieu de l'injecter directement
                const statusClass = character.status.toLowerCase();

                card.innerHTML = `
                    <img src="${character.image}" alt="Image de ${character.name}">
                    <div class="card-content">
                        <h3>${character.name}</h3>
                        <div class="status">
                            <span class="status-dot ${statusClass}"></span>
                            <p>${character.status} - ${character.species}</p>
                        </div>
                        <p class="location-info">
                            Dernière apparition : <br>
                            <span>${character.location.name}</span>
                        </p>
                    </div>
                `;
                charactersContainer.appendChild(card);
            });
        }

        function updatePagination(info) {
            const paginationContainer = document.getElementById('paginationContainer');
            if (!info || info.pages <= 1) {
                paginationContainer.classList.add('hidden');
                return;
            }
            
            paginationContainer.classList.remove('hidden');
            
            totalPages = info.pages;
            
            prevButton.dataset.url = info.prev;
            nextButton.dataset.url = info.next;
            
            prevButton.disabled = !info.prev;
            nextButton.disabled = !info.next;
            
            pageInfo.textContent = `Page ${currentPageNumber} sur ${totalPages}`;
        }
        
        // --- GESTIONNAIRES D'ÉVÉNEMENTS ---

        let searchTimeout;
        searchInput.addEventListener('keyup', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = searchInput.value.trim();
                currentPageNumber = 1;
                currentPageUrl = `${API_BASE_URL}?name=${encodeURIComponent(searchTerm)}`;
                fetchCharacters(currentPageUrl);
            }, 500);
        });

        prevButton.addEventListener('click', () => {
            if (prevButton.dataset.url && prevButton.dataset.url !== 'null') {
                currentPageNumber--;
                fetchCharacters(prevButton.dataset.url);
            }
        });

        nextButton.addEventListener('click', () => {
            if (nextButton.dataset.url && nextButton.dataset.url !== 'null') {
                currentPageNumber++;
                fetchCharacters(nextButton.dataset.url);
            }
        });

        // --- INITIALISATION ---
        document.addEventListener('DOMContentLoaded', () => {
            fetchCharacters(currentPageUrl);
        });