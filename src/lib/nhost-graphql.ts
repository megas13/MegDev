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

export const GET_NDA_ACCEPTANCE = `query GetNdaAcceptance($projectId: uuid!) {
  nda_acceptances(where: {project_id: {_eq: $projectId}}, limit: 1) {
    id accepted_at contract_version contract_hash customer_name customer_email
  }
}`

export const GET_NDA_VERIFICATION = `query GetNdaVerification($projectId: uuid!) {
  nda_verification_codes_by_pk(project_id: $projectId) {
    project_id code_hash expires_at attempts last_sent_at
  }
}`

export const UPSERT_NDA_VERIFICATION = `mutation UpsertNdaVerification($projectId: uuid!, $codeHash: String!, $expiresAt: timestamptz!, $lastSentAt: timestamptz!) {
  insert_nda_verification_codes_one(
    object: {project_id: $projectId, code_hash: $codeHash, expires_at: $expiresAt, attempts: 0, last_sent_at: $lastSentAt}
    on_conflict: {constraint: nda_verification_codes_pkey, update_columns: [code_hash, expires_at, attempts, last_sent_at]}
  ) { project_id }
}`

export const INCREMENT_NDA_ATTEMPTS = `mutation IncrementNdaAttempts($projectId: uuid!) {
  update_nda_verification_codes_by_pk(pk_columns: {project_id: $projectId}, _inc: {attempts: 1}) {
    attempts
  }
}`

export const ACCEPT_NDA = `mutation AcceptNda($object: nda_acceptances_insert_input!) {
  insert_nda_acceptances_one(object: $object) {
    id accepted_at contract_version contract_hash
  }
}`

export const DELETE_NDA_VERIFICATION = `mutation DeleteNdaVerification($projectId: uuid!) {
  delete_nda_verification_codes_by_pk(project_id: $projectId) { project_id }
}`

export const GET_ADMIN_NDA_OVERVIEW = `query GetAdminNdaOverview {
  projects(order_by: {created_at: desc}) {
    id title customer_name customer_email customer_phone token created_at
  }
  nda_acceptances(order_by: {accepted_at: desc}) {
    id project_id customer_name customer_email customer_phone
    contract_version contract_hash contract_text accepted_at
    accepted_ip user_agent email_verified
  }
}`

export const GET_REFERRAL_CONTRACTS = `query GetReferralContracts {
  referral_contracts(order_by: {created_at: desc}) {
    id token status provider_name provider_address provider_tax_no
    representative_name representative_email representative_phone
    scope commission_type commission_value currency start_date end_date
    payment_terms special_terms contract_version contract_hash contract_text
    accepted_at accepted_ip accepted_user_agent email_verified
    termination_effective_date termination_reason termination_settlement
    termination_version termination_hash termination_text termination_requested_at
    termination_accepted_at termination_ip termination_user_agent created_at updated_at
  }
}`

export const GET_REFERRAL_CONTRACT_BY_TOKEN = `query GetReferralContractByToken($token: String!) {
  referral_contracts(where: {token: {_eq: $token}}, limit: 1) {
    id token status provider_name provider_address provider_tax_no
    representative_name representative_email representative_phone
    scope commission_type commission_value currency start_date end_date
    payment_terms special_terms contract_version contract_hash contract_text
    accepted_at email_verified termination_effective_date termination_reason
    termination_settlement termination_version termination_hash termination_text
    termination_requested_at termination_accepted_at created_at
  }
}`

export const CREATE_REFERRAL_CONTRACT = `mutation CreateReferralContract($object: referral_contracts_insert_input!) {
  insert_referral_contracts_one(object: $object) { id token status created_at }
}`

export const GET_REFERRAL_VERIFICATION = `query GetReferralVerification($contractId: uuid!) {
  referral_verification_codes_by_pk(contract_id: $contractId) {
    contract_id purpose code_hash expires_at attempts last_sent_at
  }
}`

export const UPSERT_REFERRAL_VERIFICATION = `mutation UpsertReferralVerification($object: referral_verification_codes_insert_input!) {
  insert_referral_verification_codes_one(
    object: $object
    on_conflict: {constraint: referral_verification_codes_pkey, update_columns: [purpose, code_hash, expires_at, attempts, last_sent_at]}
  ) { contract_id }
}`

export const INCREMENT_REFERRAL_ATTEMPTS = `mutation IncrementReferralAttempts($contractId: uuid!) {
  update_referral_verification_codes_by_pk(pk_columns: {contract_id: $contractId}, _inc: {attempts: 1}) { attempts }
}`

export const DELETE_REFERRAL_VERIFICATION = `mutation DeleteReferralVerification($contractId: uuid!) {
  delete_referral_verification_codes_by_pk(contract_id: $contractId) { contract_id }
}`

export const UPDATE_REFERRAL_CONTRACT = `mutation UpdateReferralContract($id: uuid!, $changes: referral_contracts_set_input!) {
  update_referral_contracts_by_pk(pk_columns: {id: $id}, _set: $changes) {
    id token status accepted_at termination_requested_at termination_accepted_at updated_at
  }
}`
