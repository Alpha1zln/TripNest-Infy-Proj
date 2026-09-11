# SSH Setup — Multiple GitHub Accounts

## Purpose

Set up SSH authentication on Windows/Git Bash for using multiple GitHub accounts from the same PC.

---

## 1. Check Existing SSH Setup

Initially checked whether an SSH directory already existed:

```bash
ls -al ~/.ssh
```

Result:

```text
No such file or directory
```

This confirmed that SSH keys had not been created yet.

---

# Main GitHub Account

## 2. Create Main Account SSH Key

Command used:

```bash
ssh-keygen -t ed25519 -C "shreyas21k@gmail.com"
```

When asked where to save the key, used:

```text
/c/Users/shreyasHm/.ssh/id_ed25519_main
```

This created:

```text
~/.ssh/id_ed25519_main
~/.ssh/id_ed25519_main.pub
```

The private key was protected with a passphrase.

### Key roles

```text
id_ed25519_main
    → Private key 🔒
    → NEVER share

id_ed25519_main.pub
    → Public key
    → Added to main GitHub account
```

---

## 3. Display Main Public Key

Command:

```bash
cat ~/.ssh/id_ed25519_main.pub
```

The complete output was copied to:

**GitHub → Settings → SSH and GPG keys → New SSH key**

Key type:

```text
Authentication Key
```

---

## 4. Test Main GitHub SSH Connection

Command:

```bash
ssh -T git@github.com
```

First connection asked whether GitHub should be trusted.

Entered:

```text
yes
```

GitHub then successfully authenticated the account:

```text
Hi Alpha1zln! You've successfully authenticated, but GitHub does not provide shell access.
```

This confirmed that the main SSH key was working.

---

## 5. Create SSH Configuration

Created:

```bash
nano ~/.ssh/config
```

Configuration used for the main account:

```text
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_main
    IdentitiesOnly yes
```

### Meaning

```text
github.com
    ↓
use id_ed25519_main
    ↓
authenticate as main GitHub account
```

---

# Temporary GitHub Account

## 6. Create Temporary Account SSH Key

Command used:

```bash
ssh-keygen -t ed25519 -C "TEMP_GITHUB_EMAIL"
```

The temporary account email was used in place of `TEMP_GITHUB_EMAIL`.

When asked where to save the key, used:

```text
/c/Users/shreyasHm/.ssh/id_ed25519_temp
```

This created:

```text
~/.ssh/id_ed25519_temp
~/.ssh/id_ed25519_temp.pub
```

The private key was protected with a passphrase.

---

## 7. Display Temporary Public Key

Command:

```bash
cat ~/.ssh/id_ed25519_temp.pub
```

The complete public-key output was copied to:

**Temporary GitHub account → Settings → SSH and GPG keys → New SSH key**

Key type:

```text
Authentication Key
```

The temporary account's public key has been added successfully.

---

# GitHub Repository Remote

## 8. Check Current Git Remote

Command:

```bash
git remote -v
```

Initially the repository used an HTTPS remote.

Example:

```text
origin  https://github.com/skyInfApx/TripNest-Project-Infy.git (fetch)
origin  https://github.com/skyInfApx/TripNest-Project-Infy.git (push)
```

---

## 9. Change Repository Remote to SSH

Command:

```bash
git remote set-url origin git@github.com:skyInfApx/TripNest-Project-Infy.git
```

Verify:

```bash
git remote -v
```

Expected:

```text
origin  git@github.com:skyInfApx/TripNest-Project-Infy.git (fetch)
origin  git@github.com:skyInfApx/TripNest-Project-Infy.git (push)
```

---

# Important Git Concepts

## Git Identity vs GitHub Authentication

These commands:

```bash
git config --global user.name
git config --global user.email
```

identify the author of Git commits.

They do **not** determine which GitHub account is used for authentication.

SSH keys determine GitHub authentication.

```text
git config
    ↓
Who authored the commit?

SSH key
    ↓
Which GitHub account authenticates the operation?
```

---

# Multiple GitHub Accounts

Current keys:

```text
~/.ssh/
├── id_ed25519_main
├── id_ed25519_main.pub
├── id_ed25519_temp
└── id_ed25519_temp.pub
```

Target configuration:

```text
github.com
    ↓
Main GitHub
    ↓
id_ed25519_main

github-temp
    ↓
Temporary GitHub
    ↓
id_ed25519_temp
```

The temporary account still requires the `github-temp` host alias to be added to:

```text
~/.ssh/config
```

before its repository can be used through the second SSH identity.

---

# Security Rules

### Never share:

```text
id_ed25519_main
id_ed25519_temp
```

These are private keys.

### Safe to add to GitHub:

```text
id_ed25519_main.pub
id_ed25519_temp.pub
```

Never commit `.ssh` keys to a Git repository.

Never put private SSH keys inside a project folder.

---

# Useful Commands

Check SSH files:

```bash
ls -al ~/.ssh
```

Show a public key:

```bash
cat ~/.ssh/id_ed25519_main.pub
cat ~/.ssh/id_ed25519_temp.pub
```

Test main GitHub:

```bash
ssh -T git@github.com
```

Check Git remote:

```bash
git remote -v
```

Change remote:

```bash
git remote set-url origin <SSH-REPOSITORY-URL>
```

Check Git identity:

```bash
git config --global user.name
git config --global user.email
```
