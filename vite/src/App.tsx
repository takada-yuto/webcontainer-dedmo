import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import "./App.css"
// import { Home } from "./components/Home"
import { RecoilRoot } from "recoil"
import { Preview } from "./components/Preview"
import { Test } from "./components/Test"
import { ViewTree } from "./components/ViewTree"

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
  {
    path: "/viewtree",
    element: <ViewTree />,
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
