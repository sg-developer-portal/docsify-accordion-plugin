import sanitize from 'sanitize-html';

// Sanitize the HTML content of the accordion
export function sanitizeHtml(html) {
  return sanitize(html, {
    // Allow emojis
    allowedTags: sanitize.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      '*': ['style']
    }
  });
}

function handleAccordionClick(id) {
  const accordion = document.querySelector(`[data-accordion-id="${id}"]`);
  const header = accordion.querySelector('a.sgds-accordion-header');
  const headerAttribute = header.getAttribute('aria-expanded');
  const body = accordion.querySelector('div.sgds-accordion-body');

  // Toggle the accordion and chevron icon
  accordion.classList.toggle('is-open');
  header.classList.toggle('is-active');
  header.querySelector('i.sgds-icon').classList.toggle('sgds-icon-chevron-up');
  header.querySelector('i.sgds-icon').classList.toggle('sgds-icon-chevron-down');
  body.classList.toggle('is-expanded');

  if (headerAttribute === 'false') {
    header.setAttribute('aria-expanded', 'true');
  } else {
    header.setAttribute('aria-expanded', 'false');
  }
}

export function install(hook, vm) {
  hook.afterEach(function (plainText) {
    try {
      // Parse the plain text into HTML
      const parser = new DOMParser();
      const document = parser.parseFromString(plainText, 'text/html');
      const accordions = document.querySelectorAll('details > summary');
      const useSGDSAccordion = (window.$docsify.useSGDSAccordion && window.$docsify.useSGDSAccordion) || true; // Created to support feature flagging. Default is set to true.

      if (!useSGDSAccordion || accordions.length === 0) {
        return plainText;
      }

      accordions.forEach((accordion, key) => {
        // Parent element of the accordion
        const sgdsAccordion = document.createElement('div');
        sgdsAccordion.classList.add('sgds-accordion', 'margin--bottom');
        sgdsAccordion.setAttribute('data-accordion-id', key);
        sgdsAccordion.setAttribute('id', `accordion-${key}`);

        // First child of the accordion
        const accordionHeader = document.createElement('a');
        accordionHeader.classList.add('sgds-accordion-header', 'padding--top', 'padding--bottom', 'has-text-dark', 'has-background-white');
        accordionHeader.setAttribute('role', 'button');
        accordionHeader.setAttribute('aria-expanded', 'false');
        accordionHeader.innerHTML = `<div>${sanitizeHtml(accordion.innerHTML)}</div><i class="sgds-icon sgds-icon-chevron-up"></i>`;

        // Second child of the accordion
        const accordionBody = document.createElement('div');
        accordionBody.classList.add('sgds-accordion-body');
        // We are currently in the summary element, so we need to get the parent element before we can extract the HTML content of the details element apart from the summary element
        const accordionParent = accordion.parentNode;
        // Instead of appending the elements directly to the DOM, we append them to a document fragment and then append the fragment to the DOM. This can improve performance by reducing the number of DOM operations.
        const fragment = document.createDocumentFragment();
        // Iterate over the child nodes of the details element
        for (let i = 0; i < accordionParent.childNodes.length; i++) {
          const childNode = accordionParent.childNodes[i];

          // Skip the summary element by not adding it to the fragment
          if ((childNode.tagName && childNode.tagName.toLowerCase() === 'summary')) {
            continue;
          }

          // Skip the first and last br elements by not adding them to the fragment
          if (childNode.tagName && childNode.tagName.toLowerCase() === 'br' && i !== 0 && i !== accordionParent.childNodes.length - 1) {
            continue;
          }

          // Add comment for future ppl
          if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim() !== '') {
            fragment.appendChild(document.createTextNode(childNode.textContent));
            continue;
          }

          // Add comment for future ppl
          if (childNode.nodeType === Node.ELEMENT_NODE) {
            fragment.appendChild(childNode.cloneNode(true));
            continue;
          }
        }

        // Add the content of the details element to the accordion body
        accordionBody.appendChild(fragment);
        // Add the header and body to the accordion
        sgdsAccordion.appendChild(accordionHeader);
        sgdsAccordion.appendChild(accordionBody);

        // Because we are in the child of the details element, we need to replace the parent of the details element
        accordion.parentNode.parentNode.replaceChild(sgdsAccordion, accordion.parentNode);
      });

      // Convert the HTML back to plain text
      return document.body.innerHTML;
    } catch (err) {
      console.log(err);
    }
  });
  hook.doneEach(function () {
    // Attach accordionHeader.onclick = function () { handleAccordionClick(key); }; to the accordion headers
    const accordions = document.querySelectorAll('.sgds-accordion-header');
    accordions.forEach((accordion) => {
      // Get the data-accordion-id attribute of the accordion from the parent element
      // We do not want to use the index of the accordion because the index may change if the order of the accordions change though the data-accordion-id attribute will not change
      const dataId = accordion.parentNode.getAttribute('data-accordion-id');
      accordion.onclick = function () { handleAccordionClick(dataId); };
    });
  });
}
