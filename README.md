# Load Test Visual Interface (Front-end)

## Introduction

This repository contains the front-end code for the load testing application developed as part of the dissertation titled "Designing and Implementing a Distributed Load Testing Tool with a Visual Programming Interface to Simplify Advanced Performance Testing". The application utilizes React 18 with TypeScript and is designed to interact seamlessly with a Go-based backend through REST APIs and Socket.IO.

## Technology Stack

- **React 18** with **TypeScript**: For building the user interface.
- **TailwindCSS**: For styling.
- **Shadcn/ui**: Component library used for UI components.
- **React-Flow**: For implementing the visual programming interface.
- **Redux**: For state management across the app.
- **Tanstack React-Query**: For efficient data fetching.
- **React-Table v5**: For tabular data.
- **React-Hook-Form**: For form handling.
- **React-Toast**: For notifications.

## Features

- **Visual Programming Interface**: Drag and drop nodes to design load tests.
- **Real-time Interaction**: Communicate with the backend in real-time using WebSockets.
- **Data Management**: Use React-Table and React-Query for handling and displaying data efficiently.
- **Form Handling**: Efficient form management and validation using React-Hook-Form.
- **Styling**: Responsive and modern UI using TailwindCSS.

## Installation and Setup

To get the front-end running locally:

1. Clone the repository:

```bash
git clone https://github.com/Jake4-CX/CT6039-Dissertation-Front-End.git
```

2. Navigate to the project directory:

```bash
cd CT6039-Dissertation-Front-End
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Usage

After setting up the project, you can access the local web server at `http://localhost:5173`.

## Deployment

This front-end is deployed on Digital Ocean as a static site via the App Platform.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change. Please ensure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **React Community**: For comprehensive guides and community support.
- **TailwindCSS Team**: For their excellent CSS framework.
- **Digital Ocean**: For hosting and deployment solutions.
