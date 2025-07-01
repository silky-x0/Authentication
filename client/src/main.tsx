import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import ManageUser from "./Component/ManageUser.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Auth0Provider
			domain='dev-ue0uw3uka3yi4v8s.us.auth0.com'
			clientId='tEP5Z84dhHD72Ej2m2oDNdiDKsJX7a3c'
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={<App />}
					/>
					<Route
						path='/manage-user'
						element={<ManageUser />}
					/>
				</Routes>
			</BrowserRouter>
		</Auth0Provider>
	</StrictMode>
);
