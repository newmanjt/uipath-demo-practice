// Canonical public content shared by the conversational skill and the optional CLI adapter.
export const VERIFIED_AS_OF = '2026-08-12';

export const sources = [
  { id: 'agentic-platform', title: 'UiPath Platform for agentic automation', url: 'https://www.uipath.com/platform/agentic-automation', checked: VERIFIED_AS_OF },
  { id: 'agents-about', title: 'About UiPath Agents', url: 'https://docs.uipath.com/agents/automation-cloud/latest/user-guide/about-agents', checked: VERIFIED_AS_OF },
  { id: 'maestro-ga', title: 'UiPath Maestro general availability', url: 'https://docs.uipath.com/maestro/automation-cloud/latest/release-notes/april-2025', checked: VERIFIED_AS_OF },
  { id: 'maestro-case-reference', title: 'Maestro Case component dictionary', url: 'https://docs.uipath.com/maestro/automation-cloud/latest/user-guide/maestro-case-management-component-dictionary', checked: VERIFIED_AS_OF },
  { id: 'maestro-case-sla', title: 'Maestro Case SLAs and automated escalation rules', url: 'https://docs.uipath.com/maestro/automation-cloud/latest/user-guide/how-to-set-slas-and-automated-escalation-rules', checked: VERIFIED_AS_OF },
  { id: 'ixp', title: 'Introduction to UiPath IXP', url: 'https://docs.uipath.com/ixp/automation-cloud/latest/user-guide/introduction', checked: VERIFIED_AS_OF },
  { id: 'ixp-availability', title: 'UiPath IXP access and availability', url: 'https://docs.uipath.com/ixp/automation-cloud/latest/user-guide/faq-access-and-availability', checked: VERIFIED_AS_OF },
  { id: 'screenplay-ga', title: 'UiPath ScreenPlay general availability', url: 'https://docs.uipath.com/agents/automation-cloud/latest/release-notes-screenplay/november-2025', checked: VERIFIED_AS_OF },
  { id: 'studio', title: 'UiPath Studio', url: 'https://www.uipath.com/product/studio', checked: VERIFIED_AS_OF },
  { id: 'studio-coded', title: 'UiPath Studio coded automations', url: 'https://docs.uipath.com/studio/standalone/latest/user-guide/coded-automations-introduction', checked: VERIFIED_AS_OF },
  { id: 'autopilot', title: 'UiPath Autopilot', url: 'https://www.uipath.com/product/autopilot', checked: VERIFIED_AS_OF },
  { id: 'document-understanding', title: 'About Document Understanding', url: 'https://docs.uipath.com/document-understanding/automation-cloud/latest/user-guide/about-document-understanding', checked: VERIFIED_AS_OF },
  { id: 'test-cloud', title: 'UiPath Test Cloud', url: 'https://www.uipath.com/product/test-cloud', checked: VERIFIED_AS_OF },
  { id: 'test-manager', title: 'UiPath Test Manager capabilities', url: 'https://docs.uipath.com/automation-cloud/automation-cloud/latest/admin-guide/test-manager-capabilities-overview', checked: VERIFIED_AS_OF },
  { id: 'cloud-robots', title: 'Automation Cloud Robots', url: 'https://www.uipath.com/product/automation-cloud-robots', checked: VERIFIED_AS_OF },
  { id: 'robots', title: 'UiPath Robots', url: 'https://www.uipath.com/product/robots', checked: VERIFIED_AS_OF },
  { id: 'api', title: 'UiPath API automation', url: 'https://www.uipath.com/platform/agentic-automation/api-automation', checked: VERIFIED_AS_OF },
  { id: 'api-workflows', title: 'UiPath API workflows', url: 'https://docs.uipath.com/agents/automation-cloud/latest/user-guide/api-workflows', checked: VERIFIED_AS_OF },
  { id: 'orchestrator-queues', title: 'Orchestrator queues and transactions', url: 'https://docs.uipath.com/orchestrator/automation-cloud/latest/user-guide/about-queues-and-transactions', checked: VERIFIED_AS_OF },
  { id: 'orchestrator-assets', title: 'Orchestrator assets', url: 'https://docs.uipath.com/orchestrator/automation-cloud/latest/user-guide/about-assets', checked: VERIFIED_AS_OF },
  { id: 'process-intelligence', title: 'UiPath Process Intelligence', url: 'https://www.uipath.com/product/maestro/process-intelligence', checked: VERIFIED_AS_OF },
  { id: 'action-center', title: 'UiPath Action Center', url: 'https://www.uipath.com/product/action-center', checked: VERIFIED_AS_OF },
  { id: 'apps', title: 'UiPath Apps', url: 'https://www.uipath.com/product/apps', checked: VERIFIED_AS_OF },
  { id: 'data-fabric', title: 'UiPath Data Fabric', url: 'https://www.uipath.com/product/data-fabric', checked: VERIFIED_AS_OF },
  { id: 'insights', title: 'UiPath Insights', url: 'https://www.uipath.com/product/rpa-insights', checked: VERIFIED_AS_OF }
];

