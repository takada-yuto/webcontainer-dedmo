import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
// import { Home } from "./components/Home"
import { RecoilRoot } from "recoil"
import { Preview } from "./components/Preview"
import { Test } from "./components/Test"

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Home />,
  // },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/test",
    element: <Test />,
  },
])
export const App = () => {
  return (
    <>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </>
  )
}

