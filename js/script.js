{
    'use strict';

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles';

    const titleClickHandler = function (event) {
        event.preventDefault();
        const activeLinks = document.querySelectorAll('.titles a.active');
        activeLinks.forEach(activeLink => activeLink.classList.remove('active'));
        const activeArticles = document.querySelectorAll('.posts article.active');
        activeArticles.forEach(activeArticle => activeArticle.classList.remove('active'));
        this.classList.add('active');
        const article = this.getAttribute('href');
        document.querySelector(article).classList.add('active');
    }

    const generateTitleLinks = function () {
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';
        let html = '';
        const articles = document.querySelectorAll(optArticleSelector);
        articles.forEach(article => { // można użyć pętli for-of zamiast forEach
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            console.log(linkHTML);
            html = html + linkHTML;

        });
        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }

    }

    generateTitleLinks();

  
}
