#!/bin/bash
# This script sets up SSL certificates for nexus.deveox.com

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Get the SSL certificate
echo "Obtaining SSL certificate for nexus.deveox.com..."
certbot --nginx -d nexus.deveox.com --non-interactive --agree-tos --email your-email@example.com

# Check if certificate was obtained successfully
if [ $? -eq 0 ]; then
    echo "SSL certificate installed successfully!"
    echo "Reloading Nginx..."
    systemctl reload nginx
else
    echo "Failed to obtain SSL certificate. Please check the certbot logs."
    exit 1
fi

# Set up auto-renewal
echo "Setting up certificate auto-renewal..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | sort - | uniq - | crontab -

echo "SSL setup completed successfully!"