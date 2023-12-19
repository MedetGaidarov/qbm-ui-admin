import { baseQuery, baseQueryWithReauth } from "./baseQuery";


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserWithItin: builder.query({
            query: () => ({
                url: `/users/getUser?itin=${itin}`,
                method: 'GET',
            }),
        }),
        updateUser: builder.mutation({
            query: (body) => ({
                url: `/users/${body.id}`,
                method: 'PUT',
                body,
            }),
        }),
    }),
});

export const { useGetUserWithItinQuery, useUpdateUserMutation } = userApi;