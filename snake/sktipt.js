class GameField {
    score = 0; 
    speed = 500; 
    constructor(x, y, game, cell, result, best, bestResult) {
        this.game = game;
        this.cell = cell;
        this.x = x;
        this.y = y;
        this.result = result; 
        this.best = best; 
        this.bestResult = bestResult; 
    }

    // Создание блоков для отображения текущего счета и рекорда
    createNumber(value) {
        this.result = document.createElement('div'); 
        document.body.appendChild(this.result); 
        this.result.classList.add('result'); 

        this.result.textContent = `Ваши очки: ${this.score}`; 

        this.best = document.createElement('div'); 
        document.body.appendChild(this.best); 
        this.best.classList.add('best'); 

        // Получение значения рекорда из локального хранилища и отображение его в блоке
        if (!localStorage.getItem('bestResult')) {
            localStorage.setItem('bestResult', 0)
        }
        this.best.textContent = `Рекорд: ${localStorage.bestResult}`
    }

    // Создание игрового поля
    createField() {
        this.game = document.createElement('div'); 
        document.body.appendChild(this.game); 
        this.game.classList.add('game'); 

        // Создание ячеек на игровом поле, так как поле 10 на 10 то нужно 100 ячеек
        for (let i = 1; i < 101; i++) {

            this.cell = document.createElement('div');
            this.game.appendChild(this.cell);
            this.cell.classList.add('cell'); 
        }
    }

    // Расстановка ячеек на игровом поле
    createCell() {
        this.cell = document.getElementsByClassName('cell'); 
        this.x = 1; 
        this.y = 10; 

        // Расстановка координат для каждой ячейки
        for (let i = 0; i < this.cell.length; i++) {
            if (this.x > 10) {
                this.x = 1;
                this.y--;
            }
            this.cell[i].setAttribute('posX', this.x);
            this.cell[i].setAttribute('posY', this.y);
            this.x++;
        }
    }

}

// Создание экземпляра игры
let gameField = new GameField();
gameField.createNumber();
gameField.createField();
gameField.createCell();

class Apple extends GameField {
    constructor(game, cell, x, y, appleCoordinates, apple, snakeBody, a, b) {
        super(game, cell, x, y)
        this.appleCoordinates = appleCoordinates; 
        this.apple = apple; 
        this.snakeBody = snakeBody; 
        this.a = a; 
        this.b = b; 
    }

    // Генерация случайной позиции для яблока
    randomPosition() {
        this.posX = Math.round(Math.random() * (10 - 1) + 1);
        this.posY = Math.round(Math.random() * (10 - 1) + 1);
        this.appleCoordinates = [this.posX, this.posY];
    }

    createElementApple() {
        this.apple = document.querySelector(`[posX="${this.appleCoordinates[0]}"][posY="${this.appleCoordinates[1]}"]`);

        while (this.apple.classList.contains('snakeBody')) {
            this.apple = document.querySelector(`[posX="${this.appleCoordinates[0]}"][posY="${this.appleCoordinates[1]}"]`);
        }

        this.apple.classList.add('apple');
    }
}

let apples = new Apple();
apples.randomPosition();
apples.createElementApple();


class Snake extends GameField {
    constructor(direction, steps, game, cell, x, y, posX, posY, coordinates, snakeBody, snakeCoordinates, interval, bestResult, score, apple, a, b, result, best) {
        super(game, cell, x, y, bestResult, score)
        this.posX = posX; 
        this.posY = posY; 
        this.coordinates = coordinates; 
        this.snakeBody = snakeBody; 
        this.direction = direction; 
        this.steps = steps; 
        this.snakeCoordinates = snakeCoordinates; 
        this.interval = interval; 
        this.bestResult = bestResult; 
        this.apple = apple; 
        this.a = a; 
        this.b = b; 
        this.result = result; 
        this.best = best; 
        this.bestResult = bestResult; 
    }

    // Генерация координат для головы змеи
    randomPosition() {
        this.posX = 4; 
        this.posY = 4; 
        this.coordinates = [this.posX, this.posY];
    }

