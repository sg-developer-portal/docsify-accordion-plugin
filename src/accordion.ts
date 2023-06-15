import sanitize from "sanitize-html";

declare global {
	interface Window {
		$docsify: any;
		jQuery: any;
	}
}

type AccordionOpenOnLoadOptions = boolean;
// type AccordionSizeOptions = "small" | "medium" | "large";
type AccordionColorOptions = "black" | "dark" | "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "white";

/**
 * Generates the accordions based on the details and summary elements.
 * @param {NodeListOf<Element>} accordions - The list of accordions to generate.
 * @param {Document} document - The document to generate the accordions in.
 * @returns {void}
 */
function generateAccordions(accordions: NodeListOf<Element>, document: Document): void {
	accordions.forEach((accordion: Element, key: number) => {
		// Get the options for the accordion
		const isColor = accordion?.parentElement?.dataset?.isColor as AccordionColorOptions ?? null;
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
		accordionHeader.classList.add("sgds-accordion-header", "padding--top", "padding--bottom", "has-text-dark", "has-background-white");
		if (isOpen) accordionHeader.classList.add("is-active");
		if (isOpen) accordionHeader.classList.add("has-text-weight-semibold")
		accordionHeader.setAttribute("role", "button");
		accordionHeader.setAttribute("aria-expanded", `${isOpen}`);
		accordionHeader.innerHTML = `<div>${sanitizeHtml(accordion.innerHTML)}</div><i class="sgds-icon ${isOpen ? "sgds-icon-chevron-up" : "sgds-icon-chevron-down"}"></i>`;

		// Create the body of the accordion
		const accordionBody = document.createElement("div");
		accordionBody.classList.add("sgds-accordion-body", "sgds-custom-accordion-body");
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
	const isJQueryLoaded: boolean = typeof window.jQuery !== 'undefined';

	if (!isJQueryLoaded) {
		console.dir("JQuery is not loaded. Skipping accordion animation.");
		toggleAccordionElements(id);
	} else {
		const $: JQueryStatic = window.jQuery;
		const accordion: JQuery<HTMLElement> = $(`[data-accordion-id="${id}"]`);
		const accordionHeader: JQuery<HTMLElement> = accordion.children(".sgds-accordion-header");
		const accordionBody: JQuery<HTMLElement> = accordion.children(".sgds-accordion-body");

		toggleAccordionElementsUsingJQuery(accordionHeader, accordionBody, !accordionHeader.hasClass("is-active"));
	}
}

/**
 * Toggles the accordion elements.
 * @param {string} id - The ID of the accordion.
 */
function toggleAccordionElements(id: string): void {
	// Constants
	const accordion = document.querySelector(`[data-accordion-id="${id}"]`);
	const accordionHeader = accordion?.querySelector<HTMLElement>("span.sgds-accordion-header");
	const accordionBody = accordion?.querySelector<HTMLElement>("div.sgds-accordion-body");

	const isExpanded: boolean = accordionHeader?.getAttribute("aria-expanded") === "false";

	accordion?.classList.toggle("is-open");
	accordionHeader?.classList.toggle("is-active");
	accordionHeader?.classList.toggle("has-text-weight-semibold");
	accordionHeader?.setAttribute("aria-expanded", String(!isExpanded));
	accordionBody?.classList.toggle("is-expanded");

	const icon = accordionHeader?.querySelector<HTMLElement>("i.sgds-icon");
	icon?.classList.toggle("sgds-icon-chevron-up");
	icon?.classList.toggle("sgds-icon-chevron-down");
}

/**
 * Toggles the accordion elements using JQuery.
 * @param {JQuery<HTMLElement>} accordionHeader - The accordion header element.
 * @param {JQuery<HTMLElement>} accordionBody - The accordion body element.
 * @param {boolean} shouldExpand - Whether the accordion should be expanded or not.
 */
function toggleAccordionElementsUsingJQuery(
	accordionHeader: JQuery<HTMLElement>,
	accordionBody: JQuery<HTMLElement>,
	shouldExpand: boolean
): void {
	accordionHeader
		.toggleClass("is-active", shouldExpand)
		.toggleClass("has-text-weight-semibold", shouldExpand)
		.attr("aria-expanded", String(shouldExpand))
		.children("i")
		.toggleClass("sgds-icon-chevron-up", shouldExpand)
		.toggleClass("sgds-icon-chevron-down", !shouldExpand);

	accordionBody.slideToggle(300);
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
			const accordionContainer = accordionHeader.parentNode as HTMLElement;
			const accordionId = accordionContainer.getAttribute("data-accordion-id");

			accordionHeader.addEventListener("click", () => {
				if (accordionId) handleAccordionClick(accordionId);
			});
		});
	});
}
