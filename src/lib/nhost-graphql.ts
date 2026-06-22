export const CREATE_BLOG = `mutation CreateBlog($title: String!, $slug: String!, $content: String!, $excerpt: String, $imageUrl: String, $author: String, $published: Boolean) {
  insert_blog_posts_one(object: {
    title: $title, slug: $slug, content: $content,
    excerpt: $excerpt, image_url: $imageUrl,
    author: $author, published: $published
  }) {
    id created_at
  }
}`

export const UPDATE_BLOG = `mutation UpdateBlog($id: uuid!, $title: String, $slug: String, $content: String, $excerpt: String, $imageUrl: String, $author: String, $published: Boolean) {
  update_blog_posts_by_pk(pk_columns: {id: $id}, _set: {
    title: $title, slug: $slug, content: $content,
    excerpt: $excerpt, image_url: $imageUrl,
    author: $author, published: $published
  }) { id }
}`

export const DELETE_BLOG = `mutation DeleteBlog($id: uuid!) {
  delete_blog_posts_by_pk(id: $id) { id }
}`

export const GET_BLOGS = `query GetBlogs {
  blog_posts(order_by: {created_at: desc}) {
    id title slug excerpt image_url author published created_at
  }
}`

export const GET_BLOG = `query GetBlog($id: uuid!) {
  blog_posts_by_pk(id: $id) { id title slug content excerpt image_url author published created_at }
}`

export const CREATE_PORTFOLIO = `mutation CreatePortfolio($title: String!, $slug: String!, $description: String!, $imageUrl: String, $category: String, $technologies: jsonb, $projectUrl: String, $featured: Boolean) {
  insert_portfolio_projects_one(object: {
    title: $title, slug: $slug, description: $description,
    image_url: $imageUrl, category: $category,
    technologies: $technologies, project_url: $projectUrl, featured: $featured
  }) { id created_at }
}`

export const UPDATE_PORTFOLIO = `mutation UpdatePortfolio($id: uuid!, $title: String, $slug: String, $description: String, $imageUrl: String, $category: String, $technologies: jsonb, $projectUrl: String, $featured: Boolean) {
  update_portfolio_projects_by_pk(pk_columns: {id: $id}, _set: {
    title: $title, slug: $slug, description: $description,
    image_url: $imageUrl, category: $category,
    technologies: $technologies, project_url: $projectUrl, featured: $featured
  }) { id }
}`

export const DELETE_PORTFOLIO = `mutation DeletePortfolio($id: uuid!) {
  delete_portfolio_projects_by_pk(id: $id) { id }
}`

export const GET_PORTFOLIOS = `query GetPortfolios {
  portfolio_projects(order_by: {created_at: desc}) {
    id title slug description image_url category technologies project_url featured created_at
  }
}`

export const GET_PORTFOLIO = `query GetPortfolio($id: uuid!) {
  portfolio_projects_by_pk(id: $id) { id title slug description image_url category technologies project_url featured created_at }
}`

export const GET_MESSAGES = `query GetMessages {
  contact_messages(order_by: {created_at: desc}) {
    id name email phone subject message read created_at
  }
}`

export const MARK_MESSAGE_READ = `mutation MarkRead($id: uuid!) {
  update_contact_messages_by_pk(pk_columns: {id: $id}, _set: {read: true}) { id }
}`

export const DELETE_MESSAGE = `mutation DeleteMessage($id: uuid!) {
  delete_contact_messages_by_pk(id: $id) { id }
}`

export const INSERT_MESSAGE = `mutation InsertMessage($name: String!, $email: String!, $phone: String, $subject: String!, $message: String!) {
  insert_contact_messages_one(object: {
    name: $name, email: $email, phone: $phone, subject: $subject, message: $message
  }) { id }
}`

export const GET_PROJECTS = `query GetProjects {
  projects(order_by: {created_at: desc}) {
    id title description customer_name customer_email customer_phone status token created_at updated_at
  }
}`

export const GET_PROJECT = `query GetProject($id: uuid!) {
  projects_by_pk(id: $id) {
    id title description customer_name customer_email customer_phone status token created_at updated_at
  }
}`

export const CREATE_PROJECT = `mutation CreateProject($title: String!, $description: String, $customerName: String!, $customerEmail: String!, $customerPhone: String, $status: String, $token: String!) {
  insert_projects_one(object: {
    title: $title, description: $description,
    customer_name: $customerName, customer_email: $customerEmail,
    customer_phone: $customerPhone, status: $status, token: $token
  }) { id token created_at }
}`

export const UPDATE_PROJECT = `mutation UpdateProject($id: uuid!, $title: String, $description: String, $status: String, $customerName: String, $customerEmail: String, $customerPhone: String) {
  update_projects_by_pk(pk_columns: {id: $id}, _set: {
    title: $title, description: $description, status: $status,
    customer_name: $customerName, customer_email: $customerEmail, customer_phone: $customerPhone,
    updated_at: now
  }) { id }
}`

export const DELETE_PROJECT = `mutation DeleteProject($id: uuid!) {
  delete_projects_by_pk(id: $id) { id }
}`

export const GET_PROJECT_BY_TOKEN = `query GetProjectByToken($token: String!) {
  projects(where: {token: {_eq: $token}}) {
    id title description customer_name customer_email customer_phone status created_at updated_at
  }
}`

export const GET_PROJECT_MESSAGES = `query GetProjectMessages($projectId: uuid!) {
  project_messages(where: {project_id: {_eq: $projectId}}, order_by: {created_at: asc}) {
    id sender message created_at
  }
}`

export const CREATE_PROJECT_MESSAGE = `mutation CreateProjectMessage($projectId: uuid!, $sender: String!, $message: String!) {
  insert_project_messages_one(object: {
    project_id: $projectId, sender: $sender, message: $message
  }) { id created_at }
}`
