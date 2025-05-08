exports.routesConfig = {
    baseURL: '/api',
    auth: {
        path: '/auth',
        versions: {
            v1: {
                path: '/v1',
                routes: {
                    user: {
                        path: '/user',
                        subPaths: {
                            root: '/',
                            signUp: '/signup',
                            signIn: '/signin',
                            logout: '/logout',
                            sendVerifyOtp: '/send-verify-otp',
                            verifyOtp: '/verify-otp',
                            forgetPassword: '/forget-password',
                            resetPassword: '/reset-password',

                        },
                    },
                },
            },
        },
    },
    methods: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
    },
};
