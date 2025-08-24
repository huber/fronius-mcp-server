# Contributing to Fronius MCP Server

Thank you for your interest in contributing to the Fronius MCP Server! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/huber/fronius-mcp-server/issues)
2. If not, create a new issue using the bug report template
3. Provide detailed information including:
   - Fronius device model and firmware version
   - Your environment (OS, Node.js version, Docker version)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages and logs

### Requesting Features

1. Check if the feature has already been requested in [Issues](https://github.com/huber/fronius-mcp-server/issues)
2. If not, create a new issue using the feature request template
3. Describe your use case and how the feature would benefit users
4. If applicable, reference Fronius API documentation

### Contributing Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes with descriptive messages
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request using our PR template

## Development Setup

### Prerequisites

- Node.js 20+ (we test with 20.x, 22.x, 24.x)
- npm or yarn
- Docker (for container testing)
- Access to a Fronius device (for testing)

### Local Development

```bash
# Clone your fork
git clone https://github.com/yourusername/fronius-mcp-server.git
cd fronius-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Test connection to Fronius device
FRONIUS_HOST=your-fronius-ip npm run test-connection
```

### Docker Development

```bash
# Build Docker image
npm run docker:build

# Test Docker image
npm run docker:test
```

## Testing

### Manual Testing

1. **Connection Testing**: Always test with a real Fronius device when possible
2. **API Coverage**: Test all relevant MCP tools and resources
3. **Error Handling**: Test with invalid configurations and network issues
4. **Docker Testing**: Verify container builds and runs correctly

### Fronius Device Testing

If you have access to a Fronius device:

```bash
# Set your Fronius device details
export FRONIUS_HOST=192.168.1.100
export FRONIUS_PROTOCOL=http  # or https
export FRONIUS_PORT=80        # or 443

# Test connection
npm run test-connection

# Test with Claude Desktop
# Configure Claude Desktop and test various queries
```

### Test Coverage

We aim to test:
- All API endpoints with real devices when possible
- Error handling and edge cases
- Docker container functionality
- Different Fronius device models and firmware versions

## Submitting Changes

### Pull Request Process

1. **Branch Naming**: Use descriptive names
   - `feature/add-battery-support`
   - `fix/connection-timeout`
   - `docs/update-installation`

2. **Commit Messages**: Use conventional commit format
   ```
   feat(api): add battery storage endpoint support
   fix(docker): resolve container startup timeout
   docs(readme): improve installation instructions
   ```

3. **Pull Request Requirements**:
   - Fill out the PR template completely
   - Ensure all CI checks pass
   - Include tests for new functionality
   - Update documentation as needed
   - Reference related issues

4. **Review Process**:
   - All PRs require review before merging
   - Address feedback promptly
   - Keep PRs focused and reasonably sized

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide proper type definitions
- Avoid `any` types when possible
- Use meaningful variable and function names

### Code Style

- Follow the existing ESLint configuration
- Use 2 spaces for indentation
- Add JSDoc comments for public APIs
- Keep functions focused and reasonably sized

### API Design

- Follow existing patterns for new MCP tools/resources
- Provide clear descriptions for tools and resources
- Handle errors gracefully with meaningful messages
- Support both system-wide and device-specific queries

### Docker

- Keep Docker images lean
- Use multi-stage builds when appropriate
- Follow security best practices
- Test on multiple architectures when possible

## Release Process

1. **Version Bumping**: Follow semantic versioning (SemVer)
   - `patch`: Bug fixes
   - `minor`: New features (backward compatible)
   - `major`: Breaking changes

2. **Release Preparation**:
   - Update CHANGELOG.md
   - Test thoroughly with multiple Fronius devices
   - Verify Docker build works
   - Update documentation if needed

3. **Release Creation**:
   - Create GitHub release with detailed notes
   - Docker images are automatically built and pushed
   - Release archives are automatically generated

## Getting Help

- **Questions**: Open a discussion or issue
- **Chat**: Consider joining our community discussions
- **Documentation**: Check the README and inline code comments

## Recognition

Contributors are recognized in:
- GitHub contributor statistics
- Release notes for significant contributions
- Special thanks for major features or bug fixes

Thank you for contributing to make Fronius MCP Server better! 🚀