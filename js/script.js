{
    'use strict';
    let allTags = {};
    let allAuthors = {};

    const opts = {
        tagSizes: {
            count: 5,
            classPrefix: 'tag-size-'
        }
    }
    
    const select = {
        all: {
            articles: '.post',
            linksTo: {
                tags: 'a[href^="#tag-"]',
                authors: 'a[href^="#author-"]',
            }
        },
        post: {

        },
        article: {
            tags: '.post-tags .list',
            author: '.post-author',
            title: '.post-title',
        },
        listOf: {
            titles: '.titles',
            tags: '.tags.list',
            authors: '.authors.list',
        },
    };

    const templates = {
        articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
        articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
        articleTags: Handlebars.compile(document.querySelector('#template-article-tags').innerHTML),
        tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
        authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML),
      }

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
        const titleList = document.querySelector(select.listOf.titles);
        titleList.innerHTML = '';
        let html = '';
        const articles = document.querySelectorAll(select.all.articles+customSelector);
        articles.forEach(article => { // można użyć pętli for-of zamiast forEach
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(select.article.title).innerHTML;
            const linkHTMLData = {id: articleId, title: articleTitle};
            const linkHTML = templates.articleLink(linkHTMLData);
            //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
        const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );
        return opts.tagSizes.classPrefix+classNumber;
    }
    const generateTags = function () {
        const articles = document.querySelectorAll(select.all.articles);
        articles.forEach(article => {
            let html = '';
            const tagsWrapper = article.querySelector(select.article.tags);
            const articleTags = article.getAttribute('data-tags').split(' ');
        
            articleTags.forEach(articleTag => {
                //const link = '<li><a href="#tag-'+articleTag+'">'+articleTag+'</a></li> ';
                const tagHTMLData = {articleTag: articleTag};
                const tagHTML = templates.articleTags(tagHTMLData);
                html += tagHTML;
                if(!allTags[articleTag]) {
                    allTags[articleTag] = 1;
                } else {
                    allTags[articleTag]++;
                }
            });
            tagsWrapper.innerHTML = html;
        });
        const tagList = document.querySelector(select.listOf.tags);
       // tagList.innerHTML = allTags.join(' ');
       const tagsParams = calculateTagsParams(allTags);
       //let allTagsHTML = '';
       const allTagsData = {tags: []};
       for(let tag in allTags) {
        //allTagsHTML += '<li><a href="#tag-'+tag+'" class="'+calculateTagClass(allTags[tag], tagsParams)+'">'+tag+' (' + allTags[tag] + ')</li>'; //<li><a href="#">design</a> <span>(6)</span></li>
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        
        }
        console.log(allTagsData);
       tagList.innerHTML = templates.tagCloudLink(allTagsData);

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
        const articles = document.querySelectorAll(select.all.articles);
        articles.forEach(article => {
            let html = '';
            const authorWrapper = article.querySelector(select.article.author);
            const author = article.getAttribute('data-author');
            const authorHTMLData = {author: author};
            const authorHTML = templates.articleAuthor(authorHTMLData);
            //let link = '<li><a href="#author-'+author+'">'+author+'</a></li>';
            if(!allAuthors[author]) {
                allAuthors[author] = 1;
            } else {
                allAuthors[author]++;
            }
            authorWrapper.innerHTML = authorHTML;
        })
        const authorList = document.querySelector(select.listOf.authors);
        let allAuthorsData = {authors: []};
        for(let author in allAuthors) {
            //allAuthorsHTML += '<li><a href="#author-'+author+ '">'+author+'(' + allAuthors[author] + ')'+ '</li>';
            allAuthorsData.authors.push({
                authorNumber: allAuthors[author],
                author: author,
            })
        }
        authorList.innerHTML = templates.authorsListLink(allAuthorsData);
    }
    generateAuthors();
    
    const authorClickHandler = function (event) {
        event.preventDefault(); 
        const clickedAuthor = this.getAttribute('href');
        const author = clickedAuthor.replace('#author-', '');
        generateTitleLinks('[data-author="'+author+'"]');
    }
    const addClickListenersToAuthors = function () {
        const authors = document.querySelectorAll('a[href^="#author-"]');
        authors.forEach(author => {
            author.addEventListener('click', authorClickHandler);
        })
    }
    addClickListenersToAuthors();
    
}
