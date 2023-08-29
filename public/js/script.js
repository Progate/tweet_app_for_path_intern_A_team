const apiUrls = {
  followers: `/users/${location.pathname.split("/")[2]}/followers`,
  followings: `/users/${location.pathname.split("/")[2]}/followings`,
  follow: `/follow`,
  unfollow: `/api/unfollow`,
};

const selectableItems = document.querySelector(".selectable-items");
const modal = document.querySelector(".modal");

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
  followersItem = selectableItems.querySelector('[name="followers"]');
  followingItem = selectableItems.querySelector('[name="following"]');

  followersItem.addEventListener("click", () =>
    toggleFollowersFollowing(followersItem, followingItem, apiUrls.followers)
  );

  followingItem.addEventListener("click", () =>
    toggleFollowersFollowing(followingItem, followersItem, apiUrls.followings)
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

          //ここはユーザーのフォロー状況に合わせて変える
          const followButton = document.createElement("div");
          followButton.className = "follows-followers-list-button";
          const followButtonInner = document.createElement("div");
          followButtonInner.className = apiEndpoint.includes("followers")
            ? "follow button"
            : "following button";
          followButtonInner.setAttribute("data-user-id", user.id);
          followButton.appendChild(followButtonInner);
          div.appendChild(followButton);

          document.querySelector(".follows-followers-list").appendChild(div);
        });
      });
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pushButton = button => {
  const userID = button.getAttribute("data-user-id");
  let apiEndpoint, removeClass, addClass;

  if (button.classList.contains("follow")) {
    apiEndpoint = `${apiUrls.follow}/${userID}`;
    removeClass = "follow";
    addClass = "following";
  } else if (button.classList.contains("following")) {
    apiEndpoint = `${apiUrls.unfollow}/${userID}`;
    removeClass = "following";
    addClass = "follow";
  }

  // ボタンの表示を切り替える
  button.classList.remove(removeClass);
  button.classList.add(addClass);

  fetch(apiEndpoint, {
    method: "POST",
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (!data.success) {
        console.log("bbbbb");
        // エラーが発生した場合は、元に戻す
        button.classList.remove(addClass);
        button.classList.add(removeClass);
        alert("エラーが発生しました。もう一度お試しください。");
      }
    })
    .catch((e) => {
      console.log(e);
      // エラーが発生した場合は、元に戻す
      button.classList.remove(addClass);
      button.classList.add(removeClass);
      alert("エラーが発生しました。もう一度お試しください。");
    });
};
