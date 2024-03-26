import { FileSystemTree } from "@webcontainer/api"

export const files: FileSystemTree = {
  "index.js": {
    file: {
      contents: `
import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
});
      
fastify.get('/', async (request, reply) => {
  return 'Welcome to a WebContainers app! 🥳';
});
      
const start = async () => {
  try {
    await fastify.listen({ port: 3111 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();
`,
    },
  },
  "package.json": {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "fastify": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon index.js"
  }
}`,
    },
  },
}

export const reactFiles: FileSystemTree = {
  // This is a directory - provide its name as a key
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
      <p className="text-gray-500 my-2">
        Developed by 
        <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/steelydylan" className="text-blue-600 underline inline-block ml-2">
          steelydylan
        </a>
      </p>
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
}
`,
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
}
