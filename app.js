const app = {};

app.getShortLinks = (link) => {
    const url = new URL('https://api.shrtco.de/v2/shorten');
    
    url.search = new URLSearchParams({
        url: link
    })
    const loader = document.querySelector('.loader')
    loader.style.display = 'block';

    fetch(url)
    .then(res => {
        loader.style.display = 'none';
        return res.json();
    })
    .then(data => {
        if (data) {
            const shortLink = data.result;
            // app.displayLinks(shortLink);
            app.savedLinks(shortLink);
        } else {
            return;
        }
    })
}

app.savedLinks = (link) => {
    let linksArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    console.log(linksArray)
    
    const linkObj = {
        original_link: link.original_link,
        full_short_link: link.full_short_link
    }

    linksArray.push(linkObj)
    localStorage.setItem('items', JSON.stringify(linksArray))
    app.displayLinks(link);
}


app.displayLinks = (link) => {

    const links = document.querySelector('.links');


    const li = document.createElement('li');
    li.classList.add('link');

    const contentDiv = document.createElement('div');
    const longLink = document.createElement('p');
    longLink.classList.add('originalLink');
    const shortLink = document.createElement('p');
    shortLink.classList.add('shortLink');
    const copyButton = document.createElement('button');
    copyButton.classList.add('copyButton');

    longLink.innerText = link.original_link;
    shortLink.innerText = link.full_short_link;
    copyButton.innerText = 'Copy';

    contentDiv.append(longLink, shortLink);
    li.append(contentDiv, copyButton);
    links.append(li);

    const copyButtons = document.querySelectorAll('.copyButton');

    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.style.background = 'hsl(257, 27%, 26%)';
            button.style.padding = '10px 20px';
            button.innerText = 'Copied!';
            
            const data = button.previousElementSibling.children[1].textContent;
            navigator.clipboard.writeText(data);
        })
    })
}


app.init = () => {
    const formEl = document.querySelector('.form');
    const inputEl = document.querySelector('#linkInput');
    const errorMsg = document.querySelector('.error');

    const datas = JSON.parse(localStorage.getItem('items'))
    
    if (datas) {
        datas.forEach(item => {
            app.displayLinks(item);
        })
    }
    

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputValue = inputEl.value;

        if(inputValue !== '') {
            app.getShortLinks(inputValue);
            inputEl.classList.remove('invalid');
            errorMsg.style.display = 'none';
            inputEl.value = '';
        } else {
            inputEl.classList.add('invalid');
            errorMsg.style.display = 'block';
        }

    })

    inputEl.addEventListener('focus', () => {
        inputEl.classList.remove('invalid');
        errorMsg.style.display = 'none';
    })
}

app.init();