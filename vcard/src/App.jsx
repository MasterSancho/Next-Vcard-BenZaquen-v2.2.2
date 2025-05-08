import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './hooks/PrivateRoute';
import Home from './pages/home/Home';
import SignIn from './pages/signIn/SignIn';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import Profile from './pages/profile/Profile';
import CreateListing from './pages/createListing/CreateListing';
import EditListing from './pages/editListing/EditListing';
import Listing from './pages/listing/Listing';
import Listings from './pages/listings/Listings';
import Navbar from './components/navbar/Navbar';
import Category from './components/category/Category';
// import ContactUs from './pages/contactUs/ContactUs';
import RecommendationForm from './pages/recommendationForm/RecommendationForm';
import RecommendationsReview from './pages/recommendationsReview/RecommendationsReview';

const App = () => {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/listings" element={<Listings />} />
					<Route path="/category/:categoryName" element={<Category />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/profile" element={<PrivateRoute />}>
						<Route path="/profile" element={<Profile />} />
						<Route
							path="/profile/recommendations"
							element={<RecommendationsReview />}
						/>
					</Route>
					<Route path="/create-listing" element={<CreateListing />} />
					<Route path="/edit-listing/:listingId" element={<EditListing />} />
					<Route
						path="/category/:categoryName/:listingId"
						element={<Listing />}
					/>
					{/* <Route path="/contact-us" element={<ContactUs />} /> */}
					<Route path="/recommendation-form" element={<RecommendationForm />} />
				</Routes>
				<Navbar />
			</Router>

			<ToastContainer />
		</>
	);
};

export default App;
