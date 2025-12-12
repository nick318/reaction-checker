# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Type-check with TypeScript and build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Tech Stack

- React 19 with TypeScript
- Vite 7 as build tool
- React Compiler enabled via babel-plugin-react-compiler (configured in vite.config.ts)
- ESLint with typescript-eslint, react-hooks, and react-refresh plugins

## Project Structure

- `src/main.tsx` - Application entry point, renders App in StrictMode
- `src/App.tsx` - Root component
- TypeScript config split into `tsconfig.app.json` (app code) and `tsconfig.node.json` (tooling)