const product = (id, name, status, summary, bestFor, facts, sourceIds, quiz) =>
  ({ id, name, status, summary, bestFor, facts, sourceIds, quiz });

export const products = [
  product('agents', 'UiPath Agents and Agent Builder', 'GA',
    'Build, evaluate, deploy, and govern agents that reason and use tools inside enterprise processes.',
    'Judgment-heavy work with bounded autonomy, tools, evaluations, and human escalation.',
    ['Agents are designed for dynamic work that benefits from judgment and contextual awareness.', 'Agents complement deterministic robots and can collaborate with people in governed processes.', 'Use bounded tools, evaluation, and human escalation where outcomes require review.'],
    ['agents-about', 'agentic-platform'],
    { q: 'Which control best supports production confidence for an agent?', options: ['Prompt evaluations and coverage', 'Removing human escalation', 'Giving every tool admin rights'], answer: 0, why: 'Evaluation sets and prompt coverage make expected behavior observable; least privilege and escalation remain important.' }),
  product('maestro', 'UiPath Maestro', 'GA',
    'Orchestrates long-running end-to-end work across agents, robots, systems, documents, and people.',
    'Durable, multi-step processes that require coordination, visibility, and governance.',
    ['Uses BPMN for process modeling.', 'Coordinates hybrid work across agents, robots, APIs, and people.', 'Provides process-level monitoring and traceability.'],
    ['agentic-platform', 'maestro-ga'],
    { q: 'When is Maestro the strongest fit?', options: ['A single local keystroke macro', 'A long-running process spanning agents, robots, systems, and people', 'Only storing PDF files'], answer: 1, why: 'Maestro is the orchestration layer for durable, cross-system and human-in-the-loop processes.' }),
  product('maestro-case', 'Maestro Case', 'GA',
    'Case orchestration for non-linear, document-heavy work with stages, milestones, SLAs, agents, and audit trails.',
    'Claims, disputes, loans, referrals, and other work whose next step depends on case context.',
    ['Current official documentation lists Maestro Case as generally available.', 'Case- and stage-level SLAs can emit at-risk and breach events that drive notification, reassignment, or priority actions.', 'Case App views expose SLA state while Case Instance Management supports governed runtime intervention.'],
    ['maestro-case-reference', 'maestro-case-sla'],
    { q: 'Which workload is best framed as a case?', options: ['A fixed nightly file copy', 'A dispute whose stages vary with evidence and judgment', 'A one-cell spreadsheet formula'], answer: 1, why: 'Cases are adaptive and milestone-driven rather than a fixed straight-through workflow.' }),
  product('screenplay', 'UiPath ScreenPlay', 'GA',
    'A runtime automation agent that turns natural-language intent into autonomous, resilient UI actions.',
    'Complex UI work where context and interface changes make rigid interaction brittle.',
    ['ScreenPlay plans and executes multi-step UI interaction.', 'It adapts to UI changes and uses contextual understanding.', 'It complements rather than erases the need for deterministic automation choices.'],
    ['screenplay-ga'],
    { q: 'What differentiates ScreenPlay?', options: ['It only stores selectors', 'It interprets intent and adapts UI actions contextually', 'It is a database service'], answer: 1, why: 'ScreenPlay translates intent into multi-step UI actions and adapts to interface context.' }),
  product('studio', 'UiPath Studio and Studio Web', 'GA',
    'Unified low-code and coded development for UI, API, agentic, testing, and orchestration projects.',
    'Building, debugging, testing, packaging, and deploying automations with the right developer experience.',
    ['Studio supports visual low-code workflows and C# coded automations.', 'Coded workflows can interoperate with visual workflows.', 'Choose the development style and runtime based on workload and team skills.'],
    ['studio', 'studio-coded'],
    { q: 'What should drive a Studio project choice?', options: ['Workload, runtime, governance, and team skills', 'Whichever icon is newest', 'Avoiding all testing'], answer: 0, why: 'The delivery context and operational requirements determine the appropriate project and runtime.' }),
  product('autopilot', 'UiPath Autopilot', 'GA',
    'Natural-language assistance across the automation lifecycle for building, operating, and troubleshooting.',
    'Accelerating practitioner productivity while keeping people responsible for review and outcomes.',
    ['Autopilot is native across multiple UiPath experiences.', 'It accelerates creation and operations rather than serving as the orchestration runtime itself.'],
    ['autopilot'],
    { q: 'How does Autopilot differ from Maestro?', options: ['Autopilot assists users; Maestro orchestrates end-to-end work', 'They are identical names', 'Maestro is only a chat window'], answer: 0, why: 'Autopilot is an AI assistant; Maestro coordinates durable business processes.' }),
  product('ixp', 'UiPath IXP', 'GA',
    'Intelligent Xtraction and Processing converts unstructured documents and communications into structured data.',
    'Communications, complex unstructured documents, and access to structured/semi-structured document processing.',
    ['IXP covers communications data plus structured, semi-structured, unstructured, and complex documents.', 'Document Understanding remains a standalone service but is accessible through IXP.', 'The right capability depends on content type and variability.'],
    ['ixp', 'ixp-availability'],
    { q: 'Which input is a natural IXP fit?', options: ['Contracts and customer emails needing structured extraction', 'A CPU temperature sensor only', 'A static color palette'], answer: 0, why: 'IXP targets multimodal extraction from documents and communications.' }),
  product('document-understanding', 'Document Understanding', 'GA',
    'Digitizes, classifies, extracts, and validates data from structured and semi-structured documents.',
    'Invoices, forms, purchase orders, and document workflows requiring confidence and validation.',
    ['Document Understanding combines RPA and AI to classify, extract, and interpret document data.', 'It supports human-in-the-loop validation of extracted information.', 'Deployment availability depends on the selected UiPath platform.'],
    ['document-understanding'],
    { q: 'What belongs in a responsible document demo?', options: ['Confidence thresholds and exception validation', 'A claim of perfect extraction', 'Hiding low-confidence results'], answer: 0, why: 'Production document processing needs explicit quality and human-validation design.' }),
  product('integration-service', 'Integration Service and API Workflows', 'GA',
    'Connectors, triggers, and reusable API-first workflows connect agents, robots, and systems.',
    'System-to-system work where APIs are more robust and efficient than UI interaction.',
    ['API Workflows provide serverless, request-and-response integrations for deterministic system actions.', 'Integration Service connectors provide governed access to external systems.', 'Use least-privilege connections and distinguish API from UI fit.'],
    ['api', 'api-workflows'],
    { q: 'When should an API workflow usually be preferred?', options: ['When a supported API can perform the system action reliably', 'Whenever no authentication exists', 'Only for screen scraping'], answer: 0, why: 'APIs are typically the robust choice for supported system-to-system execution.' }),
  product('orchestrator', 'UiPath Orchestrator', 'GA',
    'Deploys, schedules, monitors, governs, and manages automations, jobs, queues, machines, and assets.',
    'Central operational control, workload management, credentials, observability, and governance.',
    ['Queues support transaction-oriented workloads and can start RPA or Maestro processes through triggers.', 'Assets provide shared values and governed credentials for automations.', 'Credentials and secrets should not be embedded in workflow source.'],
    ['orchestrator-queues', 'orchestrator-assets'],
    { q: 'Where should a reusable secret be managed?', options: ['Hard-coded in workflow text', 'A governed credential/connection mechanism', 'In a demo screenshot'], answer: 1, why: 'Credentials belong in governed secret and connection stores, not source or screenshots.' }),
  product('robots', 'UiPath Robots and Automation Cloud Robots', 'GA',
    'Attended, unattended, test, serverless, and VM robot options execute automations in suitable environments.',
    'Reliable task execution across desktops, back-office workloads, tests, and cloud-hosted capacity.',
    ['Serverless Automation Cloud Robots run cross-platform API and web automations on demand.', 'VM Automation Cloud Robots support Windows desktop applications.', 'Attended and unattended fit depends on human presence and process design.'],
    ['robots', 'cloud-robots'],
    { q: 'Which cloud robot fits a Windows desktop application?', options: ['VM Automation Cloud Robot', 'Serverless API-only assumption', 'No robot can run Windows apps'], answer: 0, why: 'VM Automation Cloud Robots provide Windows environments for desktop application automation.' }),
  product('test-cloud', 'UiPath Test Cloud', 'GA',
    'Enterprise SaaS for test design, automation, execution orchestration, management, analytics, and governance.',
    'End-to-end application and automation testing integrated with CI/CD and ALM practices.',
    ['Test Cloud supports test design, automation, execution, management, analytics, and governance.', 'Test Manager provides requirements traceability and result management.', 'Automated testing complements quality gates and human accountability.'],
    ['test-cloud', 'test-manager'],
    { q: 'What is a core Test Manager value?', options: ['Requirements traceability and test result management', 'Replacing production monitoring with guesses', 'Removing defect workflows'], answer: 0, why: 'Test Manager connects requirements, tests, execution results, and defects.' }),
  product('process-intelligence', 'Process Mining and Task Mining', 'GA',
    'Process intelligence reveals how system and desktop work actually flows to prioritize and improve automation.',
    'Finding variants, bottlenecks, root causes, and evidence-backed automation opportunities.',
    ['Process Mining analyzes event data across business processes.', 'Task Mining analyzes desktop work patterns.', 'Discovery evidence can inform Maestro orchestration and continuous improvement.'],
    ['process-intelligence'],
    { q: 'What should process intelligence do before solution design?', options: ['Reveal actual variants and bottlenecks', 'Assume the happy path is universal', 'Skip outcome measurement'], answer: 0, why: 'Observed process evidence reduces solution-design assumptions.' }),
  product('human-platform', 'Action Center, Apps, Data Fabric, and Insights', 'GA',
    'Human tasks, low-code experiences, governed data, and analytics complete end-to-end automation outcomes.',
    'Human-in-the-loop decisions, tailored front ends, shared business data, and outcome visibility.',
    ['Action Center supports human tasks and approvals.', 'Apps provides tailored low-code user experiences.', 'Data Fabric supplies governed business entities; Insights measures operational outcomes.'],
    ['action-center', 'apps', 'data-fabric', 'insights'],
    { q: 'Which component brings a human approval into automation?', options: ['Action Center', 'A hard-coded password', 'Task Mining alone'], answer: 0, why: 'Action Center is designed for human tasks and approvals in automated work.' })
];

