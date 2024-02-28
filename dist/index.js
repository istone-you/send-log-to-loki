"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
function sendLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const message = core.getInput("message");
        const lokiAddress = core.getInput("loki_address");
        const lokiUsername = core.getInput("loki_username");
        const lokiPassword = core.getInput("loki_password");
        const logEntry = {
            streams: [
                {
                    stream: { source: "lokisend-cli" },
                    values: [[`${Date.now()}000000`, message]],
                },
            ],
        };
        try {
            const response = yield axios_1.default.post(`${lokiAddress}/loki/api/v1/push`, logEntry, {
                headers: { "Content-Type": "application/json" },
                auth: { username: lokiUsername, password: lokiPassword },
            });
            console.log("Log sent successfully", response.data);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error sending log to Loki:", error.message);
                core.setFailed(error.message);
            }
            else {
                console.error("An unknown error occurred");
                core.setFailed("An unknown error occurred");
            }
        }
    });
}
sendLog();
