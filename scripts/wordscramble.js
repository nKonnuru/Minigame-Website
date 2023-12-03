document.addEventListener('DOMContentLoaded', function() {
    const words = ['example', 'challenge', 'scramble', 'javascript', 'coding', 'algorithm', 'function', 'variable', 'object', 'array', 'syntax', 'loop', 'conditional', 'framework', 'library']; 
    let currentWord = '';
    let score = 0;
    let timeLeft = 30; 

    function scrambleWord(word) {
        return word.split('').sort(() => 0.5 - Math.random()).join('');
    }

    function setNewWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        document.getElementById('scrambled-word').textContent = scrambleWord(currentWord);
        resetTimer();
    }

    function updateScore(correct) {
        if (correct) {
            score++;
        } else {
            score = Math.max(0, score - 1);
        }
        document.getElementById('score').textContent = 'Score: ' + score;
    }

    function resetTimer() {
        clearInterval(window.timerInterval);
        timeLeft = 30;
        document.getElementById('timer').textContent = 'Time left: ' + timeLeft + 's';
        window.timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = 'Time left: ' + timeLeft + 's';
            if (timeLeft <= 0) {
                clearInterval(window.timerInterval);
                revealAnswer();
            }
        }, 1000);
    }

    function revealAnswer() {
        document.getElementById('result').textContent = 'Times up! The answer was: ' + currentWord;
        setNewWord();
    }

    document.getElementById('check-answer').addEventListener('click', function() {
        const userInput = document.getElementById('user-input').value;
        if (userInput === currentWord) {
            document.getElementById('result').textContent = 'Correct!';
            updateScore(true);
        } else {
            document.getElementById('result').textContent = 'Try again.';
            updateScore(false);
        }
        setNewWord();
    });

    document.getElementById('new-word').addEventListener('click', function() {
        setNewWord();
        document.getElementById('user-input').value = '';
        document.getElementById('result').textContent = '';
    });

    document.getElementById('show-answer').addEventListener('click', function() {
        document.getElementById('result').textContent = 'The answer is: ' + currentWord;
        updateScore(false);
        setNewWord();
    });

    document.getElementById('back-home').addEventListener('click', function() {
        window.location.href = 'index.html'; 
    });

    setNewWord();
});
