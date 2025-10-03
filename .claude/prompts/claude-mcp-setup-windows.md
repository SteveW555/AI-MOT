# MCP Setup Guide for Claude Code on Windows

## Understanding the MCP Ecosystem

### Three Different Systems

**1. Claude Desktop (Anthropic Chat Interface)**
- **Download**: https://claude.ai/download (Windows desktop app)
- **Config location**: `%APPDATA%\Claude\claude_desktop_config.json`
  (Full path: `C:\Users\steve\AppData\Roaming\Claude\claude_desktop_config.json`)
- Desktop chat application with MCP support
- Best for general AI assistance and testing MCP servers

**2. Claude Code (Anthropic Coding Tool)**
- **Install**: VS Code extension marketplace
- **Two config levels**:
  - **User-wide**: `C:\Users\steve\.claude.json` (all projects) - Root level `mcpServers` object
  - **Project-specific**: `.claude\settings.local.json` (current project only)
- CLI tool: `claude mcp` commands (in VS Code terminal only)
- **Primary tool for coding with MCP**
- **Note**: `C:\Users\steve\.claude\settings.json` is for general settings, NOT MCP servers

**3. VS Code GitHub Copilot (Microsoft's AI)**
- Config location: `.mcp.json` (in project root)
- Separate system from Claude
- MCP support is incomplete/different
- **Don't use this for MCP** - use Claude Code instead

---

## Configuration File Locations - COMPLETE PICTURE

| Tool | Config File | Scope | Priority | MCP Servers |
|:-----|:------------|:------|:---------|:------------|
| **Claude Desktop** | `%APPDATA%\Claude\claude_desktop_config.json` | Desktop app only | N/A | Root level `mcpServers` |
| **Claude Code (User)** | `C:\Users\steve\.claude.json` | All VS Code projects | Base | Root level `mcpServers` |
| **Claude Code (Project)** | `.claude\settings.local.json` | Current project only | Override | Inside `mcpServers` property |
| Claude Code Settings | `C:\Users\steve\.claude\settings.json` | User settings | N/A | ❌ Does NOT support MCP |
| VS Code Copilot | `.mcp.json` | Project | N/A | Different format |

**How they relate:**
- Claude Desktop and Claude Code are **completely separate** systems
- Claude Code has **two levels** that merge together:
  - User-wide: `.claude.json` (root level `mcpServers` object)
  - Project: `.claude\settings.local.json` (nested `mcpServers` property)
- User-wide MCP servers apply to all projects automatically
- Project settings override user-wide if same server name exists
- Desktop config is standalone (doesn't sync with Code)

---

## Clean Slate Setup

### Complete Reset (if needed)

```powershell
# Remove Claude Desktop config
Remove-Item "$env:APPDATA\Claude\claude_desktop_config.json" -ErrorAction SilentlyContinue

# Clear logs
Remove-Item "$env:LOCALAPPDATA\Claude\logs\mcp*.log" -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force
```

---

## Setting Up Claude Desktop (Master Config)

### Configuration Format

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

### Complete Example Configuration

**Create/Edit:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/steve"
      ]
    },
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ]
    },
    "firecrawl": {
      "command": "npx",
      "args": [
        "-y",
        "firecrawl-mcp"
      ],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_KEY"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=YOUR_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_YOUR_TOKEN"
      }
    },
    "railway": {
      "command": "npx",
      "args": [
        "-y",
        "@railway/mcp-server"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN"
      }
    }
  }
}
```

**Windows-specific notes:**
- Use forward slashes `/` or escaped backslashes `\\` in paths
- Use `C:/Users/steve` format for filesystem paths
- After creating/updating: **Restart Claude Desktop** (File → Exit, then reopen)

### Quick Edit Commands

```powershell
# Open in Notepad
notepad "$env:APPDATA\Claude\claude_desktop_config.json"

# Open in VS Code
code "$env:APPDATA\Claude\claude_desktop_config.json"

# View current config
Get-Content "$env:APPDATA\Claude\claude_desktop_config.json"
```

---

## Individual MCP Server Setup

### 1. Filesystem

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Users/steve"]
}
```

