function getUrl(action, values, currentPage , dataOrder , sortValues) {
  let url = "";
  
  const baseUrl = "http://localhost:8007/api/books";
  switch (action) {
    case 1:
      url = `${baseUrl}?page=${currentPage}`;
      break;
    case 2:
      url = `${baseUrl}/${values?.id}`;
      break;
    case 3:
      url = `${baseUrl}?search=${values?.name}&page=${currentPage}`;
      break;
    case 4:
      url = `${baseUrl}?search=${values?.name}&authorName=${values?.author}&page=${currentPage}`;
      break;
    case 5:
      url = `${baseUrl}?pages_gte=100&page=${currentPage}`;
      break;
    case 6:
      url = `${baseUrl}?pages_gte=25&pages_lte=90&page=${currentPage}`;
      break;
    case 7:
      url = `${baseUrl}?pages_gte=25&pages_lte=90&pages_ne=80&page=${currentPage}`;
      break;
    case 8:
      url = `${baseUrl}?pages_eq=0&page=${currentPage}`;
      break;
    case 9:
      url = `${baseUrl}?year=2001&year1=2015&page=${currentPage}`;
      break;
    case 10:
      url = `${baseUrl}/${values?.id}`;
      break;
    case 11:
      url = `${baseUrl}/0?bookName=${values?.name}`;
      break;
    case 12:
      url = `${baseUrl}/0?bookAuthor=${values?.author}&bookDescription=${values?.description}`;
      break;
    case 13:
      url = `${baseUrl}/0?bookName=${values?.name}&bookCategory=${values?.category}`;
      break;
    case 14:
      url = `${baseUrl}/${values?.id}`;
      break; 
    case 15:
      url = `${baseUrl}/0?bookName=${values?.name}`;
      break;
    case 16:
      url = `${baseUrl}/0?author=${values?.author}&bookName=${values?.name}`;
      break;     
    case 17:
      url = `${baseUrl}/?sort=${values}&order=${dataOrder}&page=${currentPage}&search=${sortValues?.name}&authorName=${sortValues?.author}`;  
      break;
    case 18:
      url = `${baseUrl}`;
      break;  
    default:
      url = `${baseUrl}?page=${currentPage}`;
  }
  return url;
}

export default getUrl;
