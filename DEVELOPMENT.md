# Development Guide

This guide will help you get started with developing Drawnix locally.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/plait-board/drawnix.git
   cd drawnix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200` to see the application.

## Project Structure

```
drawnix/
├── apps/
│   ├── web/                 # Main web application
│   └── web-e2e/            # End-to-end tests
├── packages/
│   ├── drawnix/             # Core drawnix package
│   ├── react-board/         # React board components
│   └── react-text/          # Text rendering components
├── scripts/                 # Build and deployment scripts
└── dist/                    # Build output
```

## Available Scripts

- `npm run start` - Start development server
- `npm run build` - Build all packages
- `npm run build:web` - Build web application only
- `npm run lint` - Run ESLint on all packages
- `npm run test` - Run tests
- `npm run release` - Release new version

## Development Tips

### Hotkey Shortcuts

The application supports various keyboard shortcuts for better user experience:

- `Ctrl/Cmd + S` - Save as JSON
- `Ctrl/Cmd + Shift + E` - Export as image
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + U` - Add image
- `Ctrl/Cmd + Backspace/Delete` - Clear canvas

### Tool Shortcuts

- `H` - Hand tool
- `V` - Selection tool
- `M` - Mind map tool
- `E` - Eraser tool
- `P` - Pen tool
- `A` - Arrow tool
- `R` - Rectangle tool
- `O` - Oval tool
- `T` - Text tool

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Run linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write tests for new features
- Follow existing naming conventions

## Testing

Run the test suite:
```bash
npm run test
```

Run end-to-end tests:
```bash
npm run e2e
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Docker Development

You can also run the application using Docker:

```bash
docker pull pubuzhixing/drawnix:latest
docker run -p 4200:4200 pubuzhixing/drawnix:latest
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `apps/web/vite.config.ts`
   - Or kill the process using the port

2. **Dependencies not installing**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Build errors**
   - Check TypeScript errors: `npx tsc --noEmit`
   - Run linting: `npm run lint`
   - Check for missing dependencies

### Getting Help

- Check existing [Issues](https://github.com/plait-board/drawnix/issues)
- Create a new issue if your problem isn't already reported
- Join discussions in the repository

## Architecture

Drawnix is built on top of the Plait framework and uses a plugin-based architecture:

- **Core**: Base drawing functionality
- **Plugins**: Extensible features (mind maps, freehand drawing, etc.)
- **React Components**: UI layer built with React
- **Slate**: Rich text editing capabilities

This architecture allows for:
- Multiple UI framework support (Angular, React)
- Integration with different rich text frameworks
- Fine-grained reusable plugins
- Extensible drawing board applications

## Performance Tips

- Use React.memo for expensive components
- Implement virtual scrolling for large canvases
- Optimize image loading and caching
- Use Web Workers for heavy computations
- Implement proper cleanup in useEffect hooks

---

Happy coding! 🎨