- **Purpose**: Access local files
- **No API key required**
- **Windows path formats**: Use `C:/Users/steve` or `C:\\Users\\steve`

### 2. Context7

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```

- **Purpose**: Fetch up-to-date library documentation
- **No API key required**
- **Usage in Claude**: Add "use context7" to prompts

### 3. Firecrawl

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": {
    "FIRECRAWL_API_KEY": "fc-YOUR_KEY"
  }
}
```

- **Purpose**: Web scraping and crawling
- **Setup**: Get API key from https://firecrawl.dev/app/api-keys

### 4. Supabase

```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--project-ref=YOUR_PROJECT_REF"
  ],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_YOUR_TOKEN"
  }
}
```

- **Purpose**: Database access and management
- **Setup**:
  - Get token: https://supabase.com/dashboard/account/tokens
  - Project ref from project URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
- **For read-only**: Add `"--read-only"` to args array

### 5. Railway

```json
"railway": {
  "command": "npx",
  "args": ["-y", "@railway/mcp-server"]
}
```

- **Purpose**: Deploy and manage Railway applications
- **Prerequisites**:
  ```powershell
  # Install via npm (no Homebrew on Windows)
  npm install -g @railway/cli

  # Login
  railway login

  # Verify
  railway whoami
  ```

### 6. GitHub

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN"
  }
}
```

- **Purpose**: Repository management
- **Setup**: Get token from https://github.com/settings/tokens

---

## Setting Up Claude Code (Two-Level Configuration)

### User-Wide Configuration (All Projects) ✨

**File**: `C:\Users\steve\.claude.json` (root level `mcpServers` object)

This config applies to **every** VS Code project where Claude Code is active.

**IMPORTANT**: User-wide MCP servers are stored in `.claude.json`, NOT `.claude\settings.json`!

#### Using Claude CLI (Recommended)

Open VS Code integrated terminal and run:

```bash
# Add context7 (documentation lookup - no API key needed)
claude mcp add context7 npx @upstash/context7-mcp

# Add filesystem (file system access)
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem C:/Users/steve

# Verify they were added
claude mcp list
```

**Expected output:**
```
Checking MCP server health...

context7: cmd /c npx -y @upstash/context7-mcp - ✓ Connected
filesystem: npx @modelcontextprotocol/server-filesystem C:/Users/steve - ✓ Connected
```

#### Manual Edit (Advanced)

The servers are stored at the root level of `C:\Users\steve\.claude.json`:

```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@upstash/context7-mcp"],
      "env": {}
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "C:/Users/steve"],
      "env": {}
    }
  }
}
```

**⚠️ Warning**: `.claude.json` is a large file containing project history and settings. Edit carefully!

**Recommended user-wide servers:**
- **context7**: Documentation lookup (no API key)
- **filesystem**: Local file access (no API key)
- **github**: If you use GitHub across all projects (no API key for public repos)

### Project-Specific Configuration (Current Project Only)

**File**: `.claude\settings.local.json` (in project root)

This config only applies to the current project and merges with user-wide settings.

**Example**:
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_KEY"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_PROJECT_REF"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_YOUR_TOKEN"
      }
    }
  },
  "permissions": {
    "allow": [
      "Bash(npm install)",
      "Bash(powershell:*)",
      "WebSearch"
    ],
    "deny": [],
    "ask": []
  }
}
```

**Recommended project-specific servers:**
- **firecrawl**: Project-specific web scraping
- **supabase**: Project-specific database
- **railway**: Deployment for this project
- Any server with project-specific API keys

---

## Claude Code CLI Commands

**IMPORTANT**: Run these commands in the VS Code integrated terminal where Claude Code is active. The `claude` CLI is NOT available in external PowerShell/CMD.

### Understanding CLI Behavior

The `claude mcp add` command adds servers to **user-wide** config by default (stored in `C:\Users\steve\.claude.json`).

These servers will be available in ALL your VS Code projects automatically.

### Add User-Wide MCP Servers

```bash
# Simple server (no env vars) - becomes available in ALL projects
claude mcp add context7 npx @upstash/context7-mcp

# Add with specific path
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem C:/Users/steve

# List all configured servers
claude mcp list
```

