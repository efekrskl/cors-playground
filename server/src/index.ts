import { httpServerHandler } from 'cloudflare:node';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as process from 'node:process';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/simple-allowed', cors({ origin: CLIENT_ORIGIN }), async (_req, res) => {
	res.json({
		message: 'Simple GET allowed for this origin.',
	});
});

app.get('/simple-allowed', cors({ origin: 'https://expressjs.com' }), (_req, res) => {
	res.json({
		message: 'Simple GET allowed for this origin.',
	});
});

app.options('/preflight-allowed', cors());
app.post('/preflight-allowed', cors(), (req, res) => {
	res.json({
		message: 'Preflight passed: method and headers allowed.',
		body: req.body,
	});
});

app.options('/preflight-blocked', cors({ allowedHeaders: ['Content-Type'] }));
app.post('/preflight-blocked', cors(), (_req, res) => {
	res.json({
		endpoint: '/preflight-blocked',
		message: 'Preflight blocked: method not allowed.',
	});
});

app.get('/credentials-allowed', cors({ origin: CLIENT_ORIGIN, credentials: true }), (_req, res) => {
	res
		.cookie('cors-demo', '123', {
			httpOnly: false,
			sameSite: 'none',
			secure: true,
		})
		.json({
			endpoint: '/credentials-allowed',
			message: 'Credentials enabled, cookie should be set.',
		});
});

app.get('/credentials-misconfigured', cors({ origin: '*', credentials: true }), (_req, res) => {
	res.json({
		endpoint: '/credentials-misconfigured',
		message: 'Misconfigured, Access-Control-Allow-Origin: * with credentials: true.',
	});
});

app.listen(3000);
export default httpServerHandler({ port: 3000 });
