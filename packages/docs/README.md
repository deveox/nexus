# Nexus Documentation

This package contains the documentation website for Nexus, built with Nuxt and Nuxt Content.

## Local Development

To run the documentation site locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at http://localhost:3000.

## Building for Production

To build the site for production:

```bash
npm run generate
```

This will create a static site in the `.output/public` directory.

## Deployment

The documentation site is automatically deployed to https://nexus.deveox.com whenever changes are pushed to the main branch. The deployment process:

1. Builds the static site using Nuxt's `generate` command
2. Transfers the built files to the DigitalOcean server
3. Configures Nginx to serve the static files

### Manual Deployment

If you need to deploy manually, you can trigger the GitHub workflow by:

1. Going to the GitHub repository
2. Navigating to Actions → Deploy Docs
3. Clicking "Run workflow"

### SSL Certificates

The website uses Let's Encrypt for SSL certificates. To set up or renew certificates manually, connect to the server and run:

```bash
sudo bash /var/www/nexus.deveox.com/setup-ssl.sh
```

## Nginx Configuration

The Nginx configuration is stored in `nginx/nexus.conf` and is automatically deployed along with the static files.