### Add Project-Specific MCP Servers

For servers with API keys or project-specific configuration, add them to the project's `.claude\settings.local.json`:

```bash
# Use claude mcp add-json for servers with environment variables
claude mcp add-json firecrawl '{"command":"npx","args":["-y","firecrawl-mcp"],"env":{"FIRECRAWL_API_KEY":"fc-YOUR_KEY"}}'

# Or manually edit .claude\settings.local.json (see Project-Specific Configuration section)
```

### Remove Servers

```bash
# Remove a server
claude mcp remove firecrawl

# List all servers to verify
claude mcp list
```

### Other Commands

```bash
# Check server health and connectivity
claude mcp list

# Get help
claude mcp help
```

### Important Notes

- ❌ `--scope user` flag does NOT work (throws "unknown option" error)
- ❌ `-s user` flag does NOT work
- ✅ Servers added via `claude mcp add` go to user-wide config by default
- ✅ Use `claude mcp list` to see all configured servers (both user-wide and project)
- ⚠️ `claude mcp add-from-claude-desktop` may not work on Windows - manual configuration recommended

---

## Project-Level Configuration

### `.claude\settings.local.json` Format

The project config merges MCP servers with permissions:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_KEY"
      }
    }
  },
  "permissions": {
    "allow": [
      "Bash(npm install)",
      "Bash(powershell:*)",
      "WebSearch"
    ],
    "deny": [],
    "ask": []
  }
}
```

**Manual edit (if CLI unavailable):**
```powershell
code .claude\settings.local.json
```

---

## Ready-to-Use Prompts for Claude Code

Copy and paste these prompts directly into Claude Code to manage your MCP servers.

### add-all-mcps.md

```
Run `claude mcp add-from-claude-desktop` to import all MCP servers from my Claude Desktop configuration into this Claude Code project.

Check .claude/settings.local.json for result. Advise to restart Claude if necessary.

Then show me which servers were imported by running `claude mcp list`.

Remind me to restart Claude.
```

### add-specific-mcp.md

```
Import these specific MCP servers from my Claude Desktop config (%APPDATA%\Claude\claude_desktop_config.json) into this Claude Code project:

Use the appropriate `claude mcp add` or `claude mcp add-json` commands based on whether each server needs environment variables.

Services required:
- context7
- supabase
- firecrawl

Check .claude/settings.local.json for success.

Remind me to restart Claude.
```

### add-project-scope-mcp.md

```
Use the Claude Code MCP CLI to configure MCP servers for this project:

- Read my global Claude Desktop MCP configuration from %APPDATA%\Claude\claude_desktop_config.json
- Extract the configurations for the specified services below
- Add them to this project using `claude mcp add` or `claude mcp add-json` commands as appropriate
- Configuration will be stored in .claude\settings.local.json

Services required:
context7, supabase, firecrawl

Remind me to restart Claude.
```

### remove-specific-mcps.md

```
Remove the following MCP server from this Claude Code project using the `claude mcp remove` command:

Server to remove:
firecrawl

Remind me to restart Claude.
```

### remove-all-mcp.md

```
Remove all MCP servers from this Claude Code project:

1. Run `claude mcp list` to see all configured servers
2. For each server listed, run `claude mcp remove <server-name>`
3. Confirm all servers are removed by running `claude mcp list` again

Remind me to restart Claude.
```

### remove-allmcps-then-add.md

```
## Remove All

Remove all MCP servers from this Claude Code project:

1. Run `claude mcp list` to see all configured servers
2. For each server listed, run `claude mcp remove <server-name>`
3. Confirm all servers are removed by running `claude mcp list` again

## Add MCP Servers

Import these specific MCP servers from my Claude Desktop config (%APPDATA%\Claude\claude_desktop_config.json) into this Claude Code project:

Use the appropriate `claude mcp add` or `claude mcp add-json` commands based on whether each server needs environment variables.

Services required:
- context7
- supabase
- firecrawl

Check .claude\settings.local.json for success.

