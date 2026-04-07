# Skill Registry — control-suscripciones

Generated: 2026-04-03

## User Skills

| Skill | Trigger |
|-------|---------|
| `branch-pr` | Creating a pull request, opening a PR, or preparing changes for review |
| `issue-creation` | Creating a GitHub issue, reporting a bug, or requesting a feature |
| `judgment-day` | User says "judgment day", "judgment-day", "dual review", "doble review", "juzgar", "que lo juzguen" |
| `skill-creator` | User asks to create a new skill, add agent instructions, or document patterns for AI |
| `go-testing` | Writing Go tests, using teatest, or adding test coverage *(not applicable to this stack)* |

## Compact Rules

### branch-pr
- Every PR MUST link an approved issue (use issue-creation first)
- Every PR MUST have exactly one `type:*` label
- Use conventional commit format for PR titles
- Automated checks must pass before merge

### issue-creation
- Create GitHub issues before starting any significant change
- Bug reports need: reproduction steps, expected vs actual behavior
- Feature requests need: motivation, acceptance criteria
- Issues must be approved before creating a PR

### judgment-day
- Launches two independent blind judge sub-agents simultaneously
- Synthesizes findings, applies fixes, re-judges until both pass
- Escalates after 2 iterations if not resolved
- Use before merging significant implementations

### skill-creator
- Creates new AI agent skills following the Agent Skills spec
- Writes SKILL.md with frontmatter triggers and compact rules

## Project Conventions

- **Architecture**: Clean/Hexagonal — domain → application → infrastructure → presentation
- **Components**: Standalone Angular components (no NgModules)
- **Routing**: Lazy `loadComponent` pattern
- **Styling**: Tailwind CSS v4 utility classes + PrimeNG component styles
- **Testing**: Vitest (not Karma/Jasmine)
- **Strict TypeScript**: All strict flags enabled
- **Formatting**: Prettier
