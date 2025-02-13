# Requirement
- Node.js
- npm (Node Package Manager) หรือ yarn หรือ pnpm (ส่วนตัวเราใช้ npm)
- PostgreSQL + pgAdmin

# After clone project
- install dependencies
```bash
npm install
```

# Database update
- อัพเดต db เมื่อ db มีการเปลี่ยนแปลงโครงสร้าง
```bash
npx prisma migrate dev
```
- คำสั่งสำหรับเมื่อแก้ไข db -> เปลี่ยน schema
```bash
npx prisma migrate dev --name ชื่อ_migration
```

# Test
- Lern more: [Jest](https://jestjs.io/docs/getting-started)

# shadcn
- [shadcn](https://ui.shadcn.com/)
- ตัวอย่างการใช้ [Building Next.js Fullstack Blog with TypeScript, Shadcn/ui, MDX, Prisma and Vercel Postgres.](https://youtu.be/htgktwXYw6g?t=2498)

# Run project

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
