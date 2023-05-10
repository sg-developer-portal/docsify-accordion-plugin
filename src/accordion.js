function handleAccordionClick(id) {
  const accordion = document.querySelector(`[data-id="${id}"]`);
  const header = accordion.querySelector('a.sgds-accordion-header');
  const headerAttribute = header.getAttribute('aria-expanded');

  // Toggle the accordion and chevron icon
  accordion.classList.toggle('is-open');
  header.classList.toggle('is-active');
  header.setAttribute('aria-expanded', headerAttribute === 'false' ? 'true' : 'false');
  header.querySelector('i').classList.toggle('sgds-icon-chevron-up');
  header.querySelector('i').classList.toggle('sgds-icon-chevron-down');
}

export function install(hook, vm) {
  hook.doneEach(function () {
    try {
      const accordions = document.querySelectorAll('details > summary');
      accordions.forEach((accordion) => {
        // Assign a unique id to the accordion to be used for the onclick event
        const assignedUniqueAccordionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // Parent element of the accordion
        const sgdsAccordion = document.createElement('div');
        sgdsAccordion.classList.add('sgds-accordion', 'margin--bottom');
        sgdsAccordion.setAttribute('data-id', assignedUniqueAccordionID);
        sgdsAccordion.onclick = function () { handleAccordionClick(assignedUniqueAccordionID); };

        // First child of the accordion
        const accordionHeader = document.createElement('a');
        accordionHeader.classList.add('sgds-accordion-header', 'padding--top', 'padding--bottom', 'has-text-dark', 'has-background-white');
        accordionHeader.setAttribute('role', 'button');
        accordionHeader.setAttribute('aria-expanded', 'false');
        accordionHeader.innerHTML = `<div>${accordion.innerHTML}</div><i class="sgds-icon sgds-icon-chevron-up"></i>`;

        // Second child of the accordion
        const accordionBody = document.createElement('div');
        accordionBody.classList.add('sgds-accordion-body');
        // We are currently in the summary element, so we need to get the parent element before we can extract the HTML content of the details element apart from the summary element
        const accordionParent = accordion.parentNode;
        // Iterate over the child nodes of the details element
        for (let i = 0; i < accordionParent.childNodes.length; i++) {
          const childNode = accordionParent.childNodes[i];

          // if its an html element or text node
          if ((childNode.tagName && childNode.tagName.toLowerCase() !== 'summary') || childNode.nodeType === Node.TEXT_NODE) {
            // Filter out br elements
            if (childNode.tagName && childNode.tagName.toLowerCase() === 'br' && i !== 0 && i !== accordionParent.childNodes.length - 1) {
              continue;
            }

            if (childNode.nodeType === Node.ELEMENT_NODE) {
              // Skip the summary element
              accordionBody.innerHTML += childNode.outerHTML;
            }

            if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim() !== '') {
              // Skip the empty text nodes
              accordionBody.innerHTML += childNode.textContent;
            }
          }
        }

        // Add the header and body to the accordion
        sgdsAccordion.appendChild(accordionHeader);
        sgdsAccordion.appendChild(accordionBody);

        // Because we are in the child of the details element, we need to replace the parent of the details element
        accordion.parentNode.parentNode.replaceChild(sgdsAccordion, accordion.parentNode);
      });
    } catch (err) {
      console.log(err);
    }
  });
}
