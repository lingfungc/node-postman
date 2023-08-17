import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const createKeyValuePair = () => {
  const element = keyValueTemplate.textContent.cloneNode(true);
};

const queryParamsContainer = document.querySelector("[data-query-params]");

const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);

const keyValueTemplate = document.querySelector("[date-key-value-template]");

queryParamsContainer.append(createKeyValuePair());

requestHeadersContainer.append(createKeyValuePair());
