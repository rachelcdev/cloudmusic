import Home from "../pages/Home/index";
import React, { lazy, Suspense } from "react";
import { Redirect } from "react-router-dom";
const RecommendComponent = lazy(() => import("../pages/Recommend/"));
const SingersComponent = lazy(() => import("../pages/Singers/"));
const RankComponent = lazy(() => import("../pages/Rank/"));
const AlbumComponent = lazy(() => import("../pages/Album/"));
const SingerComponent = lazy(() => import("./../pages/Singer/"));
const SearchComponent = lazy(() => import("./../pages/Search/"));
const SuspenseComponent = (Component) => (props) => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  );
};
export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/recommend"} />,
      },
      {
        path: "/recommend",
        component: SuspenseComponent(RecommendComponent),
        routes: [
          {
            path: "/recommend/:id",
            component: SuspenseComponent(AlbumComponent),
          },
        ],
      },
      {
        path: "/singers",
        component: SuspenseComponent(SingersComponent),
        routes: [
          {
            path: "/singers/:id",
            component: SuspenseComponent(SingerComponent),
          },
        ],
      },
      {
        path: "/rank",
        component: SuspenseComponent(RankComponent),
        routes: [
          {
            path: "/rank/:id",
            component: SuspenseComponent(AlbumComponent),
          },
        ],
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: SuspenseComponent(SearchComponent),
      },
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: SuspenseComponent(AlbumComponent),
      },
    ],
  },
];
