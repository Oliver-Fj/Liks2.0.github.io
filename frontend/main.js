class LinkManager {
    constructor() {
        this.links = [];
        this.weeks = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.programmingIcons = [
            'fa-code', 'fa-terminal', 'fa-bug', 'fa-laptop-code',
            'fa-database', 'fa-microchip', 'fa-code-branch'
        ];
        this.neonColors = ['btn-neon-purple', 'btn-neon-blue', 'btn-neon-green'];
        this.API_URL = 'http://localhost:8000/api'; // Cambia esto a la URL de tu backend en producción
        this.initializeElements();
        this.setupEventListeners();
        this.initializeTheme();
        this.loadData();
    }

    initializeElements() {
        // Botones y modales
        this.addWeekBtn = document.getElementById('addWeekBtn');
        this.addLinkBtn = document.getElementById('addLinkBtn');
        this.linkModal = document.getElementById('linkModal');
        this.closeModal = document.querySelector('.close');
        this.linkForm = document.getElementById('linkForm');
        this.weeksContainer = document.getElementById('weeksContainer');
        this.themeToggle = document.getElementById('themeToggle');
        this.searchInput = document.getElementById('searchInput');
        this.noResults = document.getElementById('noResults');
        
        // Campos del formulario
        this.linkTitleInput = document.getElementById('linkTitle');
        this.linkUrlInput = document.getElementById('linkUrl');
        this.linkWeekSelect = document.getElementById('linkWeek');

        // Aplicar estilos neón a los botones principales
        this.addWeekBtn.classList.add('btn-neon-purple');
        this.addLinkBtn.classList.add('btn-neon-blue');
    }

    setupEventListeners() {
        this.addWeekBtn.addEventListener('click', () => this.createNewWeek());
        this.addLinkBtn.addEventListener('click', () => this.openModal());
        this.closeModal.addEventListener('click', () => this.closeModalHandler());
        this.linkForm.addEventListener('submit', (e) => this.handleLinkSubmit(e));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        window.addEventListener('click', (e) => {
            if (e.target === this.linkModal) {
                this.closeModalHandler();
            }
        });
    }

    async loadData() {
        try {
            const [linksResponse, weeksResponse] = await Promise.all([
                fetch(`${this.API_URL}/links`),
                fetch(`${this.API_URL}/weeks`)
            ]);
            
            if (!linksResponse.ok) {
                throw new Error(`HTTP error! status: ${linksResponse.status}`);
            }
            if (!weeksResponse.ok) {
                throw new Error(`HTTP error! status: ${weeksResponse.status}`);
            }

            const linksData = await linksResponse.json();
            const weeksData = await weeksResponse.json();

            this.links = linksData.records || [];
            this.weeks = weeksData.records || [];

            console.log('Links cargados:', this.links);
            console.log('Semanas cargadas:', this.weeks);

            this.renderWeeks();
            this.updateWeekSelect();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        }
    }

    renderWeeks() {
        this.weeksContainer.innerHTML = '';
        
        if (this.weeks.length === 0) {
            this.weeksContainer.innerHTML = '<p>No hay semanas para mostrar.</p>';
            return;
        }

        this.weeks.forEach(week => {
            const weekLinks = this.links.filter(link => link.week_id === week.id);
            const weekElement = this.createWeekElement(week, weekLinks);
            this.weeksContainer.appendChild(weekElement);
        });
    }

    async createNewWeek() {
        const nextWeekNumber = this.weeks.length + 1;
        const { value: weekName } = await Swal.fire({
            title: 'Crear nueva semana',
            input: 'text',
            inputLabel: 'Nombre de la semana',
            inputValue: `Semana ${this.weeks.length + 1}`,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Debes escribir un nombre para la semana';
                }
            }
        });

        if (weekName) {
            try {
                const response = await fetch(`${this.API_URL}/weeks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: weekName, is_collapsed: false }),
                });

                if (!response.ok) {
                    throw new Error('Error al crear la semana');
                }

                await this.loadData();
                this.updateWeekSelect();

                Swal.fire('¡Semana creada!', `Se ha creado "${weekName}" exitosamente`, 'success');
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'No se pudo crear la semana', 'error');
            }
        }
    }

    async handleLinkSubmit(e) {
        e.preventDefault();
        
        const newLink = {
            title: this.linkTitleInput.value,
            url: this.linkUrlInput.value,
            week_id: parseInt(this.linkWeekSelect.value)
        };

        try {
            const response = await fetch(`${this.API_URL}/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLink),
            });

            if (!response.ok) {
                throw new Error('Error al crear el link');
            }

            await this.loadData();
            this.closeModalHandler();

            Swal.fire('¡Link agregado!', 'El link se ha agregado exitosamente', 'success');
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo agregar el link', 'error');
        }
    }

    async deleteLink(linkId) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${this.API_URL}/links`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: linkId }),
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el link');
                }

                const data = await response.json();
                console.log(data); // Para depuración

                await this.loadData();
                
                Swal.fire('¡Eliminado!', 'El link ha sido eliminado', 'success');
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'No se pudo eliminar el link', 'error');
            }
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    openModal() {
        this.linkModal.style.display = 'block';
        this.updateWeekSelect();
    }

    closeModalHandler() {
        this.linkModal.style.display = 'none';
        this.linkForm.reset();
    }

    updateWeekSelect() {
        this.linkWeekSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona una semana';
        this.linkWeekSelect.appendChild(defaultOption);

        this.weeks.forEach(week => {
            const option = document.createElement('option');
            option.value = week.id;
            option.textContent = week.name;
            this.linkWeekSelect.appendChild(option);
        });
    }

    handleSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        let foundAnyResults = false;

        document.querySelectorAll('.week-container').forEach(weekContainer => {
            const links = weekContainer.querySelectorAll('.link-card');
            let foundInWeek = false;

            links.forEach(link => {
                const title = link.querySelector('.link-title').textContent.toLowerCase();
                const matches = title.includes(searchTerm);
                
                link.style.display = matches ? 'block' : 'none';
                if (matches) {
                    foundInWeek = true;
                    foundAnyResults = true;
                }
            });

            weekContainer.style.display = foundInWeek ? 'block' : 'none';
        });

        this.noResults.style.display = foundAnyResults ? 'none' : 'block';
    }

    renderWeeks() {
        this.weeksContainer.innerHTML = '';
        
        this.weeks.forEach(week => {
            const weekLinks = this.links.filter(link => link.week_id === week.id);
            const weekElement = this.createWeekElement(week, weekLinks);
            this.weeksContainer.appendChild(weekElement);
        });
    }

    createWeekElement(week, links) {
        const weekContainer = document.createElement('div');
        weekContainer.className = 'week-container';
        
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-header';
        weekHeader.onclick = () => this.toggleWeekCollapse(week.id);
        
        const weekTitle = document.createElement('div');
        weekTitle.className = 'week-title';
        
        const titleText = document.createElement('h2');
        titleText.textContent = week.name;
        
        const collapseIcon = document.createElement('i');
        collapseIcon.className = `fas fa-chevron-${week.is_collapsed ? 'down' : 'up'} ml-2`;
        
        weekTitle.appendChild(titleText);
        weekTitle.appendChild(collapseIcon);

        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'week-icons';

        // Usar el número de la semana en lugar del ID para los iconos
        const weekNumber = parseInt(week.name.match(/\d+/)[0]);
        
        for (let i = 0; i < week.id; i++) {
            const icon = document.createElement('i');
            icon.className = `fas ${this.programmingIcons[i % this.programmingIcons.length]}`;
            iconsContainer.appendChild(icon);
        }
        
        weekHeader.appendChild(weekTitle);
        weekHeader.appendChild(iconsContainer);
        
        const weekContent = document.createElement('div');
        weekContent.className = `week-content ${week.is_collapsed ? '' : 'active'}`;
        
        const linksGrid = document.createElement('div');
        linksGrid.className = 'links-grid';
        
        links.forEach(link => {
            const linkCard = this.createLinkCard(link);
            linksGrid.appendChild(linkCard);
        });
        
        weekContent.appendChild(linksGrid);
        weekContainer.appendChild(weekHeader);
        weekContainer.appendChild(weekContent);
        
        return weekContainer;
    }

    createLinkCard(link) {
        const card = document.createElement('div');
        card.className = 'link-card';
        
        const title = document.createElement('h3');
        title.className = 'link-title';
        title.textContent = link.title;
        
        const button = document.createElement('button');
        button.className = `link-button ${this.neonColors[link.id % this.neonColors.length]}`;
        button.textContent = 'Ir al enlace';
        button.onclick = () => window.open(link.url, '_blank');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteLink(link.id);
        };
        
        card.appendChild(title);
        card.appendChild(button);
        card.appendChild(deleteBtn);
        
        return card;
    }

    async toggleWeekCollapse(weekId) {
        const week = this.weeks.find(w => w.id === weekId);
        if (week) {
            week.is_collapsed = !week.is_collapsed;
            try {
                const response = await fetch(`${this.API_URL}/weeks`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: week.id,
                        is_collapsed: week.is_collapsed
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Error al actualizar el estado de la semana');
                }
    
                const data = await response.json();
                console.log(data.message); // Para depuración
                this.renderWeeks(); // Actualiza la interfaz
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'No se pudo actualizar el estado de la semana', 'error');
                // Revertir el cambio en el objeto local si la actualización falla
                week.is_collapsed = !week.is_collapsed;
            }
        }
    }

    async updateWeekCollapse(week) {
        try {
            const response = await fetch(`${this.API_URL}/weeks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: week.id,
                    name: week.name,
                    is_collapsed: week.is_collapsed
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la semana');
            }

            this.renderWeeks();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo actualizar el estado de la semana', 'error');
        }
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new LinkManager();
});