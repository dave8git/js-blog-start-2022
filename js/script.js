'use strict';

// document.getElementById('test-button').addEventListener('click', function () {
//     const links = document.querySelectorAll('.titles a');
//     console.log('links: ', links );
// });
const titleClickHandler = function(event) {
    console.log('Link was clicked!');
    console.log(event);
}

const links = document.querySelectorAll('.titles a');

for(let link of links) {
    link.addEventListener('click', titleClickHandler);
}