const postInput = document.getElementById("postInput");
const postButton = document.getElementById("postButton");
const postsContainer = document.querySelector(".posts");
const postTemplate = document.getElementById("postTemplate");
const followButton = document.getElementById("followButton");


// ====================
// Add Like / Comment
// ====================

function setupPostButtons(post, postId) {

    // Like button

    const likeButton =
        post.querySelector(".post-actions button:nth-child(1)");

    likeButton.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://localhost:5000/likes",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    post_id: postId,
                    user_id: 1
                })
            }
        );

        const result = await response.json();

        if (result.liked) {

            likeButton.textContent = "❤️ Liked";

        } else {

            likeButton.textContent = "❤️ Like";

        }

    } catch (error) {

        console.error("Error liking post:", error);

    }

});


    // Comment button

    const commentButton =
        post.querySelector(".post-actions button:nth-child(2)");

    commentButton.addEventListener("click", function () {

        const comment = document.createElement("input");

        comment.setAttribute(
            "placeholder",
            "Write a comment..."
        );

        post.appendChild(comment);


        const addCommentButton =
            document.createElement("button");

        addCommentButton.textContent = "Add Comment";

        post.appendChild(addCommentButton);


        addCommentButton.addEventListener("click", async function () {

            const commentContext =
                comment.value.trim();


            if (commentContext === "") {
                return;
            }


            try {

                const response = await fetch(
                    "http://localhost:5000/comments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            post_id: postId,
                            user_id: 1,
                            content: commentContext
                        })
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to create comment");
                }


                const savedComment =
                    await response.json();


                const commentElement =
                    document.createElement("p");

                commentElement.textContent =
                    savedComment.content;

                post.appendChild(commentElement);


                comment.value = "";


            } catch (error) {

                console.error(
                    "Error creating comment:",
                    error
                );

            }

        });

    });

}


// ====================
// Create Post
// ====================

if (postButton !== null) {

    postButton.addEventListener("click", async function () {

        const postText = postInput.value.trim();


        if (postText === "") {
            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/posts",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        user_id: 1,
                        content: postText
                    })
                }
            );


            if (!response.ok) {
                throw new Error("Failed to create post");
            }


            const savedPost =
                await response.json();


            const post =
                postTemplate.content.firstElementChild.cloneNode(true);


            const postTextContent =
                post.querySelector(".post-text");


            postTextContent.textContent =
                savedPost.content;


            setupPostButtons(
                post,
                savedPost.id
            );


            postsContainer.appendChild(post);


            postInput.value = "";


        } catch (error) {

            console.error(
                "Error creating post:",
                error
            );

        }

    });

}


// ====================
// Load Posts
// ====================

async function loadPosts() {

    try {

        const response = await fetch(
            "http://localhost:5000/posts"
        );


        if (!response.ok) {
            throw new Error("Failed to load posts");
        }


        const posts =
            await response.json();


        posts.forEach(function (postData) {

            const post =
                postTemplate.content.firstElementChild.cloneNode(true);


            const postTextContent =
                post.querySelector(".post-text");


            postTextContent.textContent =
                postData.content;


            setupPostButtons(
                post,
                postData.id
            );


            postsContainer.appendChild(post);

        });


    } catch (error) {

        console.error(
            "Error loading posts:",
            error
        );

    }

}


loadPosts();


// ====================
// Follow / Unfollow
// ====================

if (followButton !== null) {

    const followerId = 1;
    const followingId = 2;


    async function checkFollowStatus() {

        try {

            const response = await fetch(
                `http://localhost:5000/follow/${followerId}/${followingId}`
            );

            const result = await response.json();

            if (result.following) {

                followButton.textContent = "Following";

            } else {

                followButton.textContent = "Follow";

            }
if (document.getElementById("postsCount") !== null) {
    loadProfile();
}
        } catch (error) {

            console.error(
                "Error checking follow status:",
                error
            );

        }

    }


    followButton.addEventListener("click", async function () {

        try {

            const response = await fetch(
                "http://localhost:5000/follow",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        follower_id: followerId,
                        following_id: followingId
                    })
                }
            );


            const result = await response.json();


            if (result.following) {

                followButton.textContent = "Following";

            } else {

                followButton.textContent = "Follow";

            }

        } catch (error) {

            console.error(
                "Error following user:",
                error
            );

        }

    });


    checkFollowStatus();

}