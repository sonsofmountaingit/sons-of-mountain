# Server

SSH: `ssh sons` (23.88.32.182, root, key: `~/.ssh/id_ed25519_mnstanchev`)
OS: Ubuntu 26.04, 2 vCPU / 4GB / 75GB NVMe
Firewall: ufw, ports 22/80/443 only
Access: `Bash` tool with `ssh sons <cmd>` — no MCP needed
DB safety: never DROP TABLE / DROP DATABASE / TRUNCATE on this server
