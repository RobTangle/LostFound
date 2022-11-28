import { stringContainsURLs } from "./generic-validators";
import { isStringBetweenXAndYCharsLong } from "./generic-validators";
import { isValidDateBoolean } from "./generic-validators";

//* -------- POST FORM VALIDATOR :  ---------- --------------------------

export function postFormValidator(post, t) {
  try {
    const { name_on_doc, number_on_doc, country_found, date_found, comments } =
      post;
    if (
      !isStringBetweenXAndYCharsLong(
        validAttr.name_on_doc.minLength,
        validAttr.name_on_doc.maxLength,
        name_on_doc
      ) &&
      !isStringBetweenXAndYCharsLong(
        validAttr.number_on_doc.minLength,
        validAttr.number_on_doc.maxLength,
        number_on_doc
      )
    ) {
      throw new Error(t("postForm.errorNameAndNumberFalsy"));
    }
    if (name_on_doc.length > validAttr.name_on_doc.maxLength) {
      throw new Error(t("postForm.errorNameLength"));
    }
    if (number_on_doc.length > validAttr.number_on_doc.maxLength) {
      throw new Error(t("postForm.errorNumberLength"));
    }
    if (
      stringContainsURLs(name_on_doc) ||
      stringContainsURLs(number_on_doc) ||
      stringContainsURLs(comments)
    ) {
      throw new Error(t("postForm.errorStringContainsURLs"));
    }
    if (comments.length > validAttr.comments.maxLength) {
      throw new Error(t("postForm.errorCommentsLength"));
    }
    if (country_found.length !== 2) {
      throw new Error(t("postForm.errorCountryInvalid"));
    }
    if (!date_found) {
      throw new Error(t("postForm.errorDateFalsy"));
    }
    if (!isValidDateBoolean(date_found)) {
      throw new Error(t("postForm.errorDateInvalid"));
    }
    return true;
  } catch (error) {
    return { error: error.message };
  }
}
