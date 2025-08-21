# Agent Guidelines

## Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes type checking)
- `pnpm dlx shadcn-vue@latest add <component-name>` - Add a shadcn-vue style component


## Code Style

- **Framework**: Vue 3 with Composition API and TypeScript. Use `<script setup lang="ts">` syntax
- **Imports**: Use `@/*` aliases for src imports (configured in tsconfig.json)
- **Styling**: Tailwind CSS with shadcn-vue components
- **State**: Pinia for state management
- **Utilities**: Use `cn()` from `@/lib/utils` for class merging
- **Routing**: Vue Router with views in `src/views/`
- **Icon**: Import from `lucide-vue-next`
- **Testing**: You don't need to test as this is a very tiny project.