export const personalities = [
  { id: 'skeptic', name: 'The Skeptic', icon: '?', style: 'Challenges claims and asks for proof.', opening: 'I have seen automation pilots overpromise. Prove this is different.', values: ['evidence', 'risk', 'pilot'], coach: 'Use qualified language, proof, and a bounded validation plan.' },
  { id: 'executive', name: 'The Outcome Executive', icon: '$', style: 'Interrupts detail and focuses on business results.', opening: 'Give me the outcome, economics, and time to value.', values: ['outcome', 'metric', 'value'], coach: 'Lead with measurable impact and keep architecture subordinate to the outcome.' },
  { id: 'technical', name: 'The Technical Evaluator', icon: '#', style: 'Tests architecture, security, and lifecycle depth.', opening: 'Show me how this is governed, integrated, and operated.', values: ['governance', 'integration', 'security'], coach: 'Be precise about boundaries, runtime, identity, observability, and status.' },
  { id: 'pragmatist', name: 'The Operations Pragmatist', icon: '!', style: 'Cares about exceptions, ownership, and day-two operations.', opening: 'The happy path is easy. What happens when it fails on Monday morning?', values: ['exception', 'owner', 'monitor'], coach: 'Narrate exception paths, ownership, support, and measurable operations.' },
  { id: 'innovator', name: 'The AI Innovator', icon: '*', style: 'Pushes for agents everywhere and the newest capability.', opening: 'Why not make the entire process autonomous with agents?', values: ['agent', 'guardrail', 'human'], coach: 'Match autonomy to uncertainty and risk; stay within documented generally available capabilities.' },
  { id: 'change-leader', name: 'The Change Leader', icon: '+', style: 'Focuses on adoption, people, trust, and operating-model impact.', opening: 'How will my people trust this and change how they work?', values: ['adoption', 'human', 'training'], coach: 'Connect the experience to roles, adoption measures, and human control.' }
];