    createElementSnake() {
        this.snakeBody = [document.querySelector('[posX = "' + this.coordinates[0] + '"][posY = "' + this.coordinates[1] + '"]'), document.querySelector('[posX = "' + (this.coordinates[0] - 1) + '"][posY = "' + this.coordinates[1] + '"]')];

        for (let i = 0; i < this.snakeBody.length; i++) {
            this.snakeBody[i].classList.add('snakeBody');
        }
        this.snakeBody[0].classList.add('snakeHead'); 
    }
    move() {
        this.snakeCoordinates = [this.snakeBody[0].getAttribute('posX'), this.snakeBody[0].getAttribute('posY')];
        this.snakeBody[0].classList.remove('snakeHead');
        this.snakeBody[this.snakeBody.length - 1].classList.remove('snakeBody');
        this.snakeBody.pop();

        if (this.direction == 'right') {
            if (this.snakeCoordinates[0] < 10) {
                this.snakeBody.unshift(document.querySelector('[posX = "' + (+this.snakeCoordinates[0] + 1) + '"][posY = "' + this.snakeCoordinates[1] + '"]'));
            } else {
                // если выходит, то перемещаем змейку к левому краю поля
                // this.snakeBody.unshift(document.querySelector('[posX = "1"][posY = "' + this.snakeCoordinates[1] + '"]'))
                clearInterval(this.interval);
            }

        } else if (this.direction == 'left') {
            if (this.snakeCoordinates[0] > 1) {
                this.snakeBody.unshift(document.querySelector('[posX = "' + (+this.snakeCoordinates[0] - 1) + '"][posY = "' + this.snakeCoordinates[1] + '"]'));
            } else {
                // если выходит, то перемещаем змейку к правому краю поля
                // this.snakeBody.unshift(document.querySelector('[posX = "10"][posY = "' + this.snakeCoordinates[1] + '"]'));
                clearInterval(this.interval);
            }

        } else if (this.direction == 'up') {
            if (this.snakeCoordinates[1] < 10) {
                this.snakeBody.unshift(document.querySelector('[posX = "' + this.snakeCoordinates[0] + '"][posY = "' + (+this.snakeCoordinates[1] + 1) + '"]'));
            } else {
                // если выходит, то перемещаем змейку на нижний край поля
                // this.snakeBody.unshift(document.querySelector('[posX = "' + this.snakeCoordinates[0] + '"][posY = "1"]'));
                clearInterval(this.interval);
            }

        } else if (this.direction == 'down') {
            if (this.snakeCoordinates[1] > 1) {
                this.snakeBody.unshift(document.querySelector('[posX = "' + this.snakeCoordinates[0] + '"][posY = "' + (+this.snakeCoordinates[1] - 1) + '"]'));
            } else {
                // если выходит, то перемещаем змейку на верхний край поля
                // this.snakeBody.unshift(document.querySelector('[posX = "' + this.snakeCoordinates[0] + '"][posY = "10"]'));
                clearInterval(this.interval);
            }
        }

        // Проверяем, съела ли змейка яблоко
        if (this.snakeBody[0].getAttribute('posX') == apples.apple.getAttribute('posX') && this.snakeBody[0].getAttribute('posY') == apples.apple.getAttribute('posY')) {
            apples.apple.classList.remove('apple');

            this.a = this.snakeBody[this.snakeBody.length - 1].getAttribute('posX');
            this.b = this.snakeBody[this.snakeBody.length - 1].getAttribute('posY');
            this.snakeBody.push(document.querySelector('[posX = "' + this.a + '"][posY ="' + this.b + '"]'));

            gameField.score++
            gameField.result.textContent = `Ваши очки: ${gameField.score}`;

            if (gameField.score > localStorage.getItem('bestResult')) {
                gameField.bestResult = gameField.score;
                localStorage.setItem('bestResult', gameField.bestResult);
                gameField.best.textContent = `Рекорд: ${gameField.bestResult}`;
            }

            // Увеличиваем скорость игры
            gameField.speed = Math.round(gameField.speed * 0.83);
            clearInterval(this.interval);
            this.interval = setInterval(this.move.bind(this), gameField.speed);


            this.posX = Math.round(Math.random() * (10 - 1) + 1);
            this.posY = Math.round(Math.random() * (10 - 1) + 1);
            this.appleCoordinates = [this.posX, this.posY];

            apples.apple = document.querySelector('[posX = "' + this.appleCoordinates[0] + '"][posY = "' + this.appleCoordinates[1] + '"]');
            while (apples.apple.classList.contains('snakeBody')) {
                apples.apple = document.querySelector('[posX = "' + this.appleCoordinates[0] + '"][posY = "' + this.appleCoordinates[1] + '"]');
            }

            apples.apple.classList.add('apple');

        }

        // проверка на столкновение с собственным телом змейки
        if (this.snakeBody[0].classList.contains('snakeBody')) {
            let restart = document.createElement('button');
            document.body.appendChild(restart);
            restart.classList.add('button');
            restart.innerText = "Restart"
            restart.addEventListener("click", () => {
                window.location.reload();
            })
            clearInterval(this.interval);
        }

        this.snakeBody[0].classList.add('snakeHead');
        for (let i = 0; i < this.snakeBody.length; i++) {
            this.snakeBody[i].classList.add('snakeBody');
        }
        this.steps = true;
    }

    control() {
        document.addEventListener('keydown', event => {
            // проверяем, какая клавиша была нажата, и меняем направление движения змейки
            switch (event.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up'; 
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down'; 
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left'; 
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right'; 
                    break;
            }
        });
    }

    initInterval() {
        this.interval = setInterval(() => {
            this.move();
        }, this.speed);
    }
}


let snake = new Snake('right');
snake.randomPosition();
snake.createElementSnake();
snake.move();
snake.control();


function startGame() {
    if (startGame.isRun) {
        return false
    }
    start();
    startGame.isRun = true
}


document.addEventListener("click", function (e) {
    if (e.target.classList.contains('cell')) {
        startGame()
    }
});

function start() {
    snake.initInterval();
}