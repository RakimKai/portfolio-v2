export type Meta = {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  githubUrl: string;
  phone?: string;
  intro: string;
  year: string;
  siteUrl: string;
  description: string;
};

export type Role = {
  company: string;
  title: string;
  period: string;
  note?: string;
  body: string;
  figure?: { value: number; caption: string };
};

export type Media = {
  src?: string;
  alt: string;
  caption?: string;
  portrait?: boolean;
};

export type DeckChapter = {
  label: string;
  title: string;
  body: string[];
  shots?: number[];
  plate?: string[];
};

export type Project = {
  n: string;
  slug: string;
  title: string;
  year: string;
  summary: string;
  role: string;
  stack: string;
  link?: string;
  linkNote?: string;
  wide?: boolean;
  deck: DeckChapter[];
  offset: number;

  lead: string;
  media: Media[];
};

export type Education = {
  degree: string;
  school: string;
  period: string;
  note: string;
};

export type StackPart = { name?: string; text?: string };

export const meta: Meta = {
  name: "Ahmed Elshiekh",
  role: "Software Engineer",
  location: "Bosnia and Herzegovina",
  email: "ahmedelshiekh1@gmail.com",
  github: "github.com/RakimKai",
  githubUrl: "https://github.com/RakimKai",
  intro: "Software engineer.",
  year: "2026",
  siteUrl: "https://ahmedelshiekh.com",
  description:
    "Full-stack engineer working on enterprise systems in Java, Spring, C#, .NET, React and Angular.",
};

export const experience: Role[] = [
  {
    company: "ZIRA Group",
    title: "software engineer i",
    period: "aug 2024 — present",
    body: "Modules of the Rating engine in a Revenue Management suite, applying charging rules to usage records and feeding billing, settlement and reconciliation downstream. REST APIs in Java and Spring, Angular screens for configuration and operational control, XML-driven pipelines deployed against Oracle and PostgreSQL.",
    figure: { value: 1_000_000, caption: "usage records rated per day, production" },
  },
  {
    company: "E-Code",
    title: "frontend developer",
    period: "jan 2026 — present",
    note: "part-time contract",
    body: "Frontend on a two-person team building a multi-tenant platform for monitoring and managing a fleet of ATM terminals: customisable dashboards, device fleet views, transactions, alerts and audit logs. React, owning component architecture, state management and API integration for the module.",
  },
];

export const education: Education = {
  degree: "BSc Software Engineering",
  school: "faculty of information technologies, mostar",
  period: "2021 — 2025",
  note: "Completed the final year while working full time as a software engineer.",
};