export const roles = [
  { id: 'account-executive', name: 'Account Executive', objective: 'Earn agreement on value, stakeholders, and a concrete next step.', emphasis: ['value', 'metric', 'next step'] },
  { id: 'solution-consultant', name: 'Solution Consultant', objective: 'Map requirements to an accurate, credible demo architecture.', emphasis: ['requirement', 'product', 'architecture'] },
  { id: 'customer-success', name: 'Customer Success Manager', objective: 'Drive adoption, measurable outcomes, and a scalable operating model.', emphasis: ['adoption', 'outcome', 'governance'] }
];

export const difficulties = [
  { id: 'warm', name: 'Warm-up', threshold: 0.34, note: 'Buyer gives room to recover and signals what matters.' },
  { id: 'field', name: 'Field-ready', threshold: 0.5, note: 'Buyer expects concise discovery and accurate positioning.' },
  { id: 'pressure', name: 'Pressure test', threshold: 0.67, note: 'Buyer is impatient; weak claims and generic answers are challenged.' }
];

const scenario = (id, title, industry, customer, situation, stake, products, metrics, objection) =>
  ({ id, title, industry, customer, situation, stake, products, metrics, objection });

export const scenarios = [
  scenario('invoice-disputes', 'Resolve invoice disputes end to end', 'Manufacturing', 'VP Shared Services', 'Disputes arrive by email with invoices and contracts; analysts swivel between ERP, CRM, and mail.', 'Backlog is growing and priority customers wait days.', ['agents', 'maestro', 'ixp', 'integration-service'], ['resolution time', 'touchless rate', 'escalation accuracy'], 'Agents are unpredictable. Why should I trust one with customer disputes?'),
  scenario('claims-intake', 'Modernize insurance claims intake', 'Insurance', 'Chief Claims Officer', 'Claims mix forms, photos, adjuster notes, and judgment-heavy exceptions.', 'Slow intake hurts claimant experience and loss-adjustment expense.', ['maestro-case', 'ixp', 'document-understanding', 'human-platform'], ['cycle time', 'extraction accuracy', 'leakage'], 'Our claims never follow one neat workflow.'),
  scenario('sap-regression', 'Accelerate SAP regression testing', 'Consumer Goods', 'Head of Quality Engineering', 'Quarterly releases require broad SAP regression coverage with brittle legacy scripts.', 'Release delays and production defects are increasing.', ['test-cloud', 'studio', 'robots'], ['test coverage', 'execution time', 'escaped defects'], 'AI-generated tests sound risky for our core ERP.'),
  scenario('contact-center', 'Triage customer communications', 'Telecommunications', 'Contact Center VP', 'High-volume emails and tickets need intent, sentiment, routing, and suggested resolution.', 'Misroutes drive repeat contacts and SLA misses.', ['ixp', 'agents', 'maestro', 'human-platform'], ['first-contact resolution', 'routing precision', 'handle time'], 'How do you prevent a model from sending the wrong response?'),
  scenario('order-entry', 'Automate resilient order entry', 'Distribution', 'COO', 'Orders arrive in portals, PDFs, and spreadsheets and must enter a frequently changing legacy desktop app.', 'Manual entry creates delay and costly errors.', ['screenplay', 'document-understanding', 'robots', 'orchestrator'], ['order cycle time', 'entry accuracy', 'exception rate'], 'Why use an AI UI agent instead of ordinary selectors?'),
  scenario('loan-origination', 'Orchestrate loan origination', 'Banking', 'Head of Lending Operations', 'Applications require documents, credit systems, policy decisions, exceptions, and human approvals.', 'Applicants abandon while cases stall between teams.', ['maestro-case', 'maestro', 'ixp', 'human-platform'], ['time to decision', 'abandonment', 'SLA attainment'], 'Regulators will not accept a black-box process.'),
  scenario('employee-onboarding', 'Coordinate global employee onboarding', 'Professional Services', 'CHRO', 'HR, IT, facilities, identity, and managers each own dependent onboarding work.', 'New hires arrive without access and managers chase status.', ['maestro', 'integration-service', 'human-platform', 'robots'], ['day-one readiness', 'handoff delay', 'completion SLA'], 'We already have workflows in several systems. Why add another layer?'),
  scenario('process-discovery', 'Find the right automation opportunities', 'Healthcare', 'Transformation Director', 'Leaders have anecdotes but no shared evidence about process variation and rework.', 'The automation backlog is political and ROI is inconsistent.', ['process-intelligence', 'maestro', 'human-platform'], ['variant reduction', 'throughput', 'validated pipeline value'], 'Mining data feels like a long analysis project before any value.'),
  scenario('agent-governance', 'Scale governed enterprise agents', 'Financial Services', 'Chief Risk Officer', 'Teams are prototyping agents in disconnected tools with uneven evaluation and access controls.', 'Shadow AI creates operational and compliance exposure.', ['agents', 'maestro', 'orchestrator', 'human-platform'], ['evaluation pass rate', 'escalation quality', 'audit coverage'], 'How is this more governed than letting teams call an LLM directly?'),
  scenario('api-modernization', 'Unify API and UI automation', 'Logistics', 'Enterprise Architect', 'Modern APIs and legacy screens coexist across shipment workflows.', 'Point integrations and bots are fragmented and hard to operate.', ['integration-service', 'studio', 'robots', 'maestro'], ['integration reuse', 'failure rate', 'change lead time'], 'Aren’t RPA and API integration competing approaches?'),
  scenario('desktop-claims', 'Make desktop automation resilient', 'Public Sector', 'Automation CoE Lead', 'Portal redesigns repeatedly break unattended eligibility checks.', 'Maintenance consumes the team and interrupts citizen service.', ['screenplay', 'robots', 'orchestrator', 'studio'], ['maintenance hours', 'success rate', 'recovery time'], 'Self-healing sounds like hiding failures.'),
  scenario('document-compliance', 'Review complex compliance documents', 'Pharmaceuticals', 'Compliance Operations VP', 'Teams read long protocols, correspondence, and reports to identify obligations and missing evidence.', 'Review backlogs delay submissions and increase compliance risk.', ['ixp', 'agents', 'human-platform', 'maestro'], ['review time', 'recall', 'human override rate'], 'Generative extraction could invent an obligation that is not there.'),
  scenario('citizen-services', 'Human-centered citizen service', 'Government', 'Digital Services Director', 'Residents submit forms and evidence; staff need accessible tasks, status, and exception handling.', 'Manual handoffs obscure status and create unequal service.', ['document-understanding', 'human-platform', 'maestro', 'robots'], ['completion time', 'accessibility', 'status transparency'], 'Automation cannot leave vulnerable residents behind.'),
  scenario('test-migration', 'Migrate from legacy test tooling', 'Retail', 'VP Engineering', 'Manual and legacy automated tests span web, mobile, APIs, and stores with weak traceability.', 'QA cost is high and release confidence is low.', ['test-cloud', 'studio', 'robots', 'orchestrator'], ['migration velocity', 'coverage', 'defect triage time'], 'Migration will disrupt releases and lock us into another suite.'),
  scenario('developer-experience', 'Bring automation to pro-code teams', 'Technology', 'Platform Engineering Director', 'Developers prefer coded and source-controlled delivery but must operate automation with shared governance.', 'Separate toolchains slow delivery and weaken standards.', ['studio', 'orchestrator', 'test-cloud', 'robots'], ['lead time', 'validation pass rate', 'reuse'], 'Will coded automation still fit our governance and operating model?'),
  scenario('supply-risk', 'Respond to supply-chain risk', 'Automotive', 'Chief Supply Chain Officer', 'Supplier messages, contracts, ERP events, and analyst judgment must converge quickly.', 'Late risk detection stops production and increases expedite cost.', ['ixp', 'agents', 'maestro', 'integration-service'], ['time to detect', 'time to mitigate', 'false-positive rate'], 'How does the system know when a human must take over?'),
  scenario('finance-close', 'Accelerate the financial close', 'Energy', 'Corporate Controller', 'Teams reconcile systems, spreadsheets, evidence, and approvals under a tight close calendar.', 'Manual follow-up extends close and audit preparation.', ['maestro', 'robots', 'integration-service', 'human-platform'], ['days to close', 'reconciliation exceptions', 'audit readiness'], 'I need deterministic controls, not an agent making journal entries.'),
  scenario('service-desk', 'Resolve service desk requests', 'Higher Education', 'CIO', 'Requests arrive through email and tickets; common fixes span identity, SaaS, and desktop tools.', 'Backlogs frustrate faculty and consume scarce staff.', ['ixp', 'agents', 'integration-service', 'screenplay'], ['resolution time', 'self-service rate', 'safe escalation'], 'An agent with IT tools could create a security incident.'),
  scenario('automation-ops', 'Operate automation at enterprise scale', 'Banking', 'Automation Platform Owner', 'Hundreds of automations have uneven standards, credentials, monitoring, and ownership.', 'Incidents and audit work grow faster than automation value.', ['orchestrator', 'human-platform', 'robots', 'studio'], ['success rate', 'mean time to recover', 'policy compliance'], 'Central governance will slow every delivery team.'),
  scenario('customer-360', 'Build a customer operations cockpit', 'Utilities', 'Customer Operations Director', 'Agents need a simple experience over fragmented billing, outage, CRM, and document data.', 'Swivel-chair work lengthens calls and creates inconsistent answers.', ['human-platform', 'integration-service', 'robots', 'agents'], ['handle time', 'first-contact resolution', 'adoption'], 'Another app means another screen for agents to learn.')
];

export const rubric = [
  { id: 'discovery', name: 'Discovery', weight: 20 },
  { id: 'value', name: 'Value articulation', weight: 20 },
  { id: 'product', name: 'Product accuracy', weight: 20 },
  { id: 'objection', name: 'Objection handling', weight: 15 },
  { id: 'adaptability', name: 'Buyer adaptability', weight: 10 },
  { id: 'nextStep', name: 'Next-step quality', weight: 15 }
];
