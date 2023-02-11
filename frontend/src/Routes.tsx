import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonContent,
  IonPage,
  IonHeader,
  IonButton,
  IonTitle,
} from "@ionic/react";
import {
  triangle,
  square,
  ellipse,
  sparklesSharp,
  storefront,
  homeSharp,
  notifications,
  personCircleSharp,
  logIn,
} from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import MyMember from "./pages/Myshop/MyMember";
import MyShop from "./pages/Myshop/MyShop";
import Shop from "./pages/Shop";
import Main, { ALL } from "./pages/Main";
import EditMember from "./pages/Myshop/EditMember";
import LoginPage from "./pages/LoginPage";
import MyAccount from "./pages/myAccount";
import { useToken } from "./redux/selector";
import { useIdentity } from "./redux/selector";
import Notification from "./pages/Notification";
import MyCollection from "./pages/MyCollection";
import MyBooking from "./pages/myBooking";
import MyPackage from "./pages/MyPackage";
import Booking from "./pages/Booking";
import UserProfile from "./pages/UserProfile";
import UpdateUserInfo from "./pages/UpdateUserInfo";
import MyShopProducts from "./pages/Myshop/MyShopProductPic";
import Article from "./pages/Article";
import MyShopPlan from "./pages/Myshop/MyShopPlan";
import EditMyShopInfo from "./pages/Myshop/EditMyShopInfo";
import MyShopPage from "./pages/Myshop/MyShopPage";
import MyShopBooking from "./pages/Myshop/MyShopBooking";

// import Editor from "./hooks/useEditor";

const tabPrefix = "/tab";
export const routes = {
  tab: {
    Main: tabPrefix + "/main",
    Shop: tabPrefix + "/shop",
    MyShop: tabPrefix + "/myshop",
    MyAccount: tabPrefix + "/myaccount",
    Notification: tabPrefix + "/notification",
  },

  product: {
    list: "/plan",
    detail: "/plan/:id/detail",
    edit: "/plan/:id/edit",
  },
  myShop: {
    products: "/my-shop/products/",
    plans: "/my-shop/plans",
    EditshopInfo: "/editshopinfo",
    home: (id: number | string) => "/shop/" + id,
    MyShopBooking: "/myshopbooking",
    member: "/my-shop/member",
  },
  member: {
    list: "/my-members",
    detail: (id: number | string) => "/my-members/" + id,
  },

  main: {
    main: "/",
    article: "/article/:id",
    editor: "/editor",
  },
  LoginPage: "/loginpage",

  SignupPage: "/signuppage",

  Users: {
    UpdateUserInfo: "/updateuserinfo",
    MyCollection: "/mycollection",
    MyPackage: "/mypackage",
    MyBooking: "/mybooking",
    Booking: (id: number | string) => "/booking/" + id,
  },

  UserProfile: (id: number | string) => "/usersprofile/" + id,
};

function UserRoute(props: { path: string; exact?: boolean; children: any }) {
  const hasLogin = useToken();

  return (
    <Route path={props.path} exact={props.exact}>
      {hasLogin ? (
        props.children
      ) : (
        <IonPage>
          <IonHeader></IonHeader>
          <IonContent className="ion-padding">
            <p>此頁頁限用戶瀏覽</p>
          </IonContent>
          <IonButton routerLink={routes.LoginPage}>按此登入</IonButton>
        </IonPage>
      )}
    </Route>
  );
}

function OwnerRoute(props: { path: string; exact?: boolean; children: any }) {
  const hasLogin = useToken();
  const identity = useIdentity();

  return (
    <Route path={props.path} exact={props.exact}>
      {identity == "shop_owner" ? (
        props.children
      ) : (
        <IonPage>
          <IonHeader></IonHeader>
          <IonContent className="ion-padding">
            <p>限店主瀏覽</p>
            {hasLogin ? (
              <IonButton expand="block" routerLink={routes.LoginPage}>
                切換帳號
              </IonButton>
            ) : (
              <IonButton expand="block" routerLink={routes.LoginPage}>
                登入
              </IonButton>
            )}
          </IonContent>
        </IonPage>
      )}
    </Route>
  );
}