Remind me to restart Claude.
```

---

## Troubleshooting

### Check Connection Status

```powershell
# View MCP logs
Get-Content "$env:LOCALAPPDATA\Claude\logs\mcp.log" -Wait -Tail 50

# List Claude Code servers (in VS Code terminal)
claude mcp list

# Get specific server details
claude mcp get context7
```

### Common Issues

**MCP server not connecting:**
1. Restart Claude Desktop/VS Code completely
2. Check logs for errors
3. Verify API keys and tokens are correct
4. Ensure npm packages exist: `npm search PACKAGE_NAME`

**Wrong username in searches:**
- GitHub username is case-sensitive
- Verify actual username on GitHub profile

**Railway CLI authentication:**
- Browser login and CLI login are separate
- Always run `railway login` for CLI access
- Verify with `railway whoami`

**Claude CLI not found:**
- Make sure you're running commands in the VS Code integrated terminal
- Claude Code extension must be active in VS Code
- Try restarting VS Code

**Path issues on Windows:**
- Use forward slashes: `C:/Users/steve`
- Or escaped backslashes: `C:\\Users\\steve`
- Never use single backslash: `C:\Users\steve` ❌

---

## Security Notes

- Store API keys securely
- Consider rotating tokens after sharing in chat
- Never commit `.claude\settings.local.json` with secrets to git
- Add to `.gitignore`:
  ```
  .claude/settings.local.json
  .mcp.json
  ```

---

## Quick Reference

| Task | Command/Location |
|:-----|:-----------------|
| View Claude Desktop config | `notepad %APPDATA%\Claude\claude_desktop_config.json` |
| Edit Claude Desktop config | `code %APPDATA%\Claude\claude_desktop_config.json` |
| View project config | `code .claude\settings.local.json` |
| Restart Claude Desktop | File → Exit, then reopen |
| Import to Claude Code | `claude mcp add-from-claude-desktop` |
| List Claude Code servers | `claude mcp list` |
| Remove server | `claude mcp remove <name>` |
| View logs | `Get-Content "$env:LOCALAPPDATA\Claude\logs\mcp.log" -Wait -Tail 50` |
| Check Railway login | `railway whoami` |

---

## Windows-Specific PowerShell Helpers

```powershell
# Quick open config in default editor
ii "$env:APPDATA\Claude\claude_desktop_config.json"

# Check if config exists
Test-Path "$env:APPDATA\Claude\claude_desktop_config.json"

# Create backup of config
Copy-Item "$env:APPDATA\Claude\claude_desktop_config.json" "$env:APPDATA\Claude\claude_desktop_config.backup.json"

# View last 100 lines of logs
Get-Content "$env:LOCALAPPDATA\Claude\logs\mcp.log" -Tail 100

# Search logs for errors
Select-String -Path "$env:LOCALAPPDATA\Claude\logs\mcp.log" -Pattern "error"
```

---

## Recommended Setup Workflow

### Step 1: Set Up Claude Desktop First

1. **Download and install** Claude Desktop from https://claude.ai/download
2. **Create config directory** (if doesn't exist):
   ```powershell
   New-Item -Path "$env:APPDATA\Claude" -ItemType Directory -Force
   ```
3. **Create the config file**:
   ```powershell
   @"
   {
     "mcpServers": {
       "context7": {
         "command": "npx",
         "args": ["-y", "@upstash/context7-mcp"]
       },
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Users/steve"]
       }
     }
   }
   "@ | Out-File -FilePath "$env:APPDATA\Claude\claude_desktop_config.json" -Encoding UTF8
   ```
4. **Restart Claude Desktop** completely (File → Exit, then reopen)
5. **Test the connection** - Ask Claude Desktop "Can you use context7 to look up React hooks?"

### Step 2: Set Up Claude Code User-Wide Config

1. **Open VS Code** (any project)
2. **Open integrated terminal** (Ctrl + `)
3. **Add user-wide MCP servers** using Claude CLI:
   ```bash
   # Add context7 (documentation lookup)
   claude mcp add context7 npx @upstash/context7-mcp

   # Add filesystem (file access)
   claude mcp add filesystem npx @modelcontextprotocol/server-filesystem C:/Users/steve
   ```
