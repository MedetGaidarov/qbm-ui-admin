const { BaseQueryApi, fetchBaseQuery } = require("@reduxjs/toolkit/query/react");
const { RootState } = require("../store.ts");
const { loginSuccess, logout } = require("../slices/authSlice.ts");

const baseUrl = 'http://localhost:3002/api';

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState();
        const accessToken = state.auth.access_token;
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        console.log("sending refresh token");
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        console.log(refreshResult);
        if (refreshResult?.data) {
            const state = api.getState();
            const user = state.auth;
            api.dispatch(loginSuccess({ ...refreshResult.data, ...user }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

module.exports = { baseUrl, baseQuery, baseQueryWithReauth };