function AdminRoute(props: { path: string; exact?: boolean; children: any }) {
  const identity = useIdentity();

  return (
    <Route path={props.path} exact={props.exact}>
      {identity == "admin" ? (
        props.children
      ) : (
        <IonPage>
          <IonHeader>
            <IonTitle>XX</IonTitle>
          </IonHeader>
          <IonContent className="ion-padding">
            <p>This Page is only available to admin</p>
          </IonContent>
        </IonPage>
      )}
    </Route>
  );
}

const Routes = () => {
  const hasLogin = useToken();
  const identity = useIdentity();
  return (
    <>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to={routes.tab.Main} />
        </Route>
        <Route exact path={routes.product.edit}>
          editProductInfo
        </Route>
        {/* 方便做野開返個閘先 */}
        {/* <OwnerRoute exact path={routes.tab.Myshop}>  */}

        {/* </OwnerRoute> */}
        <Route exact path={routes.myShop.home(":id")}>
          <MyShopPage />
        </Route>
        <Route exact path="/myshopbooking">
          <MyShopBooking />
        </Route>
        <Route exact path="/editshopinfo">
          <EditMyShopInfo />
        </Route>
        <Route exact path={routes.myShop.plans}>
          <MyShopPlan />
        </Route>
        <Route exact path={routes.myShop.products}>
          <MyShopProducts />
        </Route>
        <Route exact path={routes.member.list}>
          <MyMember />
        </Route>
        <Route path={routes.member.detail(":id")}>
          <EditMember />
        </Route>
        <Route path={routes.UserProfile(":id")}>
          <UserProfile />
        </Route>
        <UserRoute exact path={routes.Users.UpdateUserInfo}>
          <UpdateUserInfo />
        </UserRoute>
        <UserRoute exact path={routes.Users.MyCollection}>
          <MyCollection />
        </UserRoute>
        <UserRoute exact path={routes.Users.MyBooking}>
          <MyBooking />
        </UserRoute>
        <UserRoute path={routes.Users.Booking(":id")}>
          <Booking />
        </UserRoute>
        <Route exact path={routes.Users.MyPackage}>
          <MyPackage />
        </Route>
        <Route path={routes.main.article}>
          <Article />
        </Route>
        {/* <Route exact path={routes.main.editor}>
        <Editor />
      </Route> */}
        <Route exact path={routes.LoginPage}>
          <LoginPage />
        </Route>

        <Route>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path={routes.tab.Shop}>
                <Shop />
              </Route>
              <OwnerRoute exact path={routes.tab.MyShop}>
                <MyShop />
              </OwnerRoute>
              <Route exact path={routes.tab.Main}>
                <Main />
              </Route>
              <UserRoute path={routes.tab.Notification}>
                <Notification />
              </UserRoute>
              <UserRoute path={routes.tab.MyAccount}>
                <MyAccount />
              </UserRoute>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="Shop" href={routes.tab.Shop}>
                <IonIcon icon={sparklesSharp} color="#6ca29c" />
                <IonLabel>預約美甲</IonLabel>
              </IonTabButton>
              <IonTabButton
                tab="MyShop"
                href={routes.tab.MyShop}
                style={{ display: identity == "shop_owner" ? "" : "none" }}
              >
                <IonIcon icon={storefront} color="#6ca29c" />
                <IonLabel>我的商店</IonLabel>
              </IonTabButton>
              <IonTabButton
                tab="Main"
                href={routes.tab.Main}
                onClick={(e) => {
                  setTimeout(() => {
                    window.location.hash = ALL;
                  }, 33);
                }}
              >
                <IonIcon icon={homeSharp} color="#6ca29c" />
                <IonLabel>主頁</IonLabel>
              </IonTabButton>
              <IonTabButton
                style={{ display: hasLogin ? "none" : "" }}
                tab="Login"
                href={routes.LoginPage}
              >
                <IonIcon icon={logIn} color="#6ca29c" />
                <IonLabel>Login</IonLabel>
              </IonTabButton>
              <IonTabButton
                style={{ display: !hasLogin ? "none" : "" }}
                tab="Notification"
                href={routes.tab.Notification}
              >
                <IonIcon icon={notifications} color="#6ca29c" />
                <IonLabel>通知</IonLabel>
              </IonTabButton>
              <IonTabButton
                style={{ display: !hasLogin ? "none" : "" }}
                tab="MyAccount"
                href={routes.tab.MyAccount}
              >
                <IonIcon icon={personCircleSharp} color="#6ca29c" />
                <IonLabel>我的帳戶</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </Route>
      </IonRouterOutlet>
    </>
  );
};

export default Routes;
