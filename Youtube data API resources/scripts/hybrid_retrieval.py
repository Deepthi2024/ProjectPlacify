import os
import re
import json

import faiss
from sentence_transformers import SentenceTransformer


# ============================================================
# PATH CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

FAISS_INDEX_PATH = os.path.join(
    BASE_DIR,
    "data",
    "rag_faiss.index"
)

METADATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "rag_embedding_metadata.json"
)


# ============================================================
# MODEL CONFIGURATION
# ============================================================

EMBEDDING_MODEL = (
    "sentence-transformers/all-MiniLM-L6-v2"
)

RETRIEVAL_K = 50
FINAL_K = 10


# ============================================================
# TOPIC ALIASES
# ============================================================

TOPIC_ALIASES = {

    "HTML": [
        "html",
        "html5",
        "hypertext markup language"
    ],

    "CSS": [
        "css",
        "css3",
        "cascading style sheets"
    ],

    "JavaScript": [
        "javascript",
        "java script"
    ],

    "Git & GitHub": [
        "git",
        "github",
        "git hub",
        "version control"
    ],

    "Responsive Design": [
        "responsive design",
        "responsive web design",
        "mobile responsive",
        "responsive websites"
    ],

    "React": [
        "react",
        "reactjs",
        "react js"
    ],

    "Node.js": [
        "node.js",
        "nodejs",
        "node js",
        "node"
    ],

    "Express.js": [
        "express.js",
        "expressjs",
        "express js",
        "express"
    ],

    "REST APIs": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis",
        "api development",
        "api design"
    ],

    "Full-Stack User Authentication & Permissions": [
        "authentication",
        "authorization",
        "user authentication",
        "user authorization",
        "permissions",
        "access control",
        "login system",
        "signup system",
        "jwt authentication",
        "session authentication"
    ],

    "Databases": [
        "database",
        "databases",
        "database management"
    ],

    "SQL": [
        "sql",
        "mysql",
        "postgresql",
        "postgres",
        "relational database"
    ],

    "MongoDB": [
        "mongodb",
        "mongo db",
        "mongo"
    ],

    "Backend Development": [
        "backend development",
        "backend",
        "back end",
        "server side",
        "server-side development"
    ],

    "Frontend Development": [
        "frontend development",
        "frontend",
        "front end",
        "client side",
        "client-side development"
    ],

    "End-to-End Testing in Full Stack Development": [
        "end to end testing",
        "e2e testing",
        "end-to-end testing",
        "full stack testing",
        "fullstack testing"
    ],

    "Full-Stack Deployment & Hosting": [
        "deployment",
        "deploy",
        "hosting",
        "deployment and hosting",
        "full stack deployment",
        "fullstack deployment"
    ],

    "Docker": [
        "docker",
        "docker container",
        "docker containers",
        "containerization"
    ],

    "Full Stack Projects": [
        "full stack project",
        "full stack projects",
        "fullstack project",
        "fullstack projects",
        "full stack application",
        "full stack applications",
        "fullstack application"
    ]
}


# ============================================================
# SUBTOPIC ALIASES
# ============================================================

SUBTOPIC_ALIASES = {

    "Hooks": [
        "hooks",
        "react hooks"
    ],

    "useEffect": [
        "useeffect",
        "use effect"
    ],

    "useState": [
        "usestate",
        "use state"
    ],

    "Components": [
        "components",
        "react components"
    ],

    "Props": [
        "props",
        "react props"
    ],

    "State Management": [
        "state management",
        "redux",
        "context api",
        "react context"
    ],

    "Flexbox": [
        "flexbox",
        "flex box"
    ],

    "CSS Grid": [
        "css grid",
        "grid layout"
    ],

    "Animations": [
        "css animations",
        "css animation",
        "animations",
        "animation"
    ],

    "DOM": [
        "dom",
        "document object model"
    ],

    "ES6": [
        "es6",
        "ecmascript 6",
        "modern javascript"
    ],

    "Promises": [
        "promises",
        "promise",
        "async await",
        "async/await"
    ],

    "Arrays": [
        "javascript arrays",
        "arrays"
    ],

    "HTTP": [
        "http",
        "https",
        "http requests"
    ],

    "REST APIs": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis"
    ],

    "Middleware": [
        "middleware"
    ],

    "Authentication": [
        "authentication",
        "authorization",
        "jwt",
        "login",
        "signup"
    ],

    "CRUD": [
        "crud",
        "create read update delete"
    ],

    "Routing": [
        "routing",
        "routes",
        "routing in react",
        "react router"
    ],

    "Projects": [
        "project",
        "projects",
        "build a project",
        "building projects"
    ]
}


# ============================================================
# NORMALIZATION
# ============================================================

def normalize_text(text):
    """
    Normalize text for matching.

    We intentionally preserve periods because:
        node.js
        express.js

    need to remain distinguishable.
    """

    if not text:
        return ""

    text = str(text).lower()

    # Normalize common separators
    text = text.replace("_", " ")
    text = text.replace("-", " ")

    # Normalize repeated whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text


# ============================================================
# PHRASE MATCHING
# ============================================================

