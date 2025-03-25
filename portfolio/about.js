import {blogPOsts } from "./data.js"
import { renderPosts, renderFooter } from "./functions.js"

const soloSix = blogPOsts.filter((post,index) => index<3)

renderPosts(soloSix)
renderFooter()