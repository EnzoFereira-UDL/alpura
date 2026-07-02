/* ==============================================
   ALPURA – index.js
   Interactive behaviors: Loader, Nav, Slider,
   Scroll Reveal, Stats Counter, Back-to-Top
   ============================================== */

(function () {
    'use strict';

    /* ── 1. DOM READY ── */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initLoader();
        initNav();
        initMobileMenu();
        initSearch();
        initHeroSlider();
        initScrollReveal();
        initStatsCounter();
        initBackToTop();
        initAuth();
    }

    /* ── 2. LOADER ── */
    function initLoader() {
        const loader = document.getElementById('page-loader');
        if (!loader) return;

        // Hide loader after 2s or when page is loaded
        const hide = () => {
            setTimeout(() => loader.classList.add('hidden'), 200);
        };

        if (document.readyState === 'complete') {
            setTimeout(hide, 600);
        } else {
            window.addEventListener('load', () => setTimeout(hide, 600));
            // Fallback after 2.5s
            setTimeout(hide, 2500);
        }
    }

    /* ── 3. NAVBAR – scroll glass effect ── */
    function initNav() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run on init
    }

    /* ── 4. MOBILE MENU ── */
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!hamburger || !mobileMenu) return;

        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── 5. SEARCH ── */
    function initSearch() {
        const btnSearch = document.getElementById('btn-search');
        const searchBar = document.getElementById('search-bar');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');
        if (!btnSearch || !searchBar) return;

        btnSearch.addEventListener('click', () => {
            searchBar.classList.add('open');
            setTimeout(() => searchInput && searchInput.focus(), 350);
        });

        searchClose && searchClose.addEventListener('click', () => {
            searchBar.classList.remove('open');
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') searchBar.classList.remove('open');
        });
    }

    /* ── 6. HERO SLIDER ── */
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        if (!slides.length) return;

        let current = 0;
        let timer = null;
        const INTERVAL = 6000;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current] && dots[current].classList.remove('active');

            current = (index + slides.length) % slides.length;

            slides[current].classList.add('active');
            dots[current] && dots[current].classList.add('active');
        }

        function startAuto() {
            clearInterval(timer);
            timer = setInterval(() => goTo(current + 1), INTERVAL);
        }

        // Dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goTo(i); startAuto(); });
        });

        // Arrows
        prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
        nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

        // Touch / swipe
        let touchStart = 0;
        const slider = document.getElementById('hero-slider');
        if (slider) {
            slider.addEventListener('touchstart', e => {
                touchStart = e.touches[0].clientX;
            }, { passive: true });
            slider.addEventListener('touchend', e => {
                const diff = touchStart - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    goTo(diff > 0 ? current + 1 : current - 1);
                    startAuto();
                }
            }, { passive: true });
        }

        startAuto();
    }

    /* ── 7. SCROLL REVEAL ── */
    function initScrollReveal() {
        const targets = [
            '.cat-card',
            '.value-card',
            '.recipe-card',
            '.featured-img-wrap',
            '.featured-content',
            '.stat-item',
            '.sust-content',
        ];

        targets.forEach((selector, sIdx) => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                if (i < 4) el.classList.add(`reveal-delay-${i + 1}`);
            });
        });

        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('reveal');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    /* ── 8. STATS COUNTER ── */
    function initStatsCounter() {
        const statNums = document.querySelectorAll('.stat-num');
        if (!statNums.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStat(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => observer.observe(el));
    }

    function animateStat(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    /* ── 9. BACK TO TOP ── */
    function initBackToTop() {
        const btn = document.getElementById('back-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── 10. SMOOTH ANCHOR SCROLLING ── */
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 76;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });

    /* ── 11. AUTHENTICATION & API INTEGRATION (V2 WITH AVATARS) ── */
    function initAuth() {
        const btnUser = document.getElementById('btn-user');
        const authModal = document.getElementById('auth-modal');
        const authClose = document.getElementById('auth-close');
        const authOverlay = document.getElementById('auth-overlay');
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const updateForm = document.getElementById('update-profile-form');
        const authTitle = document.getElementById('auth-title');

        const btnLogoutTrigger = document.getElementById('btn-logout-trigger');
        const logoutConfirmBox = document.getElementById('logout-confirm-box');
        const btnLogoutConfirm = document.getElementById('btn-logout-confirm');
        const btnLogoutCancel = document.getElementById('btn-logout-cancel');

        const API_BASE = 'https://eferreira.pythonanywhere.com';

        // ── FUNCIÓN DE ALERTA PERSONALIZADA (TOAST) ──
        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            let icon = 'ℹ️';
            if (type === 'success') icon = '✅';
            if (type === 'error') icon = '❌';

            toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        // =======================================================
        // LÓGICA DE AVATARES Y CROPPER.JS
        // =======================================================
        let currentRegAvatar = "avatar1.png";
        let currentUpdateAvatar = null;
        let cropperInstance = null;
        let cropperTargetType = "";
        const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

        function handleFileSelection(e, targetType) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > MAX_IMAGE_SIZE) {
                showToast("La imagen supera el límite permitido de 2MB.", "error");
                e.target.value = "";
                return;
            }

            cropperTargetType = targetType;
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageToCrop = document.getElementById("image-to-crop");
                imageToCrop.src = event.target.result;

                document.getElementById("cropper-modal").style.display = "flex";

                if (cropperInstance) cropperInstance.destroy();
                cropperInstance = new Cropper(imageToCrop, {
                    aspectRatio: 1,
                    viewMode: 1,
                    background: false,
                    autoCropArea: 0.9
                });
            };
            reader.readAsDataURL(file);
        }

        document.getElementById("reg-file-input")?.addEventListener("change", (e) => handleFileSelection(e, "register"));
        document.getElementById("update-file-input")?.addEventListener("change", (e) => handleFileSelection(e, "update"));

        document.getElementById("btn-cancel-crop")?.addEventListener("click", () => {
            document.getElementById("cropper-modal").style.display = "none";
            if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
            const regInput = document.getElementById("reg-file-input");
            const updateInput = document.getElementById("update-file-input");
            if (regInput) regInput.value = "";
            if (updateInput) updateInput.value = "";
        });

        document.getElementById("btn-confirm-crop")?.addEventListener("click", () => {
            if (!cropperInstance) return;

            const canvas = cropperInstance.getCroppedCanvas({ width: 200, height: 200 });
            const base64Image = canvas.toDataURL("image/jpeg");

            if (cropperTargetType === "register") {
                currentRegAvatar = base64Image;
                document.getElementById("reg-avatar-preview-img").src = base64Image;
                document.querySelectorAll(".preset-item").forEach(item => item.classList.remove("active"));
            } else if (cropperTargetType === "update") {
                currentUpdateAvatar = base64Image;
                document.getElementById("update-avatar-preview-img").src = base64Image;
                document.querySelectorAll(".preset-item-update").forEach(item => item.classList.remove("active"));
            }

            document.getElementById("cropper-modal").style.display = "none";
            cropperInstance.destroy();
            cropperInstance = null;
        });

        document.querySelectorAll(".preset-item").forEach(item => {
            item.addEventListener("click", (e) => {
                document.querySelectorAll(".preset-item").forEach(i => i.classList.remove("active"));
                e.target.classList.add("active");
                currentRegAvatar = e.target.dataset.avatar;
                document.getElementById("reg-avatar-preview-img").src = `${API_BASE}/static/avatars/${currentRegAvatar}`;
                document.getElementById("reg-file-input").value = "";
            });
        });

        document.querySelectorAll(".preset-item-update").forEach(item => {
            item.addEventListener("click", (e) => {
                document.querySelectorAll(".preset-item-update").forEach(i => i.classList.remove("active"));
                e.target.classList.add("active");
                currentUpdateAvatar = e.target.dataset.avatar;
                document.getElementById("update-avatar-preview-img").src = `${API_BASE}/static/avatars/${currentUpdateAvatar}`;
                document.getElementById("update-file-input").value = "";
            });
        });


        // Inicializar estado visual de sesión al cargar la app 
        checkSession();

        // Control del botón de usuario en la Navbar
        btnUser?.addEventListener('click', () => {
            authModal.classList.add('open');
            checkSession();
        });

        const closeModal = () => {
            authModal.classList.remove('open');
            resetLogoutBox();
            clearForms();
        };
        authClose?.addEventListener('click', closeModal);
        authOverlay?.addEventListener('click', closeModal);

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                forms.forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.target}-form`).classList.add('active');
                clearForms();
            });
        });

        // =======================================================
        // ACCIÓN 1: LOGIN
        // =======================================================
        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            const submitBtn = loginForm.querySelector('.auth-submit');

            errorDiv.textContent = '';
            submitBtn.textContent = 'Verificando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Error de credenciales');

                localStorage.setItem('alpura_user', JSON.stringify(data.user));

                checkSession();
                closeModal();
                showToast(`¡Bienvenido de vuelta, ${data.user.name}!`, 'success');

            } catch (err) {
                errorDiv.textContent = err.message;
                showToast(err.message, 'error');
            } finally {
                submitBtn.textContent = 'Entrar';
                submitBtn.disabled = false;
            }
        });

        // =======================================================
        // ACCIÓN 2: REGISTRO
        // =======================================================

        registerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const errorDiv = document.getElementById('register-error');
            const successDiv = document.getElementById('register-success');
            const submitBtn = registerForm.querySelector('.auth-submit');

            errorDiv.textContent = '';
            successDiv.textContent = '';
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        avatar: currentRegAvatar // Avatar añadido
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Error al registrar');

                successDiv.textContent = '¡Registro exitoso!';
                showToast('Cuenta creada. Ya puedes iniciar sesión.', 'success');
                registerForm.reset();

                // Reset de avatar UI
                currentRegAvatar = "avatar1.png";
                document.getElementById("reg-avatar-preview-img").src = `${API_BASE}/static/avatars/avatar1.png`;
                document.querySelectorAll(".preset-item").forEach(i => i.classList.remove("active"));
                const firstPreset = document.querySelector(".preset-item[data-avatar='avatar1.png']");
                if (firstPreset) firstPreset.classList.add("active");

                setTimeout(() => { tabs[0].click(); }, 1500);

            } catch (err) {
                errorDiv.textContent = err.message;
                showToast(err.message, 'error');
            } finally {
                submitBtn.textContent = 'Crear cuenta';
                submitBtn.disabled = false;
            }
        });

        // =======================================================
        // ACCIÓN 3: MODIFICAR USUARIO
        // =======================================================

        updateForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const sessionUser = JSON.parse(localStorage.getItem('alpura_user'));
            if (!sessionUser) return;

            const newName = document.getElementById('update-name').value;
            const newPassword = document.getElementById('update-password').value;
            const submitBtn = updateForm.querySelector('.auth-submit');

            submitBtn.textContent = 'Guardando cambios...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE}/users/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email_actual: sessionUser.email,
                        new_name: newName || null,
                        new_password: newPassword || null,
                        new_avatar: currentUpdateAvatar || null // Avatar modificado
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'No se pudieron actualizar los datos');

                sessionUser.name = data.user.name;
                sessionUser.avatar = data.user.avatar; // Guardar nuevo avatar localmente
                localStorage.setItem('alpura_user', JSON.stringify(sessionUser));

                checkSession();
                document.getElementById('update-password').value = '';
                currentUpdateAvatar = null;
                showToast('¡Tus datos han sido modificados con éxito!', 'success');

            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                submitBtn.textContent = 'Guardar Cambios';
                submitBtn.disabled = false;
            }
        });

        // =======================================================
        // ACCIÓN 4: FLUJO DE CIERRE DE SESIÓN ANIMADO
        // =======================================================
        btnLogoutTrigger?.addEventListener('click', () => {
            btnLogoutTrigger.style.display = 'none';
            logoutConfirmBox.style.display = 'block';
        });

        btnLogoutCancel?.addEventListener('click', resetLogoutBox);

        btnLogoutConfirm?.addEventListener('click', () => {
            localStorage.removeItem('alpura_user');
            checkSession();
            closeModal();
            showToast('Sesión finalizada correctamente. ¡Vuelve pronto!', 'info');
        });

        function resetLogoutBox() {
            if (logoutConfirmBox) logoutConfirmBox.style.display = 'none';
            if (btnLogoutTrigger) btnLogoutTrigger.style.display = 'block';
        }

        function clearForms() {
            loginForm?.reset();
            registerForm?.reset();
            if (document.getElementById('login-error')) document.getElementById('login-error').textContent = '';
            if (document.getElementById('register-error')) document.getElementById('register-error').textContent = '';
            if (document.getElementById('register-success')) document.getElementById('register-success').textContent = '';
        }

        // =======================================================
        // CONTROLADOR DE ESTADOS DE LA APLICACIÓN
        // =======================================================
        function checkSession() {
            const userString = localStorage.getItem('alpura_user');

            if (userString) {
                const user = JSON.parse(userString);

                btnUser?.classList.add('logged-in');
                authModal?.classList.add('logged-in-state');
                if (authTitle) authTitle.textContent = 'Mi Perfil Alpura';

                const nameDisplay = document.getElementById('profile-user-name');
                const emailDisplay = document.getElementById('profile-user-email');
                const inputName = document.getElementById('update-name');

                if (nameDisplay) nameDisplay.textContent = `Hola, ${user.name}`;
                if (emailDisplay) emailDisplay.textContent = user.email;
                if (inputName && !inputName.value) inputName.value = user.name;

                // Pintar avatar en el dashboard
                const profileAvatarBox = document.querySelector('.profile-avatar');
                if (profileAvatarBox && user.avatar) {
                    // Limpia clases anteriores por si acaso e inyecta la imagen directamente
                    profileAvatarBox.innerHTML = `<img src="${API_BASE}/static/avatars/${user.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:2px solid var(--blue-sky);">`;
                }

                // Cargar avatar actual en la vista previa del modificar
                const updatePreviewImg = document.getElementById('update-avatar-preview-img');
                if (updatePreviewImg && user.avatar) {
                    updatePreviewImg.src = `${API_BASE}/static/avatars/${user.avatar}`;
                }

                // Limpiar estados activos de las miniaturas en la modificación
                document.querySelectorAll(".preset-item-update").forEach(i => i.classList.remove("active"));
                const historialContainer = document.getElementById("historial-avatares");
                if (historialContainer && user.history && user.history.length > 0) {
                    historialContainer.innerHTML = '<h4>Usadas anteriormente</h4>';

                    user.history.forEach(imgName => {
                        const imgEl = document.createElement("img");
                        imgEl.src = `${API_BASE}/static/avatars/${imgName}`;
                        imgEl.classList.add("preset-item-update");

                        // Estilos opcionales para que se vean bien
                        imgEl.style.width = "50px";
                        imgEl.style.height = "50px";
                        imgEl.style.borderRadius = "50%";
                        imgEl.style.cursor = "pointer";
                        imgEl.style.objectFit = "cover";

                        imgEl.addEventListener("click", () => {
                            // Limpiamos los activos de las demás
                            document.querySelectorAll(".preset-item-update").forEach(i => i.classList.remove("active"));
                            imgEl.classList.add("active");

                            // Reemplaza "avatarSeleccionado" por la variable global que estés usando 
                            // en tu JS para guardar la foto antes de hacer el fetch de actualizar
                            avatarSeleccionado = imgName;
                        });

                        historialContainer.appendChild(imgEl);
                    });
                }
                const btnListUsers = document.getElementById('btn-list-users');
                const usersListModal = document.getElementById('users-list-modal');
                const usersListContent = document.getElementById('users-list-content');

                if (btnListUsers) {
                    btnListUsers.style.display = 'block'; // Mostrar solo si está logueado
                    
                    btnListUsers.onclick = async () => {
                        // Alternar visibilidad (si ya está abierto, lo cierra)
                        if (usersListModal.style.display === 'block') {
                            usersListModal.style.display = 'none';
                            return;
                        }
                        
                        try {
                            const response = await fetch(`${API_BASE}/users`);
                            if (!response.ok) throw new Error("No se pudo obtener la lista");
                            const usuarios = await response.json();
                            
                            usersListContent.innerHTML = ''; // Limpiar lista previa
                            
                            usuarios.forEach(u => {
                                const userItem = document.createElement('div');
                                userItem.style.display = 'flex';
                                userItem.style.alignItems = 'center';
                                userItem.style.gap = '12px';
                                userItem.style.padding = '8px';
                                userItem.style.borderBottom = '1px solid #f0f0f0';
                                
                                userItem.innerHTML = `
                                    <img src="${API_BASE}/static/avatars/${u.avatar || 'default-avatar.png'}" 
                                         style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #ccc;">
                                    <div>
                                        <strong style="display: block; font-size: 14px; color: #333;">${u.name}</strong>
                                        <span style="font-size: 12px; color: #666;">${u.email}</span>
                                    </div>
                                `;
                                usersListContent.appendChild(userItem);
                            });
                            
                            usersListModal.style.display = 'block';
                        } catch (err) {
                            console.error(err);
                            alert("Error al cargar la lista de usuarios.");
                        }
                    };
                }
            } else {
                btnUser?.classList.remove('logged-in');
                authModal?.classList.remove('logged-in-state');
                if (authTitle) authTitle.textContent = 'Bienvenido';

                const btnListUsers = document.getElementById('btn-list-users');
                const usersListModal = document.getElementById('users-list-modal');
                if (btnListUsers) btnListUsers.style.display = 'none';
                if (usersListModal) usersListModal.style.display = 'none';

                resetLogoutBox();
            }
        }
    }

})();