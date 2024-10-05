class LinkManager {
    constructor() {
        this.links = JSON.parse(localStorage.getItem('links')) || [];
        this.weeks = JSON.parse(localStorage.getItem('weeks')) || [
            { id: 1, name: 'Semana 1', isCollapsed: false },
            { id: 2, name: 'Semana 2', isCollapsed: true },
            { id: 3, name: 'Semana 3', isCollapsed: true }
        ];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.programmingIcons = [
            'fa-code',
            'fa-terminal',
            'fa-bug',
            'fa-laptop-code',
            'fa-database',
            'fa-microchip',
            'fa-code-branch'
        ];
        this.neonColors = ['btn-neon-purple', 'btn-neon-blue', 'btn-neon-green'];
        this.initializeElements();
        this.setupEventListeners();
        this.initializeTheme();
        this.renderWeeks();
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

    toggleWeekCollapse(weekId) {
        const week = this.weeks.find(w => w.id === weekId);
        if (week) {
            week.isCollapsed = !week.isCollapsed;
            this.saveWeeks();
            this.renderWeeks();
        }
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
        collapseIcon.className = `fas fa-chevron-${week.isCollapsed ? 'down' : 'up'} ml-2`;
        
        weekTitle.appendChild(titleText);
        weekTitle.appendChild(collapseIcon);

        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'week-icons';
        
        for (let i = 0; i < week.id; i++) {
            const icon = document.createElement('i');
            icon.className = `fas ${this.programmingIcons[i % this.programmingIcons.length]}`;
            iconsContainer.appendChild(icon);
        }
        
        weekHeader.appendChild(weekTitle);
        weekHeader.appendChild(iconsContainer);
        
        const weekContent = document.createElement('div');
        weekContent.className = `week-content ${week.isCollapsed ? '' : 'active'}`;
        
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
        
        // Agregar efecto hover dinámico
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotate(0)';
        });
        
        return card;
    }

    // Resto de métodos existentes sin cambios...
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
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

    createNewWeek() {
        const newWeekId = this.weeks.length + 1;
        const newWeek = {
            id: newWeekId,
            name: `Semana ${newWeekId}`,
            isCollapsed: false
        };
        
        this.weeks.push(newWeek);
        this.saveWeeks();
        this.renderWeeks();
        this.updateWeekSelect();
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

    handleLinkSubmit(e) {
        e.preventDefault();
        
        const newLink = {
            id: Date.now(),
            title: this.linkTitleInput.value,
            url: this.linkUrlInput.value,
            weekId: parseInt(this.linkWeekSelect.value)
        };

        this.links.push(newLink);
        this.saveLinks();
        this.renderWeeks();
        this.closeModalHandler();
    }

    deleteLink(linkId) {
        this.links = this.links.filter(link => link.id !== linkId);
        this.saveLinks();
        this.renderWeeks();
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
            const weekLinks = this.links.filter(link => link.weekId === week.id);
            const weekElement = this.createWeekElement(week, weekLinks);
            this.weeksContainer.appendChild(weekElement);
        });
    }

    saveLinks() {
        localStorage.setItem('links', JSON.stringify(this.links));
    }

    saveWeeks() {
        localStorage.setItem('weeks', JSON.stringify(this.weeks));
    }

    createNewWeek() {
        Swal.fire({
            title: '¿Crear nueva semana?',
            text: `Se creará la Semana ${this.weeks.length + 1}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar',
            background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50'
        }).then((result) => {
            if (result.isConfirmed) {
                const newWeekId = this.weeks.length + 1;
                const newWeek = {
                    id: newWeekId,
                    name: `Semana ${newWeekId}`,
                    isCollapsed: false
                };
                
                this.weeks.push(newWeek);
                this.saveWeeks();
                this.renderWeeks();
                this.updateWeekSelect();

                Swal.fire({
                    title: '¡Semana creada!',
                    text: `Se ha creado la Semana ${newWeekId} exitosamente`,
                    icon: 'success',
                    timer: 2000,
                    background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
                    color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50'
                });
            }
        });
    }

    handleLinkSubmit(e) {
        e.preventDefault();
        
        const newLink = {
            id: Date.now(),
            title: this.linkTitleInput.value,
            url: this.linkUrlInput.value,
            weekId: parseInt(this.linkWeekSelect.value)
        };

        this.links.push(newLink);
        this.saveLinks();
        this.renderWeeks();
        this.closeModalHandler();

        Swal.fire({
            title: '¡Link agregado!',
            text: 'El link se ha agregado exitosamente',
            icon: 'success',
            timer: 2000,
            background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50'
        });
    }

    deleteLink(linkId) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50'
        }).then((result) => {
            if (result.isConfirmed) {
                this.links = this.links.filter(link => link.id !== linkId);
                this.saveLinks();
                this.renderWeeks();
                
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El link ha sido eliminado',
                    icon: 'success',
                    timer: 2000,
                    background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
                    color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50'
                });
            }
        });
    }
}


// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new LinkManager();
});