def contains_phrase(
    text,
    phrase
):
    """
    Safely determine whether phrase exists
    as a meaningful word/phrase.

    Special handling is provided for terms
    containing periods such as node.js.
    """

    text = normalize_text(text)
    phrase = normalize_text(phrase)

    if not text or not phrase:
        return False

    # Terms containing a period such as node.js
    if "." in phrase:

        pattern = (
            r"(?<![\w])"
            + re.escape(phrase)
            + r"(?![\w])"
        )

        return bool(
            re.search(
                pattern,
                text
            )
        )

    pattern = (
        r"(?<![\w])"
        + re.escape(phrase)
        + r"(?![\w])"
    )

    return bool(
        re.search(
            pattern,
            text
        )
    )


# ============================================================
# TOPIC DETECTION
# ============================================================

def detect_topics(query):

    query_lower = normalize_text(
        query
    )

    detected_topics = []

    # --------------------------------------------------------
    # Normal topic aliases
    # --------------------------------------------------------

    for topic, aliases in TOPIC_ALIASES.items():

        for alias in aliases:

            if contains_phrase(
                query_lower,
                alias
            ):

                if topic not in detected_topics:

                    detected_topics.append(
                        topic
                    )

                break

    # --------------------------------------------------------
    # Explicit "JS" detection
    # --------------------------------------------------------
    #
    # IMPORTANT:
    #
    # We intentionally DO NOT put "js" in
    # TOPIC_ALIASES["JavaScript"].
    #
    # Otherwise:
    #
    #     Node.js
    #
    # would incorrectly trigger:
    #
    #     JavaScript
    #
    # This regex only detects standalone JS.
    #
    # Examples:
    #
    #     "learn JS"       -> JavaScript
    #     "JavaScript"     -> JavaScript
    #     "Node.js"        -> NOT JavaScript
    #     "Express.js"     -> NOT JavaScript
    #
    # --------------------------------------------------------

    explicit_js = re.search(
        r"(?<![.\w])js(?![\w])",
        query_lower
    )

    if explicit_js:

        if "JavaScript" not in detected_topics:

            detected_topics.append(
                "JavaScript"
            )

    return detected_topics


# ============================================================
# SUBTOPIC DETECTION
# ============================================================

def detect_subtopics(query):

    query_lower = normalize_text(
        query
    )

    detected_subtopics = []

    for subtopic, aliases in SUBTOPIC_ALIASES.items():

        for alias in aliases:

            if contains_phrase(
                query_lower,
                alias
            ):

                if subtopic not in detected_subtopics:

                    detected_subtopics.append(
                        subtopic
                    )

                break

    return detected_subtopics


# ============================================================
# LEVEL DETECTION
# ============================================================

def detect_level(query):

    query_lower = normalize_text(
        query
    )

    beginner_patterns = [
        "beginner",
        "beginners",
        "basic",
        "basics",
        "from scratch",
        "starting from scratch",
        "new to",
        "absolute beginner",
        "fundamentals"
    ]

    intermediate_patterns = [
        "intermediate",
        "mid level",
        "mid-level"
    ]

    advanced_patterns = [
        "advanced",
        "expert",
        "deep dive",
        "deep-dive"
    ]

    for pattern in beginner_patterns:

        if contains_phrase(
            query_lower,
            pattern
        ):

            return "Beginner"

    for pattern in intermediate_patterns:

        if contains_phrase(
            query_lower,
            pattern
        ):

            return "Intermediate"

    for pattern in advanced_patterns:

        if contains_phrase(
            query_lower,
            pattern
        ):

            return "Advanced"

    return None


# ============================================================
# LANGUAGE DETECTION
# ============================================================

def detect_language(query):

    query_lower = normalize_text(
        query
    )

    language_patterns = {

        "Hindi": [
            "hindi",
            "in hindi"
        ],

        "English": [
            "english",
            "in english"
        ],

        "Kannada": [
            "kannada",
            "in kannada"
        ],

        "Tamil": [
            "tamil",
            "in tamil"
        ],

        "Telugu": [
            "telugu",
            "in telugu"
        ],

        "Malayalam": [
            "malayalam",
            "in malayalam"
        ]
    }

    for language, patterns in language_patterns.items():

        for pattern in patterns:

            if contains_phrase(
                query_lower,
                pattern
            ):

                return language

    return None


# ============================================================
# PROJECT INTENT
# ============================================================

def detect_project_intent(query):

    query_lower = normalize_text(
        query
    )

    project_patterns = [

        "project",
        "projects",
        "build a project",
        "building a project",
        "build projects",
        "real world project",
        "real world projects",
        "hands on project",
        "hands on projects",
        "practice project",
        "practice projects",
        "application",
        "build an application",
        "build a website",
        "build a web app",
        "build an app"
    ]

    for pattern in project_patterns:

        if contains_phrase(
            query_lower,
            pattern
        ):

            return True

    return False


# ============================================================
# INTENT DETECTION
# ============================================================

