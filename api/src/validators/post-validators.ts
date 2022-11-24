import { DateTime } from "luxon";

import { IUser } from "../mongoDB/models/User";
import {
  isFalsyArgument,
  isStringBetween1AndXCharsLong,
  isStringXCharsLong,
  stringContainsURLs,
} from "./genericValidators";
import { arrayOfCountriesTwoChars } from "../miscellanea/CountiesArrays";

// VALIDATE UPDATE POST DATA :
export function validateUpdatePostData(bodyFromReq: any): {
  name_on_doc: string;
  number_on_doc: string;
  country_found: string;
  date_found: any;
  blurred_imgs: string[];
  comments: string | undefined;
} {
  const {
    name_on_doc,
    number_on_doc,
    country_found,
    date_found,
    blurred_imgs,
    comments,
  } = bodyFromReq;

  const validatedUpdatePostData = {
    name_on_doc: checkNameOnDoc(name_on_doc),
    number_on_doc: checkNumberOnDoc(number_on_doc),
    country_found: checkCountry(country_found),
    date_found: checkDate(date_found),
    blurred_imgs: checkBlurredImgs(blurred_imgs),
    comments: checkComments(comments),
  };
  return validatedUpdatePostData;
}

// VALIDATE NEW POST :
export function validatePost(bodyFromReq: any): {
  name_on_doc: string;
  number_on_doc: string;
  country_found: string;
  date_found: any;
  blurred_imgs: string[];
  comments: string | undefined;
  user_posting: IUser;
} {
  const {
    name_on_doc,
    number_on_doc,
    country_found,
    date_found,
    blurred_imgs,
    comments,
    user_posting,
  } = bodyFromReq;

  const validatedPost = {
    name_on_doc: checkNameOnDoc(name_on_doc),
    number_on_doc: checkNumberOnDoc(number_on_doc),
    country_found: checkCountry(country_found),
    date_found: checkDate(date_found),
    blurred_imgs: checkBlurredImgs(blurred_imgs),
    comments: checkComments(comments),
    user_posting: checkUserPosting(user_posting),
  };
  return validatedPost;
}

export function checkNameOnDoc(nameFromReq: any): string {
  if (isStringBetween1AndXCharsLong(100, nameFromReq)) {
    if (stringContainsURLs(nameFromReq)) {
      throw new Error(`URLs are not allowed.`);
    }
    let nameParsedToLowerCase = nameFromReq.toLowerCase();
    return nameParsedToLowerCase;
  }
  throw new Error(`El nombre en el documento "${nameFromReq} no es válido.`);
}

export function checkNumberOnDoc(numberOnDocFromReq: any): string {
  if (isStringBetween1AndXCharsLong(100, numberOnDocFromReq)) {
    // estos métodos dejan afuera las letras con tíldes. Pero como debería ser un número, no deberían haber caracteres de ese tipo.
    let onlyAlphaNumCharsAndLowerCased = numberOnDocFromReq
      .replace(/[^A-Za-z0-9]/g, "")
      .toLowerCase();
    return onlyAlphaNumCharsAndLowerCased;
  }
  throw new Error(`The document number "${numberOnDocFromReq}" is invalid.`);
}

// Buscar forma de tener los mismos países en el front que en el back. En el front se deberían ver los nombres de los países.
// Podría ordenar el arreglo para que los países más populares estén en los primeros elementos de la lista para que encuentre el match rápidamente.
// Crear índices en MongoDB
export function checkCountry(countryFromReq: any): string {
  if (!isStringXCharsLong(2, countryFromReq)) {
    throw new Error(`The country must be a string 2 chars long.`);
  }
  // CHECKEAR SI EXISTE EN EL ARREGLO DE PAÍSES...
  for (let i = 0; i < arrayOfCountriesTwoChars.length; i++) {
    const element = arrayOfCountriesTwoChars[i];
    if (element.toUpperCase() === countryFromReq.toUpperCase()) {
      return element;
    }
  }
  throw new Error(`The country "${countryFromReq}" is invalid.`);
}

//! Arreglar parseo para cuando me lleguen Dates que ya estén convertidas a JSDate!
export function checkDate(dateFromReq: any) {
  try {
    let parsedDate: any = DateTime.fromFormat(dateFromReq, "yyyy-MM-dd");
    if (parsedDate.invalid) {
      throw new Error(parsedDate.invalid?.explanation);
    }
    return parsedDate.toJSDate();
  } catch (error: any) {
    console.log(`Error en parseDate. ${error.message}`);
    throw new Error(error.message);
  }
}

//! parsear las imágenes que borronearlas, ya sea los números y letras con IA, o la imágen en general con el SDK de cloudinary o El otro "blur" o algo así.. :
function checkBlurredImgs(blurredImgsFromReq: any): string[] {
  if (Array.isArray(blurredImgsFromReq)) {
    if (blurredImgsFromReq.length === 0) {
      return [];
    }
    let blurredImgs = blurredImgsFromReq.map((image) => {
      // aplicar fn que blurrea imágenes...
      return image;
    });
    return blurredImgs;
  }
  return [];
}

function checkComments(commentsFromReq: any): string | undefined {
  if (isFalsyArgument(commentsFromReq)) {
    return undefined;
  }
  let maxLength = 800;
  if (isStringBetween1AndXCharsLong(maxLength, commentsFromReq)) {
    if (stringContainsURLs(commentsFromReq)) {
      throw new Error(`URLs are not allowed.`);
    }
    return commentsFromReq;
  }
  throw new Error(
    `The comment entered is invalid. Please, enter a text of no more than ${maxLength} characters long or leave the input empty.`
  );
}

function checkUserPosting(userPosting: any): IUser {
  if (isFalsyArgument(userPosting)) {
    throw new Error(
      `Error in validation: The user posting can't be a falsy value.`
    );
  }
  return userPosting;
}
