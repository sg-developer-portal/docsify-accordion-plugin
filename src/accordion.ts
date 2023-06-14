import sanitize from "sanitize-html";

declare global {
	interface Window {
		$docsify: any;
	}
}

type AccordionOpenOnLoadOptions = boolean;
type AccordionSizeOptions = "small" | "medium" | "large";
type AccordionColorOptions = "black" | "dark" | "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "white" | null;

/**
 * Generates the accordions based on the details and summary elements.
 * @param {NodeListOf<Element>} accordions - The list of accordions to generate.
 * @param {Document} document - The document to generate the accordions in.
 * @returns {void}
 */
function generateAccordions(accordions: NodeListOf<Element>, document: Document): void {
	accordions.forEach((accordion: Element, key: number) => {
		// Get the options for the accordion
		const isColor = accordion?.parentElement?.dataset?.isColor as AccordionSizeOptions ?? null;
		// const isSize = accordion?.parentElement?.dataset?.isSize as AccordionColorOptions ?? "medium";
		const isOpen: AccordionOpenOnLoadOptions = accordion?.parentElement?.dataset?.isOpen?.toLowerCase() === "true" || false;

		// Create the accordion container
		const sgdsAccordion = document.createElement("div");
		if (isOpen) sgdsAccordion.classList.add("is-open");
		if (isColor) sgdsAccordion.classList.add(`is-${isColor}`);
		sgdsAccordion.setAttribute("data-accordion-id", `${key}`);
		sgdsAccordion.classList.add("sgds-accordion", "margin--bottom");

		// Create the header of the accordion
		const accordionHeader = document.createElement("span");
		accordionHeader.classList.add("sgds-accordion-header", "padding--top", "padding--bottom");
		accordionHeader.setAttribute("role", "button");
		accordionHeader.setAttribute("aria-expanded", `${isOpen}`);
		if (isOpen) accordionHeader.classList.add("is-active");
		accordionHeader.innerHTML = `<div class="${isOpen && 'has-text-weight-semibold'}">${sanitizeHtml(accordion.innerHTML)}</div><i class="sgds-icon ${isOpen ? "sgds-icon-chevron-up" : "sgds-icon-chevron-down"}"></i>`;

		// Create the body of the accordion
		const accordionBody = document.createElement("div");
		accordionBody.classList.add("sgds-accordion-body", "is-size-7");
		// We are currently in the summary element, so we need to get the parent element before we can extract the HTML content of the details element apart from the summary element
		const accordionParent: HTMLElement = accordion.parentNode as HTMLElement;
		// Instead of appending the elements directly to the DOM, we append them to a document fragment and then append the fragment to the DOM. This can improve performance by reducing the number of DOM operations.
		const fragment = document.createDocumentFragment();
		// Iterate over the child nodes of the details element
		for (let i = 0; i < accordionParent.childNodes.length; i++) {
			const childNode = accordionParent.childNodes[i];
			// Skip the summary element by not adding it to the fragment
			if (childNode instanceof Element && childNode.tagName.toLowerCase() === "summary") {
				continue;
			}

			// Skip the first and last br elements by not adding them to the fragment
			if (childNode instanceof Element && childNode.tagName.toLowerCase() === "br" && i !== 0 && i !== accordionParent.childNodes.length - 1) {
				continue;
			}

			// Add comment for future ppl
			if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent?.trim() !== "") {
				// If it's a text node, we need to wrap it in a paragraph element so that it can be styled
				const paragraph = document.createElement("span");
				paragraph.textContent = childNode.textContent;
				fragment.appendChild(paragraph);
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
		accordion?.parentNode?.parentNode?.replaceChild(sgdsAccordion, accordion.parentNode);
	});
}

/**
 * Sanitizes the HTML to prevent XSS attacks.
 * @param {string} html - The HTML to sanitize.
 * @returns {string} - The sanitized HTML.
 */
function sanitizeHtml(html: string): string {
	return sanitize(html, {
		allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
		allowedAttributes: {
			"*": ["style"],
		},
	});
}

/**
 * Handles the click event on an accordion element.
 * @param {string} id - The ID of the accordion.
 * @returns {void}
 */
function handleAccordionClick(id: string): void {
	// Find the accordion element based on the ID
	const accordion: HTMLElement | null = document.querySelector(`[data-accordion-id="${id}"]`);

	// Find the header, header attribute, and body elements within the accordion
	const header = accordion?.querySelector<HTMLElement>("span.sgds-accordion-header");
	const headerAttribute = header?.getAttribute("aria-expanded");
	const body = accordion?.querySelector<HTMLElement>("div.sgds-accordion-body");

	// Toggle the accordion and chevron icon
	accordion?.classList.toggle("is-open");
	header?.classList.toggle("is-active");
	header?.querySelector("div")?.classList.toggle("has-text-weight-semibold");
	header?.querySelector("i.sgds-icon")?.classList.toggle("sgds-icon-chevron-up");
	header?.querySelector("i.sgds-icon")?.classList.toggle("sgds-icon-chevron-down");
	body?.classList.toggle("is-expanded");


	if (headerAttribute === "false") {
		header?.setAttribute("aria-expanded", "true");
	} else {
		header?.setAttribute("aria-expanded", "false");
	}
}

export function install(hook: any, vm: any) {
	hook.afterEach(function (plainText: string) {
		try {
			// Parse the plain text into HTML
			const parser = new DOMParser();
			const document: Document = parser.parseFromString(plainText, "text/html");
			const accordions: NodeListOf<Element> = document.querySelectorAll("details > summary");
			const useSGDSAccordion: boolean = window?.$docsify?.useSGDSAccordion || true; // Created to support feature flagging. Default is set to true.

			if (!useSGDSAccordion || accordions.length === 0) {
				return plainText;
			}

			generateAccordions(accordions, document);

			// Convert the HTML back to plain text
			return document.body.innerHTML;
		} catch (err) {
			console.log(err);
		}
	});
	hook.doneEach(function () {
		// Fetch all the accordions
		const accordionHeaders: NodeListOf<Element> = document.querySelectorAll(".sgds-accordion-header");
		// Add event listener to each accordion
		accordionHeaders.forEach((accordionHeader: Element) => {
			const accordionContainer: HTMLElement | null = accordionHeader.parentNode as HTMLElement;
			const accordionId: string | null = accordionContainer.getAttribute("data-accordion-id");

			accordionHeader.addEventListener("click", () => {
				if (accordionId) handleAccordionClick(accordionId);
			});
		});
	});
}
