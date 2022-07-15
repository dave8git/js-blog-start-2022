{
    'use strict';
    let allTags = {};
    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author',
        optTagsListSelector = '.tags.list',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-';

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

    
    const generateTitleLinks = function (customSelector = '') {
        console.log(customSelector);
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';
        let html = '';
        const articles = document.querySelectorAll(optArticleSelector+customSelector);
        articles.forEach(article => { // można użyć pętli for-of zamiast forEach
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            html = html + linkHTML;

        });
        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }

    }

    generateTitleLinks();

    const calculateTagsParams = function (tags) {
        let min = 999999; 
        let max = 0; 
        let object = {};
        const values =  Object.values(tags);
        for (let i = 0; i < values.length; i++) {
            if(values[i] < min) min = values[i];
            if(values[i] > max )  max = values[i];
        }
        return {max, min}
    }
    const calculateTagClass = function (count, params) {
        let classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1);
        return optCloudClassPrefix+classNumber;
    }
    const generateTags = function () {
        const articles = document.querySelectorAll(optArticleSelector);
        articles.forEach(article => {
            let html = '';
            const tagsWrapper = article.querySelector(optArticleTagsSelector);
            const articleTags = article.getAttribute('data-tags').split(' ');
        
            articleTags.forEach(articleTag => {
                const link = '<li><a href="#tag-'+articleTag+'">'+articleTag+'</a></li> ';
                html += link;
                if(!allTags[articleTag]) {
                    allTags[articleTag] = 1;
                } else {
                    allTags[articleTag]++;
                }
            });
            tagsWrapper.innerHTML = html;
        });
        const tagList = document.querySelector(optTagsListSelector);
       // tagList.innerHTML = allTags.join(' ');
       console.log('allTags', allTags);
       const tagsParams = calculateTagsParams(allTags);
       console.log(tagsParams);
       let allTagsHTML = '';
       for(let tag in allTags) {
        allTagsHTML += '<li><a href="#tag-'+tag+'" class="'+calculateTagClass(allTags[tag], tagsParams)+'">'+tag+' (' + allTags[tag] + ')</li>'; //<li><a href="#">design</a> <span>(6)</span></li>
        console.log('allTagsHTML w pętli', allTagsHTML);
       }
       console.log('allTagsHTML', allTagsHTML);

       console.log(tagList);
       tagList.innerHTML = allTagsHTML;

    }

    generateTags();

    const tagClickHandler = function (event) {
        event.preventDefault();
        const href = this.getAttribute('href');
        const tag = href.replace('#tag-','');
        const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
        activeLinks.forEach(activeLink => {
            activeLink.classList.remove('active');
        });
        const tagLinks = document.querySelectorAll('a[href="'+href+'"]');
        tagLinks.forEach(tagLink => {
            tagLink.classList.add('active');
        });
        generateTitleLinks('[data-tags~="' + tag + '"]');
    }

    const addClickListenersToTags = function (){
        const tags = document.querySelectorAll('a[href^="#tag-"]');
        tags.forEach(tag => {
            tag.addEventListener('click', tagClickHandler);
        })
    }
    addClickListenersToTags();

    const generateAuthors = function () {
        const articles = document.querySelectorAll(optArticleSelector);
        articles.forEach(article => {
            let html = '';
            const authorWrapper = article.querySelector(optArticleAuthorSelector);
            const author = article.getAttribute('data-author');
            let link = '<li><a href="#author-'+author+'">'+author+'</a></li>';
            authorWrapper.innerHTML = link;
        })
    }
    generateAuthors();
    
    const authorClickHandler = function (event) {
        event.preventDefault(); 
        const clickedAuthor = this.getAttribute('href');
        const author = clickedAuthor.replace('#author-', '');
        generateTitleLinks('[data-author="'+author+'"');
        generateTags();
    }
    const addClickListenersToAuthors = function () {
        const authors = document.querySelectorAll('a[href^="#author-"]');
        authors.forEach(author => {
            author.addEventListener('click', authorClickHandler);
        })
    }
    addClickListenersToAuthors();
    
}