def detect_intents(query):

    query_lower = normalize_text(
        query
    )

    intents = []

    # --------------------------------------------------------
    # Frontend ↔ Backend Integration
    # --------------------------------------------------------

    integration_patterns = [
        "connect",
        "connection",
        "integrate",
        "integration",
        "frontend backend",
        "backend frontend",
        "react frontend",
        "node backend",
        "connect frontend",
        "connect backend",
        "frontend with backend",
        "backend with frontend"
    ]

    if any(
        contains_phrase(
            query_lower,
            pattern
        )
        for pattern in integration_patterns
    ):

        intents.append(
            "Frontend ↔ Backend Integration"
        )

    # --------------------------------------------------------
    # API Integration
    # --------------------------------------------------------

    api_patterns = [
        "api integration",
        "integrate api",
        "connect api",
        "consume api",
        "calling api",
        "call api",
        "frontend api",
        "react api"
    ]

    if any(
        contains_phrase(
            query_lower,
            pattern
        )
        for pattern in api_patterns
    ):

        intents.append(
            "API Integration"
        )

    # --------------------------------------------------------
    # Backend Database Integration
    # --------------------------------------------------------

    database_patterns = [
        "connect database",
        "database integration",
        "backend database",
        "node mongodb",
        "node mysql",
        "node postgresql",
        "express mongodb",
        "express mysql",
        "express postgresql"
    ]

    if any(
        contains_phrase(
            query_lower,
            pattern
        )
        for pattern in database_patterns
    ):

        intents.append(
            "Backend Database Integration"
        )

    # --------------------------------------------------------
    # Authentication
    # --------------------------------------------------------

    authentication_patterns = [
        "authentication",
        "authorization",
        "login system",
        "signup system",
        "user authentication",
        "jwt authentication",
        "session authentication",
        "auth system"
    ]

    if any(
        contains_phrase(
            query_lower,
            pattern
        )
        for pattern in authentication_patterns
    ):

        intents.append(
            "Authentication"
        )

    # --------------------------------------------------------
    # Deployment
    # --------------------------------------------------------

    deployment_patterns = [
        "deploy",
        "deployment",
        "hosting",
        "host application",
        "deploy application",
        "deploy website",
        "deploy full stack",
        "deploy fullstack"
    ]

    if any(
        contains_phrase(
            query_lower,
            pattern
        )
        for pattern in deployment_patterns
    ):

        intents.append(
            "Deployment"
        )

    # --------------------------------------------------------
    # Full Stack Project
    # --------------------------------------------------------

    full_stack_project_patterns = [
        "full stack project",
        "full stack projects",
        "fullstack project",
        "fullstack projects",
        "full stack application",
        "full stack app",
        "mern project",
        "mern stack project"
    ]

    if any(
        contains_phrase(
            query_lower,
            pattern
        )
        for pattern in full_stack_project_patterns
    ):

        intents.append(
            "Full Stack Project"
        )

    return intents


# ============================================================
# DETECT ALL CONSTRAINTS
# ============================================================

def detect_constraints(query):

    constraints = {

        "topics": detect_topics(
            query
        ),

        "subtopics": detect_subtopics(
            query
        ),

        "level": detect_level(
            query
        ),

        "language": detect_language(
            query
        ),

        "project_intent": detect_project_intent(
            query
        ),

        "intents": detect_intents(
            query
        )
    }

    return constraints


# ============================================================
# RESOURCE SUBTOPIC MATCHING
# ============================================================

def resource_has_subtopic(
    resource,
    requested_subtopic
):

    resource_subtopic = resource.get(
        "subtopic",
        ""
    )

    if not resource_subtopic:
        return False

    # Subtopics in your dataset are pipe-separated
    resource_subtopics = [
        item.strip().lower()
        for item in str(
            resource_subtopic
        ).split("|")
    ]

    requested = (
        requested_subtopic
        .strip()
        .lower()
    )

    return requested in resource_subtopics


# ============================================================
# INTENT SCORE
# ============================================================

def calculate_intent_score(
    resource,
    constraints
):

    score = 0.0

    title = str(
        resource.get(
            "title",
            ""
        )
    ).lower()

    subtopic = str(
        resource.get(
            "subtopic",
            ""
        )
    ).lower()

    topic = str(
        resource.get(
            "topic",
            ""
        )
    ).lower()

    combined_text = (
        title
        + " "
        + subtopic
        + " "
        + topic
    )

    intents = constraints.get(
        "intents",
        []
    )

    # --------------------------------------------------------
    # Frontend ↔ Backend Integration
    # --------------------------------------------------------

    if (
        "Frontend ↔ Backend Integration"
        in intents
    ):

        integration_terms = [

            "connect",
            "connection",
            "backend",
            "frontend",
            "express",
            "rest api",
            "api integration",
            "api",
            "full stack",
            "mern"
        ]

        matched_terms = sum(
            1
            for term in integration_terms
            if term in combined_text
        )

        if matched_terms >= 3:

            score += 0.20

        elif matched_terms >= 2:

            score += 0.12

        elif matched_terms >= 1:

            score += 0.05

    # --------------------------------------------------------
    # API Integration
    # --------------------------------------------------------

    if (
        "API Integration"
        in intents
    ):

        api_terms = [
            "api",
            "rest",
            "http",
            "fetch",
            "axios",
            "integration"
        ]

        matched_terms = sum(
            1
            for term in api_terms
            if term in combined_text
        )

        if matched_terms >= 2:

            score += 0.12

        elif matched_terms >= 1:

            score += 0.05

    # --------------------------------------------------------
    # Database Integration
    # --------------------------------------------------------

    if (
        "Backend Database Integration"
        in intents
    ):

        database_terms = [
            "database",
            "mongodb",
            "mysql",
            "postgresql",
            "sql",
            "mongoose"
        ]

        if any(
            term in combined_text
            for term in database_terms
        ):

            score += 0.12

    # --------------------------------------------------------
    # Authentication
    # --------------------------------------------------------

    if (
        "Authentication"
        in intents
    ):

        authentication_terms = [
            "authentication",
            "authorization",
            "jwt",
            "login",
            "signup",
            "session"
        ]

        if any(
            term in combined_text
            for term in authentication_terms
        ):

            score += 0.15

    # --------------------------------------------------------
    # Deployment
    # --------------------------------------------------------

    if (
        "Deployment"
        in intents
    ):

        deployment_terms = [
            "deploy",
            "deployment",
            "hosting",
            "host",
            "vercel",
            "netlify",
            "render",
            "aws"
        ]

        if any(
            term in combined_text
            for term in deployment_terms
        ):

            score += 0.15

    # --------------------------------------------------------
    # Full Stack Project
    # --------------------------------------------------------

    if (
        "Full Stack Project"
        in intents
    ):

        if topic == "full stack projects":

            score += 0.18

        project_terms = [
            "project",
            "application",
            "app",
            "mern",
            "full stack"
        ]

        matched_terms = sum(
            1
            for term in project_terms
            if term in combined_text
        )

        if matched_terms >= 2:

            score += 0.10

        elif matched_terms >= 1:

            score += 0.05

    return score


