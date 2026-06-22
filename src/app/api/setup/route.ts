import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"

const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author TEXT DEFAULT 'Meg Dev',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    technologies JSONB DEFAULT '[]',
    project_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT DEFAULT 'beklemede',
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS project_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );
`

export async function GET() {
  try {
    const result = await adminRequest(
      `migration_run_sql($sql: String!) { migration_run_sql(sql: $sql) }`,
      { sql: CREATE_TABLES }
    )
    return NextResponse.json({ success: true, result })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
