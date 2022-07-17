{
    'use strict';
    let allTags = {};
    let allAuthors = {};
    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author',
        optTagsListSelector = '.tags.list',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-',
        optAuthorListSelector = '.authors.list';


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
        const values =  Object.values(tags);
        for (let i = 0; i < values.length; i++) {
            if(values[i] < min) min = values[i];
            if(values[i] > max )  max = values[i];
        }
        return {max, min}
    }
    const calculateTagClass = function (count, params) {
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min; 
        const percentage = normalizedCount / normalizedMax; 
        const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
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
       const tagsParams = calculateTagsParams(allTags);
       let allTagsHTML = '';
       for(let tag in allTags) {
        allTagsHTML += '<li><a href="#tag-'+tag+'" class="'+calculateTagClass(allTags[tag], tagsParams)+'">'+tag+' (' + allTags[tag] + ')</li>'; //<li><a href="#">design</a> <span>(6)</span></li>
       }
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
            if(!allAuthors[author]) {
                allAuthors[author] = 1;
            } else {
                allAuthors[author]++;
            }
            authorWrapper.innerHTML = link;
        })
        const authorList = document.querySelector(optAuthorListSelector);
        let allAuthorsHTML = '';
        for(let author in allAuthors) {
            allAuthorsHTML += '<li><a href="#author-'+author+ '">'+author+'(' + allAuthors[author] + ')'+ '</li>';
            
        }
        authorList.innerHTML = allAuthorsHTML;
    }
    generateAuthors();
    
    const authorClickHandler = function (event) {
        event.preventDefault(); 
        const clickedAuthor = this.getAttribute('href');
        const author = clickedAuthor.replace('#author-', '');
        generateTitleLinks('[data-author="'+author+'"]');
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
