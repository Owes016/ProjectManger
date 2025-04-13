# ProjectPilot

A minimal personal project tracker app for solo developers and indie hackers. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Clean dashboard that lists all projects
- Detailed project pages with tech stack, GitHub and deployment links
- Task checklists for each project
- Project status tracking
- Authentication via Supabase
- Mobile-friendly dark-themed UI
- Fast and responsive

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database and authentication)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- Supabase account

### Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase project:
   - Create a new project on Supabase
   - Run the SQL queries from `supabase-schema.sql` in the SQL Editor
   - Enable Email authentication in Authentication settings
   - Copy your Supabase URL and anon key

4. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### User Credentials for Testing

To test the application, you need to create a user account in your Supabase Authentication dashboard or use the signup functionality if you've implemented it.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables (Supabase URL and anon key)
4. Deploy

## Project Structure

```
projectpilot/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── dashboard/       # Dashboard page
│   │   ├── login/           # Login page
│   │   ├── project/         # Project pages (new, [id])
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # Reusable UI components
│   ├── context/             # Context providers (Auth)
│   └── lib/                 # Utility functions and libs
│       └── supabase.ts      # Supabase client
├── public/                  # Static assets
├── .env.local               # Environment variables
├── supabase-schema.sql      # Database schema for Supabase
└── README.md                # Project documentation
```

## Future Enhancements

- Tagging system for technologies used
- Monthly calendar view for planning tasks and deadlines
- AI features for project suggestions and task automation
- Real-time collaboration features
- Support for file attachments

## License

MIT 