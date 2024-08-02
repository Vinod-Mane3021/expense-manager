
![Dashboard](./public/spanshots/app_image.png)

# <img src="./public/expense_manager_logo.png" alt="Expense Manager Logo" style="width: 25px; height: auto; margin-bottom: -2px"/> <span style="font-family: 'Georgia', serif; font-weight: bold; font-size: 1em; color: #FFE5CA;">Expense Manager</span>



<i>**A comprehensive platform to track, manage, and optimize your finances.**</i>


This application is a comprehensive Finance SaaS Platform developed using a modern web technology stack. It leverages Next.js for the frontend, Hono.js for the backend API, Prisma ORM for database interactions, and Neon Database for data storage. The platform also integrates Clerk for secure user authentication. This project was developed primarily for educational purposes, showcasing a wide array of features and technologies.



## 📚 Table of Contents

1. [✨ Features](#-features)
2. [🧑‍💻 Tech Stack](#-tech-stack)
3. [🔧 Local Setup](#-local-setup)
7. [📄 Feedback](#-feedback)
8. [📸 Screenshots](#-screenshots)

<!-- 4. [📝 Contributing](#-contributing) -->
<!-- 5. [📄 License](#-license) -->
<!-- 6. [📬 Contact](#-contact) -->

## ✨ Features

- **📊 Interactive Financial Dashboard**: Visualize your financial data with dynamic charts and graphs.
- **🔁 Changeable Chart Types**: Switch between different chart types for better insights.
- **🗓 Account and Date Filters**: Filter transactions by account and date range.
- **💹 Detailed Transactions Table**: View and manage all your transactions in a comprehensive table.
- **➕ Form to Add Transactions**: Easily add new transactions through a user-friendly form.
- **🧩 Customizable Select Components**: Tailor your selection options to fit your needs.
- **💵 Income and Expense Toggle**: Switch between viewing income and expenses.
- **🔄 CSV Transaction Imports**: Import transactions via CSV files for quick data entry.
- **🔥 API via Hono.js**: Robust API built with Hono.js.
- **🪝 State Management via Tanstack React Query**: Efficient state management for data fetching and caching.
- **🔗 Bank Account Connections with Plaid**: Connect to your bank accounts securely using Plaid.
- **💳 Premium Upgrades via Lemon Squeezy**: Monetize your product with premium features.
- **🔐 Authentication via Clerk (Core 2)**: Secure authentication with Clerk.
- **🗑️ Bulk Delete and Search in Transactions**: Manage transactions with bulk delete and search functionality.
- **🏦 Bank Disconnection and Subscription Management**: Easily manage bank connections and subscriptions.
- **👤 User Settings Customization**: Personalize user settings for a better experience.
- **🌐 Built with Next.js 14**: Utilizing the latest features of Next.js.
- **🎨 Styled with TailwindCSS and Shadcn UI**: Modern and responsive styling.
- **💾 PostgreSQL & Drizzle ORM**: Reliable data storage and ORM.
- **🚀 Deployed on Vercel**: Fast and scalable deployment on Vercel.



## 🧑‍💻 Tech Stack

- ⚛️ [React](https://reactjs.org/): UI library for building user interfaces.
- ⬜ [Next.js](https://nextjs.org/): React framework for server-side rendering and static site generation.
- 💨 [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
- 💎 [Shadcn UI](https://shadcn.dev/): UI components for React with a focus on accessibility.
- <span style="background-color:#1e90ff;color:white;padding:1px 3px;border-radius:3px;font-size:0.7em;margin-left:3px;">TS</span> [TypeScript](https://www.typescriptlang.org/): Superset of JavaScript adding static types.

- 🔥 [Hono.js](https://honojs.dev/): High-performance web framework for building APIs.
- 🛠️ [Zod](https://zod.dev/): Schema validation for TypeScript and JavaScript.
- 🐻 [Zustand](https://zustand-demo.pmnd.rs/): Lightweight state management for React.
- 🟪 [Prisma](https://www.prisma.io/): ORM for TypeScript and Node.js with a focus on type safety.
- 🔐 [Clerk](https://clerk.dev/): Authentication and user management.

- 🌐 [Neon Database](https://neon.tech/): Serverless PostgreSQL database.
- 🐘 [PostgreSQL](https://www.postgresql.org/): Open-source relational database system.

- 🎣 [Tanstack React Query](https://react-query.tanstack.com/): Data fetching and synchronization for React.

- 💳 [Lemon Squeezy](https://www.lemonsqueezy.com/): Payment processing and subscription management.

- 🔗 [Plaid](https://plaid.com/): Connects applications to bank accounts for financial data.
  
- 🚀 [Vercel](https://vercel.com/): Platform for frontend deployment and serverless functions.




## ⚙️ Local setup

1. Clone this repository:
    ```bash
    git clone https://github.com/Vinod-Mane3021/expense-manager.git
    ```

2. Configuring the `.env` File

    - First, create a new `.env.local` file in the root directory of your project by copying the example file:
    ```bash
    cp .env.local.example .env.local
    ```

   - Open the `.env.local` file in your code editor and update the following environment variables:
   ```bash
    # auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    # redirect path
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    # postgres database
    DATABASE_URL=your_postgres_database_url

    NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
    - Replace the placeholders with your actual values:
        
        `your_clerk_publishable_key`: Obtain this key from your Clerk dashboard.

        `your_clerk_secret_key`: Obtain this key from your Clerk dashboard.

        `your_postgres_database_url`: Your PostgreSQL database connection string.

    - After updating the values, save the `.env.local` file.



2. Install dependencies:
    ```bash
    pnpm install
    ```

4. Start the development server:
    ```bash
    pnpm run dev
    ```



<!-- 

## 📝 Contributing

If you’d like to contribute to this project, please fork the repository and submit a pull request with your changes. For more details, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. -->

## ****📄 Feedback****

I'd be happy to connect with you! <br>

<a href="https://www.linkedin.com/in/vinod-mane-a74817220/" target="_blank">
  <img style="border-radius: 3px;" src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"  target="_blank">
</a> 
<a href="https://twitter.com/your_twitter_handle" target="_blank">
  <img height="27" src="https://img.shields.io/twitter/follow/VinodMane21?logoSize=100" alt="Twitter Badge" />
</a>



## 📸 Screenshots
<!-- - ![Dashboard](./public/app_image.png) -->
- ![Transaction Form](./public/spanshots/transaction_page.png)

- ![Settings](./public/spanshots/account_page.png)

- ![Reports](./public/spanshots/category_page.png)




