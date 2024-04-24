import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./components/Home"
import { RecoilRoot } from "recoil"
// import { Test } from "./components/Test"
import { Preview } from "./components/Preview"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  // {
  //   path: "/test",
  //   element: <Test />,
  // },
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
