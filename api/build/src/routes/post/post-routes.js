"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtMiddleware_1 = __importDefault(require("../../config/jwtMiddleware"));
const post_middlewares_1 = require("./post-middlewares");
const post_pagination_1 = require("./post-pagination");
const router = (0, express_1.Router)();
// FIND ALL POSTS (JUST FOR TESTING. NOT FOR PRODUCTION) :
router.get("/findAll", post_middlewares_1.findAllPostsResponse);
// CREATE A NEW POST :
router.post("/newPost", jwtMiddleware_1.default, post_middlewares_1.handleNewPostRequest);
// SEARCH POSTS BY QUERY WITH PAGINATION :
router.get("/search", jwtMiddleware_1.default, post_pagination_1.handlePaginatedPostResultsRequest);
// UPDATE A POST :
router.patch("/:_id", jwtMiddleware_1.default, post_middlewares_1.handleUpdateRequest);
// GET POST BY POST_ID IN PARAMS :
router.get("/:_id", jwtMiddleware_1.default, post_middlewares_1.handleGetPostByIdRequest);
// DELETE POST BY POST_ID IN PARAMS :
router.delete("/:_id", jwtMiddleware_1.default, post_middlewares_1.handleDeletePostRequest);
// CONTACT POST OWNER :
router.post("/contact/:post_id", jwtMiddleware_1.default, post_middlewares_1.handleContactUserRequest);
// SEARCH POSTS BY QUERY //? ruta vieja, antes de implementar paginado:
// router.get("/search", jwtCheck, handleSearchByQueryRequest);
exports.default = router;
