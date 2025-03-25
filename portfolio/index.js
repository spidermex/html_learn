import { blogPOsts } from "./data.js"
import { renderPosts, renderHero, renderFooter } from "./functions.js"


const viewMoreBtn = document.getElementById("view-more")

viewMoreBtn.addEventListener("click", function (e) {
    if (e.target.id = "view-more") {
        handleClickMore()
    }
})

// Reloads the view-more posts array with new posts from database
function handleClickMore() {
    const lastIndex = noHeroPost.findIndex(item => item.postID === onlySix[onlySix.length - 1].postID)
    if (lastIndex >= noHeroPost.length - 1) {
        onlySix = noHeroPost.filter((post, index) => index < 6)
    } else {
        onlySix = []
        for (let i = lastIndex + 1; i < lastIndex + 7; i++)
            if (i < noHeroPost.length) {
                onlySix.push(noHeroPost[i])
            }
    }
    renderPosts(onlySix)
}


window.onload = function () {
    console.log("Page is fully loaded!");
};


const noHeroPost = blogPOsts.filter(post => !post.isHero)    //Array that stores all post except the hero-post
let onlySix = noHeroPost.filter((post, index) => index < 6)  // Array that stores only the posts for "view-more posts"
renderHero()
renderPosts(onlySix)
renderFooter()






