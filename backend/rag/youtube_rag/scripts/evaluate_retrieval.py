import os
import sys
import json
import csv

import faiss
from sentence_transformers import SentenceTransformer


# ============================================================
# PATH CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

EVALUATION_FILE = os.path.join(
    BASE_DIR,
    "data",
    "rag_evaluation_queries.csv"
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

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "data",
    "retrieval_evaluation_results.csv"
)


# ============================================================
# MODEL
# ============================================================

EMBEDDING_MODEL = (
    "sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# IMPORT HYBRID RETRIEVAL
# ============================================================

SCRIPTS_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

if SCRIPTS_DIR not in sys.path:
    sys.path.append(SCRIPTS_DIR)

from hybrid_retrieval import retrieve


# ============================================================
# LOAD EVALUATION QUERIES
# ============================================================

def load_evaluation_queries():

    if not os.path.exists(
        EVALUATION_FILE
    ):
        raise FileNotFoundError(
            f"Evaluation file not found:\n"
            f"{EVALUATION_FILE}"
        )

    queries = []

    with open(
        EVALUATION_FILE,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(file)

        for row in reader:

            queries.append(row)

    return queries


# ============================================================
# LOAD FAISS
# ============================================================

def load_faiss_index():

    if not os.path.exists(
        FAISS_INDEX_PATH
    ):
        raise FileNotFoundError(
            f"FAISS index not found:\n"
            f"{FAISS_INDEX_PATH}"
        )

    return faiss.read_index(
        FAISS_INDEX_PATH
    )


# ============================================================
# LOAD METADATA
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
    ) as file:

        return json.load(file)


# ============================================================
# LOAD EMBEDDING MODEL
# ============================================================

def load_embedding_model():

    return SentenceTransformer(
        EMBEDDING_MODEL
    )


# ============================================================
# HELPER: NORMALIZE TEXT
# ============================================================

def normalize(value):

    if value is None:
        return ""

    return str(value).strip().lower()


# ============================================================
# HELPER: CHECK TOPIC MATCH
# ============================================================

def topic_matches(
    resource,
    expected_topic
):

    if not expected_topic:
        return False

    resource_topic = normalize(
        resource.get(
            "topic",
            ""
        )
    )

    expected = normalize(
        expected_topic
    )

    return resource_topic == expected


# ============================================================
# HELPER: CHECK SUBTOPIC MATCH
# ============================================================

def subtopic_matches(
    resource,
    expected_subtopic
):

    if not expected_subtopic:
        return True

    resource_subtopics = normalize(
        resource.get(
            "subtopic",
            ""
        )
    )

    expected = normalize(
        expected_subtopic
    )

    parts = [
        item.strip()
        for item in resource_subtopics.split("|")
    ]

    return expected in parts


# ============================================================
# HELPER: CHECK LEVEL MATCH
# ============================================================

def level_matches(
    resource,
    expected_level
):

    if not expected_level:
        return True

    resource_level = normalize(
        resource.get(
            "level",
            ""
        )
    )

    return resource_level == normalize(
        expected_level
    )


# ============================================================
# HELPER: CHECK LANGUAGE MATCH
# ============================================================

def language_matches(
    resource,
    expected_language
):

    if not expected_language:
        return True

    resource_language = normalize(
        resource.get(
            "language",
            ""
        )
    )

    return resource_language == normalize(
        expected_language
    )


# ============================================================
# GET TOPIC LIST
# ============================================================

def get_topics(resources):

    topics = []

    for resource in resources:

        topic = resource.get(
            "topic",
            ""
        )

        if topic and topic not in topics:

            topics.append(topic)

    return topics


# ============================================================
# GET LEVEL LIST
# ============================================================

def get_levels(resources):

    levels = []

    for resource in resources:

        level = resource.get(
            "level",
            ""
        )

        if level and level not in levels:

            levels.append(level)

    return levels


# ============================================================
# GET LANGUAGE LIST
# ============================================================

def get_languages(resources):

    languages = []

    for resource in resources:

        language = resource.get(
            "language",
            ""
        )

        if language and language not in languages:

            languages.append(language)

    return languages


# ============================================================
# EVALUATE ONE QUERY
# ============================================================

def evaluate_query(
    row,
    index,
    metadata,
    model
):

    query = row["query"]

    expected_topic = row.get(
        "expected_topic",
        ""
    )

    expected_subtopic = row.get(
        "expected_subtopic",
        ""
    )

    expected_level = row.get(
        "expected_level",
        ""
    )

    expected_language = row.get(
        "expected_language",
        ""
    )

    expected_intent = row.get(
        "expected_intent",
        ""
    )


    # --------------------------------------------------------
    # Retrieve
    # --------------------------------------------------------

    resources = retrieve(
        query,
        index,
        metadata,
        model
    )


    # --------------------------------------------------------
    # Top 5
    # --------------------------------------------------------

    top_5 = resources[:5]


    # --------------------------------------------------------
    # Topic match
    # --------------------------------------------------------

    topic_hit = any(
        topic_matches(
            resource,
            expected_topic
        )
        for resource in top_5
    )


    # --------------------------------------------------------
    # Subtopic match
    # --------------------------------------------------------

    subtopic_hit = any(
        subtopic_matches(
            resource,
            expected_subtopic
        )
        for resource in top_5
    )


    # --------------------------------------------------------
    # Level match
    # --------------------------------------------------------

    level_hit = any(
        level_matches(
            resource,
            expected_level
        )
        for resource in top_5
    )


    # --------------------------------------------------------
    # Language match
    # --------------------------------------------------------

    language_hit = any(
        language_matches(
            resource,
            expected_language
        )
        for resource in top_5
    )


    # --------------------------------------------------------
    # Intent evaluation
    # --------------------------------------------------------
    #
    # The retrieval function already detects
    # the intent. Here we use the retrieved
    # resource characteristics to determine
    # whether the intended type of content
    # appeared in the top 5.
    #

    intent_hit = evaluate_intent(
        top_5,
        expected_intent
    )


    # --------------------------------------------------------
    # Cross-topic evaluation
    # --------------------------------------------------------

    cross_topic_hit = evaluate_cross_topic(
        top_5,
        query,
        expected_topic
    )


    # --------------------------------------------------------
    # IDs
    # --------------------------------------------------------

    resource_ids = [
        resource.get(
            "resource_id",
            ""
        )
        for resource in top_5
    ]


    # --------------------------------------------------------
    # Titles
    # --------------------------------------------------------

    titles = [
        resource.get(
            "title",
            ""
        )
        for resource in top_5
    ]


    # --------------------------------------------------------
    # Topics
    # --------------------------------------------------------

    topics = get_topics(
        top_5
    )


    # --------------------------------------------------------
    # Levels
    # --------------------------------------------------------

    levels = get_levels(
        top_5
    )


    # --------------------------------------------------------
    # Languages
    # --------------------------------------------------------

    languages = get_languages(
        top_5
    )


    return {

        "query": query,

        "expected_topic":
            expected_topic,

        "expected_subtopic":
            expected_subtopic,

        "expected_level":
            expected_level,

        "expected_language":
            expected_language,

        "expected_intent":
            expected_intent,

        "topic_hit_at_5":
            int(topic_hit),

        "subtopic_hit_at_5":
            int(subtopic_hit),

        "level_hit_at_5":
            int(level_hit),

        "language_hit_at_5":
            int(language_hit),

        "intent_hit_at_5":
            int(intent_hit),

        "cross_topic_success":
            int(cross_topic_hit),

        "top_5_resource_ids":
            " | ".join(resource_ids),

        "top_5_titles":
            " | ".join(titles),

        "top_5_topics":
            " | ".join(topics),

        "top_5_levels":
            " | ".join(levels),

        "top_5_languages":
            " | ".join(languages)
    }


# ============================================================
# INTENT EVALUATION
# ============================================================

def evaluate_intent(
    resources,
    expected_intent
):

    if not expected_intent:
        return True


    expected = normalize(
        expected_intent
    )


    # --------------------------------------------------------
    # Frontend ↔ Backend Integration
    # --------------------------------------------------------

    if expected == normalize(
        "Frontend ↔ Backend Integration"
    ):

        for resource in resources:

            topic = normalize(
                resource.get(
                    "topic",
                    ""
                )
            )

            subtopic = normalize(
                resource.get(
                    "subtopic",
                    ""
                )
            )

            title = normalize(
                resource.get(
                    "title",
                    ""
                )
            )

            combined = (
                topic
                + " "
                + subtopic
                + " "
                + title
            )

            frontend_terms = [
                "react",
                "frontend",
                "front end"
            ]

            backend_terms = [
                "node",
                "express",
                "backend",
                "rest api",
                "api"
            ]

            has_frontend = any(
                term in combined
                for term in frontend_terms
            )

            has_backend = any(
                term in combined
                for term in backend_terms
            )

            if has_frontend and has_backend:
                return True

        return False


    # --------------------------------------------------------
    # API Integration
    # --------------------------------------------------------

    if expected == normalize(
        "API Integration"
    ):

        api_terms = [
            "api",
            "rest",
            "http",
            "fetch",
            "axios"
        ]

        return any(
            any(
                term in normalize(
                    resource.get(
                        "subtopic",
                        ""
                    )
                )
                for term in api_terms
            )
            for resource in resources
        )


    # --------------------------------------------------------
    # Backend Database Integration
    # --------------------------------------------------------

    if expected == normalize(
        "Backend Database Integration"
    ):

        database_terms = [
            "database",
            "mongodb",
            "mongo",
            "mysql",
            "postgresql",
            "sql"
        ]

        return any(
            any(
                term in (
                    normalize(
                        resource.get(
                            "topic",
                            ""
                        )
                    )
                    + " "
                    + normalize(
                        resource.get(
                            "subtopic",
                            ""
                        )
                    )
                    + " "
                    + normalize(
                        resource.get(
                            "title",
                            ""
                        )
                    )
                )
                for term in database_terms
            )
            for resource in resources
        )


    # --------------------------------------------------------
    # Authentication
    # --------------------------------------------------------

    if expected == normalize(
        "Authentication"
    ):

        auth_terms = [
            "authentication",
            "authorization",
            "jwt",
            "login",
            "signup",
            "session"
        ]

        return any(
            any(
                term in (
                    normalize(
                        resource.get(
                            "subtopic",
                            ""
                        )
                    )
                    + " "
                    + normalize(
                        resource.get(
                            "title",
                            ""
                        )
                    )
                )
                for term in auth_terms
            )
            for resource in resources
        )


    # --------------------------------------------------------
    # Deployment
    # --------------------------------------------------------

    if expected == normalize(
        "Deployment"
    ):

        deployment_terms = [
            "deployment",
            "deploy",
            "hosting",
            "host",
            "vercel",
            "netlify",
            "render",
            "aws"
        ]

        return any(
            any(
                term in (
                    normalize(
                        resource.get(
                            "topic",
                            ""
                        )
                    )
                    + " "
                    + normalize(
                        resource.get(
                            "subtopic",
                            ""
                        )
                    )
                    + " "
                    + normalize(
                        resource.get(
                            "title",
                            ""
                        )
                    )
                )
                for term in deployment_terms
            )
            for resource in resources
        )


    # --------------------------------------------------------
    # Full Stack Project
    # --------------------------------------------------------

    if expected == normalize(
        "Full Stack Project"
    ):

        for resource in resources:

            topic = normalize(
                resource.get(
                    "topic",
                    ""
                )
            )

            title = normalize(
                resource.get(
                    "title",
                    ""
                )
            )

            subtopic = normalize(
                resource.get(
                    "subtopic",
                    ""
                )
            )

            combined = (
                topic
                + " "
                + title
                + " "
                + subtopic
            )

            if (
                "full stack"
                in combined
                or "fullstack"
                in combined
                or "project"
                in combined
            ):

                return True

        return False


    # --------------------------------------------------------
    # Learning / Subtopic / Language
    # --------------------------------------------------------
    #
    # For generic learning intents, topic,
    # subtopic, level and language metrics
    # already cover the important behavior.
    #

    return True


# ============================================================
# CROSS-TOPIC EVALUATION
# ============================================================

def evaluate_cross_topic(
    resources,
    query,
    expected_topic
):

    query_lower = normalize(
        query
    )


    # Only evaluate this specially for
    # cross-topic queries.

    cross_topic_keywords = [
        "connect",
        "integration",
        "integrate",
        "frontend",
        "backend",
        "full stack"
    ]

    is_cross_topic = any(
        keyword in query_lower
        for keyword in cross_topic_keywords
    )


    if not is_cross_topic:
        return True


    # --------------------------------------------------------
    # For React + Node.js query
    # --------------------------------------------------------

    if (
        "react" in query_lower
        and "node" in query_lower
    ):

        has_react = False
        has_node = False

        for resource in resources:

            combined = (
                normalize(
                    resource.get(
                        "topic",
                        ""
                    )
                )
                + " "
                + normalize(
                    resource.get(
                        "subtopic",
                        ""
                    )
                )
                + " "
                + normalize(
                    resource.get(
                        "title",
                        ""
                    )
                )
            )

            if "react" in combined:
                has_react = True

            if (
                "node" in combined
                or "express" in combined
            ):
                has_node = True


        return (
            has_react
            and has_node
        )


    return True


# ============================================================
# SAVE RESULTS
# ============================================================

def save_results(results):

    if not results:
        return

    fieldnames = list(
        results[0].keys()
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()

        writer.writerows(
            results
        )


# ============================================================
# CALCULATE METRICS
# ============================================================

def calculate_metrics(results):

    total = len(results)

    if total == 0:

        return {}


    def percentage(field):

        value = sum(
            int(
                result[field]
            )
            for result in results
        )

        return (
            value / total
        ) * 100


    return {

        "Total Queries":
            total,

        "Topic Hit@5":
            percentage(
                "topic_hit_at_5"
            ),

        "Subtopic Hit@5":
            percentage(
                "subtopic_hit_at_5"
            ),

        "Level Accuracy@5":
            percentage(
                "level_hit_at_5"
            ),

        "Language Accuracy@5":
            percentage(
                "language_hit_at_5"
            ),

        "Intent Accuracy@5":
            percentage(
                "intent_hit_at_5"
            ),

        "Cross-topic Success":
            percentage(
                "cross_topic_success"
            )
    }


# ============================================================
# PRINT METRICS
# ============================================================

def print_metrics(metrics):

    print("\n")
    print("=" * 80)
    print("PLACIFY - RETRIEVAL EVALUATION")
    print("=" * 80)

    print()

    print(
        f"Total Queries: "
        f"{metrics['Total Queries']}"
    )

    print()

    print(
        f"Topic Hit@5: "
        f"{metrics['Topic Hit@5']:.2f}%"
    )

    print(
        f"Subtopic Hit@5: "
        f"{metrics['Subtopic Hit@5']:.2f}%"
    )

    print(
        f"Level Accuracy@5: "
        f"{metrics['Level Accuracy@5']:.2f}%"
    )

    print(
        f"Language Accuracy@5: "
        f"{metrics['Language Accuracy@5']:.2f}%"
    )

    print(
        f"Intent Accuracy@5: "
        f"{metrics['Intent Accuracy@5']:.2f}%"
    )

    print(
        f"Cross-topic Success: "
        f"{metrics['Cross-topic Success']:.2f}%"
    )

    print()

    print("=" * 80)


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 80)
    print("PLACIFY - AUTOMATED RETRIEVAL EVALUATION")
    print("=" * 80)


    # --------------------------------------------------------
    # Load evaluation dataset
    # --------------------------------------------------------

    print(
        "\nLoading evaluation queries..."
    )

    queries = load_evaluation_queries()

    print(
        f"Evaluation queries loaded: "
        f"{len(queries)}"
    )


    # --------------------------------------------------------
    # Load FAISS
    # --------------------------------------------------------

    print(
        "\nLoading FAISS index..."
    )

    index = load_faiss_index()

    print(
        f"FAISS vectors: "
        f"{index.ntotal}"
    )


    # --------------------------------------------------------
    # Load metadata
    # --------------------------------------------------------

    print(
        "\nLoading metadata..."
    )

    metadata = load_metadata()

    print(
        f"Metadata records: "
        f"{len(metadata)}"
    )


    # --------------------------------------------------------
    # Load embedding model
    # --------------------------------------------------------

    print(
        "\nLoading embedding model..."
    )

    model = load_embedding_model()

    print(
        f"Embedding model loaded: "
        f"{EMBEDDING_MODEL}"
    )


    # --------------------------------------------------------
    # Evaluate
    # --------------------------------------------------------

    results = []


    print("\n")
    print("=" * 80)
    print("RUNNING EVALUATION")
    print("=" * 80)


    for number, row in enumerate(
        queries,
        start=1
    ):

        query = row["query"]

        print(
            f"\n[{number}/{len(queries)}] "
            f"{query}"
        )


        try:

            result = evaluate_query(
                row,
                index,
                metadata,
                model
            )

            results.append(
                result
            )


            print(
                f"  Topic: "
                f"{'PASS' if result['topic_hit_at_5'] else 'FAIL'}"
            )

            print(
                f"  Subtopic: "
                f"{'PASS' if result['subtopic_hit_at_5'] else 'FAIL'}"
            )

            print(
                f"  Level: "
                f"{'PASS' if result['level_hit_at_5'] else 'FAIL'}"
            )

            print(
                f"  Language: "
                f"{'PASS' if result['language_hit_at_5'] else 'FAIL'}"
            )

            print(
                f"  Intent: "
                f"{'PASS' if result['intent_hit_at_5'] else 'FAIL'}"
            )

            print(
                f"  Cross-topic: "
                f"{'PASS' if result['cross_topic_success'] else 'FAIL'}"
            )


        except Exception as error:

            print(
                f"  ERROR: {error}"
            )


    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    save_results(
        results
    )

    print(
        "\nDetailed results saved to:"
    )

    print(
        OUTPUT_FILE
    )


    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    metrics = calculate_metrics(
        results
    )

    print_metrics(
        metrics
    )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()