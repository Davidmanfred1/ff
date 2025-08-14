# Church Management System - Deployment Guide

This guide provides step-by-step instructions for deploying the Grace Community Church Management System to various hosting platforms.

## 📋 Pre-Deployment Checklist

### Required Files Verification
Ensure all these files are present in your project:

```
church-management-system/
├── index.html                 ✅ Main entry point
├── manifest.json             ✅ PWA manifest
├── sw.js                     ✅ Service worker
├── README.md                 ✅ Documentation
├── TESTING.md                ✅ Testing guide
├── DEPLOYMENT.md             ✅ This file
├── assets/
│   ├── css/
│   │   └── style.css         ✅ Main stylesheet
│   ├── js/
│   │   ├── main.js           ✅ Core functionality
│   │   ├── components.js     ✅ UI components
│   │   └── admin.js          ✅ Admin functions
│   └── images/               ✅ Image assets folder
└── pages/
    ├── about.html            ✅ About page
    ├── events.html           ✅ Events management
    ├── members.html          ✅ Member management
    ├── giving.html           ✅ Offerings management
    ├── ministries.html       ✅ Ministry management
    ├── communications.html   ✅ Communications
    ├── media.html            ✅ Media management
    ├── admin.html            ✅ Admin panel
    └── dashboard.html        ✅ Admin dashboard
```

### Configuration Steps

1. **Update Church Information**
   - Edit `index.html` to include your church's name, address, and contact details
   - Update service times in the hero section
   - Replace placeholder images with your church's photos

2. **Customize Branding**
   - Modify colors in `assets/css/style.css` (CSS variables at the top)
   - Replace the church name throughout all files
   - Update the manifest.json with your church's information

3. **Configure Contact Information**
   - Update email addresses in footer and contact sections
   - Set correct phone numbers
   - Update social media links

## 🌐 Hosting Platform Deployment

### Option 1: GitHub Pages (Free)

**Prerequisites**: GitHub account

**Steps**:
1. Create a new repository on GitHub
2. Upload all project files to the repository
3. Go to repository Settings → Pages
4. Select source branch (usually `main` or `master`)
5. Your site will be available at `https://yourusername.github.io/repository-name`

**Pros**: Free, automatic SSL, easy updates via Git
**Cons**: Public repositories only (unless GitHub Pro)

### Option 2: Netlify (Free Tier Available)

**Prerequisites**: Netlify account

**Steps**:
1. Sign up at netlify.com
2. Drag and drop your project folder to Netlify dashboard
3. Or connect your GitHub repository for automatic deployments
4. Configure custom domain if desired
5. Site will be available at `https://random-name.netlify.app`

**Pros**: Free tier, automatic deployments, form handling, serverless functions
**Cons**: Bandwidth limits on free tier

### Option 3: Vercel (Free Tier Available)

**Prerequisites**: Vercel account

**Steps**:
1. Sign up at vercel.com
2. Import your GitHub repository
3. Deploy with default settings
4. Configure custom domain if needed
5. Site will be available at `https://project-name.vercel.app`

**Pros**: Excellent performance, automatic deployments, edge network
**Cons**: Limited to static sites on free tier

### Option 4: Traditional Web Hosting

**Prerequisites**: Web hosting account with cPanel or FTP access

**Steps**:
1. Connect to your hosting account via FTP or file manager
2. Upload all files to the public_html or www directory
3. Ensure index.html is in the root directory
4. Set proper file permissions (644 for files, 755 for directories)
5. Test the site at your domain

**Pros**: Full control, can add server-side features later
**Cons**: Costs money, requires more technical knowledge

### Option 5: Firebase Hosting (Free Tier Available)

**Prerequisites**: Google account, Firebase CLI

**Steps**:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize project: `firebase init hosting`
4. Configure firebase.json:
   ```json
   {
     "hosting": {
       "public": ".",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```
5. Deploy: `firebase deploy`

**Pros**: Google infrastructure, excellent performance, free SSL
**Cons**: Requires command line knowledge

## 🔧 Server Configuration

### Apache (.htaccess)
Create a `.htaccess` file in your root directory:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Force HTTPS (if SSL is available)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx Configuration
Add to your nginx.conf or site configuration:

```nginx
# Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Cache static assets
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";

# PWA support
location /sw.js {
    add_header Cache-Control "no-cache";
    expires off;
}

location /manifest.json {
    add_header Cache-Control "no-cache";
    expires off;
}
```

## 📱 PWA Configuration

### Service Worker Registration
The service worker is automatically registered in `main.js`. Ensure these files are accessible:
- `sw.js` (service worker file)
- `manifest.json` (PWA manifest)

### Icon Requirements
Create app icons in the following sizes and place in `assets/images/`:
- 72x72px (icon-72.png)
- 96x96px (icon-96.png)
- 128x128px (icon-128.png)
- 144x144px (icon-144.png)
- 152x152px (icon-152.png)
- 192x192px (icon-192.png)
- 384x384px (icon-384.png)
- 512x512px (icon-512.png)

### Manifest Configuration
Update `manifest.json` with your church information:

```json
{
  "name": "Your Church Name Management System",
  "short_name": "Your Church",
  "description": "Church management system for Your Church Name",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6f42c1"
}
```

## 🔒 Security Considerations

### HTTPS Setup
- Obtain SSL certificate from your hosting provider or Let's Encrypt
- Configure automatic HTTP to HTTPS redirects
- Update all internal links to use HTTPS

### Content Security Policy
Add CSP header to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net;">
```

### File Permissions
Set appropriate file permissions:
- Files: 644 (readable by owner, group, and others)
- Directories: 755 (executable by owner, readable by group and others)
- Sensitive files: 600 (readable by owner only)

## 📊 Analytics and Monitoring

### Google Analytics Setup
Add Google Analytics tracking code to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Performance Monitoring
Consider adding:
- Google PageSpeed Insights monitoring
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry, LogRocket)

## 🔄 Updates and Maintenance

### Version Control
- Use Git for version control
- Tag releases for easy rollbacks
- Maintain separate branches for development and production

### Backup Strategy
- Regular backups of all files
- Database backups (if applicable)
- Test restore procedures

### Update Process
1. Test changes in staging environment
2. Create backup of current production site
3. Deploy updates during low-traffic periods
4. Monitor for errors after deployment
5. Have rollback plan ready

## 🆘 Troubleshooting

### Common Issues

**Issue**: PWA not installing on mobile
**Solution**: Ensure HTTPS is enabled and manifest.json is accessible

**Issue**: Service worker not updating
**Solution**: Clear browser cache or update service worker version

**Issue**: Images not loading
**Solution**: Check file paths and permissions

**Issue**: JavaScript errors
**Solution**: Check browser console for specific error messages

**Issue**: Mobile layout issues
**Solution**: Test responsive design and check CSS media queries

### Support Resources
- Browser developer tools for debugging
- Lighthouse for performance auditing
- WAVE for accessibility testing
- GTmetrix for speed testing

## 📞 Post-Deployment

### Launch Checklist
- [ ] Test all functionality on live site
- [ ] Verify contact forms work
- [ ] Check all links and navigation
- [ ] Test on multiple devices and browsers
- [ ] Set up monitoring and analytics
- [ ] Create admin user accounts
- [ ] Train staff on system usage
- [ ] Document any custom configurations

### Ongoing Maintenance
- Regular security updates
- Content updates and backups
- Performance monitoring
- User feedback collection
- Feature enhancements based on needs

---

**Congratulations!** Your church management system is now deployed and ready to serve your congregation. Remember to regularly update content and monitor performance to ensure the best experience for your users.
