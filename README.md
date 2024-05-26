# EdgeDB Graph

EdgeDB Graph is a [Nuxt 3](https://nuxt.com) application built for the [EdgeDB x Vercel 2024 Hackathon](https://hackathon.edgedb.com/). This project leverages vector embeddings, powered by EdgeDB's integration with OpenAI's `text-embedding-3-small` model, to perform semantic searches on mathematical expressions and graph them on screen using [vueclid](https://github.com/ksassnowski/vueclid) and [mathjs](https://mathjs.org/) for parsing user-inputted expressions.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## Introduction

EdgeDB Graph provides an intuitive and interactive way to visualize and understand mathematical expressions. Leveraging EdgeDB and OpenAI's text-embedding model, it enables users to visualize expressions and perform semantic searches to find similar expressions.

## Features

- **Semantic Search**: Perform advanced searches on mathematical expressions using EdgeDB's integration with OpenAI's text-embedding-3-small model.
- **Graphing**: Graph mathematical expressions interactively with vueclid.
- **Expression Parsing**: Parse user-inputted mathematical expressions using mathjs for accurate graphing and evaluation.

## Tech stack

- **Nuxt 3**: A powerful Vue.js framework for building modern web applications.
- **EdgeDB**: A graph-relational database that provides seamless integration with OpenAI models for advanced data operations.
- **Vercel**: A cloud platform for static sites and serverless functions that provides a seamless deployment experience.
- **OpenAI's text-embedding-3-small Model**: Used for performing semantic searches on mathematical expressions.
- **vueclid**: A Vue.js library for rendering mathematical graphs.
- **mathjs**: A comprehensive library for parsing and evaluating mathematical expressions in JavaScript and Node.js.
- **Tailwind CSS**: A utility-first CSS framework for quickly building custom designs.

## Installation

To get started with EdgeDB Graph, follow these steps:

1. **Clone the repository**:

```bash
git clone https://gitlab.com/queco-carles/hackathons/edgedb.git
cd edgedb
```

2. **Install the dependencies**:

```bash
bun install

```

3. **Configure EdgeDB**:

Install and configure EdgeDB, following the [EdgeDB documentation](https://www.edgedb.com/docs) in order to set up your database and integrate it with the OpenAI model.

Then, run the following command to set up the EdgeDB schema:

```bash
bun run edgedb:generate
```

4. **Copy .env.example to .env and customize the variables as needed**:

```bash
cp .env.example .env
```

5. **Start the development server**:

```bash
bun dev
```

6. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

1. **Search Expressions**: Enter a mathematical expression or query into the search bar to perform a semantic search.
2. **View Graphs**: The corresponding graph of the mathematical expression will be displayed on the screen using vueclid.
3. **Parse Expressions**: Enter different mathematical expressions to see their parsed and evaluated forms using mathjs.

## Contributing

We welcome contributions to EdgeDB Graph! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request to the `main` branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## Authors

Developed in May 2024 by [Carles Mitjans](https://x.com/carlesmitjans) and [Francesc Vila](https://x.com/__queco).

We hope you find EdgeDB Graph useful and easy to use! If you have any questions or feedback, please don't hesitate to reach out.
