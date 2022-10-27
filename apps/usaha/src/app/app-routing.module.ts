import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthShopGuard } from './guards/auth-shop.guard';
import { AuthGuard } from './guards/auth.guard';
import { UnAuthGuard } from './guards/un-auth.guard';
import { ProductInfoResolver } from './modules/workspace/info-product/product-info.resolver';
import { ShopTokenResolver } from './modules/workspace/shop-token.resolver';
import { ProductUpdateInfoResolver } from './modules/workspace/update-info-product/product-update-info.resolver';

const routes: Routes = [
    // {
    //     path:'',
    //     redirectTo:'home',
    //     pathMatch:'full'
    // },
    {
        path:'',
        loadComponent: ()=>import('./modules/main/main.component').then(x=>x.MainComponent),
        canActivate:[AuthGuard],
        children:[
            {
                path:'',
                redirectTo: 'home',
                pathMatch: 'full' 
            },
            {
                path: 'home',
                loadComponent: () => import('./modules/main/home/home.component').then(x=>x.HomeComponent)
            },
            {
                path: 'my-profile',
                loadComponent: () => import('./modules/main/profile/profile.component').then(x=>x.ProfileComponent)
            },
            {
                path: 'my-stores',
                loadComponent: ()=>import('./modules/main/my-stores/my-stores.component').then(x=>x.MyStoresComponent)
            }
        ]
    },
    {
        path:'my-stores/add',
        loadComponent: ()=> import('./modules/main/add-my-store/add-my-store.component').then(x=>x.AddMyStoreComponent),
        canActivate:[AuthGuard],
    },
    { 
        path: 'auth', 
        loadComponent: () =>  import('./modules/auth/auth.component').then(x=>x.AuthComponent),
        canActivate:[UnAuthGuard],
        // canActivateChild:[UnAuthGuard],
        children: [
            {
                path:'',
                redirectTo: 'login',
                pathMatch: 'full' 
            },
            {
                path: 'login',
                loadComponent: () => import('./modules/auth/login/login.component').then(x=>x.LoginComponent)
            },
            {
                path:'register',
                loadComponent: ()=> import('./modules/auth/register/register.component').then(x=>x.RegisterComponent)
            },
            {
                path: 'forget-password',
                loadComponent: () => import('./modules/auth/forget-password/forget-password.component').then(x=>x.ForgetPasswordComponent)
            },
            {
                path: 'renew-password',
                loadComponent: ()=>import('./modules/auth/renew-password/renew-password.component').then(x=>x.RenewPasswordComponent)
            }
        ]
    },
    {
        path:'workspace/:shop_id',
        loadComponent:() => import('./modules/workspace/workspace.component').then(x=>x.WorkspaceComponent),
        resolve:{shop_id:ShopTokenResolver},
        canActivate:[AuthGuard],
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'cashier'
            },
            {
                path: 'cashier',
                loadComponent: () => import('./modules/workspace/cashier/cashier.component').then(x=>x.CashierComponent),
                
            },
            {
                path: 'product',
                loadComponent: () => import('./modules/workspace/product/product.component').then(x=>x.ProductComponent)
            },
        ]
    },
    {
        path:'workspace/:shop_id/product/add',
        loadComponent: ()=> import('./modules/workspace/add-product/add-product.component').then(x=>x.AddProductComponent),
        resolve:{shop_id:ShopTokenResolver},
        canActivate:[AuthGuard],
    },
    {
        path:'workspace/:shop_id/product/info/:product_id',
        loadComponent: ()=> import('./modules/workspace/info-product/info-product.component').then(x=>x.InfoProductComponent),
        canActivate:[AuthGuard],
        resolve:{product:ProductInfoResolver},
    },
    {
        path:'workspace/:shop_id/product/update-info/:product_id',
        loadComponent: ()=> import('./modules/workspace/update-info-product/update-info-product.component').then(x=>x.UpdateInfoProductComponent),
        canActivate:[AuthGuard],
        resolve:{product:ProductUpdateInfoResolver},
    },
  ];
  
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}

