const followersLink = document.querySelector('.Followers');
const followingLink = document.querySelector('.Following');
const closeButton = document.querySelector('.close-button');

const selectableItems = document.querySelector('.selectable-items');
const followersItem = selectableItems.querySelector('[name="followers"]');
const followingItem = selectableItems.querySelector('[name="following"]');

const modal = document.querySelector('.modal');
followersLink.addEventListener('click', () => {
    modal.classList.add('show');
    followersItem.click();
});

followingLink.addEventListener('click', () => {
    modal.classList.add('show');
    followingItem.click();
});

window.addEventListener('click', event => {
    if (event.target == closeButton) {
        modal.classList.remove('show');
    }
});

followersItem.addEventListener('click', () => {
    if (!followersItem.classList.contains('selectable-item-selected')) {
        followersItem.classList.add('selectable-item-selected');
        followersItem.classList.remove('selectable-item');
        followingItem.classList.add('selectable-item');
        followingItem.classList.remove('selectable-item-selected');

        //ここにapiとの通信を行って要素を追加するjs
    }
});

followingItem.addEventListener('click', () => {
    if (!followingItem.classList.contains('selectable-item-selected')) {
        followingItem.classList.add('selectable-item-selected');
        followingItem.classList.remove('selectable-item');
        followersItem.classList.add('selectable-item');
        followersItem.classList.remove('selectable-item-selected');

        //ここにapiとの通信を行って要素を追加するjs
    }
});
