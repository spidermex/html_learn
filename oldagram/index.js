const posts = [
    {
        name: "Vincent van Gogh",
        username: "vincey1853",
        location: "Zundert, Netherlands",
        avatar: "images/avatar-vangogh.jpg",
        post: "images/post-vangogh.jpg",
        comment: "just took a few mushrooms lol",
        likes: 21
    },
    {
        name: "Gustave Courbet",
        username: "gus1819",
        location: "Ornans, France",
        avatar: "images/avatar-courbet.jpg",
        post: "images/post-courbet.jpg",
        comment: "i'm feelin a bit stressed tbh",
        likes: 4
    },
        {
        name: "Joseph Ducreux",
        username: "jd1735",
        location: "Paris, France",
        avatar: "images/avatar-ducreux.jpg",
        post: "images/post-ducreux.jpg",
        comment: "gm friends! which coin are YOU stacking up today?? post below and WAGMI!",
        likes: 152
    }
]

// Mask for the content of each POST
const contentMask=` 
<div class="post-header">
    <div class="post-foto">
        <img class="post-avatar" src="images/avatar-vangogh.jpg">
    </div>
    <div class="post-user">
        <p class="name text-dark">Vincent Van Gogh</p>
        <p class="location">Zundert, Netherlands </p>
    </div>
</div>
<div class="post-image">
    <img src="images\post-vangogh.jpg">
</div>
<div class="post-footer">
    <div class="post-interactions">
        <div class="post-like" onclick="addLike(this)">
            <img src="images/icon-heart.png" >
        </div>
        <div class="post-comment">
            <img src="images/icon-comment.png">
        </div>
        <div class="post-share                    ">
            <img src="images/icon-dm.png">
        </div>
    </div>
    <div class="post-likes">
        <p class="text-dark">21 likes</p>
    </div>
    <div class="post-text">
        <p ><span class="username text-dark">vincey1853 </span>just took a few mushrooms lol </p>
    </div>
</div>
<div class="post-divider"> 
</div>`

// Variable to store container where we will append the POSTS
const mainLocation = document.getElementById("main-container")

// Loop for displaying the POSTS array
for (let i=0; i<posts.length; i++) {
    const post = posts[i]
    const postContainer = document.createElement("section")
    postContainer.classList.add("post-container")
    postContainer.innerHTML = contentMask
    postContainer.querySelector(".post-avatar").src = post.avatar
    postContainer.querySelector(".post-image img").src = post.post
    postContainer.querySelector(".name").textContent = post.name
    postContainer.querySelector(".location").textContent = post.location
    postContainer.querySelector(".post-text p").innerHTML =`<span class="username text-dark">${post.username}</span>: ${post.comment}` 
    postContainer.querySelector(".post-likes p").textContent = `${post.likes} likes`
    mainLocation.appendChild(postContainer)
}

// Function to process the like button of each POST
function addLike(elemento) {
    console.log(elemento)
    console.log(elemento.parentElement)
    console.log(elemento.parentElement.parentElement)
    const likeCount = elemento.parentElement.parentElement.querySelector(".post-likes p")
    const currentLikes = parseInt(likeCount.textContent)
    likeCount.textContent = currentLikes + 1 + " likes"
}


