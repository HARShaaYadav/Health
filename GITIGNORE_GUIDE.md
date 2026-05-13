# 📝 .gitignore Guide

## Overview

The `.gitignore` file tells Git which files and directories to ignore when committing code. This prevents sensitive data, build artifacts, and unnecessary files from being tracked in version control.

---

## 🔒 **Critical Files Being Ignored**

### Environment Variables
```
.env
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**Why:** Contains sensitive data like:
- MongoDB connection string with credentials
- JWT secret keys
- API keys
- Database passwords

**⚠️ NEVER commit these files!**

### Sensitive Credentials
```
secrets.json
credentials.json
service-account.json
*.key
*.pem
*.p12
*.pfx
```

**Why:** Contains authentication credentials and private keys

---

## 📦 **Dependencies & Build Files**

### Node Modules
```
/node_modules
/.pnp
.pnp.js
```

**Why:** 
- Large directory (100+ MB)
- Can be regenerated with `npm install`
- Different per environment

### Build Output
```
/.next/
/out/
/build
/dist
```

**Why:**
- Generated files
- Can be rebuilt with `npm run build`
- Environment-specific

### TypeScript Build Info
```
*.tsbuildinfo
next-env.d.ts
tsconfig.tsbuildinfo
```

**Why:** Temporary TypeScript compilation cache

---

## 🗄️ **Database Files**

### MongoDB
```
mongodb-data/
dump/
backup/
*.sql
*.sqlite
*.db
```

**Why:**
- Database dumps contain user data
- Can be large files
- Should be backed up separately

---

## 💻 **IDE & Editor Files**

### VS Code
```
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
```

**Why:** Personal editor settings (except shared configs)

### Other IDEs
```
.idea/
*.sublime-workspace
*.sublime-project
*.iml
```

**Why:** IDE-specific configuration files

---

## 🖥️ **Operating System Files**

### macOS
```
.DS_Store
.AppleDouble
.LSOverride
._*
```

**Why:** macOS system files not needed in repo

### Windows
```
Thumbs.db
Desktop.ini
$RECYCLE.BIN/
```

**Why:** Windows system files

### Linux
```
*~
.directory
.Trash-*
```

**Why:** Linux temporary files

---

## 📊 **Logs & Debug Files**

```
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**Why:**
- Runtime logs
- Debug information
- Can be regenerated

---

## 🧪 **Testing Files**

```
/coverage
*.test.js.snap
/test-results/
/playwright-report/
```

**Why:**
- Test coverage reports
- Test snapshots
- Can be regenerated

---

## 📱 **What SHOULD Be Committed**

### Source Code
✅ All `.ts`, `.tsx`, `.js`, `.jsx` files
✅ Component files
✅ API routes
✅ Database models
✅ Utility functions

### Configuration
✅ `package.json`
✅ `tsconfig.json`
✅ `next.config.js`
✅ `tailwind.config.js`
✅ `.env.example` (template without secrets)

### Documentation
✅ `README.md`
✅ All `.md` documentation files
✅ Code comments

### Assets
✅ Images (if small)
✅ Icons
✅ Fonts
✅ Static files in `/public`

---

## 🚫 **What Should NEVER Be Committed**

### Sensitive Data
❌ `.env.local` (contains real credentials)
❌ Database dumps with user data
❌ API keys and secrets
❌ Private keys (`.pem`, `.key`)
❌ Authentication tokens

### Generated Files
❌ `node_modules/`
❌ `.next/` build output
❌ `coverage/` reports
❌ `*.log` files

### Personal Files
❌ IDE settings (except shared)
❌ OS system files
❌ Temporary files
❌ Backup files

---

## 🔧 **Special Cases**

### Lock Files
```
# package-lock.json
# yarn.lock
# pnpm-lock.yaml
```

**Currently:** Commented out (being tracked)
**Why:** Ensures consistent dependencies across environments

**Options:**
- **Keep tracked** (recommended): Ensures everyone uses same versions
- **Ignore**: Allows flexibility but may cause version conflicts

### .vscode Settings
```
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
```

**Why:** 
- Ignore personal settings
- Keep shared project settings

---

## 📋 **Checklist Before Committing**

### Always Check:
- [ ] No `.env.local` or `.env` files
- [ ] No `node_modules/` directory
- [ ] No build output (`.next/`, `out/`)
- [ ] No sensitive credentials
- [ ] No database dumps
- [ ] No personal IDE settings
- [ ] No log files

### Use Git Status:
```bash
git status
```

### Review Changes:
```bash
git diff
```

### Check for Secrets:
```bash
# Search for potential secrets
git grep -i "password"
git grep -i "secret"
git grep -i "api_key"
```

---

## 🛠️ **Common Commands**

### Check What's Ignored
```bash
git status --ignored
```

### Remove Already Tracked File
```bash
# If you accidentally committed a file
git rm --cached .env.local
git commit -m "Remove .env.local from tracking"
```

### Force Add Ignored File (if needed)
```bash
git add -f file.txt
```

### Test .gitignore Pattern
```bash
git check-ignore -v filename
```

---

## 🔄 **If You Accidentally Committed Secrets**

### Immediate Steps:
1. **Remove from Git:**
   ```bash
   git rm --cached .env.local
   git commit -m "Remove sensitive file"
   git push
   ```

2. **Rotate Credentials:**
   - Change MongoDB password
   - Generate new JWT secret
   - Rotate API keys

3. **Clean History (if needed):**
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # This rewrites history - use with caution!
   ```

---

## 📚 **Best Practices**

### 1. Use .env.example
```bash
# .env.example (safe to commit)
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here

# .env.local (never commit)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=actual-secret-key-123
```

### 2. Document Required Variables
In README.md, list all required environment variables

### 3. Regular Audits
```bash
# Check for accidentally tracked files
git ls-files | grep -E '\.(env|log|key)$'
```

### 4. Pre-commit Hooks
Consider using tools like:
- `husky` - Git hooks
- `lint-staged` - Run linters
- `git-secrets` - Prevent committing secrets

---

## 🎯 **Project-Specific Ignores**

### Luna Health AI Specific:
```
# User uploads (if implemented)
/public/uploads/

# Temporary files
/public/temp/

# Local configuration
*.local.json
local-config.json

# MongoDB backups
backup/
dump/
```

---

## 📖 **Additional Resources**

### Official Documentation
- [Git Documentation](https://git-scm.com/docs/gitignore)
- [GitHub .gitignore Templates](https://github.com/github/gitignore)

### Tools
- [gitignore.io](https://www.toptal.com/developers/gitignore) - Generate .gitignore files
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Remove sensitive data

---

## ✅ **Verification**

### Your .gitignore is Working If:
- ✅ `git status` doesn't show `node_modules/`
- ✅ `.env.local` is not listed in `git status`
- ✅ `.next/` directory is ignored
- ✅ Log files don't appear
- ✅ IDE files are ignored

### Test It:
```bash
# Create a test file
echo "test" > .env.local

# Check if it's ignored
git status

# Should NOT appear in untracked files
```

---

## 🎉 **Summary**

Your `.gitignore` file is now configured to:
- ✅ Protect sensitive credentials
- ✅ Exclude build artifacts
- ✅ Ignore dependencies
- ✅ Skip OS-specific files
- ✅ Prevent IDE clutter
- ✅ Keep repository clean

**Your sensitive data is protected!** 🔒

---

## 📞 **Need Help?**

If you're unsure about a file:
1. Check if it contains sensitive data → Ignore it
2. Check if it's generated → Ignore it
3. Check if it's personal → Ignore it
4. When in doubt → Ignore it (can always add later)

**Better safe than sorry!** 🛡️
