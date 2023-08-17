import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Form
const form = document.querySelector("[data-form]");

// Get the Key Value Template
const keyValueTemplate = document.querySelector("[data-key-value-template]");

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

      if (ley === "") return data;
      return { ...data, [key]: value };
    });
  }
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairToObjects(queryParamsContainer),
    headers: keyValuePairToObjects(requestHeadersContainer),
  }).then((response) => {
    console.log(response);
  });
});
