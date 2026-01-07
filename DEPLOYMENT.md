# Deployment

The deployment is done using Cloudflare Platform's Git integration.

### Backend: Cloudflare Workers
1) Navigate to Cloudflare Dashboard → Workers & Pages → Create application
2) Choose "Continue with GitHub"
3) Select the repository
4) Click on "Advanced Settings" and set the "Path" to `/server`
5) Click on "Deploy"

### Frontend: Cloudflare Pages
1) Navigate to Cloudflare Dashboard → Workers & Pages → Create application
2) At the bottom there's a section "Looking to deploy Pages? Get started". Click on Get Started.
3) Choose "Import an existing Git repository"
4) Select the repository
5) Click on "Root directory (advanced)"
6) Put in following values:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`
   - Add an environment variable `VITE_API_URL` with value set to your backend worker URL. (Can be found in the Workers dashboard after deploying the backend)
7) Click on "Save and Deploy"

As a last step, go back to your backend worker, and add a new environment variable `CLIENT_ORIGIN` with value set to your frontend pages URL. (Can be found in the Pages dashboard after deploying the frontend)
