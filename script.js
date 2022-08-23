const study = () => {
    const learnBtns = document.querySelector('#learn__btn');
    const answerBtns = document.querySelector('#answer__btn');
    const cardKana = document.querySelector('#card__kana');
    const cardAnswers = document.querySelector('#card__answers');

    let answers = [...document.querySelectorAll('.answer')];

    let kana = [];

    const kanaRows = ['a', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'n_'];
    const options = {ひらがな: 'hiragana', カタカナ: 'katakana', romaji: 'romaji'};

    let optionLearn = 'hiragana';
    let optionAnswer = 'katakana';

    async function getKana(file) {
        let data = await fetch(file);
        let res = await data.json();
        kana = res;
        localStorage.setItem('kana', JSON.stringify(res));
        console.log('reload');
        location.reload();
    }

    if(localStorage.getItem('kana')?.length) {
        kana = JSON.parse(localStorage.getItem('kana'));
    } else {
        getKana("kana.json");
    }

    //46 kanas
    const getRandomIndex = () => {
        return Math.floor(Math.random() * 45);
    };

    let kanaItemIndex = getRandomIndex();
    let kanaItem = kana[kanaItemIndex];
    let wrong__one = getRandomIndex();
    let wrong__second = getRandomIndex();

    const selectWrongChoices = () => {

        while(wrong__one === kanaItemIndex) {
            wrong__one = getRandomIndex();
        }
        while(wrong__second === kanaItemIndex || wrong__one === wrong__second) {
            wrong__second = getRandomIndex();
        }
        return [kana[wrong__one], kana[wrong__second]];

    };

    let wrongChoices = selectWrongChoices();

    const selectOption = (e) => {
        if(options[e.target.innerText] === undefined) {
            return;

        } else {

            [...e.currentTarget.children].forEach(e => e.classList.remove('selected'));
            e.target.classList.add('selected');

            return options[e.target.innerText];
        }
    };

    const renderCardKana = () => {
        cardKana.removeChild(cardKana.firstChild);
        cardKana.appendChild(document.createTextNode(kanaItem[optionLearn]));
        cardKana.style.fontSize = '7rem';
        cardKana.style.top = '2rem';
        cardKana.style.textShadow = 'none';
    };


    const renderCardAnswers = () => {

        let answerChoices = [kanaItem[optionAnswer], ...wrongChoices.map(e => e[optionAnswer])];

        answers.forEach((element, index) => {
            element.innerHTML = `<h3>${answerChoices[index]}</h3>`;

            if(kana[kanaItemIndex][optionAnswer] === element.childNodes[0].innerText) {
                element.classList.add('right');
            } else {
                element.classList.remove('right');
            }

        });
    };

    const selectOptionAnswer = (e) => {
        optionAnswer = selectOption(e);
        if(!optionAnswer) return;
        renderCardAnswers();
    };

    const selectOptionLearn = (e) => {
        optionLearn = selectOption(e);
        if(!optionLearn) return;
        renderCardKana();
    };


    const suffleAnswers = (array) => {
        let currentIndex = array.length;
        let randomIndex;

        while(currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            cardAnswers.appendChild(array[currentIndex]);
        }

        return array;
    };


    const learnKana = () => {

        renderCardKana();
        renderCardAnswers();
        answers = suffleAnswers(answers);

    };

    const rerender = () => {
        kanaItemIndex = getRandomIndex();
        kanaItem = kana[kanaItemIndex];
        wrong__one = getRandomIndex();
        wrong__second = getRandomIndex();

        selectWrongChoices();

        answers.forEach(e => {
            e.classList.remove('selected');
            e.disabled = false;
        });
        learnKana();
    };

    setTimeout(learnKana, 500);


    learnBtns.addEventListener('click', selectOptionLearn);
    answerBtns.addEventListener('click', selectOptionAnswer);
    learnBtns.addEventListener('touchend', selectOptionLearn);
    answerBtns.addEventListener('touchend', selectOptionAnswer);


    answers.forEach(element => element.addEventListener('click', (e) => {
        element.classList.add('selected');
        if(element.classList.contains('right')) {

            cardKana.style.fontSize = '9rem';
            cardKana.style.top = '.5rem';
            cardKana.style.textShadow = '1px 12px 11px #fcb';
            cardKana.style.transition = 'all 0.3s ease-in 0s';
            kanaItem.showed++;
            localStorage.setItem('kana', JSON.stringify(kana));
            setTimeout(rerender, 500);


        } else {
            element.disabled = true;
        }
    }));
};

study();

window.onload = () => {
    "use strict";

    if("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js");
    }
};