# ============================================================
# HYBRID SCORE
# ============================================================

def calculate_hybrid_score(
    resource,
    constraints
):

    # --------------------------------------------------------
    # Semantic score
    # --------------------------------------------------------

    semantic_score = float(
        resource.get(
            "semantic_score",
            resource.get(
                "similarity_score",
                0.0
            )
        )
    )

    score = semantic_score


    # --------------------------------------------------------
    # Requested topics
    # --------------------------------------------------------

    requested_topics = constraints.get(
        "topics",
        []
    )

    resource_topic = resource.get(
        "topic",
        ""
    )

    if requested_topics:

        if resource_topic in requested_topics:

            score += 0.15

        else:

            score -= 0.20


    # --------------------------------------------------------
    # Requested subtopics
    # --------------------------------------------------------

    requested_subtopics = constraints.get(
        "subtopics",
        []
    )

    if requested_subtopics:

        matched_subtopic = False

        for requested_subtopic in requested_subtopics:

            if resource_has_subtopic(
                resource,
                requested_subtopic
            ):

                matched_subtopic = True
                break

        if matched_subtopic:

            score += 0.15

        else:

            score -= 0.08


    # --------------------------------------------------------
    # Requested level
    # --------------------------------------------------------

    requested_level = constraints.get(
        "level"
    )

    if requested_level:

        resource_level = resource.get(
            "level",
            ""
        )

        if resource_level == requested_level:

            score += 0.12

        elif resource_level:

            score -= 0.10


    # --------------------------------------------------------
    # Requested language
    # --------------------------------------------------------

    requested_language = constraints.get(
        "language"
    )

    if requested_language:

        resource_language = resource.get(
            "language",
            ""
        )

        if resource_language == requested_language:

            score += 0.10

        elif resource_language:

            score -= 0.08


    # --------------------------------------------------------
    # Project intent
    # --------------------------------------------------------

    if constraints.get(
        "project_intent",
        False
    ):

        resource_topic_lower = str(
            resource_topic
        ).lower()

        resource_title = str(
            resource.get(
                "title",
                ""
            )
        ).lower()

        resource_subtopic = str(
            resource.get(
                "subtopic",
                ""
            )
        ).lower()

        project_text = (
            resource_title
            + " "
            + resource_subtopic
        )

        if (
            resource_topic_lower
            == "full stack projects"
        ):

            score += 0.15

        elif any(
            term in project_text
            for term in [
                "project",
                "build",
                "building",
                "application"
            ]
        ):

            score += 0.12


    # --------------------------------------------------------
    # Intent score
    # --------------------------------------------------------

    intent_score = calculate_intent_score(
        resource,
        constraints
    )

    score += intent_score


    return score


# ============================================================
# LOAD RESOURCES
# ============================================================

def load_metadata():

    if not os.path.exists(
        METADATA_PATH
    ):

        raise FileNotFoundError(
            f"Metadata file not found:\n"
            f"{METADATA_PATH}"
        )

    with open(
        METADATA_PATH,
        "r",
        encoding="utf-8"
    ) as f:

        metadata = json.load(f)

    return metadata


# ============================================================
# RETRIEVE RESOURCES
# ============================================================

def retrieve(
    query,
    index,
    metadata,
    model
):

    # --------------------------------------------------------
    # Detect constraints
    # --------------------------------------------------------

    constraints = detect_constraints(
        query
    )


    # --------------------------------------------------------
    # Display constraints
    # --------------------------------------------------------

    print("\nDetected constraints:")

    topics_text = (
    ", ".join(constraints["topics"])
    if constraints["topics"]
    else "None"
    )

    subtopics_text = (
    ", ".join(constraints["subtopics"])
    if constraints["subtopics"]
    else "None"
    )

    intents_text = (
    ", ".join(constraints["intents"])
    if constraints["intents"]
    else "None"
    )

    print(f"  topics: {topics_text}")
    print(f"  subtopics: {subtopics_text}")
    print(f"  level: {constraints['level'] or 'None'}")
    print(f"  language: {constraints['language'] or 'None'}")
    print(
        f"  project_intent: "
        f"{constraints['project_intent']}"
    )
    print(f"  intents: {intents_text}")


    # --------------------------------------------------------
    # Create query embedding
    # --------------------------------------------------------

    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )


    # --------------------------------------------------------
    # FAISS search
    # --------------------------------------------------------

    search_k = min(
        RETRIEVAL_K,
        index.ntotal
    )

    scores, indices = index.search(
        query_embedding,
        search_k
    )


    # --------------------------------------------------------
    # Build candidate resources
    # --------------------------------------------------------

    candidates = []

    for semantic_score, idx in zip(
        scores[0],
        indices[0]
    ):

        if idx < 0:
            continue

        if idx >= len(metadata):
            continue

        resource = metadata[idx].copy()

        resource[
            "semantic_score"
        ] = float(
            semantic_score
        )

        candidates.append(
            resource
        )


    # --------------------------------------------------------
    # Calculate hybrid scores
    # --------------------------------------------------------

    for resource in candidates:

        resource[
            "hybrid_score"
        ] = calculate_hybrid_score(
            resource,
            constraints
        )


    # --------------------------------------------------------
    # Sort by hybrid score
    # --------------------------------------------------------

    candidates.sort(
        key=lambda x: x.get(
            "hybrid_score",
            0.0
        ),
        reverse=True
    )


    # --------------------------------------------------------
    # Return top K
    # --------------------------------------------------------

    return candidates[:FINAL_K]


