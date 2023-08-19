import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Form
const form = document.querySelector("[data-form]");

// Get the Key Value Template
const keyValueTemplate = document.querySelector("[data-key-value-template]");

// Get Response Headers Section
const responseHeadersContainer = document.querySelector(
  "[data-response-headers]"
);

// Function to Create Key Value Pair HTML Element
const createKeyValuePair = () => {
  // * The .cloneNode(true) helps to clone all the text content from keyValueTemplate into variable "element"
  const element = keyValueTemplate.content.cloneNode(true);

  element.querySelector("[data-remove-btn]").addEventListener("click", (e) => {
    e.target.closest("[data-key-value-pair]").remove();
  });

  return element;
};

// Function to Convert Params to JavaScript Object
const keyValuePairToObjects = (container) => {
  const pairs = container.querySelectorAll("[data-key-value-pair]");

  if ([...pairs].length > 0) {
    return [...pairs].reduce((data, pair) => {
      const key = pair.querySelector("[data-key]").value;
      const value = pair.querySelector("[data-value]").value;

      if (key === "") return data;

      // console.log({ ...data, [key]: value });
      return { ...data, [key]: value };

      // This {} accumulator is a must in a .reduce function
    }, {});
  }
};

// Function to Update Response Headers Content
const updateResponseHeaders = (resHeaders) => {
  responseHeadersContainer.innerHTML = "";

  // This Object.entries() returns us an array containing all key-value pairs in resHeaders
  // Then inside the .forEach iteration, we can access the key-value pair as an array [key, value]
  // For example: const person = { isHuman: false, name: "Kyle" }
  //              Object.entries(person) => [ [ 'isHuman', false ], [ 'name', 'Kyle' ] ]
  Object.entries(resHeaders).forEach(([key, value]) => {
    const keyElement = document.createElement("div");
    keyElement.textContent = key + ":";
    // console.log(keyElement);
    responseHeadersContainer.append(keyElement);

    const valueElement = document.createElement("div");
    valueElement.textContent = value;
    // console.log(valueElement);
    responseHeadersContainer.append(valueElement);
  });
};

// Function to Update Response Body Content
const updateResponseBody = (response) => {
  document.querySelector("[data-status]").textContent = response.status;
};

// Query Params
const queryParamsContainer = document.querySelector("[data-query-params]");
const queryParamsAddBtn = document.querySelector("[data-add-query-params-btn]");
queryParamsAddBtn.addEventListener("click", () => {
  queryParamsContainer.append(createKeyValuePair());
});

// Request Headers
const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);
const requestHeadersAddBtn = document.querySelector(
  "[data-add-request-headers-btn]"
);
requestHeadersAddBtn.addEventListener("click", () => {
  requestHeadersContainer.append(createKeyValuePair());
});

// axios.interceptors.request.use((request) => {
//   console.log(request);
//   request.customData = request.customData || {};
//   console.log(request.customData);
//   request.customData.startTime = new Date().getTime();
//   console.log(request);
//   return request;
// });

// axios.interceptors.response.use(updateEndTime, (e) => {
//   Promise.reject(updateEndTime(e.response));
// });

// Handle Form Submission
// Testing URL: https://jsonplaceholder.typicode.com/todos/1
form.addEventListener("submit", (e) => {
  e.preventDefault();

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairToObjects(queryParamsContainer),
    headers: keyValuePairToObjects(requestHeadersContainer),
  })
    // We need to use .catch() to catch the error(s) when using axios
    // For example, the user enters an invalid URL with -1 as :id
    .catch((e) => e.response)
    .then((response) => {
      console.log(response);

      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");

      document.querySelector("[data-status]").innerText = response.status;

      // updateResponseBody(response);
      // updateResponseEditor(response.data);
      updateResponseHeaders(response.headers);
    });
});
