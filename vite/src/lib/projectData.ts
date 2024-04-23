export const initialFile = {
  path: "/src/src/App.tsx",
  content: `
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
`,
}
