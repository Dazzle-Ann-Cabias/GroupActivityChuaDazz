const gameState = {
            moves: 0,
            time: 0,
            matched: 0,
            totalObjects: 8,
            gameActive: true,
            timer: null
        };

        const objects = [
            { name: '🪑 Chair', emoji: '🪑', color: '#FF6B6B' },
            { name: '🛋️ Sofa', emoji: '🛋️', color: '#4ECDC4' },
            { name: '🪞 Mirror', emoji: '🪞', color: '#95E1D3' },
            { name: '💡 Lamp', emoji: '💡', color: '#FFE66D' },
            { name: '🚪 Door', emoji: '🚪', color: '#8B4513' },
            { name: '📚 Bookshelf', emoji: '📚', color: '#6C5CE7' },
            { name: '🖼️ Picture', emoji: '🖼️', color: '#A29BFE' },
            { name: '🪴 Plant', emoji: '🪴', color: '#55EFC4' }
        ];

        function initGame() {
            gameState.moves = 0;
            gameState.time = 0;
            gameState.matched = 0;
            gameState.gameActive = true;
            
            clearInterval(gameState.timer);
            
            const room = document.getElementById('room');
            const objectsList = document.getElementById('objectsList');
            
            // Clear previous content
            room.querySelectorAll('.correct-spot').forEach(el => el.remove());
            objectsList.innerHTML = '';
            
            // Create spots in room and objects in list
            objects.forEach((obj, index) => {
                // Create spot in room
                const spot = document.createElement('div');
                spot.className = 'correct-spot';
                spot.innerHTML = obj.emoji;
                spot.style.width = '80px';
                spot.style.height = '80px';
                spot.style.left = (50 + (index % 4) * 130) + 'px';
                spot.style.top = (270 + Math.floor(index / 4) * 100) + 'px';
                spot.dataset.index = index;
                room.appendChild(spot);
                
                // Create object in list
                const objElement = document.createElement('div');
                objElement.className = 'draggable-object';
                objElement.innerHTML = `${obj.emoji} ${obj.name}`;
                objElement.dataset.index = index;
                objElement.style.background = `linear-gradient(135deg, ${obj.color} 0%, ${adjustBrightness(obj.color, -20)} 100%)`;
                objElement.draggable = true;
                
                objElement.addEventListener('dragstart', handleDragStart);
                objElement.addEventListener('dragend', handleDragEnd);
                
                objectsList.appendChild(objElement);
            });
            
            // Create drop zones
            document.querySelectorAll('.correct-spot').forEach(spot => {
                spot.addEventListener('dragover', handleDragOver);
                spot.addEventListener('drop', handleDrop);
                spot.addEventListener('dragleave', handleDragLeave);
            });
            
            updateStats();
            startTimer();
        }

        let draggedElement = null;

        function handleDragStart(e) {
            if (!gameState.gameActive || this.classList.contains('placed')) return;
            draggedElement = this;
            this.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragEnd(e) {
            if (draggedElement) {
                draggedElement.style.opacity = draggedElement.classList.contains('placed') ? '0.5' : '1';
                draggedElement = null;
            }
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.style.background = 'rgba(76, 175, 80, 0.3)';
        }

        function handleDragLeave(e) {
            if (e.target === this) {
                this.style.background = 'rgba(76, 175, 80, 0.1)';
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            this.style.background = 'rgba(76, 175, 80, 0.1)';
            
            if (!draggedElement || draggedElement.classList.contains('placed')) return;
            
            const dragIndex = draggedElement.dataset.index;
            const spotIndex = this.dataset.index;
            
            gameState.moves++;
            
            if (dragIndex === spotIndex) {
                // Correct placement
                draggedElement.classList.add('placed');
                this.classList.add('filled');
                gameState.matched++;
                
                // Move object to spot position
                draggedElement.style.position = 'absolute';
                const roomRect = document.getElementById('room').getBoundingClientRect();
                const spotRect = this.getBoundingClientRect();
                draggedElement.style.left = (spotRect.left - roomRect.left) + 'px';
                draggedElement.style.top = (spotRect.top - roomRect.top) + 'px';
                draggedElement.style.zIndex = 5;
                draggedElement.style.width = '80px';
                draggedElement.style.height = '80px';
                draggedElement.style.cursor = 'default';
                
                if (gameState.matched === gameState.totalObjects) {
                    gameState.gameActive = false;
                    clearInterval(gameState.timer);
                    showWinMessage();
                }
            } else {
                // Wrong placement - object goes back
                draggedElement.style.opacity = '1';
            }
            
            updateStats();
        }

        function adjustBrightness(color, percent) {
            const num = parseInt(color.replace("#",""), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.min(255, (num >> 16) + amt);
            const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
            const B = Math.min(255, (num & 0x0000FF) + amt);
            return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
                (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
                .toString(16).slice(1);
        }

        function startTimer() {
            gameState.timer = setInterval(() => {
                if (gameState.gameActive) {
                    gameState.time++;
                    updateStats();
                }
            }, 1000);
        }

        function updateStats() {
            document.querySelector('.moves').textContent = `Moves: ${gameState.moves}`;
            document.querySelector('.timer').textContent = `Time: ${gameState.time}s`;
            document.querySelector('.matched').textContent = `Matched: ${gameState.matched}/${gameState.totalObjects}`;
        }

        function showWinMessage() {
            const message = document.getElementById('winMessage');
            const stats = document.getElementById('finalStats');
            stats.textContent = `You completed it in ${gameState.moves} moves and ${gameState.time} seconds!`;
            message.classList.add('show');
        }

        function restartGame() {
            document.getElementById('winMessage').classList.remove('show');
            initGame();
        }

        // Start the game
        initGame();