4. **Verify they were added**:
   ```bash
   claude mcp list
   ```

   **Expected output:**
   ```
   Checking MCP server health...

   context7: cmd /c npx -y @upstash/context7-mcp - ✓ Connected
   filesystem: npx @modelcontextprotocol/server-filesystem C:/Users/steve - ✓ Connected
   ```

5. **Restart VS Code** completely (these servers will now be available in ALL projects)

### Step 3: Add Project-Specific MCP Servers (Optional)

Only add these if you need project-specific services with API keys.

**Option A: Using CLI** (for servers with environment variables):
```bash
# In VS Code integrated terminal (in your project)
claude mcp add-json firecrawl '{"command":"npx","args":["-y","firecrawl-mcp"],"env":{"FIRECRAWL_API_KEY":"fc-YOUR_KEY"}}'

claude mcp add-json supabase '{"command":"npx","args":["-y","@supabase/mcp-server-supabase@latest","--project-ref=YOUR_REF"],"env":{"SUPABASE_ACCESS_TOKEN":"sbp_YOUR_TOKEN"}}'
```

**Option B: Manual edit** `.claude\settings.local.json`:
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_KEY"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_REF"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_YOUR_TOKEN"
      }
    },
    "railway": {
      "command": "npx",
      "args": ["-y", "@railway/mcp-server"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN"
      }
    }
  },
  "permissions": {
    "allow": [],
    "deny": [],
    "ask": []
  }
}
```

### Step 4: Verify Everything Works

```bash
# In VS Code integrated terminal
claude mcp list
```

**You should see:**
- User-wide servers (context7, filesystem)
- Project-specific servers (if you added any)
- All showing ✓ Connected

---

## Best Practices

### Configuration Strategy

1. **Claude Desktop**: Use for testing MCP servers and general AI chat
2. **Claude Code User-Wide**: Add servers you want everywhere (context7, filesystem)
3. **Claude Code Project**: Only add project-specific servers with sensitive keys
4. **Keep it DRY**: Don't duplicate the same config across all three locations

### Security

1. **Never commit secrets**: Add `.claude/settings.local.json` to `.gitignore`
2. **Use environment variables** where possible for sensitive data
3. **Rotate API keys** after sharing in chat or screenshots
4. **User-wide config is safe** for keyless services (context7, filesystem)

### Maintenance

1. **Test in Desktop first** - Easier to debug MCP issues
2. **Use forward slashes in paths** - `C:/Users/steve` not `C:\Users\steve`
3. **Always restart after config changes** - Claude doesn't hot-reload configs
4. **Check logs when troubleshooting** - `$env:LOCALAPPDATA\Claude\logs\mcp.log`
5. **Keep user-wide config minimal** - Only add truly universal servers

### Development Workflow

**For new project:**
1. Open project in VS Code
2. User-wide MCP servers (context7, filesystem) work automatically
3. Only add project-specific servers if needed
4. Restart VS Code if you add new servers

**For testing new MCP server:**
1. Test in Claude Desktop first
2. Once working, decide: user-wide or project-specific?
3. Add to appropriate config
4. Restart the application

---

## Three-System Summary

| What You Want | Where to Configure |
|---------------|-------------------|
| Chat with AI using MCP | Claude Desktop → `%APPDATA%\Claude\claude_desktop_config.json` |
| MCP in ALL coding projects | Claude Code User → `C:\Users\steve\.claude.json` (root `mcpServers`) |
| MCP in THIS project only | Claude Code Project → `.claude\settings.local.json` |
| General Claude Code settings | `C:\Users\steve\.claude\settings.json` (NOT for MCP!) |
| Test if MCP server works | Claude Desktop (easiest to debug) |

---

## Key Learnings from Testing

### File Locations (Critical!)

✅ **CORRECT**:
- Claude Desktop MCP: `%APPDATA%\Claude\claude_desktop_config.json`
- Claude Code User-Wide MCP: `C:\Users\steve\.claude.json` (root level `mcpServers` object)
- Claude Code Project MCP: `.claude\settings.local.json` (nested `mcpServers` property)

❌ **WRONG**:
- `C:\Users\steve\.claude\settings.json` does NOT support MCP servers
- This file is for general Claude Code settings, not MCP configuration

### CLI Command Behavior

✅ **WORKS**:
- `claude mcp add <name> npx <package>` - Adds to user-wide config
- `claude mcp add-json <name> '{"command":"...","env":{...}}'` - Adds with env vars
- `claude mcp list` - Shows all servers (user-wide + project)
- `claude mcp remove <name>` - Removes a server

❌ **DOESN'T WORK**:
- `--scope user` flag (unknown option error)
- `-s user` flag (unknown option error)
- `claude` commands in external PowerShell/CMD (only works in VS Code terminal)

### Configuration Format Differences

**User-wide** (`.claude.json`):
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@upstash/context7-mcp"],
      "env": {}
    }
  }
}
```