# ============================================================
# DURATION & TASK-AWARE HYBRID RETRIEVAL FOR DAILY TASKS
# ============================================================

def calculate_duration_fit(resource_minutes, task_budget_minutes):
    """
    Duration compatibility score:
    - resource <= budget and >= budget * 0.35: 1.0 (ideal fit)
    - resource < budget * 0.35: 0.70 to 0.95 (short video, good supplementary)
    - resource > budget: 0.0 (rejected)
    """
    try:
        r_min = float(resource_minutes or 0)
        b_min = float(task_budget_minutes or 45)
    except (ValueError, TypeError):
        return 0.5

    if b_min <= 0:
        return 0.5
    if r_min <= 0:
        return 0.6
    if r_min > b_min:
        return 0.0

    ratio = r_min / b_min
    if 0.35 <= ratio <= 1.0:
        return 1.0
    elif ratio < 0.35:
        return max(0.65, 0.65 + (ratio / 0.35) * 0.30)
    return 0.8


def calculate_task_type_score(resource, task_type):
    """
    Evaluates resource type and content alignment with daily task type.
    """
    t_type = str(task_type or "LEARN").upper()
    r_title = normalize_text(resource.get("title", ""))
    r_subtopic = normalize_text(resource.get("subtopic", ""))
    r_topic = normalize_text(resource.get("topic", ""))
    r_text = f"{r_title} {r_subtopic} {r_topic}"

    is_practice = any(w in r_text for w in [
        "practice", "exercise", "exercises", "drill", "drills", "problem", "problems",
        "leetcode", "coding", "hands on", "hands-on", "challenge", "solution", "solutions"
    ])
    is_revision = any(w in r_text for w in [
        "revision", "summary", "cheat sheet", "cheatsheet", "crash course", "quick",
        "in 10 min", "in 15 min", "in 20 min", "recap", "review", "mindmap", "flashcards"
    ])
    is_project = any(w in r_text for w in [
        "project", "projects", "build", "building", "clone", "app", "application",
        "capstone", "portfolio", "real world", "full stack"
    ])

    try:
        dur = float(resource.get("duration_minutes") or 30)
    except (ValueError, TypeError):
        dur = 30

    if t_type in ["PRACTICE", "PROBLEM_SOLVING"]:
        if is_practice:
            return 1.0
        elif is_project:
            return 0.80
        elif dur <= 30:
            return 0.70
        return 0.50
    elif t_type in ["REVISION"]:
        if is_revision:
            return 1.0
        elif dur <= 25:
            return 0.90
        elif dur > 60:
            return 0.20
        return 0.60
    elif t_type in ["PROJECT", "IMPLEMENT"]:
        if is_project:
            return 1.0
        elif is_practice:
            return 0.85
        return 0.65
    elif t_type in ["ASSESSMENT", "MOCK_TEST"]:
        if is_practice or any(w in r_text for w in ["test", "quiz", "interview", "questions", "mock"]):
            return 1.0
        return 0.60
    else:  # LEARN / STUDY / CONCEPT
        if not is_project and not is_revision and dur <= 60:
            return 1.0
        elif is_practice:
            return 0.80
        return 0.70


def calculate_difficulty_score(resource_level, user_level):
    """
    Evaluates skill level alignment.
    """
    r_lvl = str(resource_level or "BEGINNER").upper()
    u_lvl = str(user_level or "BEGINNER").upper()

    if u_lvl not in ["BEGINNER", "INTERMEDIATE", "ADVANCED"]:
        u_lvl = "BEGINNER"
    if r_lvl not in ["BEGINNER", "INTERMEDIATE", "ADVANCED"]:
        r_lvl = "BEGINNER"

    if r_lvl == u_lvl:
        return 1.0

    if u_lvl == "BEGINNER":
        if r_lvl == "INTERMEDIATE":
            return 0.60
        return 0.20  # Severe penalty for Advanced to Beginner
    elif u_lvl == "INTERMEDIATE":
        if r_lvl in ["BEGINNER", "ADVANCED"]:
            return 0.75
    elif u_lvl == "ADVANCED":
        if r_lvl == "INTERMEDIATE":
            return 0.75
        return 0.35  # Penalty for Beginner to Advanced
    return 0.70


