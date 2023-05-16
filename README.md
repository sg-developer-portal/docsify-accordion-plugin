<br />
<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors](https://img.shields.io/github/contributors/sg-developer-portal/docsify-accordion-plugin.svg)][contributors-url]
[![Forks](https://img.shields.io/github/forks/sg-developer-portal/docsify-accordion-plugin.svg)][forks-url]
[![Stargazers](https://img.shields.io/github/stars/sg-developer-portal/docsify-accordion-plugin.svg)][stars-url]
[![MIT License](https://img.shields.io/github/license/sg-developer-portal/docsify-accordion-plugin.svg)][license-url]
[![npm](https://img.shields.io/npm/v/@developerportalsg/docsify-plugin-toc.svg?style=flat-square)](npm-url)

<!-- PROJECT LOGO -->
<br />

<div align="center">
  <a href="https://github.com/sg-developer-portal/docsify-accordion-plugin">
    <img src="src/assets/logo_developer.gov.sg.png" alt="Logo" height="100">
  </a>
  
  <h3 align="center">Docsify Accordion Plugin</h3>

  <p align="center">
    A Docsify Accordion that replaces the standard markdown accordion to an accordion that follows the
    <a href="https://designsystem.tech.gov.sg/">SGDS Convention</a> for the <a href="https://docs.developer.tech.gov.sg/">Singapore Government Documentation Portal</a>
    <br />
    <br />
    <a href="#Usage">Usage</a>
    ·
    <a href="https://github.com/sg-developer-portal/docsify-accordion-plugin/issues">Report Bugs</a>
    ·
    <a href="https://github.com/sg-developer-portal/docsify-accordion-plugin/issues">Request Features</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

-   [About The Project](#about-the-project)
-   [Built-With](#built-with)
-   [Contributing](#contributing)
-   [License](#license)
-   [References](#references)

## About the project

Hello there! We are the team behind the 

<img width="1440" alt="image" src="src/assets/snapshot.png">

## Usage

1. Configure docsify-plugin-toc:

    ```html
    <script>
    	window.$docsify = {
    		 useSGDSAccordion: true
    	};
    </script>
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

2. Insert style/script into docsify document:

    ```html
    <!-- head -->
    <head>
    	<!-- Insert your different plugins here... -->
    	<link rel="stylesheet" href="https://unpkg.com/@developerportalsg/docsify-plugin-toc/dist/light.css" />
    	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@govtechsg/sgds@1.4.0/css/sgds.css" />
    </head>

    <!-- body -->
    <body>
    	<!-- Insert your different plugins scripts here... -->
    	<script src="https://unpkg.com/@developerportalsg/docsify-plugin-toc/dist/docsify-plugin-toc.min.js"></script>
    </body>
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Options

| Argument        | Type       | Description                                                                                                                                           |
| --------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tocMaxLevel`   | `number`   | The maximum depth of the headings printed on the ToC. If you set `tocMaxLevel` to 3, I recommend you to set `subMaxLevel` to 2 avoid ToC duplication. |
| `target`        | `string`   | The target heading printed on the ToC. It's used as an argument to query DOM with `querySelectorAll()`                                                |
| `ignoreHeaders` | `string[]` | ignore header name keyword list, (e.g. ['develop', /develop/i], support Regular expressions)                                                          |

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## Built with

Our plugin is built using Docsify, a lightweight documentation generator, along with other technologies such as HTML, JavaScript and CSS.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## References

You can find our plugin on GitHub. Please refer to the README file for detailed instructions on how to use it.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/sg-developer-portal/docsify-accordion-plugin.svg?style=for-the-badge
[contributors-url]: https://github.com/sg-developer-portal/docsify-accordion-plugin/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sg-developer-portal/docsify-accordion-plugin.svg?style=for-the-badge
[forks-url]: https://github.com/sg-developer-portal/docsify-accordion-plugin/network/members
[stars-shield]: https://img.shields.io/github/stars/sg-developer-portal/docsify-accordion-plugin.svg?style=for-the-badge
[stars-url]: https://github.com/sg-developer-portal/docsify-accordion-plugin/stargazers
[issues-shield]: https://img.shields.io/github/issues/sg-developer-portal/docsify-accordion-plugin.svg?style=for-the-badge
[issues-url]: https://github.com/sg-developer-portal/docsify-accordion-plugin/issues
[license-shield]: https://img.shields.io/github/license/sg-developer-portal/docsify-accordion-plugin.svg?style=for-the-badge
[license-url]: https://github.com/Ducksss/FakeNews/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[npm-url]: https://www.npmjs.com/package/@developerportalsg/docsify-plugin-toc
