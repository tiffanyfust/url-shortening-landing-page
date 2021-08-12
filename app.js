const app = {};

app.getShortLinks = (link) => {
    const url = new URL('https://api.shrtco.de/v2/shorten');
    
    url.search = new URLSearchParams({
        url: link
    })

    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(data => {
        if (data) {
            const shortLink = data.result;
            app.displayLinks(shortLink);
        } else {
            return;
        }
    })
}

app.displayLinks = (link) => {
    console.log(link)
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
}

app.init = () => {
    const formEl = document.querySelector('.form');

    formEl.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputEl = document.querySelector('#linkInput');
        const inputValue = inputEl.value;
        console.log(inputValue)

        app.getShortLinks(inputValue);
    })
}

app.init();