export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/Ting-notebook/docs/README.md"), meta: {"title":"Ting~Notebook"} }],
  ["/3DGS/", { loader: () => import(/* webpackChunkName: "3DGS_index.html" */"D:/Ting-notebook/docs/3DGS/README.md"), meta: {"title":"README.md"} }],
  ["/3DGS/TEST0-Implicit-Neural-Representation.html", { loader: () => import(/* webpackChunkName: "3DGS_TEST0-Implicit-Neural-Representation.html" */"D:/Ting-notebook/docs/3DGS/TEST0-Implicit-Neural-Representation.md"), meta: {"title":"TEST0-Implicit-Neural-Representation"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"D:/Ting-notebook/docs/.vuepress/.temp/pages/404.html.vue"), meta: {"title":""} }],
]);
