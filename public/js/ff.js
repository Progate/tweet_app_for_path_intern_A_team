const followersLink = document.querySelector(".Followers");
const followingLink = document.querySelector(".Following");
const closeButton = document.querySelector(".close-button");

const selectableItems = document.querySelector(".selectable-items");
const followersItem = selectableItems.querySelector('[name="followers"]');
const followingItem = selectableItems.querySelector('[name="following"]');

const modal = document.querySelector(".modal");
followersLink.addEventListener("click", () => {
  modal.classList.add("show");
  followersItem.click();
});

followingLink.addEventListener("click", () => {
  modal.classList.add("show");
  followingItem.click();
});

window.addEventListener("click", event => {
  if (event.target == closeButton) {
    modal.classList.remove("show");
  }
});

followersItem.addEventListener("click", () => {
  if (!followersItem.classList.contains("selectable-item-selected")) {
    followersItem.classList.add("selectable-item-selected");
    followersItem.classList.remove("selectable-item");
    followingItem.classList.add("selectable-item");
    followingItem.classList.remove("selectable-item-selected");

    const userID = "3";

    fetch(`/api/followers/${userID}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(user => {
          const div = document.createElement("div");
          div.className = "users-index-item";

          const userLeft = document.createElement("div");
          userLeft.className = "user-left";
          const userIcon = document.createElement("img");
          userIcon.className = "user-left";
          userIcon.src = user.iconURL;
          userLeft.appendChild(userIcon);
          div.appendChild(userLeft);

          const userRight = document.createElement("div");
          userRight.className = "user-right";
          const userLink = document.createElement("a");
          userLink.href = "/users/" + user.userID;
          userLink.setAttribute("data-test", "user-item-link");
          userLink.textContent = user.userName;
          userRight.appendChild(userLink);
          div.appendChild(userRight);

          //ここはユーザーのフォロー状況に合わせて変える
          const followButton = document.createElement("div");
          followButton.className = "follo-follower-list-button";
          const followButtonInner = document.createElement("div");
          followButtonInner.className = "follow-button";
          followButtonInner.textContent = "Follow";
          followButton.appendChild(followButtonInner);
          div.appendChild(followButton);

          document.querySelector(".follo-follower-list").appendChild(div);
        });
      });
  }
});

followingItem.addEventListener("click", () => {
  if (!followingItem.classList.contains("selectable-item-selected")) {
    followingItem.classList.add("selectable-item-selected");
    followingItem.classList.remove("selectable-item");
    followersItem.classList.add("selectable-item");
    followersItem.classList.remove("selectable-item-selected");

    const userID = "3";

    fetch(`/api/followers/${userID}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(user => {
          const div = document.createElement("div");
          div.className = "users-index-item";

          const userLeft = document.createElement("div");
          userLeft.className = "user-left";
          const userIcon = document.createElement("img");
          userIcon.className = "user-left";
          userIcon.src = user.iconURL;
          userLeft.appendChild(userIcon);
          div.appendChild(userLeft);

          const userRight = document.createElement("div");
          userRight.className = "user-right";
          const userLink = document.createElement("a");
          userLink.href = "/users/" + user.userID;
          userLink.setAttribute("data-test", "user-item-link");
          userLink.textContent = user.userName;
          userRight.appendChild(userLink);
          div.appendChild(userRight);

          const followButton = document.createElement("div");
          followButton.className = "follo-follower-list-button";
          const followButtonInner = document.createElement("div");
          followButtonInner.className = "following-button"; //押さえたら変えるようにしよう
          followButtonInner.textContent = "Following";
          followButton.appendChild(followButtonInner);
          div.appendChild(followButton);

          document.querySelector(".follo-follower-list").appendChild(div);
        });
      });
  }
});
