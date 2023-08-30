const thisUserID = Number(location.pathname.split("/")[2]);

const apiUrls = {
  followers: `/users/${thisUserID}/followers`,
  followings: `/users/${thisUserID}/followings`,
  followersYouFollow: `/users/${thisUserID}/followers_you_follow`,
  follow: `/follow`,
  unfollow: `/follow`,
};

const followersCount = document.querySelector(
  ".followers .link-follows-followers-num"
);
const followingsCount = document.querySelector(
  ".following .link-follows-followers-num"
);

const selectableItems = document.querySelectorAll(".selectable-item");
const modal = document.querySelector(".modal");
const myLink = document.querySelector('a[data-test="header-link-mypage"]');
let myUserID;
if (myLink) {
  const url = new URL(myLink.href);
  myUserID = Number(url.pathname.split("/").pop());
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
    followersItem.click();
    setTimeout(() => {
      modalClickEnabled = true;
    }, 300);
  }

  if (
    event.target.closest(".following") &&
    event.target.closest(".follows-followers")
  ) {
    modal.classList.add("show");
    modalClickEnabled = false;
    followingItem.click();
    setTimeout(() => {
      modalClickEnabled = true;
    }, 300);
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
      toggleSelectableItems(item);
    });
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const toggleSelectableItems = item => {
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

  if (apiEndpoint === apiUrls.followersYouFollow) {
    followersYouFollowAlternative(followsFollowersList);
    return;
  }

  if (apiEndpoint) {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(users => {
        addUsersToUserList(followsFollowersList, users);
      });
  }
};

//API実装が間に合わなかった場合無理やりリストを作成する
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const followersYouFollowAlternative = list => {
  fetch(`/users/${myUserID}/followings`)
    .then(response => response.json())
    .then(myFollowings => {
      fetch(apiUrls.followers)
        .then(response => response.json())
        .then(myFollowers => {
          const followersYouFollowList = myFollowers.filter(user =>
            myFollowings.some(following => following.id === user.id)
          );
          addUsersToUserList(list, followersYouFollowList);
        });
    });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const addUsersToUserList = (list, users) => {
  users.forEach((user, index) => {
    const div = document.createElement("div");
    div.className = "users-index-item anim";

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
      followButtonInner.className = user.hasFollowed
        ? "button following"
        : "button follow";
      followButtonInner.setAttribute("data-user-id", user.id);
      followButton.appendChild(followButtonInner);
      div.appendChild(followButton);
    }

    list.appendChild(div);

    setTimeout(() => {
      div.classList.add("visible");
    }, 50 * (index + 1));
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pushButton = button => {
  const userID = Number(button.getAttribute("data-user-id"));
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
  } else {
    return;
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

      if (apiMethod === "POST" && userID === thisUserID) {
        followersCount.textContent = parseInt(followersCount.textContent) + 1;
      } else if (apiMethod === "DELETE" && userID === thisUserID) {
        followersCount.textContent = parseInt(followersCount.textContent) - 1;
      }
      if (apiMethod === "POST" && thisUserID === myUserID) {
        followingsCount.textContent = parseInt(followingsCount.textContent) + 1;
      } else if (apiMethod === "DELETE" && thisUserID === myUserID) {
        followingsCount.textContent = parseInt(followingsCount.textContent) - 1;
      }
    })
    .catch(() => {
      // エラーが発生した場合は、元に戻す
      button.classList.remove(addClass);
      button.classList.add(removeClass);
      alert("エラーが発生しました。もう一度お試しください。");
    });
};