def calculate_topic_subtopic_scores(resource, topic, subtopic, task_title=""):
    """
    Computes exact topic, subtopic, and specificity scores.
    """
    r_topic = normalize_text(resource.get("topic", ""))
    r_subtopic = normalize_text(resource.get("subtopic", ""))
    r_title = normalize_text(resource.get("title", ""))

    req_topic = normalize_text(topic)
    req_subtopic = normalize_text(subtopic)
    req_title = normalize_text(task_title)

    # 1. Topic Match
    topic_score = 0.0
    if req_topic:
        if req_topic == r_topic or req_topic in r_topic or r_topic in req_topic:
            topic_score = 1.0
        elif any(alias in r_topic or alias in r_title for alias in TOPIC_ALIASES.get(topic, [req_topic])):
            topic_score = 0.90
        elif req_topic in r_subtopic or req_topic in r_title:
            topic_score = 0.75
    else:
        topic_score = 0.50

    # 2. Subtopic Match
    subtopic_score = 0.0
    if req_subtopic:
        sub_items = [normalize_text(s) for s in str(resource.get("subtopic", "")).split("|") if s]
        if any(req_subtopic == s or req_subtopic in s or s in req_subtopic for s in sub_items):
            subtopic_score = 1.0
        elif req_subtopic in r_title:
            subtopic_score = 0.90
        elif req_subtopic in r_subtopic:
            subtopic_score = 0.85
        else:
            sub_words = [w for w in req_subtopic.split() if len(w) > 2 and w not in ["the", "and", "for", "with", "basic", "basics", "learn", "practice"]]
            if sub_words and any(w in r_title or w in r_subtopic for w in sub_words):
                subtopic_score = 0.60
    else:
        subtopic_score = 0.50

    # 3. Task-Match & Specificity vs Broad Course Penalty
    task_match_score = 0.50
    if req_title:
        title_words = [w for w in req_title.split() if len(w) > 2 and w not in ["learn", "practice", "study", "module", "drill", "task", "day", "week"]]
        matched_words = sum(1 for w in title_words if w in r_title or w in r_subtopic)
        if title_words:
            task_match_score = min(1.0, 0.4 + (matched_words / len(title_words)) * 0.6)

    # Anti-broad penalty: If specific subtopic requested but title is a generic mega-course, penalize
    is_broad_course = any(b in r_title for b in ["full course", "complete course", "10 hours", "12 hours", "bootcamp", "all in one", "from scratch to hero", "masterclass"])
    if req_subtopic and is_broad_course and req_subtopic not in r_title:
        subtopic_score = max(0.0, subtopic_score - 0.35)
        task_match_score = max(0.0, task_match_score - 0.25)

    return topic_score, subtopic_score, task_match_score


def build_task_rag_query(task_data):
    """
    Constructs an authoritative, structured RAG query for a daily task.
    """
    domain = str(task_data.get("domain") or "").strip()
    topic = str(task_data.get("topic") or task_data.get("dailyTopic") or task_data.get("taskTopic") or "").strip()
    subtopic = str(task_data.get("subtopic") or task_data.get("taskSubtopic") or "").strip()
    task_title = str(task_data.get("taskTitle") or task_data.get("task_title") or task_data.get("title") or "").strip()
    task_type = str(task_data.get("taskType") or task_data.get("task_type") or "LEARN").strip().upper()
    difficulty = str(task_data.get("difficulty") or task_data.get("taskDifficulty") or task_data.get("userLevel") or "BEGINNER").strip().upper()
    user_level = str(task_data.get("userLevel") or task_data.get("user_level") or difficulty).strip().upper()
    duration = task_data.get("taskDuration") or task_data.get("task_duration") or task_data.get("durationMinutes") or task_data.get("estimated_minutes") or 45
    description = str(task_data.get("taskDescription") or task_data.get("task_description") or task_data.get("description") or "").strip()

    parts = [
        f"{domain} {topic} {subtopic}".strip(),
        f"{task_type}: {task_title}".strip(),
        description,
        f"{user_level} difficulty".strip(),
        f"Target duration {duration} minutes".strip()
    ]
    return ". ".join(p for p in parts if p)


