import "./assets/accordion.scss"
import { install } from "./accordion";

if (!window.$docsify) {
	window.$docsify = {};
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(install);
