# Dr. Reach Healthcare Platform

A modern healthcare platform connecting patients with medical professionals through both virtual and in-person consultations.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Package Manager: Yarn
- State Management: Zustand
- UI Components: Shadcn/ui
- Authentication: NextAuth.js
- Form Validation: Zod
- Animations: Framer Motion

## Development Guidelines

1. Always maintain TypeScript type safety
2. Use existing UI components from /components/ui
3. Follow established folder structure and naming conventions
4. Include dark mode support in all new features
5. Ensure responsive design across all screen sizes
6. Write clean, maintainable code with proper comments
7. Use yarn for package management
8. **Important:** Always fix all errors in a file before moving on to other files
9. Run error checks after making changes and resolve any issues immediately

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
