import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: "", pathMatch: "full", redirectTo: "register"},
    {path: "home", loadComponent: () => import("./pages/home/home").then(m => m.Home)},
    {path: "register", loadComponent: () => import("./pages/register/register").then(m => m.Register)},
    {path: "login", loadComponent: () => import("./pages/login/login").then(m => m.Login)},
];
