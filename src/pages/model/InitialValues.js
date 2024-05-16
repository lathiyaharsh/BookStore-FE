import { useContext } from "react";
import { ModelContext } from "../../App";

function useInitialValues() {
  const [model] = useContext(ModelContext);
  let initialValues = {};
  if (model.modelNumber === 2 || model.modelNumber === 10) {
    initialValues.id = "";
  } else if (model.modelNumber === 3 || model.modelNumber === 11) {
    initialValues.name = "";
  } else if (model.modelNumber === 4) {
    initialValues.name = "";
    initialValues.author = "";
  } else if (model.modelNumber === 12) {
    initialValues.author = "";
    initialValues.description = "";
  } else if (model.modelNumber === 13) {
    initialValues.name = "";
    initialValues.category = "";
  } else if (model.modelNumber === 14) {
    if (model.updateById === true) {
      initialValues.id = "";
    } else {
      initialValues.name = "";
      initialValues.author = "";
      initialValues.description = "";
      initialValues.category = "";
      initialValues.noOfPages = "";
      initialValues.price = "";
      initialValues.releasedYear = "";
    }
  } else if (model.modelNumber === 15 || model.modelNumber === 16) {
    initialValues.name = "";
    initialValues.author = "";
    initialValues.description = "";
    initialValues.category = "";
    initialValues.noOfPage = "";
    initialValues.price = "";
    initialValues.releasedYear = "";
  } else if (model.modelNumber === 18) {
    initialValues.name = "";
    initialValues.author = "";
    initialValues.description = "";
    initialValues.category = "";
    initialValues.noOfPage = "";
    initialValues.price = "";
    initialValues.releasedYear = "";
  }

  return initialValues;
}

export default useInitialValues;
