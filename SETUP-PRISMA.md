### 1. Install prisma

```
$ pnpm install prisma --save-dev
$ pnpx prisma init
```


### 2. Make db file in lib folder

```bash
/lib/db.ts

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

```

### 3. Make the Model

ex:

```bash
/prisma/schema.prisma

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 4. generate client and update the database

```bash
$ pnpx prisma generate
$ pnpx prisma db push
```