export const projects: Project[] = [
  {
    n: "01",
    slug: "gdje-ides",
    title: "Gdje Ideš",
    year: "2026",
    wide: true,
    offset: 0,
    summary: "Event ticketing for Bosnia: an API, an admin desktop app, a mobile app and a recommender.",
    role: "sole developer",
    stack: "asp.net core · sql server · rabbitmq · microsoft.ml · flutter · docker",
    link: "https://github.com/RakimKai/GdjeIdes",
    lead: "An event ticketing platform for Bosnia, built end to end: a REST API, a Flutter admin app for Windows, and a Flutter mobile app for Android.",
    deck: [
      {
        label: "overview",
        title: "Built end to end",
        body: [
          "A REST API, a Flutter admin app for Windows and a Flutter mobile app for Android, all mine. The API is layered, with the domain kept separate from the transport and persistence around it.",
        ],
        shots: [0],
      },
      {
        label: "overview",
        title: "The desk the organiser sits at",
        body: [
          "Events, venues, performers, orders, categories and organisers, each with the reports that go with them: tickets sold against capacity, revenue by category, what moved this week.",
        ],
        shots: [2],
      },
      {
        label: "decision 01",
        title: "The order lifecycle is a state machine",
        body: [
          "Pending, Paid, Cancelled and the transitions between them are modelled explicitly. Anything that wants to move an order asks the machine, so an illegal transition is a compile-time and run-time impossibility rather than a bug someone finds in production.",
        ],
        shots: [1],
      },
      {
        label: "decision 02",
        title: "Email rides on an event, not the request",
        body: [
          "When an order moves from Pending to Paid the domain publishes an event; a separate RabbitMQ mailer worker consumes it and sends the confirmation. The checkout request returns as soon as the order is written. If the worker is down the message waits in the queue.",
        ],
        plate: [
          "an order reaches Paid",
          "the domain publishes an event",
          "the mailer worker sends it, or the queue holds it",
        ],
      },
      {
        label: "decision 03",
        title: "A recommender that answers on day one",
        body: [
          "Matrix factorization over Microsoft.ML for users with a history, a content-based fallback for users with too few signals to factorise, and a geo-proximity filter over both, because an event in another country is a bad recommendation no matter what the maths says.",
        ],
        shots: [3, 4],
      },
      {
        label: "decision 04",
        title: "One command brings the whole thing up",
        body: [
          "Docker Compose starts SQL Server, RabbitMQ, the API and the mailer, applies migrations and seeds demo data. Integration tests run in xUnit against an in-memory EF database, so the suite needs no infrastructure at all.",
        ],
        shots: [5],
      },
    ],
    media: [
      {
        src: "/projects/gdje-ides/01.png",
        alt: "Gdje Ideš admin dashboard: revenue chart, top events this week and sales by category",
        caption: "The admin dashboard: revenue, the week's top events, sales by category",
      },
      {
        src: "/projects/gdje-ides/02.png",
        alt: "Orders table showing paid, pending and cancelled orders with buyer, event and amount",
        caption: "Orders, each one sitting in a state the machine allows: paid, pending, cancelled",
      },
      {
        src: "/projects/gdje-ides/03.png",
        alt: "Events table with date, venue, category, tickets sold against capacity and status",
        caption: "Events, with tickets sold against capacity at a glance",
      },
      {
        src: "/projects/gdje-ides/04.png",
        alt: "The phone app's home screen: trending events this week with photographs, then events nearby in Sarajevo",
        caption: "The phone app: what is trending, then what is near you",
        portrait: true,
      },
      {
        src: "/projects/gdje-ides/05.png",
        alt: "An event page for a Dubioza kolektiv concert with date, time, price range and a buy-tickets button",
        caption: "An event, with the price range and how much of the house has gone",
        portrait: true,
      },
      {
        src: "/projects/gdje-ides/06.png",
        alt: "Ticket selection: a seating map, ticket types with counters and a running total of two tickets for fifty marks",
        caption: "Choosing tickets. The total follows the counters, and the order it makes is what the state machine takes over",
        portrait: true,
      },
    ],
  },
  {
    n: "02",
    slug: "stagledas",
    title: "staGledas",
    year: "2025",
    offset: 58,
    summary: "Film discovery and review, with a recommender trained on how you swipe.",
    role: "sole developer",
    stack: "asp.net core · sql server · rabbitmq · signalr · microsoft.ml · flutter · docker",
    link: "https://github.com/RakimKai/staGledas",
    lead: "A film discovery and review app where onboarding is the training data: you swipe through popular films, and what you keep becomes the model's first signal.",
    deck: [
      {
        label: "overview",
        title: "The catalogue is TMDb",
        body: [
          "Films come from the TMDb API. New users see the most popular titles and swipe through them, which solves the cold-start problem by making the first thirty seconds useful to the recommender rather than to nobody.",
        ],
        shots: [0],
      },
      {
        label: "overview",
        title: "Around the recommender, a social half",
        body: [
          "Following, real-time chat between mutual followers, reviews that other people can like and report, and a paid tier that removes the ads. The recommender is the reason to open the app; the social half is the reason to keep it.",
        ],
        shots: [2],
      },
      {
        label: "decision 01",
        title: "Swipe onboarding feeds the model",
        body: [
          "Rather than asking new users to pick genres from a list, the app shows the most popular films from TMDb and records the swipes. By the time onboarding ends there is enough signal to factorise, and no screen was wasted on a questionnaire.",
        ],
        plate: ["swipe right → keep", "swipe left → skip", "eight films, then a first factorisation"],
      },
      {
        label: "decision 02",
        title: "Trending covers what the model cannot",
        body: [
          "Matrix factorization needs history. Users who have not produced enough of it get a trending list instead, so the shelf is never empty and the difference is invisible from the outside.",
        ],
        shots: [1],
      },
      {
        label: "decision 03",
        title: "Chat only between mutual followers",
        body: [
          "SignalR keeps a live connection for conversations, but the permission check comes first: two people can talk only if they both follow each other. The constraint is in the domain, not in the UI.",
        ],
        plate: ["a follows b", "b follows a", "→ the conversation opens"],
      },
    ],
    media: [
      {
        src: "/projects/stagledas/01.png",
        alt: "staGledas onboarding: a Dune: Part Two poster card with swipe-right-to-like instructions and a one-of-eight counter",
        caption: "Onboarding: the swipe deck, which is also the model's first training data",
        portrait: true,
      },
      {
        src: "/projects/stagledas/02.png",
        alt: "staGledas home screen with a grid of this week's popular film posters",
        caption: "Home: what is trending, which is what a cold-start user gets instead of nothing",
        portrait: true,
      },
      {
        src: "/projects/stagledas/03.png",
        alt: "A film page with backdrop, TMDb rating, synopsis and watchlist, watched and review actions",
        caption: "A film, and the three things you can do with it",
        portrait: true,
      },
    ],
  },
  {
    n: "03",
    slug: "worknet",
    title: "WorkNet-api",
    year: "2024",
    offset: 14,
    summary: "A job marketplace: employers post, candidates filter and apply from a profile.",
    role: "backend and api, with one other student",
    stack: "c# · asp.net · entity framework · angular · typescript",
    link: "https://github.com/RakimKai/worknet-api",
    lead: "A job marketplace built with another student. Employers post openings, candidates filter them and apply with a profile that carries their skills and experience.",
    deck: [
      {
        label: "overview",
        title: "An API, and an Angular client on top of it",
        body: [
          "An ASP.NET REST API with Entity Framework migrations and a documented Swagger surface. Both halves were deployed, with test accounts for either role so the whole flow could be walked end to end without seeding an account first.",
        ],
        plate: [
          "an employer posts an opening",
          "a candidate filters and applies",
          "one profile carries the skills and the history",
        ],
      },
      {
        label: "decision 01",
        title: "Two roles, one model",
        body: [
          "Employers and candidates are the same account type with different capabilities rather than two parallel systems, which keeps applications, listings and profiles in one graph instead of two that have to agree with each other.",
        ],
        plate: [
          "one account type",
          "two sets of capabilities",
          "one graph: listings, applications, profiles",
        ],
      },
      {
        label: "decision 02",
        title: "Filtering that works on the server",
        body: [
          "Title, location and company filters compose into a single query rather than fetching a page and narrowing it in the client, so the behaviour holds as the listing count grows.",
        ],
        plate: [
          "title · location · company",
          "compose into a single query",
          "the page stays the same size as the table grows",
        ],
      },
      {
        label: "why it is here",
        title: "The oldest project, and the most conventional",
        body: [
          "It is on the list for exactly that reason: it is the public code that matches the C# and Angular work I do professionally, where the repository is not mine to share.",
        ],
        plate: ["2024", "c# and angular, in the open", "the day job, in code you can read"],
      },
    ],
    media: [],
  },
  {
    n: "04",
    slug: "kimbo",
    title: "Kimbo",
    year: "2024",
    offset: 74,
    summary: "A compiler for a small BASIC-like language, written from scratch in Python.",
    role: "sole developer",
    stack: "python · c++",
    link: "https://github.com/RakimKai/mini-compiler",
    lead: "A compiler for Kimbo, a small BASIC-like language, written from scratch in Python and emitting C++ for a standard compiler to build.",
    deck: [
      {
        label: "overview",
        title: "Source in, C++ out",
        body: [
          "A program that declares variables with LET, does arithmetic and prints results goes in one end, and compilable C++ comes out the other, which a standard compiler then turns into a running program.",
        ],
        shots: [0],
      },
      {
        label: "decision 01",
        title: "Three stages, kept apart",
        body: [
          "lexer.py, parse.py and emit.py never reach into each other. Tokens are the only thing that crosses from the first to the second, and a validated tree the only thing that crosses from the second to the third. It is the same separation a real compiler keeps, at a size you can hold in your head.",
        ],
        plate: ["source → tokens", "tokens → a validated tree", "tree → c++"],
      },
      {
        label: "decision 02",
        title: "Emitting C++ instead of machine code",
        body: [
          "Targeting a language rather than an instruction set means the grammar and the code generation stay the subject, and the back end is someone else's solved problem. The output is readable C++, which also makes the emitter easy to check by eye.",
        ],
        plate: [
          "no register allocation",
          "no instruction selection",
          "a back end that is already solved",
        ],
      },
      {
        label: "why it is here",
        title: "It exists to be understood, not used",
        body: [
          "The only project here that is not an application, and the one I would rather be asked about.",
        ],
        plate: ["python, no libraries", "about 700 lines", "written to learn how one is put together"],
      },
    ],
    media: [
      {
        src: "/projects/kimbo/01.png",
        alt: "A Kimbo program, the C++ the compiler emits from it, and the output of running that C++",
        caption: "A ten-term Fibonacci in Kimbo, the C++ it emits, and what that C++ prints",
      },
    ],
  },
];

export const stack: StackPart[] = [
  { name: "Java" },
  { text: "and" },
  { name: "Spring" },
  { text: "on the server," },
  { name: "C#" },
  { text: "and" },
  { name: ".NET" },
  { text: "alongside it," },
  { name: "TypeScript" },
  { text: "with" },
  { name: "React" },
  { text: "and" },
  { name: "Angular" },
  { text: "on the client," },
  { name: "SQL" },
  { text: "over" },
  { name: "Oracle" },
  { text: "and" },
  { name: "PostgreSQL," },
  { text: "all of it in" },
  { name: "Git." },
];

export const stackGroups = [
  { label: "backend", items: ["Java", "Spring / Spring Boot", "C#", ".NET"] },
  { label: "frontend", items: ["TypeScript", "JavaScript", "React", "Angular"] },
  { label: "data", items: ["SQL", "Oracle", "PostgreSQL"] },
  { label: "tooling", items: ["Git", "Docker"] },
];

export const nav = [
  { href: "#experience", label: "experience" },
  { href: "#education", label: "education" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];
