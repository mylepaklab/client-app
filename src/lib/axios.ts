import Axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
	if (config.headers) {
		config.headers.Accept = "application/json";
	}

	config.withCredentials = true;
	return config;
}

export const api = Axios.create({
	baseURL: import.meta.env.FARM_API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
	(response) => {
		return response;
	}
	// (error) => {
	// 	const message = error.response?.data?.message || error.message;

	// 	if (error.response?.status === 401) {
	// 		//   const searchParams = new URLSearchParams();
	// 		//   const redirectTo =
	// 		//     searchParams.get('redirectTo') || window.location.pathname;
	// 		//   window.location.href = paths.auth.login.getHref(redirectTo);
	// 	}

	// 	return Promise.reject(error);
	// }
);
