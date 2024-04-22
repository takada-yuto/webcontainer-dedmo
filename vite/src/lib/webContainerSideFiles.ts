import { FileSystemTree } from "@webcontainer/api"

export const initialCode = `
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to My Tailwind CSS Demo</h1>
        <p className="text-gray-600 mb-6">This is a simple page demonstrating some of Tailwind CSS's features.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">1. Buttons</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Click me</button>
          </div>
          <div className="bg-green-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-2">2. Cards</h2>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-gray-700">This is a card component.</p>
            </div>
          </div>
          <div className="bg-yellow-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">3. Alerts</h2>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
              <p>This is an alert component.</p>
            </div>
          </div>
          <div className="bg-purple-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">4. Inputs</h2>
            <input type="text" className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 rounded-md px-3 py-2" placeholder="Enter your name" />
          </div>
          <div className="bg-red-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-red-800 mb-2">5. Headings</h2>
            <h3 className="text-lg font-medium text-red-700">This is a heading</h3>
          </div>
          <div className="bg-pink-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-pink-800 mb-2">6. Lists</h2>
            <ul className="list-disc pl-4">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
          <div className="bg-indigo-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">7. Navigation</h2>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="text-indigo-500 hover:text-indigo-700">Home</a></li>
                <li><a href="#" className="text-indigo-500 hover:text-indigo-700">About</a></li>
                <li><a href="#" className="text-indigo-500 hover:text-indigo-700">Contact</a></li>
              </ul>
            </nav>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Modals</h2>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Open Modal</button>
          </div>
          <div className="bg-teal-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-teal-800 mb-2">9. Responsive Design</h2>
            <p className="text-teal-700">This page is responsive!</p>
          </div>
          <div className="bg-orange-200 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-orange-800 mb-2">10. Flexbox Layout</h2>
            <div className="flex justify-between">
              <div className="bg-orange-300 p-2 rounded-md">Item 1</div>
              <div className="bg-orange-300 p-2 rounded-md">Item 2</div>
              <div className="bg-orange-300 p-2 rounded-md">Item 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
`
export const reactFiles: FileSystemTree = {
  // This is a directory - provide its name as a key
  src: {
    directory: {
      components: {
        directory: {
          // This is a file - provide its path as a key:
          "hello.tsx": {
            // Because it's a file, add the "file" key
            file: {
              contents: `
import { useReward } from 'react-rewards'

export const Hello = () => {
  const { reward } = useReward('rewardId', 'confetti')
  const handleClick = () => {
    reward();
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Hello, World!</h1>
      <div className="flex justify-center mt-5">
        <button className="bg-blue-600 text-white block px-4 py-2 text-sm rounded-md" onClick={handleClick}>
          Click me!
        </button>
      </div>
      <div id="rewardId"></div>
    </div>
  )
}`,
            },
          },
        },
      },
      pages: {
        directory: {
          // This is a file - provide its path as a key:
          "index.tsx": {
            // Because it's a file, add the "file" key
            file: {
              contents: `
import { Hello } from "../components/hello";

export default function App() {
  return (
    <Hello />
  );
}`,
            },
          },
        },
      },
      // This is a file outside the folder
      "package.json": {
        file: {
          contents: `
{
  "name": "react-app",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "next"
  },
  "dependencies": {
    "next": "^12.3.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-rewards": "2.0.4"
  },
  "devDependencies": {
    "@types/node": "20.11.30",
    "@types/react": "18.2.67",
    "typescript": "^4.3.5"
  }
}`,
        },
        /* Omitted for brevity */
      },
      // This is another file outside the folder
      "tsconfig.json": {
        file: {
          contents: `
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}`,
        },
      },
      "next-env.d.ts": {
        file: {
          contents: `
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.`,
        },
      },
    },
  },
}
export const nextjsFiles: FileSystemTree = {
  // This is a directory - provide its name as a key
  src: {
    directory: {
      public: {
        directory: {
          "index.html": {
            file: {
              contents: `
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="root"></div>
  </body>
</html>
`,
            },
          },
        },
      },
      src: {
        directory: {
          "globals.css": {
            file: {
              contents: `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
            },
          },
          "App.tsx": {
            file: {
              contents: initialCode,
            },
          },
          "index.tsx": {
            file: {
              contents: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
            },
          },
        },
      },
      "package.json": {
        file: {
          contents: `
{
  "name": "src",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.96",
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.25",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3"
  }
}
`,
        },
      },
      "postcss.config.js": {
        file: {
          contents: `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
        },
      },
      "tailwind.config.js": {
        file: {
          contents: `
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
        },
      },
      "tsconfig.json": {
        file: {
          contents: `
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
`,
        },
      },
    },
  },
}
