import { useContext } from "react";
import { ModelContext } from "../../App";
import * as Yup from "yup";

const idValidation = Yup.number()
  .integer("Invalid id")
  .required("id is required");
const nameValidation = Yup.string()
  .min(3, "Must be 3 characters or more")
  .max(20, "Must be 20 characters or less")
  .required("Name is required");
const authorNameValidation = Yup.string()
  .min(3, "Must be 3 characters or more")
  .max(20, "Must be 20 characters or less")
  .required("Author Name is required");
const descriptionValidation = Yup.string()
  .min(3, "Must be 3 characters or more")
  .max(200, "Must be 200 characters or less")
  .required("Description is required");
const categoryValidation = Yup.string()
  .min(3, "Must be 3 characters or more")
  .max(20, "Must be 20 characters or less")
  .required("Category is required");
const noOfPagesValidation = Yup.number()
  .integer("Invalid noOfPages")
  .required("noOfPages is required");
const priceValidation = Yup.number()
  .integer("Invalid price")
  .required("price is required");
const releaseDateValidation = Yup.date().required("releaseDate is required");

function useModelValidation() {
  const [model] = useContext(ModelContext);
  let modelValidation = "";

  if (model.modelNumber) {
    if (model.modelNumber === 2 || model.modelNumber === 10) {
      modelValidation = Yup.object({
        id: idValidation,
      });
    } else if (model.modelNumber === 3 || model.modelNumber === 11) {
      modelValidation = Yup.object({
        name: nameValidation,
      });
    } else if (model.modelNumber === 4) {
      modelValidation = Yup.object({
        name: nameValidation,
        author: authorNameValidation,
      });
    } else if (model.modelNumber === 20) {
      modelValidation = Yup.object({
        author: authorNameValidation,
        description: descriptionValidation,
      });
    } else if (model.modelNumber === 13) {
      modelValidation = Yup.object({
        name: nameValidation,
        category: categoryValidation,
      });
    } else if (model.modelNumber === 14) {
      if (model.updateById === true) {
        modelValidation = Yup.object({
          id: idValidation,
        });
      } else {
        modelValidation = Yup.object({
          name: nameValidation,
          author: authorNameValidation,
          description: descriptionValidation,
          category: categoryValidation,
          noOfPage: noOfPagesValidation,
          price: priceValidation,
          releasedYear: releaseDateValidation,
        });
      }
    } else if (model.modelNumber === 15 || model.modelNumber === 16) {
      if (model.updateByName === true) {
        modelValidation = Yup.object({
          name: nameValidation,
        });
      } else {
        modelValidation = Yup.object({
          author: authorNameValidation,
          description: descriptionValidation,
          category: categoryValidation,
          noOfPage: noOfPagesValidation,
          price: priceValidation,
          releasedYear: releaseDateValidation,
        });
      }
    } else if (model.modelNumber === 18) {
      modelValidation = Yup.object({
        name: nameValidation,
        author: authorNameValidation,
        description: descriptionValidation,
        category: categoryValidation,
        noOfPage: noOfPagesValidation,
        price: priceValidation,
        releasedYear: releaseDateValidation,
      });
    }
  }

  return modelValidation;
}

export default useModelValidation;
