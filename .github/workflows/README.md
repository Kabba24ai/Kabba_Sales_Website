# GitHub Actions Workflows

This directory contains the CI/CD pipeline workflows for the KABBA Sales Website.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Purpose**: Automated continuous integration to ensure code quality and successful builds.

**Triggers**:
- Push to `main`, `develop`, or `copilot/**` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

**Jobs**:

1. **Lint** - Code quality checks using ESLint
2. **Type Check** - TypeScript type safety verification
3. **Build** - Production build using Vite
4. **Security Audit** - Dependency vulnerability scanning

**Note**: Lint and type check jobs use `continue-on-error: true` to not block builds on non-critical issues.

---

### 2. Deploy to GitHub Pages (`deploy.yml`)

**Purpose**: Automated deployment of the production site to GitHub Pages.

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

**Jobs**:

1. **Build** - Creates production build and uploads artifacts
2. **Deploy** - Deploys to GitHub Pages environment

**Requirements**:
- GitHub Pages must be enabled in repository settings
- Deploy from GitHub Actions should be selected as the source

---

## Setup Instructions

### For GitHub Pages Deployment

1. Go to repository Settings → Pages
2. Select "GitHub Actions" as the source
3. The site will be automatically deployed on push to `main`

### Environment Variables

If needed, add repository secrets in Settings → Secrets and variables → Actions:
- `VITE_SUPABASE_URL` (if not committed)
- `VITE_SUPABASE_ANON_KEY` (if not committed)

### Running Workflows Manually

1. Go to Actions tab in GitHub
2. Select the workflow you want to run
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

---

## Monitoring

- View workflow runs in the "Actions" tab
- Each run shows detailed logs for debugging
- Build artifacts are stored for 7 days
- Failed runs trigger email notifications to repository admins

## Customization

To modify the workflows:
1. Edit the YAML files in this directory
2. Commit and push changes
3. The updated workflows will be used on the next trigger

For more information, see: https://docs.github.com/en/actions
