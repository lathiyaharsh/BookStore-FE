import axios from "axios";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import useToken from "./services/token";
import { useFormik } from "formik";
import useModelValidation from "./model/ModelValidation";
import useInitialValues from "./model/InitialValues";
import { ModelContext } from "../App";
import getUrl from "./services/getUrl";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [apiData, setApiData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [viewModel, setViewModel] = useState(false);
  const [lastModelData, setLastModelData] = useState(null);
  const [model, setModel] = useContext(ModelContext);
  const [deleteApi, setDeleteApi] = useState(false);
  const [updateApi, setUpdateApi] = useState(false);
  const [viewNewData, setViewNewData] = useState(true);
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataOrder, setDataOrder] = useState(false);
  const [sortName, setSortName] = useState("");
  const [addBookApi, setAddBookApi] = useState(false);

  const handleAction = async (actionDescription, values, pages) => {
    if(actionDescription !== 17){
      setModel({ ...model, sortValues: values });
    }
    let showPage = 1;
    if (pages) {
      showPage = pages;
    } else {
      showPage = currentPage;
    }
    console.log(model.sortValues);
    const url = await getUrl(actionDescription, values, showPage, dataOrder ,model.sortValues);

    if (deleteApi) {
      await deleteBook(url);
    } else if (updateApi) {
      await updateBook(url);
    } else if (addBookApi) {
      await addBook(url);
    } else {
      await getBooks(url);
    }
  };
  const token = useToken();

  const addBook = async (url) => {
    try {
      const response = await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Added successfully:", response.data);
      if (response.data.message) {
        toast.success(response.data.message);
      }
      if (response.data) {
        getBooks(`http://localhost:8007/api/books/?sort=id&order=false&page=1`);
      }
      setAddBookApi(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error adding book:", error);
    }
  };

  const getBooks = async (url) => {
    await axios
      .get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (model.modelName.startsWith("Update") && viewNewData) {
          if (res.data.bookDetails) {
            setViewModel(true);
            setUpdateApi(true);

            let modelUpdateName = "";
            if (model.modelNumber === 14) {
              modelUpdateName = res.data.bookDetails.id;
              setModel((m) => {
                return {
                  ...m,
                  modelName: model.modelName + " " + modelUpdateName,
                  updateById: false,
                  updateByName: false,
                  updateByAuthor: false,
                  inputName: true,
                  inputAuthor: true,
                  inputDescription: true,
                  inputCategory: true,
                  inputNoOfPages: true,
                  inputPrice: true,
                  inputReleaseDate: true,
                };
              });
            }
            if (model.modelNumber === 15) {
              modelUpdateName = res.data.bookDetails.name;
              setModel((m) => {
                return {
                  ...m,
                  modelName: model.modelName + " " + modelUpdateName,
                  updateById: false,
                  updateByName: false,
                  updateByAuthor: false,
                  inputName: false,
                  inputAuthor: true,
                  inputDescription: true,
                  inputCategory: true,
                  inputNoOfPages: true,
                  inputPrice: true,
                  inputReleaseDate: true,
                };
              });
            }
            if (model.modelNumber === 16) {
              modelUpdateName = `Author: ${res.data.bookDetails.author} Name: ${res.data.bookDetails.name}`;
              setModel((m) => {
                return {
                  ...m,
                  modelName: model.modelName + " " + modelUpdateName,
                  updateById: false,
                  updateByName: false,
                  updateByAuthor: false,
                  inputName: false,
                  inputAuthor: false,
                  inputDescription: true,
                  inputCategory: true,
                  inputNoOfPages: true,
                  inputPrice: true,
                  inputReleaseDate: true,
                };
              });
            }

            formik.setValues(res.data.bookDetails);
            setViewNewData(false);
          }
        } else if (res.data.bookDetails) {
          setApiData([res.data.bookDetails]);
          setMaxPage(1);
          setViewModel(false);
          setViewNewData(true);
        }
        if (res.data.bookList) {
          setApiData(res.data.bookList);
          setMaxPage(res.data.maxPage);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error("Error fetching data: ", error);
      });
  };

  const updateBook = async (url) => {
    try {
      const response = await axios.put(url, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.message) {
        toast.success(response.data.message);
      }
      console.log("Updated successfully:", response.data);
      if (response.data) {
        getBooks(`http://localhost:8007/api/books/${values?.id}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error Updating book:", error);
    }
  };

  const deleteBook = async (url) => {
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Deleted successfully:", response.data);
      console.log(response.data);
      if (response.data.message) {
        toast.success(response.data.message);
      }
      setDeleteApi(false);
      getBooks(`http://localhost:8007/api/books?page=1`);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error deleting book:", error);
    }
  };

  useEffect(() => {
    if (model.modelNumber === 1) {
      handleAction(model.modelNumber);
    } else if (model.modelName.startsWith("Delete")) {
      handleAction(1);
    } else if (model.modelNumber === 17) {
      handleAction(model.modelNumber, sortName);
    } else {
      handleAction(model.modelNumber, lastModelData);
    }
  }, [currentPage]);

  const formik = useFormik({
    initialValues: useInitialValues(),
    validationSchema: useModelValidation(),
    onSubmit: async (values) => {
      try {
        setLastModelData(values);
        if (deleteApi) {
          handleAction(model.modelNumber, values);
        } else if (updateApi) {
          handleAction(model.modelNumber, values);
        } else {
          handleAction(model.modelNumber, values);
        }
      } catch (error) {
      } finally {
        setModel((m) => {
          return {
            ...m,
            inputId: false,
            inputName: false,
            inputAuthor: false,
            inputDescription: false,
            inputCategory: false,
            inputNoOfPages: false,
            inputPrice: false,
            inputReleaseDate: false,
          };
        });
        setDeleteApi(false);
        setAddBookApi(false);
        setUpdateApi(false);
        setViewModel(false);
        formik.resetForm();
      }
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    formik;

  return (
    <>
      <div className="p-8  bg-gray-100 min-h-screen  ">
        <div className="max-w-xxl rounded px-8 pt-6 pb-8 mb-4 w-full">
          <div className="text-3xl font-bold  w-full">
            <div className="space-y-2 w-full">
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  handleAction(1, 0, 1);
                  setModel((m) => {
                    return {
                      ...m,
                      modelNumber: 1,
                    };
                  });
                }}
              >
                Show details of all books
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setDeleteApi(false);
                  setUpdateApi(false);
                  setAddBookApi(false);
                  setModel((m) => {
                    return {
                      ...m,
                      inputId: true,
                      modelName: "Show Book by Book Id",
                      modelNumber: 2,
                    };
                  });
                }}
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
              >
                Show Book by Book Id
              </button>

              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setModel((m) => {
                    return {
                      ...m,
                      inputName: true,
                      modelName: "Show Book by Book Name",
                      modelNumber: 3,
                    };
                  });
                }}
              >
                Show Book by Book Name
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setModel((m) => {
                    return {
                      ...m,
                      inputName: true,
                      inputAuthor: true,
                      modelName: "Show Book by Book Author and Book Name",
                      modelNumber: 4,
                    };
                  });
                }}
              >
                Show Book by Author and Name
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setModel((m) => {
                    return {
                      ...m,
                      modelNumber: 5,
                    };
                  });
                  handleAction(5, 0, 1);
                }}
              >
                Show Book by having pages &gt; 100
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setModel((m) => {
                    return {
                      ...m,
                      modelNumber: 6,
                    };
                  });
                  handleAction(6, 0, 1);
                }}
              >
                Show Book by pages &lt; 90 & &gt; 25
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setModel((m) => {
                    return {
                      ...m,
                      modelNumber: 7,
                    };
                  });
                  handleAction(7, 0, 1);
                }}
              >
                Show Book by pages &lt 90 & &gt; 25 & ≠ 80
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setModel((m) => {
                    return {
                      ...m,
                      modelNumber: 8,
                    };
                  });
                  handleAction(8, 0, 1);
                }}
              >
                Show Book by having 0 pages
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setModel((m) => {
                    return {
                      ...m,
                      modelNumber: 9,
                    };
                  });
                  handleAction(9, 0, 1);
                }}
              >
                Show Book Released in 2015 & 2001
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setDeleteApi(true);
                  setModel((m) => {
                    return {
                      ...m,
                      inputId: true,
                      modelName: "Delete Book by Book Id",
                      modelNumber: 10,
                    };
                  });
                }}
              >
                Delete Book by Book Id
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setDeleteApi(true);
                  setModel((m) => {
                    return {
                      ...m,
                      inputName: true,
                      modelName: "Delete Book by Book Name",
                      modelNumber: 11,
                    };
                  });
                }}
              >
                Delete Book by Book Name
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setDeleteApi(true);
                  setModel((m) => {
                    return {
                      ...m,
                      inputAuthor: true,
                      inputDescription: true,
                      modelName:
                        "Delete Book by Book Author and Book Description",
                      modelNumber: 12,
                    };
                  });
                }}
              >
                Delete Book by Author and Description
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setDeleteApi(true);
                  setModel((m) => {
                    return {
                      ...m,
                      inputName: true,
                      inputCategory: true,
                      modelName: "Delete Book by Book Name and Book Category",
                      modelNumber: 13,
                    };
                  });
                }}
              >
                Delete Book by Name and Category
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setUpdateApi(false);
                  setDeleteApi(false);
                  setAddBookApi(false);
                  setModel((m) => {
                    return {
                      ...m,
                      modelName: "Update Book by Book Id",
                      modelNumber: 14,
                      updateById: true,
                    };
                  });
                }}
              >
                Update Book by Book Id
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setUpdateApi(false);
                  setDeleteApi(false);
                  setAddBookApi(false);
                  setModel((m) => {
                    return {
                      ...m,
                      modelName: "Update Book by Book Name",
                      modelNumber: 15,
                      updateByName: true,
                    };
                  });
                }}
              >
                Update Book by Book Name
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setUpdateApi(false);
                  setDeleteApi(false);
                  setAddBookApi(false);
                  setModel((m) => {
                    return {
                      ...m,
                      modelName: "Update Book by Book Author and Book Name",
                      modelNumber: 16,
                      updateByName: true,
                      updateByAuthor: true,
                    };
                  });
                }}
              >
                Update Book by Author and Name
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm me-2"
                onClick={() => {
                  setCurrentPage(1);
                  setViewModel(true);
                  setUpdateApi(false);
                  setDeleteApi(false);
                  setAddBookApi(true);
                  setModel((m) => {
                    return {
                      ...m,
                      modelName: "Add New Book",
                      modelNumber: 18,
                      inputName: true,
                      inputAuthor: true,
                      inputDescription: true,
                      inputCategory: true,
                      inputNoOfPage: true,
                      inputPrice: true,
                      inputReleaseDate: true,
                    };
                  });
                }}
              >
                Add New Book
              </button>

              {viewModel && (
                <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                  <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {model.modelName}
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={() => {
                            setViewModel(false);
                            setDeleteApi(false);
                            setAddBookApi(false);
                            setUpdateApi(false);
                            setViewNewData(true);
                            setModel((m) => {
                              return {
                                ...m,
                                inputId: false,
                                inputName: false,
                                inputAuthor: false,
                                inputDescription: false,
                                inputCategory: false,
                                inputNoOfPage: false,
                                inputPrice: false,
                                inputReleaseDate: false,
                                updateById: false,
                                updateByName: false,
                                updateByAuthor: false,
                                modelName: " Book",
                              };
                            });
                            formik.resetForm();
                          }}
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4 grid-cols-2">
                          {model.inputId && (
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="id"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Id
                              </label>
                              <input
                                type="number"
                                name="id"
                                id="id"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.id}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Id"
                                required=""
                              />
                              {touched.id && errors.id ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.id}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.inputName && (
                            <div className="col-span-2">
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type book name"
                                required=""
                              />
                              {touched.name && errors.name ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.name}
                                </div>
                              ) : null}
                            </div>
                          )}

                          {model.inputAuthor && (
                            <div className="col-span-2">
                              <label
                                htmlFor="Author Name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Author Name
                              </label>
                              <input
                                type="text"
                                name="author"
                                id="author"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.author}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type book Author Name"
                                required=""
                              />
                              {touched.author && errors.author ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.author}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.inputDescription && (
                            <div className="col-span-2">
                              <label
                                htmlFor="Description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                name="description"
                                id="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-50 dark:focus:border-primary-500"
                                placeholder="Type book description"
                                required=""
                              />
                              {touched.description && errors.description ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.description}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.inputCategory && (
                            <div className="col-span-2">
                              <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Category
                              </label>
                              <input
                                type="text"
                                name="category"
                                id="category"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.category}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type Book Category name"
                                required=""
                              />
                              {touched.category && errors.category ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.category}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.inputNoOfPage && (
                            <div className="col-span-2">
                              <label
                                htmlFor="noOfPage"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                No Of Page
                              </label>
                              <input
                                type="number"
                                name="noOfPage"
                                id="noOfPage"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.noOfPage}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-50
                                dark:focus:border-primary-500"
                                placeholder="Type No Of Page"
                                required=""
                              />
                              {touched.noOfPage && errors.noOfPage ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.noOfPage}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.inputPrice && (
                            <div className="col-span-2">
                              <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.price}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-50
                                dark:focus:border-primary-500"
                                placeholder="Type Price"
                                required=""
                              />
                              {touched.price && errors.price ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.price}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.inputReleaseDate && (
                            <div className="col-span-2">
                              <label
                                htmlFor="releasedYear"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Release Date
                              </label>
                              <input
                                type="number"
                                name="releasedYear"
                                id="releasedYear"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.releasedYear}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-50
                                dark:focus:border-primary-500"
                                placeholder="Type Release Date"
                                required=""
                              />
                              {touched.releasedYear && errors.releasedYear ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.releasedYear}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.updateById && (
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="id"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Id
                              </label>
                              <input
                                type="number"
                                name="id"
                                id="id"
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                                onBlur={handleBlur}
                                value={values.id}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type Id"
                                required=""
                              />
                              {touched.id && errors.id ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.id}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.updateByName && (
                            <div className="col-span-2 ">
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                                onBlur={handleBlur}
                                value={values.name}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-50
                                dark:focus:border-primary-500"
                                placeholder="Type Book Name"
                                required=""
                              />
                              {touched.name && errors.name ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.name}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {model.updateByAuthor && (
                            <div className="col-span-2">
                              <label
                                htmlFor="Author Name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Author Name
                              </label>
                              <input
                                type="text"
                                name="author"
                                id="author"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.author}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type book Author Name"
                                required=""
                              />
                              {touched.author && errors.author ? (
                                <div className="text-red-500 text-xs italic">
                                  {errors.author}
                                </div>
                              ) : null}
                            </div>
                          )}
                          {loading && (
                            <div className="col-span-2">
                              <Skeleton height={40} />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleSubmit();
                          }}
                          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-12">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Book Id
                        <button
                          onClick={() => {
                            
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "id");
                            setSortName("id");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Book Name
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "name");
                            setSortName("name");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Book Desc
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "description");
                            setSortName("description");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Book Author
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "author");
                            setSortName("author");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        No of Page
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "noOfPage");
                            setSortName("noOfPage");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Book Category
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "category");
                            setSortName("category");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Book Price
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "price");
                            setSortName("price");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Released Year
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setModel((m) => {
                              return {
                                ...m,
                                modelNumber: 17,
                              };
                            });
                            handleAction(17, "releasedYear");
                            setSortName("releasedYear");
                            setDataOrder(!dataOrder);
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(apiData) && apiData.length > 0 ? (
                    apiData.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.id}
                        </th>
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">{item.author}</td>
                        <td className="px-6 py-4">{item.noOfPage}</td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">{item.price}</td>
                        <td className="px-6 py-4">{item.releasedYear}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td colSpan="8" className="px-6 text-center py-4">
                        {" "}
                        Data Not Found{" "}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <ul className="flex items-center -space-x-px h-10 text-base justify-end">
              <li>
                <a
                  href="js:"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => (p > 1 ? p - 1 : p));
                  }}
                  className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-3 h-3 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </a>
              </li>
              {/* Map over an array to create page numbers dynamically */}
              {Array.from(
                {
                  length:
                    Math.min(maxPage, currentPage + 2) -
                    Math.max(1, currentPage - 2) +
                    1,
                },
                (_, index) => Math.max(1, currentPage - 2) + index
              ).map((page) => (
                <li key={page}>
                  <a
                    href="js:"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === page ? "text-blue-600 bg-blue-50 border-blue-300" : "text-gray-500 bg-white border-gray-300"} hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    {page}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="js:"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => (p < maxPage ? p + 1 : p));
                  }}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-3 h-3 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
