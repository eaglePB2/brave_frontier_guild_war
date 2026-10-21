(function () {
    let highestZ = 100;
    const startMenu = document.getElementById('start-menu-modal');
    const taskbarApps = document.getElementById('taskbar-apps');

    function bringToFront(win) {
        highestZ++;
        win.style.zIndex = highestZ;
        updateTaskbarActive(win.id);
    }

    // --- 任务栏同步机制 ---
    function updateTaskbarActive(activeId) {
        if (!taskbarApps) return;
        taskbarApps.querySelectorAll('.taskbar-item').forEach(item => {
            if (item.dataset.target === activeId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function ensureTaskbarItem(win) {
        if (!taskbarApps) return;
        let item = taskbarApps.querySelector(`[data-target="${win.id}"]`);
        if (!item) {
            item = document.createElement('div');
            item.className = 'taskbar-item active';
            item.dataset.target = win.id;

            // 获取窗口标题与对应图标
            const title = win.querySelector('.text-tabs')?.textContent || win.id;
            const iconImg = document.querySelector(`.app-launcher[href="#${win.id}"] img`);
            const imgSrc = iconImg ? iconImg.src : 'assets/favicons/favicon-32x32.png';

            item.innerHTML = `<img src="${imgSrc}" alt=""><span>${title}</span>`;
            
            // 点击任务栏：如果处于前台则最小化，否则置顶展示
            item.addEventListener('click', () => {
                const isVisible = win.style.display !== 'none';
                const isTop = parseInt(win.style.zIndex) === highestZ;

                if (isVisible && isTop) {
                    minimizeWindow(win);
                } else {
                    win.style.display = 'block';
                    bringToFront(win);
                }
            });

            taskbarApps.appendChild(item);
        }
        updateTaskbarActive(win.id);
    }

    function removeTaskbarItem(winId) {
        if (!taskbarApps) return;
        const item = taskbarApps.querySelector(`[data-target="${winId}"]`);
        if (item) item.remove();
    }

    // --- 最小化与最大化核心动作 ---
    function minimizeWindow(win) {
        win.style.display = 'none';
        if (taskbarApps) {
            const item = taskbarApps.querySelector(`[data-target="${win.id}"]`);
            if (item) item.classList.remove('active');
        }
    }

    function toggleMaximize(win) {
        const isMax = win.classList.toggle('is-maximized');
        const icon = win.querySelector('.btn-maximize i');
        if (icon) {
            // 最大化与还原状态的图标切换
            icon.className = isMax ? 'far fa-window-restore' : 'far fa-square';
        }
        bringToFront(win);
    }

    // --- 启动窗口 ---
    document.querySelectorAll('.app-launcher').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const win = document.getElementById(targetId);
            
            if (win) {
                win.style.display = 'block';
                bringToFront(win);
                ensureTaskbarItem(win);
                
                if (!win.dataset.positioned) {
                    const rect = win.getBoundingClientRect();
                    win.style.top = Math.max(20, (window.innerHeight - rect.height) / 2) + 'px';
                    win.style.left = Math.max(20, (window.innerWidth - rect.width) / 2) + 'px';
                    win.style.transform = 'none';
                    win.dataset.positioned = "true";
                }

                if (startMenu && startMenu.contains(link)) {
                    startMenu.style.display = 'none';
                }
            }
        });
    });

    // --- 窗口三键控制 ---
    document.querySelectorAll('.chrome').forEach(win => {
        // 关闭
        win.querySelectorAll('.btn-close, .close-tabs').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                win.style.display = 'none';
                removeTaskbarItem(win.id);
            });
        });

        // 最小化
        win.querySelectorAll('.btn-minimize').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                minimizeWindow(win);
            });
        });

        // 最大化 / 还原
        win.querySelectorAll('.btn-maximize').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMaximize(win);
            });
        });

        // 双击标题栏原生触发最大化/还原
        const handle = win.querySelector('.drag-handle') || win;
        handle.addEventListener('dblclick', (e) => {
            if (e.target.closest('.chrome-close a') || e.target.closest('.close-tabs')) return;
            toggleMaximize(win);
        });

        // --- 拖拽逻辑 (最大化状态下禁止拖动) ---
        handle.addEventListener('mousedown', (e) => {
            bringToFront(win);

            if (win.classList.contains('is-maximized')) return; // 最大化禁止拖动
            if (e.target.closest('.chrome-close a') || e.target.closest('.close-tabs')) return;

            e.preventDefault();
            let startX = e.clientX;
            let startY = e.clientY;
            let initialLeft = win.offsetLeft;
            let initialTop = win.offsetTop;

            function onMouseMove(moveEvent) {
                win.style.left = (initialLeft + (moveEvent.clientX - startX)) + 'px';
                win.style.top = (initialTop + (moveEvent.clientY - startY)) + 'px';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        win.addEventListener('mousedown', () => bringToFront(win));
    });

    // --- 开始菜单控制 ---
    const startBtn = document.getElementById('start-menu');
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isVisible = startMenu.style.display === 'grid';
            startMenu.style.display = isVisible ? 'none' : 'grid';
        });

        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && e.target !== startBtn) {
                startMenu.style.display = 'none';
            }
        });
    }
})();