def retrieve_daily_task_resources(
    task_data,
    index,
    metadata,
    model,
    personalized_scores=None,
    top_k=3
):
    """
    Authoritative Daily Task Resource Retrieval Pipeline.
    Adheres strictly to:
    1. Topic & Subtopic Alignment
    2. Strict Time Budget (Total minutes <= taskBudgetMinutes)
    3. Task-Type Alignment
    4. Skill Level Suitability
    5. Diversity & Repetition Penalties
    6. No fabricated/unrelated fallbacks
    """
    if not task_data:
        return []

    # 1. Extract Task Parameters
    task_id = str(task_data.get("taskId") or task_data.get("task_id") or task_data.get("id") or "task_1")
    task_title = str(task_data.get("taskTitle") or task_data.get("task_title") or task_data.get("title") or "Daily Task")
    task_type = str(task_data.get("taskType") or task_data.get("task_type") or "LEARN").upper()
    topic = str(task_data.get("topic") or task_data.get("dailyTopic") or task_data.get("taskTopic") or "")
    subtopic = str(task_data.get("subtopic") or task_data.get("taskSubtopic") or topic)
    domain = str(task_data.get("domain") or task_data.get("chosen_domain") or "")
    user_level = str(task_data.get("userLevel") or task_data.get("user_level") or task_data.get("difficulty") or "BEGINNER").upper()
    task_difficulty = str(task_data.get("difficulty") or task_data.get("taskDifficulty") or user_level).upper()

    try:
        task_budget_minutes = int(
            task_data.get("taskDuration") or
            task_data.get("task_duration") or
            task_data.get("durationMinutes") or
            task_data.get("estimated_minutes") or
            45
        )
    except (ValueError, TypeError):
        task_budget_minutes = 45

    history_ids = set(task_data.get("history_resource_ids") or [])
    week_ids = set(task_data.get("week_resource_ids") or [])
    quiz_perf = task_data.get("quizTopicPerformance") or task_data.get("quiz_topic_performance") or {}

    # Check if this topic is a weak area from quiz
    is_weak_topic = False
    for q_topic, score in quiz_perf.items():
        if normalize_text(q_topic) in normalize_text(topic) or normalize_text(topic) in normalize_text(q_topic):
            try:
                if float(score) < 60:
                    is_weak_topic = True
            except (ValueError, TypeError):
                pass

    # 2. Build Structured Query & Embed
    structured_query = build_task_rag_query(task_data)
    print(f"\n[RAG DAILY TASK]")
    print(f"Task ID   : {task_id}")
    print(f"Task      : {task_title}")
    print(f"Topic     : {topic}")
    print(f"Subtopic  : {subtopic}")
    print(f"Type      : {task_type}")
    print(f"Budget    : {task_budget_minutes} mins")
    print(f"User Level: {user_level}")
    print(f"RAG Query : {structured_query}")

    query_embedding = model.encode([structured_query], normalize_embeddings=True)
    search_k = min(60, index.ntotal)
    scores, indices = index.search(query_embedding, search_k)

    print(f"\n[RAG RETRIEVAL]")
    print(f"Candidates retrieved from FAISS: {len(indices[0])}")

    scored_candidates = []
    rejected_log = []

    # 3. Hard Relevance & Duration Filtering + Multi-Signal Scoring
    for score, idx in zip(scores[0], indices[0]):
        if idx < 0 or idx >= len(metadata):
            continue

        resource = metadata[idx].copy()
        r_id = str(resource.get("resource_id", ""))
        r_url = str(resource.get("url", "")).strip()
        r_title = str(resource.get("title", "")).strip()

        try:
            r_duration = float(resource.get("duration_minutes") or 0)
        except (ValueError, TypeError):
            r_duration = 30

        # Hard Filter 1: Valid URL & Title
        if not r_url or not r_title:
            rejected_log.append((r_title or r_id, "Missing URL or Title"))
            continue

        # Hard Filter 2: Strict Duration Compatibility
        # System must never recommend a 60-90 min video for a 30-45 min task
        if r_duration > task_budget_minutes:
            rejected_log.append((r_title, f"Duration {r_duration}m exceeds task budget {task_budget_minutes}m"))
            continue

        # Semantic Score (Normalized to 0..1 range)
        semantic_score = max(0.0, min(1.0, float(score)))

        # Topic & Subtopic Scores
        topic_score, subtopic_score, task_match_score = calculate_topic_subtopic_scores(
            resource, topic, subtopic, task_title
        )

        # Hard Filter 3: Minimum Topic Relevance Threshold
        # Reject resources that have 0 topic/subtopic match and weak semantic similarity
        if topic_score < 0.20 and subtopic_score < 0.20 and semantic_score < 0.35:
            rejected_log.append((r_title, "No meaningful topic or subtopic relevance"))
            continue

        # Task Type Suitability
        type_score = calculate_task_type_score(resource, task_type)

        # Difficulty Suitability
        diff_score = calculate_difficulty_score(resource.get("level"), user_level)

        # Duration Compatibility Score
        duration_fit_score = calculate_duration_fit(r_duration, task_budget_minutes)

        # Quality Score
        try:
            raw_qual = float(resource.get("quality_score") or 70.0)
            quality_score = min(1.0, max(0.0, raw_qual / 100.0))
        except (ValueError, TypeError):
            quality_score = 0.70

        # Weighted Final Score (dominant on semantic, topic, subtopic)
        final_score = (
            semantic_score * 0.35
            + topic_score * 0.20
            + subtopic_score * 0.15
            + task_match_score * 0.10
            + diff_score * 0.05
            + type_score * 0.05
            + duration_fit_score * 0.05
            + quality_score * 0.05
        )

        # Weak Area Learning Personalization Bonus
        if is_weak_topic:
            final_score += 0.05

        # Personalization Score if present in dataset
        if personalized_scores and r_id in personalized_scores:
            p_score = float(personalized_scores[r_id])
            final_score = (final_score * 0.90) + (p_score * 0.10)

        # Repetition Penalties
        if r_id in week_ids:
            final_score *= 0.50  # -50% same week penalty
        elif r_id in history_ids:
            final_score *= 0.70  # -30% recently used penalty

        relevance_reason = (
            f"Matches topic '{topic}' and subtopic '{subtopic}' at {user_level} level. "
            f"Duration ({int(r_duration)} min) fits within task budget ({task_budget_minutes} min)."
        )
        if is_weak_topic:
            relevance_reason += " (Personalized boost for quiz weak-area remediation)"

        scored_candidates.append({
            "resource_id": r_id,
            "title": r_title,
            "url": r_url,
            "platform": resource.get("channel") or "YouTube",
            "resource_type": "VIDEO",
            "topic": resource.get("topic") or topic,
            "subtopic": resource.get("subtopic") or subtopic,
            "difficulty": resource.get("level") or task_difficulty,
            "duration_minutes": int(r_duration),
            "task_id": task_id,
            "task_budget_minutes": task_budget_minutes,
            "duration_fit_score": round(duration_fit_score, 4),
            "relevance_score": round(max(semantic_score, (topic_score + subtopic_score) / 2), 4),
            "final_score": round(final_score, 4),
            "relevance_reason": relevance_reason,
            "selected_segment": None,
            "is_official": False
        })

    # Sort Candidates by Final Score Descending
    scored_candidates.sort(key=lambda x: x["final_score"], reverse=True)

    print(f"\n[RAG FILTER]")
    print(f"Accepted candidate pool: {len(scored_candidates)}")
    print(f"Rejected candidates: {len(rejected_log)}")
    if rejected_log[:3]:
        for r_t, reason in rejected_log[:3]:
            print(f"  - Rejected: {r_t[:40]} | Reason: {reason}")

    # 4. Resource Budget Packing (Greedy Multi-Resource Allocation <= task_budget_minutes)
    accepted_resources = []
    accumulated_minutes = 0

    # Hard threshold: minimum score to be accepted
    MIN_SCORE_THRESHOLD = 0.28

    for cand in scored_candidates:
        if cand["final_score"] < MIN_SCORE_THRESHOLD:
            continue

        cand_dur = cand["duration_minutes"]
        if accumulated_minutes + cand_dur <= task_budget_minutes:
            cand["category_label"] = "PRIMARY" if len(accepted_resources) == 0 else (
                "ALTERNATIVE" if len(accepted_resources) == 1 else "PRACTICE"
            )
            accepted_resources.append(cand)
            accumulated_minutes += cand_dur

            if len(accepted_resources) >= max(1, top_k):
                break

    print(f"\n[RAG FINAL]")
    print(f"Selected resources count: {len(accepted_resources)}")
    print(f"Total selected duration : {accumulated_minutes} / {task_budget_minutes} mins")
    for idx, r in enumerate(accepted_resources, start=1):
        print(f"  {idx}. [{r['category_label']}] {r['title']} ({r['duration_minutes']}m) | Score: {r['final_score']}")

    return accepted_resources


