import dotenv from "dotenv";
dotenv.config();
const requiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
export const ENV = {
    PORT: Number(process.env.PORT || 3000),
    AUTH_SERVICE: requiredEnv("AUTH_SERVICE"),
    CHAT_SERVICE: requiredEnv("CHAT_SERVICE"),
    AGENT_SERVICE: requiredEnv("AGENT_SERVICE"),
};
