const apiUrls = {
  followers: `/api/followers/${location.pathname.split("/")[2]}`,
  following: `/api/following/${location.pathname.split("/")[2]}`
};

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

closeButton.addEventListener("click", () => {
    modal.classList.remove("show");
});


followersItem.addEventListener("click", () =>
  toggleFollowersFollowing(followersItem, followingItem, apiUrls.followers)
);

followingItem.addEventListener("click", () =>
  toggleFollowersFollowing(followingItem, followersItem, apiUrls.following)
);

const toggleFollowersFollowing = (item1, item2, apiEndpoint) => {
  if (!item1.classList.contains("selected")) {
    item1.classList.add("selected");
    item2.classList.remove("selected");

    fetch(apiEndpoint)
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
          followButtonInner.className =
            apiEndpoint.includes("followers") ? "follow-button" : "following-button";
          followButtonInner.textContent =
            apiEndpoint.includes("followers") ? "Follow" : "Following";
          followButton.appendChild(followButtonInner);
          div.appendChild(followButton);

          document.querySelector(".follo-follower-list").appendChild(div);
        });
      });
  }
};


