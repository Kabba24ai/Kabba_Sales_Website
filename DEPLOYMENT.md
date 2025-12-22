# Deployment Guide

## Overview

This document provides step-by-step instructions for deploying the KABBA Sales Website to the live server.

## Automated Deployment via GitHub Actions

The project is configured with automated deployment that triggers when code is pushed to the `develop` branch.

### Prerequisites

Before deployment, ensure these GitHub Secrets are configured in the repository:

1. Navigate to GitHub repository settings
2. Go to **Secrets and variables** → **Actions**
3. Verify the following secrets exist:
   - `SSH_PRIVATE_KEY` - Private SSH key for server authentication
   - `SSH_PORT` - SSH port number for server connection
   - `SSH_HOST` - Server hostname or IP address
   - `SSH_USER` - SSH username (should be `kabba`)

### Deployment Process

#### Step 1: Prepare Your Changes

```bash
# Ensure you're on the develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Make your changes to the code
# ... edit files ...
```

#### Step 2: Test Locally

```bash
# Install dependencies if needed
npm install

# Run development server
npm run dev

# Visit http://localhost:5173 to test your changes

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Test production build
npm run build
```

#### Step 3: Verify Build Success

After running `npm run build`, check that:
- No errors occurred during the build process
- The `dist/` directory was created
- Files in `dist/` include:
  - `index.html`
  - `assets/` directory with CSS and JS files

#### Step 4: Commit and Push

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Description of your changes"

# Push to develop branch
git push origin develop
```

**Note**: Git commits are handled automatically by the system. Simply push your changes.

#### Step 5: Monitor Deployment

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Find your latest commit in the workflow runs
4. Click on the workflow to see detailed progress
5. Monitor each step:
   - ✅ Checkout repo
   - ✅ Setup Node
   - ✅ Install dependencies
   - ✅ Build project
   - ✅ Setup SSH
   - ✅ Backup current site
   - ✅ Upload new build files

#### Step 6: Verify Deployment

1. Wait for the GitHub Actions workflow to complete (usually 2-3 minutes)
2. Visit the live website
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Verify your changes are live
5. Test critical functionality:
   - Navigation works
   - Forms submit correctly
   - All pages load properly
   - Footer links work (including new Acceptable Use Policy)

### Deployment Locations

**Server Path**: `/home/kabba/www`

**Backup Path**: `/home/kabba/www/old.backup`

The deployment process automatically:
- Creates a backup of the current site
- Replaces files with the new build
- Maintains backup in `old.backup/` directory

## Rollback Procedure

If you need to rollback to the previous version:

1. SSH into the server:
   ```bash
   ssh -p [SSH_PORT] kabba@[SSH_HOST]
   ```

2. Navigate to the web directory:
   ```bash
   cd /home/kabba/www
   ```

3. Restore from backup:
   ```bash
   # Remove current files
   rm -rf assets
   rm -f index.html

   # Restore from backup
   cp -r old.backup/assets ./
   cp old.backup/index.html ./
   ```

4. Verify the rollback worked by visiting the live site

## Manual Deployment (Emergency)

If GitHub Actions is unavailable, you can deploy manually:

### Prerequisites

- SSH access to the server
- SSH key configured locally
- rsync installed

### Steps

1. Build locally:
   ```bash
   npm run build
   ```

2. Create backup on server:
   ```bash
   ssh -p [SSH_PORT] kabba@[SSH_HOST] << 'EOF'
     cd /home/kabba/www
     mkdir -p old.backup
     [ -d "assets" ] && mv assets old.backup/
     [ -f "index.html" ] && mv index.html old.backup/
   EOF
   ```

3. Deploy new build:
   ```bash
   rsync -avz --delete \
     -e "ssh -p [SSH_PORT]" \
     dist/ \
     kabba@[SSH_HOST]:/home/kabba/www/
   ```

4. Verify deployment on live site

## Troubleshooting

### Build Fails

**Problem**: `npm run build` fails with errors

**Solution**:
1. Check TypeScript errors: `npm run typecheck`
2. Fix any type errors in the code
3. Ensure all imports are correct
4. Try clearing node_modules: `rm -rf node_modules && npm install`

### Deployment Fails

**Problem**: GitHub Actions deployment fails

**Solutions**:
1. Check GitHub Actions logs for specific error
2. Verify SSH secrets are correctly configured
3. Test SSH connection manually
4. Check server disk space: `ssh kabba@host 'df -h'`
5. Check server permissions: `ssh kabba@host 'ls -la /home/kabba/www'`

### Site Not Updating

**Problem**: Changes don't appear on live site

**Solutions**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check if deployment actually completed successfully
4. Verify correct branch was pushed (should be `develop`)
5. SSH into server and check file timestamps

### SSH Connection Issues

**Problem**: Cannot connect to server via SSH

**Solutions**:
1. Verify SSH_HOST and SSH_PORT secrets
2. Check if SSH key has correct permissions (600)
3. Test connection manually: `ssh -p [PORT] kabba@[HOST]`
4. Contact server administrator if connection times out

## Recent Changes

### December 22, 2024
- Added Acceptable Use Policy page and footer link
- Updated all page components to pass AUP handler prop
- Updated Footer component to display AUP link in Legal section
- All changes tested and build verified successfully

## Support

For deployment issues, contact:
- Technical Support: support@kabba.com
- Phone: (615) 289-6429

## Security Notes

- Never commit the `.env` file with sensitive keys
- Keep SSH private keys secure and never share
- Use SSH keys instead of passwords for server access
- Regularly rotate SSH keys and credentials
- Always test in development before pushing to develop

---

**Last Updated**: December 22, 2024
