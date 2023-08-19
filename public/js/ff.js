const followersLink = document.querySelector('.Followers');
const followingLink = document.querySelector('.Following');
const closeButton = document.querySelector('.close-button');

const modal = document.querySelector('.modal');
followersLink.addEventListener('click', () => {
  modal.style.visibility = 'visible';
});

followingLink.addEventListener('click', () => {
    modal.style.visibility = 'visible';
});

window.onclick = event => {
    if (event.target == closeButton) {
        modal.style.visibility = 'hidden';
    }
}