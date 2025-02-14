## Deploying MERN Stack Project on Hostinger VPS

- Preparing the VPS Environment
- Setting Up the MongoDB Database
- Deploying the Express and Node.js Backend
- Deploying the React Frontends
- Configuring Nginx as a Reverse Proxy
- Setting Up SSL Certificates

### 1. Preparing the VPS Environment

Log in to Your VPS in Terminal

```bash
 ssh root@your_vps_ip
```

Update and Upgrade Your System

```bash
  sudo apt update
```

```bash
  sudo apt upgrade -y
```

Install Node.js and npm ( if not pre-installed)

```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
```

```bash
  sudo apt-get install -y nodejs
```

Install Git

```bash
  sudo apt install -y git
```

### 2. Setting Up the MongoDB Database

If you want to setup MongoDB on VPS Follow this Guide: [click here](https://github.com/GreatStackDev/notes/blob/main/MongoDB_Setup_on_VPS.md)

### 3. Deploying the Express and Node.js Backend

Clone Your Backend Repository

```bash
 mkdir /var/www
```

```bash
 cd /var/www
```

```bash
 git clone https://github.com/shubshindeinvtech/hrmsengine.git
```

```bash
 cd hrmsengine/server
```

Frontend folder location is

```bash
/var/www/hrmsengine/client
```

Backend folder location is

```bash
/var/www/hrmsengine/server
```

Install Dependencies

```bash
 npm install
```

Create .env file & configure Environment Variables

```bash
 nano .env
```

add environment variables then save and exit (Ctrl + X, then Y and Enter).

Installing pm2 to Start Backend

```bash
 npm install -g pm2
```

```bash
 pm2 start index.js --name index
```

Start Backend on startup

```bash
 pm2 startup
```

```bash
 pm2 save
```

Allowing backend port in firewall

```bash
 sudo ufw status
```

If firewall is disable then enable it using

```bash
 sudo ufw enable
```

```bash
 sudo ufw allow 'OpenSSH'
```

```bash
 sudo ufw allow 4000
```

### 4. Deploying the React Frontends

Creating Build of React Applications

```bash
 cd ../client
```

```bash
 npm install --force
```

If you have ".env" file in your project

Create .env file and paste the variables

```bash
 nano .env
```

Create build of project or you can also create build in local and push it

```bash
 npm run build
```

Repeat for the second or mulitiple React app.

Install Nginx

```bash
 sudo apt install -y nginx
```

adding Nginx in firewall

```bash
 sudo ufw status
```

```bash
 sudo ufw allow 'Nginx Full'
```

## Firewall Rules

Ensure the following ports are open:

| Service         | Action | From          |
| --------------- | ------ | ------------- |
| OpenSSH         | ALLOW  | Anywhere      |
| 4000            | ALLOW  | Anywhere      |
| Nginx Full      | ALLOW  | Anywhere      |
| 27017           | ALLOW  | Anywhere      |
| OpenSSH (v6)    | ALLOW  | Anywhere (v6) |
| 4000 (v6)       | ALLOW  | Anywhere (v6) |
| Nginx Full (v6) | ALLOW  | Anywhere (v6) |
| 27017 (v6)      | ALLOW  | Anywhere (v6) |

These rules ensure secure access and functionality for the respective services.

Configure Nginx for React Frontends

```bash
 nano /etc/nginx/sites-available/yourdomain1.com.conf
```

```bash
 server {
    listen 80;
    server_name yourdomain1.com www.yourdomain1.com;

    location / {
        root /var/www/hrmsengine/client/dist;
        try_files $uri /index.html;
    }
}
```

Save and exit (Ctrl + X, then Y and Enter).

Create symbolic links to enable the sites.

```bash
ln -s /etc/nginx/sites-available/yourdomain1.com.conf /etc/nginx/sites-enabled/
```

Test the Nginx configuration for syntax errors.

```bash
nginx -t
```

```bash
systemctl restart nginx
```

### 5. Configuring Nginx as a Reverse Proxy

Update Backend Nginx Configuration

```bash
nano /etc/nginx/sites-available/api.yourdomain.com.conf
```

```bash
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Create symbolic links to enable the sites.

```bash
ln -s /etc/nginx/sites-available/api.yourdomain.com.conf /etc/nginx/sites-enabled/
```

Restart nginx

```bash
systemctl restart nginx
```

### Connect Domain Name with Website

Point all your domain & sub-domain on VPS IP address by adding DNS records in your domain manager

Now your website will be live on domain name

### 6. Setting Up SSL Certificates

Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain SSL Certificates

```bash
certbot --nginx -d yourdomain1.com -d www.yourdomain1.com -d yourdomain2.com -d api.yourdomain.com
```

Verify Auto-Renewal

```bash
certbot renew --dry-run
```

### 7. Notes

1. If you push any new changes in repo

```bash
git pull origin
```

or

```bash
git pull --rebase origin main
```

2.

```bash
sudo systemctl restart nginx
```

3.

```bash
pm2 restart index
```

This above index is name when you "pm2 start index.js --name index"

4. If you want to see logs

```bash
pm2 logs index
```

5. If getting any mongoDB Connection error please check connetion string and run below command.

```bash
sudo systemctl start mongod
```

nginx.conf file is like below

path

```bash
/etc/nginx/nginx.conf
```

file

```bash
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;

        ##
        # Gzip Settings
        ##

        gzip on;

        # gzip_vary on;
```

### 8. Backend domain config

path

```bash
/etc/nginx/sites-available/backenddomain.conf
```

.conf file

```bash
server {
    server_name hrmsapi.invezzatech.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/admin/logs {
    proxy_pass http://localhost:4000;
    proxy_set_header Connection keep-alive;
    proxy_buffering off;
    proxy_cache off;
    chunked_transfer_encoding off;
}


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/hrmsdev.invezzatech.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/hrmsdev.invezzatech.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = hrmsapi.invezzatech.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name hrmsapi.invezzatech.com;
    return 404; # managed by Certbot
}
```

### 9. Frontend domain config

path

```bash
/etc/nginx/sites-available/frontend.conf
```

.conf file

```bash
 server {
    server_name hrmsdev.invezzatech.com  www.hrmsdev.invezzatech.com;

    location / {
        root /var/www/hrmsengine/client/dist;
        try_files $uri /index.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/hrmsdev.invezzatech.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/hrmsdev.invezzatech.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
 server {
    if ($host = www.hrmsdev.invezzatech.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = hrmsdev.invezzatech.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name hrmsdev.invezzatech.com  www.hrmsdev.invezzatech.com;
    return 404; # managed by Certbot
}
```

### 10. SSL

This is path of ssl from all domains in one ssl cert:

```bash
/etc/letsencrypt/live/hrmsdev.invezzatech.com
```

### 11. Access MongoDB

```bash
mongosh
```

```bash
show dbs
```

```bash
use your_db_name
```

```bash
show collections
```

```bash
db.collection_name.find()
```

perform other operations

```bash
.exit
```
