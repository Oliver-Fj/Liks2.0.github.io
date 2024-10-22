class LinkManager {
    constructor() {
        this.links = [];
        this.weeks = [];
        this.currentTheme = 'light';
        this.programmingIcons = [
            'fa-code', 'fa-terminal', 'fa-bug', 'fa-laptop-code',
            'fa-database', 'fa-microchip', 'fa-code-branch'
        ];
        this.neonColors = ['btn-neon-purple', 'btn-neon-blue', 'btn-neon-green'];
        this.API_URL = this.getApiUrl(); // Cambia esto a la URL de tu backend en producción
        this.isAdmin = false;
        this.initializeElements();
        this.setupEventListeners();
        this.loadData();
        this.updateAdminButtons(false);
    }

    // Método para obtener la URL de la API según el entorno
    getApiUrl() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000/api';
        } else {
            // Reemplaza esta URL con tu dominio de InfinityFree
            return 'oliverlinksmanager.kesug.com';
        }
    }

    initializeElements() {
        // Botones y modales
        this.linkModal = document.getElementById('linkModal');
        this.closeModal = document.querySelector('.close');
        this.linkForm = document.getElementById('linkForm');
        this.weeksContainer = document.getElementById('weeksContainer');
        this.themeToggle = document.getElementById('themeToggle');
        this.searchInput = document.getElementById('searchInput');
        this.noResults = document.getElementById('noResults');
        this.addWeekBtn = document.getElementById('addWeekBtn');
        this.addLinkBtn = document.getElementById('addLinkBtn');

        // Quitar cualquier clase admin-only si existe
        this.addWeekBtn.classList.remove('admin-only');
        this.addLinkBtn.classList.remove('admin-only');
        
        // Campos del formulario
        this.linkTitleInput = document.getElementById('linkTitle');
        this.linkUrlInput = document.getElementById('linkUrl');
        this.linkWeekSelect = document.getElementById('linkWeek');

        // Botones de autenticación
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Aplicar estilos neón a los botones principales
        this.addWeekBtn.classList.add('btn-neon-purple', 'btn-disabled');
        this.addLinkBtn.classList.add('btn-neon-blue', 'btn-disabled');
        /* this.addWeekBtn.disabled = true;
        this.addLinkBtn.disabled = true; */

        // Botones de administrador
        this.addWeekBtn = document.getElementById('addWeekBtn');
        this.addLinkBtn = document.getElementById('addLinkBtn');
    
        this.addWeekBtn.classList.add('btn-disabled');
        this.addLinkBtn.classList.add('btn-disabled');
        
    }

    updateAdminButtons(isAdmin) {
        /* this.addWeekBtn.disabled = !isAdmin;
        this.addLinkBtn.disabled = !isAdmin; */
        
        // Actualizar clases para estilos visuales
        if (isAdmin) {
            this.addWeekBtn.classList.remove('btn-disabled');
            this.addLinkBtn.classList.remove('btn-disabled');
            /* this.addWeekBtn.classList.add('btn-neon-purple');
            this.addLinkBtn.classList.add('btn-neon-blue'); */
        } else {
            this.addWeekBtn.classList.add('btn-disabled');
            this.addLinkBtn.classList.add('btn-disabled');
            /* this.addWeekBtn.classList.remove('btn-neon-purple');
            this.addLinkBtn.classList.remove('btn-neon-blue'); */
        }
    }

    setupEventListeners() {
        // Remover los event listeners duplicados y asegurarnos de tener solo estos
        this.addWeekBtn.addEventListener('click', () => this.handleWeekButtonClick());
        this.addLinkBtn.addEventListener('click', () => this.handleLinkButtonClick());
        this.closeModal.addEventListener('click', () => this.closeModalHandler());
        this.linkForm.addEventListener('submit', (e) => this.handleLinkSubmit(e));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.loginBtn.addEventListener('click', () => this.showLoginModal());
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.linkModal) {
                this.closeModalHandler();
            }
        });
    }
    
    // Añadir estos dos métodos para manejar los clics de los botones
    handleWeekButtonClick() {
        if (!this.isAdmin) {
            Swal.fire({
                title: 'Acceso Denegado',
                /* text: 'Debes iniciar sesión como administrador para crear semanas', */
                html: '<span style="color: orange;">Debes iniciar sesión como administrador para crear semanas</span>',
                /* icon: 'error', */
                iconHtml: '<i class="fas fas fa-lock fa-pulse" style="color: orange  ;"></i>',
                showCancelButton: true,
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showLoginModal();
                }
            });
            return;
        }
        this.createNewWeek();
    }
    
    handleLinkButtonClick() {
        if (!this.isAdmin) {
            Swal.fire({
                title: 'Acceso Denegado',
                html: '<span style="color: orange;">Debes iniciar sesión como administrador para crear enlaces</span>',
                /* text: 'Debes iniciar sesión como administrador para crear enlaces', */
                /* icon: 'warning', */
                iconHtml: '<i class="fas fas fa-lock fa-pulse" style="color: orange  ;"></i>',
                showCancelButton: true,
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showLoginModal();
                }
            });
            return;
        }
        this.openModal();
    }



    async loadData() {
        try {
            const [linksResponse, weeksResponse, userResponse] = await Promise.all([
                fetch(`${this.API_URL}/links`),
                fetch(`${this.API_URL}/weeks`),
                fetch(`${this.API_URL}/user`)
            ]);
            
            if (!linksResponse.ok || !weeksResponse.ok || !userResponse.ok) {
                throw new Error('Error al cargar los datos');
            }

            const linksData = await linksResponse.json();
            const weeksData = await weeksResponse.json();
            const userData = await userResponse.json();

            this.links = linksData.records || [];
            this.weeks = weeksData.records || [];
            
            // Solo actualizamos isAdmin si no estamos ya autenticados
            if (!this.isAdmin) {
                this.isAdmin = userData.isAdmin;
            }

            this.renderWeeks();
            this.updateWeekSelect();
            this.updateUIForAuth();
            this.updateAdminButtons(this.isAdmin);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        }
    }

    showLoginModal() {
        Swal.fire({
            title: 'Iniciar sesión',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Usuario">' +
                '<input id="swal-input2" class="swal2-input" type="password" placeholder="Contraseña">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.login(result.value[0], result.value[1]);
            }
        });
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            console.log('Respuesta del servidor:', response.status);
    
            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Para debugging
    
            if (response.ok) {
                this.isAdmin = true;
                this.updateAdminButtons(true);
                this.updateUIForAuth();
                Swal.fire('¡Bienvenido!', 'Has iniciado sesión correctamente', 'success');
            } else {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en login:', error);
            Swal.fire('Error', error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.', 'error');
        }
    }

    async loadData() {
        try {
            const responses = await Promise.all([
                fetch(`${this.API_URL}/links`),
                fetch(`${this.API_URL}/weeks`),
                fetch(`${this.API_URL}/user`)
            ]);
            const [linksData, weeksData, userData] = await Promise.all(responses.map(r => r.json()));
            this.links = linksData.records || [];
            this.weeks = weeksData.records || [];
            this.isAdmin = userData.isAdmin;
            this.renderWeeks();
            this.updateWeekSelect();
            this.updateUIForAuth();
        } catch (error) {
            console.error('Error cargando datos:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        }

    }

    logout() {
        this.isAdmin = false;
        this.removeToken();
        this.updateAdminButtons(false);
        this.updateUIForAuth();
        Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente', 'info');
    }

    updateUIForAuth() {
        const adminElements = document.querySelectorAll('.admin-only:not(#addWeekBtn):not(#addLinkBtn)');
        adminElements.forEach(el => {
            el.style.display = this.isAdmin ? 'inline-block' : 'none';
        });
        this.loginBtn.style.display = this.isAdmin ? 'none' : 'inline-block';
        this.logoutBtn.style.display = this.isAdmin ? 'inline-block' : 'none';

        // Actualizar estado visual de los botones
        this.updateAdminButtons(this.isAdmin);

        this.renderWeeks();
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
        if (!this.isAdmin) {
            Swal.fire({
                title: 'Acceso Denegado',
                text: 'Debes iniciar sesión como administrador para crear una semana',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showLoginModal();
                }
            });
            return;
        }

        const nextWeekNumber = this.weeks.length + 1;
        const { value: weekName } = await Swal.fire({
            title: 'Crear nueva semana',
            input: 'text',
            inputLabel: 'Nombre de la semana',
            inputValue: `Semana ${nextWeekNumber}`,
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
                        'Authorization': `Bearer ${this.getToken()}`,
                    },
                    body: JSON.stringify({ name: weekName, is_collapsed: false }),
                });

                if (!response.ok) {
                    throw new Error('Error al crear la semana');
                }

                await this.refreshData();
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
        
        if (!this.isAdmin) {
            Swal.fire('Acceso denegado', 'Debes iniciar sesión como administrador para agregar un enlace', 'warning');
            return;
        }

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
                    'Authorization': `Bearer ${this.getToken()}`,
                },
                body: JSON.stringify(newLink),
            });

            if (!response.ok) {
                throw new Error('Error al crear el link');
            }

            await this.refreshData();
            this.closeModalHandler();

            Swal.fire('¡Link agregado!', 'El link se ha agregado exitosamente', 'success');
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo agregar el link', 'error');
        }
    }

    async refreshData() {
        try {
            const [linksResponse, weeksResponse] = await Promise.all([
                fetch(`${this.API_URL}/links`),
                fetch(`${this.API_URL}/weeks`)
            ]);
            
            if (!linksResponse.ok || !weeksResponse.ok) {
                throw new Error('Error al actualizar los datos');
            }

            const linksData = await linksResponse.json();
            const weeksData = await weeksResponse.json();

            this.links = linksData.records || [];
            this.weeks = weeksData.records || [];

            this.renderWeeks();
            this.updateWeekSelect();
            // No actualizamos el estado de autenticación aquí
        } catch (error) {
            console.error('Error al refrescar datos:', error);
            Swal.fire('Error', 'No se pudieron actualizar los datos', 'error');
        }
    }

    async deleteLink(linkId) {
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
    
            // Actualizar datos sin afectar la sesión
            await this.refreshData();
            Swal.fire('¡Eliminado!', 'El link ha sido eliminado', 'success');
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo eliminar el link', 'error');
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    openModal() {
        if (!this.isAdmin) {
            Swal.fire({
                title: 'Acceso Denegado',
                text: 'Debes iniciar sesión como administrador para agregar un enlace',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showLoginModal();
                }
            });
            return;
        }
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

        const weekNumber = parseInt(week.name.match(/\d+/)[0]);
        
        for (let i = 0; i < weekNumber; i++) {
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
        
        if (!this.isAdmin) {
            deleteBtn.classList.add('btn-disabled');
        }
        
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (!this.isAdmin) {
                Swal.fire({
                    title: 'Acceso Denegado',
                    /* text: 'Debes iniciar sesión como administrador para eliminar enlaces', */
                    html: '<span style="color: orange;">Debes iniciar sesión como administrador para eliminar enlaces</span>', 
                    /* icon: 'warning', */
                    iconHtml: '<i class="fas fas fa-lock fa-pulse" style="color: orange  ;"></i>',
                    showCancelButton: true,
                    confirmButtonText: 'Iniciar Sesión',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.showLoginModal();
                    }
                });
                return;
            }
    
            // Si es admin, mostrar confirmación de eliminación
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteLink(link.id);
                }
            });
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
                        'Authorization': `Bearer ${this.getToken()}`,
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
                console.log(data.message);
                this.renderWeeks();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'No se pudo actualizar el estado de la semana', 'error');
                week.is_collapsed = !week.is_collapsed;
            }
        }
    }

    // Métodos auxiliares para manejar el token
    getToken() {
        return sessionStorage.getItem('token');
    }

    setToken(token) {
        sessionStorage.setItem('token', token);
    }

    removeToken() {
        sessionStorage.removeItem('token');
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new LinkManager();
});