import { setSearchResults, setPostDetail } from "./postSlice";
import axios from "axios";
import {
  URL_P_D_DELETE_POST,
  URL_P_G_POST_INFO,
  URL_P_G_SEARCH_BY_QUERY,
  URL_P_PO_NEW_POST,
  URL_P_PA_UPDATE_POST,
} from "../../../constants/url";
import { header } from "../../../constants/header";
import Swal from "sweetalert2";
import { getUserInfo } from "../user/userThunk";
import { setUserProfile } from "../user/userSlice";
import mixins from "../../../helpers/Swals/Mixins";

export function createPost(post, token, setPost, t) {
  return async function (dispatch) {
    try {
      const response = await axios.post(URL_P_PO_NEW_POST, post, header(token));
      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: t("swal.createPostTitleSuccess"),
          showConfirmButton: true,
          timer: 4000,
        });
        setPost({
          name_on_doc: "",
          number_on_doc: "",
          country_found: "",
          date_found: "",
          blurred_imgs: [],
          comments: "",
          additional_contact_info: "",
        });
      }
      return dispatch(getUserInfo(token));
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: t("swal.createPostTitleError"),
        text: error.message,
        showConfirmButton: true,
        timer: 8000,
      });
    }
  };
}

export function searchPost(
  { name, number, country, date_lost, pag, lim, sortBy },
  token
) {
  return async function (dispatch) {
    try {
      let response = await axios.get(
        URL_P_G_SEARCH_BY_QUERY +
          `?name=${name}&number=${number}&country=${country}&date_lost=${date_lost}&pag=${pag}&lim=${lim}&sortBy=${sortBy}`,
        header(token)
      );
      return dispatch(setSearchResults(response.data));
    } catch (error) {
      return dispatch(
        setSearchResults({
          error: error.response?.data?.error || error.message,
        })
      );
    }
  };
}

export function fetchPostDetail(post_id, token) {
  return async function (dispatch) {
    try {
      let response = await axios.get(
        URL_P_G_POST_INFO + post_id,
        header(token)
      );
      return dispatch(setPostDetail(response.data));
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: t("postDetail.swalErrorMsg"),
        icon: "error",
      });
      return dispatch(setPostDetail({ error: error.message }));
    }
  };
}

export function resetPostDetail() {
  return function (dispatch) {
    try {
      return dispatch(setPostDetail({ pure: true }));
    } catch (error) {
      return dispatch(setPostDetail({ error: error.message }));
    }
  };
}

export function updatePost(obj, post_id, token) {
  console.log("Ejecutado updatePost");
  return async function (dispatch) {
    try {
      let response = await axios.patch(
        URL_P_PA_UPDATE_POST + post_id,
        obj,
        header(token)
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Post updated",
          timer: 5000,
          icon: "success",
          showConfirmButton: true,
          position: "center",
        });
      }
      return dispatch(setUserProfile(response.data));
    } catch (error) {
      Swal.fire({
        title: "Oops! Hubo un error:",
        text: error.message,
        icon: "error",
        showConfirmButton: true,
        position: "center",
      });
    }
  };
}

export function deletePost(post_id, token) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(
        URL_P_D_DELETE_POST + post_id,
        header(token)
      );
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Publicación borrada",
          text: `Total borrados: ${response.data.total}: UserPosts: ${response.data.userPosts}. postCollection: ${response.data.postCollection}.`,
          showConfirmButton: true,
          timer: 5000,
        });
      }
      return dispatch(getUserInfo(token));
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Ups, algo salió mal: ${
          error?.response?.data?.error || error.message
        }`,
        showConfirmButton: true,
      });
    }
  };
}

export function contactPostOwner(post_id, token) {
  return async function () {
    try {
      let response = await axios.post(
        URL_P_PO_CONTACT + post_id,
        {},
        header(token)
      );
      response.status === 202
        ? Swal.fire({
            position: "center",
            icon: "success",
            title: "Processing request. Check your email inbox.",
            showConfirmButton: true,
            timer: 5000,
          })
        : response.status >= 400 &&
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Ups! Something went wrong.",
            showConfirmButton: false,
            timer: 1500,
          });
      // return dispatch(setContactPostOwner(response.data));
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Ups! Something went wrong. ${error.message}`,
        showConfirmButton: true,
      });
    }
  };
}

export function contactPostOwnerWithSwal(post_id, token, t) {
  return async function () {
    mixins
      .contactPostOwnerMX(post_id, token, t)
      .fire()
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: t("postDetail.swalConfirmedTitle"),
            icon: "success",
            text: t("postDetail.swalConfirmedText"),
            // imageUrl: result.value.avatar_url,
          });
        }
      });
  };
}
