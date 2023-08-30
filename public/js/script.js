const apiUrls = {
  followers: `/users/${location.pathname.split("/")[2]}/followers`,
  followings: `/users/${location.pathname.split("/")[2]}/followings`,
  followersYouFollow: `/users/${
    location.pathname.split("/")[2]
  }/followers_you_follow`,
  follow: `/follow`,
  unfollow: `/follow`,
};

const selectableItems = document.querySelectorAll(".selectable-item");
const modal = document.querySelector(".modal");
const myLink = document.querySelector('a[data-test="header-link-mypage"]');
let myUserID;
if (myLink) {
  const url = new URL(myLink.href);
  myUserID = Number(url.pathname.split("/").pop());
} else {
}

let followersItem, followingItem;

let modalClickEnabled = true;

window.addEventListener("click", () => {
  if (
    event.target.closest(".followers") &&
    event.target.closest(".follows-followers")
  ) {
    modal.classList.add("show");
    modalClickEnabled = false;
    setTimeout(() => {
      modalClickEnabled = true;
    }, 300);
    followersItem.click();
  }

  if (
    event.target.closest(".following") &&
    event.target.closest(".follows-followers")
  ) {
    modal.classList.add("show");
    modalClickEnabled = false;
    setTimeout(() => {
      modalClickEnabled = true;
    }, 300);
    followingItem.click();
  }

  if (event.target.classList.contains("close-button")) {
    modal.classList.remove("show");
  }

  if (event.target.classList.contains("modal")) {
    if (event.target === modal && modalClickEnabled) {
      modal.classList.remove("show");
    }
  }

  if (event.target.classList.contains("button")) {
    pushButton(event.target);
  }
});

if (selectableItems) {
  selectableItems.forEach(item => {
    if (item.getAttribute("name") === "followers") {
      followersItem = item;
    } else if (item.getAttribute("name") === "following") {
      followingItem = item;
    }
    item.addEventListener("click", () => {
      toggleFollowersFollowing(item);
    });
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const toggleFollowersFollowing = item => {
  let apiEndpoint;

  if (!item.classList.contains("selected")) {
    document.querySelectorAll(".selected").forEach(selectedItem => {
      selectedItem.classList.remove("selected");
    });
    item.classList.add("selected");
  }

  if (item.getAttribute("name") === "followers") {
    apiEndpoint = apiUrls.followers;
  } else if (item.getAttribute("name") === "following") {
    apiEndpoint = apiUrls.followings;
  } else if (item.getAttribute("name") === "followers_you_follow") {
    apiEndpoint = apiUrls.followersYouFollow;
  } else {
    apiEndpoint = "";
  }

  const followsFollowersList = document.querySelector(
    ".follows-followers-list"
  );
  const usersIndexItems =
    followsFollowersList.querySelectorAll(".users-index-item");
  usersIndexItems.forEach(item => {
    followsFollowersList.removeChild(item);
  });

  if (apiEndpoint) {
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
          userIcon.src = user.imageName;
          userLeft.appendChild(userIcon);
          div.appendChild(userLeft);

          const userRight = document.createElement("div");
          userRight.className = "user-right";
          const userLink = document.createElement("a");
          userLink.href = "/users/" + user.id;
          userLink.setAttribute("data-test", "user-item-link");
          userLink.textContent = user.name;
          userRight.appendChild(userLink);
          div.appendChild(userRight);
          if (myUserID !== user.id) {
            const followButton = document.createElement("div");
            followButton.className = "follows-followers-list-button";
            const followButtonInner = document.createElement("div");
            followButtonInner.className = user.follow
              ? "following button"
              : "follow button";
            followButtonInner.setAttribute("data-user-id", user.id);
            followButton.appendChild(followButtonInner);
            div.appendChild(followButton);
          }

          followsFollowersList.appendChild(div);
        });
      });
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pushButton = button => {
  const userID = button.getAttribute("data-user-id");
  let apiEndpoint, apiMethod, removeClass, addClass;

  if (button.classList.contains("follow")) {
    apiEndpoint = `${apiUrls.follow}/${userID}`;
    apiMethod = "POST";
    removeClass = "follow";
    addClass = "following";
  } else if (button.classList.contains("following")) {
    apiEndpoint = `${apiUrls.unfollow}/${userID}`;
    apiMethod = "DELETE";
    removeClass = "following";
    addClass = "follow";
  }

  // ボタンの表示を切り替える
  button.classList.remove(removeClass);
  button.classList.add(addClass);

  fetch(apiEndpoint, {
    method: apiMethod,
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        // エラーが発生した場合は、元に戻す
        button.classList.remove(addClass);
        button.classList.add(removeClass);
        alert("エラーが発生しました。もう一度お試しください。");
      }
    })
    .catch(() => {
      // エラーが発生した場合は、元に戻す
      button.classList.remove(addClass);
      button.classList.add(removeClass);
      alert("エラーが発生しました。もう一度お試しください。");
    });
};