**Project-level** (`.claude\settings.local.json`):
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-key"
      }
    }
  },
  "permissions": {...}
}
```

### Best Strategy

1. **Claude Desktop**: Configure ALL 6 servers for testing and chat
2. **Claude Code User-Wide**: Only add keyless servers (context7, filesystem)
3. **Claude Code Project**: Add servers with API keys per project
4. **Always verify** with `claude mcp list` after configuration changes
5. **Restart required** after adding MCP servers

---

## Complete Setup Verification (Tested 2025-10-03)

### Successful Setup Results

**User-Wide Configuration:**
```bash
claude mcp add context7 npx @upstash/context7-mcp
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem C:/Users/steve
```

**Project-Specific Configuration:**
```bash
claude mcp add-json firecrawl '{"command":"npx","args":["-y","firecrawl-mcp"],"env":{"FIRECRAWL_API_KEY":"fc-c85aefe745134a5f8ed1e376e3d57457"}}'

claude mcp add-json supabase '{"command":"npx","args":["-y","@supabase/mcp-server-supabase@latest","--project-ref=pauypyjqosrenuxveskn"],"env":{"SUPABASE_ACCESS_TOKEN":"sbp_14470d3c660a156f91bc4185ac528c4df80c7a09"}}'
```

**Verification Output:**
```
(base) PS C:\Users\steve\Coding\AI MOT> claude mcp list

Checking MCP server health...

context7: cmd /c npx -y @upstash/context7-mcp - ✓ Connected
filesystem: npx @modelcontextprotocol/server-filesystem C:/Users/steve - ✓ Connected
firecrawl: npx -y firecrawl-mcp - ✓ Connected
supabase: npx -y @supabase/mcp-server-supabase@latest --project-ref=pauypyjqosrenuxveskn - ✓ Connected
```

### MCP Server Test Results

**Context7 Test:**
- ✅ Successfully resolved "react" library
- ✅ Returned 30 library matches with documentation
- ✅ `/websites/react_dev` identified as top match (1936 code snippets, trust score 8)

**Filesystem Test:**
- ✅ Successfully connected
- ✅ Allowed directory: `C:\Users\steve\Coding\AI MOT`
- ✅ Can read/write files in project directory

**Supabase Test:**
- ✅ Successfully connected to database
- ✅ Listed 13 tables in `public` schema:
  - project_items
  - projects
  - categories
  - good_cause
  - keyword_types
  - keywords
  - nl2sql
  - project_allocations
  - project_item_keywords
  - subcategories
  - testytable
  - example_zurich_farnborough_allocations_with_subcats
  - adp_usage (20 rows)

**Firecrawl Test:**
- ✅ Successfully connected
- ✅ Ready for web scraping operations

### Final Configuration State

**Files Modified:**
1. `C:\Users\steve\.claude.json` - User-wide MCP servers (context7, filesystem)
2. `.claude\settings.local.json` - Project-specific MCP servers (firecrawl, supabase)

**Claude Desktop Config (unchanged):**
- `%APPDATA%\Claude\claude_desktop_config.json` - All 6 MCP servers for testing

**All 4 MCP servers operational and verified working!** 🎉

---

*Last Updated: 2025-10-03 (Windows configuration guide - fully tested and verified with all 4 MCP servers working)*
