import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import setupEditors from "./setupEditors";

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

// Function to Update Response Details Content
const updateResponseDetails = (response) => {
  document.querySelector("[data-status]").textContent = response.status;
  document.querySelector("[data-time]").textContent = response.customData.time;
  // We use .length() because 1 character equals to 1 byte
  // Remark that this prettyBytes() isn't 100% accurate
  document.querySelector("[data-size]").textContent = prettyBytes(
    JSON.stringify(response.data).length +
      JSON.stringify(response.headers).length
  );
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

// We are using axios to intercept the request
axios.interceptors.request.use((request) => {
  // console.log(request);

  // We add a new custom data in the request, by default is an empty object at first
  request.customData = request.customData || {};
  // console.log(request.customData);

  // We set the start time in the request to be the current timestamp
  request.customData.startTime = new Date().getTime();

  // console.log(request);å
  return request;
});

const updateEndTime = (response) => {
  console.log(response);

  response.customData = response.customData || {};

  // This response.config stores the data from the request
  response.customData.time =
    new Date().getTime() - response.config.customData.startTime;
  return response;
};

// We are using axios to intercept the response
// The 1st argument is for a successful response, and we update end time in this response
// The 2nd argument is update the end time for the bad response which is rejected
// In the 2nd argument, the error (e) is from the .catch() in the axios below
axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});

const { requestEditor, updateResponseEditor } = setupEditors();

// Handle Form Submission
// Testing URL: https://jsonplaceholder.typicode.com/todos/1
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let data;
  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null);
  } catch (e) {
    alert("JSON data is malformed");
    return;
  }

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairToObjects(queryParamsContainer),
    headers: keyValuePairToObjects(requestHeadersContainer),
    data,
  })
    // We need to use .catch() to catch the error(s) when using axios
    // For example, the user enters an invalid URL with -1 as :id
    .catch((e) => e)
    .then((response) => {
      console.log(response);

      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");

      updateResponseDetails(response);
      updateResponseEditor(response.data);
      updateResponseHeaders(response.headers);
    });
});