# ============================================================
# COMMAND LINE TESTING
# ============================================================

def main():

    print("=" * 80)
    print("PLACIFY - HYBRID RETRIEVAL TEST")
    print("=" * 80)


    # --------------------------------------------------------
    # Load FAISS
    # --------------------------------------------------------

    print(
        "\nLoading FAISS index..."
    )

    if not os.path.exists(
        FAISS_INDEX_PATH
    ):

        raise FileNotFoundError(
            f"FAISS index not found:\n"
            f"{FAISS_INDEX_PATH}"
        )

    index = faiss.read_index(
        FAISS_INDEX_PATH
    )

    print(
        f"FAISS index loaded: "
        f"{index.ntotal} vectors"
    )


    # --------------------------------------------------------
    # Load metadata
    # --------------------------------------------------------

    print(
        "\nLoading metadata..."
    )

    metadata = load_metadata()

    print(
        f"Metadata loaded: "
        f"{len(metadata)} records"
    )


    # --------------------------------------------------------
    # Load embedding model
    # --------------------------------------------------------

    print(
        "\nLoading embedding model..."
    )

    model = SentenceTransformer(
        EMBEDDING_MODEL
    )

    print(
        f"Embedding model loaded: "
        f"{EMBEDDING_MODEL}"
    )


    # --------------------------------------------------------
    # Query loop
    # --------------------------------------------------------

    while True:

        query = input(
            "\nEnter your learning query "
            "(or type 'exit'): "
        ).strip()


        if query.lower() == "exit":

            print(
                "\nExiting..."
            )

            break


        if not query:

            print(
                "Please enter a query."
            )

            continue


        # ----------------------------------------------------
        # Retrieve
        # ----------------------------------------------------

        results = retrieve(
            query,
            index,
            metadata,
            model
        )


        # ----------------------------------------------------
        # Display results
        # ----------------------------------------------------

        print(
            "\nTop recommendations:"
        )

        print("-" * 80)


        for rank, resource in enumerate(
            results,
            start=1
        ):

            title = resource.get(
                "title",
                "Unknown"
            )

            topic = resource.get(
                "topic",
                "Unknown"
            )

            subtopic = resource.get(
                "subtopic",
                "None"
            )

            level = resource.get(
                "level",
                "Unknown"
            )

            language = resource.get(
                "language",
                "Unknown"
            )

            semantic_score = resource.get(
                "semantic_score",
                0.0
            )

            hybrid_score = resource.get(
                "hybrid_score",
                0.0
            )

            url = resource.get(
                "url",
                ""
            )


            print(
                f"\n{rank}. {title}"
            )

            print(
                f"   Topic: {topic}"
            )

            print(
                f"   Subtopics: {subtopic}"
            )

            print(
                f"   Level: {level}"
            )

            print(
                f"   Language: {language}"
            )

            print(
                f"   Semantic Score: "
                f"{semantic_score:.4f}"
            )

            print(
                f"   Hybrid Score: "
                f"{hybrid_score:.4f}"
            )

            print(
                f"   URL: {url}"
            )


        print(
            "\n" + "-" * 80
        )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()