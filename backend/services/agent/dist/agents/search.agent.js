"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAgent = void 0;
const tavily_1 = require("../config/tavily");
const searchAgent = async (state) => {
    try {
        const results = await tavily_1.searchTool.invoke({
            query: state.prompt
        });
        return {
            ...state,
            searchResults: results,
            images: results.images
        };
    }
    catch (error) {
        return {
            ...state,
            searchResults: [],
            images: []
        };
    }
};
exports.searchAgent = searchAgent;
