'use strict';

const titleClickHandler = function(event) {
    event.preventDefault();
    const activeLinks = document.querySelectorAll('.titles a.active');
    activeLinks.forEach(activeLink => activeLink.classList.remove('active'));
    const activeArticles = document.querySelectorAll('.posts article.active');
    activeArticles.forEach(activeArticle => activeArticle.classList.remove('active'));
    this.classList.add('active');
    const article = this.getAttribute('href');
    document.querySelector(article).classList.add('active');
}

const links = document.querySelectorAll('.titles a');

for(let link of links) {
    link.addEventListener('click', titleClickHandler);
}