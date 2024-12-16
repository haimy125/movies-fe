import CategoryCreate from "../pages/Admin/Category/CategoryCreate/CategoryCreate";
import CategoryEdit from "../pages/Admin/Category/CategoryEdit/CategoryEdit";
import CategoryList from "../pages/Admin/Category/CategoryList/categoryList";
import EpisodeCreate from "../pages/Admin/Episodes/EpisodeCreate/EpisodeCreate";
import EpisodeEdit from "../pages/Admin/Episodes/EpisodeEdit/EpisodeEdit";
import EpisodeList from "../pages/Admin/Episodes/EpisodeList/EpisodeList";
import MovieCreate from "../pages/Admin/Movie/MovieCreate/MovieCeate";
import MovieEdit from "../pages/Admin/Movie/MovieEdit/MovieEdit";
import MovieList from "../pages/Admin/Movie/MovieList/MovieList";
import OrdersList from "../pages/Admin/Orders/OrdersList";
import Stats from "../pages/Admin/statistics";
import UserEdit from "../pages/Admin/User/UserEdit/UserEdit";
import UserList from "../pages/Admin/User/UserList/UserList";
import UserCreate from "../pages/Admin/User/UserCreate/UserCreate";
import CheckUser from "../pages/CheckUser/CheckUser";
import EpMovie from "../pages/EpMovie/EpMovie";
import Error403 from "../pages/Error/403/Error";
import NotFound from "../pages/Error/404/NotFound";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import MovieDetail from "../pages/MovieDetail/MovieDetall";
import MoviePage from "../pages/MovieList/MoviePage";
import ChangePassword from "../pages/Profile/ChanePassword/ChangePassword";
import Follows from "../pages/Profile/Follow/Follow";
import HistoryPay from "../pages/Profile/HistoryPay/HistoryPay";
import Profile from "../pages/Profile/Info/Info";
import MovieBuyed from "../pages/Profile/MovieBuyed/MovieBuyed";
import Recharge from "../pages/Profile/Recharge/recharge";
import UpdateInfo from "../pages/Profile/UpdateInfo/UpdateInfo";
import Register from "../pages/Register/Register";
import Schedule from "../pages/Schedule/Schedule";

//chưa login
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/movie/ep/:id", component: EpMovie },
  { path: "/movie/detail/:id", component: MovieDetail },
  { path: "/403", component: Error403 },
  { path: "/404", component: NotFound },
  { path: "/register", component: Register },
  { path: "/movie/page", component: MoviePage },
  { path: "/schedule/movie", component: Schedule },
  { path: "/security/finduser", component: CheckUser },
  { path: "/forgetpassword/:id", component: ForgetPassword },
];

// đã login
const privateRoutes = [
  { path: "/user/profile", component: Profile },
  { path: "/user/changepassword", component: ChangePassword },
  { path: "/user/recharge", component: Recharge },
  { path: "/user/update/detail", component: UpdateInfo },
  { path: "/user/history", component: HistoryPay },
  { path: "/user/buy", component: MovieBuyed },
  { path: "/user/follows", component: Follows },
  { path: "/schedule/movie", component: Schedule },
];

const AdminRouters = [
  { path: "/admin/home", component: Stats },
  { path: "/admin/orders", component: OrdersList },
  { path: "/admin/movie", component: MovieList },
  { path: "/admin/movie/create", component: MovieCreate },
  { path: "/admin/movie/edit/:id", component: MovieEdit },
  { path: "/admin/movie/episodes/:id", component: EpisodeList },
  { path: "/admin/movie/episodes/:id/create", component: EpisodeCreate },
  { path: "/admin/movie/episodes/edit/:id", component: EpisodeEdit },
  { path: "/admin/category", component: CategoryList },
  { path: "/admin/category/create", component: CategoryCreate },
  { path: "/admin/category/edit/:id", component: CategoryEdit },
  { path: "/403", component: Error403 },
  { path: "/404", component: NotFound },
  { path: "/register", component: Register },
  { path: "/admin/users", component: UserList },
  { path: "/admin/users/create", component: UserCreate },
  { path: "/admin/users/edit/role/:id", component: UserEdit },
];

export { AdminRouters, privateRoutes, publicRoutes };
