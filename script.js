import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const keyValueTemplate = document.querySelector("[data-key-value-template]");
const createKeyValuePair = () => {
  // * The .cloneNode(true) helps to clone all the text content from keyValueTemplate into variable "element"
  const element = keyValueTemplate.content.cloneNode(true);

  element.querySelector("[data-remove-btn]").addEventListener("click", (e) => {
    e.target.closest("[data-key-value-pair]").remove();
  });

  return element;
};

const queryParamsContainer = document.querySelector("[data-query-params]");
const queryParamsAddBtn = document.querySelector("[data-add-query-params-btn]");
queryParamsAddBtn.addEventListener("click", () => {
  queryParamsContainer.append(createKeyValuePair());
});

const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);
requestHeadersContainer.append(createKeyValuePair());
