import proxy from "express-http-proxy";
export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            // Never trust a user-supplied identity header.
            delete proxyReqOpts.headers["x-user-id"];
            // Only forward an identity verified by the gateway.
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
            }
            return proxyReqOpts;
        },
    });
};
