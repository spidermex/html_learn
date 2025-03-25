import {blogPOsts } from "./data.js"
import { renderPosts, renderSinglePost,renderFooter } from "./functions.js"


const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get('postID');
// console.log("El param:",paramValue);


const noCurrentPost= blogPOsts.filter(post => !(post.postID == paramValue))
const onlyThree = noCurrentPost.filter((post,index) => index<3)

renderPosts(onlyThree)
renderSinglePost(paramValue)
renderFooter()


