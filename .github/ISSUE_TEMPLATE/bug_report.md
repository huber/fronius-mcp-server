---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: ['bug', 'triage']
assignees: ''

---

## Bug Description
A clear and concise description of what the bug is.

## Environment
- **OS**: [e.g. macOS 14.0, Windows 11, Ubuntu 22.04]
- **Node.js version**: [e.g. 24.0.0]
- **Docker version**: [e.g. 24.0.0] (if using Docker)
- **Fronius device model**: [e.g. Fronius Symo 8.2-3-M]
- **Fronius firmware version**: [if known]

## Fronius Configuration
- **FRONIUS_HOST**: [e.g. fronius-inverter.local, 192.168.1.100]
- **FRONIUS_PROTOCOL**: [http/https]
- **FRONIUS_PORT**: [e.g. 80, 443]

## Steps to Reproduce
1. Go to '...'
2. Run command '...'
3. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Error Messages
```
Paste any error messages or logs here
```

## Claude Desktop Config (if applicable)
```json
{
  "mcpServers": {
    "fronius-solar": {
      // Your config here
    }
  }
}
```

## Additional Context
Add any other context about the problem here.

## Checklist
- [ ] I have read the troubleshooting section in the README
- [ ] I have tested the connection using `npm run test-connection`
- [ ] I have verified my Fronius device is reachable via browser
- [ ] I have checked the Docker container logs (if using Docker)