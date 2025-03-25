import { blogPOsts } from "./data.js"

// Renders the content of postsArray inside "posts-grid"
export function renderPosts(postsArray) {
    const postHtml = document.getElementById("posts-grid")
    let posts = ``
    postsArray.forEach(post => {
        const theDate = new Date(post.date)
        posts += ` <article class="post-card">
        <img src="./assets/${post.picture}" alt="Blog post illustration"
            class="post-card-image" />
        <time datetime="${post.date}" class="post-card-date">${theDate.toDateString()}</time>
        <a href="./post1.html?postID=${post.postID}">
            <h3 class="post-card-title">${post.title}</h3>
        </a>
        <p class="post-card-preview">${post.abstract}
        </p>
    </article>`
    })
    postHtml.innerHTML = posts
}

export function renderHero(){   
    const heroHtml = document.getElementById("hero-home")   
    const heroPost = blogPOsts.filter(post => post.isHero)
    const theDate = new Date(heroPost[0].date)
    heroHtml.innerHTML = `
    <div class="hero" style="background-image: url('./assets/${heroPost[0].picture}');">
        <time datetime="${heroPost[0].date}" class="hero-date">${theDate.toDateString()}</time>
        <a href="./post1.html?postID=${heroPost[0].postID}">
            <h1 class="hero-title"> ${heroPost[0].title}</h1>
        </a>
    <p class="hero-preview">
    ${heroPost[0].abstract}
    </p>
    </div>`
}

export function renderSinglePost(postid){
    const postHtml = document.getElementById("post-content")   
    const postContent = blogPOsts.filter(post => post.postID == postid)
    // console.log(postContent)
    const theDate = new Date(postContent[0].date)
    postHtml.innerHTML=` 
            <time datetime="${postContent[0].date}" class="post-date">${theDate.toDateString()}</time>
            <h2 class="post-title">${postContent[0].title}</h2>
            <p class="post-intro">
                ${postContent[0].abstract}
            </p>
            <img src="./assets/${postContent[0].picture}" alt="Bootcamp journey illustration"
                class="post-image" />
            <div class="post-body">
                ${postContent[0].content}
            </div>`
}

export function renderFooter(){
    const currentDate = new Date()
    document.getElementById("site-footer").innerHTML=`
<div class="footer-content">
    <h2 class="footer-title">My Learning Journal</h2>
    <p class="copyright">Copyright ©${currentDate.getFullYear()}</p>
</div>`
}








